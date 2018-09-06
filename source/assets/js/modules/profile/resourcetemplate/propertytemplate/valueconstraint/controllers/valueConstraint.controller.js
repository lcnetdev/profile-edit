/**
 * @ngdoc controller
 * @name ValueConstraintController
 * @description
 * Handles the scope variable for value constraints
 */
angular.module('locApp.modules.profile.controllers')
    .controller('ValueConstraintController', function($scope, localStorageService) {
        $scope.selectList = localStorageService.get('templateRefs');
        $scope.constraintFields = [];
        $scope.templateFields = [];
        $scope.valueFields = [];

        $scope.valueConstraint = {};

        // Method to check for import
        if($scope.importy){
            // override fields
            $scope.valueConstraint = $scope.propertyTemplate.valueConstraint;

            // checked to see if a value constraint is defined
            if($scope.valueConstraint) {
                $scope.importCascade($scope.templateFields, $scope.valueConstraint.valueTemplateRefs);
                $scope.importCascade($scope.valueFields, $scope.valueConstraint.useValuesFrom);

                if($scope.valueConstraint.useValuesFrom == null) {
                    $scope.valueConstraint.useValuesFrom = [];
                }
                if($scope.valueConstraint.valueTemplateRefs == null) {
                    $scope.valueConstraint.valueTemplateRefs = [];
                }
            }
            else {
                // create an empty one if none exists
                $scope.valueConstraint = {};
                $scope.valueConstraint.valueTemplateRefs = [];
                $scope.valueConstraint.useValuesFrom = [];
                $scope.propertyTemplate.valueConstraint = $scope.valueConstraint;
            }

            $scope.constraintFields.push("");
            $scope.loadCount++;
        }
        else {
            $scope.valueConstraint.valueTemplateRefs = [];
            $scope.valueConstraint.useValuesFrom = [];

            $scope.propertyTemplate.valueConstraint = $scope.valueConstraint;

            $scope.constraintFields.push("");
            $scope.loadCount++;
        }

        // Method to get the template references
        if(!$scope.selectList) {
            var rts = [];
            var proftext = sessionStorage.getItem('/verso/api/configs?filter[where][configType]=profile');
            var profjson = JSON.parse(proftext);
            profjson.forEach(function(prof) {
                prof.json.Profile.resourceTemplates.forEach(function(rt) {
                    rts.push(rt.id);
                });
            });
            $scope.selectList = rts;
            localStorageService.set('templateRefs', $scope.selectList);
        }

        /**
         * @ngdoc function
         * @name addTemplate
         * @description
         * Adds a template reference to the value constraint
         */
        $scope.addTemplate = function() {
            $scope.importy = false;
            $scope.valueConstraint.valueTemplateRefs.push("");
            $scope.templateFields.push($scope.valueConstraint.valueTemplateRefs.length - 1);
        };

        /**
         * @ngdoc function
         * @name deleteTemplate
         * @description
         * Deletes a template reference from the list.
         */
        $scope.deleteTemplate = function() {
            $scope.deleteItem($scope.parentId, $scope.templateFields);
            $scope.deleteItem($scope.parentId, $scope.valueConstraint.valueTemplateRefs);
        };

        /**
         * @ngdoc function
         * @name addValue
         * @description
         * Adds a value data type to the value constraint
         */
        $scope.addValue = function() {
            $scope.importy = false;
            $scope.valueConstraint.useValuesFrom.push("");
            $scope.valueFields.push($scope.valueConstraint.useValuesFrom.length - 1);
        };

        /**
         * @ngdoc function
         * @name deleteValue
         * @description
         * Deletes a value reference from the list
         */
        $scope.deleteValue = function() {
            $scope.deleteItem($scope.parentId, $scope.valueFields);
            $scope.deleteItem($scope.parentId, $scope.valueConstraint.useValuesFrom);
        };
    });
