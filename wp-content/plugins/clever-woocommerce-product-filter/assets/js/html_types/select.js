function cwpf_init_selects() {
    if (is_cwpf_use_chosen) {
        try {
            // jQuery("select.cwpf_select").chosen('destroy').trigger("liszt:updated");
            jQuery("select.cwpf_select, select.cwpf_price_filter_dropdown").chosen(/*{disable_search_threshold: 10}*/);
        } catch (e) {

        }
    }

    jQuery('.cwpf_select').change(function () {
        var slug = jQuery(this).val();
        var name = jQuery(this).attr('name');
        cwpf_select_direct_search(this, name, slug);
    });
}

function cwpf_select_direct_search(_this, name, slug) {

    jQuery.each(cwpf_current_values, function (index, value) {
        if (index == name) {
            delete cwpf_current_values[name];
            return;
        }
    });

    if (slug != 0) {
        cwpf_current_values[name] = slug;
    }

    cwpf_ajax_page_num = 1;
    if (cwpf_autosubmit || jQuery(_this).within('.cwpf').length == 0) {
        cwpf_submit_link(cwpf_get_submit_link());
    }

}


