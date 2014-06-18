angular-masonry-fly
-------------------
####Generates masonry layout image by image without knowing their height or waiting for all images to load.

+ Works with infinite scroll and window resizing.
+ No need to know images height or wait for all images to download.

#####DEMO
http://bimal1331.github.io/angular-masonry-fly

#####REQUIREMENTS
+ Angularjs 1.2+ only

#####INSTALLATION
+ Download angular-masonry.min.js and include it with your JS files.
+ Include module 'masonryLayout' in your main app module.

or

use [Bower](http://bower.io/) to install `bower install angular-masonry-fly`

#####USAGE
+ In your app's 'RUN block', connfigure masonry module like below -

	```js
	$rootScope.masonryData = {
		xMargin : 30,
		yMargin : 40,
		imgWidth : 323
	};
	```

	+ xMargin - Horizontal gap between image containers
	+ yMargin - Vertical gap between image containers
	+ imgWidth - Image width you'll be using for the layout, ideally should be image's natural width

+ Use directives 'data-masonry-layout' & 'data-masonry-resize' like below -

	```html
	<div data-masonry-resize style="margin:30px 20px 0; padding: 0 10px 0">
		<div data-ng-repeat="image in images" data-masonry-layout style="border:1px solid black;">
				<img ng-src="http://lorempixel.com/{{image.src}}">
		</div>
	</div>
	```

That's it!
