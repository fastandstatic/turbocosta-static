function cwpf_init_radios() {
    if (icheck_skin != 'none') {
        jQuery('.cwpf_radio_term').iCheck('destroy');

        jQuery('.cwpf_radio_term').iCheck({
            radioClass: 'iradio_' + icheck_skin.skin + '-' + icheck_skin.color,
            //radioClass: 'iradio_square-green'        
        });

        jQuery('.cwpf_radio_term').unbind('ifChecked');
        jQuery('.cwpf_radio_term').on('ifChecked', function (event) {
            jQuery(this).attr("checked", true);
            jQuery(this).parents('.cwpf_list').find('.cwpf_radio_term_reset').removeClass('cwpf_radio_term_reset_visible');
            jQuery(this).parents('.cwpf_list').find('.cwpf_radio_term_reset').hide();
            jQuery(this).parents('li').eq(0).find('.cwpf_radio_term_reset').eq(0).addClass('cwpf_radio_term_reset_visible');
            var slug = jQuery(this).data('slug');
            var name = jQuery(this).attr('name');
            var term_id = jQuery(this).data('term-id');
            cwpf_radio_direct_search(term_id, name, slug);
        });
        

        //this script should be, because another way wrong way of working if to click on the label - removed
        /*
        jQuery('.cwpf_radio_label').unbind();
        jQuery('label.cwpf_radio_label').click(function () {
            jQuery(this).prev().find('.cwpf_radio_term').trigger('ifChecked');
            jQuery(this).parents('.cwpf_list_radio').find('.checked').removeClass('checked');            
            jQuery(this).prev().addClass('checked');
            return false;
        });
        */
        //***

  
         
    } else {
        jQuery('.cwpf_radio_term').on('change', function (event) {
            jQuery(this).attr("checked", true);
            var slug = jQuery(this).data('slug');
            var name = jQuery(this).attr('name');
            var term_id = jQuery(this).data('term-id');
			
			jQuery(this).parents('.cwpf_list').find('.cwpf_radio_term_reset').removeClass('cwpf_radio_term_reset_visible');
            jQuery(this).parents('.cwpf_list').find('.cwpf_radio_term_reset').hide();
            jQuery(this).parents('li').eq(0).find('.cwpf_radio_term_reset').eq(0).addClass('cwpf_radio_term_reset_visible');
			
            cwpf_radio_direct_search(term_id, name, slug);
        });
    }

    //***

    jQuery('.cwpf_radio_term_reset').click(function () {
        cwpf_radio_direct_search(jQuery(this).data('term-id'), jQuery(this).attr('data-name'), 0);
        jQuery(this).parents('.cwpf_list').find('.checked').removeClass('checked');
        jQuery(this).parents('.cwpf_list').find('input[type=radio]').removeAttr('checked');
        //jQuery(this).remove();
        jQuery(this).removeClass('cwpf_radio_term_reset_visible');
        return false;
    });
}


function cwpf_radio_direct_search(term_id, name, slug) {

    jQuery.each(cwpf_current_values, function (index, value) {
        if (index == name) {
            delete cwpf_current_values[name];
            return;
        }
    });

    if (slug != 0) {
        cwpf_current_values[name] = slug;
        jQuery('a.cwpf_radio_term_reset_' + term_id).hide();
        jQuery('cwpf_radio_term_' + term_id).filter(':checked').parents('li').find('a.cwpf_radio_term_reset').show();
        jQuery('cwpf_radio_term_' + term_id).parents('ul.cwpf_list').find('label').css({'fontWeight': 'normal'});
        jQuery('cwpf_radio_term_' + term_id).filter(':checked').parents('li').find('label.cwpf_radio_label_' + slug).css({'fontWeight': 'bold'});
    } else {
        jQuery('a.cwpf_radio_term_reset_' + term_id).hide();
        jQuery('cwpf_radio_term_' + term_id).attr('checked', false);
        jQuery('cwpf_radio_term_' + term_id).parent().removeClass('checked');
        jQuery('cwpf_radio_term_' + term_id).parents('ul.cwpf_list').find('label').css({'fontWeight': 'normal'});
    }

    cwpf_ajax_page_num = 1;
    if (cwpf_autosubmit) {
        cwpf_submit_link(cwpf_get_submit_link());
    }
}


