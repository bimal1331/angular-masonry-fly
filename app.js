angular.module('masonryApp', ['masonryLayout', 'infinite-scroll'])

.controller("LoadImages", ['$scope', '$interval', '$timeout', function($scope, $interval, $timeout) {

    var busy = false,
        heights = [254, 300, 192, 450, 350, 200, 360, 420, 270, 400, 200],
        cats = ['abstract', 'animals', 'business', 'cats', 'city', 'food', 'nightlife', 'fashion', 'people', 'nature', 'sports', 'transport'],
        stop;

    $scope.images = [];
    $scope.images2 = [];

    $scope.refresh = function() {
        $scope.images.length = 0;
        $scope.images2.length = 0;

        $timeout(function() { $scope.fetchNext(); }, 1000);
    };

    $scope.fetchNext = function() {
        var i=0;

        if(!busy) {
            console.log('Fetching next')
            busy = true;

            for(var i=0; i<30; i++) {
                $scope.images.push({
                    src: '250/' + heights[i % heights.length] + '/' + cats[Math.floor(Math.random() * cats.length )]
                }); 

                $scope.images2.push({
                    src: '150/' + heights[i % heights.length] + '/' + cats[Math.floor(Math.random() * cats.length )]
                });     
            }

            busy = false;

        }

    };   

}])
