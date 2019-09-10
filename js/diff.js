function get_chart(chartData, cryptonote_config, offset) {
    if (offset === undefined)
        chartData.shift();

    for (var i = 0; i < chartData.length; ++i) {
        chartData[i].date = new Date(1000 * chartData[i][0]);
        chartData[i].height = i + (offset === undefined ? 1 : offset.height);
        chartData[i].difficulty = chartData[i][2];
        chartData[i].hashrate = formatHashrate(chartData[i].difficulty / cryptonote_config.get_difficulty_target(chartData[i].height), 2);
    }

    var chart = AmCharts.makeChart("chartdiv", {
        "type": "serial",
        "theme": "light",
        "marginRight": 80,
        "autoMarginOffset": 20,
        "marginTop": 7,
        "dataProvider": chartData,
        "valueAxes": [{
            "axisAlpha": 0,
            "logarithmic": true
        }],
        "mouseWheelZoomEnabled": true,
        "graphs": [{
            "id": "g1",
            "lineColor": "#67B7DC",
            "balloonText": "Height: <b>[[height]]</b>\nDiff: <b>[[value]]</b>\n[[hashrate]]",
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "hideBulletsCount": 50,
            "title": "difficulty",
            "valueField": "difficulty",
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
