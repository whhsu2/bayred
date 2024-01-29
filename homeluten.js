var tabId = undefined
var lastUrl = undefined

var mapOptions = {
  streetViewControl: false,
  streetViewControlOptions: {
    position: 1
  },
  mapTypeControl: true,
  mapTypeControlOptions: {
    mapTypeIds: ["roadmap", "terrain", "satellite", "hybrid"],
  },
  fullscreenControl: false,
  fullscreenControlOptions: {
    position: 1
  },
  clickableIcons: true
};

// Route handler
function pageHandler(userData) {
  lastUrl = window.location.href.split('?')[0]

  if (/https:\/\/www\.redfin\.com\/.+\/\d+\/(A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|PA|RI|S[CD]|T[NX]|UT|V[AT]|W[AIVY])/g.test(window.location.href)
    || /https:\/\/www\.redfin\.com\/zipcode\/.+/g.test(window.location.href)) {
    redfinMapPageModule(userData)
  } else if (/https:\/\/www\.redfin\.com\/.+\/home\/\d+/g.test(window.location.href)) {
    listingPageModule(userData)
  } else if (/https:\/\/www\.redfin\.com\/.+\/apartment\/\d+/g.test(window.location.href)) {
    listingPageModule(userData, {isRental: true})
  } else if (/https:\/\/www\.zillow\.com\/homedetails\/.+/g.test(window.location.href)) {
    zillowListingMutationObserver(userData)
  } else if (/https:\/\/www\.zillow\.com\/b\/.+/g.test(window.location.href)) {
    zillowListingMutationObserver(userData)
  } else if (/https:\/\/www\.realtor\.com\/realestateandhomes-detail\//g.test(window.location.href)) {
    listingPageModule(userData)
    zillowListingMutationObserver(userData)
  } else {
    chrome.runtime.sendMessage({
      message: "other_page_loaded",
      url: window.location.href,
      userData: userData
    });
  }

  // Update on page URL change (for in page navigation e.g. zillow, realtor)
  if (/https:\/\/www\.zillow\.com\//g.test(window.location.href) ||
      /https:\/\/www\.realtor\.com\//g.test(window.location.href)) {
    // Listen to in-page navigation
    observeURLChange(function(url) {
      // skip if only param change
      url = url.split('?')[0]

      if (url == lastUrl) {
        return
      }

      lastUrl = url

      if (/https:\/\/www\.zillow\.com\/homedetails\/.+/g.test(url)
        || /https:\/\/www\.zillow\.com\/b\/.+/g.test(url)) {
        $('#homeluten-container').remove()
        zillowListingMutationObserver(userData)
      } else if (/https:\/\/www\.realtor\.com\/realestateandhomes-detail\//g.test(url)) {
        $('#homeluten-container').remove()
        listingPageModule(userData)
      // TODO: partial support for Zillow for now, let's fix it later
      // } else if (/https:\/\/www\.zillow\.com\/b\/.+/g.test(url)) {
      //   listingPageModule(userData, {isRental: true})
      } else if (/https:\/\/www\.zillow\.com\/.+/g.test(url) ||
      /https:\/\/www\.realtor\.com\/.+/g.test(url)) {
        $('#homeluten-container').remove()
      }
    })
  }
}

// Listen to lazyload DOM changes
function zillowListingMutationObserver(userData) {
  var observer = new MutationObserver(function(mutations, observer) {
    // fired when a mutation occurs
    // rental pages
    if ($('#home-detail-lightbox-container #search-detail-lightbox .RCFFlexRow').length) {
      listingPageModule(userData, {isRental: true, source: 'observer'})
      observer.disconnect()
    } else if ($('#home-detail-lightbox-container #search-detail-lightbox').length) {
      // brokerage listings
      listingPageModule(userData)
      observer.disconnect()
    }
  });

  // define what element should be observed by the observer
  // and what types of mutations trigger the callback
  observer.observe(document.getElementById('home-detail-lightbox-container'), {
    childList: true,
    subtree: true
  });
}

// main entry of the file
$(document).ready(function() {
  chrome.runtime.sendMessage({ask: "current_tab_id"}, function(response) {
    tabId = response.tabId;

    chrome.storage.sync.get({
      dateInstalled: null,
      proReviewPopup: true,
      homelutenEnabled: false,
      homelutenPro: 0,
      userEmail: null,
      newFeatures: false,
      redfin_mapSize: 0,
      redfin_mapStreetViewEnabled: false,
      redfin_mapTrafficEnabled: false,
      redfin_mapTransitEnabled: false,
      redfin_mapBikeEnabled: false,
      redfin_mapSuperfundEnabled: false,
      redfin_mapCrimeEnabled: false,
      redfin_mapCrimeHeatmapEnabled: false,
      redfin_mapNoiseHeatmapEnabled: false,
      redfin_mapSexOffenderEnabled: false,
      redfin_earthquakeFaultEnabled: false,
      redfin_mapPowerLineEnabled: false,
      redfin_mapPowerStationEnabled: false,
      redfin_mapPhoneTowerEnabled: false,
      redfin_gangEnabled: false,
      homeluten_crimeHeatmap_tk: null,
      homeluten_crimeHeatmap_tk_expiresAt: null,
      homeluten_extension_minimized: false
    }, function(userData) {
      // load configs from storage
      mapOptions.streetViewControl = userData.redfin_mapStreetViewEnabled;
      userData.mapOptions = mapOptions
      userData.tabId = tabId

      chrome.runtime.sendMessage({ask: "fetch_remote_configs"}, function(featureFlags) {
        if (userData.homelutenEnabled) {
          userData.featureFlags = featureFlags

          pageHandler(userData)
        }
      });
    });
  });
});
