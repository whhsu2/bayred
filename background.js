// background.js
var triggerProSub = false;
var triggerProPromoModal = false;
var triggerLoginRedirect = false;
var loginRedirectUrl = null;
var lastFetch = Date.now();


// helper functions
function setSessionStorage(keys, values) {
  keys.forEach(function(key, index) {
    sessionStorage.setItem(key, values[index]);
  });
}

function updateSessionStorage(key, value) {
  if (sessionStorage.getItem(key) == null) {
    var countValue = 0;
  } else {
    var countValue = sessionStorage.getItem(key);
  }
  countValue = Number(countValue);
  sessionStorage.setItem(key, ++countValue);
}

function clearSessionStorage(key) {
  sessionStorage.removeItem(key);
}


// clear local storage on start up
chrome.runtime.onStartup.addListener(function() {
  chrome.storage.local.clear()
});

// handle extension update
chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason == "install") {
    chrome.storage.sync.set({
      newFeatures: true,
      homelutenEnabled: true,
      dateInstalled: Date.now(),
      proReviewPopup: true
    });

    chrome.tabs.create({url: "https://homeluten.page.link/how-to-use"});
    chrome.tabs.create({url: "https://homeluten.page.link/first-impression", active: true});

    if (chrome.runtime.setUninstallURL) {
      chrome.runtime.setUninstallURL('https://homeluten.page.link/uninstall');
    }
  }

  if (details.reason == "update") {
    chrome.storage.sync.set({
      newFeatures: true
    });
  }
});

// message control center
// @request: {tab, merchant}, custom contructed msg from popup.action. Use sender if trying to get tab.id from originating tab
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // store tab data, so that contetnt script will read the flag and allow run
  if (request.action == "start_button_clicked") {
    chrome.storage.sync.set({
      homelutenEnabled: true
    }, function() {
      chrome.tabs.reload(request.tab.id);
    });

    ga('send', 'pageview', '/start');
  }

  if (request.action == "stop_button_clicked") {
    chrome.storage.sync.set({
      homelutenEnabled: false
    }, function() {
      chrome.tabs.reload(request.tab.id);
    });

    ga('send', 'pageview', '/stop');
  }

  if (request.action == "open_options_page") {
    chrome.runtime.openOptionsPage();

    if (request.source == 'pro_cta') {
      triggerProSub = true
    } else if (request.source == 'login_cta') {
      triggerLoginRedirect = true
      loginRedirectUrl = request.loginRedirectUrl
    } else if (request.source == 'pro_promo_cta') {
      triggerProPromoModal = true
    }

    ga('send', 'pageview', '/options');
  }

  if (request.action == "set_tab_url") {
    // sending from tab env, tab.id can be undefined which defaults to current tab
    chrome.tabs.update(undefined, { url: request.url });
  }

  if (request.action == "submit_review") {
    // add timestamp of the submission
    request.reviewData.created = firebase.firestore.FieldValue.serverTimestamp()

    firebase.auth().onAuthStateChanged((user) => {
      var listingDocRef = db.collection('listings').doc(`${request.reviewData.zipcode}_${request.reviewData.mlsId}`)

      // create the listing doc if not exist, then write submission to subcollection
      listingDocRef.set({
        lastFetched: firebase.firestore.FieldValue.serverTimestamp()
      }, {merge: true})
      .then(() => {
        // write to reviews summary view
        listingDocRef.collection('reviews').doc(request.reviewData.userEmail).set(request.reviewData, {merge: true})
        .then(() => {
          // add the just created doc as part of the workflow
          sendResponse({success: 'success'})
        })
        .catch((error) => {
          sendResponse({error: error})
        })
      })
      .catch((error) => {
        sendResponse({error: error})
      })
    })

    // keep channel open for sendResponse()
    return true
  }

  if (request.action == "fetch_review") {
    firebase.auth().onAuthStateChanged((user) => {
      db.collection('listings').doc(`${request.metaData.zipcode}_${request.metaData.mlsId}`).collection('reviews').doc(request.metaData.userEmail).get()
      .then((docRef) => {
        if (docRef.exists) {
          sendResponse({
            success: 'success',
            reviewEntry: docRef.data()
          })
        } else {
          sendResponse({
            notfound: null
          })
        }
      })
      .catch((error) => {
        sendResponse({error: error})
      })
    })

    // keep channel open for sendResponse()
    return true
  }

  // messages for data exchange
  if (request.ask == "fetch_remote_firestore") {
    // only fetch once per min
    if (Date.now() - lastFetch < 60000) {
      return
    }

    lastFetch = Date.now()

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        db.collection('users').doc(user.uid)
        .get()
        .then((doc) => {
          chrome.storage.sync.set({
            subscriptions: doc.data().subscriptions,
            homelutenPro: doc.data().subscriptions?.homelutenPro?.expiresAt?.toMillis(),
          });
        })
        .catch((error) => {
        });
      }
    });
  }

  if (request.ask == "current_tab_id") {
    sendResponse({tabId: sender.tab.id});
  }

  // send cta source context
  if (request.ask == "should_trigger_option_page_action") {
    sendResponse({
      shouldTriggerPro: triggerProSub,
      shouldTriggerProPromo: triggerProPromoModal,
      shouldTriggerLoginRedirect: triggerLoginRedirect,
      loginRedirectUrl: loginRedirectUrl
    });

    triggerProPromoModal = false
    triggerProSub = false
    triggerLoginRedirect = false
    loginRedirectUrl = null
  }

  if (request.ask == "fetch_remote_configs") {
    // fetch remote configs and activate them. Only runs here so only triggers if user is using the extension
    remoteConfig.fetchAndActivate();
    sendResponse({
      review_promo_enabled: remoteConfig.getBoolean('review_promo_enabled'),
      review_promo_free_days: remoteConfig.getNumber('review_promo_free_days'),
      first_impression_url: remoteConfig.getString('first_impression_url'),
      limited_time_free_access: JSON.parse(remoteConfig.getString('limited_time_free_access')),
      limited_time_free_access_message: remoteConfig.getString('limited_time_free_access_message')
    });
  }

  if (request.message == 'map_page_loaded') {
    ga('set', 'page', '/map');
    ga('set', 'title', request.url);
    ga('send', 'pageview');
    ga('send', 'event', 'login_status', request.userData?.userEmail ? 'Logged in' : 'Logged out', request.userData?.userEmail);
    ga('send', 'event', 'membership', request.userData?.homelutenPro ? 'Pro Member' : 'Free Member');
  }

  if (request.message == 'listing_page_loaded') {
    ga('set', 'page', '/listing');
    ga('set', 'title', request.url);
    ga('send', 'pageview');
    ga('send', 'event', 'login_status', request.userData?.userEmail ? 'Logged in' : 'Logged out', request.userData?.userEmail);
    ga('send', 'event', 'membership', request.userData?.homelutenPro ? 'Pro Member' : 'Free Member');
  }

  if (request.message == 'other_page_loaded') {
    ga('set', 'page', '/others');
    ga('set', 'title', request.url);
    ga('send', 'pageview');
    ga('send', 'event', 'login_status', request.userData?.userEmail ? 'Logged in' : 'Logged out', request.userData?.userEmail);
    ga('send', 'event', 'membership', request.userData?.homelutenPro ? 'Pro Member' : 'Free Member');
  }
});


// Standard Google Universal Analytics code
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga'); // Note: https protocol here

ga('create', 'UA-218280650-1', 'auto'); // Enter your GA identifier
ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: https://stackoverflow.com/a/22152353/1958200
ga('require', 'displayfeatures');
