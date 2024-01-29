function redfinMapPageHandler(userData) {
  $(document.getElementsByTagName("body")[0]).append(CARD_MAP);
  $("#homeluten-map-container .card-body").append(CARD_BODY_MAP);

  // toggle close card
  $homelutenContainer = $('#homeluten-container')

  // restore stored state
  if (userData.homeluten_extension_minimized) {
    $homelutenContainer.find('.card-body').hide()
  }

  if (!userData.newFeatures) {
    $homelutenContainer.find('.badge.new-feature').hide()
  }

  $homelutenContainer.find('.card-header').click(function() {
    $homelutenContainer.find('.card-body').slideToggle()

    chrome.storage.sync.set({
      homeluten_extension_minimized: !userData.homeluten_extension_minimized
    })
  })
  $homelutenContainer.find('.card-header .btn-close').click(function(event) {
    event.stopPropagation()
    $homelutenContainer.hide()
  });

  restoreAndInitMapCardSettings(userData)
  showProReviewPromo(userData)
}

// Add event listeners and init map with stored state
function restoreAndInitMapCardSettings(userData) {
  var $homelutenContainer = $('#homeluten-container');

  $homelutenContainer.find('#map-size-range').val(userData.redfin_mapSize).change({userData}, updateMapSizeRangeWithEvent);
  $homelutenContainer.find('#map-streetview-selector-input').prop('checked', userData.redfin_mapStreetViewEnabled).change({userData}, updateMapStreetViewWithEvent);
  $homelutenContainer.find('#map-traffic-selector-input').prop('checked', userData.redfin_mapTrafficEnabled).change({userData}, updateMapTrafficWithEvent);
  $homelutenContainer.find('#map-transit-selector-input').prop('checked', userData.redfin_mapTransitEnabled).change({userData}, updateMapTransitWithEvent);
  $homelutenContainer.find('#map-bike-selector-input').prop('checked', userData.redfin_mapBikeEnabled).change({userData}, updateMapBikeWithEvent);
  $homelutenContainer.find('#map-superfund-selector-input').prop('checked', userData.redfin_mapSuperfundEnabled).change({userData}, updateMapSuperfundWithEvent);
  $homelutenContainer.find('#map-earthquake-selector-input').prop('checked', userData.redfin_earthquakeFaultEnabled).change({userData}, updateMapEarthquakeWithEvent);

  // LOGIN: features that require account
  if (userData.userEmail) {
    $homelutenContainer.find('#map-power-line-selector, #map-power-line-selector label').removeClass('login-exclusive');
    $homelutenContainer.find('#map-power-line-selector-input').removeAttr('disabled').prop('checked', userData.redfin_mapPowerLineEnabled).change({userData}, updateMapPowerLineWithEvent);
    $homelutenContainer.find('#map-noise-heatmap-selector-input').removeAttr('disabled').prop('checked', userData.redfin_mapNoiseHeatmapEnabled).change({userData}, updateMapNoiseHeatmapWithEvent);
    $homelutenContainer.find('#map-noise-heatmap-selector, #map-noise-heatmap-selector label').removeClass('pro-exclusive');
  }

  // PRO: init and bind pro features
  if (validProMembership(userData)) {
    // $homelutenContainer.find('#map-crime-selector-input').removeAttr('disabled').prop('checked', redfin_mapCrimeEnabled).change({userData}, updateMapCrimeWithEvent);
    // $homelutenContainer.find('#map-crime-selector, #map-crime-selector label').removeClass('pro-exclusive');
    $homelutenContainer.find('#map-crime-heatmap-selector-input').removeAttr('disabled').prop('checked', userData.redfin_mapCrimeHeatmapEnabled).change({userData}, updateMapCrimeHeatmapWithEvent);
    $homelutenContainer.find('#map-crime-heatmap-selector, #map-crime-heatmap-selector label').removeClass('pro-exclusive');
    $homelutenContainer.find('#map-sex-offender-selector-input').removeAttr('disabled').prop('checked', userData.redfin_mapSexOffenderEnabled).change({userData}, updateMapSexOffenderWithEvent);
    $homelutenContainer.find('#map-sex-offender-selector, #map-sex-offender-selector label').removeClass('pro-exclusive');
    $homelutenContainer.find('#map-gang-selector-input').removeAttr('disabled').prop('checked', userData.redfin_gangEnabled).change({userData}, updateMapGangWithEvent);
    $homelutenContainer.find('#map-gang-selector, #map-gang-selector label').removeClass('pro-exclusive');
    $homelutenContainer.find('#map-phone-tower-selector, #map-phone-tower-selector label').removeClass('pro-exclusive');
    $homelutenContainer.find('#map-phone-tower-selector-input').removeAttr('disabled').prop('checked', userData.redfin_mapPhoneTowerEnabled).change({userData}, updateMapPhoneTowerWithEvent);
    $homelutenContainer.find('#map-power-station-selector, #map-power-station-selector label').removeClass('pro-exclusive');
    $homelutenContainer.find('#map-power-station-selector-input').removeAttr('disabled').prop('checked', userData.redfin_mapPowerStationEnabled).change({userData}, updateMapPowerStationWithEvent);
  }

  reloadMap();
  // below happens after map init (draw)
  updateMapSizeRange(userData)
  updateMapStreetView(userData)
  updateMapTraffic(userData);
  updateMapTransit(userData);
  updateMapBike(userData);
  updateMapSuperfund(userData);
  updateMapEarthquake(userData);
  updateContextMenu();

  // LOGIN: features that require account
  if (userData.userEmail) {
    updateMapPowerLine(userData);
    updateMapNoiseHeatmap(userData);
  }
  // PRO: load Pro features if active membership
  // TODO: restore crime endpoint when ready
  // updateMapCrime(userData);

  if (validProMembership(userData)) {
    updateMapCrimeHeatmap(userData);
    updateMapSexOffender(userData);
    updateMapPowerLine(userData);
    updateMapPowerStation(userData);
    updateMapPhoneTower(userData);
    updateMapGang(userData);
  }

  initTooltip();
  initProModal();
  initLoginModal(userData)
}

// update map size based on rangeValue
function updateMapSizeRangeWithEvent(event) {
  var eventValue = this.value

  updateMapSizeRange(event.data.userData, eventValue)
}

function updateMapSizeRange(userData, eventValue) {
  var mapSize = eventValue;

  if (mapSize == undefined) {
    mapSize = userData.redfin_mapSize;
  } else {
    userData.redfin_mapSize = mapSize;
  }

  if (mapSize == 1 && eventValue) {
    // do not perform this on initial page load
    $('.PhotosView .HomeCardContainer').width('50%');
    $('#right-container').width('750px');
    $('#left-container').width('calc(100% - 750px)');
    $('#right-container').show();
  } else if (mapSize == 2) {
    $('.PhotosView .HomeCardContainer').width('100%');
    $('#right-container').width('457px');
    $('#left-container').width('calc(100% - 457px)');
    $('#right-container').show();
  } else if (mapSize == 3) {
    $('#right-container').hide();
    $('#left-container').width('100%');
  }

  chrome.storage.sync.set({
    redfin_mapSize: mapSize
  }, function() {
    if (eventValue != undefined) {
      showStatusBar(`Map Size Updated`);
    }
  });
}

function updateMapStreetViewWithEvent(event) {
  var eventValue = this.checked

  updateMapStreetView(event.data.userData, eventValue)
}

function updateMapStreetView(userData, eventValue) {
  var streetviewEnabled = eventValue;

  if (streetviewEnabled == undefined) {
    streetviewEnabled = userData.redfin_mapStreetViewEnabled;
  } else {
    userData.redfin_mapStreetViewEnabled = streetviewEnabled;
  }

  if (streetviewEnabled) {
    userData.mapOptions.streetViewControl = true;
  } else {
    userData.mapOptions.streetViewControl = false;
  }

  reloadMap();

  chrome.storage.sync.set({
    redfin_mapStreetViewEnabled: streetviewEnabled
  }, function() {
    if (eventValue != undefined) {
      showStatusBar(`Street View ${streetviewEnabled ? 'Enabled' : 'Disabled'}`);
    }
  });
}

function updateMapTrafficWithEvent(event) {
  var eventValue = this.checked

  updateMapTraffic(event.data.userData, eventValue)
}

function updateMapTraffic(userData, eventValue) {
  var trafficEnabled = eventValue;

  if (trafficEnabled == undefined) {
    trafficEnabled = userData.redfin_mapTrafficEnabled;
  } else {
    userData.redfin_mapTrafficEnabled = trafficEnabled;
  }

  if (trafficEnabled == undefined) {
    trafficEnabled = userData.redfin_mapTrafficEnabled;
  } else {
    userData.redfin_mapTrafficEnabled = trafficEnabled;
  }

  if (trafficEnabled) {
    function showTraffic() {
      window.trafficLayer = new window.google.maps.TrafficLayer();
      window.trafficLayer.setMap(window.__preloaded_map__);
    }

    injectWindowObj(showTraffic);
  } else {
    function hideTraffic() {
      if (window.trafficLayer) {
        window.trafficLayer.setMap(null);
      }
    }

    injectWindowObj(hideTraffic);
  }

  chrome.storage.sync.set({
    redfin_mapTrafficEnabled: trafficEnabled
  }, function() {
    if (eventValue != undefined) {
      showStatusBar(`Traffic ${trafficEnabled ? 'Enabled' : 'Disabled'}`)
    }
  });
}

function updateMapTransitWithEvent(event) {
  var eventValue = this.checked

  updateMapTransit(event.data.userData, eventValue)
}

function updateMapTransit(userData, eventValue) {
  var transitEnabled = eventValue

  if (transitEnabled == undefined) {
    transitEnabled = userData.redfin_mapTransitEnabled;
  } else {
    userData.redfin_mapTransitEnabled = transitEnabled;
  }

  if (transitEnabled == undefined) {
    transitEnabled = userData.redfin_mapTransitEnabled;
  } else {
    userData.redfin_mapTransitEnabled = transitEnabled;
  }

  if (transitEnabled) {
    function showTransit() {
      window.transitLayer = new window.google.maps.TransitLayer();
      window.transitLayer.setMap(window.__preloaded_map__);
    }

    injectWindowObj(showTransit);
  } else {
    function hideTransit() {
      if (window.transitLayer) {
        window.transitLayer.setMap(null);
      }
    }

    injectWindowObj(hideTransit);
  }

  chrome.storage.sync.set({
    redfin_mapTransitEnabled: transitEnabled
  }, function() {
    if (eventValue != undefined) {
      showStatusBar(`Transit ${transitEnabled ? 'Enabled' : 'Disabled'}`)
    }
  });
}

function updateMapBikeWithEvent(event) {
  var eventValue = this.checked

  updateMapBike(event.data.userData, eventValue)
}

function updateMapBike(userData, eventValue) {
  var bikeEnabled = eventValue;

  if (bikeEnabled == undefined) {
    bikeEnabled = userData.redfin_mapBikeEnabled;
  } else {
    userData.redfin_mapBikeEnabled = bikeEnabled;
  }

  if (bikeEnabled == undefined) {
    bikeEnabled = userData.redfin_mapBikeEnabled;
  } else {
    userData.redfin_mapBikeEnabled = bikeEnabled;
  }

  if (bikeEnabled) {
    function showBike() {
      window.bikeLayer = new window.google.maps.BicyclingLayer();
      window.bikeLayer.setMap(window.__preloaded_map__);
    }

    injectWindowObj(showBike);
  } else {
    function hideBike() {
      if (window.bikeLayer) {
        window.bikeLayer.setMap(null);
      }
    }

    injectWindowObj(hideBike);
  }

  chrome.storage.sync.set({
    redfin_mapBikeEnabled: bikeEnabled
  }, function() {
    if (eventValue != undefined) {
      showStatusBar(`Bike Lanes ${bikeEnabled ? 'Enabled' : 'Disabled'}`);
    }
  });
}

function updateMapSuperfundWithEvent(event) {
  var eventValue = this.checked

  updateMapSuperfund(event.data.userData, eventValue)
}

function updateMapSuperfund(userData, eventValue) {
  var superfundEnabled = eventValue;

  if (superfundEnabled == undefined) {
    superfundEnabled = userData.redfin_mapSuperfundEnabled;
  } else {
    userData.redfin_mapSuperfundEnabled = superfundEnabled;
  }

  if (superfundEnabled) {
    function showSuperfund() {
      if (window?.superfundAjaxInFlight) {
        return;
      }

      // prevent multiple in-flight calls
      window.superfundAjaxInFlight = true;

      var lat = window.__preloaded_map__.getCenter().lat();
      var lng = window.__preloaded_map__.getCenter().lng();
      var loadingSpinHTML = `Loading Superfunds ... <span class="spinner-border spinner-border-sm text-warning" role="status" aria-hidden="true" style="margin-left: 10px;"></span>`;

      // set toggle state
      $("#map-superfund-selector label").html(loadingSpinHTML);
      $("#map-superfund-selector-input").attr('disabled', true);

      if (!window.superfundMarkers) {
        window.superfundMarkers = []
      }

      if (!window.superfundMarkersLookup) {
        window.superfundMarkersLookup = {}
      }

      $.ajax({
        url: `https://api.homeluten.com/superfund?lat=${lat}&lng=${lng}`,
        dataType: 'json',
        success: function(data){
          window.$.each(data?.Results?.FRSFacility, function(key, site) {
            if (`${site?.Latitude83}_${site?.Longitude83}` in window.superfundMarkersLookup) {
              return
            }

            const contentString =
            `<div class="content">
              <h1 class="firstHeading"><b>${site.FacilityName}</b></h1>
              <br>
              <div classs="bodyContent">
                <b>Address:</b>
                <br>
                ${site.LocationAddress}
                <br>
                ${site.CityName}, ${site.StateAbbr} ${site.ZipCode}
                <br>
              </div>
            </div>`

            const infowindow = new google.maps.InfoWindow({
              content: contentString,
              maxWidth: 200
            });

            const marker = new window.google.maps.Marker({
              position: {
                lat: parseFloat(site?.Latitude83),
                lng: parseFloat(site?.Longitude83)
              },
              map: window.__preloaded_map__,
              title: site?.FacilityName,
              icon: 'https://homeluten.com/images/superfund-30.svg'
            });

            marker.addListener("click", () => {
              infowindow.open({
                anchor: marker,
                map: window.__preloaded_map__,
                shouldFocus: false,
              });
            });

            window.superfundMarkers.push(marker)
            window.superfundMarkersLookup[`${site?.Latitude83}_${site?.Longitude83}`] = true
          });
        },
        // can't replace inline function because window injection
        error: function(data, status, error){
          // show error message
          var message = undefined;

          // had to hardcode this function because it is running in window scope
          if (status == "timeout") {
            message = `Failed to load EPA Superfunds, connection timeout, please refresh your page or try again later.`;
          } else {
            message =`Failed to load EPA Superfunds, please refresh your page and try again.`;
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
        timeout: 60000,
        complete: function() {
          // clear spinner, restore toggle state
          $("#map-superfund-selector label").html(`Show Superfund`);
          $("#map-superfund-selector-input").removeAttr('disabled');
          window.superfundAjaxInFlight = false;
        }
      });
    }

    injectWindowObj(showSuperfund);
  } else {
    function hideSuperfund() {
      window.$.each(window.superfundMarkers, function(key, marker) {
        marker.setMap(null);
      });

      window.superfundMarkers = [];
    }

    injectWindowObj(hideSuperfund);
  }

  chrome.storage.sync.set({
    redfin_mapSuperfundEnabled: superfundEnabled
  }, function() {
    if (eventValue != undefined) {
      showStatusBar(`Superfund ${superfundEnabled ? 'Enabled' : 'Disabled'}`)
    }
  });
}

function updateMapEarthquakeWithEvent(event) {
  var eventValue = this.checked

  updateMapEarthquake(event.data.userData, eventValue)
}

function updateMapEarthquake(userData, eventValue) {
  var earthquakeEnabled = eventValue;

  if (earthquakeEnabled == undefined) {
    earthquakeEnabled = userData.redfin_earthquakeFaultEnabled;
  } else {
    userData.redfin_earthquakeFaultEnabled = earthquakeEnabled;
  }

  if (earthquakeEnabled) {
    function showEarthquake() {
      var loadingSpinHTML = `Loading Earthquake ... <span class="spinner-border spinner-border-sm text-warning" role="status" aria-hidden="true" style="margin-left: 10px;"></span>`;

      // set toggle state
      $("#map-earthquake-selector label").html(loadingSpinHTML);
      $("#map-earthquake-selector-input").attr('disabled', true);

      if (!window.homeluten_earthquakeLayer) {
        window.homeluten_earthquakeLayer = [];
      }

      var earthquakeLayer = new google.maps.KmlLayer('https://homeluten.com/api/CA.kmz', {preserveViewport: true});
      window.homeluten_earthquakeLayer.push(earthquakeLayer);
      earthquakeLayer.setMap(__preloaded_map__);

      // clear spinner, restore toggle state
      $("#map-earthquake-selector label").html(`Show CA Earthquake Fault`);
      $("#map-earthquake-selector-input").removeAttr('disabled');
    }

    injectWindowObj(showEarthquake);
  } else {
    function hideEarthquake() {
      window.$.each(window.homeluten_earthquakeLayer, function(key, layer) {
        layer.setMap(null);
      });

      window.homeluten_earthquakeLayer = [];
    }

    injectWindowObj(hideEarthquake);
  }

  chrome.storage.sync.set({
    redfin_earthquakeFaultEnabled: earthquakeEnabled
  }, function() {
    if (eventValue != undefined) {
      showStatusBar(`Earthquake Falut ${earthquakeEnabled ? 'Enabled' : 'Disabled'}`)
    }
  });
}

// START: pro section
function updateMapGangWithEvent(event) {
  var eventValue = this.checked

  updateMapGang(event.data.userData, eventValue)
}

function updateMapGang(userData, eventValue) {
  var gangEnabled = eventValue;

  if (gangEnabled == undefined) {
    gangEnabled = userData.redfin_gangEnabled;
  } else {
    userData.redfin_gangEnabled = gangEnabled;
  }

  if (gangEnabled) {
    function showGang() {
      var loadingSpinHTML = `Loading Gangs ... <span class="spinner-border spinner-border-sm text-warning" role="status" aria-hidden="true" style="margin-left: 10px;"></span>`;

      // set toggle state
      $("#map-gang-selector label").html(loadingSpinHTML);
      $("#map-gang-selector-input").attr('disabled', true);

      if (!window.homeluten_gangLayer) {
        window.homeluten_gangLayer = [];
      }

      var gangLayer = new google.maps.KmlLayer('https://homeluten.com/api/gang.kmz', {preserveViewport: true});
      window.homeluten_gangLayer.push(gangLayer);
      gangLayer.setMap(__preloaded_map__);

      // clear spinner, restore toggle state
      $("#map-gang-selector label").html(`Show Gang Territories`);
      $("#map-gang-selector-input").removeAttr('disabled');
    }

    injectWindowObj(showGang);
  } else {
    function hideGang() {
      window.$.each(window.homeluten_gangLayer, function(key, layer) {
        layer.setMap(null);
      });

      window.homeluten_gangLayer = [];
    }

    injectWindowObj(hideGang);
  }

  chrome.storage.sync.set({
    redfin_gangEnabled: gangEnabled
  }, function() {
    if (eventValue != undefined) {
      showStatusBar(`Gang Territories ${gangEnabled ? 'Enabled' : 'Disabled'}`)
    }
  });
}

function updateMapCrimeWithEvent(event) {
  var eventValue = this.checked

  updateMapCrime(event.data.userData, eventValue)
}

function updateMapCrime(userData, eventValue) {
  var crimeEnabled = eventValue;

  if (crimeEnabled == undefined) {
    crimeEnabled = userData.redfin_mapCrimeEnabled;
  } else {
    userData.redfin_mapCrimeEnabled = crimeEnabled;
  }

  if (crimeEnabled) {
    function showCrime() {
      if (window?.crimeAjaxInFlight) {
        return;
      }

      // prevent multiple in-flight calls
      window.crimeAjaxInFlight = true;

      var lat = window.__preloaded_map__.getCenter().lat();
      var lng = window.__preloaded_map__.getCenter().lng();
      var loadingSpinHTML = `Loading Crimes ... <span class="spinner-border spinner-border-sm text-warning" role="status" aria-hidden="true" style="margin-left: 10px;"></span>`;

      // set toggle state
      $("#map-crime-selector label").html(loadingSpinHTML);
      $("#map-crime-selector-input").attr('disabled', true);

      if (!window.crimeMarkers) {
        window.crimeMarkers = [];
      }

      $.ajax({
        url: `https://api.homeluten.com/crime?lat=${lat}&lng=${lng}`,
        dataType: 'json',
        success: function(data){
          window.$.each(data?.incidents, function(key, event) {
            const contentString =
            `<div class="content">
              <div classs="bodyContent">${event.offense}</div>
              <br>
            </div>`

            const infowindow = new google.maps.InfoWindow({
              content: contentString,
              maxWidth: 200
            });

            const marker = new window.google.maps.Marker({
              position: {
                lat: parseFloat(event?.lat),
                lng: parseFloat(event?.lon)
              },
              map: window.__preloaded_map__,
              title: event?.offense,
              icon: window.CRIMEOMETER_ICON_MAPPING[event?.offense]?.icon
            });

            marker.addListener("click", () => {
              infowindow.open({
                anchor: marker,
                map: window.__preloaded_map__,
                shouldFocus: false,
              });
            });

            window.crimeMarkers.push(marker);
          });
        },
        error: function(data, status, error){
          // show error message
          var message = undefined;

          // had to hardcode this function because it is running in window scope
          if (status == "timeout") {
            message = `Failed to load Crime Data, connection timeout, please refresh your page or try again later.`;
          } else {
            message =`Failed to load Crime Data, please refresh your page and try again.`;
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
        timeout: 60000,
        complete: function() {
          // clear spinner, restore toggle state
          $("#map-crime-selector label").html(`Show Crime`);
          $("#map-crime-selector-input").removeAttr('disabled');
          window.crimeAjaxInFlight = false;
        }
      });
    }

    injectWindowObj(showCrime);
  } else {
    function hideCrime() {
      window.$.each(window.crimeMarkers, function(key, marker) {
        marker.setMap(null);
      });

      window.crimeMarkers = [];
    }

    injectWindowObj(hideCrime);
  }

  chrome.storage.sync.set({
    redfin_mapCrimeEnabled: crimeEnabled
  }, function() {
    if (eventValue != undefined) {
      showStatusBar(`Crime ${crimeEnabled ? 'Enabled' : 'Disabled'}`)
    }
  });
}

function updateMapCrimeHeatmapWithEvent(event) {
  var eventValue = this.checked

  updateMapCrimeHeatmap(event.data.userData, eventValue)
}

function updateMapCrimeHeatmap(userData, eventValue) {
  var crimeHeatmapEnabled = eventValue;

  if (crimeHeatmapEnabled == undefined) {
    crimeHeatmapEnabled = userData.redfin_mapCrimeHeatmapEnabled;
  } else {
    userData.redfin_mapCrimeHeatmapEnabled = crimeHeatmapEnabled;
  }

  if (crimeHeatmapEnabled) {
    var loadingSpinHTML = `Loading Crime Heatmap ... <span class="spinner-border spinner-border-sm text-warning" role="status" aria-hidden="true" style="margin-left: 10px;"></span>`;

    // set toggle state
    $("#map-crime-heatmap-selector label").html(loadingSpinHTML);
    $("#map-crime-heatmap-selector-input").attr('disabled', true);
    // if valid keys in cache, load tiles direclty; otherwise, fetch key from remote

    if (userData.homeluten_crimeHeatmap_tk && Date.parse(userData.homeluten_crimeHeatmap_tk_expiresAt) > Date.now()) {
      function showCrime(homeluten_crimeHeatmap_tk) {

        var crimeHeatmapLayer = new google.maps.ImageMapType({
          getTileUrl: function(coord, zoom) {
            return `https://tiles.crimeometer.com/get-tile-v2?tk=${homeluten_crimeHeatmap_tk}&z=${zoom}&x=${coord.x}&y=${coord.y}`
          },
          tileSize: new google.maps.Size(256, 256),
          minZoom: 1,
          maxZoom: 20
        });

        window.__preloaded_map__.overlayMapTypes.setAt(0, crimeHeatmapLayer);
      }

      injectWindowObj(showCrime, userData.homeluten_crimeHeatmap_tk);

      $("#map-crime-heatmap-selector label").html(`Show Crime Heatmap`);
      $("#map-crime-heatmap-selector-input").removeAttr('disabled');
    } else {
      $.ajax({
        url: `https://api.homeluten.com/crimeheatmap`,
        dataType: 'json',
        success: function(data) {
          homeluten_crimeHeatmap_tk = data.token;
          homeluten_crimeHeatmap_tk_expiresAt = data.token_expiresAt;

          function showCrime(homeluten_crimeHeatmap_tk) {

            var crimeHeatmapLayer = new google.maps.ImageMapType({
                getTileUrl: function(coord, zoom) {
                  return `https://tiles.crimeometer.com/get-tile-v2?tk=${homeluten_crimeHeatmap_tk}&z=${zoom}&x=${coord.x}&y=${coord.y}`
                },
                tileSize: new google.maps.Size(256, 256),
                minZoom: 1,
                maxZoom: 20
            });

            window.__preloaded_map__.overlayMapTypes.setAt(0, crimeHeatmapLayer);
          }

          injectWindowObj(showCrime, homeluten_crimeHeatmap_tk);

          // cache the key locally
          chrome.storage.sync.set({
            homeluten_crimeHeatmap_tk: homeluten_crimeHeatmap_tk,
            homeluten_crimeHeatmap_tk_expiresAt: homeluten_crimeHeatmap_tk_expiresAt
          });
        },
        error: function(data, status, error){
          // show error message
          var message = undefined;

          // had to hardcode this function because it is running in window scope
          if (status == "timeout") {
            message = `Failed to load Crime Heatmap, connection timeout, please refresh your page or try again later.`;
          } else {
            message =`Failed to load Crime Heatmap, please refresh your page and try again.`;
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
        timeout: 60000,
        complete: function() {
          // clear spinner, restore toggle state
          $("#map-crime-heatmap-selector label").html(`Show Crime Heatmap`);
          $("#map-crime-heatmap-selector-input").removeAttr('disabled');
        }
      });
    }
  } else if (eventValue != undefined && crimeHeatmapEnabled == false) {
    // legit click event that toggled False
    function hideCrimeHeatmap() {
      window.__preloaded_map__.overlayMapTypes.setAt(0, null);
    }

    injectWindowObj(hideCrimeHeatmap);
  }

  chrome.storage.sync.set({
    redfin_mapCrimeHeatmapEnabled: crimeHeatmapEnabled
  }, function() {
    if (eventValue != undefined) {
      showStatusBar(`Crime Heatmap ${crimeHeatmapEnabled ? 'Enabled' : 'Disabled'}`)
    }
  });
}

function updateMapNoiseHeatmapWithEvent(event) {
  var eventValue = this.checked

  updateMapNoiseHeatmap(event.data.userData, eventValue)
}

function updateMapNoiseHeatmap(userData, eventValue) {
  var noiseHeatmapEnabled = eventValue;

  if (noiseHeatmapEnabled == undefined) {
    noiseHeatmapEnabled = userData.redfin_mapNoiseHeatmapEnabled;
  } else {
    userData.redfin_mapNoiseHeatmapEnabled = noiseHeatmapEnabled;
  }

  if (noiseHeatmapEnabled) {
    var loadingSpinHTML = `Loading Noise Heatmap <span class="spinner-border spinner-border-sm text-warning" role="status" aria-hidden="true" style="margin-left: 10px;"></span>`;

    // set toggle state
    $("#map-noise-heatmap-selector label").html(loadingSpinHTML);
    $("#map-noise-heatmap-selector-input").attr('disabled', true);
    // if valid keys in cache, load tiles direclty; otherwise, fetch key from remote

      function showNoise() {

        var noiseHeatmapLayer = new google.maps.ImageMapType({
          getTileUrl: function(coord, zoom) {
            if (zoom > 14) {
              return `https://maps.gstatic.com/intl/en_us/mapfiles/transparent.png`
            } else {
              return `https://api.homeluten.com/tiles/score?z=${zoom}&x=${coord.x}&y=${coord.y}`
            }
          },
          tileSize: new google.maps.Size(256, 256),
          minZoom: 1,
          maxZoom: 14
        });

        window.__preloaded_map__.overlayMapTypes.setAt(2, noiseHeatmapLayer);
      }

      injectWindowObj(showNoise);

      $("#map-noise-heatmap-selector label").html(`Noise Heatmap`);
      $("#map-noise-heatmap-selector-input").removeAttr('disabled');
  } else if (eventValue != undefined && noiseHeatmapEnabled == false) {
    // legit click event that toggled False
    function hideNoiseHeatmap() {
      window.__preloaded_map__.overlayMapTypes.setAt(2, null);
    }

    injectWindowObj(hideNoiseHeatmap);
  }

  chrome.storage.sync.set({
    redfin_mapNoiseHeatmapEnabled: noiseHeatmapEnabled
  }, function() {
    if (eventValue != undefined) {
      showStatusBar(`Noise Heatmap ${noiseHeatmapEnabled ? 'Enabled' : 'Disabled'}`)
    }
  });
}

function updateMapSexOffenderWithEvent(event) {
  var eventValue = this.checked

  updateMapSexOffender(event.data.userData, eventValue)
}

function updateMapSexOffender(userData, eventValue) {
  var sexOffenderEnabled = eventValue;

  if (sexOffenderEnabled == undefined) {
    sexOffenderEnabled = userData.redfin_mapSexOffenderEnabled;
  } else {
    userData.redfin_mapSexOffenderEnabled = sexOffenderEnabled;
  }

  if (sexOffenderEnabled) {
    function showSexOffender() {
      if (window?.sexOffenderAjaxInFlight) {
        return;
      }

      // prevent multiple in-flight calls
      window.sexOffenderAjaxInFlight = true;

      var lat = window.__preloaded_map__.getCenter().lat();
      var lng = window.__preloaded_map__.getCenter().lng();
      var loadingSpinHTML = `Loading Sex Offenders ... <span class="spinner-border spinner-border-sm text-warning" role="status" aria-hidden="true" style="margin-left: 10px;"></span>`;

      // set toggle state
      $("#map-sex-offender-selector label").html(loadingSpinHTML);
      $("#map-sex-offender-selector-input").attr('disabled', true);

      if (!window.sexOffenderMarkers) {
        window.sexOffenderMarkers = []
      }

      if (!window.sexOffenderMarkersLookup) {
        window.sexOffenderMarkersLookup = {}
      }

      $.ajax({
        url: `https://api.homeluten.com/sexoffender?lat=${lat}&lng=${lng}`,
        dataType: 'json',
        success: function(data){
          window.$.each(data?.offenders, function(key, offender) {
            // if marker already rendered, continue to next item
            if (`${offender.lat}_${offender.lng}` in window.sexOffenderMarkersLookup) {
              return
            }

            const contentString = offender.crime ? `<div>${offender.crime}<br>` + offender.content : offender.content

            const infowindow = new google.maps.InfoWindow({
              content: contentString,
              maxWidth: 200
            });

            const marker = new window.google.maps.Marker({
              position: {
                lat: parseFloat(offender?.lat),
                lng: parseFloat(offender?.lng)
              },
              map: window.__preloaded_map__,
              title: offender?.name,
              icon: 'https://homeluten.com/images/offender-30.svg',
            });

            marker.addListener("click", () => {
              infowindow.open({
                anchor: marker,
                map: window.__preloaded_map__,
                shouldFocus: false,
              });
            });

            window.sexOffenderMarkers.push(marker)
            window.sexOffenderMarkersLookup[`${offender.lat}_${offender.lng}`] = true
          });
        },
        // can't replace inline function because window injection
        error: function(data, status, error){
          // show error message
          var message = undefined;

          // had to hardcode this function because it is running in window scope
          if (status == "timeout") {
            message = `Failed to load Sex Offenders, connection timeout, please refresh your page or try again later.`;
          } else {
            message =`Failed to load Sex Offenders, please refresh your page and try again.`;
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
        timeout: 60000,
        complete: function() {
          // clear spinner, restore toggle state
          $("#map-sex-offender-selector label").html(`Show Sex Offender`);
          $("#map-sex-offender-selector-input").removeAttr('disabled');
          window.sexOffenderAjaxInFlight = false;
        }
      });
    }

    injectWindowObj(showSexOffender);
  } else {
    function hideSexOffender() {
      window.$.each(window.sexOffenderMarkers, function(key, marker) {
        marker.setMap(null);
      });

      window.sexOffenderMarkers = [];
    }

    injectWindowObj(hideSexOffender);
  }

  chrome.storage.sync.set({
    redfin_mapSexOffenderEnabled: sexOffenderEnabled
  }, function() {
    if (eventValue != undefined) {
      showStatusBar(`Sex Offender ${sexOffenderEnabled ? 'Enabled' : 'Disabled'}`)
    }
  });
}

function updateMapPowerLineWithEvent(event) {
  var eventValue = this.checked

  updateMapPowerLine(event.data.userData, eventValue)
}

function updateMapPowerLine(userData, eventValue) {
  var powerLineEnabled = eventValue;

  if (powerLineEnabled == undefined) {
    powerLineEnabled = userData.redfin_mapPowerLineEnabled;
  } else {
    userData.redfin_mapPowerLineEnabled = powerLineEnabled;
  }

  if (powerLineEnabled) {
    var loadingSpinHTML = `Loading Power Lines ... <span class="spinner-border spinner-border-sm text-warning" role="status" aria-hidden="true" style="margin-left: 10px;"></span>`;

    // set toggle state
    $("#map-power-line-selector label").html(loadingSpinHTML);
    $("#map-power-line-selector-input").attr('disabled', true);

    function showPowerLine() {
      // raster implementation
      // window.__preloaded_map__.overlayMapTypes.clear();

      // window.powerLineLayer = new google.maps.ImageMapType({
      //   getTileUrl: function(coord, zoom) {
      //     return `https://api.maptiler.com/tiles/5cf67792-5a76-41e3-9ad4-4a82114667c6/${zoom}/${coord.x}/${coord.y}.pbf?key=RulnLQWFo2YQpo9WTXKe`
      //   },
      //   tileSize: new google.maps.Size(256, 256),
      //   minZoom: 1,
      //   maxZoom: 8
      // });

      // window.__preloaded_map__.overlayMapTypes.push(powerLineLayer);

      // window.__preloaded_map__.overlayMapTypes.clear();

      var options = {
        url: `https://api.homeluten.com/powerline/data/powerlines_vector/{z}/{x}/{y}.pbf`,
        cache: true,
        sourceMaxZoom: 18,
        style: function(feature) {
          var style = {};
          switch (feature.type) {
              case 1: //'Point'
                  style.fillStyle = 'rgba(49,79,79,1)';
                  style.radius = 5;
                  style.selected = {
                      fillStyle: 'rgba(255,255,0,0.5)',
                      radius: 6
                  }
                  break;
              case 2: //'LineString'
                  style.strokeStyle = 'rgba(136, 86, 167, 1)';
                  style.strokeStyle = 'rgba(136, 86, 167, 1)';
                  style.lineWidth = 2;
                  style.selected = {
                      strokeStyle: 'rgba(255,25,0,0.5)',
                      lineWidth: 4
                  }
                  break;
              case 3: //'Polygon'
                  style.fillStyle = 'rgba(188, 189, 220, 0.5)';
                  style.strokeStyle = 'rgba(136, 86, 167, 1)';
                  style.lineWidth = 1;
                  style.selected = {
                      fillStyle: 'rgba(255,140,0,0.3)',
                      strokeStyle: 'rgba(255,140,0,1)',
                      lineWidth: 2
                  }
                  break;
          }
          return style;
        }
      };

      // embeded GMap to Vector Tile lib
      function VectorTile(n,t){var r,u,i;for(this.layers={},this._buffer=n,t=t||n.length;n.pos<t;)r=n.readVarint(),u=r>>3,u==3?(i=this._readLayer(),i.length&&(this.layers[i.name]=i)):n.skip(r);this.parseGeometries()}function VectorTileFeature(n,t,i,r,u){var e,f,o,s,h,c;for(this.properties={},this.extent=i,this.type=0,this._buffer=n,this._geometry=-1,t=t||n.length;n.pos<t;)if(e=n.readVarint(),f=e>>3,f==1)this._id=n.readVarint();else if(f==2)for(o=n.readVarint(),s=n.pos+o;n.pos<s;)h=r[n.readVarint()],c=u[n.readVarint()],this.properties[h]=c;else f==3?this.type=n.readVarint():f==4?(this._geometry=n.pos,n.skip(e)):n.skip(e)}function VectorTileLayer(n,t){this.version=1;this.name=null;this.extent=4096;this.length=0;this._buffer=n;this._keys=[];this._values=[];this._features=[];var r,i;for(t=t||n.length;n.pos<t;)r=n.readVarint(),i=r>>3,i===15?this.version=n.readVarint():i===1?this.name=n.readString():i===5?this.extent=n.readVarint():i===2?(this.length++,this._features.push(n.pos),n.skip(r)):i===3?this._keys.push(n.readString()):i===4?this._values.push(this.readFeatureValue()):n.skip(r)}function Point(n,t){this.x=n;this.y=t}!function(n){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=n();else if("function"==typeof define&&define.amd)define([],n);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this;t.Pbf=n()}}(function(){return function n(t,i,r){function u(f,o){var h,c,s;if(!i[f]){if(!t[f]){if(h="function"==typeof require&&require,!o&&h)return h(f,!0);if(e)return e(f,!0);c=new Error("Cannot find module '"+f+"'");throw c.code="MODULE_NOT_FOUND",c;}s=i[f]={exports:{}};t[f][0].call(s.exports,function(n){var i=t[f][1][n];return u(i?i:n)},s,s.exports,n,t,i,r)}return i[f].exports}for(var e="function"==typeof require&&require,f=0;f<r.length;f++)u(r[f]);return u}({1:[function(n,t){"use strict";function i(n){this.buf=ArrayBuffer.isView&&ArrayBuffer.isView(n)?n:new Uint8Array(n||0);this.pos=0;this.type=0;this.length=this.buf.length}function a(n,t,i){var f,r,e=i.buf;if((r=e[i.pos++],f=(112&r)>>4,r<128)||(r=e[i.pos++],f|=(127&r)<<3,r<128)||(r=e[i.pos++],f|=(127&r)<<10,r<128)||(r=e[i.pos++],f|=(127&r)<<17,r<128)||(r=e[i.pos++],f|=(127&r)<<24,r<128)||(r=e[i.pos++],f|=(1&r)<<31,r<128))return u(n,f,t);throw new Error("Expected varint not more than 10 bytes");}function r(n){return n.type===i.Bytes?n.readVarint()+n.pos:n.pos+1}function u(n,t,i){return i?4294967296*t+(n>>>0):4294967296*(t>>>0)+(n>>>0)}function v(n,t){var i,r;if(n>=0?(i=n%4294967296|0,r=n/4294967296|0):(i=~(-n%4294967296),r=~(-n/4294967296),4294967295^i?i=i+1|0:(i=0,r=r+1|0)),n>=0x10000000000000000||n<-0x10000000000000000)throw new Error("Given varint doesn't fit into 10 bytes");t.realloc(10);y(i,r,t);p(r,t)}function y(n,t,i){i.buf[i.pos++]=127&n|128;n>>>=7;i.buf[i.pos++]=127&n|128;n>>>=7;i.buf[i.pos++]=127&n|128;n>>>=7;i.buf[i.pos++]=127&n|128;n>>>=7;i.buf[i.pos]=127&n}function p(n,t){var i=(7&n)<<4;t.buf[t.pos++]|=i|((n>>>=3)?128:0);n&&(t.buf[t.pos++]=127&n|((n>>>=7)?128:0),n&&(t.buf[t.pos++]=127&n|((n>>>=7)?128:0),n&&(t.buf[t.pos++]=127&n|((n>>>=7)?128:0),n&&(t.buf[t.pos++]=127&n|((n>>>=7)?128:0),n&&(t.buf[t.pos++]=127&n)))))}function c(n,t,i){var u=t<=16383?1:t<=2097151?2:t<=268435455?3:Math.ceil(Math.log(t)/(7*Math.LN2)),r;for(i.realloc(u),r=i.pos-1;r>=n;r--)i.buf[r+u]=i.buf[r]}function w(n,t){for(var i=0;i<n.length;i++)t.writeVarint(n[i])}function b(n,t){for(var i=0;i<n.length;i++)t.writeSVarint(n[i])}function k(n,t){for(var i=0;i<n.length;i++)t.writeFloat(n[i])}function d(n,t){for(var i=0;i<n.length;i++)t.writeDouble(n[i])}function g(n,t){for(var i=0;i<n.length;i++)t.writeBoolean(n[i])}function nt(n,t){for(var i=0;i<n.length;i++)t.writeFixed32(n[i])}function tt(n,t){for(var i=0;i<n.length;i++)t.writeSFixed32(n[i])}function it(n,t){for(var i=0;i<n.length;i++)t.writeFixed64(n[i])}function rt(n,t){for(var i=0;i<n.length;i++)t.writeSFixed64(n[i])}function o(n,t){return(n[t]|n[t+1]<<8|n[t+2]<<16)+16777216*n[t+3]}function f(n,t,i){n[i]=t;n[i+1]=t>>>8;n[i+2]=t>>>16;n[i+3]=t>>>24}function l(n,t){return(n[t]|n[t+1]<<8|n[t+2]<<16)+(n[t+3]<<24)}function ut(n,t,i){for(var f,s,c,h="",u=t;u<i;){var e=n[u],r=null,o=e>239?4:e>223?3:e>191?2:1;if(u+o>i)break;1===o?e<128&&(r=e):2===o?(f=n[u+1],128==(192&f)&&(r=(31&e)<<6|63&f,r<=127&&(r=null))):3===o?(f=n[u+1],s=n[u+2],128==(192&f)&&128==(192&s)&&(r=(15&e)<<12|(63&f)<<6|63&s,(r<=2047||r>=55296&&r<=57343)&&(r=null))):4===o&&(f=n[u+1],s=n[u+2],c=n[u+3],128==(192&f)&&128==(192&s)&&128==(192&c)&&(r=(15&e)<<18|(63&f)<<12|(63&s)<<6|63&c,(r<=65535||r>=1114112)&&(r=null)));null===r?(r=65533,o=1):r>65535&&(r-=65536,h+=String.fromCharCode(r>>>10&1023|55296),r=56320|1023&r);h+=String.fromCharCode(r);u+=o}return h}function ft(n,t,i){for(var r,u,f=0;f<t.length;f++){if(r=t.charCodeAt(f),r>55295&&r<57344){if(!u){r>56319||f+1===t.length?(n[i++]=239,n[i++]=191,n[i++]=189):u=r;continue}if(r<56320){n[i++]=239;n[i++]=191;n[i++]=189;u=r;continue}r=u-55296<<10|r-56320|65536;u=null}else u&&(n[i++]=239,n[i++]=191,n[i++]=189,u=null);r<128?n[i++]=r:(r<2048?n[i++]=r>>6|192:(r<65536?n[i++]=r>>12|224:(n[i++]=r>>18|240,n[i++]=r>>12&63|128),n[i++]=r>>6&63|128),n[i++]=63&r|128)}return i}var e,s,h;t.exports=i;e=n("ieee754");i.Varint=0;i.Fixed64=1;i.Bytes=2;i.Fixed32=5;s=4294967296;h=1/s;i.prototype={destroy:function(){this.buf=null},readFields:function(n,t,i){for(i=i||this.length;this.pos<i;){var r=this.readVarint(),u=r>>3,f=this.pos;this.type=7&r;n(u,t,this);this.pos===f&&this.skip(r)}return t},readMessage:function(n,t){return this.readFields(n,t,this.readVarint()+this.pos)},readFixed32:function(){var n=o(this.buf,this.pos);return this.pos+=4,n},readSFixed32:function(){var n=l(this.buf,this.pos);return this.pos+=4,n},readFixed64:function(){var n=o(this.buf,this.pos)+o(this.buf,this.pos+4)*s;return this.pos+=8,n},readSFixed64:function(){var n=o(this.buf,this.pos)+l(this.buf,this.pos+4)*s;return this.pos+=8,n},readFloat:function(){var n=e.read(this.buf,this.pos,!0,23,4);return this.pos+=4,n},readDouble:function(){var n=e.read(this.buf,this.pos,!0,52,8);return this.pos+=8,n},readVarint:function(n){var i,t,r=this.buf;return t=r[this.pos++],i=127&t,t<128?i:(t=r[this.pos++],i|=(127&t)<<7,t<128?i:(t=r[this.pos++],i|=(127&t)<<14,t<128?i:(t=r[this.pos++],i|=(127&t)<<21,t<128?i:(t=r[this.pos],i|=(15&t)<<28,a(i,n,this)))))},readVarint64:function(){return this.readVarint(!0)},readSVarint:function(){var n=this.readVarint();return n%2==1?(n+1)/-2:n/2},readBoolean:function(){return Boolean(this.readVarint())},readString:function(){var n=this.readVarint()+this.pos,t=ut(this.buf,this.pos,n);return this.pos=n,t},readBytes:function(){var n=this.readVarint()+this.pos,t=this.buf.subarray(this.pos,n);return this.pos=n,t},readPackedVarint:function(n,t){var i=r(this);for(n=n||[];this.pos<i;)n.push(this.readVarint(t));return n},readPackedSVarint:function(n){var t=r(this);for(n=n||[];this.pos<t;)n.push(this.readSVarint());return n},readPackedBoolean:function(n){var t=r(this);for(n=n||[];this.pos<t;)n.push(this.readBoolean());return n},readPackedFloat:function(n){var t=r(this);for(n=n||[];this.pos<t;)n.push(this.readFloat());return n},readPackedDouble:function(n){var t=r(this);for(n=n||[];this.pos<t;)n.push(this.readDouble());return n},readPackedFixed32:function(n){var t=r(this);for(n=n||[];this.pos<t;)n.push(this.readFixed32());return n},readPackedSFixed32:function(n){var t=r(this);for(n=n||[];this.pos<t;)n.push(this.readSFixed32());return n},readPackedFixed64:function(n){var t=r(this);for(n=n||[];this.pos<t;)n.push(this.readFixed64());return n},readPackedSFixed64:function(n){var t=r(this);for(n=n||[];this.pos<t;)n.push(this.readSFixed64());return n},skip:function(n){var t=7&n;if(t===i.Varint)for(;this.buf[this.pos++]>127;);else if(t===i.Bytes)this.pos=this.readVarint()+this.pos;else if(t===i.Fixed32)this.pos+=4;else{if(t!==i.Fixed64)throw new Error("Unimplemented type: "+t);this.pos+=8}},writeTag:function(n,t){this.writeVarint(n<<3|t)},realloc:function(n){for(var i,t=this.length||16;t<this.pos+n;)t*=2;t!==this.length&&(i=new Uint8Array(t),i.set(this.buf),this.buf=i,this.length=t)},finish:function(){return this.length=this.pos,this.pos=0,this.buf.subarray(0,this.length)},writeFixed32:function(n){this.realloc(4);f(this.buf,n,this.pos);this.pos+=4},writeSFixed32:function(n){this.realloc(4);f(this.buf,n,this.pos);this.pos+=4},writeFixed64:function(n){this.realloc(8);f(this.buf,n&-1,this.pos);f(this.buf,Math.floor(n*h),this.pos+4);this.pos+=8},writeSFixed64:function(n){this.realloc(8);f(this.buf,n&-1,this.pos);f(this.buf,Math.floor(n*h),this.pos+4);this.pos+=8},writeVarint:function(n){return n=+n||0,n>268435455||n<0?void v(n,this):(this.realloc(4),this.buf[this.pos++]=127&n|(n>127?128:0),void(n<=127||(this.buf[this.pos++]=127&(n>>>=7)|(n>127?128:0),n<=127||(this.buf[this.pos++]=127&(n>>>=7)|(n>127?128:0),n<=127||(this.buf[this.pos++]=n>>>7&127)))))},writeSVarint:function(n){this.writeVarint(n<0?2*-n-1:2*n)},writeBoolean:function(n){this.writeVarint(Boolean(n))},writeString:function(n){var i,t;n=String(n);this.realloc(4*n.length);this.pos++;i=this.pos;this.pos=ft(this.buf,n,this.pos);t=this.pos-i;t>=128&&c(i,t,this);this.pos=i-1;this.writeVarint(t);this.pos+=t},writeFloat:function(n){this.realloc(4);e.write(this.buf,n,this.pos,!0,23,4);this.pos+=4},writeDouble:function(n){this.realloc(8);e.write(this.buf,n,this.pos,!0,52,8);this.pos+=8},writeBytes:function(n){var i=n.length,t;for(this.writeVarint(i),this.realloc(i),t=0;t<i;t++)this.buf[this.pos++]=n[t]},writeRawMessage:function(n,t){var r,i;this.pos++;r=this.pos;n(t,this);i=this.pos-r;i>=128&&c(r,i,this);this.pos=r-1;this.writeVarint(i);this.pos+=i},writeMessage:function(n,t,r){this.writeTag(n,i.Bytes);this.writeRawMessage(t,r)},writePackedVarint:function(n,t){this.writeMessage(n,w,t)},writePackedSVarint:function(n,t){this.writeMessage(n,b,t)},writePackedBoolean:function(n,t){this.writeMessage(n,g,t)},writePackedFloat:function(n,t){this.writeMessage(n,k,t)},writePackedDouble:function(n,t){this.writeMessage(n,d,t)},writePackedFixed32:function(n,t){this.writeMessage(n,nt,t)},writePackedSFixed32:function(n,t){this.writeMessage(n,tt,t)},writePackedFixed64:function(n,t){this.writeMessage(n,it,t)},writePackedSFixed64:function(n,t){this.writeMessage(n,rt,t)},writeBytesField:function(n,t){this.writeTag(n,i.Bytes);this.writeBytes(t)},writeFixed32Field:function(n,t){this.writeTag(n,i.Fixed32);this.writeFixed32(t)},writeSFixed32Field:function(n,t){this.writeTag(n,i.Fixed32);this.writeSFixed32(t)},writeFixed64Field:function(n,t){this.writeTag(n,i.Fixed64);this.writeFixed64(t)},writeSFixed64Field:function(n,t){this.writeTag(n,i.Fixed64);this.writeSFixed64(t)},writeVarintField:function(n,t){this.writeTag(n,i.Varint);this.writeVarint(t)},writeSVarintField:function(n,t){this.writeTag(n,i.Varint);this.writeSVarint(t)},writeStringField:function(n,t){this.writeTag(n,i.Bytes);this.writeString(t)},writeFloatField:function(n,t){this.writeTag(n,i.Fixed32);this.writeFloat(t)},writeDoubleField:function(n,t){this.writeTag(n,i.Fixed64);this.writeDouble(t)},writeBooleanField:function(n,t){this.writeVarintField(n,Boolean(t))}}},{ieee754:2}],2:[function(n,t,i){i.read=function(n,t,i,r,u){var f,o,l=8*u-r-1,a=(1<<l)-1,v=a>>1,e=-7,s=i?u-1:0,c=i?-1:1,h=n[t+s];for(s+=c,f=h&(1<<-e)-1,h>>=-e,e+=l;e>0;f=256*f+n[t+s],s+=c,e-=8);for(o=f&(1<<-e)-1,f>>=-e,e+=r;e>0;o=256*o+n[t+s],s+=c,e-=8);if(0===f)f=1-v;else{if(f===a)return o?NaN:(h?-1:1)*(1/0);o+=Math.pow(2,r);f-=v}return(h?-1:1)*o*Math.pow(2,f-r)};i.write=function(n,t,i,r,u,f){var e,o,s,l=8*f-u-1,a=(1<<l)-1,h=a>>1,y=23===u?Math.pow(2,-24)-Math.pow(2,-77):0,c=r?0:f-1,v=r?1:-1,p=t<0||0===t&&1/t<0?1:0;for(t=Math.abs(t),isNaN(t)||t===1/0?(o=isNaN(t)?1:0,e=a):(e=Math.floor(Math.log(t)/Math.LN2),t*(s=Math.pow(2,-e))<1&&(e--,s*=2),t+=e+h>=1?y/s:y*Math.pow(2,1-h),t*s>=2&&(e++,s/=2),e+h>=a?(o=0,e=a):e+h>=1?(o=(t*s-1)*Math.pow(2,u),e+=h):(o=t*Math.pow(2,h-1)*Math.pow(2,u),e=0));u>=8;n[i+c]=255&o,c+=v,o/=256,u-=8);for(e=e<<u|o,l+=u;l>0;n[i+c]=255&e,c+=v,e/=256,l-=8);n[i+c-v]|=128*p}},{}]},{},[1])(1)});VectorTile.prototype._readLayer=function(){var n=this._buffer,i=n.readVarint(),t=n.pos+i,r=new VectorTileLayer(n,t);return n.pos=t,r};VectorTile.prototype.parseGeometries=function(){var r,n,u,t,f,i;for(r in this.layers)for(n=this.layers[r],n.parsedFeatures=[],u=n._features.length,t=0,f=u;t<f;t++)i=n.feature(t),i.coordinates=i.loadGeometry(),n.parsedFeatures.push(i)};VectorTileFeature.types=["Unknown","Point","LineString","Polygon"];VectorTileFeature.prototype.loadGeometry=function(){var t=this._buffer,f;t.pos=this._geometry;for(var s=t.readVarint(),h=t.pos+s,i=1,r=0,e=0,o=0,u=[],n;t.pos<h;)if(r||(f=t.readVarint(),i=f&7,r=f>>3),r--,i===1||i===2)e+=t.readSVarint(),o+=t.readSVarint(),i===1&&(n&&u.push(n),n=[]),n.push(new Point(e,o));else if(i===7)n.push(n[0].clone());else throw new Error("unknown command "+i);return n&&u.push(n),u};VectorTileFeature.prototype.bbox=function(){var n=this._buffer,h;n.pos=this._geometry;for(var c=n.readVarint(),l=n.pos+c,t=1,u=0,i=0,r=0,f=Infinity,e=-Infinity,o=Infinity,s=-Infinity;n.pos<l;)if(u||(h=n.readVarint(),t=h&7,u=h>>3),u--,t===1||t===2)i+=n.readSVarint(),r+=n.readSVarint(),i<f&&(f=i),i>e&&(e=i),r<o&&(o=r),r>s&&(s=r);else if(t!==7)throw new Error("unknown command "+t);return[f,o,e,s]};VectorTileLayer.prototype.readFeatureValue=function(){for(var n=this._buffer,t=null,u=n.readVarint(),f=n.pos+u,r,i;n.pos<f;)r=n.readVarint(),i=r>>3,i==1?t=n.readString():i==2?t=n.readFloat():i==3?t=n.readDouble():i==4?t=n.readVarint():i==5?t=n.readVarint():i==6?t=n.readSVarint():i==7?t=Boolean(n.readVarint()):n.skip(r);return t};VectorTileLayer.prototype.feature=function(n){if(n<0||n>=this._features.length)throw new Error("feature index out of bounds");this._buffer.pos=this._features[n];var t=this._buffer.readVarint()+this._buffer.pos;return new VectorTileFeature(this._buffer,t,this.extent,this._keys,this._values)};Point.prototype={clone:function(){return new Point(this.x,this.y)},add:function(n){return this.clone()._add(n)},sub:function(n){return this.clone()._sub(n)},mult:function(n){return this.clone()._mult(n)},div:function(n){return this.clone()._div(n)},rotate:function(n){return this.clone()._rotate(n)},matMult:function(n){return this.clone()._matMult(n)},unit:function(){return this.clone()._unit()},perp:function(){return this.clone()._perp()},round:function(){return this.clone()._round()},mag:function(){return Math.sqrt(this.x*this.x+this.y*this.y)},equals:function(n){return this.x===n.x&&this.y===n.y},dist:function(n){return Math.sqrt(this.distSqr(n))},distSqr:function(n){var t=n.x-this.x,i=n.y-this.y;return t*t+i*i},angle:function(){return Math.atan2(this.y,this.x)},angleTo:function(n){return Math.atan2(this.y-n.y,this.x-n.x)},angleWith:function(n){return this.angleWithSep(n.x,n.y)},angleWithSep:function(n,t){return Math.atan2(this.x*t-this.y*n,this.x*n+this.y*t)},_matMult:function(n){var t=n[0]*this.x+n[1]*this.y,i=n[2]*this.x+n[3]*this.y;return this.x=t,this.y=i,this},_add:function(n){return this.x+=n.x,this.y+=n.y,this},_sub:function(n){return this.x-=n.x,this.y-=n.y,this},_mult:function(n){return this.x*=n,this.y*=n,this},_div:function(n){return this.x/=n,this.y/=n,this},_unit:function(){return this._div(this.mag()),this},_perp:function(){var n=this.y;return this.y=this.x,this.x=-n,this},_rotate:function(n){var t=Math.cos(n),i=Math.sin(n),r=t*this.x-i*this.y,u=i*this.x+t*this.y;return this.x=r,this.y=u,this},_round:function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}};Point.convert=function(n){return n instanceof Point?n:Array.isArray(n)?new Point(n[0],n[1]):n};MERCATOR={fromLatLngToPoint:function(n){var t=Math.min(Math.max(Math.sin(n.lat()*(Math.PI/180)),-.9999),.9999);return{x:128+n.lng()*(256/360),y:128+.5*Math.log((1+t)/(1-t))*-(128/Math.PI)}},fromPointToLatLng:function(n){return{lat:(2*Math.atan(Math.exp((n.y-128)/-(128/Math.PI)))-Math.PI/2)/(Math.PI/180),lng:(n.x-128)/(256/360)}},getTileAtLatLng:function(n,t){var u=Math.pow(2,t),i=256/u,r=this.fromLatLngToPoint(n);return{x:Math.floor(r.x/i),y:Math.floor(r.y/i),z:t}},getTileBounds:function(n){n=this.normalizeTile(n);var i=Math.pow(2,n.z),t=256/i,r={x:n.x*t,y:n.y*t+t},u={x:n.x*t+t,y:n.y*t};return{sw:this.fromPointToLatLng(r),ne:this.fromPointToLatLng(u)}},normalizeTile:function(n){var t=Math.pow(2,n.z);return n.x=(n.x%t+t)%t,n.y=(n.y%t+t)%t,n},fromLatLngToPixels:function(n,t){var i=n.getBounds(),f=i.getNorthEast(),e=i.getSouthWest(),o=n.getProjection().fromLatLngToPoint(f),s=n.getProjection().fromLatLngToPoint(e),r=Math.pow(2,n.getZoom()),u=n.getProjection().fromLatLngToPoint(t);return{x:(u.x-s.x)*r,y:(u.y-o.y)*r}},fromLatLngToTilePoint:function(n,t){var r=n.getZoom(),u=this.getTileAtLatLng(t.latLng,r),i=this.getTileBounds(u),f=new google.maps.LatLng(i.sw),e=new google.maps.LatLng(i.ne),o=this.fromLatLngToPixels(n,f),s=this.fromLatLngToPixels(n,e);return{x:t.pixel.x-o.x,y:t.pixel.y-s.y}},isPointInPolygon:function(n,t){if(t&&t.length){for(var u=!1,i=-1,f=t.length,r=f-1;++i<f;r=i)(t[i].y<=n.y&&n.y<t[r].y||t[r].y<=n.y&&n.y<t[i].y)&&n.x<(t[r].x-t[i].x)*(n.y-t[i].y)/(t[r].y-t[i].y)+t[i].x&&(u=!u);return u}},in_circle:function(n,t,i,r,u){var f=Math.pow(n-r,2)+Math.pow(t-u,2);return f<=Math.pow(i,2)},getDistanceFromLine:function(n,t){var r=Number.POSITIVE_INFINITY,i,f,u;if(t&&t.length>1)for(i=0,f=t.length-1;i<f;i++)u=this.projectPointOnLineSegment(n,t[i],t[i+1]),u<=r&&(r=u);return r},projectPointOnLineSegment:function(n,t,i){var a=n.x,v=n.y,u=t.x,f=t.y,y=i.x,p=i.y,b=a-u,k=v-f,e=y-u,o=p-f,d=b*e+k*o,w=e*e+o*o,r=-1,s,h,c,l;return w!=0&&(r=d/w),r<0?(s=u,h=f):r>1?(s=y,h=p):(s=u+r*e,h=f+r*o),c=a-s,l=v-h,Math.sqrt(c*c+l*l)}};class MVTFeature{constructor(n){this.mVTSource=n.mVTSource;this.selected=n.selected;this.featureId=n.featureId;this.tiles=[];this.style=n.style;this.type=n.vectorTileFeature.type;this.properties=n.vectorTileFeature.properties;this.addTileFeature(n.vectorTileFeature,n.tileContext);this.selected&&this.select()}addTileFeature(n,t){this.tiles[t.id]={vectorTileFeature:n,divisor:n.extent/t.tileSize}}getTiles(){return this.tiles}setStyle(n){this.style=n}redrawTiles(){var i=this.mVTSource.map.getZoom(),n,t;for(n in this.tiles)this.mVTSource.deleteTileDrawn(n),t=this.mVTSource.getTileObject(n),t.zoom==i&&this.mVTSource.redrawTile(n)}toggle(){this.selected?this.deselect():this.select()}select(){this.selected=!0;this.mVTSource.featureSelected(this);this.redrawTiles()}deselect(){this.selected=!1;this.mVTSource.featureDeselected(this);this.redrawTiles()}setSelected(n){this.selected=n}draw(n){var i=this.tiles[n.id],t=this.style;this.selected&&this.style.selected&&(t=this.style.selected);switch(this.type){case 1:this._drawPoint(n,i,t);break;case 2:this._drawLineString(n,i,t);break;case 3:this._drawPolygon(n,i,t)}}_drawPoint(n,t,i){var r=this._getContext2d(n.canvas,i),e=i.radius||3,f,u;r.beginPath();f=t.vectorTileFeature.coordinates[0][0];u=this._getPoint(f,n,t.divisor);r.arc(u.x,u.y,e,0,Math.PI*2);r.closePath();r.fill();r.stroke()}_drawLineString(n,t,i){var r=this._getContext2d(n.canvas,i);this._drawCoordinates(n,r,t);r.stroke()}_drawPolygon(n,t,i){var r=this._getContext2d(n.canvas,i);this._drawCoordinates(n,r,t);r.closePath();i.fillStyle&&r.fill();i.strokeStyle&&r.stroke()}_drawCoordinates(n,t,i){var f,u,s,e,r,h,c,o;for(t.beginPath(),f=i.vectorTileFeature.coordinates,u=0,s=f.length;u<s;u++)for(e=f[u],r=0,h=e.length;r<h;r++)c=(r===0?"move":"line")+"To",o=this._getPoint(e[r],n,i.divisor),t[c](o.x,o.y)}getPaths(n){for(var t,u,i,s,h,f=[],e=this.tiles[n.id],o=e.vectorTileFeature.coordinates,r=0,c=o.length;r<c;r++){for(t=[],u=o[r],i=0,s=u.length;i<s;i++)h=this._getPoint(u[i],n,e.divisor),t.push(h);t.length>0&&f.push(t)}return f}_getContext2d(n,t){var r=n.getContext("2d");for(var i in t)i!=="selected"&&(r[i]=t[i]);return r}_getPoint(n,t,i){var r={x:n.x/i,y:n.y/i};return t.parentId&&(r=this._getOverzoomedPoint(r,t)),r}_getOverzoomedPoint(n,t){var u=this.mVTSource.getTileObject(t.parentId),r=this.mVTSource.getTileObject(t.id),f=r.zoom-u.zoom;const i=Math.pow(2,f);let e=n.x*i,o=n.y*i,s=r.x%i,h=r.y%i;return n.x=e-s*t.tileSize,n.y=o-h*t.tileSize,n}}class MVTLayer{constructor(n){this._lineClickTolerance=2;this._getIDForLayerFeature=n.getIDForLayerFeature;this.style=n.style;this.name=n.name;this._filter=n.filter||!1;this._canvasAndFeatures=[];this._features=[]}parseVectorTileFeatures(n,t,i){var r,u,f;for(this._canvasAndFeatures[i.id]={canvas:i.canvas,features:[]},r=0,u=t.length;r<u;r++)f=t[r],this._parseVectorTileFeature(n,f,i,r);this.drawTile(i)}_parseVectorTileFeature(n,t,i,r){var o,s;if(!this._filter||typeof this._filter!="function"||this._filter(t,i)!==!1){var e=this.getStyle(t),f=this._getIDForLayerFeature(t)||r,u=this._features[f];u?(u.setStyle(e),u.addTileFeature(t,i)):(o=n.isFeatureSelected(f),s={mVTSource:n,vectorTileFeature:t,tileContext:i,style:e,selected:o,featureId:f},u=new MVTFeature(s),this._features[f]=u);this._canvasAndFeatures[i.id].features.push(u)}}drawTile(n){var f=this._canvasAndFeatures[n.id].features,i,u,t,r;if(f){for(i=[],t=0,r=f.length;t<r;t++)u=f[t],u.selected?i.push(u):u.draw(n);for(t=0,r=i.length;t<r;t++)i[t].draw(n)}}getCanvas(n){return this._canvasAndFeatures[n].canvas}getStyle(n){return typeof this.style=="function"?this.style(n):this.style}setStyle(n){this.style=n;for(var t in this._features)this._features[t].setStyle(n)}setSelected(n){this._features[n]!==undefined&&this._features[n].select()}setFilter(n){this._filter=n}handleClickEvent(n){var t=this._canvasAndFeatures[n.tileContext.id],r,i;return t?(r=t.canvas,i=t.features,!r||!i)?n:(n.feature=this._handleClickGetFeature(n,i),n):n}_handleClickGetFeature(n,t){for(var i,h,e,f,o,c,r=Number.POSITIVE_INFINITY,u=null,s=t.length-1;s>=0;s--)for(i=t[s],h=i.getPaths(n.tileContext),e=h.length-1;e>=0;e--){f=h[e];switch(i.type){case 1:MERCATOR.in_circle(f[0].x,f[0].y,i.style.radius,n.tilePoint.x,n.tilePoint.y)&&(u=i,r=0);break;case 2:o=MERCATOR.getDistanceFromLine(n.tilePoint,f);c=i.selected&&i.style.selected?i.style.selected.lineWidth:i.style.lineWidth;o<c/2+this._lineClickTolerance&&o<r&&(u=i,r=o);break;case 3:MERCATOR.isPointInPolygon(n.tilePoint,f)&&(u=i,r=0)}if(r==0)return u}return u}}class MVTSource{constructor(n,t){var i=this;this.map=n;this._url=t.url||"";this._sourceMaxZoom=t.sourceMaxZoom||!1;this._debug=t.debug||!1;this.getIDForLayerFeature=t.getIDForLayerFeature||function(n){return n.properties.id||n.properties.Id||n.properties.ID};this._visibleLayers=t.visibleLayers||!1;this._xhrHeaders=t.xhrHeaders||{};this._clickableLayers=t.clickableLayers||!1;this._filter=t.filter||!1;this._cache=t.cache||!1;this._tileSize=t.tileSize||256;this.tileSize=new google.maps.Size(this._tileSize,this._tileSize);this.style=t.style||function(n){var t={};switch(n.type){case 1:t.fillStyle="rgba(49,79,79,1)";t.radius=5;t.selected={fillStyle:"rgba(255,255,0,0.5)",radius:6};break;case 2:t.strokeStyle="rgba(136, 86, 167, 1)";t.lineWidth=3;t.selected={strokeStyle:"rgba(255,25,0,0.5)",lineWidth:4};break;case 3:t.fillStyle="rgba(188, 189, 220, 0.5)";t.strokeStyle="rgba(136, 86, 167, 1)";t.lineWidth=1;t.selected={fillStyle:"rgba(255,140,0,0.3)",strokeStyle:"rgba(255,140,0,1)",lineWidth:2}}return t};this.mVTLayers=[];this._tilesDrawn=[];this._visibleTiles=[];this._selectedFeatures=[];t.selectedFeatures&&this.setSelectedFeatures(t.selectedFeatures);this.map.addListener("zoom_changed",()=>{i._zoomChanged()})}getTile(n,t,i){var r=this.drawTile(n,t,i);return this._setVisibleTile(r),r.canvas}releaseTile(){}_zoomChanged(){this._resetVisibleTiles();this._cache||this._resetMVTLayers()}_resetMVTLayers(){this.mVTLayers=[]}_deleteVisibleTile(n){delete this._visibleTiles[n]}_resetVisibleTiles(){this._visibleTiles=[]}_setVisibleTile(n){this._visibleTiles[n.id]=n}drawTile(n,t,i){var u=this.getTileId(t,n.x,n.y),r=this._tilesDrawn[u];return r?r:(r=this._createTileContext(n,t,i),this._xhrRequest(r),r)}_createTileContext(n,t,i){var r=this.getTileId(t,n.x,n.y),u=this._createCanvas(i,r),f=this._getParentId(r);return{id:r,canvas:u,zoom:t,tileSize:this._tileSize,parentId:f}}_getParentId(n){var r=!1,t;if(this._sourceMaxZoom&&(t=this.getTileObject(n),t.zoom>this._sourceMaxZoom)){var i=t.zoom-this._sourceMaxZoom,u=t.zoom-i,f=t.x>>i,e=t.y>>i;r=this.getTileId(u,f,e)}return r}_createCanvas(n,t){const i=n.createElement("canvas");return i.width=this._tileSize,i.height=this._tileSize,i.id=t,i}getTileId(n,t,i){return[n,t,i].join(":")}getTileObject(n){var t=n.split(":");return{zoom:t[0],x:t[1],y:t[2]}}_xhrRequest(n){var u=this,f=n.parentId||n.id,i=this.getTileObject(f),e=this._url.replace("{z}",i.zoom).replace("{x}",i.x).replace("{y}",i.y),t=new XMLHttpRequest,r;t.onload=function(){if(t.status=="200"&&t.response)return u._xhrResponseOk(n,t.response);u._drawDebugInfo(n)};t.open("GET",e,!0);for(r in this._xhrHeaders)t.setRequestHeader(r,this._xhrHeaders[r]);t.responseType="arraybuffer";t.send()}_xhrResponseOk(n,t){if(this.map.getZoom()==n.zoom){var i=new Uint8Array(t),r=new Pbf(i),u=new VectorTile(r);this._drawVectorTile(u,n)}}_setTileDrawn(n){this._cache&&(this._tilesDrawn[n.id]=n)}deleteTileDrawn(n){delete this._tilesDrawn[n]}_resetTileDrawn(){this._tilesDrawn=[]}_drawVectorTile(n,t){var r,f,i,u;if(this._visibleLayers)for(r=0,f=this._visibleLayers.length;r<f;r++)i=this._visibleLayers[r],n.layers[i]&&(u=n.layers[i],this._drawVectorTileLayer(u,i,t));else for(i in n.layers)u=n.layers[i],this._drawVectorTileLayer(u,i,t);t.vectorTile=n;this._drawDebugInfo(t);this._setTileDrawn(t)}_drawVectorTileLayer(n,t,i){this.mVTLayers[t]||(this.mVTLayers[t]=this._createMVTLayer(t));var r=this.mVTLayers[t];r.parseVectorTileFeatures(this,n.parsedFeatures,i)}_createMVTLayer(n){var t={getIDForLayerFeature:this.getIDForLayerFeature,filter:this._filter,style:this.style,name:n};return new MVTLayer(t)}_drawDebugInfo(n){if(this._debug){var u=this.getTileObject(n.id),i=this._tileSize,r=this._tileSize,t=n.canvas.getContext("2d");t.strokeStyle="#000000";t.fillStyle="#FFFF00";t.strokeRect(0,0,i,r);t.font="12px Arial";t.fillRect(0,0,5,5);t.fillRect(0,r-5,5,5);t.fillRect(i-5,0,5,5);t.fillRect(i-5,r-5,5,5);t.fillRect(i/2-5,r/2-5,10,10);t.strokeText(n.zoom+" "+u.x+" "+u.y,i/2-30,r/2-10)}}onClick(n,t,i){this._multipleSelection=i&&i.multipleSelection||!1;i=this._getMouseOptions(i,!1);this._mouseEvent(n,t,i)}onMouseHover(n,t,i){this._multipleSelection=!1;i=this._getMouseOptions(i,!0);this._mouseEvent(n,t,i)}_getMouseOptions(n,t){return{mouseHover:t,setSelected:n.setSelected||!1,toggleSelection:n.toggleSelection===undefined||n.toggleSelection,limitToFirstVisibleLayer:n.limitToFirstVisibleLayer||!1}}_mouseEvent(n,t,i){var f,r,s,e,n;if(n.pixel&&n.latLng){t=t||function(){};var h=i.limitToFirstVisibleLayer||!1,c=this.map.getZoom(),u=MERCATOR.getTileAtLatLng(n.latLng,c),l=this.getTileId(u.z,u.x,u.y),o=this._visibleTiles[l];if(o)for(n.tileContext=o,n.tilePoint=MERCATOR.fromLatLngToTilePoint(this.map,n),f=this._clickableLayers||Object.keys(this.mVTLayers)||[],r=f.length-1;r>=0;r--)if(s=f[r],e=this.mVTLayers[s],e&&(n=e.handleClickEvent(n),this._mouseSelectedFeature(n,t,i),h&&n.feature))break}}_mouseSelectedFeature(n,t,i){if(i.setSelected){var r=n.feature;r?i.mouseHover?r.selected||r.select():i.toggleSelection?r.toggle():r.selected||r.select():i.mouseHover&&this.deselectAllFeatures()}t(n)}deselectAllFeatures(){var e=this.map.getZoom(),i=[],r,n,u,t,f;for(r in this._selectedFeatures)if(n=this._selectedFeatures[r],n){n.setSelected(!1);u=n.getTiles();for(t in u)this.deleteTileDrawn(t),f=this.getTileObject(t),f.zoom==e&&(i[t]=!0)}this.redrawTiles(i);this._selectedFeatures=[]}featureSelected(n){this._multipleSelection||this.deselectAllFeatures();this._selectedFeatures[n.featureId]=n}featureDeselected(n){delete this._selectedFeatures[n.featureId]}setSelectedFeatures(n){var t,r,i,u;for(n.length>1&&(this._multipleSelection=!0),this.deselectAllFeatures(),t=0,r=n.length;t<r;t++){i=n[t];this._selectedFeatures[i]=!1;for(u in this.mVTLayers)this.mVTLayers[u].setSelected(i)}}isFeatureSelected(n){return this._selectedFeatures[n]!=undefined}getSelectedFeatures(){var n=[];for(var t in this._selectedFeatures)n.push(this._selectedFeatures[t]);return n}setFilter(n,t){t=t===undefined||t;this._filter=n;for(var i in this.mVTLayers)this.mVTLayers[i].setFilter(n);t&&this.redrawAllTiles()}setStyle(n,t){t=t===undefined||t;this.style=n;for(var i in this.mVTLayers)this.mVTLayers[i].setStyle(n);t&&this.redrawAllTiles()}setVisibleLayers(n,t){t=t===undefined||t;this._visibleLayers=n;t&&this.redrawAllTiles()}getVisibleLayers(){return this._visibleLayers}setClickableLayers(n){this._clickableLayers=n}redrawAllTiles(){this._resetTileDrawn();this.redrawTiles(this._visibleTiles)}redrawTiles(n){for(var t in n)this.redrawTile(t)}redrawTile(n){this.deleteTileDrawn(n);var t=this._visibleTiles[n];t&&t.vectorTile&&(this.clearTile(t.canvas),this._drawVectorTile(t.vectorTile,t))}clearTile(n){var t=n.getContext("2d");t.clearRect(0,0,n.width,n.height)}setUrl(n,t){t=t===undefined||t;this._url=n;this._resetMVTLayers();t&&this.redrawAllTiles()}}

      var mvtSource = new MVTSource(window.__preloaded_map__, options);

      window.__preloaded_map__.overlayMapTypes.setAt(1, mvtSource);
    }

    injectWindowObj(showPowerLine);

    // clear spinner, restore toggle state
    $("#map-power-line-selector label").html(`Show Power Lines`);
    $("#map-power-line-selector-input").removeAttr('disabled');
  } else if (eventValue != undefined && powerLineEnabled == false) {
    // legit click event that toggled False
    function hidePowerline() {
      window.__preloaded_map__.overlayMapTypes.setAt(1, null);
    }

    injectWindowObj(hidePowerline);
  }

  chrome.storage.sync.set({
    redfin_mapPowerLineEnabled: powerLineEnabled
  }, function() {
    if (eventValue != undefined) {
      showStatusBar(`Power Line ${powerLineEnabled ? 'Enabled' : 'Disabled'}`)
    }
  });
}

function updateMapPhoneTowerWithEvent(event) {
  var eventValue = this.checked

  updateMapPhoneTower(event.data.userData, eventValue)
}

function updateMapPhoneTower(userData, eventValue) {
  var phoneTowerEnabled = eventValue;

  if (phoneTowerEnabled == undefined) {
    phoneTowerEnabled = userData.redfin_mapPhoneTowerEnabled;
  } else {
    userData.redfin_mapPhoneTowerEnabled = phoneTowerEnabled;
  }

  if (phoneTowerEnabled) {
    var loadingSpinHTML = `Loading Phone Towers ... <span class="spinner-border spinner-border-sm text-warning" role="status" aria-hidden="true" style="margin-left: 10px;"></span>`;

    // set toggle state
    $("#map-phone-tower-selector label").html(loadingSpinHTML);
    $("#map-phone-tower-selector-input").attr('disabled', true);

    function showPhoneTower() {
      window.homeluten_celltowerDataLayer = new google.maps.Data({
        map: window.__preloaded_map__
      })
      window.homeluten_celltowerDataLayer.loadGeoJson(
        "https://api.homeluten.com/celltower"
      );

      window.homeluten_celltowerDataLayer.setStyle({
        icon: 'https://homeluten.com/images/cell-tower-30.svg'
      });

      window.homeluten_celltowerDataLayer.addListener('click', function(event) {
        // Create popup, attach to click event handler
        const contentString =
        `<div class="content">
          <h1 class="firstHeading"><b>${event.feature.getProperty('Licensee')}</b></h1>
          <br>
          <div classs="bodyContent">
            <b>Address:</b>
            <br>
            ${event.feature.getProperty('LocAdd')}
            <br>
            ${event.feature.getProperty('LocCity')}, ${event.feature.getProperty('LocState')}
            <br>
          </div>
        </div>`

        const infowindow = new google.maps.InfoWindow({
          content: contentString,
          maxWidth: 200
        });

        infowindow.setPosition(event.latLng);
        infowindow.setOptions({pixelOffset: new google.maps.Size(0,-34)});

        infowindow.open({
          map: window.__preloaded_map__,
          shouldFocus: false,
        });
      });
    }

    injectWindowObj(showPhoneTower);

    // clear spinner, restore toggle state
    $("#map-phone-tower-selector label").html(`Show Cell Phone Towers`);
    $("#map-phone-tower-selector-input").removeAttr('disabled');
  } else if (eventValue != undefined && phoneTowerEnabled == false) {
    // legit click event that toggled False
    function hidePhoneTower() {
      if (window.homeluten_celltowerDataLayer) {
        window.homeluten_celltowerDataLayer.setMap(null)
      }
    }

    injectWindowObj(hidePhoneTower);
  }

  chrome.storage.sync.set({
    redfin_mapPhoneTowerEnabled: phoneTowerEnabled
  }, function() {
    if (eventValue != undefined) {
      showStatusBar(`Cell Phone Tower ${phoneTowerEnabled ? 'Enabled' : 'Disabled'}`)
    }
  });
}

function updateMapPowerStationWithEvent(event) {
  var eventValue = this.checked

  updateMapPowerStation(event.data.userData, eventValue)
}

function updateMapPowerStation(userData, eventValue) {
  var powerStationEnabled = eventValue;

  if (powerStationEnabled == undefined) {
    powerStationEnabled = userData.redfin_mapPowerStationEnabled;
  } else {
    userData.redfin_mapPowerStationEnabled = powerStationEnabled;
  }

  if (powerStationEnabled) {
    var loadingSpinHTML = `Loading Phone Towers ... <span class="spinner-border spinner-border-sm text-warning" role="status" aria-hidden="true" style="margin-left: 10px;"></span>`;

    // set toggle state
    $("#map-power-station-selector label").html(loadingSpinHTML);
    $("#map-power-station-selector-input").attr('disabled', true);

    function showPowerStation() {
      window.homeluten_powerStationDataLayer = new google.maps.Data({
        map: window.__preloaded_map__
      })
      window.homeluten_powerStationDataLayer.loadGeoJson(
        "https://api.homeluten.com/powerstation"
      );

      window.homeluten_powerStationDataLayer.setStyle({
        icon: 'https://homeluten.com/images/power-station-30.svg'
      });

      window.homeluten_powerStationDataLayer.addListener('click', function(event) {
        // Create popup, attach to click event handler
        const contentString =
        `<div class="content">
          <h1 class="firstHeading"><b>${event.feature.getProperty('NAME')}</b></h1>
          <br>
          <div classs="bodyContent">
            <b>Description:</b>
            <br>
            ${event.feature.getProperty('NAICS_DESC')}
            <br>
            <br>
            <b>Max Volt:</b> ${event.feature.getProperty('MAX_VOLT')}
            <br>
            <br>
            <b>Address:</b>
            ${event.feature.getProperty('CITY')}, ${event.feature.getProperty('STATE')} ${event.feature.getProperty('ZIP')}
            <br>
          </div>
        </div>`

        const infowindow = new google.maps.InfoWindow({
          content: contentString,
          maxWidth: 200
        });

        infowindow.setPosition(event.latLng);
        infowindow.setOptions({pixelOffset: new google.maps.Size(0,-34)});

        infowindow.open({
          map: window.__preloaded_map__,
          shouldFocus: false,
        });
      });
    }

    injectWindowObj(showPowerStation);

    // clear spinner, restore toggle state
    $("#map-power-station-selector label").html(`Show Power Stations`);
    $("#map-power-station-selector-input").removeAttr('disabled');
  } else if (eventValue != undefined && powerStationEnabled == false) {
    // legit click event that toggled False
    function hidePowerStation() {
      if (window.homeluten_powerStationDataLayer) {
        window.homeluten_powerStationDataLayer.setMap(null)
      }
    }

    injectWindowObj(hidePowerStation);
  }

  chrome.storage.sync.set({
    redfin_mapPowerStationEnabled: powerStationEnabled
  }, function() {
    if (eventValue != undefined) {
      showStatusBar(`Power Stations ${powerStationEnabled ? 'Enabled' : 'Disabled'}`)
    }
  });
}

// END: pro section


function reloadMap() {
  function loadMap (options) {
    window.__preloaded_map__.setOptions(options);
    window.__preloaded_map__.get('streetView').setOptions({
      addressControlOptions: { 
        position: 1,
      },
      zoomControlOptions: {
        position: 1
      },
      panControlOptions: {
        position: 1
      },
      fullscreenControl: false
    });

    // set empty overlay for feature prep
    [0, 1, 2].map(function(index) {
      window.__preloaded_map__.overlayMapTypes.set(index, null)
    });
  }

  injectWindowObj(loadMap, mapOptions);
}

// Listen to lazyload DOM changes
function initMutationObserver(userData) {
  var observer = new MutationObserver(function(mutations, observer) {
    // fired when a mutation occurs
    updateMapSizeRange(userData);
    updateMapSuperfund(userData);
    // TODO: restore once official
    // updateMapCrime(userData);

    // PRO section
    if (validProMembership(userData)) {
      updateMapSexOffender(userData)
    }
  });

  // define what element should be observed by the observer
  // and what types of mutations trigger the callback
  observer.observe(document.getElementById('right-container'), {
    childList: true,
    subtree: true
  });
}

// contextual menu on the map page
function updateContextMenu() {
  function showContextMenu() {
    window.__preloaded_map__.addListener('contextmenu', function(event) {
      $.ajax({
        url: `https://api.homeluten.com/geocode?point=${event?.latLng?.toUrlValue()}`,
        dataType: 'json',
        success: function(data){
          // load elevation
          var elevation = data?.resourceSets[0]?.resources[0]?.elevations[0] || 'Not Available'
          // Create popup, attach to rightclick event handler
          const contentString =
          `<div class="content">
            <h1 class="firstHeading"><b>Homeluten Insight</b></h1>
            <br>
            <div classs="bodyContent">
              <b>Lat/Lng:</b>
              <br>
              ${event.latLng.toUrlValue()}
              <br>
              <br>
              <b>Elevation:</b>
              <br>
              ${elevation}m / ${(elevation * 3.28084).toFixed()}ft
              <br>
            </div>
          </div>`

          const infowindow = new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 200
          });

          infowindow.setPosition(event.latLng);

          infowindow.open({
            map: window.__preloaded_map__,
            shouldFocus: false,
          });
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
        timeout: 10000
      });
    });
  }

  injectWindowObj(showContextMenu);
}

// main entry
function redfinMapPageModule(userData) {
  initMutationObserver(userData);
  redfinMapPageHandler(userData);

  chrome.runtime.sendMessage({
      message: "map_page_loaded",
      url: window.location.href,
      userData: userData
  });
}
