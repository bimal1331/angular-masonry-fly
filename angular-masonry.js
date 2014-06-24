(function() {
	'use strict';

	angular.module('masonryLayout', [])

	.directive('masonry', ['$window', '$rootScope', function($window, $rootScope) {

		function Wall(xMargin, yMargin, imgWidth) {

			this.IMG_MARGIN_X = xMargin;

			this.IMG_MARGIN_Y = yMargin;

			this.IMG_WIDTH = imgWidth;
			
			this.imagesLoadCount = 0;

			this.totalItemCount = 0;

			this.resizing = false;

			this.windowWidth = $window.innerWidth;

			this.containers;

			this.containerWidth;		

			this.marginWidth;
		}

		Wall.prototype = {
			constructor : Wall,		

			docHeight : function() {
				return $window.innerHeight * 2.5;
			},

			reset : function($element) {
				var columns;

				document.body.style.overflow = 'scroll';
				this.containerWidth = $element[0].clientWidth;
				document.body.style.overflow = 'auto';
				columns = Math.floor((this.containerWidth + this.IMG_MARGIN_X)/(this.IMG_WIDTH + this.IMG_MARGIN_X));
				this.marginWidth = Math.abs((this.containerWidth - this.IMG_WIDTH*columns - this.IMG_MARGIN_X*(columns - 1))/2);
				this.containers = new Array(columns);

				for(var i=0, n=this.containers.length; i < n; i++) {
					this.containers[i] = 0;
				}
			},

			setWindowWidth : function() {
				this.windowWidth = $window.innerWidth;
			},

			shortest : function() {
				return this.containers.indexOf(this.containers.slice().sort(function(a, b) {
					return a - b;
				})[0]);
			},

			shouldResize : function() {
				return (Math.abs(this.windowWidth - $window.innerWidth) > 25) && !this.resizing ? true : false;
			},

			tallest : function() {
				return this.containers.slice().sort(function(a, b) {
					return b-a;
				})[0];
			},

			update : function(column, height) {
				this.containers[column] += height;
			}

		};

		return {
			restrict: 'A',

			link: function(scope, element, attrs, ctrl) {

				var wall = new Wall(+attrs.xMargin, +attrs.yMargin, +attrs.imgWidth),
					imageContainers, container, homeColumn, newLeft, newTop;

				var setNewCoordinates = function() {
					homeColumn = wall.shortest();
					newLeft = homeColumn*(wall.IMG_WIDTH + wall.IMG_MARGIN_X) + wall.marginWidth;
					newTop = wall.containers[homeColumn];
				};

				var repaint = function() {
					
					if(wall.shouldResize()) {
						
						wall.resizing = true;
						wall.setWindowWidth();

						//Reset wall attributes
						wall.reset(element);

						imageContainers = element[0].children;

						for(var i = 0, n = imageContainers.length; i < n; i++) {							
							container = imageContainers[i];
							
							setNewCoordinates();

							container.style.cssText += "; left: " + newLeft + "px; top: " + newTop + "px;";
							wall.update(homeColumn, container.scrollHeight + wall.IMG_MARGIN_Y);
						}

						element[0].style.height = wall.tallest() + 'px';
						wall.resizing = false;

					}

				};

				var fixBrick = function(brick) {
					setNewCoordinates();	
					
					brick.style.cssText += "; left: " + newLeft + "px; top: " + newTop + "px;";
					wall.update(homeColumn, brick.scrollHeight + wall.IMG_MARGIN_Y);

					if(++wall.imagesLoadCount === wall.totalItemCount) {
						//this is the last image loaded
						//correct parent height
						element[0].style.height = wall.tallest() + 'px';
					}

				};

				var attachListener = function(brick) {
					//Create closure for image containers i.e bricks
					var imgElem = brick.getElementsByTagName('img')[0];
					brick.style.cssText += "; left: -999px; top: -999px; position:absolute; ";

					imgElem.addEventListener('load', function() {
						fixBrick(brick);
					});

					imgElem.addEventListener('error', function() {
						wall.imagesLoadCount++;
					});
				};

				scope.$watch(
					function() {
						return element[0].children.length;
					}, 
					function(newCount, oldCount) {

						if(newCount === oldCount) return;
						
						if(oldCount === 0) {
							element[0].style.height = 0;
							wall.totalItemCount = 0;
							wall.imagesLoadCount = 0;

							//Reset wall attributes
							wall.reset(element);
						}

						wall.totalItemCount = newCount;
						element[0].style.height = wall.tallest() + (wall.docHeight()) + 'px'; 

						for(var i = oldCount; i < newCount; i++) {
							attachListener(element[0].children[i]);						
						}

					}
				);

				angular.element($window).on('resize', repaint);

				scope.$on('$destroy', function() {
					angular.element($window).off('resize', repaint);
				});

				element[0].style.position = 'relative';

			}
		}
	}])

}());