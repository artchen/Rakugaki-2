!function($){angular.module("rakugaki").controller("SlideController",["$rootScope","$scope","$timeout","$state","$stateParams","$sce",function(o,t,n,e,a,r){t.modal={slug:"",name:"",wp:"",ghost:"",show:!1},t.iframeSource="",t.openModal=function(){t.$parent.modalShown=!0,$(".slide-nav, .info-trigger, .nav-trigger").fadeOut(),t.modal.show=!0},t.closeModal=function(){t.$parent.modalShown=!1,t.modal.show=!1,n(function(){$(".slide-nav, .info-trigger, .nav-trigger").fadeIn()},500)},t.initKeyControl=function(){$(document).keydown(function(o){if("textarea"!==o.target.type&&"text"!==o.target.type){var t=o.keyCode||o.which;switch(t){case 27:$(".md-close").click()}}})},t.initLogoAnimations=function(){$(".bamboo").hover(function(){$(".bamboo .trigger").addClass("shake")},function(){$(".bamboo .trigger").removeClass("shake")}),$("#kcalb-logo").hover(function(){$("#kcalb .logo").addClass("bounce")},function(){$("#kcalb .logo").removeClass("bounce")}),$("#springtide-logo").hover(function(){$(this).addClass("tada")},function(){$(this).removeClass("tada")})},t.prenventPropagation=function(o){o.stopPropagation()},t.preventDefault=function(o){o.preventDefault()},t.setupIframe=function(){t.iframeSource=r.trustAsResourceUrl(t.modal.demo)},t.initPerfectScrollbar=function(){$(".resume-wrapper").perfectScrollbar()},t.init=function(){t.initPerfectScrollbar(),t.initLogoAnimations(),t.initKeyControl(),("yabu"==e.current.name||"kcalb"==e.current.name)&&(t.modal={slug:e.current.data.slug,name:e.current.data.name,wp:e.current.data.wp,ghost:e.current.data.ghost,demo:e.current.data.demo,show:!1},t.setupIframe()),n(function(){t.$parent.inTransition=!1},320)},t.init(),o.$on("$stateChangeSuccess",function(o,t,n,e,a){})}])}(jQuery,angular);