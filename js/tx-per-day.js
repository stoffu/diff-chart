function get_chart(chartData) {
    chartData.shift();
    var chartData_tpd = [];
    var block_date = null;

    for (var i = 0; i < chartData.length; ++i) {
        var block_date_new = new Date(1000 * chartData[i][0]);
        block_date_new.setHours(0);
        block_date_new.setMinutes(0);
        block_date_new.setSeconds(0);
        if (block_date === null || block_date < block_date_new) {
            block_date = block_date_new;
            chartData_tpd.push({
                "date": block_date,
                "num_txes": 0,
            });
        }
        chartData_tpd[chartData_tpd.length - 1].num_txes += chartData[i][4].length;
    }

    var chart = AmCharts.makeChart("chartdiv", {
        "type": "serial",
        "theme": "light",
        "marginRight": 80,
        "autoMarginOffset": 20,
        "marginTop": 7,
        "dataProvider": chartData_tpd,
        "valueAxes": [{
            "axisAlpha": 0.2,
            "dashLength": 1,
            "position": "left",
        }],
        "mouseWheelZoomEnabled": true,
        "graphs": [{
            "id": "g1",
            "lineColor": "#cc99ff",
            "balloonText": "<b>[[value]]</b>",
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "hideBulletsCount": 50,
            "title": "red line",
            "valueField": "num_txes",
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
           "limitToGraph":"g1",
           "pan": false
        },
        "categoryField": "date",
        "categoryAxis": {
            "parseDates": true,
            "axisColor": "#DADADA",
            "dashLength": 1,
            "minorGridEnabled": true
        },
        "export": {
            "enabled": true
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
