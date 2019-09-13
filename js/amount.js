function get_chart(chartData, cryptonote_config, offset) {
    if (offset === undefined)
        chartData.shift();
    var chartData_amt = [];
    var block_date = null;

    for (var i = 0; i < chartData.length; ++i) {
        var block_date_new = new Date(1000 * chartData[i][0]);
        block_date_new.setHours(0);
        block_date_new.setMinutes(0);
        block_date_new.setSeconds(0);
        if (block_date === null || block_date < block_date_new) {
            block_date = block_date_new;
            chartData_amt.push({
                "date": block_date,
                "amounts": [],
                "num_txes": 0,
            });
        }
        for (var j = 0; j < chartData[i][6].length; ++j) {
            chartData_amt[chartData_amt.length - 1].amounts.push(chartData[i][6][j][6]);
        }
        chartData_amt[chartData_amt.length - 1].num_txes += chartData[i][6].length;
    }

    for (var i = 0; i < chartData_amt.length; ++i) {
        var stats = getStats(chartData_amt[i].amounts);
        chartData_amt[i].max_str = print_money(stats.max, cryptonote_config.CRYPTONOTE_DISPLAY_DECIMAL_POINT);
        chartData_amt[i].min_str = print_money(stats.min, cryptonote_config.CRYPTONOTE_DISPLAY_DECIMAL_POINT);
        chartData_amt[i].mean_str = print_money(Math.floor(stats.mean), cryptonote_config.CRYPTONOTE_DISPLAY_DECIMAL_POINT);
        chartData_amt[i].total_str = print_money(stats.total, cryptonote_config.CRYPTONOTE_DISPLAY_DECIMAL_POINT);
        chartData_amt[i].max_scaled = stats.max * Math.pow(10, -cryptonote_config.CRYPTONOTE_DISPLAY_DECIMAL_POINT);
        chartData_amt[i].mean_scaled = stats.mean * Math.pow(10, -cryptonote_config.CRYPTONOTE_DISPLAY_DECIMAL_POINT);
        chartData_amt[i].total_scaled = stats.total * Math.pow(10, -cryptonote_config.CRYPTONOTE_DISPLAY_DECIMAL_POINT);
    }

    var chart = AmCharts.makeChart("chartdiv", {
        "type": "serial",
        "theme": "light",
        "marginRight": 80,
        "autoMarginOffset": 20,
        "marginTop": 7,
        "dataProvider": chartData_amt,
        "valueAxes": [{
            "id":"va_normal",
            "color": "#55bbcc",
            "axisColor": "#55bbcc",
            "axisThickness": 2,
            "axisAlpha": 1,
            "position": "left"
        }, {
            "id":"va_extreme",
            "color": "#666600",
            "axisColor": "#666600",
            "axisThickness": 2,
            "axisAlpha": 0.5,
            "gridAlpha": 0,
            "position": "right"
        }],
        "mouseWheelZoomEnabled": true,
        "graphs": [{
            "id": "g_mean",
            "valueAxis": "va_normal",
            "lineColor": "#55bbcc",
            "lineThickness": 2,
            "balloonText": "<b>[[mean_str]]</b>\nMax: [[max_str]]\nMin: [[min_str]]\nTotal: [[total_str]]\n#Tx: [[num_txes]]",
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "hideBulletsCount": 50,
            "title": "Mean",
            "valueField": "mean_scaled",
            "useLineColorForBulletBorder": true,
        },{
            "id": "g_max",
            "valueAxis": "va_extreme",
            "type": "step",
            "lineColor": "#333300",
            "lineAlpha": 0.5,
            "showBalloon" : false,
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "hideBulletsCount": 50,
            "title": "Max",
            "valueField": "max_scaled",
            "useLineColorForBulletBorder": true,
        },{
            "id": "g_total",
            "valueAxis": "va_extreme",
            "lineColor": "#666600",
            "lineAlpha": 0.5,
            "showBalloon" : false,
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "hideBulletsCount": 50,
            "title": "Max",
            "valueField": "total_scaled",
            "useLineColorForBulletBorder": true,
        }],
        "chartScrollbar": {
            "autoGridCount": true,
            "graph": "g_mean",
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
