function initWebAppLink({lat, lng}) {
  $('.web-search-linkable').click(function() {
    window.open(`https://web.homeluten.com/search?lat=${lat}&lng=${lng}`, '_blank')
  })
}

// Add event listeners and init listing with stored state
function restoreAndInitListingCardSettings(userData, locationData, context) {
    loadSuperfundData(locationData)
    loadSoundscoreData(userData, locationData)
    loadPaperBidding(userData, context, locationData)
    // PRO section
    loadSexOffender(userData, locationData)
    loadEthnicity(userData, locationData)
    loadIncome(userData, locationData)
    loadFlood(userData, locationData)
    loadAnalysis(userData, locationData)
  
    initTooltip()
    initProModal()
    initLoginModal(userData)
    initWebAppLink(locationData)
  }

function redfinListingPageHandler(userData, locationData, context) {
  $(document.getElementsByTagName("body")[0]).append(CARD_LISTING)
  $("#homeluten-listing-container .card-body").append(CARD_BODY_LISTING)
  // toggle/close card
  $homelutenContainer = $('#homeluten-container')

  // restore stored state
  if (userData.homeluten_extension_minimized) {
    $homelutenContainer.find('.card-body').hide()
  }

  $homelutenContainer.find('.card-header').click(function() {
    $homelutenContainer.find('.card-body').slideToggle()

    chrome.storage.sync.set({
      homeluten_extension_minimized: !userData.homeluten_extension_minimized
    })
  })

  $homelutenContainer.find('.card-header .btn-close').click(function(event) {
    event.stopPropagation()
    $homelutenContainer.remove()
  });

  restoreAndInitListingCardSettings(userData, locationData, context)
  showProReviewPromo(userData)
}



// main entry of file
function listingPageModule(userData, context) {
  var addressData = getListingAddress(window.location, context);

  // get lat lng from adress via geocoding
  $.ajax({
    url: `https://api.homeluten.com/geocode?zipcode=${addressData?.zipcode}&address=${addressData?.address}`,
    dataType: 'json',
    success: function(data){
      // load lat, lng
      var lat, lng
      [lat, lng] = data?.resourceSets[0]?.resources[0]?.point?.coordinates || []
      // the handler
      redfinListingPageHandler(userData, {lat, lng}, context);
    },
    error: function(data, status, error){
      // show error message
      var message = undefined;

      // had to hardcode this function because it is running in window scope
      if (status == "timeout") {
        message = `Failed to load Location Data, connection timeout, please refresh your page or try again later.`;
      } else {
        message =`Failed to load Location Data, please refresh your page and try again.`;
      }

      var $homelutenStatus = $('#homeluten-ajax-status');

      if (!$homelutenStatus.length) {
        var HTML = `<div id="homeluten-ajax-status" class="alert alert-danger" style="z-index: 9999999 !important">${message || "Homeluten Changes Applied!"}</div>`;
        $('#homeluten-container').append(HTML);
      }

      $homelutenAjaxStatus = $('#homeluten-ajax-status');
      $homelutenAjaxStatus.text(message);
      $homelutenAjaxStatus.fadeIn('slow', function() {
        $(this).delay(5000).fadeOut('slow');
      });

    },
    timeout: 30000
  });

  chrome.runtime.sendMessage({
    message: "listing_page_loaded",
    url: window.location.href,
    userData: userData
  });
}
