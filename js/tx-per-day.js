function get_chart(chartData, cryptonote_config, offset) {
    if (offset === undefined)
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
                "tx_sizes": [],
            });
        }
        var num_txes = chartData[i][6].length;
        for (var j = 0; j < num_txes; ++j) {
            var tx_size = chartData[i][6][j][7]
            chartData_tpd[chartData_tpd.length - 1].tx_sizes.push(tx_size);
        }
    }
    for (var i = 0; i < chartData_tpd.length; ++i) {
        var tpd = chartData_tpd[i];
        tpd.num_txes = tpd.tx_sizes.length;
        tpd.tx_size_avg = 0;
        tpd.tx_size_max = 0;
        tpd.tx_size_min = 100000;
        tpd.tx_size_var = 0;
        for (var j = 0; j < tpd.num_txes; ++j) {
            var tx_size = tpd.tx_sizes[j];
            tpd.tx_size_avg += tx_size;
            tpd.tx_size_max = Math.max(tpd.tx_size_max, tx_size);
            tpd.tx_size_min = Math.min(tpd.tx_size_min, tx_size);
        }
        if (tpd.num_txes > 0)
            tpd.tx_size_avg /= tpd.num_txes;
        for (var j = 0; j < tpd.num_txes; ++j) {
            var tx_size = tpd.tx_sizes[j];
            var d = tx_size - tpd.tx_size_avg;
            tpd.tx_size_var += d * d;
        }
        if (tpd.num_txes > 0)
            tpd.tx_size_var /= tpd.num_txes;
        tpd.tx_size_stddev = Math.sqrt(tpd.tx_size_var);
        tpd.tx_size_avg_str = formatBytes(tpd.tx_size_avg, 3);
        tpd.tx_size_max_str = formatBytes(tpd.tx_size_max, 3);
        tpd.tx_size_min_str = formatBytes(tpd.tx_size_min, 3);
        tpd.tx_size_stddev_str = formatBytes(tpd.tx_size_stddev, 3);
    }

    var chart = AmCharts.makeChart("chartdiv", {
        "type": "serial",
        "theme": "light",
        "marginRight": 80,
        "autoMarginOffset": 20,
        "marginTop": 7,
        "dataProvider": chartData_tpd,
        "valueAxes": [{
            "id":"va_num",
            "color": "#9966cc",
            "axisColor": "#9966cc",
            "axisThickness": 2,
            "axisAlpha": 0.2,
            "dashLength": 1,
            "position": "left",
        }, {
            "id":"va_size",
            "color": "#118844",
            "axisColor": "#118844",
            "axisThickness": 2,
            "axisAlpha": 0.2,
            "dashLength": 1,
            "position": "left",
            "gridAlpha": 0,
            "position": "right"
        }],
        "mouseWheelZoomEnabled": true,
        "graphs": [{
            "id": "g_num",
            "valueAxis": "va_num",
            "lineColor": "#cc99ff",
            "lineThickness": 2,
            "balloonText": "Count: <b>[[value]]</b>",
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "hideBulletsCount": 50,
            "title": "count",
            "valueField": "num_txes",
            "useLineColorForBulletBorder": true,
            // "balloonColor": "white",
            "balloon":{
                // "adjustBorderColor": false,
                // "borderColor": "gray",
                "cornerRadius": 10,
            }
        },{
            "id": "g_size_avg",
            "valueAxis": "va_size",
            "lineColor": "#22b681",
            "lineThickness": 1,
            "showBalloon" : true,
            "balloonText":
                "Size: [[tx_size_avg_str]]<br/>" +
                "Max: [[tx_size_max_str]]<br/>" +
                "Min: [[tx_size_min_str]]<br/>" +
                "StdDev: [[tx_size_stddev_str]]",
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "hideBulletsCount": 50,
            "title": "size",
            "valueField": "tx_size_avg",
            "useLineColorForBulletBorder": true,
            "balloon":{
                "cornerRadius": 10,
            }
        },{
            "id": "g_size_max",
            "valueAxis": "va_size",
            "type": "step",
            "lineColor": "#28d79a",
            "lineAlpha": 0.5,
            "showBalloon" : false,
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "hideBulletsCount": 50,
            "title": "Max",
            "valueField": "tx_size_max",
            "useLineColorForBulletBorder": true,
        },{
            "id": "g_size_min",
            "valueAxis": "va_size",
            "type": "step",
            "lineColor": "#18815c",
            "lineAlpha": 0.5,
            "showBalloon" : false,
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "hideBulletsCount": 50,
            "title": "Min",
            "valueField": "tx_size_min",
            "useLineColorForBulletBorder": true,
        }],
        "chartScrollbar": {
            "autoGridCount": true,
            "graph": "g_num",
            "scrollbarHeight": 40
        },
        "chartCursor": {
            "cursorAlpha": 0.25,
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
