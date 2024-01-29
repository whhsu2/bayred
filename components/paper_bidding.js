function paperBiddingInit(userData, locationData) {
  const PAPER_BIDDING_ITEM = `
    <div id="paper-bidding" class="d-flex align-items-center justify-content-between score-line" data-bs-toggle="modal" data-bs-target="#homeluten-login-popup" style="cursor: pointer;">
      <img src="https://homeluten.com/images/buy-30.svg">
      <span class="status-label flex-fill">Paper Bidding</span>
      <span class="status-number fs-6 ms-auto" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="#paper-bidding" title="Practice your bidding skills with our virtual bidding platform. Get a free month of Homeluten Pro when you win.">
        <button id="view-paper-bidding" class="badge pro-badge">Win Free Pro</button>
      </span>
    </div>
  `

  const CARD_PAPER_BIDDING = `
    <!-- Modal -->
    <div class="modal fade" id="homeluten-paper-bidding-card" tabindex="-1" aria-labelledby="proPromoModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <img src="https://homeluten.com/images/buy-30.svg">
            <h5 class="modal-title" id="proPromoModalLabel" style="margin-bottom: 0px">Paper Bidding</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
          </div>
        </div>
      </div>
    </div>
    <!-- END Modal -->
  `

  // dynamically load Bidding module
  $('#homeluten-listing-configs').prepend(PAPER_BIDDING_ITEM)

  // stop here is not logged in
  if (!userData.userEmail) {
    $('#paper-bidding').addClass('login-exclusive')
    return
  }

  $('#paper-bidding').attr('data-bs-target', '#homeluten-paper-bidding-card')
  $("#homeluten-container").append(CARD_PAPER_BIDDING)

  // get current home data for validation
  var metaData = getCurrentPageHomeInfo()
  Object.assign(metaData, getListingAddress(window.location))
  metaData.userEmail = userData.userEmail

  // show review if already submitted
  chrome.runtime.sendMessage({
    action: "fetch_review",
    metaData
  }, function(response) {
    if (response.success) {
      renderBidding(response.reviewEntry)
    } else if (!metaData.isSold) {
      // not submitted AND not sold home
      renderNewBidding(userData, locationData)
    } else {
      renderExpiredModal()
    }
  })
}

function renderNewBidding(userData, locationData) {
  const CARD_CONTENT_PAPER_BIDDING = `
    <div id="review-home">
      <p class="card-text">Practice your bidding skills with our virtual bidding platform.</p>
      <p class="card-text" style="margin-bottom: 30px;"><span class="badge pro-badge">Limited Time Offer</span> Get a FREE month of Homeluten Pro if this home is sold within 3% of your offering price.</p>
      <form id="new-review">
        <div class="form-group">
          <label class="mb-0"><b>How do you like this home?</b></label>
          <div class="input-group">
            <div class="rate">
              <input type="radio" id="star5" name="rate" value=5 required />
              <label for="star5" title="text">5 stars</label>
              <input type="radio" id="star4" name="rate" value=4 />
              <label for="star4" title="text">4 stars</label>
              <input type="radio" id="star3" name="rate" value=3 />
              <label for="star3" title="text">3 stars</label>
              <input type="radio" id="star2" name="rate" value=2 />
              <label for="star2" title="text">2 stars</label>
              <input type="radio" id="star1" name="rate" value=1 />
              <label for="star1" title="text">1 star</label>
            </div>
          </div>
          <small id="rating-help" class="form-text text-muted" style="margin-bottom: 10px;">1 = Meh; 5 = Dream home.</small>
          <br>
          <label id="estimate-label" style="margin-top: 24px; margin-bottom: 10px"><b>Your Bidding Price:</b></label>
          <span id="formatted-price" style="font-size: 30px;"></span>
          <div class="input-group">
            <input required id="dollar-value" type="number" pattern="[0-9]" min="0" step="1" name="estimate" class="form-control" aria-label="Dollar value of home" autocomplete="off">
          </div>
          <br>

          <!--
          <div class="form-floating">
            <textarea required="true" name="review" class="form-control" placeholder="e.g. big lot, easy commute" id="floatingTextarea"></textarea>
            <label for="floatingTextarea" style="color: #6c757d!important; font-size:12px;">What do you like/dislike about this home</label>
          </div>
          -->

        </div>
        <button id="newReviewSubmit" type="submit" class="btn btn-primary">Submit</button>
        <div style="font-size: 12px; margin-top: 10px;"><i>*You can NOT modify your offer once submitted, just like sending a real one</i></div>
      </form>
    </div>
  `
  $("#homeluten-paper-bidding-card .modal-body").append(CARD_CONTENT_PAPER_BIDDING)

  var offerPrice = 0;

  $('#homeluten-container #dollar-value').on("input", function() {
    offerPrice = parseInt(this.value.replace(/\D/g, '')) || 0;

    // $("#homeluten-container #formatted-price").text(valueString)
    $("#homeluten-container #formatted-price").text(`$${currencyFormatter(offerPrice)}`)
  });

  $("#new-review").submit(function (event) {
    event.preventDefault();

    var formValues = {};
    $.each($('#new-review').serializeArray(), function(i, field) {
        formValues[field.name] = field.value;
    });

    // grab current listing info
    var metaData = getCurrentPageHomeInfo()
    Object.assign(metaData, getListingAddress(window.location))

    var reviewEntry = {
      mlsId: metaData.mlsId,
      address: metaData.address,
      city: metaData.city,
      state: metaData.state,
      zipcode: metaData.zipcode,
      userEmail: userData.userEmail,
      offerPrice: offerPrice,
      ratings: parseInt(formValues.rate),
      listingUrl: window.location.protocol + '//' + window.location.host + window.location.pathname,
      lat: locationData.lat,
      lng: locationData.lng
    }

    $("#newReviewSubmit").html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing ...').prop('disabled', true);

    chrome.runtime.sendMessage({
      action: "submit_review",
      reviewData: reviewEntry
    }, function(response) {
      if (response.success) {
        // render submission if success
        $("#homeluten-paper-bidding-card #review-home").remove()
        renderBidding(reviewEntry)
      } else {
        $("#newReviewSubmit").html('Submission Failed, Click to Retry').prop('disabled', false);
      }
    })
  });
}

function renderBidding(reviewEntry) {
  const CARD_CONTENT_PAPER_BIDDING_OFFER = `
    <div id="remote-reviews" class="text-center">
      <h3 class="card-text">✅ Offer Submitted!</h3>
      <div>We will email you the result once this home is sold.</div>

      <label style="font-size: 24px; margin-top: 36px;">You Offered: <br> <b style="font-size: 50px;">$${currencyFormatter(reviewEntry.offerPrice)}</b></label>

      <div class="input-group" style="justify-content: center;">
        <div class="rate">
          <input type="radio" id="star5" name="rate" value=5 required />
          <label for="star5" title="text">5 stars</label>
          <input type="radio" id="star4" name="rate" value=4 />
          <label for="star4" title="text">4 stars</label>
          <input type="radio" id="star3" name="rate" value=3 />
          <label for="star3" title="text">3 stars</label>
          <input type="radio" id="star2" name="rate" value=2 />
          <label for="star2" title="text">2 stars</label>
          <input type="radio" id="star1" name="rate" value=1 />
          <label for="star1" title="text">1 star</label>
        </div>
      </div>
    </div>
  `

  $("#homeluten-paper-bidding-card .modal-body").append(CARD_CONTENT_PAPER_BIDDING_OFFER)
  $(`#homeluten-container #remote-reviews #star${reviewEntry.ratings}`).attr('checked', true)
  $(`#homeluten-container #remote-reviews [id^=star]`).attr('disabled', true).unbind('mouseenter mouseleave')
}

function renderExpiredModal() {
  const CARD_CONTENT_PAPER_BIDDING_EXPIRED = `
    <div id="remote-reviews" class="text-center">
      <h3 class="card-text">😒 Oops! Missed It!</h3>
      <div>This home is already sold. Thus you are unable to submit an offer.</div>
      <br>
      <div>Please place your bid on any active listings.</div>
      <br>
    </div>
  `
  $("#homeluten-paper-bidding-card .modal-body").append(CARD_CONTENT_PAPER_BIDDING_EXPIRED)
}