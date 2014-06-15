angular.module('masonryLayout', [])

.factory('masonryService', ['$window', '$rootScope', function($window, $rootScope) {
	
	var masonryData = $rootScope.masonryData,
		IMG_WIDTH = masonryData.imgWidth,
		IMG_MARGIN_X = masonryData.xMargin,
		IMG_MARGIN_Y = masonryData.yMargin,
		CONTAINER_PADDING_X = masonryData.containerPadding,
		windowWidth = $window.innerWidth,
		containerWidth, columns, dynamicImageWidth, maginWidth, containers, i, n;

	calculateDimensions();
	initColumnHeight();

	function getDocumentHeight() {
		return $window.innerHeight * $rootScope.masonryData.falseDocumentHeight;
	}

	function calculateDimensions() {

		document.body.style.overflow = 'scroll';
		containerWidth = document.body.getBoundingClientRect().width - 2*CONTAINER_PADDING_X;
		document.body.style.overflow = 'auto';
		columns = Math.floor((containerWidth + IMG_MARGIN_X)/(IMG_WIDTH + IMG_MARGIN_X));
		marginWidth = Math.abs((windowWidth - 2*CONTAINER_PADDING_X - IMG_WIDTH*columns - IMG_MARGIN_X*(columns - 1))/2);
		containers = new Array(columns);

	}

	function initColumnHeight() {
		for(i=0, n=containers.length; i < n; i++) {
			containers[i] = 0;
		}
	}

	function getShortestColumn() {
		return containers.indexOf(containers.slice().sort(function(a, b) {
			return a - b;
		})[0]);
	}

	function getLargestColumnHeight() {
		return containers.slice().sort(function(a, b) {
			return b-a;
		})[0];
	}

	function getDimensions() {
		return {
			xMargin: IMG_MARGIN_X,
			yMargin: IMG_MARGIN_Y,
			windowWidth: windowWidth,
			containers: containers,
			imgWidth: IMG_WIDTH,
			marginWidth: marginWidth
		}
	}

	function updateColumnHeight(column, height) {
		containers[column] += height;
	}

	function shouldResize() {
		return Math.abs(windowWidth - $window.innerWidth) > 25 ? true : false;
	}

	function setWindowWidth() {
		windowWidth = $window.innerWidth;
	}

	//Expose API
	return {
		shortest: getShortestColumn,
		tallest: getLargestColumnHeight,
		dimensions: getDimensions,
		update: updateColumnHeight,
		reset: calculateDimensions,
		init: initColumnHeight,
		shouldResize: shouldResize,
		setWindowWidth: setWindowWidth,
		docHeight: getDocumentHeight
	}


}])

.directive('masonryLayout', ['$window', 'masonryService', function($window, masonryService) {

	var dimensions = masonryService.dimensions(),
		yMargin = dimensions.yMargin,
		xMargin = dimensions.xMargin,
		marginWidth = dimensions.marginWidth,
		imgWidth = dimensions.imgWidth,
		containers = dimensions.containers,
		midContainer, parentContainer, containerHeight,	pageHeight;

	return {
		restrict: 'A',

		require: '^masonryResize',

		link: function(scope, element, attrs, ctrl) {

			var imageElem = element.find('img'),
				tallestColumn, homeColumn, newLeft, newTop, newWidth;

			var repaint = function() {
			
				homeColumn = masonryService.shortest();				
				tallestColumn = masonryService.tallest();
				newLeft = homeColumn*(imgWidth + xMargin) + marginWidth;
				newTop = containers[homeColumn];

				masonryService.update(homeColumn, element[0].scrollHeight + yMargin);
				
				element[0].style.cssText += "; left: " + newLeft + "px; top: " + newTop + "px;";

				if(++ctrl.imagesLoadCount === ctrl.totalItemCount) {
					//this is the last image loaded
					//correct parent height
					console.log('Correcting parent height')
					element.parent()[0].style.height = masonryService.tallest() + 'px';
				}

			};			

			//Reset container height to 0 on view change(images count = 0)
			if(scope.$index === 0) {
				containerHeight = 0;
			}

			if(scope.$last) {
				ctrl.totalItemCount = scope.$index + 1;
				element.parent()[0].style.height = masonryService.tallest() + (masonryService.docHeight()) + 'px'; 
			}

			//Set item position
			imageElem.on('load', repaint);

			imageElem.on('error', function() {
				ctrl.imagesLoadCount++;
			});

		}
	}
}])

.directive('masonryResize', ['$window', 'masonryService', function($window, masonryService) {

	var resizing = false,
		dimensions;		

	return {
		restrict: 'A',

		controller: ['$scope', function($scope) {

			this.imagesLoadCount = 0;
			this.totalItemCount = 0;

		}],

		link: function(scope, element, attrs, ctrl) {

			var imageContainers, container, homeColumn, newLeft, newTop;

			var repaint = function() {

				if(masonryService.shouldResize() && !resizing) {
					resizing = true;
					masonryService.setWindowWidth();

					//Reset dimensions
					masonryService.reset();
					masonryService.init();
					dimensions = masonryService.dimensions();

					imageContainers = element[0].children;

					for(i=0, n=imageContainers.length; i<n-1; i++) {
						homeColumn = masonryService.shortest();
						container = imageContainers[i];
						newLeft = homeColumn*(dimensions.imgWidth + dimensions.xMargin) + dimensions.marginWidth;
						newTop = dimensions.containers[homeColumn];

						container.style.cssText += "; opacity: 1; left: " + newLeft + 
													"px; top: " + newTop + "px;";

						masonryService.update(homeColumn, container.scrollHeight + dimensions.yMargin);

					}

					element[0].style.height = masonryService.tallest() + 'px';
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
						masonryService.init();
					}

				}
			);

			angular.element($window).on('resize', repaint);

			scope.$on('$destroy', function() {
				resizing = false;
				angular.element($window).off('resize');
			});

		}
	}
}])