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
