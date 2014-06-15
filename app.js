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

.controller("LoadImages", ['$scope', '$interval', function($scope, $interval) {

    var busy = false,
        stop;
    $scope.images = [];

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
