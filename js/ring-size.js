function get_chart(chartData, levels, offset) {
    if (offset === undefined)
        chartData.shift();
    var chartData_rs = [];
    var block_date = null;
    var num_txes_per_day = {};

    for (var i = 0; i < chartData.length; ++i) {
        var block_date_new = new Date(1000 * chartData[i][0]);
        block_date_new.setHours(0);
        block_date_new.setMinutes(0);
        block_date_new.setSeconds(0);
        if (block_date === null || block_date < block_date_new) {
            block_date = block_date_new;
            chartData_rs.push({
                "date": block_date,
                "histogram": [],
            });
            num_txes_per_day[block_date] = 0;
        }
        var e = chartData_rs[chartData_rs.length - 1];
        var num_txes = chartData[i][6].length;
        for (var j = 0; j < num_txes; ++j) {
            var ring_size = chartData[i][6][j][3];
            while (ring_size >=  e.histogram.length) {
                e.histogram.push(0);
            }
            e.histogram[ring_size] += 1;
        }
        num_txes_per_day[block_date] += num_txes;
    }

    for (var i = 0; i < chartData_rs.length; ++i) {
        var count_per_level = new Uint32Array(levels.length + 1);
        for (var k = 1; k < chartData_rs[i].histogram.length; ++k) {
            var l = 0;
            while (l < levels.length && k > levels[l])
                ++l;
            count_per_level[l] += chartData_rs[i].histogram[k];
        }
        for (var l = 0; l <= levels.length; ++l) {
            chartData_rs[i]["level" + l] = count_per_level[l];
        }
    }

    var chart = AmCharts.makeChart("chartdiv", {
        "type": "serial",
        "theme": "light",
        "marginRight": 80,
        "autoMarginOffset": 20,
        "marginTop": 7,
        "dataProvider": chartData_rs,
        "valueAxes": [{
            "stackType": "100%",
            "axisAlpha": 0.2,
            "dashLength": 1,
            "position": "left",
            "title": "percent",
        }],
        "legend": {
            "align": "center",
            "equalWidths": false,
            "valueAlign": "left",
            "valueText": "[[value]] ([[percents]]%)",
            "equalWidths": true,
            "fontSize": 14,
            "valueWidth": 100
        },
        "mouseWheelZoomEnabled": true,
        "graphs": [],
        "chartScrollbar": {
            "autoGridCount": true,
            "graph": "g",
            "scrollbarHeight": 40
        },
        "chartCursor": {
            "pan": false,
            categoryBalloonFunction: function(date) {
                var num_txes = num_txes_per_day[date];
                return AmCharts.formatDate(date, "DD MMM, YYYY") + "<br><b>" + num_txes + "</b> transaction" + (num_txes == 1 ? "" : "s");
            },
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

    var color_table = [
        "#d77575",
        "#d7be75",
        "#a6d775",
        "#75d78d",
        "#75d7d7",
        "#758dd7",
        "#a675d7",
        "#d775be",
    ];

    function get_label(l) {
        if (l == 0)
            return levels[0] == 1 ? "1" : ("1~" + levels[0])
        else if (l == levels.length)
            return ">" + levels[l - 1];
        else if (levels[l - 1] + 1 < levels[l])
            return (levels[l - 1] + 1) + "~" + levels[l];
        else
            return levels[l];
    }

    for (var l = 0; l <= levels.length; ++l) {
        chart.graphs.push({
            "id": "g"+l,
            "lineColor": color_table[l % color_table.length],
            "showBalloon" : false,
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "fillAlphas": 0.5,
            "hideBulletsCount": 50,
            "valueField": "level" + l,
            "title": get_label(l) + ": ",
            "useLineColorForBulletBorder": true,
            "balloon":{
                "cornerRadius": 10,
            }
        });
    }

    // this method is called when chart is first inited as we listen for "rendered" event
    function zoomChart() {
        // different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
        chart.zoomToIndexes(0, chartData.length - 1);
    }
    chart.addListener("rendered", zoomChart);
    zoomChart();

    return chart;
}
