/**
 * sidebarEffects.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, Codrops
 * http://www.codrops.com
 *
 * Modified by Art Chen (http://rakugaki.me)
 */
jQuery(document).ready(function($) {

    var taporclick = "tap";

	function initSidebarEffects() {

		var container = $('#st-container');
        var resetMenu = function() { container.removeClass('st-menu-open'); };
        
		var the_button = $('.nav-trigger');
        var effect = the_button.attr('data-effect');
        
        the_button.on(taporclick, function( ev ) {
            console.log("OPEN LEFT NAVBAR");
            ev.stopPropagation();
            ev.preventDefault();
            the_button.css("opacity", 0);
            container.className = 'st-container'; // clear
            container.addClass( effect );
            setTimeout( function() {
				container.addClass( 'st-menu-open' );
            }, 25 );
            $('body, .st-pusher').on(taporclick, function(event){
                console.log("CLOSE LEFT NAVBAR");
                event.stopPropagation();
                resetMenu();
                setTimeout(function(e){
                    if(!$('#st-container').hasClass('st-menu-open')){
                        the_button.css("opacity", 1);
                    }
                }, 500);
            });
            $('.st-menu').on(taporclick, function(event){
                event.stopPropagation();
            });
        });

	}

	initSidebarEffects();

});