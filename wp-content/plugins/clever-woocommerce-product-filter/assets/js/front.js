var cwpf_redirect = '';//if we use redirect attribute in shortcode [cwpf]
var cwpf_reset_btn_action=false;
//***

jQuery(function ($) {
    jQuery('body').append('<div id="cwpf_html_buffer" class="cwpf_info_popup" style="display: none;"></div>');
    jQuery.fn.life = function (types, data, fn) {
	jQuery(this.context).on(types, this.selector, data, fn);
	return this;
    };
//http://stackoverflow.com/questions/2389540/jquery-hasparent
    jQuery.extend(jQuery.fn, {
	within: function (pSelector) {
	    // Returns a subset of items using jQuery.filter
	    return this.filter(function () {
		// Return truthy/falsey based on presence in parent
		return jQuery(this).closest(pSelector).length;
	    });
	}
    });

    //+++

    if (jQuery('#cwpf_results_by_ajax').length > 0) {
	cwpf_is_ajax = 1;
    }

    //listening attributes in shortcode [cwpf]
    cwpf_autosubmit = parseInt(jQuery('.cwpf').eq(0).data('autosubmit'), 10);
    cwpf_ajax_redraw = parseInt(jQuery('.cwpf').eq(0).data('ajax-redraw'), 10);



    //+++

    cwpf_ext_init_functions = jQuery.parseJSON(cwpf_ext_init_functions);

    //fix for native woo price range
    cwpf_init_native_woo_price_filter();


    jQuery('body').bind('price_slider_change', function (event, min, max) {

	if (cwpf_autosubmit && !cwpf_show_price_search_button && jQuery('.price_slider_wrapper').length < 3) {

	    jQuery('.cwpf .widget_price_filter form').trigger('submit');

	} else {
	    var min_price = jQuery(this).find('.price_slider_amount #min_price').val();
	    var max_price = jQuery(this).find('.price_slider_amount #max_price').val();
	    cwpf_current_values.min_price = min_price;
	    cwpf_current_values.max_price = max_price;
	}
    });
    jQuery(document).on('click','.cwpf_price_filter_dropdown',function(){	
	var val = jQuery(this).val();
	if (parseInt(val, 10) == -1) {
	    delete cwpf_current_values.min_price;
	    delete cwpf_current_values.max_price;
	} else {
	    var val = val.split("-");
	    cwpf_current_values.min_price = val[0];
	    cwpf_current_values.max_price = val[1];
	}

	if (cwpf_autosubmit || jQuery(this).within('.cwpf').length == 0) {
	    cwpf_submit_link(cwpf_get_submit_link());
	}
    });





    //change value in textinput price filter if WOOCS is installed
    cwpf_recount_text_price_filter();
    //+++
	jQuery(document).on('click','.cwpf_price_filter_txt',function(){

	var from = parseInt(jQuery(this).parent().find('.cwpf_price_filter_txt_from').val(), 10);
	var to = parseInt(jQuery(this).parent().find('.cwpf_price_filter_txt_to').val(), 10);

	if (to < from || from < 0) {
	    delete cwpf_current_values.min_price;
	    delete cwpf_current_values.max_price;
	} else {
	    if (typeof woocs_current_currency !== 'undefined') {
		from = Math.ceil(from / parseFloat(woocs_current_currency.rate));
		to = Math.ceil(to / parseFloat(woocs_current_currency.rate));
	    }

	    cwpf_current_values.min_price = from;
	    cwpf_current_values.max_price = to;
	}

	if (cwpf_autosubmit || jQuery(this).within('.cwpf').length == 0) {
	    cwpf_submit_link(cwpf_get_submit_link());
	}
    });


    //***

	jQuery(document).on('click','.cwpf_open_hidden_li_btn',function(){
	var state = jQuery(this).data('state');
	var type = jQuery(this).data('type');

	if (state == 'closed') {
	    jQuery(this).parents('.cwpf_list').find('.cwpf_hidden_term').addClass('cwpf_hidden_term2');
	    jQuery(this).parents('.cwpf_list').find('.cwpf_hidden_term').removeClass('cwpf_hidden_term');
	    if (type == 'image') {
		jQuery(this).find('img').attr('src', jQuery(this).data('opened'));
	    } else {
		jQuery(this).html(jQuery(this).data('opened'));
	    }

	    jQuery(this).data('state', 'opened');
	} else {
	    jQuery(this).parents('.cwpf_list').find('.cwpf_hidden_term2').addClass('cwpf_hidden_term');
	    jQuery(this).parents('.cwpf_list').find('.cwpf_hidden_term2').removeClass('cwpf_hidden_term2');

	    if (type == 'image') {
		jQuery(this).find('img').attr('src', jQuery(this).data('closed'));
	    } else {
		jQuery(this).text(jQuery(this).data('closed'));
	    }

	    jQuery(this).data('state', 'closed');
	}


	return false;
    });
    //open hidden block
    cwpf_open_hidden_li();

    //*** woocommerce native "AVERAGE RATING" widget synchronizing
    jQuery('.widget_rating_filter li.wc-layered-nav-rating a').click(function () {
	var is_chosen = jQuery(this).parent().hasClass('chosen');
	var parsed_url = cwpf_parse_url(jQuery(this).attr('href'));
	var rate = 0;
	if (parsed_url.query !== undefined) {
	    if (parsed_url.query.indexOf('min_rating') !== -1) {
		var arrayOfStrings = parsed_url.query.split('min_rating=');
		rate = parseInt(arrayOfStrings[1], 10);
	    }
	}
	jQuery(this).parents('ul').find('li').removeClass('chosen');
	if (is_chosen) {
	    delete cwpf_current_values.min_rating;
	} else {
	    cwpf_current_values.min_rating = rate;
	    jQuery(this).parent().addClass('chosen');
	}

	cwpf_submit_link(cwpf_get_submit_link());

	return false;
    });

    //CWPF start filtering button action
	jQuery(document).on('click','.cwpf_start_filtering_btn',function(){

	var shortcode = jQuery(this).parents('.cwpf').data('shortcode');
	jQuery(this).html(cwpf_lang_loading);
	jQuery(this).addClass('cwpf_start_filtering_btn2');
	jQuery(this).removeClass('cwpf_start_filtering_btn');
	//redrawing [cwpf ajax_redraw=1] only
	var data = {
	    action: "cwpf_draw_products",
	    page: 1,
	    shortcode: 'cwpf_nothing', //we do not need get any products, seacrh form data only
	    cwpf_shortcode: shortcode
	};

	jQuery.post(cwpf_ajaxurl, data, function (content) {
	    content = jQuery.parseJSON(content);
	    jQuery('div.cwpf_redraw_zone').replaceWith(jQuery(content.form).find('.cwpf_redraw_zone'));
	    cwpf_mass_reinit();
	});


	return false;
    });

    //***
    var str = window.location.href;
    window.onpopstate = function (event) {
	try {
            console.log(cwpf_current_values)
	    if (Object.keys(cwpf_current_values).length) {

		var temp = str.split('?');
                var get1="";
                if(temp[1]!=undefined){
                    get1 = temp[1].split('#');
                }
		var str2 = window.location.href;
		var temp2 = str2.split('?');
                if(temp2[1]==undefined){
                    //return false;
                    var get2={0:"",1:""};

                }else{
                    var get2 = temp2[1].split('#');
                }

		if (get2[0] != get1[0]) {
		    cwpf_show_info_popup(cwpf_lang_loading);
		    window.location.reload();
		}
		return false;
	    }
	} catch (e) {
	    console.log(e);
	}
    };
    //***

    //ion-slider price range slider
    cwpf_init_ion_sliders();

    //***

    cwpf_init_show_auto_form();
    cwpf_init_hide_auto_form();

    //***
    cwpf_remove_empty_elements();

    cwpf_init_search_form();
    cwpf_init_pagination();
    cwpf_init_orderby();
    cwpf_init_reset_button();
    cwpf_init_beauty_scroll();
    //+++
    cwpf_draw_products_top_panel();
    cwpf_shortcode_observer();

	//tooltip
	cwpf_init_tooltip();
	//
	cwpf_show_hide_widget();


//+++
    //if we use redirect attribute in shortcode [cwpf is_ajax=0]
    //not for ajax, for redirect mode only
    if (!cwpf_is_ajax) {
	cwpf_redirect_init();
    }

    cwpf_init_toggles();

});

//if we use redirect attribute in shortcode [cwpf is_ajax=0]
//not for ajax, for redirect mode only
function cwpf_redirect_init() {

    try {
	if (jQuery('.cwpf').length ) {
	    //https://wordpress.org/support/topic/javascript-error-in-frontjs?replies=1
	    if (undefined !== jQuery('.cwpf').val()) {
		cwpf_redirect = jQuery('.cwpf').eq(0).data('redirect');//default value
		if (cwpf_redirect.length > 0) {
		    cwpf_shop_page = cwpf_current_page_link = cwpf_redirect;
		}


		//***
		/*
		 var events = ['click', 'change', 'ifChecked', 'ifUnchecked'];

		 for (var i = 0; i < events.length; i++) {

		 jQuery('div.cwpf input, div.cwpf option, div.cwpf div, div.cwpf label').live(events[i], function (e) {
		 try {
		 if (jQuery(this).parents('.cwpf').data('redirect').length > 0) {
		 cwpf_redirect = jQuery(this).parents('.cwpf').data('redirect');
		 }
		 } catch (e) {
		 console.log('Error: attribute redirection doesn works!');
		 }
		 e.stopPropagation();
		 });

		 }
		 */
		//***


		return cwpf_redirect;
	    }
	}
    } catch (e) {
	console.log(e);
    }

}

function cwpf_init_orderby() {
	jQuery(document).on('click','.form.woocommerce-ordering',function(){
        /* woo3.3 */
        if(!jQuery("#is_woo_shortcode").length){
            return false;
        }
        /* +++ */
    });
	jQuery(document).on('click','.form.woocommerce-ordering select.orderby',function(){
        /* woo3.3 */
        if(!jQuery("#is_woo_shortcode").length){
            cwpf_current_values.orderby = jQuery(this).val();
            cwpf_ajax_page_num = 1;
            cwpf_submit_link(cwpf_get_submit_link(),0);
            return false;
        }
        /* +++ */
    });
}

function cwpf_init_reset_button() {
	jQuery(document).on('click','.cwpf_reset_search_form',function(){
	//var link = jQuery(this).data('link');
	cwpf_ajax_page_num = 1;
        cwpf_ajax_redraw = 0;
        cwpf_reset_btn_action=true;
	if (cwpf_is_permalink) {
	    cwpf_current_values = {};
	    cwpf_submit_link(cwpf_get_submit_link().split("page/")[0]);
	} else {
	    var link = cwpf_shop_page;
	    if (cwpf_current_values.hasOwnProperty('page_id')) {
		link = location.protocol + '//' + location.host + "/?page_id=" + cwpf_current_values.page_id;
		cwpf_current_values = {'page_id': cwpf_current_values.page_id};
		cwpf_get_submit_link();
	    }
	    //***
	    cwpf_submit_link(link);
	    if (cwpf_is_ajax) {
		history.pushState({}, "", link);
		if (cwpf_current_values.hasOwnProperty('page_id')) {
		    cwpf_current_values = {'page_id': cwpf_current_values.page_id};
		} else {
		    cwpf_current_values = {};
		}
	    }
	}
	return false;
    });
}

function cwpf_init_pagination() {

    if (cwpf_is_ajax === 1) {
	jQuery(document).on('click','a.page-numbers',function(){
	    var l = jQuery(this).attr('href');

	    if (cwpf_ajax_first_done) {
		//wp-admin/admin-ajax.php?paged=2
		var res = l.split("paged=");
		if (typeof res[1] !== 'undefined') {
		    cwpf_ajax_page_num = parseInt(res[1]);
		} else {
		    cwpf_ajax_page_num = 1;
		}
                var res2 = l.split("product-page=");
                if (typeof res2[1] !== 'undefined') {
		    cwpf_ajax_page_num = parseInt(res2[1]);
		}
	    } else {
		var res = l.split("page/");
		if (typeof res[1] !== 'undefined') {
		    cwpf_ajax_page_num = parseInt(res[1]);
		} else {
		    cwpf_ajax_page_num = 1;
		}
                var res2 = l.split("product-page=");
                if (typeof res2[1] !== 'undefined') {
		    cwpf_ajax_page_num = parseInt(res2[1]);
		}
	    }

	    //+++

	    //if (cwpf_autosubmit) - pagination doesn need pressing any submit button!!
	    {
		cwpf_submit_link(cwpf_get_submit_link(),0);
	    }

	    return false;
	});
    }
}

function cwpf_init_search_form() {
    cwpf_init_checkboxes();
    cwpf_init_mselects();
    cwpf_init_radios();
    cwpf_price_filter_radio_init();
    cwpf_init_selects();


    //for extensions
    if (cwpf_ext_init_functions !== null) {
	jQuery.each(cwpf_ext_init_functions, function (type, func) {
	    eval(func + '()');
	});
    }
    //+++
    //var containers = jQuery('.cwpf_container');

    //+++
    jQuery('.cwpf_submit_search_form').click(function () {

	if (cwpf_ajax_redraw) {
	    //[cwpf redirect="http://test-all/" autosubmit=1 ajax_redraw=1 is_ajax=1 tax_only="locations" by_only="none"]
	    cwpf_ajax_redraw = 0;
	    cwpf_is_ajax = 0;
	}
	//***
	cwpf_submit_link(cwpf_get_submit_link());
	return false;
    });



    //***
    jQuery('ul.cwpf_childs_list').parent('li').addClass('cwpf_childs_list_li');

    //***

    cwpf_remove_class_widget();
    cwpf_checkboxes_slide();
}

var cwpf_submit_link_locked = false;
function cwpf_submit_link(link,ajax_redraw) {


    if (cwpf_submit_link_locked) {
	return;
    }
    if(typeof CwpfTurboMode!='undefined'){
        CwpfTurboMode.cwpf_submit_link(link);

        return;
    }
    if(typeof ajax_redraw == 'undefined' ){
        ajax_redraw=cwpf_ajax_redraw;
    }

    cwpf_submit_link_locked = true;
    cwpf_show_info_popup(cwpf_lang_loading);

    if (cwpf_is_ajax === 1 && !ajax_redraw)  {

	cwpf_ajax_first_done = true;
	var data = {
	    action: "cwpf_draw_products",
	    link: link,
	    page: cwpf_ajax_page_num,
	    shortcode: jQuery('#cwpf_results_by_ajax').data('shortcode'),
	    cwpf_shortcode: jQuery('div.cwpf').data('shortcode')
	};

	jQuery.post(cwpf_ajaxurl, data, function (content) {
	    content = jQuery.parseJSON(content);
	    if (jQuery('.cwpf_results_by_ajax_shortcode').length) {
                if(typeof content.products!="undefined"){
                    jQuery('#cwpf_results_by_ajax').replaceWith(content.products);
                }
	    } else {
                if(typeof content.products!="undefined"){
                    jQuery('.cwpf_shortcode_output').replaceWith(content.products);
                }
	    }
            if(typeof content.additional_fields != "undefined"){
                jQuery.each(content.additional_fields,function(selector,html_data){
                    jQuery(selector).replaceWith(html_data);
                });
            }


	    jQuery('div.cwpf_redraw_zone').replaceWith(jQuery(content.form).find('.cwpf_redraw_zone'));
	    cwpf_draw_products_top_panel();
	    cwpf_mass_reinit();
	    cwpf_submit_link_locked = false;
	    //removing id cwpf_results_by_ajax - multi in ajax mode sometimes
	    //when uses shorcode cwpf_products in ajax and in settings try ajaxify shop is Yes
	    jQuery.each(jQuery('#cwpf_results_by_ajax'), function (index, item) {
		if (index == 0) {
		    return;
		}

		jQuery(item).removeAttr('id');
	    });
	    //infinite scroll
	    cwpf_infinite();
	    //*** script after ajax loading here
	    cwpf_js_after_ajax_done();
            //***  change  link  in button "add to cart"
            cwpf_change_link_addtocart();

            /*tooltip*/
            cwpf_init_tooltip();

            document.dispatchEvent(new CustomEvent('cwpf-ajax-form-redrawing', {detail: {
                link: link
            }}));

	});

    } else {

	if (ajax_redraw) {
	    //redrawing [cwpf ajax_redraw=1] only
	    var data = {
		action: "cwpf_draw_products",
		link: link,
		page: 1,
		shortcode: 'cwpf_nothing', //we do not need get any products, seacrh form data only
		cwpf_shortcode: jQuery('div.cwpf').eq(0).data('shortcode')
	    };
	    jQuery.post(cwpf_ajaxurl, data, function (content) {
		content = jQuery.parseJSON(content);
		jQuery('div.cwpf_redraw_zone').replaceWith(jQuery(content.form).find('.cwpf_redraw_zone'));
		cwpf_mass_reinit();
		cwpf_submit_link_locked = false;
                /*tooltip*/
                cwpf_init_tooltip();

                document.dispatchEvent(new CustomEvent('cwpf-ajax-form-redrawing', {detail: {
                    link: link
                }}));
	    });
	} else {

	    window.location = link;
	    cwpf_show_info_popup(cwpf_lang_loading);
	}
    }
}

function cwpf_remove_empty_elements() {
    // lets check for empty drop-downs
    jQuery.each(jQuery('.cwpf_container select'), function (index, select) {
	var size = jQuery(select).find('option').length;
	if (size === 0) {
	    jQuery(select).parents('.cwpf_container').remove();
	}
    });
    //+++
    // lets check for empty checkboxes, radio, color conatiners
    jQuery.each(jQuery('ul.cwpf_list'), function (index, ch) {
	var size = jQuery(ch).find('li').length;
	if (size === 0) {
	    jQuery(ch).parents('.cwpf_container').remove();
	}
    });
}

function cwpf_get_submit_link() {
//filter cwpf_current_values values
    if (cwpf_is_ajax) {
	cwpf_current_values.page = cwpf_ajax_page_num;
    }
//+++
    if (Object.keys(cwpf_current_values).length > 0) {
	jQuery.each(cwpf_current_values, function (index, value) {
	    if (index == scwpf_search_slug) {
		delete cwpf_current_values[index];
	    }
	    if (index == 's') {
		delete cwpf_current_values[index];
	    }
	    if (index == 'product') {
//for single product page (when no permalinks)
		delete cwpf_current_values[index];
	    }
	    if (index == 'really_curr_tax') {
		delete cwpf_current_values[index];
	    }
	});
    }


    //***
    if (Object.keys(cwpf_current_values).length === 2) {
	if (('min_price' in cwpf_current_values) && ('max_price' in cwpf_current_values)) {
            cwpf_current_page_link = cwpf_current_page_link.replace(new RegExp(/page\/(\d+)\//), "");
	    var l = cwpf_current_page_link + '?min_price=' + cwpf_current_values.min_price + '&max_price=' + cwpf_current_values.max_price;
	    if (cwpf_is_ajax) {
		history.pushState({}, "", l);
	    }
	    return l;
	}
    }



    //***

    if (Object.keys(cwpf_current_values).length === 0) {
	if (cwpf_is_ajax) {
	    history.pushState({}, "", cwpf_current_page_link);
	}
	return cwpf_current_page_link;
    }
    //+++
    if (Object.keys(cwpf_really_curr_tax).length > 0) {
	cwpf_current_values['really_curr_tax'] = cwpf_really_curr_tax.term_id + '-' + cwpf_really_curr_tax.taxonomy;
    }
    //+++
    var link = cwpf_current_page_link + "?" + scwpf_search_slug + "=1";
    //console.log(cwpf_current_page_link);
    //just for the case when no permalinks enabled
    if (!cwpf_is_permalink) {

	if (cwpf_redirect.length > 0) {
	    link = cwpf_redirect + "?" + scwpf_search_slug + "=1";
	    if (cwpf_current_values.hasOwnProperty('page_id')) {
		delete cwpf_current_values.page_id;
	    }
	} else {
	    link = location.protocol + '//' + location.host + "?" + scwpf_search_slug + "=1";
	    /*
	     if (!cwpf_is_ajax) {
	     link = location.protocol + '//' + location.host + "?" + scwpf_search_slug + "=1";
	     }

	     if (cwpf_current_values.hasOwnProperty('page_id')) {
	     link = location.protocol + '//' + location.host + "?" + scwpf_search_slug + "=1";
	     }
	     */
	}
    }
    //console.log(link);
    //throw('STOP!');

    //any trash for different sites, useful for quick support
    var cwpf_exclude_accept_array = ['path'];

    if (Object.keys(cwpf_current_values).length > 0) {
	jQuery.each(cwpf_current_values, function (index, value) {
	    if (index == 'page' && cwpf_is_ajax) {
		index = 'paged';//for right pagination if copy/paste this link and send somebody another by email for example
	    }

	    //http://dev.cleveraddon.com/?scwpf=1&cwpf_author=3&cwpf_sku&cwpf_text=single
	    //avoid links where values is empty
	    if (typeof value !== 'undefined') {
		if ((typeof value && value.length > 0) || typeof value == 'number')
		{
		    if (jQuery.inArray(index, cwpf_exclude_accept_array) == -1) {
			link = link + "&" + index + "=" + value;
		    }
		}
	    }

	});
    }

    //+++
    //remove wp pagination like 'page/2'
    link = link.replace(new RegExp(/page\/(\d+)\//), "");
    if (cwpf_is_ajax) {
	history.pushState({}, "", link);

    }

    //throw ("STOP!");
    return link;
}



function cwpf_show_info_popup(text) {
    if (cwpf_overlay_skin == 'default') {
	jQuery("#cwpf_html_buffer").text(text);
	jQuery("#cwpf_html_buffer").fadeTo(200, 0.9);
    } else {
	//http://jxnblk.com/loading/
	switch (cwpf_overlay_skin) {
	    case 'loading-balls':
	    case 'loading-bars':
	    case 'loading-bubbles':
	    case 'loading-cubes':
	    case 'loading-cylon':
	    case 'loading-spin':
	    case 'loading-spinning-bubbles':
	    case 'loading-spokes':
		jQuery('body').plainOverlay('show', {progress: function () {
			return jQuery('<div id="cwpf_svg_load_container"><img style="height: 100%;width: 100%" src="' + cwpf_link + 'img/loading-master/' + cwpf_overlay_skin + '.svg" alt=""></div>');
		    }});
		break;
	    default:
		jQuery('body').plainOverlay('show', {duration: -1});
		break;
	}
    }
}


function cwpf_hide_info_popup() {
    if (cwpf_overlay_skin == 'default') {
	window.setTimeout(function () {
	    jQuery("#cwpf_html_buffer").fadeOut(400);
	}, 200);
    } else {
	jQuery('body').plainOverlay('hide');
    }
}

function cwpf_draw_products_top_panel() {

    if (cwpf_is_ajax) {
	jQuery('#cwpf_results_by_ajax').prev('.cwpf_products_top_panel').remove();
    }

    var panel = jQuery('.cwpf_products_top_panel');

    panel.html('');
    if (Object.keys(cwpf_current_values).length > 0) {
	panel.show();
	panel.html('<ul></ul>');
	var is_price_in = false;
	//lets show this on the panel

	jQuery.each(cwpf_current_values, function (index, value) {
	    //lets filter data for the panel

	    if (jQuery.inArray(index, cwpf_accept_array) == -1 && jQuery.inArray(index.replace("rev_",""), cwpf_accept_array) == -1 ) {
		return;
	    }

	    //***

	    if ((index == 'min_price' || index == 'max_price') && is_price_in) {
		return;
	    }

	    if ((index == 'min_price' || index == 'max_price') && !is_price_in) {
		is_price_in = true;
		index = 'price';
		value = cwpf_lang_pricerange;
	    }
	    //+++
	    value = value.toString().trim();
	    if (value.search(',')) {
		value = value.split(',');
	    }
	    //+++
	    jQuery.each(value, function (i, v) {
		if (index == 'page') {
		    return;
		}

		if (index == 'post_type') {
		    return;
		}

		var txt = v;
		if (index == 'orderby') {
		    if (cwpf_lang[v] !== undefined) {
			txt = cwpf_lang.orderby + ': ' + cwpf_lang[v];
		    } else {
			txt = cwpf_lang.orderby + ': ' + v;
		    }
		} else if (index == 'perpage') {
		    txt = cwpf_lang.perpage;
		} else if (index == 'price') {
        if (typeof woocommerce_price_slider_params === 'undefined') {
          txt = cwpf_lang.pricerange;
        } else {
          var txt_min = woocommerce_price_slider_params.currency_format.replace('%v', cwpf_current_values.min_price);
          txt_min = txt_min.replace('%s', woocommerce_price_slider_params.currency_format_symbol);
          var txt_max = woocommerce_price_slider_params.currency_format.replace('%v', cwpf_current_values.max_price);
          txt_max = txt_max.replace('%s', woocommerce_price_slider_params.currency_format_symbol);
          txt =  txt_min + ' - ' + txt_max;
        }
		} else {

		    var is_in_custom = false;
		    if (Object.keys(cwpf_lang_custom).length > 0) {
			jQuery.each(cwpf_lang_custom, function (i, tt) {
			    if (i == index) {
				is_in_custom = true;
				txt = tt;
				if (index == 'cwpf_sku') {
				    txt += " " + v;//because search by SKU can by more than 1 value
				}
			    }
			});
		    }

		    if (!is_in_custom) {

			try {
			    //txt = jQuery('.cwpf_n_' + index + '_' + v).val();
			    txt = jQuery("input[data-anchor='cwpf_n_" + index + '_' + v + "']").val();
                            //console.log("input[data-anchor='cwpf_n_" + index + '_' + v + "']")
			} catch (e) {
			    console.log(e);
			}

			if (typeof txt === 'undefined')
			{
			    txt = v;
			}
		    }


		    /* hidden feature
		     if (jQuery('input[name=cwpf_t_' + index + ']').length > 0) {
		     txt = jQuery('input[name=cwpf_t_' + index + ']').val() + ': ' + txt;
		     }
		     */


		}

		panel.find('ul').append(
			jQuery('<li>').append(
			jQuery('<a>').attr('href', "").attr('data-tax', index).attr('data-slug', v).append(
			jQuery('<span>').attr('class', 'cwpf_remove_ppi').append(txt)
			)));
	    });


	});
    }


    if (jQuery(panel).find('li').length == 0 || !jQuery('.cwpf_products_top_panel').length) {
	panel.hide();
} else {
  var cwpf_your_choices_html = jQuery('<span>' + cwpf_lang_custom.cwpf_your_choices + '</span>'),
      cwpf_reset_button_html = jQuery('<span><button class="button cwpf_reset_search_form" data-link="">' + cwpf_lang_custom.cwpf_clear_all_filters + '</button></span>');
  panel.find('ul').prepend(jQuery('<li class="cwpf-your-choices">').append(cwpf_your_choices_html));
  panel.find('ul').append(jQuery('<li class="cwpf-reset-button">').append(cwpf_reset_button_html));
}

    //+++
    jQuery('.cwpf_remove_ppi').parent().click(function () {
	var tax = jQuery(this).data('tax');
        var name = jQuery(this).data('slug');
	//var name = jQuery(this).attr('href');

	//***

	if (tax != 'price') {
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
	} else {
	    delete cwpf_current_values['min_price'];
	    delete cwpf_current_values['max_price'];
	}

	cwpf_ajax_page_num = 1;
        cwpf_reset_btn_action=true;
	//if (cwpf_autosubmit)
	{
	    cwpf_submit_link(cwpf_get_submit_link());
	}
	jQuery('.cwpf_products_top_panel').find("[data-tax='" + tax + "'][href='" + name + "']").hide(333);
	return false;
    });

}

//control conditions if proucts shortcode uses on the page
function cwpf_shortcode_observer() {

    var redirect=true;
    if(jQuery('.cwpf_shortcode_output').length || (jQuery('.woocommerce .products').length && !jQuery('.single-product').length)){
        redirect=false;
    }
    if(jQuery('.woocommerce .woocommerce-info').length ){
        redirect=false;
    }
    if( typeof cwpf_not_redirect!== 'undefined' && cwpf_not_redirect==1 ){
        redirect=false;
    }

    if(jQuery('.woopt-data-table').length){
        redirect=false;
    }

    if (!redirect) {
        cwpf_current_page_link = location.protocol + '//' + location.host + location.pathname;
    }

    if (jQuery('#cwpf_results_by_ajax').length) {
	cwpf_is_ajax = 1;
    }
}



function cwpf_init_beauty_scroll() {
    if (cwpf_use_beauty_scroll) {
	try {
	    var anchor = ".cwpf_section_scrolled, .cwpf_sid_auto_shortcode .cwpf_container_radio .cwpf_block_html_items, .cwpf_sid_auto_shortcode .cwpf_container_checkbox .cwpf_block_html_items, .cwpf_sid_auto_shortcode .cwpf_container_label .cwpf_block_html_items";
	    jQuery("" + anchor).mCustomScrollbar('destroy');
	    jQuery("" + anchor).mCustomScrollbar({
		scrollButtons: {
		    enable: true
		},
		advanced: {
		    updateOnContentResize: true,
		    updateOnBrowserResize: true
		},
		theme: "dark-2",
		horizontalScroll: false,
		mouseWheel: true,
		scrollType: 'pixels',
		contentTouchScroll: true
	    });
	} catch (e) {
	    console.log(e);
	}
    }
}

//just for inbuilt price range widget
function cwpf_remove_class_widget() {
    jQuery('.cwpf_container_inner').find('.widget').removeClass('widget');
}

function cwpf_init_show_auto_form() {
    jQuery('.cwpf_show_auto_form').unbind('click');
    jQuery('.cwpf_show_auto_form').click(function () {
	var _this = this;
	jQuery(_this).addClass('cwpf_hide_auto_form').removeClass('cwpf_show_auto_form');
	jQuery(".cwpf_auto_show").show().animate(
		{
		    height: (jQuery(".cwpf_auto_show_indent").height() + 20) + "px",
		    opacity: 1
		}, 377, function () {
	    //jQuery(_this).text(cwpf_lang_hide_products_filter);
	    cwpf_init_hide_auto_form();
	    jQuery('.cwpf_auto_show').removeClass('cwpf_overflow_hidden');
	    jQuery('.cwpf_auto_show_indent').removeClass('cwpf_overflow_hidden');
	    jQuery(".cwpf_auto_show").height('auto');
	});


	return false;
    });


}

function cwpf_init_hide_auto_form() {
    jQuery('.cwpf_hide_auto_form').unbind('click');
    jQuery('.cwpf_hide_auto_form').click(function () {
	var _this = this;
	jQuery(_this).addClass('cwpf_show_auto_form').removeClass('cwpf_hide_auto_form');
	jQuery(".cwpf_auto_show").show().animate(
		{
		    height: "1px",
		    opacity: 0
		}, 377, function () {
	    //jQuery(_this).text(cwpf_lang_show_products_filter);
	    jQuery('.cwpf_auto_show').addClass('cwpf_overflow_hidden');
	    jQuery('.cwpf_auto_show_indent').addClass('cwpf_overflow_hidden');
	    cwpf_init_show_auto_form();
	});

	return false;
    });


}

//if we have mode - child checkboxes closed - append openers buttons by js
function cwpf_checkboxes_slide() {
    if (cwpf_checkboxes_slide_flag == true) {
        var childs = jQuery('ul.cwpf_childs_list');
        if (childs.length) {
            jQuery.each(childs, function (index, ul) {

                if (jQuery(ul).parents('.cwpf_no_close_childs').length) {
                    return;
                }


                var span_class = 'cwpf_is_closed';
                if (cwpf_supports_html5_storage()) {
                    //test mode  from 06.11.2017
                    //console.log(jQuery(ul).closest('li').attr("class"));
                   // var preulstate = localStorage.getItem(jQuery(ul).closest('li').find('label').first().text());
                    var preulstate = localStorage.getItem(jQuery(ul).closest('li').attr("class"));
                    if (preulstate && preulstate == 'cwpf_is_opened') {
                        var span_class = 'cwpf_is_opened';
                        jQuery(ul).show();
                    }
                    jQuery(ul).before('<a href="javascript:void(0);" class="cwpf_childs_list_opener"><span class="' + span_class + '"></span></a>');
                    //++
                } else {
                    if (jQuery(ul).find('input[type=checkbox],input[type=radio]').is(':checked')) {
                        jQuery(ul).show();
                        span_class = 'cwpf_is_opened';
                    }
                    jQuery(ul).before('<a href="javascript:void(0);" class="cwpf_childs_list_opener"><span class="' + span_class + '"></span></a>');

                }

            });

            jQuery.each(jQuery('a.cwpf_childs_list_opener span'), function (index, a) {

                jQuery(a).click(function () {
                    var span = jQuery(this);
                    var this_ = jQuery(this).parent(".cwpf_childs_list_opener");
                    if (span.hasClass('cwpf_is_closed')) {
                        //lets open
                        jQuery(this_).parent().find('ul.cwpf_childs_list').first().show(333);
                        span.removeClass('cwpf_is_closed');
                        span.addClass('cwpf_is_opened');
                    } else {
                        //lets close
                        jQuery(this_).parent().find('ul.cwpf_childs_list').first().hide(333);
                        span.removeClass('cwpf_is_opened');
                        span.addClass('cwpf_is_closed');
                    }

                    if (cwpf_supports_html5_storage()) {
                        //test mode  from 06.11.2017
                      //  var ullabel = jQuery(this_).closest("li").find("label").first().text();
                        var ullabel =jQuery(this_).closest('li').attr("class");
                        var ullstate = jQuery(this_).children("span").attr("class");
                        localStorage.setItem(ullabel, ullstate);
                        //++
                    }
                    return false;
                });
            });
        }
    }
}

function cwpf_init_ion_sliders() {

    jQuery.each(jQuery('.cwpf_range_slider'), function (index, input) {
	try {


	    jQuery(input).ionRangeSlider({
		min: jQuery(input).data('min'),
		max: jQuery(input).data('max'),
		from: jQuery(input).data('min-now'),
		to: jQuery(input).data('max-now'),
		type: 'double',
		prefix: jQuery(input).data('slider-prefix'),
		postfix: jQuery(input).data('slider-postfix'),
		prettify: true,
		hideMinMax: false,
		hideFromTo: false,
		grid: true,
		step: jQuery(input).data('step'),
		onFinish: function (ui) {
                    var tax=jQuery(input).data('taxes');
		    cwpf_current_values.min_price = (parseInt(ui.from, 10)/tax);
		    cwpf_current_values.max_price = (parseInt(ui.to, 10)/tax);
		    //woocs adaptation
		    if (typeof woocs_current_currency !== 'undefined') {
			cwpf_current_values.min_price = Math.ceil(cwpf_current_values.min_price / parseFloat(woocs_current_currency.rate));
			cwpf_current_values.max_price = Math.ceil(cwpf_current_values.max_price / parseFloat(woocs_current_currency.rate));
		    }
		    //***
		    cwpf_ajax_page_num = 1;
		    //jQuery(input).within('.cwpf').length -> if slider is as shortcode
		    if (cwpf_autosubmit || jQuery(input).within('.cwpf').length == 0) {
			cwpf_submit_link(cwpf_get_submit_link());
		    }
		    return false;
		}
	    });
	} catch (e) {

	}
    });
}

function cwpf_init_native_woo_price_filter() {
    jQuery('.widget_price_filter form').unbind('submit');
    jQuery('.widget_price_filter form').submit(function () {
	var min_price = jQuery(this).find('.price_slider_amount #min_price').val();
	var max_price = jQuery(this).find('.price_slider_amount #max_price').val();
	cwpf_current_values.min_price = min_price;
	cwpf_current_values.max_price = max_price;
	cwpf_ajax_page_num = 1;
	if (cwpf_autosubmit) {
	    //comment next code row to avoid endless ajax requests
	    cwpf_submit_link(cwpf_get_submit_link(),0);
	}
	return false;
    });

}

//we need after ajax redrawing of the search form
function cwpf_reinit_native_woo_price_filter() {

    // woocommerce_price_slider_params is required to continue, ensure the object exists
    if (typeof woocommerce_price_slider_params === 'undefined') {

	return false;
    }

    // Get markup ready for slider
    jQuery('input#min_price, input#max_price').hide();
    jQuery('.price_slider, .price_label').show();

    // Price slider uses jquery ui
    var min_price = jQuery('.price_slider_amount #min_price').data('min'),
	    max_price = jQuery('.price_slider_amount #max_price').data('max'),
	    current_min_price = parseInt(min_price, 10),
	    current_max_price = parseInt(max_price, 10);

    if (cwpf_current_values.hasOwnProperty('min_price')) {
	current_min_price = parseInt(cwpf_current_values.min_price, 10);
	current_max_price = parseInt(cwpf_current_values.max_price, 10);
    } else {
	if (woocommerce_price_slider_params.min_price) {
	    current_min_price = parseInt(woocommerce_price_slider_params.min_price, 10);
	}
	if (woocommerce_price_slider_params.max_price) {
	    current_max_price = parseInt(woocommerce_price_slider_params.max_price, 10);
	}
    }

    //***

    var currency_symbol = woocommerce_price_slider_params.currency_symbol;
    if (typeof currency_symbol == 'undefined') {
	currency_symbol = woocommerce_price_slider_params.currency_format_symbol;
    }

    jQuery(document.body).bind('price_slider_create price_slider_slide', function (event, min, max) {

	if (typeof woocs_current_currency !== 'undefined')        {
	    var label_min = min;
	    var label_max = max;
            if(typeof currency_symbol == 'undefined'){

               currency_symbol=woocs_current_currency.symbol
            }


	    if (woocs_current_currency.rate !== 1) {
		label_min = Math.ceil(label_min * parseFloat(woocs_current_currency.rate));
		label_max = Math.ceil(label_max * parseFloat(woocs_current_currency.rate));
	    }

	    //+++
	    label_min = cwpf_front_number_format(label_min, 2, '.', ',');
	    label_max = cwpf_front_number_format(label_max, 2, '.', ',');
	    if (jQuery.inArray(woocs_current_currency.name, woocs_array_no_cents) || woocs_current_currency.hide_cents == 1) {
		label_min = label_min.replace('.00', '');
		label_max = label_max.replace('.00', '');
	    }
	    //+++


	    if (woocs_current_currency.position === 'left') {

		jQuery('.price_slider_amount span.from').html(currency_symbol + label_min);
		jQuery('.price_slider_amount span.to').html(currency_symbol + label_max);

	    } else if (woocs_current_currency.position === 'left_space') {

		jQuery('.price_slider_amount span.from').html(currency_symbol + " " + label_min);
		jQuery('.price_slider_amount span.to').html(currency_symbol + " " + label_max);

	    } else if (woocs_current_currency.position === 'right') {

		jQuery('.price_slider_amount span.from').html(label_min + currency_symbol);
		jQuery('.price_slider_amount span.to').html(label_max + currency_symbol);

	    } else if (woocs_current_currency.position === 'right_space') {

		jQuery('.price_slider_amount span.from').html(label_min + " " + currency_symbol);
		jQuery('.price_slider_amount span.to').html(label_max + " " + currency_symbol);

	    }

	} else {

	    if (woocommerce_price_slider_params.currency_pos === 'left') {

		jQuery('.price_slider_amount span.from').html(currency_symbol + min);
		jQuery('.price_slider_amount span.to').html(currency_symbol + max);

	    } else if (woocommerce_price_slider_params.currency_pos === 'left_space') {

		jQuery('.price_slider_amount span.from').html(currency_symbol + ' ' + min);
		jQuery('.price_slider_amount span.to').html(currency_symbol + ' ' + max);

	    } else if (woocommerce_price_slider_params.currency_pos === 'right') {

		jQuery('.price_slider_amount span.from').html(min + currency_symbol);
		jQuery('.price_slider_amount span.to').html(max + currency_symbol);

	    } else if (woocommerce_price_slider_params.currency_pos === 'right_space') {

		jQuery('.price_slider_amount span.from').html(min + ' ' + currency_symbol);
		jQuery('.price_slider_amount span.to').html(max + ' ' + currency_symbol);

	    }
	}

	jQuery(document.body).trigger('price_slider_updated', [min, max]);
    });

    jQuery('.price_slider').slider({
	range: true,
	animate: true,
	min: min_price,
	max: max_price,
	values: [current_min_price, current_max_price],
	create: function () {

	    jQuery('.price_slider_amount #min_price').val(current_min_price);
	    jQuery('.price_slider_amount #max_price').val(current_max_price);

	    jQuery(document.body).trigger('price_slider_create', [current_min_price, current_max_price]);
	},
	slide: function (event, ui) {

	    jQuery('input#min_price').val(ui.values[0]);
	    jQuery('input#max_price').val(ui.values[1]);

	    jQuery(document.body).trigger('price_slider_slide', [ui.values[0], ui.values[1]]);
	},
	change: function (event, ui) {
	    jQuery(document.body).trigger('price_slider_change', [ui.values[0], ui.values[1]]);
	}
    });


    //***
    cwpf_init_native_woo_price_filter();
}

function cwpf_mass_reinit() {
    cwpf_remove_empty_elements();
    cwpf_open_hidden_li();
    cwpf_init_search_form();
    cwpf_hide_info_popup();
    cwpf_init_beauty_scroll();
    cwpf_init_ion_sliders();
    cwpf_reinit_native_woo_price_filter();//native woo price range slider reinit
    cwpf_recount_text_price_filter();
    cwpf_draw_products_top_panel();
}

function cwpf_recount_text_price_filter() {
    //change value in textinput price filter if WOOCS is installed
    if (typeof woocs_current_currency !== 'undefined') {
	jQuery.each(jQuery('.cwpf_price_filter_txt_from, .cwpf_price_filter_txt_to'), function (i, item) {
	    jQuery(this).val(Math.ceil(jQuery(this).data('value')));
	});
    }
}

function cwpf_init_toggles() {
	jQuery(document).on('click','.cwpf_front_toggle',function(){
	if (jQuery(this).data('condition') == 'opened') {
	    jQuery(this).removeClass('cwpf_front_toggle_opened');
	    jQuery(this).addClass('cwpf_front_toggle_closed');
	    jQuery(this).data('condition', 'closed');
	    if (cwpf_toggle_type == 'text') {
		jQuery(this).text(cwpf_toggle_closed_text);
	    } else {
		jQuery(this).find('img').prop('src', cwpf_toggle_closed_image);
	    }
	} else {
	    jQuery(this).addClass('cwpf_front_toggle_opened');
	    jQuery(this).removeClass('cwpf_front_toggle_closed');
	    jQuery(this).data('condition', 'opened');
	    if (cwpf_toggle_type == 'text') {
		jQuery(this).text(cwpf_toggle_opened_text);
	    } else {
		jQuery(this).find('img').prop('src', cwpf_toggle_opened_image);
	    }
	}


	jQuery(this).parents('.cwpf_container_inner').find('.cwpf_block_html_items').toggle(500);
	return false;
    });
}

//for "Show more" blocks
function cwpf_open_hidden_li() {
    if (jQuery('.cwpf_open_hidden_li_btn').length > 0) {
	jQuery.each(jQuery('.cwpf_open_hidden_li_btn'), function (i, b) {
	    if (jQuery(b).parents('ul').find('li.cwpf_hidden_term input[type=checkbox],li.cwpf_hidden_term input[type=radio]').is(':checked')) {
		jQuery(b).trigger('click');
	    }
	});
    }
}

//http://stackoverflow.com/questions/814613/how-to-read-get-data-from-a-url-using-javascript
function $_cwpf_GET(q, s) {
    s = (s) ? s : window.location.search;
    var re = new RegExp('&' + q + '=([^&]*)', 'i');
    return (s = s.replace(/^\?/, '&').match(re)) ? s = s[1] : s = '';
}

function cwpf_parse_url(url) {
    var pattern = RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?");
    var matches = url.match(pattern);
    return {
	scheme: matches[2],
	authority: matches[4],
	path: matches[5],
	query: matches[7],
	fragment: matches[9]
    };
}


//      cwpf price radio;
function cwpf_price_filter_radio_init() {
    if (icheck_skin != 'none') {
	jQuery('.cwpf_price_filter_radio').iCheck('destroy');

	jQuery('.cwpf_price_filter_radio').iCheck({
	    radioClass: 'iradio_' + icheck_skin.skin + '-' + icheck_skin.color,
	    //radioClass: 'iradio_square-green'
	});

	jQuery('.cwpf_price_filter_radio').siblings('div').removeClass('checked');

	jQuery('.cwpf_price_filter_radio').unbind('ifChecked');
	jQuery('.cwpf_price_filter_radio').on('ifChecked', function (event) {
	    jQuery(this).attr("checked", true);
	    jQuery('.cwpf_radio_price_reset').removeClass('cwpf_radio_term_reset_visible');
	    jQuery(this).parents('.cwpf_list').find('.cwpf_radio_price_reset').removeClass('cwpf_radio_term_reset_visible');
	    jQuery(this).parents('.cwpf_list').find('.cwpf_radio_price_reset').hide();
	    jQuery(this).parents('li').eq(0).find('.cwpf_radio_price_reset').eq(0).addClass('cwpf_radio_term_reset_visible');
	    var val = jQuery(this).val();
	    if (parseInt(val, 10) == -1) {
		delete cwpf_current_values.min_price;
		delete cwpf_current_values.max_price;
		jQuery(this).removeAttr('checked');
		jQuery(this).siblings('.cwpf_radio_price_reset').removeClass('cwpf_radio_term_reset_visible');
	    } else {
		var val = val.split("-");
		cwpf_current_values.min_price = val[0];
		cwpf_current_values.max_price = val[1];
		jQuery(this).siblings('.cwpf_radio_price_reset').addClass('cwpf_radio_term_reset_visible');
		jQuery(this).attr("checked", true);
	    }
	    if (cwpf_autosubmit || jQuery(this).within('.cwpf').length == 0) {
		cwpf_submit_link(cwpf_get_submit_link());
	    }
	});

    } else {
	jQuery(document).on('click','.cwpf_price_filter_radio',function(){
	    var val = jQuery(this).val();
	    jQuery('.cwpf_radio_price_reset').removeClass('cwpf_radio_term_reset_visible');
	    if (parseInt(val, 10) == -1) {
		delete cwpf_current_values.min_price;
		delete cwpf_current_values.max_price;
		jQuery(this).removeAttr('checked');
		jQuery(this).siblings('.cwpf_radio_price_reset').removeClass('cwpf_radio_term_reset_visible');
	    } else {
		var val = val.split("-");
		cwpf_current_values.min_price = val[0];
		cwpf_current_values.max_price = val[1];
		jQuery(this).siblings('.cwpf_radio_price_reset').addClass('cwpf_radio_term_reset_visible');
		jQuery(this).attr("checked", true);
	    }
	    if (cwpf_autosubmit || jQuery(this).within('.cwpf').length == 0) {
		cwpf_submit_link(cwpf_get_submit_link());
	    }
	});
    }
    //***
    jQuery('.cwpf_radio_price_reset').click(function () {
	delete cwpf_current_values.min_price;
	delete cwpf_current_values.max_price;
	jQuery(this).siblings('div').removeClass('checked');
	jQuery(this).parents('.cwpf_list').find('input[type=radio]').removeAttr('checked');
	//jQuery(this).remove();
	jQuery(this).removeClass('cwpf_radio_term_reset_visible');
	if (cwpf_autosubmit) {
	    cwpf_submit_link(cwpf_get_submit_link());
	}
	return false;
    });
}
//    END  cwpf price radio;



//compatibility with YITH Infinite Scrolling
function cwpf_serialize(serializedString) {
    var str = decodeURI(serializedString);
    var pairs = str.split('&');
    var obj = {}, p, idx, val;
    for (var i = 0, n = pairs.length; i < n; i++) {
	p = pairs[i].split('=');
	idx = p[0];

	if (idx.indexOf("[]") == (idx.length - 2)) {
	    // Eh um vetor
	    var ind = idx.substring(0, idx.length - 2)
	    if (obj[ind] === undefined) {
		obj[ind] = [];
	    }
	    obj[ind].push(p[1]);
	} else {
	    obj[idx] = p[1];
	}
    }
    return obj;
}


//compatibility with YITH Infinite Scrolling
function cwpf_infinite() {

    if (typeof yith_infs === 'undefined') {
	return;
    }


    //***
    var infinite_scroll1 = {
	//'nextSelector': ".cwpf_infinity .nav-links .next",
        'nextSelector': '.woocommerce-pagination li .next',
	'navSelector': yith_infs.navSelector,
	'itemSelector': yith_infs.itemSelector,
	'contentSelector': yith_infs.contentSelector,
	'loader': '<img src="' + yith_infs.loader + '">',
	'is_shop': yith_infs.shop
    };
var curr_l = window.location.href;
var curr_link = curr_l.split('?');
var get="";
    if (curr_link[1] != undefined) {
	var temp = cwpf_serialize(curr_link[1]);
	delete temp['paged'];
	get = decodeURIComponent(jQuery.param(temp))
    }

  var page_link = jQuery('.woocommerce-pagination li .next').attr("href");
    //console.log(page_link);
    if(page_link==undefined){
       page_link=curr_link+"page/1/"
    }

var ajax_link=page_link.split('?');
var page="";
    if (ajax_link[1] != undefined) {
	var temp1 = cwpf_serialize(ajax_link[1]);
        if(temp1['paged']!=undefined){
          page= "page/"+ temp1['paged']+"/";
        }
    }

    page_link = curr_link[0] +page+ '?' + get;
    //console.log(page_link);
    jQuery('.woocommerce-pagination li .next').attr('href', page_link);

    jQuery(window).unbind("yith_infs_start"), jQuery(yith_infs.contentSelector).yit_infinitescroll(infinite_scroll1)
}
//End infinity scroll

//fix  if cwpf - is ajax  and  cart - is redirect
function cwpf_change_link_addtocart(){
    if(!cwpf_is_ajax){
        return;
    }
    jQuery(".add_to_cart_button").each(function(i,elem) {
        var link = jQuery(elem).attr('href');
        var link_items =link.split("?");
        var site_link_items = window.location.href.split("?");
        if(link_items[1]!=undefined){
            link= site_link_items[0]+"?"+link_items[1];
            jQuery(elem).attr('href',link);
        }
    });

}
//https://github.com/kvz/phpjs/blob/master/functions/strings/number_format.js
function cwpf_front_number_format(number, decimals, dec_point, thousands_sep) {
    number = (number + '')
	    .replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
	    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
	    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
	    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
	    s = '',
	    toFixedFix = function (n, prec) {
		var k = Math.pow(10, prec);
		return '' + (Math.round(n * k) / k)
			.toFixed(prec);
	    };
// Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
	    .split('.');
    if (s[0].length > 3) {
	s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '')
	    .length < prec) {
	s[1] = s[1] || '';
	s[1] += new Array(prec - s[1].length + 1)
		.join('0');
    }
    return s.join(dec);
}

//additional function to check local storage

function cwpf_supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
} catch (e) {
    return false;
  }
}

function cwpf_init_tooltip(){
    var tooltips=jQuery(".cwpf_tooltip_header");

    if(tooltips.length){

        jQuery(tooltips).tooltipster({
                theme: 'tooltipster-noir',
                side: 'right'
            });
    }

}

function cwpf_show_hide_widget(){
	if(jQuery('.cwpf_sid_auto_shortcode .cwpf_redraw_zone .cwpf_container .cwpf_container_inner')[0]){
		jQuery(document).on('click','.cwpf_sid_auto_shortcode .cwpf_redraw_zone .cwpf_container .cwpf_container_inner', function(){
			jQuery('.cwpf_sid_auto_shortcode .cwpf_redraw_zone .cwpf_container .cwpf_container_inner').removeClass('active');
			jQuery(this).addClass('active');
		});
		jQuery(document).on('click','.cwpf_sid_auto_shortcode .cwpf_redraw_zone .cwpf_container .cwpf_container_inner.active', function(){
			jQuery(this).removeClass('active');
		});
	}
}
