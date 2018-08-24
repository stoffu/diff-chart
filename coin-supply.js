function get_chart(chartData, decimal_point) {
    for (var i = 0; i < chartData.length; ++i) {
        chartData[i].date = new Date(1000 * chartData[i][0]);
        chartData[i].height = i;
        chartData[i].coin_supply = bigInt(chartData[i][2]);
        for (var j = 0; j < chartData[i][4].length; ++j)
            chartData[i].coin_supply = chartData[i].coin_supply.minus(chartData[i][4][j][4]);
        if (i > 0)
            chartData[i].coin_supply = chartData[i].coin_supply.plus(chartData[i - 1].coin_supply);
        chartData[i].coin_supply_str = print_money(chartData[i].coin_supply, decimal_point);
        chartData[i].coin_supply_real = chartData[i].coin_supply.toJSNumber() / Math.pow(10, decimal_point);
    }

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
            "balloonText": "Supply: <b>[[coin_supply_str]]</b>\nHeight: <b>[[height]]</b>",
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
