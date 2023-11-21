var cwpf_text_do_submit = false;
function cwpf_init_text() {
    jQuery('.cwpf_show_text_search').keyup(function (e) {
        
        var val = jQuery(this).val();
        val=val.replace("\'","\&#039;");
        val=val.replace("\"","\&quot;");
        var uid = jQuery(this).data('uid');

        if (e.keyCode == 13 /*&& val.length > 0*/) {
            
            cwpf_text_do_submit = true;
            cwpf_text_direct_search('cwpf_text', val);
            return true;
        }

        //save new word into cwpf_current_values
        if (cwpf_autosubmit) {
            cwpf_current_values['cwpf_text'] = val;
        } else {
            cwpf_text_direct_search('cwpf_text', val);
        }


        //if (cwpf_is_mobile == 1) {
        if (val.length > 0) {
            jQuery('.cwpf_text_search_go.' + uid).show(222);
        } else {
            jQuery('.cwpf_text_search_go.' + uid).hide();
        }
        //}

        //http://easyautocomplete.com/examples
        if (val.length >= 3 && cwpf_text_autocomplete) {
            //http://stackoverflow.com/questions/1574008/how-to-simulate-target-blank-in-javascript
            jQuery(document).on('click','.easy-autocomplete a',function(){
                
                if(!how_to_open_links){
                    window.open(jQuery(this).attr('href'), '_blank');
                    return false;
                }
                
                return true;
            });
            //***
            //http://easyautocomplete.com/examples
            var input_id = jQuery(this).attr('id');
            var options = {
                url: function (phrase) {
                    return cwpf_ajaxurl;
                },
                //theme: "square",
                getValue: function (element) {
                    jQuery("#" + input_id).parents('.cwpf_show_text_search_container').find('.cwpf_show_text_search_loader').hide();
                    jQuery("#" + input_id).parents('.cwpf_show_text_search_container').find('.cwpf_text_search_go').show();
                    return element.name;
                },
                ajaxSettings: {
                    dataType: "json",
                    method: "POST",
                    data: {
                        action: "cwpf_text_autocomplete",
                        dataType: "json"
                    }
                },
                preparePostData: function (data) {
                    jQuery("#" + input_id).parents('.cwpf_show_text_search_container').find('.cwpf_text_search_go').hide();
                    jQuery("#" + input_id).parents('.cwpf_show_text_search_container').find('.cwpf_show_text_search_loader').show();
                    //***
                    data.phrase = jQuery("#" + input_id).val();
                    data.auto_res_count = jQuery("#" + input_id).data('auto_res_count');
                    data.auto_search_by = jQuery("#" + input_id).data('auto_search_by');
                    return data;
                },
                template: {
                    type: cwpf_post_links_in_autocomplete ? 'links' : 'iconRight',
                    fields: {
                        iconSrc: "icon",
                        link: "link"
                    }
                },
                list: {
                    maxNumberOfElements: jQuery("#" + input_id).data('auto_res_count') > 0 ? jQuery("#" + input_id).data('auto_res_count') : cwpf_text_autocomplete_items,
                    onChooseEvent: function () {
                        cwpf_text_do_submit = true;

                        if (cwpf_post_links_in_autocomplete) {
                            return false;
                        } else {
                            cwpf_text_direct_search('cwpf_text', jQuery("#" + input_id).val());
                        }

                        return true;
                    },
                    showAnimation: {
                        type: "fade", //normal|slide|fade
                        time: 333,
                        callback: function () {
                        }
                    },
                    hideAnimation: {
                        type: "slide", //normal|slide|fade
                        time: 333,
                        callback: function () {
                        }
                    }

                },
                requestDelay: 400
            };
            try {
                jQuery("#" + input_id).easyAutocomplete(options);
            } catch (e) {
                console.log(e);
            }
            jQuery("#" + input_id).focus();
        }
    });

    //+++
    jQuery(document).on('click','.cwpf_text_search_go',function(){
        var uid = jQuery(this).data('uid');
        cwpf_text_do_submit = true;
        
        var val=jQuery('.cwpf_show_text_search.' + uid).val();
        //var val =jQuery(this).siblings(".cwpf_show_text_search").val();
        val=val.replace("\"","\&quot;");
        cwpf_text_direct_search('cwpf_text', val);
    });
}

function cwpf_text_direct_search(name, slug) {
     slug = encodeURIComponent(slug);
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
    if (cwpf_autosubmit || cwpf_text_do_submit) {
        cwpf_text_do_submit = false;
        cwpf_submit_link(cwpf_get_submit_link());
    }
}


