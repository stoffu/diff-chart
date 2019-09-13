function get_chart(chartData, cryptonote_config, offset) {
    for (var i = 0; i < chartData.length; ++i) {
        chartData[i].date = new Date(1000 * chartData[i][0]);
        chartData[i].height = i + (offset === undefined ? 0 : offset.height);
        chartData[i].coin_supply = bigInt(chartData[i][3]);
        for (var j = 0; j < chartData[i][6].length; ++j)
            chartData[i].coin_supply = chartData[i].coin_supply.minus(chartData[i][6][j][4]);   // subtract fees
        if (i === 0 && offset !== undefined)
            chartData[i].coin_supply = chartData[i].coin_supply.plus(offset.supply);
        if (i > 0)
            chartData[i].coin_supply = chartData[i].coin_supply.plus(chartData[i - 1].coin_supply);
        chartData[i].coin_supply_str = print_money(chartData[i].coin_supply, cryptonote_config.CRYPTONOTE_DISPLAY_DECIMAL_POINT);
        chartData[i].coin_supply_real = chartData[i].coin_supply.toJSNumber() / Math.pow(10, cryptonote_config.CRYPTONOTE_DISPLAY_DECIMAL_POINT);
        // projected supply
        var target = cryptonote_config.get_difficulty_target((offset === undefined ? 0 : offset.height) + i);
        var target_minutes = target / 60;
        var emission_speed_factor = cryptonote_config.get_emission_speed_factor(target_minutes);
        var already_generated_coins = i == 0 ? (offset === undefined ? bigInt(0) : bigInt(offset.supply_proj)) : chartData[i - 1].coin_supply_proj;
        var base_reward = bigInt(cryptonote_config.MONEY_SUPPLY).minus(already_generated_coins).shiftRight(emission_speed_factor);
        if (base_reward.lesser(cryptonote_config.FINAL_SUBSIDY_PER_MINUTE * target_minutes))
        {
          base_reward = bigInt(cryptonote_config.FINAL_SUBSIDY_PER_MINUTE * target_minutes);
        }
        chartData[i].coin_supply_proj = base_reward.plus(already_generated_coins);
        chartData[i].coin_supply_proj_str = print_money(chartData[i].coin_supply_proj, cryptonote_config.CRYPTONOTE_DISPLAY_DECIMAL_POINT);
        chartData[i].coin_supply_proj_real = chartData[i].coin_supply_proj.toJSNumber() / Math.pow(10, cryptonote_config.CRYPTONOTE_DISPLAY_DECIMAL_POINT);
    }

    if (offset === undefined)
        chartData.shift();

    var chart = AmCharts.makeChart("chartdiv", {
        "type": "serial",
        "theme": "light",
        "marginRight": 80,
        "autoMarginOffset": 20,
        "marginTop": 7,
        "dataProvider": chartData,
        "valueAxes": [{
            "axisAlpha": 0,
        }],
        "mouseWheelZoomEnabled": true,
        "graphs": [{
            "id": "g1",
            "lineColor": "#cc9900",
            "balloonText": "Supply: <b>[[coin_supply_str]]</b>\n(Proj: [[coin_supply_proj_str]])\nHeight: <b>[[height]]</b>",
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "hideBulletsCount": 50,
            "title": "coin supply",
            "valueField": "coin_supply_real",
            "useLineColorForBulletBorder": true,
            "balloon":{
                "cornerRadius": 10,
            }
        },{
            "id": "g2",
            "lineColor": "#447700",
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "hideBulletsCount": 50,
            "title": "projected coin supply",
            "valueField": "coin_supply_proj_real",
            "useLineColorForBulletBorder": true,
            "showBalloon": false,
            "hidden": true,
        }],
        "chartScrollbar": {
            "autoGridCount": true,
            "graph": "g1",
            "scrollbarHeight": 40
        },
        "chartCursor": {
           "pan": false
        },
        "categoryField": "date",
        "categoryAxis": {
            "parseDates": true,
            "minPeriod": "ss",
            "axisColor": "#DADADA",
            "dashLength": 1,
            "minorGridEnabled": true
        },
        "export": {
            "enabled": true,
            "position": "bottom-right"
        }
    });

    // this method is called when chart is first inited as we listen for "rendered" event
    function zoomChart() {
        // different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
        chart.zoomToIndexes(0, chartData.length - 1);
    }
    chart.addListener("rendered", zoomChart);
    zoomChart();

    return chart;
}
