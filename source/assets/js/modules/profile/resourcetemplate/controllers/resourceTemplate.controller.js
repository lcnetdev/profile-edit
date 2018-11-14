/**
 * @ngdoc controller
 * @name resourceTemplateController
 * @description
 * handles the scope variable for resource templates
 */
angular.module('locApp.modules.profile.controllers')
    .controller('resourceTemplateController', function($scope, Scrub, localStorageService, $http) {
        $scope.resourceFields = [];
        $scope.resourceTemplate = {};
        $scope.addIndexResource = 0;
        $scope.propertyTemplatesBase = [];

        $scope.item = Scrub.getIndex();
        $scope.collapsing = "";
        
        $scope.propNest = $scope.getPropNest();

        // Logic for creating the object
        var createFromProfile = function () {
            // if we are importing then we done need to do worry about
            // the floating point numbers.
            if($scope.importy){
                // item item a floating number, floor it to get the nearest whole number.
                $scope.item = Math.floor($scope.item);
                // override fields
                $scope.resourceTemplate = $scope.profile.resourceTemplates[$scope.parentId];
                $scope.importCascade($scope.resourceFields, $scope.resourceTemplate.propertyTemplates);
                if ($.inArray($scope.resourceTemplate, $scope.resourceTemplatesBase)==-1)
                    $scope.resourceTemplatesBase.push($scope.resourceTemplate);
                $scope.addIndexResource = $scope.resourceTemplate.propertyTemplates.length;
            }
            // if this is the second instance of this item appearing then reference it from the profiles array.
            else if(($scope.item / 0.5) % 2 === 1) {
                $scope.item = Math.floor($scope.item);
                $scope.resourceTemplate = $scope.profile.resourceTemplates[$scope.profile.resourceTemplates.length -1];
            }
            // default case: first instance of the cotnroller.
            else {
                $scope.item = Math.floor($scope.item);
                $scope.resourceTemplate.propertyTemplates = [];
                $scope.profile.resourceTemplates.push($scope.resourceTemplate);
                $scope.resourceTemplatesBase.push($scope.resourceTemplate);
            }
            
            $scope.collapsing = "resourceTemplates";
            $scope.resNest = 0;
            $scope.parentList = $scope.fields;
        };
        
        var createFromProperties = function () {
            // if we are importing then we done need to do worry about
            // the floating point numbers.
            if($scope.importy){
                // item item a floating number, floor it to get the nearest whole number.
                $scope.item = Math.floor($scope.item);
                // override fields
                $scope.resourceTemplate = $scope.propertyTemplate.resourceTemplates[$scope.parentId];
                $scope.importCascade($scope.resourceFields, $scope.resourceTemplate.propertyTemplates);
                $scope.propResourceBase.push($scope.resourceTemplate);
                $scope.addIndexResource = $scope.resourceTemplate.propertyTemplates.length;
            }
            // if this is the second instance of this item appearing then reference it from the profiles array.
            else if(($scope.item / 0.5) % 2 === 1) {
                $scope.item = Math.floor($scope.item);
                $scope.resourceTemplate = $scope.propertyTemplate.resourceTemplates[$scope.propertyTemplate.resourceTemplates.length -1];
            }
            // default case: first instance of the cotnroller.
            else {
                $scope.item = Math.floor($scope.item);
                $scope.resourceTemplate.propertyTemplates = [];
                $scope.propertyTemplate.resourceTemplates.push($scope.resourceTemplate);
                $scope.propResourceBase.push($scope.resourceTemplate);
            }
            $scope.collapsing = "resources";
            $scope.parentList = $scope.resources;
        };

        if($scope.propertyTemplate) {
            createFromProperties();
        }else {
            createFromProfile();
        }

        /**
         * @ngdoc function
         * @name addProperty
         * @description
         * Adds a property template to this resource template
         */
        $scope.addProperty = function() {
            $scope.importy = false;
            $scope.resourceFields.push($scope.addIndexResource);
            $scope.addIndexResource++;
            $scope.addNew = true;
        };

        /**
         * @ngdoc function
         * @name delete
         * @description
         * Deletes this resource template
         */
        $scope.deleteResource = function() {
            if($scope.propertyTemplate) {
                $scope.deleteItem($scope.parentId, $scope.resources);
                $scope.deleteItem($scope.resourceTemplate, $scope.propertyTemplate.resourceTemplates);
            }
            else {
                $scope.deleteItem($scope.parentId, $scope.fields);
                $scope.deleteItem($scope.resourceTemplate, $scope.profile.resourceTemplates);
            }
        };

        /**
         * @ngdoc function
         * @name propertySortOption
         * @description
         * Sets the minimum distance the property template must be moved before
         * Angular treats it as a drag and drop
         */
        $scope.propertySortOption = {
            stop: function() {
                $scope.resourceTemplate.propertyTemplates = $scope.rearrangeData($scope.resourceFields, $scope.propertyTemplatesBase);
            },
            distance: '10'
        };

        /**
         * @ngdoc function
         * @name checkID
         * @description
         * Check if the template id is unique
         */
        $scope.checkID = function() {
            $scope.resourceForm.resourceId.$invalid = false;
            var templateRefs = localStorageService.get('templateRefs');
            templateRefs.find(function (t) {
                if (t == $scope.resourceTemplate.id) {
                    $scope.resourceForm.resourceId.$invalid = true;
                };
            });
        };

        /**
         * @ngdoc function
         * @name checkURI
         * @description
         * Check if URI resolves
         */
        $scope.checkURI = function() {
            $scope.resourceForm.resourceURI.$warn = false;
            var url = $scope.resourceTemplate.resourceURI;
            $http({
                method: 'HEAD',
                url: url
            })
            .then(function (response) {
            }, function (response) {
                console.log($scope.resourceTemplate.resourceURI + ' did not resolve!')
                $scope.resourceForm.resourceURI.$warn = true;
            });
        };
    });
