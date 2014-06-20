'use strict';

/**
 * @ngdoc function
 * @name cmBLogApp.controller:LoginCtrl
 * @description: This controller handles both the login and logout button. It's kinda janky but basically
 * if here is an active user in the $rootScope then it's assumed that the menu button reads "logout"
 * and the application will logout and redirect the user. Otherwise instantiate the user in the
 * $rootScope and proceed with the login form.
 * # LoginCtrl
 * Controller of the cmBLogApp
 */
angular.module('cmBlogApp')
    .controller('LoginCtrl', function ($scope, $rootScope, $location, cloudmineService, cloudmineAuthService) {
//        if ($rootScope.currentUser)
//            logout();

        $scope.error = false;
        $scope.login = function () {
            console.log($scope.username, $scope.password);
            cloudmineAuthService.login({
                username: $scope.username,
                password: $scope.password
            }, function (err) {
                $scope.error = true;
            });
        };
    });
