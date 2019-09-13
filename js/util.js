// https://stackoverflow.com/a/18650828
function formatBytes(bytes, decimal) {
    if (0 == bytes)
        return "0 bytes";
    var c = 1024;
    var d = decimal || 2;
    var e = ["bytes", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    var f = Math.floor(Math.log(bytes) / Math.log(c));
    return "<b>" + parseFloat((bytes / Math.pow(c, f)).toFixed(d)) + "</b> " + e[f]
}

function formatHashrate(hr, decimal) {
    if (0 == hr)
        return "0 H/s";
    var c = 1000;
    var d = decimal || 2;
    var e = ["H/s", "kH/s", "MH/s", "GH/s", "TH/s", "PH/s", "EH/s", "ZH/s", "YH/s"];
    var f = Math.floor(Math.log(hr) / Math.log(c));
    return "<b>" + parseFloat((hr / Math.pow(c, f)).toFixed(d)) + "</b> " + e[f]
}

function print_money(amount, decimal_point) {
    var s1 = String(amount);
    while (s1.length < decimal_point+1)
        s1 = "0" + s1;
    var s2 = "";
    for (var i = 0; i < decimal_point; ++i)
        s2 = s1[s1.length - 1 - i] + s2;
    s2 = "." + s2;
    for (var i = 0; i < s1.length - decimal_point; ++i) {
        if (i > 0 && i % 3 == 0)
            s2 = "," + s2;
        s2 = s1[s1.length - 1 - decimal_point - i] + s2
    }
    return s2;
}

function getStats(values) {
    values.sort(function(a,b){return a-b;});
    var max = values[values.length - 1];
    var min = values[0];
    var total = 0;
    for (var i = 0; i < values.length; ++i)
        total += values[i];
    mean = total / values.length;
    var stddev = 0;
    for (var i = 0; i < values.length; ++i)
        stddev += (values[i]-mean) * (values[i]-mean);
    stddev = Math.sqrt(stddev / values.length);
    var median_idx = Math.floor(values.length/2);
    var median = values[median_idx];
    if (values.length%2 == 0)
        median = (median + values[median_idx + 1]) / 2;
    return {"max":max, "min":min, "mean":mean, "stddev":stddev, "median":median, "total":total};
}
