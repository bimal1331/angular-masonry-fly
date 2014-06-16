angular.module('masonryApp', ['masonryLayout', 'infinite-scroll'])

.run(['$rootScope', function($rootScope) {

	$rootScope.masonryData = {
		xMargin : 30,
		yMargin : 40,
		imgWidth : 323,
        falseDocumentHeight : 3
	};

}])

.controller("LoadImages", ['$scope', '$interval', '$timeout', function($scope, $interval, $timeout) {

    var busy = false,
        heights = [254, 300, 192, 450, 350, 200, 360, 420, 270, 400, 200],
        cats = ['abstract', 'animals', 'business', 'cats', 'city', 'food', 'nightlife', 'fashion', 'people', 'nature', 'sports', 'transport'],
        stop;
    $scope.images = [];

    $scope.refresh = function() {
        $scope.images.length = 0;

        $timeout(function() { $scope.fetchNext(); }, 1000);
    };

    $scope.fetchNext = function() {
        var i=0;

        if(!busy) {
            console.log('Fetching next')
            busy = true;

            for(var i=0; i<30; i++) {
                $scope.images.push({
                    src: '323/' + heights[i % heights.length] + '/' + cats[Math.floor(Math.random() * cats.length )]
                });    
            }

            busy = false;

        }

    };   

}])
