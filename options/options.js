// tooltip helpers, this runs before any detach functions
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

function showStatusBar(text, type) {
  var status = document.getElementById('status');

  if (text) {
    status.innerHTML = text;
  }

  if (type == 'error') {
    status.classList.remove('alert-success');
    status.classList.add('alert-danger');
  } else if (type == 'success') {
    status.classList.remove('alert-danger');
    status.classList.add('alert-success');
  }

  status.style.visibility = 'visible';
  setTimeout(function() {
    status.style.visibility = 'hidden';
  }, 5000);
}

function showSpinner(elementString) {
  $(elementString).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading ...');
}

function hideSpinner(elementString) {
  $(elementString).html('Submit');
}

function logoutUser() {
  chrome.storage.sync.get({
    dateInstalled: Date.now()
  }, function(extensionData) {
    $('#settings').remove()
    chrome.storage.local.clear()
    chrome.storage.sync.clear()

    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      chrome.storage.sync.set({
        homelutenEnabled: true,
        dateInstalled: extensionData.dateInstalled
      }, function() {
        location.reload()
      });
    }).catch((error) => {
      // An error happened.
      location.reload()
    });
  });
}

// Restores options state using the preferences
// stored in chrome.storage, if user exist, pull user sub from remote
function restore_options() {
  // wait for user login
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      chrome.storage.sync.get({
        newFeatures: false,
        subscriptions: undefined,
        homelutenPro: 0
      }, function(userData) {
        $('#login').remove();
        $('#login-code').remove();

        db.collection('users').doc(user.uid)
          .get()
          .then((doc) => {
            chrome.storage.sync.set({
              subscriptions: doc.data().subscriptions,
              homelutenPro: doc.data().subscriptions?.homelutenPro?.expiresAt?.toMillis(),
              userEmail: user.uid,
              proReviewPromoClaimed: doc.data().proReviewPromoClaimed
            }, function() {
              userData.homelutenPro = doc.data().subscriptions?.homelutenPro?.expiresAt?.toMillis();
              userData.subscriptions = doc.data().subscriptions
              userData.userEmail = user.uid
              userData.proReviewPromoClaimed = doc.data().proReviewPromoClaimed

              initSettings(doc.data().subscriptions, userData);
            });
          })
          .catch((error) => {
            showStatusBar('Error fetching data, please refresh the page and try again.' + error, 'error');
          });
      });
    } else {
      // User is signed out
      loginDOM.insertAfter('#status').show();
    }
  });
}

function initCard(card, userData) {
  card.find('.card-img-top').removeClass('locked');
  card.find('button.unlock').remove();
  card.find('input.cvv').removeAttr('disabled');
  card.find('input.switch').removeAttr('disabled');
  card.find('button[data-bs-toggle=modal]').show();

  // pro features with guard
  if (validProMembership(userData)) {
    card.find('.pro-feature').removeAttr('disabled');
    card.find('.pro-upsell').remove();
  }
}

// sync subscriptions, then show settings page
// note: subscriptions can be undefined
function initSettings(subscriptions = {}, userData = {}) {
  for (var sub in subscriptions || {}) {
    // only load active subs
    if (subscriptions[sub].expiresAt?.toMillis() > Date.now()) {
      var card = settingsDOM.find(`#${sub}`);
      initCard(card, userData);
      card.find('form.billing').append(`<input type="hidden" name="customerId" value="${subscriptions[sub]?.customerId}" />`);

      // set local pro to true
      if (sub == 'homelutenPro') {
        settingsDOM.find('#pro-expiration').text(new Date(subscriptions[sub].expiresAt?.toMillis() - 86400000).toLocaleString());
        chrome.storage.sync.set({
          homelutenPro: subscriptions[sub].expiresAt?.toMillis()
        });
      }
    }
  }

  // limited time free access: load card if free
  var limitedTimeFreeAccess = JSON.parse(remoteConfig.getValue('limited_time_free_access').asString() || "{}")
  var limitedTimeFreeAccessMessage = remoteConfig.getValue('limited_time_free_access_message').asString()

  for (var sub in limitedTimeFreeAccess) {
    // skip active sub
    if (!limitedTimeFreeAccess[sub] || (subscriptions && sub in subscriptions && subscriptions[sub].expiresAt?.toMillis() > Date.now())) {
      continue;
    }

    var card = settingsDOM.find(`#${sub}`);
    initCard(card, userData);
    card.find('span.limited-time-free-access').css('display', 'inline').text(limitedTimeFreeAccessMessage)
    card.find('form.billing button').prop('disabled', true).text(limitedTimeFreeAccessMessage)
  }

  // restore stored configs
  settingsDOM.find('#user-email').text(userData.userEmail);
  settingsDOM.insertAfter('#status');

  handleOptionsCTA(userData)
}

function login(event) {
  event.preventDefault();

  var userEmail = document.getElementById('email-input').value?.toLowerCase();
  if (!userEmail) {
    throw 'Error, empty email address provided. Please refresh the page and try again';
  }

  showSpinner('#login-btn')
  $('#login-btn').prop('disabled', true)

  $.post({
    url: `https://us-central1-homeluten.cloudfunctions.net/login`,
    data: {userEmail},
    success: function(data) {
      showStatusBar('Login code sent to ' + userEmail)
      $('#login').hide()
      loginCodeDOM.insertAfter('#status').show()
    },
    error: handleAjaxTimeout,
    timeout: 30000
  });
}

function loginCode(event) {
  event.preventDefault();

  var userEmail = document.getElementById('email-input').value?.toLowerCase();
  var loginCode = document.getElementById('login-code-input').value;

  if (!loginCode || !userEmail) {
    showStatusBar('Invalid user email or login code. Please refresh the page and try again', 'error')
    return
  }

  showSpinner('#login-code-btn');
  $('#login-code-btn').prop('disabled', true)

  $.post({
    url: `https://us-central1-homeluten.cloudfunctions.net/auth`,
    data: {
      userEmail: userEmail,
      authCode: loginCode
    },
    success: function(data) {
      if (data.error == 'invalid_login_code') {
        showStatusBar('Invalid login code, please make sure you use the latest one you received in the email.', 'error')

        $('#login-code-btn').prop('disabled', false).text('Submit')
        return
      }

      // sign in with the jwt token
      return firebase.auth().signInWithCustomToken(data.token)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user
        return user.updateEmail(userEmail).then(() => {
          location.reload()
        })
      })
      .catch((error) => {
        showStatusBar('Unexpected error during login. Please refresh the page and try again. ' + error.message, 'error')
      });
    },
    error: handleAjaxTimeout,
    timeout: 30000
  });
}

function handleOptionsCTA(userData) {
  // trigger link if came from Pro modal, otherwise don't trigger
  chrome.runtime.sendMessage({
    ask: "should_trigger_option_page_action"
  }, function(response) {
    if (response.shouldTriggerPro) {
      $('button.unlock').click();
    } else if (response.shouldTriggerLoginRedirect) {
      // select context tab, then refresh
      chrome.tabs.reload(response.loginRedirectUrl)
      chrome.tabs.update(response.loginRedirectUrl, {selected: true})
    } else if (response.shouldTriggerProPromo) {
      // open review page
      chrome.tabs.create({url: "https://chrome.google.com/webstore/detail/dmlmenebejdemdbmgldkpckfbmijlchh/reviews", active: true })

      // validate server side flags to make sure promo is only claimed once per account
      if (!userData.proReviewPromoClaimed && !userData.homelutenPro) {
        // activate Pro
        $('#promo-modal').modal('show')
        // update firebase user
        $.post({
          url: `https://us-central1-homeluten.cloudfunctions.net/promo`,
          data: {userEmail: userData.userEmail},
          success: function(data) {
            // no-op
          },
          error: handleAjaxTimeout,
          timeout: 30000
        });
      } else {
        // Fail if user account had promo before
        $('#promo-failed-modal').modal('show')
      }
    }
  });
}

// handle value settings for enabled cards
function handleSubscriptionClick() {
  window.open($(this).attr('href'), '_blank');
  $('#subModal').modal('show');
  $(this).prop('disabled', true).text('Refresh Page');
}

// Main entry point
chrome.runtime.sendMessage({action: 'viewOptionsPage'});

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('login').addEventListener('submit', login);
document.getElementById('login-code').addEventListener('submit', loginCode);
document.getElementById('logout').addEventListener('click', logoutUser);

// handle unlock/upsell buttons
$('button.unlock').click(handleSubscriptionClick);


loginDOM = $('#login').detach();
loginCodeDOM = $('#login-code').detach();
settingsDOM = $('#settings').detach();
