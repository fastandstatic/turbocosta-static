function cwpf_init_checkboxes() {
    if (icheck_skin != 'none') {
        jQuery('.cwpf_checkbox_term').iCheck('destroy');

        jQuery('.cwpf_checkbox_term').iCheck({
            checkboxClass: 'icheckbox_' + icheck_skin.skin + '-' + icheck_skin.color,
            //checkboxClass: 'icheckbox_square-green'
        });


        jQuery('.cwpf_checkbox_term').unbind('ifChecked');
        jQuery('.cwpf_checkbox_term').on('ifChecked', function (event) {
            jQuery(this).attr("checked", true);
            jQuery(".cwpf_select_radio_check input").attr('disabled','disabled');
            cwpf_checkbox_process_data(this, true);
        });

        jQuery('.cwpf_checkbox_term').unbind('ifUnchecked');
        jQuery('.cwpf_checkbox_term').on('ifUnchecked', function (event) {
            jQuery(this).attr("checked", false);
            cwpf_checkbox_process_data(this, false);
        });

        //this script should be, because another way wrong way of working if to click on the label
        jQuery('.cwpf_checkbox_label').unbind();
        jQuery('label.cwpf_checkbox_label').click(function () {
            if(jQuery(this).prev().find('.cwpf_checkbox_term').is(':disabled')){
                return false;
            }
            if (jQuery(this).prev().find('.cwpf_checkbox_term').is(':checked')) {
                jQuery(this).prev().find('.cwpf_checkbox_term').trigger('ifUnchecked');
                jQuery(this).prev().removeClass('checked');
            } else {
                jQuery(this).prev().find('.cwpf_checkbox_term').trigger('ifChecked');
                jQuery(this).prev().addClass('checked');
            }
            
            
        });
        //***

    } else {
        jQuery('.cwpf_checkbox_term').on('change', function (event) {
            if (jQuery(this).is(':checked')) {
                jQuery(this).attr("checked", true);
                cwpf_checkbox_process_data(this, true);
            } else {
                jQuery(this).attr("checked", false);
                cwpf_checkbox_process_data(this, false);
            }
        });
    }
}
function cwpf_checkbox_process_data(_this, is_checked) {
    var tax = jQuery(_this).data('tax');
    var name = jQuery(_this).attr('name');
    var term_id = jQuery(_this).data('term-id');
    cwpf_checkbox_direct_search(term_id, name, tax, is_checked);
}
function cwpf_checkbox_direct_search(term_id, name, tax, is_checked) {

    var values = '';
    var checked = true;
    if (is_checked) {
        if (tax in cwpf_current_values) {
            cwpf_current_values[tax] = cwpf_current_values[tax] + ',' + name;
        } else {
            cwpf_current_values[tax] = name;
        }
        checked = true;
    } else {
        values = cwpf_current_values[tax];
        values = values.split(',');
        var tmp = [];
        jQuery.each(values, function (index, value) {
            if (value != name) {
                tmp.push(value);
            }
        });
        values = tmp;
        if (values.length) {
            cwpf_current_values[tax] = values.join(',');
        } else {
            delete cwpf_current_values[tax];
        }
        checked = false;
    }
    jQuery('.cwpf_checkbox_term_' + term_id).attr('checked', checked);
    cwpf_ajax_page_num = 1;
   
    if (cwpf_autosubmit) {

        cwpf_submit_link(cwpf_get_submit_link());
    }

}


