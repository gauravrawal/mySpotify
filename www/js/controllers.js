angular.module('myspotify.controllers', [])
 
// To prevent errors
.controller('PlaylistCtrl', function($scope, $stateParams, Spotify) {
  var listid = $stateParams.listid;
  var userid = $stateParams.userid;
  $scope.listname = $stateParams.listname;
 
  $scope.audio = new Audio();
 
  $scope.tracks = [];
 
  Spotify.getPlaylist(userid, listid).then(function (data) {
    $scope.tracks = data.tracks.items;
  });
 
  $scope.playTrack = function(trackInfo) {
    $scope.audio.src = trackInfo.track.preview_url;
    $scope.audio.play();
  };
 
  $scope.openSpotify = function(link) {
    window.open(link, '_blank', 'location=yes');
  };
 
  $scope.stop = function() {
    if ($scope.audio.src) {
      $scope.audio.pause();
    }
  };
 
  $scope.play = function() {
    if ($scope.audio.src) {
      $scope.audio.play();
    }
  };
})
 
.controller('ListsCtrl', function($scope, $ionicPlatform, $cordovaOauth, Spotify) {
  var clientId = 'ac9b4b3f44f14d67ae2101853402fa7f';
  $scope.playlists = [];
 
    $scope.performLogin = function() {
      $cordovaOauth.spotify(clientId, ['user-read-private', 'playlist-read-private']).then(function(result) {
        window.localStorage.setItem('spotify-token', result.access_token);
        Spotify.setAuthToken(result.access_token);
        $scope.updateInfo();
      }, function(error) {
          console.log("Error -> " + error);
      });
    };
 
    $scope.updateInfo = function() {
      Spotify.getCurrentUser().then(function (data) {
        $scope.getUserPlaylists(data.id);
      }, function(error) {
        $scope.performLogin();
      });
    };
 
    $ionicPlatform.ready(function() {
      var storedToken = window.localStorage.getItem('spotify-token');
      if (storedToken !== null) {
        Spotify.setAuthToken(storedToken);
        $scope.updateInfo();
      } else {
        $scope.performLogin();
      }
    });
 
    $scope.getUserPlaylists = function(userid) {
      Spotify.getUserPlaylists(userid).then(function (data) {
        $scope.playlists = data.items;
      });
    };
})