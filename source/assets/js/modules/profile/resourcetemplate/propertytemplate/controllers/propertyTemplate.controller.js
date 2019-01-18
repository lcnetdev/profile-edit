/**
 * @ngdoc controller
 * @name propertyTemplateController
 * @description
 * Handles the scope variable for property templates
*/
angular.module('locApp.modules.profile.controllers')
    .controller('propertyTemplateController', function($scope, $state, $stateParams, Scrub, $http) {
        $scope.propertyFields = [];
        $scope.propertyTemplate = {
            mandatory:  'false',
            repeatable: 'true',
            type:       'literal'
        };
        $scope.item = Scrub.getIndex();
        
        $scope.resources = [];
        $scope.propResourceBase = [];
        $scope.addIndexProperty = 0;

        $scope.resNest = $scope.getResNest();
        
        // Logic for creating/retreveing object
        // 
        // if we are importing then we done need to do worry about
        // the floating point numbers.
        if($scope.importy){
            // override fields
            $scope.propertyTemplate.resourceTemplates = [];
            
            // Loop through the data and add the values in it.
            $scope.propertyTemplate = $scope.resourceTemplate.propertyTemplates[$scope.parentId];
            if($scope.propertyTemplate) {
                if($scope.propertyTemplate.mandatory === undefined) {
                    $scope.propertyTemplate.mandatory = 'false';
                }
                if($scope.propertyTemplate.repeatable === undefined) {
                    $scope.propertyTemplate.repeatable = 'true';
                }
                if($scope.propertyTemplate.type === undefined) {
                    $scope.propertyTemplate.type = 'literal';
                }
            }
            
            $scope.importCascade($scope.resources, $scope.propertyTemplate.resourceTemplates);
            $scope.addIndexProperty = $scope.propertyTemplate.resourceTemplates ? $scope.propertyTemplate.resourceTemplates.length : 0;
            $scope.propertyFields.push(-1);

            if(!$scope.propertyTemplate.resourceTemplates) {
                $scope.propertyTemplate.resourceTemplates = [];
            }

            //only add to the base templates once
            if(($scope.item / 0.5) % 2 === 1) {
                $scope.propertyTemplatesBase.push($scope.propertyTemplate);
            }

            // item item a floating number, floor it to get the nearest whole number.
            $scope.item = Math.floor($scope.item);
        }
        // if this is the second instance of this item appearing then reference it from the resource's array.
        else if(($scope.item / 0.5) % 2 === 1) {
            $scope.item = Math.floor($scope.item);
            $scope.propertyTemplate = $scope.resourceTemplate.propertyTemplates[$scope.resourceTemplate.propertyTemplates.length -1];
            $scope.propertyFields.push(-1);
        }
        // default case: first instance of the cotnroller.
        else {
            $scope.item = Math.floor($scope.item);
            // add default Values
            /*$scope.propertyTemplate.mandatory = 'false';
            $scope.propertyTemplate.repeatable = 'true';
            $scope.propertyTemplate.type = 'literal';*/

            $scope.propertyTemplate.resourceTemplates = [];

            $scope.resourceTemplate.propertyTemplates.push($scope.propertyTemplate);
            $scope.propertyTemplatesBase.push($scope.propertyTemplate);
        }
        
        /**
         * @ngdoc function
         * @name addConstraint
         * @description
         * Adds a new value constraint to the property template
         */
        $scope.addConstraint = function() {
            $scope.importy = false;
            $scope.propertyFields.push({name:"New Property"});
        };

        $scope.addPropertyResource = function() {
            $scope.importy = false;
            $scope.resources.push($scope.addIndexProperty);
            $scope.addIndexProperty++;
        };

        /**
         * @ngdoc function
         * @name delete
         * @description
         * Deletes this property template
         */
        $scope.deleteProperty = function() {
            $scope.deleteItem($scope.parentId, $scope.resourceFields);
            $scope.deleteItem($scope.propertyTemplate, $scope.resourceTemplate.propertyTemplates);
        };
        
        
        $scope.propResourceSortOption = {
            stop: function() {
                $scope.propertyTemplate.resourceTemplates = $scope.rearrangeData($scope.resources, $scope.propResourceBase);
            },
            distance: '10'
        };

        /**
         * @ngdoc function
         * @name checkPropertyURI
         * @description
         * Check if the property URI resolves
         */
        $scope.checkPropertyURI = function() {
            $scope.propertyForm.propertyURI.$warn = false;
            var url = $scope.propertyTemplate.propertyURI;
            $http({
                method: 'HEAD',
                url: url
            })
            .then(function (response) {
            }, function (response) {
                console.log($scope.propertyTemplate.propertyURI + ' did not resolve!')
                $scope.propertyForm.propertyURI.$warn = true;
            });
        };
        
    });

