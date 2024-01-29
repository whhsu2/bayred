var tooltipTriggerList = undefined;
var tooltipList = undefined;

// Access window object
var injectWindowObj = function (callback, payload) {
  function inject(fn) {
    const script = document.createElement('script')
    script.text = `(${fn.toString()})(${JSON.stringify(payload)});`
    document.documentElement.appendChild(script)
    script.remove();
  }

  inject(callback);
};

// Immediately-invoked function expression
var injectjQuery = function() {
  var s = document.createElement('script');
  s.src = chrome.runtime.getURL('lib/jquery.js');
  s.onload = function() {
    this.remove();
  };
  document.documentElement.appendChild(s);
};
injectjQuery();

function initTooltip() {
  // tooltip helpers, this runs before any detach functions
  tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

function showStatusBar(message, type) {
  var $homelutenStatus = $('#homeluten-status');

  if (!$homelutenStatus.length) {
    var HTML = `<div id="homeluten-status" class="alert alert-success" style="z-index: 9999999 !important">${message || "Homeluten Changes Applied!"}</div>`;
    $('#homeluten-container').append(HTML);
  }

  $homelutenStatus = $('#homeluten-status');
  $homelutenStatus.text(message);

  if (type == 'error') {
    $homelutenStatus.removeClass('alert-success');
    $homelutenStatus.addClass('alert-danger');
  } else if (type == 'success') {
    $homelutenStatus.removeClass('alert-danger');
    $homelutenStatus.addClass('alert-success');
  }

  $homelutenStatus.fadeIn('slow', function() {
    $(this).delay(1000).fadeOut('slow');
  });
}

function validProMembership(userData) {
  // set true for demo URL
  if (userData.featureFlags?.first_impression_url == window.location.href) {
    return true
  }

  var proExpirationMillis = userData.homelutenPro

  if (proExpirationMillis >= Date.now()) {
    return true
  } else if (userData.featureFlags?.limited_time_free_access?.homelutenPro) {
    // check if has limited free access
    $('.limited-time-free-access').removeClass('d-none').text(userData.featureFlags?.limited_time_free_access_message)
    return true
  } else if (proExpirationMillis == false) {
    return false
  } else {
    chrome.runtime.sendMessage({ask: "fetch_remote_firestore"})
    return false
  }
}

function getListingAddress(originalURL, context) {
  var url, listingID, addressRaw, addressList, zipcode, address, city, state
  url = originalURL.pathname.split('/');

  // special url handling for zillow and realtor
  if (originalURL.host == 'www.redfin.com') {
    if (context?.isRental) {
      listingID = originalURL.host + originalURL.pathname
      address = $('.NeighborhoodInfoSection .neighborhood-title').text().split('Neighborhood Info for ').pop()
      city = url[2]
      state = url[1]
      zipcode = $('.homeAddress [data-rf-test-id="abp-cityStateZip"]').text().split(' ')[2]
    } else {
      listingID = originalURL.host + originalURL.pathname;
      addressRaw = url[4] ? url[3] + ' ' + url[4] : url[3];
      addressList = addressRaw.split(' ')[0].split('-')
      zipcode = addressList.pop()
      address = addressList.join(' ')
      city = url[2];
      state = url[1];
    }
  } else if (originalURL.host == 'www.zillow.com') {
    if (context?.isRental && context?.source != 'observer') {
      addressRaw = $('[data-test-id="bdp-building-address"]').text().split(', ')
      listingID = url[3]
      address = addressRaw[0]
      city = addressRaw[1]
      state = addressRaw[2].split(' ')[0]
      zipcode = addressRaw[2].split(' ').pop()
    } else {
      addressRaw = url[2]
      addressList = addressRaw.split('-')
      listingID = url[3]
      zipcode = addressList.pop()
      address = addressList.join(' ')
    }
  } else if (originalURL.host == 'www.realtor.com') {
    addressRaw = url[2]
    addressList = addressRaw.split('_')
    listingID = addressList.pop()
    zipcode = addressList.pop()
    state = addressList.pop()
    city = addressList.pop()
    city = city.replace(/-/g, ' ')
    address = addressList.pop()
    address = address.replace(/-/g, ' ')
  }

  return {listingID, address, city, state, zipcode}
}

function handleAjaxTimeout(data, status, error){
  // show error message
  var message = undefined;

  // had to hardcode this function because it is running in window scope
  if (status == "timeout") {
    message = `Failed to load Homeluten data, connection timeout, please refresh your page or try again later.`;
  } else {
    message =`Failed to load Homeluten data, please refresh your page and try again.`;
  }

  var $homelutenStatus = $('#homeluten-ajax-status');

  if (!$homelutenStatus.length) {
    var HTML = `<div id="homeluten-ajax-status" class="alert alert-danger" style="z-index: 9999999 !important">${message || "Homeluten Changes Applied!"}</div>`;
    $('body').prepend(HTML);
  }

  $homelutenAjaxStatus = $('#homeluten-ajax-status');
  $homelutenAjaxStatus.text(message);
  $homelutenAjaxStatus.fadeIn('slow', function() {
    $(this).delay(5000).fadeOut('slow');
  });
}

function initProModal() {
  var $homelutenContainer = $('#homeluten-container')

  if (!$homelutenContainer.find('#homeluten-pro-popup').length) {
    $homelutenContainer.append(PRO_MODAL)
  }

  $homelutenContainer.find('.pro-exclusive').attr('data-bs-toggle', 'modal').attr('data-bs-target', '#homeluten-pro-popup')
  $homelutenContainer.find('#homeluten-pro-modal-button').click(function() {
    chrome.runtime.sendMessage({
      action: "open_options_page",
      source: "pro_cta"
    });
  });
}

function initLoginModal(userData) {
  var $homelutenContainer = $('#homeluten-container')

  if (!$homelutenContainer.find('#homeluten-login-popup').length) {
    $homelutenContainer.append(LOGIN_MODAL)
  }

  $homelutenContainer.find('.login-exclusive').attr('data-bs-toggle', 'modal').attr('data-bs-target', '#homeluten-login-popup')
  // bind click event
  $homelutenContainer.find('#homeluten-login-popup #homeluten-login-modal-button').click(function() {
    chrome.runtime.sendMessage({
      action: "open_options_page",
      source: "login_cta",
      loginRedirectUrl: userData.tabId
    });
  });
}

function colorCodeSuperfunds(count, idName) {
  if (count > 2) {
    $(`${idName}`).addClass(`bg-danger`);
  } else if (count > 0 && count <= 2) {
    $(`${idName} .status-number`).addClass(`text-warning`);
  }
}

function colorCodeNumber(score, idName) {
  if (score < 60) {
    $(`${idName}`).addClass(`bg-danger`);
  } else if (score >= 60 && score < 70) {
    $(`${idName} .status-number`).addClass(`text-warning`);
  } else if (score > 80) {
    $(`${idName}`).addClass(`bg-success`);
  }
}

function colorCodeText(text, idName) {
  text = text.toLowerCase()

  if (text == 'busy' || text == `true`) {
    $(`${idName}`).addClass(`bg-danger`);
  } else if (text == 'active') {
    $(`${idName} .status-number`).addClass(`text-warning`);
  }
}

function currencyFormatter(labelValue) {
  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e+9
  ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + "B"
  // Six Zeroes for Millions
  : Math.abs(Number(labelValue)) >= 1.0e+6
  ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + "M"
  // Three Zeroes for Thousands
  : Math.abs(Number(labelValue)) >= 1.0e+3
  ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + "K"
  : Math.abs(Number(labelValue));
}

function observeURLChange(callback) {
  let lastUrl = location.href
  new MutationObserver(() => {
    const url = location.href
    if (url !== lastUrl) {
      lastUrl = url
      onUrlChange(url)
    }
  }).observe(document, {subtree: true, childList: true})


  function onUrlChange(url) {
    callback(url)
  }
}

function showProReviewPromo(userData) {
  // pro review promo trigger after 3 days
  if (userData.featureFlags?.review_promo_enabled && userData.proReviewPopup == true && userData.dateInstalled != null && userData.dateInstalled + 86400000 * 3 < Date.now()) {
    if (!userData.homelutenPro) {
      $('#homeluten-container').append(PRO_PROMO_MODAL)
      $('#review-promo-days').text(userData.featureFlags.review_promo_free_days)
      $('#homeluten-pro-promo-popup').modal('show')

      $('#homeluten-pro-promo-modal-button').click(function() {
        chrome.runtime.sendMessage({
          action: "open_options_page",
          source: "pro_promo_cta"
        });
      })

      // only trigger this one time in lifetime
      chrome.storage.sync.set({
        proReviewPopup: false
      });
    }
  }
}
