'use strict';

/**
 * @ngdoc service
 * @name cmtodoJsApp.cloudmineService
 * @description
 * # cloudmineService
 * Service in the cmtodoJsApp.
 */
angular.module('cmBlogApp')
    .service('cloudmineService', function cloudmineService($rootScope, $q) {
        var appOpts = {
            appname: "Ryan",
            appversion: "1.0",
            savelogin: false,
            appid: "8a9bb54cdcf94163bafd7df89d3c9981", // master
            apikey: "86dc9a944f374924af91978740916ce2", // prod
            //apikey: "1ece004dd1c84e5cb2ccf96b303921cd" // stage
            applevel: true
        };
        var cmWebService = new cloudmine.WebService(appOpts);
        this.cmWebService = cmWebService;

        var requestQueue = {};
        this.getObjects = function (query, store) {
            var deferred = $q.defer();

            var queryHash = JSON.stringify(query);
            if (requestQueue[queryHash]) {
                // if we already have an outgoing request for this query, return the created promise
                console.log("using existing promise for query", queryHash);
                return requestQueue[queryHash];
            }

            // enqueue request
            requestQueue[queryHash] = deferred.promise;

            this.search(query, {sort: ["type:desc", "__created__"], limit: -1, applevel: true}, function (err, objects) {
                // ensure the session_token isn't empty from a logout... if so then re-instantiate
//                if (!this.cmWebService || !this.cmWebService.session_token)
//                    cmWebService = new cloudmine.WebService(appOpts);
                // dequeue request
                delete requestQueue[queryHash];
                // in case of error send back the local cached store passed in
                if (err) {
                    console.log('err: ' + err);
                    deferred.resolve(store);
                }
                // clear the local cached store and push the fetched objects
                store.length = 0;
                objects.forEach(function (obj) {
                    store.push(obj);
                });

                $rootScope.$apply();
                deferred.resolve(store);
            });

            return deferred.promise;
        };

        this.updateItem = function (_item, store, config) {
            config = config || {};
            /*
            This flag is very important. appLevel dictates whether or not the
            object should be stored at the global level or within the user context
            that is provided. On a site which enables user login, once a user is
            authenticated, all objects will be stored as user specific objects unless
            specified in the app level as a global object. Set this to true then for
            objects you want all users to have access to (ie. configs, announcements,
            etc.).
             */
            config.applevel = true;
            // get rid of $$hashKey placed by angular for items coming from a $scope
            var item = angular.fromJson(angular.toJson(_item));
            console.log("updating item", item);
            // generate a unique id if one doesn't exist. like and upsert
            item.__id__ = item.__id__ || cmWebService.keygen();
            item.__updated__ = true;

            cmWebService.update(item.__id__, item, config).on("success", function (success) {
                var found = false;
                // check if the unique id is already in the store
                angular.forEach(store, function (olditem, i) {
                    if (olditem.__id__ === item.__id__) {
                        store[i] = item;
                        found = true;
                    }
                });

                if (!found) {
                    store.push(item);
                }

                // needs to manually tell angular to refresh since execution outside of digest cycle
                $rootScope.$apply();
            });
        };

        this.addItem = function (item, store) {
            item.__created__ = true;
            this.updateItem(item, store);
        };

        this.deleteItem = function (item, store) {
            console.log("deleting item", item);

            cmWebService.destroy(item.__id__, {applevel: true}).on("success", function (success) {
                angular.forEach(store, function (olditem, i) {
                    if (olditem.__id__ === item.__id__) {
                        store.splice(i, 1);
                    }
                });

                $rootScope.$apply();
            });
        };

        // search helpers
        function searchParamsToString(params) {
            function formatValue(value) {
                switch (typeof value) {
                    // These values are only supposed to be primitives, and the only primitive value
                    // with the type 'object' is null...
                    case 'object':
                        return value;
                    case "number":
                        return "" + value;
                    default:
                        return '"' + value + '"';
                }
            }

            var parts = [];
            Object.keys(params).forEach(function (key) {
                var value = params[key];
                var op = "=";

                // Skip the key altogether
                if (typeof value === 'undefined') return;

                if (typeof value === "object" && value !== null) {
                    Object.keys(value).forEach(function (op) {
                        parts.push(key + ' ' + op + ' ' + formatValue(value[op]));
                    });
                } else {
                    parts.push(key + ' ' + op + ' ' + formatValue(value));
                }
            });

            return "[" + parts.join(", ") + "]";
        }

        // generic search
        this.search = function (params, options, callback) {
            params = angular.extend({}, {
                // a place to include extra params which might be global across all searches ex:
                // isDeleted: false
                // isPublished: true || '' the or clause covers the case where legacy data doesn't have a published bool
            }, params);

            if (typeof options === "function") {
                callback = options;
                options = {};
            }

            options.applevel = true;

            var query = searchParamsToString(params);
            this.cmWebService.search(query, options).on("success", function (data, response) {
                var objects = Object.keys(data).map(function (key) {
                    data[key].__id__ = key;
                    return data[key];
                });

                callback(null, objects, response.count);
            }).on("error", function (err) {
                callback(err);
            }).on("complete", function () {
                $rootScope.$apply();
            });
        };
    });
