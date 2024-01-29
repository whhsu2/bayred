function loadSuperfundData({lat, lng}) {
  $.ajax({
    url: `https://api.homeluten.com/superfund?lat=${lat}&lng=${lng}&radius=1`,
    dataType: 'json',
    success: function(data){
      var count = data?.Results?.FRSFacility?.length

      $('#superfund-status .spinner-border').hide()
      $('#superfund-status .status-number').text(count)
      colorCodeSuperfunds(count, '#superfund-status')
    },
    error: handleAjaxTimeout,
    timeout: 30000
  });
}

function loadSoundscoreData(userData, locationData) {
  $.ajax({
    url: `https://api.homeluten.com/soundscore?lat=${locationData.lat}&lng=${locationData.lng}&radius=1`,
    dataType: 'json',
    success: function(data){
      // return if no data
      if (data?.result.length == 0) {
        $('#noise-status .spinner-border').hide()
        $('#noise-status .status-number').text(`N/A`)

        return
      }

      var scoreData = data?.result[0]
      $('#noise-score .spinner-border').hide()
      $('#noise-score .status-number').text(scoreData.score)
      colorCodeNumber(scoreData.score, '#noise-score')

      $('#traffic-score .spinner-border').hide()
      $('#traffic-score .status-number').text(scoreData.traffictext)
      colorCodeText(scoreData.traffictext, '#traffic-score')

      $('#local-score .spinner-border').hide()
      $('#local-score .status-number').text(scoreData.localtext)

      $('#airport-score .spinner-border').hide()

      // PRO: load airport only for pro
      if (validProMembership(userData)) {
        $('#airport-score .status-number').text(scoreData.airportstext)
        colorCodeText(scoreData.airportstext, '#airport-score')
      } else {
        $('#airport-score .status-number').html(PRO_UNLOCK_BUTTON);
        // init() because this needs to be executed after ajax resolve
        initProModal()
      }
    },
    error: handleAjaxTimeout,
    timeout: 30000
  });
}

function loadSexOffender(userData, locationData, radius = 0.1) {
  if (radius > 1) {
    $('#sex-offender .spinner-border').hide()
    $('#sex-offender .radius-text').text(radius)
    $('#sex-offender .status-number').text('0')
    return
  }

  if (validProMembership(userData)) {
    $.ajax({
      url: `https://api.homeluten.com/sexoffender?lat=${locationData.lat}&lng=${locationData.lng}&radius=${radius}`,
      dataType: 'json',
      success: function(data){
        if (data?.offenders?.length == 0) {
          loadSexOffender(userData, locationData, radius * 2)
          return
        }

        $('#sex-offender .spinner-border').hide()
        // PRO: load race only for pro
        $('#sex-offender .status-number').text(data?.offenders?.length || 0)
        if (radius < 0.5) {
          colorCodeText(`${data?.offenders?.length > 0}`, '#sex-offender')
        }

        $('#sex-offender .radius-text').text(radius)
      },
      error: handleAjaxTimeout,
      timeout: 30000
    });
  } else {
    $('#sex-offender .spinner-border').hide()
    $('#sex-offender .radius-label').hide()
    $('#sex-offender .status-number').html(PRO_UNLOCK_BUTTON)
    initProModal()
  }
}

function loadPaperBidding(userData, context, locationData) {
  // Listing only feature
  if (context?.isRental) {
    return
  }

  paperBiddingInit(userData, locationData)
}

function loadEthnicity(userData, locationData, radius = 0.1) {
  if (radius > 100) {
    $('#local-race .spinner-border').hide()
    $('#local-race .radius-text').text(radius)
    $('#local-race .status-number').text('N/A')
    return
  }

  if (validProMembership(userData)) {
    $.ajax({
      url: `https://api.homeluten.com/census?geo=block&lat=${locationData.lat}&lng=${locationData.lng}&radius=${radius}`,
      dataType: 'json',
      success: function(data){
        if (data.asian == '') {
          loadEthnicity(userData, locationData, radius * 2)
          return
        }

        $('#local-race .spinner-border').hide()
        // PRO: load race only for pro
        $('#local-race .status-number').html(RACE_PIECHART_BUTTON)
        $("#homeluten-container").append(RACE_PINECHART_CARD)
        $('#local-race .radius-text').text(radius)

        drawEthnicityChart(data, radius);
      },
      error: handleAjaxTimeout,
      timeout: 30000
    });
  } else {
    $('#local-race .spinner-border').hide()
    $('#local-race .radius-label').hide()
    $('#local-race .status-number').html(PRO_UNLOCK_BUTTON)
    initProModal()
  }
}

function loadIncome(userData, locationData, radius = 0.1) {
  if (radius > 100) {
    $('#local-income .spinner-border').hide()
    $('#local-income .radius-text').text(radius)
    $('#local-income .status-number').text('N/A')
    return
  }

  if (validProMembership(userData)) {
    $.ajax({
      url: `https://api.homeluten.com/census?geo=tract&lat=${locationData.lat}&lng=${locationData.lng}&radius=${radius}`,
      dataType: 'json',
      success: function(data){
        if (data.income == '') {
          loadIncome(userData, locationData, radius * 2)
          return
        }

        $('#local-income .spinner-border').hide()
        // PRO: load income only for pro
        $('#local-income .radius-text').text(radius)
        $('#local-income .status-number').text(`${currencyFormatter(data.income)}`)
      },
      error: handleAjaxTimeout,
      timeout: 30000
    });
  } else {
    $('#local-income .spinner-border').hide()
    $('#local-income .radius-label').hide()
    $('#local-income .status-number').html(PRO_UNLOCK_BUTTON);
    initProModal()
  }
}

function loadFlood(userData, locationData) {
  if (validProMembership(userData)) {
    $('#fema-flood .spinner-border').hide()
    // PRO: load flood only for pro
    FLOOD_VIEW_BUTTON = `
      <a id="view-flood" class="badge btn btn-outline-info align-middle" href="https://msc.fema.gov/portal/search?AddressQuery=${locationData.lng}%2C%20${locationData.lat}" target="_blank" rel="noopener noreferrer">View</a>
    `
    $('#fema-flood .status-number').html(FLOOD_VIEW_BUTTON)
  } else {
    $('#fema-flood .spinner-border').hide()
    $('#fema-flood .status-number').html(PRO_UNLOCK_BUTTON);
    initProModal()
  }
}

function loadAnalysis(userData, locationData) {
  let saleRadius, soldRadius

  if (validProMembership(userData)) {
    function saleAjax(locationData, radius) {
      saleRadius = radius
      // if no data, return operation
      if (radius > 100) {
        return []
      }

      return $.ajax({
        url: `https://api.homeluten.com/cma?lat=${locationData.lat}&lng=${locationData.lng}&radius=${radius}`,
        dataType: 'json',
        success: function(data){
          if (!data?.payload?.homes?.length) {
            saleAjax(locationData, radius * 2)
            return
          }
        },
        error: handleAjaxTimeout,
        timeout: 30000
      });
    }

    function soldAjax(locationData, radius) {
      soldRadius = radius
      // if no data, return operation
      if (radius > 100) {
        return []
      }

      return $.ajax({
        url: `https://api.homeluten.com/cma?lat=${locationData.lat}&lng=${locationData.lng}&radius=${radius}&sold=true`,
        dataType: 'json',
        success: function(data){
          if (!data?.payload?.homes?.length) {
            soldAjax(locationData, radius * 2)
            return
          }
        },
        error: handleAjaxTimeout,
        timeout: 30000
      });
    }

    // draw graph when all ajax resolved
    $.when(saleAjax(locationData, 1), soldAjax(locationData, 1)).done(function(saleAjax, soldAjax) {
      const saleHomes = saleAjax[0]?.payload?.homes
      const soldHomes = soldAjax[0]?.payload?.homes

      // return if no data
      if (!saleHomes && !soldHomes) {
        $('#market-analysis .spinner-border').hide()
        $('#market-analysis .radius-text').text(radius)
        $('#market-analysis .status-number').text('N/A')
      } else {
        $('#market-analysis .spinner-border').hide()
        $('#market-analysis .status-number').html(MARKET_BUBBLECHART_BUTTON)
        $("#homeluten-container").append(MARKET_BUBBLECHART_CARD)
        drawMarketChart({saleHomes, soldHomes}, {saleRadius, soldRadius})
      }
    });
  } else {
    $('#market-analysis .spinner-border').hide()
    $('#market-analysis .radius-label').hide()
    $('#market-analysis .status-number').html(PRO_UNLOCK_BUTTON);
    initProModal()
  }
}

function drawEthnicityChart(data, payload) {
  var xValues = ["Asian", "Black", "Hispanic", "Indian", "Island", "Multi", "White"];
  var yValues = [data.asian, data.black, data.hispanic, data.indian, data.island, data.multi, data.white];
  var barColors = [
    "#F44336",
    "#673AB7",
    "#3F51B5",
    "#00BCD4",
    "#009688",
    "#4CAF50",
    "#FFC107"
  ];

  let delayed

  new Chart("homeluten-race-chart", {
    type: "doughnut",
    data: {
      labels: xValues,
      datasets: [{
        backgroundColor: barColors,
        data: yValues,
        hoverOffset: 4
      }]
    },
    options: {
      animation: {
        onComplete: () => {
          delayed = true;
        },
        delay: (context) => {
          let delay = 0;
          if (context.type === 'data' && context.mode === 'default' && !delayed) {
            delay = context.dataIndex * 300 + context.datasetIndex * 100;
          }
          return delay;
        },
      },
      plugins: {
        title: {
          display: true,
          text: `Ethnicity Distribution within ${payload} Mi of This Home`,
          font: {
            size: 18
          }
        },
        legend: {
          position: 'bottom',
        }
      }
    }
  });
}

bubbleClickHandler = (event, activeElements, chart) => {
  const activePoints = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);

  if (activePoints.length > 0) {
    const datasetLabel = chart.data.labels[activePoints[0].index]
    const data = chart.data.datasets[activePoints[0].datasetIndex].data[activePoints[0].index]

    // open listing in new tab
    window.open(`https://www.redfin.com${data.url || ''}`, '_blank');
  }
}

function generateHomeDot(home) {
  return {
    x: home.pricePerSqFt?.value,
    y: home.price?.value / 1000,
    r: home.sqFt?.value / 1000,
    url: home.url,
    price: currencyFormatter(home.price?.value),
    beds: home.beds || 'See Listing',
    baths: home.baths || 'See Listing',
    lotSize: home.lotSize?.value || 'See Listing',
    // TODO: fix, not working
    // photoUrl: home.mlsId ? `https://ssl.cdn-redfin.com/photo/10/islphoto/${home.mlsId.value.slice(-3)}/genIslnoResize.${home.mlsId.value}_0.jpg` : 'https://homeluten.com/images/no-pictures.png'
  }
}

function drawMarketChart(data, radiusList) {
  // return if empty data
  if (data?.saleHomes?.length == 0 && data?.soldHomes?.length == 0) {
    return
  }

  const currentHomeData = getCurrentPageHomeInfo()
  let saleHomeCount = 0, soldHomeCount = 0, pendingHomeCount = 0, saleHomeData = [], soldHomeData = [], pendingHomeData = []

  // validate home data, include pendings in forsale homes
  data?.saleHomes?.forEach(function(home) {
    // skip the current home
    if (home?.mlsId?.value == currentHomeData?.mlsId) {
      return
    } else if (home.pricePerSqFt.value) {
      if (home?.mlsStatus?.startsWith('Pending') || home?.mlsStatus?.startsWith('Contingent')) {
        pendingHomeCount += 1
        pendingHomeData.push(generateHomeDot(home))
      } else {
        saleHomeCount += 1
        saleHomeData.push(generateHomeDot(home))
      }
    }
  })

  data?.soldHomes?.forEach(function(home) {
    // skip the current home
    if (home?.mlsId?.value == currentHomeData.mlsId || home.sashes[0]?.sashTypeName != 'Sold') {
      return
    } else if (home.pricePerSqFt.value) {
      soldHomeCount += 1
      soldHomeData.push(generateHomeDot(home))
    }
  })

  const chartData = {
    datasets: [{
      label: `This Home`,
      data: [generateHomeDot(currentHomeData)],
      backgroundColor: 'rgb(220, 53, 69)'
    }, {
      label: `Listing (${saleHomeCount} Homes in ${radiusList.saleRadius} Mi)`,
      data: saleHomeData,
      backgroundColor: 'rgb(40, 167, 69)'
    },{
      label: `Pending (${pendingHomeCount} Homes in ${radiusList.saleRadius} Mi)`,
      data: pendingHomeData,
      backgroundColor: 'rgb(255, 193, 7)'
    }, {
      label: `Sold (${soldHomeCount} Homes in ${radiusList.soldRadius} Mi - Last 30 Days)`,
      data: soldHomeData,
      backgroundColor: 'rgb(0, 123, 255)'
    }]
  };

  new Chart("homeluten-market-analysis-chart", {
    type: "bubble",
    data: chartData,
    options: {
      onClick: bubbleClickHandler,
      onHover: (evt, activeEls) => {
        activeEls.length > 0 ? evt.chart.canvas.style.cursor = 'pointer' : evt.chart.canvas.style.cursor = 'default';
      },
      scales: {
        y: {
          title: {
            display: true,
            text: 'Sale Price'
          },
          ticks: {
            callback: function(value, index, ticks) {
              return currencyFormatter(value * 1000)
            }
          }
        },
        x: {
          title: {
            display: true,
            text: '$/sqft'
          },
          ticks: {
            callback: currencyFormatter
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: `Nearby Sale/Sold Home Stats`,
          font: {
            size: 18
          }
        },
        subtitle: {
          display: true,
          text: 'Dot Size = Home sqft; [Zoom] Mouse Select/Scroll; [Pan] Shift + Mouse Drag',
          padding: {
            bottom: 20
          }
        },
        legend: {
          position: 'bottom'
        },
        zoom: {
          pan: {
            enabled: true,
            modifierKey: `shift`
          },
          zoom: {
            wheel: {
              enabled: true,
            },
            drag: {
              enabled: true
            },
            mode: 'xy',
          },
          limits: {
            x: {min: 'original', max: 'original'},
            y: {min: 'original', max: 'original'}
          }
        },
        tooltip: {
          enabled: false,
          external: externalTooltipHandler
        }
      }
    }
  });
}

// Build custom tooltip for graph bubbles
const getOrCreateTooltip = (chart) => {
  let tooltipEl = chart.canvas.parentNode.querySelector('div');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    // tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
    tooltipEl.style.borderRadius = '3px';
    tooltipEl.style.color = 'white';
    tooltipEl.style.opacity = 1;
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.transform = 'translate(-50%, 0)';
    tooltipEl.style.transition = 'all .1s ease';

    const table = document.createElement('table');
    table.style.margin = '0px';

    tooltipEl.appendChild(table);
    chart.canvas.parentNode.appendChild(tooltipEl)
  }

  return tooltipEl;
};

const externalTooltipHandler = (context) => {
  // Tooltip Element
  const {chart, tooltip} = context
  const tooltipEl = getOrCreateTooltip(chart)

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  // Set Text
  if (tooltip.body) {
    const tooltipCard = `
      <div class="card shadow-sm">
        <div class="card-body text-dark">
          <h5 class="card-title">
            <span style="background: ${tooltip.labelColors[0].backgroundColor}; border-color: ${tooltip.labelColors[0].borderColor}; border-width: 2px; margin-right: 10px; height: 15px; width: 30px; display: inline-block;"></span>
            <span>${tooltip.dataPoints[0].raw.price}</span>
          </h5>
          <div class="card-content" style="font-size: 12px;">
            <table class="table table-light table-striped">
              <thead>
                <tr></tr>
              </thead>
              <tbody>
                <tr>
                  <th>
                    Bed
                  </th>
                  <td>
                    ${tooltip.dataPoints[0].raw.beds}
                  </td>
                </tr>
                <tr>
                  <th>
                    Bath
                  </th>
                  <td>
                    ${tooltip.dataPoints[0].raw.baths}
                  </td>
                </tr>
                <tr>
                  <th>
                    Lot
                  </th>
                  <td>
                    ${isNaN(tooltip.dataPoints[0].raw.lotSize) ? tooltip.dataPoints[0].raw.lotSize : (tooltip.dataPoints[0].raw.lotSize / 43560).toFixed(2) + ' ac'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `

    const tableRoot = tooltipEl.querySelector('table');

    // Remove old children
    while (tableRoot.firstChild) {
      tableRoot.firstChild.remove();
    }

    // Add new children
    $(tableRoot).append(tooltipCard)
  }

  const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = positionX + tooltip.caretX + 'px';
  tooltipEl.style.top = positionY + tooltip.caretY + 'px';
  tooltipEl.style.font = tooltip.options.bodyFont.string;
  tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
};

function getCurrentPageHomeInfo() {
  const currentHomeData = {}

  if (/https:\/\/www\.redfin\.com\//.test(window.location.href)) {
    currentHomeData.price = {value: parseFloat($('.HomeInfoV2 .address-map-section [data-rf-test-id="abp-price"] .statsValue').text().replace(/\D/g,''))}
    currentHomeData.sqFt = {value: parseFloat($('.HomeInfoV2 .address-map-section [data-rf-test-id="abp-sqFt"] .statsValue').text().replace(/\D/g,''))}
    currentHomeData.pricePerSqFt = {value: currentHomeData.price.value / currentHomeData.sqFt.value}
    currentHomeData.mlsId = $('.listingInfoSection .sourceContent').text().replace(/\D/g,'')
    currentHomeData.isSold = $('.ListingStatusBannerSection--statusDot').css('background-color') == 'rgb(93, 138, 203)' || ['Sold', 'Closed'].includes($('.keyDetailsList .keyDetail:first-child span.content').first().text())
  } else if (/https:\/\/www\.zillow\.com\//.test(window.location.href)) {
    currentHomeData.price = {value: parseFloat($('.ds-home-details-chip .ds-summary-row span:first').text().replace(/\D/g,''))}
    // sold home
    if (!currentHomeData.price.value || isNaN(currentHomeData.price.value)) {
      currentHomeData.price = {value: parseFloat($('.summary-container strong').text().replace(/\D/g,''))}
    }

    currentHomeData.sqFt = {value: parseFloat($('.ds-home-details-chip .ds-summary-row .ds-bed-bath-living-area-container > span:last-child span:first-child').first().text().replace(/\D/g,''))}
    // sold home
    if (!currentHomeData.sqFt.value || isNaN(currentHomeData.sqFt.value)) {
      currentHomeData.sqFt = {value: parseFloat($('[data-testid="bed-bath-beyond"] > span:last-child').text().replace(/\D/g,''))}
    }
    currentHomeData.pricePerSqFt = {value: currentHomeData.price.value / currentHomeData.sqFt.value}

    currentHomeData.mlsId = $('[data-cft-name="listing-attribution-overview"] + div > span:nth-child(2)').text().replace(/\D/g, '')
    currentHomeData.isSold = ['Sold', 'Off market'].includes($('.summary-container div[class^="Spacer"] > span button > span[class^="Text"]').text())
  } else if (/https:\/\/www\.realtor\.com\//.test(window.location.href)) {
    currentHomeData.price = {value: parseFloat($('[data-testid="list-price"]').text().replace(/\D/g, ''))}
    if (!currentHomeData.price.value || isNaN(currentHomeData.price.value)) {
      currentHomeData.price = {value: parseFloat($('[data-testid="last-sold-container"] h2').text().replace(/\D/g, ''))}
    }

    currentHomeData.sqFt = {value: parseFloat($('[data-testid="property-meta-sqft"] span.meta-value').first().text().replace(/\D/g, ''))}
    currentHomeData.pricePerSqFt = {value: currentHomeData.price.value / currentHomeData.sqFt.value}

    currentHomeData.mlsId = $('.listing-provider .meta-data .meta:nth-child(3)').text().replace(/\D/g, '')
    if (!currentHomeData.mlsId || isNaN(currentHomeData.mlsId)) {
      currentHomeData.mlsId = $('#leadForm table tr:nth-child(4) td:last-child').text().replace(/\D/g, '')
    }

    currentHomeData.isSold = ['Off Market', 'Just Sold'].includes($('[data-label="property-meta-status"]').text())
  }

  return currentHomeData
}
