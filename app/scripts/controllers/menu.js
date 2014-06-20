'use strict';

/**
 * @ngdoc function
 * @name cmtodoJsApp.controller:MenuCtrl
 * @description : This is the menu controller which is driven off the status of the
 * user being logged in and if that user is admin. This is a good use case of both
 * app level objects and also user specific objects. The access shape on the user
 * dictates whether or not certain functionality is enabled. Specifically there is
 * a shared tasking system in this application... Does it make sense in a blog?
 * probably not but hey!!! an example is here. Tasks are a global access but the
 * ability to see and operate on those tasks is specific to the a user specific shape.
 * Consult the login controller and specifically the authorize method to see how this
 * privelage is used across the app in the $rootScope. You might want to not reference
 * the $rootScope and instead call this authorize method on each load to ensure there
 * is no tampering.
 * # MenuCtrl
 * Controller of the cmtodoJsApp
 */
angular.module('cmBlogApp')
    .controller('MenuCtrl', function ($scope, $rootScope, localStorageService, cloudmineAuthService) {

        $scope.logout = function () {
            cloudmineAuthService.logout();
        };

        $scope.menu = {
            "#": "Home",
            "#/about": "About"
        };

        function bindMenu() {
            $scope.menu = {
                "#": "Home",
                "#/about": "About"
            };

            if ($rootScope.currentUser) {
                if ($rootScope.currentUser.access) {
                    console.log($rootScope.currentUser.access);
                    $scope.menu["#/tasks"] = "Tasks";
                }
            } else {
                $scope.menu["#/login"] = "Login";
            }
        };

        $rootScope.$watch('currentUser', function () {
            console.log('change currentUser');
            bindMenu();
        });

        bindMenu();
    });
