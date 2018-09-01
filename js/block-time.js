function get_chart(chartData) {
    chartData.shift();
    var chartData_bt = [];
    var block_date = null;

    for (var i = 0; i < chartData.length; ++i) {
        var block_date_new = new Date(1000 * chartData[i][0]);
        block_date_new.setHours(0);
        block_date_new.setMinutes(0);
        block_date_new.setSeconds(0);
        if (block_date === null || block_date < block_date_new) {
            block_date = block_date_new;
            chartData_bt.push({
                "date": block_date,
                "block_times": [],
            });
        }
        chartData_bt[chartData_bt.length - 1].block_times.push(i==0? 1 : (chartData[i][0] - chartData[i-1][0]));
    }

    for (var i = 0; i < chartData_bt.length; ++i) {
        var stats = getStats(chartData_bt[i].block_times);
        chartData_bt[i].max = stats.max;
        chartData_bt[i].min = stats.min;
        chartData_bt[i].mean = stats.mean.toFixed(2);
        chartData_bt[i].stddev = stats.stddev.toFixed(2);
        chartData_bt[i].median = stats.median;
    }

    var chart = AmCharts.makeChart("chartdiv", {
        "type": "serial",
        "theme": "light",
        "marginRight": 80,
        "autoMarginOffset": 20,
        "marginTop": 7,
        "dataProvider": chartData_bt,
        "valueAxes": [{
            "id":"va_normal",
            "color": "#3359cc",
            "axisColor": "#3359cc",
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
        "legend": {
            "align": "center",
            "equalWidths": false,
            "valueAlign": "left",
            "valueText": "[[value]] s",
            "labelText": "[[title]]: ",
            "equalWidths": true,
            "fontSize": 14,
            "valueWidth": 100
        },
        "mouseWheelZoomEnabled": true,
        "graphs": [{
            "id": "g_mean",
            "valueAxis": "va_normal",
            "type": "smoothedLine",
            "lineColor": "#3359cc",
            "lineThickness": 5,
            "showBalloon" : false,
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "hideBulletsCount": 50,
            "title": "Mean",
            "valueField": "mean",
            "useLineColorForBulletBorder": true,
        },{
            "id": "g_stddev",
            "valueAxis": "va_normal",
            "lineColor": "#33a6cc",
            "lineThickness": 2,
            "showBalloon" : false,
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "hideBulletsCount": 50,
            "title": "StdDev",
            "valueField": "stddev",
            "useLineColorForBulletBorder": true,
        },{
            "id": "g_median",
            "valueAxis": "va_normal",
            "type": "smoothedLine",
            "lineColor": "#8033cc",
            "lineThickness": 2,
            "showBalloon" : false,
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "hideBulletsCount": 50,
            "title": "Median",
            "valueField": "median",
            "useLineColorForBulletBorder": true,
        },{
            "id": "g_max",
            "valueAxis": "va_extreme",
            "type": "step",
            "lineColor": "#b3b300",
            "lineAlpha": 0.5,
            "showBalloon" : false,
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "hideBulletsCount": 50,
            "title": "Max",
            "valueField": "max",
            "useLineColorForBulletBorder": true,
        },{
            "id": "g_min",
            "valueAxis": "va_extreme",
            "type": "step",
            "lineColor": "#666600",
            "lineAlpha": 0.5,
            "showBalloon" : false,
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "hideBulletsCount": 50,
            "title": "Min",
            "valueField": "min",
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
