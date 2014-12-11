'use strict';

/**
 * @ngdoc service
 * @name cmtodoJsApp.cloudmineAuthService
 * @description
 * # cloudmineAuthService
 * Factory in the cmtodoJsApp.
 */
angular.module('cmBlogApp')
  .factory('cloudmineAuthService', function ($rootScope, $location) {
    var self = this;
    var opts = {
      loginPath: "/login",
      authorize: true,
      authorizePath: "/authorize",
      rootPath: "/",
      accessClass: "Access"
    };

    var callbacks = {
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
    };

    // keep track of original path so that we can come back to it afer login/auth
    var original_path = $location.path();

    /*
     Here is a primative permissioning validation method. At this time the only users allowed
     to log into the site is one with an accessClass of "Admin". This is a member added to the
     user shape in the user browser. This method could be called on specific views to prevent
     admin views from showing up. You would probably want to call this method on each load to
     ensure no one has used dev tools to fudge what is allowed.
     */
    function authorize(redirectTo) {
      console.log("calling authorize(" + redirectTo + ")");

      self.cm.search({__class__: opts.accessClass}, {applevel: false}).on("success", function (data) {
        var access = data[Object.keys(data)[0]];
        if (access) {
          $rootScope.currentUser = $rootScope.currentUser || {};
          $rootScope.currentUser.access = access;

          // fire callback for on authorization success
          if (typeof callbacks.authorized == 'function') {
            callbacks.authorized(null, $rootScope.currentUser, access);
          }

          // make sure we don't go in a loop!
          if (redirectTo == opts.loginPath)
            redirectTo = opts.rootPath;

          $location.path(redirectTo);
          $rootScope.$apply();
        } else {
          console.log("failed to auth, logging in again");
          $location.path(opts.loginPath);
        }
      }).on('unauthorized', function (err) {
        if (typeof callbacks.authorized == 'function') {
          callbacks.authorized(err);
        }

        $location.path(opts.loginPath);
      }).on('complete', function () {
        $rootScope.$apply();
      });
    }

    return {
      init: function (cloudmine, _opts, _callbacks) {
        self.cm = cloudmine;
        console.log(self.cm.options);

        _opts = _opts || {};
        angular.extend(opts, _opts);

        _callbacks = _callbacks || {};
        angular.extend(callbacks, _callbacks);

        opts.inited = true;

        // register listener to watch route changes
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
          // alternatively: if ( next.$$route.login === true ) { // must be configured in the route
          if ($location.path() == opts.loginPath
            || $location.path() == "/"
            || $location.path() == "/about") {
            // allow normal login flow
            return "";
          }

          if (!self.cm.options.session_token) {
            console.log("no session token");

            // user not logged in at all, force login
            return $location.path(opts.loginPath);
          }

          if ($location.path() == opts.authorizePath) {
            // we're authorizing
            return authorize(original_path);
          }

          // now we're logged in (authenticated), but not authorized
          if (opts.authorize === true && ($rootScope.currentUser == null || !$rootScope.currentUser.access)) {
            return $location.path(opts.authorizePath);
          }

          console.log("route change finished");
        });
      },

      login: function (credentials, callback) {
        if (!opts.inited)
          throw "Must initialize CloudmineAuthService first!";

        self.cm.login(credentials).on("success", function () {
          $rootScope.currentUser = $rootScope.currentUser || {};
          delete credentials.password;
          $rootScope.currentUser.credentials = credentials;

          if (typeof callbacks.loggedin == 'function') {
            callbacks.loggedin(null, $rootScope.currentUser);
          }

          if (opts.authorize === true)
            authorize(original_path);
          else {
            callback(null);
          }
        }).on("unauthorized", function (err) {
          if (typeof callbacks.loggedin == 'function') {
            callbacks.loggedin(err);
          }
          callback(err);
        });
      },

      logout: function () {
        if (!opts.inited)
          throw "Must initialize CloudmineAuthService first!";

        self.cm.logout().on("complete", function () {
          if (opts.authorize === true)
            authorize(original_path);
          $rootScope.currentUser = null;
        });
      },

      resetPassword: function (email, callback) {
        if (!opts.inited)
          throw "Must initialize CloudmineAuthService first!";

        self.cm.resetPassword(email).on("success", function () {
          self.cm.logout().on("complete", function () {
            if (opts.authorize === true)
              authorize(original_path);
            $rootScope.currentUser = null;
            callback(null);
          });
        }).on("badrequest", function (err) {
          self.cm.logout();
          callback(err);
        }).on("notfound", function (err) {
          self.cm.logout();
          callback(err);
        });
      },

      /**
       * @param token - passed through and initially read from query string or as
       * a component of the URL specified in the custom password reset URL field
       * in the application dashboard.
       * @param newPassword - the new password to be mapped with the user associated
       * with the token.
       * @param callback - null on success or the error message forwarded from the
       * api call in the cloudine service
       */
      confirmReset: function (token, newPassword, callback) {
        if (!opts.inited)
          throw "Must initialize CloudmineAuthService first!";

        self.cm.confirmReset(token, newPassword).on("success", function () {
          callback(null);
        }).on("badrequest", function (err) {
          self.cm.logout();
          callback(err);
        }).on("notfound", function (err) {
          self.cm.logout();
          callback(err);
        });
      }

    };
  });
