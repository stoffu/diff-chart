var max_num_bullets = 200000;

function get_chart(chartData, offset) {
    if (offset === undefined)
        chartData.shift();

    for (var i = 0; i < chartData.length; ++i) {
        chartData[i].date = new Date(1000 * chartData[i][0]);
        chartData[i].height = i + (offset === undefined ? 1 : offset.height);
        chartData[i].nonce = chartData[i][1];
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
        }],
        "mouseWheelZoomEnabled": true,
        "graphs": [{
            "id": "g1",
            "lineColor": "#800040",
            "lineAlpha": 0,
            "bulletAlpha": 1,
            "bullet": "square",
            "bulletSize": 1,
            "minBulletSize": 1,
            "hideBulletsCount": max_num_bullets,
            "balloonText": "Height: <b>[[height]]</b>\nNonce: <b>[[value]]</b>\n",
            "showBalloonAt": "close",
            "title": "nonce",
            "valueField": "nonce",
            "balloon":{
                "cornerRadius": 10,
                "animationDuration": 0,
            }
        }],
        "chartScrollbar": {
            "autoGridCount": true,
            "graph": "g1",
            "scrollbarHeight": 40
        },
        "chartCursor": {
           "pan": false,
           "categoryBalloonEnabled": false,
           "animationDuration": 0,
           "cursorAlpha": 0,
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
        chart.zoomToIndexes(Math.max(0, chartData.length - max_num_bullets), chartData.length - 1);
    }
    chart.addListener("rendered", zoomChart);
    zoomChart();

    return chart;
}
