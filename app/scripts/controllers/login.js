'use strict';

/**
 * @ngdoc function
 * @name cmBLogApp.controller:LoginCtrl
 * @description: This controller handles both the login, reset and logout buttons. It's kinda janky but basically
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
      console.log("login user called");
      cloudmineAuthService.login({
        username: $scope.username,
        password: $scope.password
      }, function (err) {
        if (err)
          $scope.error = true;
      });
    };


    /**
     * Reset implements a new custom feature of CloudMine. In the past the reset is sent by CloudMine
     * and handled with a URL hosted by CloudMine. This exposes that the site under the hood is not
     * being run by the site implemention and rather a 3rd party company (CloudMine). A custom password
     * reset form can be specified by using the "Password Reset Email Settings" on the application
     * overview page. In this case the reset URL adheres to:
     * https://ryan.cloudmineapp.com/password_reset.html?reset_token={{token}}&appid={{app_id}}
     */
    $scope.resetPassword = function () {
      console.log("reset password called " + $scope.email);
      // set the error to false in case the request is a success
      $scope.error = false;
      cloudmineAuthService.resetPassword($scope.email, function (err) {
        if (err)
          $scope.error = true;
      });
    };

    /**
     * Once the login URL is hit with a reset_token query parameter the user can enter the new
     * password into the reset fields. The request sends the new password and the token from the
     * query string
     *
     * TODO: add checking to ensure that two password fields are equivalent and show and error if not
     */
    $scope.confirmReset = function () {
      if ($location.search().reset_token) {
        $scope.error = false;
        cloudmineAuthService.confirmRest($location.search().reset_token, $scope.newPassword, function (err) {
          if (err) {
            $scope.error = true;
          } else {
            scope.$apply(function () {
              $location.path("/login");
            });
          }
        });
      } else {
        $scope.error = true;
      }
    };

  });
