'use strict';

/**
 * @ngdoc function
 * @name cmtodoJsApp.controller:TasksCtrl
 * @description
 * # TasksCtrl
 * Controller of the cmtodoJsApp
 */
angular.module('cmBlogApp')
    .controller('TasksCtrl', function ($scope, localStorageService, cloudmineService) {
        // use cloudmine service and inject localStore into that and do the logic between the two
        var todosInStore = localStorageService.get('todos') || [];
        $scope.todos = todosInStore && todosInStore;
        cloudmineService.getObjects({__class__: 'Todo'}, $scope.todos);
        $scope.$watch('todos', function (value) {
            localStorageService.add('todos', value);
        }, true);

        // for adding the task shape to the cached list on an ng-submit
        $scope.addTodo = function () {
            // check for all properties being assigned
            var newTodo = {
                description: $scope.todoText,
                __class__: 'Todo'
            };
            cloudmineService.addItem(newTodo, $scope.todos);
            $scope.todoText = '';
        };
        // for removing the task shape on a removal ng-click
        $scope.removeTodo = function (index) {
            var deleteTodo = $scope.todos[index];
            cloudmineService.deleteItem(deleteTodo, $scope.todos);
        };
    });
