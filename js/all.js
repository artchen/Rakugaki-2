/**
 * All custom js effects for Rakugaki.me
 * http://rakugaki.me
 *
 * Created by Art Chen
 */
jQuery(document).ready(function ($) {
    
    "use strict";
    
    var no_touch_flag = 0;
    var defaultEvent = "";
    
    if (Modernizr.touch){
        defaultEvent = "tap";
	} else {
        no_touch_flag = 1; 
        defaultEvent = "click";
    }
    
    $(document).on('touchmove', function(e) {
        e.preventDefault();
    });
        
    /**
    *
    * FSS - Full Screen Sliding Website Plugin
    * URL: http://www.codecanyon.net/user/skyplugins
    * Version: 1.1
    * Author: Sky Plugins
    * Author URL: http://www.codecanyon.net/user/skyplugins
    *
    * Modified by Art Chen (http://rakugaki.me)
    *
    */
    
    var sliderSettings = {
        homeButton: '.home-button',
        prevButton: '.prev-button',
        nextButton: '.next-button',
        transition: 'horizontal',
        transitionSpeed: 500,
        easing: 'easeInOutQuint'
    };

    
    var slider = $(".slider");
    var slideContainer = slider.children('div.slides');
    var slides = slideContainer.children('div.slide');
    var numSlides = slides.length;
    var introAnimationPlayed = false;
    var height = $(window).height();
    var width = $(window).width();
    
    function initSlider() {

        initFullScreen();

        height = $(window).height();
        width = $(window).width();

        slider.css({
            height: height,
            width: width,
            position: 'relative',
            overflow: 'hidden'
        });

        slideContainer.css('position', 'absolute');

        slides.css({
            position: 'relative',
            width: width,
            height: height,
            "overflow-x": 'auto',
            "overflow-y": 'hidden'
        });
        
        if (sliderSettings.transition === 'horizontal') {
            slideContainer.css('width', numSlides * width);
            slides.css('float', 'left');
        }

        initKeyboardNavigation();

        initAddressPlugin();

        initSpecialAnchors(slider);

        initSpecialButtons(slider);

    }
    
    function initAddressPlugin() {
        
        $.address.init(function() {
            $.address.autoUpdate(false);
        }).change(function(event) {
            var id = event.value;
            id = event.value.substring(1);

            // Go to home if the id is null
            if (id !== '' && typeof(id) !== 'undefined') {
                if (slides.filter('#' + id).size() > 0) {
                    selectSlideById(id);
                } else {
                    gotoHome();
                }
            } else {
                gotoHome();
            }
        });
    }
    
    function initFullScreen() {

        $('html, body').css({
            margin: 0,
            padding: 0,
            overflow: 'hidden'
        });

        $(window).resize(function() {

            height = $(window).height();
            width = $(window).width();

            slider.css({
                width: width,
                height: height
            });
            slides.css({
                width: width,
                height: height
            });

            var currentSlideIndex = getCurrentSlide().index();

            if (currentSlideIndex !== -1) {
                if (sliderSettings.transition === 'horizontal') {
                    slideContainer.css({width: numSlides * width});
                    slider.stop().scrollLeft(currentSlideIndex * width);
                } else {
                    slider.stop().scrollTop(currentSlideIndex * height);
                }
                
            }
        });

    }
    
    function initSpecialAnchors() {

        $('.special-anchor-direct').on(defaultEvent, function(event) {
            var href = $(this).attr('data-slide');
            if ($(".slide-wrapper").hasClass("slide-wrapper-showdetail")) {
                $(".slide-wrapper").removeClass("slide-wrapper-showdetail");
                setTimeout(function(){
                    $(".slide-nav").fadeIn();
                    $(".info-trigger").fadeIn();
                }, 500);
                enableSwipe();
            }
            $.address.value(href);
                $.address.update();
            if ($(this).hasClass("menu-about")) {
                setTimeout(function(){
                    console.log("GO TO NAME CARD");
                    event.stopPropagation();
                    $( '#st-container' ).removeClass('st-menu-open');
                    if(!$('#st-container').hasClass('st-menu-open')){
                        $('.nav-trigger').css("opacity", 1);
                    }  
                }, 550);
            }
            
            return false;
        });
    }

    function initSpecialButtons() {

        $(sliderSettings.homeButton + ".special-anchor").on(defaultEvent, function() {
            gotoHome();
        });
        
        $( sliderSettings.prevButton + ".special-anchor").on(defaultEvent, function(){
            selectPrevious();
        });
        
        $(sliderSettings.nextButton + ".special-anchor").on(defaultEvent, function(){
            selectNext();
        });
    }

    var initKeyboardNavigation = function() {

        $(document).keydown(function(event) {
            /* Check visibility of popup modal */
            var checkModal = function(){
                var isModalVisible = false;
                $(".slide-wrapper").each(function(){
                    if ($(this).hasClass("slide-wrapper-showdetail")){
                        isModalVisible = true;
                    }
                });
                return !isModalVisible;
            };
            
            if (event.target.type !== 'textarea' &&
                event.target.type !== 'text' &&
                checkModal()
            ) { 
                var keyCode = event.keyCode || event.which;

                switch (keyCode) {
                    case 37: // Left arrow
                        selectPrevious();
                    break;
                    case 39: // Right arrow
                        selectNext();
                        break;
                    default:
                        break;
                }
            }
        });
    };

    function selectSlideById(id, callback) {

        var index = slides.filter("#" + id).index();
        selectSlideByIndex(index, callback);

    }

    function gotoHome(callback) {

        $.address.value(slides.eq(0).attr('id'));
        $.address.update();

        if (callback) {
            callback();
        }

    }

    function selectNext(callback) {

        var index = getCurrentSlide().index();

        if (++index === numSlides) {
            index = 0;
        }

        $.address.value(slides.eq(index).attr('id'));
        $.address.update();

        if (callback) {
            callback();
        }

    }

    function selectPrevious(callback) {

        var index = getCurrentSlide().index();

        if (--index < 0) {
            index = numSlides - 1;
        }

        $.address.value(slides.eq(index).attr('id'));
        $.address.update();

        if (callback) {
            callback();
        }

    }

    function selectSlideByIndex(index, callback) {

        var current = getCurrentSlide();

        if (index !== current.index() && index !== -1) {

            getPrevSlide().removeClass('prev');
            current.removeClass('current').addClass('prev');
            slides.eq(index).addClass('current');
            var speedBuffer;
            
            if (!introAnimationPlayed) {
                speedBuffer = sliderSettings.transitionSpeed;
                sliderSettings.transitionSpeed = 0;
                introAnimationPlayed = true;
            }

            switch (sliderSettings.transition) {
                case 'vertical': 
                    slideVertical(callback);
                    break;
                default:
                case 'none':
                case 'horizontal': 
                    slideHorizontal(callback);
                    break;
            }
            
            if (typeof(speedBuffer) !== 'undefined') {
                sliderSettings.transitionSpeed = speedBuffer;
            }

        } else {
            
            if (callback) {
                callback();
            }
        }

    }
    
    function slideHorizontal(callback) {

        slider.stop().animate({
            scrollLeft: getCurrentSlide().index() * width
        }, sliderSettings.transitionSpeed, sliderSettings.easing, function() {
            
            if (callback) {
                callback();
            }
        });

    }

    function slideVertical(callback) {

        slider.stop().animate({
            scrollTop: getCurrentSlide().index() * height
        }, sliderSettings.transitionSpeed, sliderSettings.easing, function() {

            if (callback) {
                callback();
            }
        });

    }

    function getCurrentSlide() {

        return slides.filter('div.current');

    }

    function getPrevSlide() {

        return slides.filter('div.prev');

    }
    
    initSlider();

    /**************************/
    /***** Start Raku JS *****/
    
    /* tap_anim(x, y) by http://www.socketstudios.com */
    
    function tap_anime (tap_xpos, tap_ypos){
   
        $(".plot").css('visibility', 'visible');

        var offset = 5;

        $(".plot").css('width', 30 + 'px');
        $(".plot").css('height', 30 + 'px');
        $(".plot").css('left', tap_xpos - 15 + 'px');
        $(".plot").css('top', tap_ypos - 15 + 'px');
        $(".plot").css({ opacity: 0.3 });
        $(".plot").animate({
          opacity: 0,
          height: 40 + "px",
          width: 40 + "px",
          left: "-=" + offset + "px",
          top: "-=" + offset + "px"
        }, 300, function() {
            $(".plot").css('visibility', 'hidden');
        });

    }
    
    if (no_touch_flag) {
        $(".st-pusher, .trigger, .md-trigger, .md-modal").on("click", function(event) {
            tap_anime(event.pageX, event.pageY);
        });
    }
    
    function enableSwipe(){
        $("html").on("swipeleft", function(){
            selectNext();
        });
        $("html").on("swiperight", function(){
            selectPrevious();
        });
    }
    function disableSwipe(){
        $("html").off("swipeleft").off("swiperight");
    }
    
    enableSwipe();
    

    $(".md-trigger").on(defaultEvent, function(event){
        console.log("MODAL TRIGGER TAPPED");
        event.preventDefault();
        var modal_selector = "#container-" + $(this).attr('data-modal');
        $(".slide-nav").fadeOut();
        $(".info-trigger").fadeOut();
        disableSwipe();
        $(modal_selector).addClass("slide-wrapper-showdetail");
    });
    
    $(document).keydown(function(event){
        console.log("CLOSE MODAL");
        var keyCode = event.keyCode || event.which;
        switch (keyCode) {
            case 27: // ESC
                if ($(".slide-wrapper").hasClass("slide-wrapper-showdetail")) {
                    $(".slide-wrapper").removeClass("slide-wrapper-showdetail");
                    setTimeout(function(){
                        $(".slide-nav").fadeIn();
                        $(".info-trigger").fadeIn();
                    }, 500);
                    enableSwipe();
                }
                break;
            default:
                break;
        }
    });
    
    /* Popup Inde Menu */
    $(".select-button").on(defaultEvent, function(event){
        console.log("SHOW/HIDE INDEX");
        event.preventDefault();
        if ($(".slide-index").css("display") === "none") {
            $(".slide-index").fadeIn();
            $(this).css("background", "#2b2b2b");
        } else {
            $(".slide-index").fadeOut();
            $(this).css("background", "#313131");
        }
        $('.works-info').removeClass('show');
        
    });
    $('body, .st-pusher').on(defaultEvent, function(event){
        event.stopPropagation();
        $(".slide-index").fadeOut();
        $(".select-button").css("background", "#313131");
    });
    $(".slide-index, .slide-nav").on(defaultEvent, function(event){
        event.stopPropagation();   
    });
    $(".progress").each(function(){
        var percent = parseInt($(this).attr("data-percent"));
        $(this).css('width', percent + '%');
    });
    
    $(".md-close").on(defaultEvent, function(event){
        console.log("CLOSE MODAL");
        event.preventDefault();
        $(this).parent().parent().parent(".slide-wrapper").removeClass("slide-wrapper-showdetail");
        setTimeout(function(){
            $(".slide-nav").fadeIn();
            $(".info-trigger").fadeIn();
        }, 500);
        enableSwipe();
    });
    
    $(".coming").on(defaultEvent, function(event){
        event.preventDefault();
        $(this).html("Coming Soon");
    });
    
    /*
     * Use jquery.address
     *
     */
    
    /* Events on external address change */
    
    $.address.externalChange(function(){

        if ($.address.value() === "/welcome"){
            $.address.title("Rakugaki / Welcome");
            $("#welcome .logo").addClass("fadeIn");
        }
        else if ($.address.value() === "/springtide"){
            $.address.title("Rakugaki / Springtide");
            $("#springtide .logo #springtide-logo").addClass("tada");
            setTimeout(function(){
                $("#springtide .logo #springtide-logo").removeClass("tada");
            }, 1000);
        }
        else if ($.address.value() === "/shiro"){
            $.address.title("Rakugaki / Shiro");
        }
        else if ($.address.value() === "/kcalb"){
            $.address.title("Rakugaki / Kcalb");
        }
        else if ($.address.value() === "/yabu-no-naka"){
            $.address.title("Rakugaki / Yabu no Naka");
            $("#yabu-no-naka .logo #yabu-logo").addClass("fadeInDown");
            $(".bamboo .trigger").addClass("shake-delay");
            setTimeout(function() {
                $(".bamboo .trigger").removeClass("shake-delay");
            }, 2000);
        }
        else if ($.address.value() === "/about"){
            $.address.title("Rakugaki / Me");
        }
    });
    
    /* Events on internal address change */
    
    $.address.internalChange(function() {
        if ($.address.value() === "/welcome"){
            $.address.title("Rakugaki / Welcome");
            $("#welcome .logo").addClass("fadeIn");
        }
        else if ($.address.value() === "/springtide"){
            $.address.title("Rakugaki / Springtide");
            $("#springtide .logo #springtide-logo").addClass("tada");
            setTimeout(function(){
                $("#springtide .logo #springtide-logo").removeClass("tada");
            }, 1000);
        }
        else if ($.address.value() === "/shiro"){
            $.address.title("Rakugaki / Shiro");
        }
        else if ($.address.value() === "/kcalb"){
            $.address.title("Rakugaki / Kcalb");
        }
        else if ($.address.value() === "/yabu-no-naka"){
            $.address.title("Rakugaki / Yabu no Naka");
            $("#yabu-no-naka .logo #yabu-logo").addClass("fadeInDown");
            $(".bamboo .trigger").addClass("shake-delay");
            setTimeout(function() {
                $(".bamboo .trigger").removeClass("shake-delay");
            }, 2000);
        }
        else if ($.address.value() === "/about"){
            $.address.title("Rakugaki / Me");
        }
    });
    
    /* other trivial effects */
    
    $(".bamboo").hover(
        function(){
            $(".bamboo .trigger").addClass("shake");
        },function(){
            $(".bamboo .trigger").removeClass("shake");
        }
    );
    
    $("#kcalb-logo").hover(
        function(){
            $("#kcalb .logo").addClass("bounce");
        }, function(){
            $("#kcalb .logo").removeClass("bounce");
        }
    );
    
    $("#springtide-logo").hover(
        function(){
            $(this).addClass("tada");
        }, function(){
            $(this).removeClass("tada");
        }
    );
    
    /* adjust buttons alignment */
    
    $(".md-get-theme").each(function(){
        $(this).css("width", $(this).children('a').length * 140);
    });    
    
    $('.slide-index, .works-info-content-wrapper, .resume-wrapper').perfectScrollbar();
    
    $('.show-info a').on(defaultEvent, function(event){
        event.preventDefault();
        var target_info_selector = '#info-' + $(this).attr('data-info');
        if ($(target_info_selector).hasClass('show')) {
            $(target_info_selector).removeClass('show');
        }
        else {
            $(target_info_selector).addClass('show');
        }
    });
    
    $('.close-info-window').on(defaultEvent, function(event){
        event.preventDefault();
        var target_info_selector = '#info-' + $(this).attr('data-info');
        $(target_info_selector).removeClass('show');
    });
    
});