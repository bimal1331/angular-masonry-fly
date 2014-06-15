angular.module('masonryApp', ['masonryLayout', 'infinite-scroll'])

.run(['$rootScope', function($rootScope) {

	$rootScope.masonryData = {
		xMargin : 30,
		yMargin : 40,
		imgWidth : 323,
		containerPadding : 23,
        falseDocumentHeight : 3
	};

}])

.controller("LoadImages", ['$scope', '$interval', '$timeout', function($scope, $interval, $timeout) {

    var busy = false,
        stop;
    $scope.images = [];

    $scope.refresh = function() {
        $scope.images.length = 0;

        $timeout(function() { $scope.fetchNext(); }, 1000);
    };

    $scope.fetchNext = function() {

        if(!busy) {
            console.log('Fetching next')
            busy = true;

            for(var i=0; i<30; i++) {
                $scope.images.push({
                    src: i + '.jpg'
                });    
            }

            busy = false;

            // stop = $interval(function() {
            
            //     $scope.images.push({
            //         src: i + '.jpg'
            //     });

            //     if(i++ === 29) {
            //         busy = false;
            //         $interval.cancel(stop);
            //     } 
                   
            // }, 250);
        }

    };   

}])
