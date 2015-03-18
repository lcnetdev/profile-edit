/**
 * @ngdoc controller
 * @name ValueDataTypeController
 * @description
 * Handles the scope variable for value data types
 */
angular.module('locApp.modules.profile.controllers')
    .controller('ValueDataTypeController', function($scope) {
        $scope.valueDataType = {};

        if($scope.importy){
            // override fields
            $scope.valueDataType = $scope.valueConstraint.valueDataType;
        }
        else {
            $scope.valueConstraint.valueDataType = $scope.valueDataType;
        }
    });