function cwpf_init_mselects() {
    try {
        // jQuery("select.cwpf_select").chosen('destroy').trigger("liszt:updated");
        jQuery("select.cwpf_mselect").chosen(/*{disable_search_threshold: 10}*/);
    } catch (e) {

    }

    jQuery('.cwpf_mselect').change(function (a) {
        var slug = jQuery(this).val();
        var name = jQuery(this).attr('name');

        //fix for multiselect if in chosen mode remove options
        if (is_cwpf_use_chosen) {
            var vals = jQuery(this).chosen().val();
            jQuery('.cwpf_mselect[name=' + name + '] option:selected').removeAttr("selected");
            jQuery('.cwpf_mselect[name=' + name + '] option').each(function (i, option) {
                var v = jQuery(this).val();
                if (jQuery.inArray(v, vals) !== -1) {
                    jQuery(this).prop("selected", true);
                }
            });
        }

        cwpf_mselect_direct_search(name, slug);
        return true;
    });
}

function cwpf_mselect_direct_search(name, slug) {
    //mode with Filter button
    var values = [];
    jQuery('.cwpf_mselect[name=' + name + '] option:selected').each(function (i, v) {
        values.push(jQuery(this).val());
    });

    //duplicates removing
    //http://stackoverflow.com/questions/9229645/remove-duplicates-from-javascript-array
    values = values.filter(function (item, pos) {
        return values.indexOf(item) == pos;
    });

    values = values.join(',');
    if (values.length) {
        cwpf_current_values[name] = values;
    } else {
        delete cwpf_current_values[name];
    }

    cwpf_ajax_page_num = 1;
    if (cwpf_autosubmit) {
        cwpf_submit_link(cwpf_get_submit_link());
    }
}


