(function($){
	
	/* Slide */
	
	angular.module('rakugaki').controller('SlideController', ['$rootScope', '$scope', '$timeout', '$state', '$stateParams', '$sce', function($rootScope, $scope, $timeout, $state, $stateParams, $sce) {
		
		$scope.modal = {
			slug: "",
			name: "",
			wp: "",
			ghost: "",
			show: false
		};
		
		$scope.iframeSource = "";
		
		/**
		 *	show modal
		 */
		$scope.openModal = function() {
			$scope.$parent.modalShown = true;
			$(".slide-nav, .info-trigger, .nav-trigger").fadeOut();
      $scope.modal.show = true;
		};
		
		/**
		 *	hide modal
		 */
		$scope.closeModal = function() {
			$scope.$parent.modalShown = false;
      $scope.modal.show = false;
      $timeout(function() {
	      $(".slide-nav, .info-trigger, .nav-trigger").fadeIn();
      }, 500);
		};
		
		/**
		 *	initialize keyboard interaction
		 */
		$scope.initKeyControl = function() {
			$(document).keydown(function(event) {  
        if (event.target.type !== 'textarea' &&
            event.target.type !== 'text'
        ) { 
          var keyCode = event.keyCode || event.which;

          switch (keyCode) {
            case 27: // ESC
              $('.md-close').click();
            break;
            default:
              break;
          }
        }
      });
		};
		
		/**
		 *	animation to play on state change
		 */
		$scope.initLogoAnimations = function() {
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
		};
		
		/**
		 *	prevent propagation
		 */
		$scope.prenventPropagation = function(ev) {
      ev.stopPropagation();
		};
		
		/**
		 *	prevent default
		 */
		$scope.preventDefault = function(ev) {
			ev.preventDefault();
		};
		
		/**
		 *	setup iframe secure url
		 */
		$scope.setupIframe = function() {
      $scope.iframeSource = $sce.trustAsResourceUrl($scope.modal.demo);
    }

		/**
		 *	initialize perfect scrollbar
		 */
		$scope.initPerfectScrollbar = function() {
			$('.resume-wrapper').perfectScrollbar();
		};
		
		$scope.init = function() {
			$scope.initPerfectScrollbar();
			$scope.initLogoAnimations();
			$scope.initKeyControl();
			
			if ($state.current.name == 'yabu' || $state.current.name == 'kcalb') {
				$scope.modal = {
					slug: $state.current.data.slug,
					name: $state.current.data.name,
					wp: $state.current.data.wp,
					ghost: $state.current.data.ghost,
					demo: $state.current.data.demo,
					show: false
				};
				$scope.setupIframe();
			}
			
			$timeout(function() {
				$scope.$parent.inTransition = false;
			}, 320);
			
		};
		
		$scope.init();
		
		/**
		 *	do something on state change success
		 */
		$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			//$scope.$parent.transitionAnimation = 'init';
			
		});
		
		

		
	
	}]);
	
})(jQuery, angular);