angular-masonry-fly
-------------------
####Generates masonry layout image by image without knowing their height or waiting for all images to load.

+ Works with infinite scroll and window resizing.
+ No need to know images height or wait for all images to download.
+ Can be used on same page on different containers(***new***)

#####DEMO
http://bimal1331.github.io/angular-masonry-fly

#####REQUIREMENTS
+ Angularjs 1.2+ only

#####INSTALLATION
+ Download angular-masonry.min.js and include it with your JS files.
+ Include module ***masonryLayout*** in your main app module.

or

use [Bower](http://bower.io/) to install `bower install angular-masonry-fly`

#####USAGE

+ Use directive ***data-masonry*** like below -

	```html
	<div data-masonry data-x-margin="20" data-y-margin="30" data-img-width="250" style="margin:3% 2% 0 2%; padding: 			20px 1% 0; border:1px solid black; width:43%; float:left;">
		<div data-ng-repeat="image in images" style="border:1px solid black; border-radius:5px; padding:1px;">
			<img ng-src="http://lorempixel.com/{{image.src}}">		
		</div>
	</div>
	```
	+ data-x-margin - Horizontal gap between image containers
	+ data-y-Margin - Vertical gap between image containers
	+ data-img-width - Image width you'll be using for the layout, ideally should be image's natural width

That's it!
