'use strict';

/**
 * @ngdoc overview
 * @name cmtodoJsApp
 * @description
 * # cmtodoJsApp
 *
 * Main module of the application.
 */
angular
    .module('cmBlogApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ui.sortable',
        'LocalStorageModule'
    ])
    .config(['localStorageServiceProvider', function (localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('cmLocalStorage');
    }])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/blog', {
                templateUrl: 'views/blog.html',
                controller: 'BlogCtrl'
            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl'
            })
            .when('/tasks', {
                templateUrl: 'views/tasks.html',
                controller: 'TasksCtrl'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .when('/logout', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .run(['$rootScope', '$location', 'cloudmineService', 'cloudmineAuthService', function ($rootScope, $location, cloudmineService, cloudmineAuthService) {
        cloudmineAuthService.init(cloudmineService.cmWebService, { // opts
        }, { // callbacks
            loggedin: function (err, currentUser) {
                if (err) {
                    return console.log("Login failed:", err);
                }
                console.log("User logged in:", currentUser);
            },
            authorized: function (err, currentUser, access) {
                if (err) {
                    return console.log("Authorization failed:", err);
                }
                console.log("Authorized:", currentUser, access);
            }
        });
    }]);


