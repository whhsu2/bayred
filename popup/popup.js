var newFeatures = false;

var $loginButton = $("#login");
var $loginInfo = $("#login-info");
var $settingsButton = $("#settings");
var $settingsLink = $("#settings-link");
var $startButton = $("#start");
var $startInfo = $("#start-info");
var $stopButton = $("#stop");
var $newFeaturesBanner = $('#new-features-banner');
var $popupVersion = $('#popup-version');

function showLoginInButton() {
  $loginInfo.show();
  $loginButton.show().click(function() {
    chrome.runtime.sendMessage({action: "open_options_page"});
  });
}

function initTimer(sessionData) {
  $('#timer').show();
}

function initPopupContent(homelutenEnabled, newFeatures) {
  // show new feature banner and set flag to false
  if (newFeatures) {
    $newFeaturesBanner.show();
  }

  if (homelutenEnabled) {
    initTimer();
    $stopButton.show();
  } else {
    $startInfo.show();
    $startButton.show();
  }

  var manifestData = chrome.runtime.getManifest();

  // show version and new banner if recent update
  // dismiss new banner if link clicked
  $popupVersion.append(`${manifestData.version} - <a id="homeluten-change-log" href="https://homeluten.page.link/change-log" target="_blank" rel="noopener noreferrer">What's New</a>`);
  $('#homeluten-change-log').click(function() {
    if (newFeatures) {
      chrome.storage.sync.set({
        newFeatures: false
      });
    }
  });
}

// Handle button clicks and state change
$startButton.click(async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function([tab]) {
    chrome.runtime.sendMessage({
      action: "start_button_clicked",
      tab: tab
    });

    $startInfo.hide();
    $startButton.hide();
    initTimer();
    $stopButton.show();
  });
});

$stopButton.click(async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function([tab]) {
    chrome.runtime.sendMessage({
      action: "stop_button_clicked",
      tab: tab
    });

    $stopButton.hide();
    $startButton.show();
  });
});

// popup CTA button
$settingsButton.click(function() {
  chrome.tabs.create({url: 'https://homeluten.page.link/first-impression', active: true});
});

// popup settings link (top-right)
$settingsLink.click(function() {
  chrome.runtime.sendMessage({action: "open_options_page"});
});

function checkMerchantSupport(url) {
  var hostname = new URL(url).hostname;

  if (/redfin.com/g.test(hostname) ||
      /zillow.com/g.test(hostname) ||
      /realtor.com/g.test(hostname)) {
    return true;
  }
}

// Main entry of the function
function main() {
  chrome.storage.sync.get({
    userEmail: '',
    auth: false,
    homelutenEnabled: false,
    newFeatures: false
  }, function(userData) {
    newFeatures = userData.newFeatures;
    // if (userData.userEmail) {
      // @userData.newFeatures: new feature banner flag
      initPopupContent(userData.homelutenEnabled, userData.newFeatures);
    // } else {
    //   showLoginInButton();
    // }
  });
}

// Main entry point
// activeTab permission required to checkMerchantSupport()
chrome.tabs.query({ active: true, currentWindow: true }, function([tab]) {
  if (checkMerchantSupport(tab.url)) {
    main();
  } else {
    // render not supported message
    $('#not-supported').show();
    $settingsButton.show();
  }
});