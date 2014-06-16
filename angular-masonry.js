angular.module('masonryLayout', [])

.directive('masonryLayout', ['$window', function($window) {

	var dimensions, yMargin, xMargin, marginWidth, imgWidth, containers, midContainer, parentContainer, containerHeight, pageHeight;

	function initialise() {
		yMargin = dimensions.yMargin;
		xMargin = dimensions.xMargin;
		marginWidth = dimensions.marginWidth;
		imgWidth = dimensions.imgWidth;
		containers = dimensions.containers;
	}

	return {
		restrict: 'A',

		require: '^masonryResize',

		link: function(scope, element, attrs, ctrl) {

			var imageElem = element.find('img'),
				tallestColumn, homeColumn, newLeft, newTop, newWidth;

			element[0].style.cssText += "; left: -999px; top: -999px; opacity: 0; position:absolute; "

			var repaint = function() {
			
				homeColumn = ctrl.shortest();				
				tallestColumn = ctrl.tallest();
				newLeft = homeColumn*(imgWidth + xMargin) + marginWidth;
				newTop = containers[homeColumn];

				ctrl.update(homeColumn, element[0].scrollHeight + yMargin);
				
				element[0].style.cssText += "; left: " + newLeft + "px; top: " + newTop + "px; opacity: 1;";

				if(++ctrl.imagesLoadCount === ctrl.totalItemCount) {
					//this is the last image loaded
					//correct parent height
					console.log('Correcting parent height')
					element.parent()[0].style.height = ctrl.tallest() + 'px';
				}

			};			

			//Reset container height to 0 on view change(images count = 0)
			if(scope.$index === 0) {
				dimensions = ctrl.dimensions();
				initialise();
				containerHeight = 0;
			}

			if(scope.$last) {
				ctrl.totalItemCount = scope.$index + 1;
				element.parent()[0].style.height = ctrl.tallest() + (ctrl.docHeight()) + 'px'; 
			}

			//Set item position
			imageElem.on('load', repaint);

			imageElem.on('error', function() {
				ctrl.imagesLoadCount++;
			});

		}
	}
}])

.directive('masonryResize', ['$window', '$rootScope', function($window, $rootScope) {

	var resizing = false,
		dimensions;

	var masonryData = $rootScope.masonryData,
		IMG_WIDTH = masonryData.imgWidth,
		IMG_MARGIN_X = masonryData.xMargin,
		IMG_MARGIN_Y = masonryData.yMargin,
		CONTAINER_PADDING_X = masonryData.containerPadding,
		windowWidth = $window.innerWidth,
		containerWidth, columns, dynamicImageWidth, marginWidth, containers, i, n;	

	return {
		restrict: 'A',

		controller: ['$scope', '$element', function($scope, $element) {

			this.imagesLoadCount = 0;
			this.totalItemCount = 0;

			this.shortest = function() {
				return containers.indexOf(containers.slice().sort(function(a, b) {
					return a - b;
				})[0]);
			};

			this.tallest = function() {
				return containers.slice().sort(function(a, b) {
					return b-a;
				})[0];
			};	

			this.dimensions = function() {
				return {
					xMargin: IMG_MARGIN_X,
					yMargin: IMG_MARGIN_Y,
					windowWidth: windowWidth,
					containers: containers,
					imgWidth: IMG_WIDTH,
					marginWidth: marginWidth
				}
			};

			this.update = function(column, height) {
				containers[column] += height;
			};

			this.reset = function() {
				document.body.style.overflow = 'scroll';
				containerWidth = $element[0].clientWidth;
				document.body.style.overflow = 'auto';
				columns = Math.floor((containerWidth + IMG_MARGIN_X)/(IMG_WIDTH + IMG_MARGIN_X));
				marginWidth = Math.abs((containerWidth - IMG_WIDTH*columns - IMG_MARGIN_X*(columns - 1))/2);
				containers = new Array(columns);
			};

			this.init = function() {
				for(i=0, n=containers.length; i < n; i++) {
					containers[i] = 0;
				}
			};

			this.shouldResize = function() {
				return Math.abs(windowWidth - $window.innerWidth) > 25 ? true : false;
			};

			this.setWindowWidth = function() {
				windowWidth = $window.innerWidth;
			};

			this.docHeight = function() {
				return $window.innerHeight * 2.5;
			};	

		}],

		link: function(scope, element, attrs, ctrl) {

			var imageContainers, container, homeColumn, newLeft, newTop;

			var repaint = function() {

				if(ctrl.shouldResize() && !resizing) {
					resizing = true;
					ctrl.setWindowWidth();

					//Reset dimensions
					ctrl.reset();
					ctrl.init();
					dimensions = ctrl.dimensions();

					imageContainers = element[0].children;

					for(i=0, n=imageContainers.length; i<n-1; i++) {
						homeColumn = ctrl.shortest();
						container = imageContainers[i];
						newLeft = homeColumn*(dimensions.imgWidth + dimensions.xMargin) + dimensions.marginWidth;
						newTop = dimensions.containers[homeColumn];

						container.style.cssText += "; opacity: 1; left: " + newLeft + "px; top: " + newTop + "px;";

						ctrl.update(homeColumn, container.scrollHeight + dimensions.yMargin);

					}

					element[0].style.height = ctrl.tallest() + 'px';
					resizing = false;

				}

			};

			scope.$watch(
				function() {
					return element[0].children.length;
				}, 
				function(newCount, oldCount) {
					
					if(newCount === 0) {
						element[0].style.height = 0;
						ctrl.totalItemCount = 0;
						ctrl.imagesLoadCount = 0;
						ctrl.init();
					}

				}
			);

			angular.element($window).on('resize', repaint);

			scope.$on('$destroy', function() {
				resizing = false;
				angular.element($window).off('resize');
			});

			element[0].style.position = 'relative';

			ctrl.reset();
			ctrl.init();

		}
	}
}])