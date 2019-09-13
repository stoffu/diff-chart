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
                "num_txes": 0,
                "tx_size_sum": 0,
            });
        }
        var blk_size = chartData[i][4];
        var blk_blob_size = chartData[i][5];
        var num_txes = chartData[i][6].length;
        var height = i + (offset === undefined ? 1 : offset.height);
        var miner_tx_size =  blk_blob_size - cryptonote_config.get_blockheader_size(height) - num_txes * 32 - 1;
        chartData_tpd[chartData_tpd.length - 1].num_txes += num_txes;
        chartData_tpd[chartData_tpd.length - 1].tx_size_sum += blk_size - miner_tx_size;
    }
    for (var i = 0; i < chartData_tpd.length; ++i) {
        chartData_tpd[i].tx_size = chartData_tpd[i].num_txes === 0 ? 1 : (chartData_tpd[i].tx_size_sum / chartData_tpd[i].num_txes);
        chartData_tpd[i].tx_size_str = formatBytes(chartData_tpd[i].tx_size, 3);
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
            "balloonText": "Count: <b>[[value]]</b>\nSize: [[tx_size_str]]",
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
        },{
            "id": "g_size",
            "valueAxis": "va_size",
            "lineColor": "#22b681",
            "lineThickness": 1,
            "showBalloon" : false,
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "hideBulletsCount": 50,
            "title": "StdDev",
            "valueField": "tx_size",
            "useLineColorForBulletBorder": true,
        }],
        "chartScrollbar": {
            "autoGridCount": true,
            "graph": "g_num",
            "scrollbarHeight": 40
        },
        "chartCursor": {
           "limitToGraph":"g_num",
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
