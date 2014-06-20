'use strict';

/**
 * @ngdoc function
 * @name cmtodoJsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the cmtodoJsApp
 */
angular.module('cmBlogApp')
    .controller('AboutCtrl', function ($scope, localStorageService, cloudmineService) {
        var blurbsInStore = localStorageService.get('blurbs') || [];
        $scope.blurbs = blurbsInStore && blurbsInStore;

        cloudmineService.getObjects({__class__: 'About'}, $scope.blurbs);
    });
