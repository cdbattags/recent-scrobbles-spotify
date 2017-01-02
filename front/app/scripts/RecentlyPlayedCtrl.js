angular.module('spotify-lastfm.recentlyPlayed', [])

.controller('MusicCtrl', function(
    $http,
    $scope,
    $window
) {

    $scope.recentlyPlayedURL = "";
    $scope.recentlyPlayed = [];
    $scope.errorSpotifyEmbed = "";
    $scope.errorLastFMGrid = "";

    $scope.user = "cdbattags";

    $scope.$watch('user', function(user) {

        $scope.recentlyPlayed = [];
        $scope.recentlyPlayedUrl = "";

        if (user == "") {
            user = "cdbattags";
        }

        $http({
            url: 'http://ws.audioscrobbler.com/2.0/',
            method: 'GET',
            params: {
                method: 'user.getrecenttracks',
                user: user,
                api_key: 'fd4c041c4b0c034a0cf962b005090cd4',
                format: 'json'
            }
        })
            .then((result) => {
                $scope.recentlyPlayed = result.data.recenttracks.track;
            })
            .catch((error) => {
                $scope.errorLastFMGrid = error;
            });

        // right side
        $http({
            url: '/api/spotify/recents',
            method: 'GET',
            params: {
                user: user
            }
        })
            .then((result) => {
                $scope.recentlyPlayedURL = 'https://embed.spotify.com/?uri=' + result.data.recents;
            })
            .catch((error) => {
                $scope.errorSpotifyEmbed = error;
            });
    });

    $scope.nav = function(url) {
        $window.open(url);
    };

    // right side
    // $http({
    //     url: '/api/spotify/recents',
    //     method: 'GET',
    // })
    //     .then((result) => {
    //         $scope.recentlyPlayedURL += result.data.recents;
    //     })
    //     .catch((error) => {
    //         $scope.errorSpotifyEmbed = error;
    //     });

    // // left side
    // $http({
    // 	url: 'http://ws.audioscrobbler.com/2.0/',
    // 	method: 'GET',
    // 	params: {
    // 		method: 'user.getrecenttracks',
    // 		user: 'cdbattags',
    // 		api_key: 'c3ee893e8b37db4abe320c2f0042063f',
    // 		format: 'json'
    // 	}
    // })
    // 	.then((result) => {
    // 		$scope.recentlyPlayed = result.data.recenttracks.track;
    // 	})
    // 	.catch((error) => {
    // 		$scope.errorLastFMGrid = error;
    // 	})
})

.filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}]);
