'use strict';

/**
 * @ngdoc function
 * @name cmtodoJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cmtodoJsApp
 */
angular.module('cmBlogApp')
    .controller('MainCtrl', function ($scope, localStorageService, cloudmineService) {
        // cached shapes in the main controller
        var postsInStore = localStorageService.get('posts') || [];
        $scope.posts = postsInStore && postsInStore;
        // fetch the current list of posts and store them in the scope of posts
        cloudmineService.getObjects({__class__: 'Post'}, $scope.posts);
        // watch the posts scope so when the fetch returns the posts are cached in the local store
        // maybe in the service there is a polling service for this store
        // which when updated can add or update shapes in the scope. This will automagically add
        // them to the local store as well for offline reading.
        $scope.$watch('posts', function (value) {
            localStorageService.add('posts', value);
        }, true);

        var infoInStore = localStorageService.get('appInfo') || [];
        $scope.appInfo = infoInStore && infoInStore;
        cloudmineService.getObjects({__class__: 'AppInfo'}, $scope.appInfo);
        $scope.$watch('appInfo', function (value) {
            localStorageService.add('appInfo', value);
        }, true);
    });
