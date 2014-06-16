angular-masonry-fly
===================
No need to know images height or wait for all images to download, this genrates layout image by image
===============
1) Generates masonry(pinterest type) layout. Works with infinite scroll too. Works on window resizing too. See the demo.
2) No need to know images height or wait for all images to download.

DEMO :-
http://bimal1331.github.io/angular-masonry-fly

REQUIREMENTS :-
1) Angularjs only

INSTALLATION :-
1) Download angular-masonry.min.js and include it with your JS files.
2) Include module 'masonryLayout' in your main app module.

USAGE :-
1) In your app's 'RUN block', connfigure masonry module like below -
	$rootScope.masonryData = {
		xMargin : 30,
		yMargin : 40,
		imgWidth : 323
	};

	where xMargin - Horizontal gap between image containers
		  yMargin - Vertical gap between image containers
		  imgWidth - Image width you'll be using for the layout, ideally should be image's natural width

2) Use directives 'data-masonry-layout' & 'data-masonry-resize' like below -

	<div data-masonry-resize style="margin:30px 20px 0; padding: 0 10px 0">
		<div data-ng-repeat="image in images" data-masonry-layout style="border:1px solid black;">

			<!-- <a href="" style="position:absolute; left:0; right:0; top:0; bottom:0;"> -->
				<img ng-src="http://lorempixel.com/{{image.src}}">
			<!-- </a> -->
			
		</div>
	</div>

That's it!

