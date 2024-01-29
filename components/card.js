const CARD_MAP = `
  <div id="homeluten-container">
    <div id="homeluten-map-container" class="card fixed-bottom shadow-sm text-white bg-secondary rounded">
      <div class="card-header">
          <span class="col-10 fs-6 fw-bold" style="padding-left: 0">⭐ Homeluten</span>
          <svg style="color: #B3B2B2; cursor: pointer; width: 14px; height: 14px; margin-right: 5px;" width="24px" height="24px" width="24px" height="24px" fill="currentColor" class="bi bi-arrow-down-left" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M2 13.5a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 0-1H3.707L13.854 2.854a.5.5 0 0 0-.708-.708L3 12.293V7.5a.5.5 0 0 0-1 0v6z"/>
          </svg>
          <button type="button" class="btn-close btn-close-white" aria-label="Close"></button>
          </button>
      </div>
      <div class="limited-time-free-access badge bg-success d-none">Limited Time Free Access</div>
      <div class="card-body overflow-auto">
      </div>
    </div>
  </div>

<!-- Begin Inspectlet Asynchronous Code -->
  <script type="text/javascript">
  (function() {
  window.__insp = window.__insp || [];
  __insp.push(['wid', 962374164]);
  var ldinsp = function(){
  if(typeof window.__inspld != "undefined") return; window.__inspld = 1; var insp = document.createElement('script'); insp.type = 'text/javascript'; insp.async = true; insp.id = "inspsync"; insp.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://cdn.inspectlet.com/inspectlet.js?wid=962374164&r=' + Math.floor(new Date().getTime()/3600000); var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(insp, x); };
  setTimeout(ldinsp, 0);
  })();
  </script>
<!-- End Inspectlet Asynchronous Code -->
`

const CARD_BODY_MAP = `
  <div id="homeluten-map-configs">
    <div id="map-size-selector" class="selector-item">
      <div class="range-text-container">
        <label for="map-size-range" class="form-label">Regular Map</label>
        <label for="map-size-range" class="form-label">Large Map</label>
        <label for="map-size-range" class="form-label">Fullscreen</label>
      </div>
      <input type="range" class="form-range" min="1" max="3" id="map-size-range">
    </div>

    <div id="map-streetview-selector" class="selector-item">
      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="map-streetview-selector-input">
        <label class="form-check-label" for="map-streetview-selector-input">Enable Street View</label>
      </div>
    </div>

    <div id="map-traffic-selector" class="selector-item">
      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="map-traffic-selector-input">
        <label class="form-check-label" for="map-traffic-selector-input">Show Real-Time Traffic</label>
      </div>
    </div>

    <div id="map-transit-selector" class="selector-item">
      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="map-transit-selector-input">
        <label class="form-check-label" for="map-transit-selector-input">Show Public Transit</label>
      </div>
    </div>

    <div id="map-bike-selector" class="selector-item">
      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="map-bike-selector-input">
        <label class="form-check-label" for="map-bike-selector-input">Show Bike Lane</label>
      </div>
    </div>

    <div id="map-superfund-selector" class="selector-item">
      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="map-superfund-selector-input">
        <label class="form-check-label" for="map-superfund-selector-input">Show Superfund</label>
      </div>
    </div>

    <div id="map-earthquake-selector" class="selector-item">
      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="map-earthquake-selector-input">
        <label class="form-check-label" for="map-earthquake-selector-input">Show CA Earthquake Fault</label>
      </div>
    </div>

    <div id="map-noise-heatmap-selector" class="selector-item pro-exclusive">
      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="map-noise-heatmap-selector-input" disabled>
        <label class="form-check-label pro-exclusive" for="map-noise-heatmap-selector-input" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="#map-noise-heatmap-selector" title="Heatmap of noise level.">Noise Heatmap</label>
        <span id="login-badge" class="badge rounded-pill text-gray bg-success" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="#map-power-line-selector" title="This PRO feature if free to use if you login.">Login</span>
      </div>
    </div>

    <div id="map-power-line-selector" class="selector-item login-exclusive">
      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="map-power-line-selector-input" disabled>
        <label class="form-check-label login-exclusive" for="map-power-line-selector-input" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="#map-power-line-selector" title="High Voltage Power Transmission Lines in the United States.">Show Power Lines</label>
        <span id="login-badge" class="badge rounded-pill text-gray bg-success" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="#map-power-line-selector" title="This PRO feature if free to use if you login.">Login</span>
      </div>
    </div>

    <div id="map-phone-tower-selector" class="selector-item pro-exclusive">
      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="map-phone-tower-selector-input" disabled>
        <label class="form-check-label pro-exclusive" for="map-phone-tower-selector-input" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="#map-phone-tower-selector" title="Includes all FCC registered cellular towers.">Show Cell Phone Towers</label>
        <span class="badge rounded-pill text-gray" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="#map-phone-tower-selector" title="This is a PRO Exclusive feature.">Pro</span>
      </div>
    </div>

    <div id="map-power-station-selector" class="selector-item pro-exclusive">
      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="map-power-station-selector-input" disabled>
        <label class="form-check-label pro-exclusive" for="map-power-station-selector-input" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="#map-power-station-selector" title="Power stations in the United States.">Show Power Stations</label>
        <span class="badge rounded-pill text-gray" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="#map-power-station-selector" title="This is a PRO Exclusive feature.">Pro</span>
      </div>
    </div>

    <div id="map-crime-heatmap-selector" class="selector-item pro-exclusive">
      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="map-crime-heatmap-selector-input" disabled>
        <label class="form-check-label pro-exclusive" for="map-crime-heatmap-selector-input">Show Crime Heatmap</label>
        <span class="badge rounded-pill text-gray" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="#map-crime-heatmap-selector" title="This is a PRO Exclusive feature.">Pro</span>
      </div>
    </div>

    <div id="map-sex-offender-selector" class="selector-item pro-exclusive">
      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="map-sex-offender-selector-input" disabled>
        <label class="form-check-label pro-exclusive" for="map-sex-offender-selector-input">Show Sex Offender</label>
        <span class="badge rounded-pill text-gray" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="#map-sex-offender-selector" title="This is a PRO Exclusive feature.">Pro</span>
      </div>
    </div>

    <div id="map-gang-selector" class="selector-item pro-exclusive">
      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="map-gang-selector-input" disabled>
        <label class="form-check-label pro-exclusive" for="map-gang-selector-input">Show Gang Territories</label>
        <span class="badge rounded-pill text-gray" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="#map-gang-selector" title="This is a PRO Exclusive feature.">Pro</span>
      </div>
    </div>

    <!-- <div id="map-crime-selector" class="selector-item pro-exclusive">
      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="map-crime-selector-input" disabled>
        <label class="form-check-label pro-exclusive" for="map-crime-selector-input">Show Crime</label>
        <span class="badge rounded-pill text-gray" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="#map-crime-selector" title="This is a PRO exclusive feature, currently offering free preview. This preview only shows data in select big cities. Official release will have coverage in all areas and 20x better loading speed.">Alpha Preview</span>
      </div>
    </div> -->
  </div>
`

const CARD_LISTING = `
  <div id="homeluten-container">
    <div id="homeluten-listing-container" class="card fixed-bottom shadow-sm text-white bg-secondary rounded">
      <div class="card-header">
          <span class="col-10 fs-6 fw-bold" style="padding-left: 0">⭐ Homeluten</span>
          <svg style="color: #B3B2B2; cursor: pointer; width: 24px; height: 24px; margin-right: 5px;" width="24px" height="24px" fill="currentColor" class="bi bi-arrow-down-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M2 13.5a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 0-1H3.707L13.854 2.854a.5.5 0 0 0-.708-.708L3 12.293V7.5a.5.5 0 0 0-1 0v6z"/>
          </svg>
          <button type="button" class="btn-close btn-close-white" aria-label="Close"></button>
          </button>
      </div>
      <div class="limited-time-free-access badge bg-success d-none">Limited Time Free Access</div>
      <div class="card-body overflow-auto">
      </div>
    </div>
  </div>

  <!-- Begin Inspectlet Asynchronous Code -->
    <script type="text/javascript">
    (function() {
    window.__insp = window.__insp || [];
    __insp.push(['wid', 962374164]);
    var ldinsp = function(){
    if(typeof window.__inspld != "undefined") return; window.__inspld = 1; var insp = document.createElement('script'); insp.type = 'text/javascript'; insp.async = true; insp.id = "inspsync"; insp.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://cdn.inspectlet.com/inspectlet.js?wid=962374164&r=' + Math.floor(new Date().getTime()/3600000); var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(insp, x); };
    setTimeout(ldinsp, 0);
    })();
    </script>
  <!-- End Inspectlet Asynchronous Code -->
`

const CARD_BODY_LISTING = `
  <div id="homeluten-listing-configs">
    <div id="superfund-status" class="d-flex align-items-center justify-content-between score-line web-search-linkable">
      <img src="https://homeluten.com/images/superfund-30.svg">
      <span class="status-label">Superfunds in 1 Mi</span>
      <span class="status-number fs-3 ms-auto" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="#superfund-status" title="This is the EPA defined Superfunds"></span>
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div id="noise-status">
      <div id="noise-score" class="d-flex align-items-center justify-content-between score-line">
        <img src="https://homeluten.com/images/noise-30.svg">
        <span class="status-label">Soundscore™</span>
        <span class="status-number fs-3 ms-auto" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="#noise-status" title="Out of 100. The higher the better."></span>
        <div class="spinner-border text-success" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div id="traffic-score" class="d-flex align-items-center justify-content-between score-line">
        <img src="https://homeluten.com/images/traffic-30.svg">
        <span class="status-label">Traffic</span>
        <span class="status-number fs-5 ms-auto" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="#traffic-score" title="Traffic noise on the street"></span>
        <div class="spinner-border text-danger" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div id="local-score" class="d-flex align-items-center justify-content-between score-line">
        <img src="https://homeluten.com/images/local-30.svg">
        <span class="status-label">Neighborhood</span>
        <span class="status-number fs-5 ms-auto" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="#local-score" title="Noise level in the neighborhood, think bar, coffee shop noise etc."></span>
        <div class="spinner-border text-warning" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div id="airport-score" class="d-flex align-items-center justify-content-between score-line">
        <img src="https://homeluten.com/images/airport-30.svg">
        <span class="badge rounded-pill text-gray" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="#airport-score" title="This is a PRO exclusive feature.">Pro</span>
        <span class="status-label">Flight Noise</span>
        <span class="status-number fs-5 ms-auto" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="#airport-score" title="Busy / Red rating means significant flight noise"></span>
        <div class="spinner-border text-light" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>

    <div id="sex-offender" class="d-flex align-items-center justify-content-between score-line web-search-linkable">
      <img src="https://homeluten.com/images/offender-30.svg">
      <span class="badge rounded-pill text-gray" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="#sex-offender" title="This is a PRO exclusive feature.">Pro</span>
      <span class="status-label">Sex Offender <span class="radius-label">< <span class="radius-text">...</span>Mi</span></span>
      <span class="status-number fs-5 ms-auto" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="#sex-offender" title="Number of Registered Sex Offenders nearby"></span>
      <div class="spinner-border text-info" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div id="local-income" class="d-flex align-items-center justify-content-between score-line">
      <img src="https://homeluten.com/images/money-30.svg">
      <span class="badge rounded-pill text-gray" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="#local-income" title="This is a PRO exclusive feature.">Pro</span>
      <span class="status-label">Income <span class="radius-label">< <span class="radius-text">...</span>Mi</span></span>
      <span class="status-number fs-6 ms-auto" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="#local-income" title="Based on Census 2020 data. This is the median household income."></span>
      <div class="spinner-border text-light" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div id="local-race" class="d-flex align-items-center justify-content-between score-line">
      <img src="https://homeluten.com/images/race-30.svg">
      <span class="badge rounded-pill text-gray" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="#local-race" title="This is a PRO exclusive feature.">Pro</span>
      <span class="status-label">Ethnicity <span class="radius-label">< <span class="radius-text">...</span>Mi</span></span>
      <span class="status-number fs-6 ms-auto" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="#local-race" title="Based on Census 2020 data"></span>
      <div class="spinner-border text-light" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div id="fema-flood" class="d-flex align-items-center justify-content-between score-line">
      <img src="https://homeluten.com/images/fema-30.svg">
      <span class="badge rounded-pill text-gray" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="#local-income" title="This is a PRO exclusive feature.">Pro</span>
      <span class="status-label">Flood Zone</span>
      <span class="status-number fs-6 ms-auto" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="#fema-flood" title="Official FEMA flood zone map of this home"></span>
      <div class="spinner-border text-light" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div id="market-analysis" class="d-flex align-items-center justify-content-between score-line">
      <img src="https://homeluten.com/images/analysis-30.svg">
      <span class="badge rounded-pill text-gray" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="#market-analysis" title="This is a PRO exclusive feature.">Pro</span>
      <span class="status-label">Price Analysis</span>
      <span class="status-number fs-6 ms-auto" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="#market-analysis" title="See distributions of nearby on sale and sold homes so you can immediately tell if a home is overpriced or underpriced, as well as what the reasonable price range this home should be."></span>
      <div class="spinner-border text-light" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
`

const PRO_MODAL = `
  <!-- Modal -->
  <div class="modal fade" id="homeluten-pro-popup" tabindex="-1" aria-labelledby="proModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="proModalLabel">Pro Upgrade</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div>This data is only available with our Homeluten Pro membership.</div>
          <br>
          <div>We provide a <b style="background-color: yellow;">FREE TRIAL</b>, so you can test it out before actually paying. You can self-cancel your subscription anytime within the extension before or after your trial ends.</div>
          <br>
          <div id="pro-modal-carousel" class="carousel slide carousel-dark" data-bs-ride="carousel">
            <div class="carousel-indicators">
              <button type="button" data-bs-target="#pro-modal-carousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#pro-modal-carousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
              <button type="button" data-bs-target="#pro-modal-carousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
              <button type="button" data-bs-target="#pro-modal-carousel" data-bs-slide-to="3" aria-label="Slide 4"></button>
            </div>
            <div class="carousel-inner">
              <div class="carousel-item active" data-bs-interval="3000">
                <img src="https://homeluten.com/images/pro-demo.webp" class="d-block w-100" alt="pro demo image 1">
                <div class="carousel-caption d-none d-md-block">
                  <h5>Neighborhood Income</h5>
                  <p>Get a sense of the community. View median household income around any home, with radius as low as 1 mile</p>
                </div>
              </div>
              <div class="carousel-item" data-bs-interval="3000">
                <img src="https://homeluten.com/images/pro-demo-2.webp" class="d-block w-100" alt="pro demo image 2">
                <div class="carousel-caption d-none d-md-block">
                  <h5>Ethnicity Distributions</h5>
                  <p>Learn about your potential neighbors. View the ethnicity distributions around any home, with radius as low as a few blocks</p>
                </div>
              </div>
              <div class="carousel-item" data-bs-interval="3000">
                <img src="https://homeluten.com/images/pro-demo-3.webp" class="d-block w-100" alt="pro demo image 3">
                <div class="carousel-caption d-none d-md-block">
                  <h5>Crime Map and Superfunds</h5>
                  <p>View Crime Heatmap and Superfund sites right around any home. (Supports only Redfin)</p>
                </div>
              </div>
              <div class="carousel-item" data-bs-interval="3000">
                <img src="https://homeluten.com/images/pro-demo-4.webp" class="d-block w-100" alt="pro demo image 4">
                <div class="carousel-caption d-none d-md-block">
                  <h5>Price Analysis</h5>
                  <p>We will show you a distribution graph of recent for sale and sold home prices, so you can tell whether a home is reasonably priced, and how much you should offer.</p>
                </div>
              </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#pro-modal-carousel" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#pro-modal-carousel" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <div class="text-center">
            <button id="homeluten-pro-modal-button" type="button" class="btn btn-primary" data-bs-dismiss="modal">Start My <span class="badge rounded-pill text-gray">PRO</span> FREE Trial</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- END Modal -->
`

const PRO_UNLOCK_BUTTON = `
  <button class="btn btn-primary badge bg-primary text-gray pro-unlock pro-exclusive align-middle">Unlock</button>
`

const RACE_PIECHART_BUTTON = `
  <button id="view-race" data-bs-toggle="modal" data-bs-target="#homeluten-race-card" class="btn btn-outline-info badge align-middle">View</button>
`

const RACE_PINECHART_CARD = `
  <!-- Modal -->
  <div class="modal fade" id="homeluten-race-card" tabindex="-1" aria-labelledby="raceModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-body">
          <canvas id="homeluten-race-chart" width="400" height="400"></canvas>
        </div>
        <div class="modal-footer">
          <div class="text-center">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- END Modal -->
`

const MARKET_BUBBLECHART_BUTTON = `
  <button id="view-market-analysis" data-bs-toggle="modal" data-bs-target="#homeluten-market-analysis-card" class="btn btn-outline-info badge align-middle">View</button>
`

const MARKET_BUBBLECHART_CARD = `
  <!-- Modal -->
  <div class="modal fade" id="homeluten-market-analysis-card" tabindex="-1" aria-labelledby="marketModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-body">
          <canvas id="homeluten-market-analysis-chart" width="400" height="400"></canvas>
        </div>
        <div class="modal-footer">
          <div class="text-center">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- END Modal -->
`

const PRO_PROMO_MODAL = `
  <!-- Modal -->
  <div class="modal fade" id="homeluten-pro-promo-popup" tabindex="-1" aria-labelledby="proPromoModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="proPromoModalLabel">Rate Us and Get FREE Pro Membership</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div>It has been some time since you've installed Homeluten. We hope you are enjoying Homeluten so far and would like to hear your feedback.</div>
          <br>
          <div>Rate our extension (it takes only 15 seconds!) by clicking the button below, and as a thank you, we will add <b style="background-color: yellow;"><span id="review-promo-days">30</span> days of FREE Pro membership to your account</b>. No credit card required.</div>
          <br>
          <div><i>*New subscribers only. You will need to login with your email (no password needed) in order to participate in this promotion.</i></div>
          <br>
        </div>
        <div class="modal-footer">
          <div class="text-center">
            <button id="homeluten-pro-promo-modal-button" type="button" class="btn btn-primary" data-bs-dismiss="modal">Review and Claim My FREE Month of <span class="badge rounded-pill text-gray">PRO</span></button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- END Modal -->
`
const LOGIN_MODAL = `
  <!-- Modal -->
  <div class="modal fade" id="homeluten-login-popup" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="loginModalLabel">This Feature Requires Homeluten Account</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div>No password needed, we will send a one-time login code to your email address.</div>
          <br>
          <div> Please click on the login button below to continue.</div>
          <br>
        </div>
        <div class="modal-footer">
          <div class="text-center">
            <button id="homeluten-login-modal-button" type="button" class="btn btn-primary" data-bs-dismiss="modal">Login</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- END Modal -->
`

// new feature badge
// <span class="badge rounded-pill text-gray new-feature" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="#map-power-line-selector" title="This is a new feature." style="background: #d1320a !important;">New</span>
