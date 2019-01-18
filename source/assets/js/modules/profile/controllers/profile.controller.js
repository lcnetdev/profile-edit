/**
 * @ngdoc controller
 * @name profileController
 * @description
 * Handles the scope variable for profiles, and coordinates various services
 * to facilitate adding, editing and saving profiles
 */
angular.module('locApp.modules.profile.controllers')

    .controller('profileController', function($scope, $state, $stateParams, $filter, $http, Alert, Server, FormHandler, ProfileHandler, Vocab, usSpinnerService, localStorageService) {

        $scope.addPage = ($state.current.name === 'profile.create');

        // used for setting up select statements in the profile form.
        $scope.options = [{key:'false', label:'False'},{key:'true', label:'True'}];
        
        // Get the languages for Value Data Types
        Vocab.getLanguages()
            .then(function(response) {
                $scope.languages = response;
            });

        $scope.importy = false;
        $scope.loading = false;
        $scope.chain = false;
        $scope.addNew = false;

        $scope.profile = {};
        $scope.profile.resourceTemplates = [];
        $scope.resourceTemplatesBase = [];
        $scope.propertyTypes = [];

        $scope.oldTitle = "";
        $scope.searchText = "";

        $scope.titleList = [];
        $scope.idList = [];
        $scope.vocabData = [];
        $scope.vocabDataFull = [];
        $scope.sssVocab = {};

        $scope.selectData = [];
        $scope.sssSelected = {};
        $scope.selectedResource = {};
        $scope.selectedProperty = {};

        $scope.fields = [];

        $scope.addIndex = -1;
        $scope.importIndex = -1;
        $scope.item = 0;
        
        $scope.resNest = 0;
        $scope.propNest = 0;
        
        $scope.loadCount = 0;
        $scope.loaded = 0;


        /**
         * @ngdoc function
         * @name checkURL
         * @description
         * Check if URI resolves
        */
        $scope.checkSourceURI = function() {
            $scope.profileForm.source.$warn = false;
            var url = $scope.profile.source
            $http({
                method: 'HEAD',
                url: url
            })
            .then(function (response) {
            }, function (response) {
                console.log($scope.profile.source + ' did not resolve!')
                $scope.profileForm.source.$warn = true;
            });

        };        
        
        $scope.$watch('loaded', function() {
           if($scope.loaded >= $scope.loadCount && $scope.loadCount !== 0) {
               $scope.finishedLoading = true;
               usSpinnerService.stop('spinner-1');
           } 
        });

        if($stateParams.id == null) {
           $scope.profile.resourceTemplates = [];
        }

        // Retrieve the Vocab Data
        Vocab.retrieveVocabData();

        // HTTP request to get the data
        if ($stateParams.id) {
            Server.get('/verso/api/configs/' + $stateParams.id, {})
                .then(function(response) {
                    $scope.insertIntoForm(response.json);
                    $scope.continueImport();
                    $scope.loading = true;
                    
                    usSpinnerService.spin('spinner-1');

                    $scope.addIndex = $scope.profile.resourceTemplates.length;
                    $scope.oldTitle = $scope.profile.title;

                    // Create the default array
                    for(var i = 0; i < $scope.profile.resourceTemplates.length; i++) {
                        $scope.resourceTemplatesBase.push($scope.profile.resourceTemplates[i]);
                    }
                    
                    $scope.addPage = ($state.current.name === 'profile.create');
                    
                    if($scope.addPage) {
                        $scope.finishedLoading = true;
                    }
                });
        };
        // profiles titles call
        Server.get('/verso/api/configs?filter[where][configType]=profile', {}, true)
            .then(function(response) {
                for(var i = 0; i < response.length; i++) {
                    $scope.titleList.push(response[i].json.Profile.title);
                    $scope.idList.push(response[i].id);
                }
            });

        // Get propertyTypes
        Server.get('/verso/api/configs?filter[where][name]=propertyTypes', {}, true)
            .then(function(response) {
                $scope.propertyTypes = response[0].json;
            });

        /**
         * @ngdoc function
         * @name searchVocab
         * @description
         * Searches the Vocab
         */
        $scope.searchVocab = function() {
            $scope.vocabData = [];
            angular.forEach($scope.vocabDataFull, function(value) {
               if(value.label.indexOf($scope.searchText) > -1) {
                   $scope.vocabData.push(value);
               }
            });
        };

        /**
         * @ngdoc function
         * @name fillData
         * @description
         * Displays a modal dialog with resource or property teamplate data
         */
        $scope.fillData = function() {
            Vocab.fillData($scope.sssVocab[0]);
            //watched by the closeChooseResource directive to know when to
            //display error messages
            $scope.resourceVisible = !$scope.resourceVisible;
        };
        
        var isResource = false;
        var isProperty = false;

        /**
         * @ngdoc function
         * @name selectVocab
         * @description
         * Selects the vocab list to display in the modal
         */
        $scope.selectVocab = function() {
            $scope.vocabData = $scope.sssSelected;
            $scope.vocabDataFull = $scope.vocabData;
            
            if (isResource) {
                $scope.selectedResource = $scope.sssSelected;
            }
            else if (isProperty) {
                $scope.selectedProperty = $scope.sssSelected;
            }
            else {
                $scope.selectedDatatype = $scope.sssSelected
            }
        };

        /**
         * @ngdoc function
         * @name updateChosenResource
         * @description
         * Populates item with the correct resource data
         * @param {Object} item - the chosen resource
         */
        $scope.updateChosenResource = function(item, fields) {
            $scope.selectData = Vocab.updateChosenResource(item);
            $scope.sssVocab = {};
            isResource = true;
            
            //Use a traditional for loop to break out of it when 
            //the proper data is found
            for(var i = 0; i < $scope.selectData.length; i++) {
                if($scope.selectData[i].value === $scope.selectedResource) {
                    $scope.sssSelected = $scope.selectedResource;
                    $scope.selectVocab();
                    break;
                } else {
                    $scope.vocabData = [];
                    $scope.vocabDataFull = [];
                }
            }
            
            $scope.vocabHeader = "Choose Resource Template";
        };

        /**
         * @ngdoc function
         * @name updateChosenProperty
         * @description
         * Populates resourceNumber.propertyNumber with the correct data
         * @param {Number} resourceNumber - the number of the resource template
         * @param {Number} propertyNumber - the numer of the property template
         */
        $scope.updateChosenProperty = function(item) {
            $scope.selectData = Vocab.updateChosenProperty(item);
            $scope.sssVocab = {};
            isResource = false;
            isProperty = true;
            
            //Use a traditional for loop to break out of it when 
            //the proper data is found
            for(var i = 0; i < $scope.selectData.length; i++) {
                if($scope.selectData[i].value === $scope.selectedProperty) {
                    $scope.sssSelected = $scope.selectedProperty;
                    $scope.selectVocab();
                    break;
                } else {
                    $scope.vocabData = [];
                    $scope.vocabDataFull = [];
                }
            }
            
            $scope.vocabHeader = "Choose Property Template";
        };

        /**
         * @ngdoc function
         * @name updateChosenDatatype
         * Populates resourceNumber.propertyNumber with the correct data
         * @param {Number} resourceNumber - the number of the resource template
         * @param {Number} propertyNumber - the numer of the property template
         */

        $scope.updateChosenDatatype = function(item) {
            $scope.selectData = Vocab.updateChosenDatatype(item);
            $scope.sssVocab = {};
            isResource = false;
            isProperty = false;
            
            //Use a traditional for loop to break out of it when 
            //the proper data is found
            for(var i = 0; i < $scope.selectData.length; i++) {
                if($scope.selectData[i].value === $scope.selectedDatatype) {
                    $scope.sssSelected = $scope.selectedDatatype;
                    $scope.selectVocab();
                    break;
                } else {
                    $scope.vocabData = [];
                    $scope.vocabDataFull = [];
                }
            }
            
            $scope.vocabHeader = "Choose Data Type";
        };

        /**
         * @ngdoc function
         * @name insertIntoForm
         * @description
         * Inserts the object into the profile form
         * @param {Object} object - the profile to insert into the form
         */
        $scope.insertIntoForm = function(object) {
            $scope.loading = false;
            $scope.importy = true;
            $scope.chain = true;

            $scope.profile = {};
            $scope.profile.resourceTemplates = [];
            // Format the Json string

            // override fields
            angular.forEach(object.Profile, function(value, key) {
                $scope.profile[key] = value;
            });

            // purge the fields and add a wild element to trigger the directive
            // used so to force the directive to trigger when we are importing to clear
            // out the html data.
            $scope.fields = [];
            $scope.fields.push("A");
            $scope.finishedLoading = false;
        };

        /**
         * @ngdoc function
         * @name continueImport
         * @description
         * Ensures that the profile import will overwrite any data that is already
         * present on the page
         */
        $scope.continueImport = function() {
            $scope.fields = [];
            for(var i = 0; i < $scope.profile.resourceTemplates.length; i++){
                $scope.fields.push(i);
            }
            $scope.chain = false;
            $scope.addIndex = $scope.profile.resourceTemplates.length;
            $scope.addPage = false;
        };

        $scope.validateProfile = function() {
           //if the form has invalid data don't let them save
            if($scope.profileForm.$invalid) {
                $scope.message = Alert.showModal("Parts of the form are invalid");
                //watched by the alert directive to know when to display messages
                $scope.toggleAlert();
                return false;
            }
            
            var jsonObj = FormHandler.getFormData($scope.profile, false);
            
            
            try {
                ProfileHandler.validateProfile(jsonObj);
            } catch(exception) {
                $scope.message = Alert.showModal(exception);
                //watched by the alert directive to know when to display messages
                $scope.alertVisible = !$scope.alertVisible;
                return false;
            }
            
            return true;
        };

        /**
         * @ngdoc function
         * @name checkTitle
         * @description
         * Checks that the profile has a unique title, and displays a warning
         * to the user if that is the case
         */
        $scope.checkTitle = function() {
            
            var titleMatch = $scope.titleList.indexOf($scope.profile.title);

            if(!$scope.validateProfile()){
                return;
            }            
            // just save if we didn't change the title
            else if($scope.profile.title === "" || $scope.profile.title === undefined) {
                $scope.message = Alert.showModal("Title is missing");
                //watched by the alert directive to know when to display messages
                $scope.alertVisible = !$scope.alertVisible;
            }
            else if($scope.profile.title === $scope.oldTitle) {
                $scope.save();
            }
            else if(titleMatch >= 0) {
                // display the warning message.
                // $scope.message = "This profile has a matching title to another, saving this will overwrite that one.";
                $scope.message = 'The profile title "' + $scope.profile.title + '" already exists. Please choose a unique title.';
                // $scope.confirmation = "Do you want to continue?";
                // $stateParams.id = $scope.idList[titleMatch];
                // watched by the warning directive to know when to display
                // messages
                $scope.alertVisible = !$scope.alertVisible;
            }
            // no longer needed if not writing to file system
            /* else if(typeof($scope.oldTitle) === "undefined") {
                $scope.save();
            }
            else {
                // Changeing titles, ask if they want to make a copy or replace
                $scope.continueSave();
            } */
            else {
                $scope.save();
            }
        };

        /**
         * @ngdoc function
         * @name deleteThenSave
         * @description
         * Deletes the old profile on the server and then saves the current profile
         * to the server. Allows profiles to be completely renamed.
         */
        $scope.deleteThenSave = function() {
            Server.deleteItem('server/delete', {
                name: $scope.oldTitle + ".json"
            })
                .then(function() {
                        $scope.save();
                }, function(err) {
                        $scope.message = Alert.showModal(err);
                });
        };

        /**
         * @ngdoc function
         * @name continueSave
         * @description
         * Resumes save in the event that a profile should overwrite another
         * profile with the same title
         */
        $scope.continueSave = function() {
            if(typeof($scope.oldTitle) !== "undefined") {
                $scope.message = "You are changing the title of this profile. This will result in creating a new file: " + $scope.profile.title + ".json";
                $scope.confirmation = "Do you want to delete the old file: " + $scope.oldTitle + ".json";
                $scope.overrideVisible = !$scope.overrideVisible;
            }
        };
        
        /**
         * @ngdoc function
         * @name validateDate
         * @description
         * Sets the profile's date field to a valid date, either using the user's
         * chosen date, or today's date as the default.
         */
        $scope.validateDate = function() {
            var date;

            if($scope.profile.date == null || $scope.profile.date === "") {
                date = new Date();
            }
            else {
                if($scope.profile.date.match('[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}')) {
                    date = $scope.profile.date;
                }
                //handle dashes in firefox
                else if($scope.profile.date.match('[0-9]{1,2}-[0-9]{1,2}-[0-9]{2,4}')) {
                    var values = $scope.profile.date.split("-");
                    values[0] = values[0].length === 2 ? values[0] : "0" + values[0];
                    values[1] = values[1].length === 2 ? values[1] : "0" + values[1];

                    if(parseInt(values[0]) > 12) {
                        $scope.profile.date = values[2] + "-" + values[1] + "-" + values[0];
                    }
                    else {
                        $scope.profile.date = values[2] + "-" + values[0] + "-" + values[1];
                    }

                    date = $scope.profile.date;
                }
                else if($scope.profile.date.match('[a-zA-Z]')) {
                    $scope.profile.date = $scope.profile.date.replace(/[\.,#!$%\^&\*;:{}=_'~()]/g,"");
                    //Truncate the month name to three letters, just in case
                    $scope.profile.date = $scope.profile.date.substring(0,4) + $scope.profile.date.substring($scope.profile.date.indexOf(" "), $scope.profile.date.length);
                    date = new Date($scope.profile.date);
                }
                else {
                    date = new Date($scope.profile.date);
                }
            }

            $scope.profile.date = $filter('date')(date,"yyyy-MM-dd");
        }

        /**
         * @ngdoc function
         * @name save
         * @description
         * Saves the information in the form to the server in JSON format. Displays
         * warning messages when the Profile is incomplete
         */
        $scope.save = function() {
            //Close the title warning, just in case
            $scope.warningVisible = !$scope.warningVisible;
            $scope.message = "";

            // get the object for the JSON serialization, validate, then
            // serialize if clean.Alert
            var jsonObj = FormHandler.getFormData($scope.profile, false);

            $scope.validateDate();

            delete $scope.profile.json;

            $scope.profile.json = angular.toJson(jsonObj);
            var versoJson = angular.fromJson($scope.profile.json);

            var versoModel = { 
                "name": $scope.profile.title,
                "configType": "profile",
                "json": versoJson
            };

            var postUrl = ($stateParams.id) ? $stateParams.id + '/replace' : '';

            // Save
            Server.post('/verso/api/configs/' + postUrl, versoModel)
                .then(function() {
                    localStorageService.remove('templateRefs');
                    $state.go('profile.list');
                 });
        };

        /**
         * @ngdoc function
         * @name addResource
         * @description
         * Adds a resource template to the profile
         */
        $scope.addResource = function() {
            $scope.importy = false;
            $scope.fields.push($scope.addIndex);
            $scope.addIndex++;
            $scope.addNew = true;
        };

        /**
         * @ngdoc function
         * @name importCascade
         * @description
         * Registers children with their parent element
         * @param {Object} fields - the fields to add
         * @param {Object} childList - the list to add the fields to
         */
        $scope.importCascade = function(fields, childList) {
            if(childList == null) {
                return;
            }
            for(var i = 0; i < childList.length; i++){
                fields.push(i);
            }
        };

        /**
         * @ngdoc function
         * @name delete
         * @description
         * Deletes the profile from the server
         */
        $scope.deleteProfile = function() {
            Server.deleteItem('/verso/api/configs/' + $stateParams.id, {})
                .then(function() {
                        $state.go('profile.list');
                }, function(err) {
                        $scope.message = Alert.showModal(err);
                });
        };

        /**
         * @ngdoc function
         * @name rearrangeData
         * @description
         * Rearranges the child elements of the parent to match the order
         * in which they are displayed on the screen
         * @param {array} indexArray - the array of where each element is
         * @param {array} dataArray - the array of resource/property templates
         * @returns {Array} The array of properly ordered templates
         */
        $scope.rearrangeData = function(indexArray, dataArray) {
            var tmpArray = [];
            for(var i = 0; i < indexArray.length; i++) {
                tmpArray.push(dataArray[indexArray[i]]);
            }
            return tmpArray;
        };

        /**
         * @ngdoc function
         * @name resourceSortOption
         * @description
         * Sets a minimum distance an element must be moved on the page before
         * the editor treats it as a drag and drop instead of simply opening the
         * element
         */
        $scope.resourceSortOption = {
            stop: function() {
                $scope.profile.resourceTemplates = $scope.rearrangeData($scope.fields, $scope.resourceTemplatesBase);
            },
            distance: '10'
        };

        /**
         * @ngdoc function
         * @name deleteItem
         * @description
         * Deletes an item from the object arrays
         * @param {Object} item - the item in the array to remove.
         * @param {Array} fields - The array of fields/objects to remove from.
         */
        $scope.deleteItem = function(item, fields) {
            var index = fields.indexOf(item);
            fields.splice(index, 1);
        };

        /**
         * @ngdoc function
         * @name getDisplayDate
         * @description
         * Returns the date to display
         * @returns {date} The date displayed
         */
        $scope.getDisplayDate = function() {

            var date;

            if($scope.profile.date == null || $scope.profile.date === "") {
                date = new Date();
            }
            else {
                if($scope.profile.date.match('[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}')) {
                    date = $scope.profile.date;
                }
                //handle dashes in firefox
                else if($scope.profile.date.match('[0-9]{1,2}-[0-9]{1,2}-[0-9]{2,4}')) {
                    var values = $scope.profile.date.split("-");
                    values[0] = values[0].length === 2 ? values[0] : "0" + values[0];
                    values[1] = values[1].length === 2 ? values[1] : "0" + values[1];

                    if(parseInt(values[0]) > 12) {
                        date = values[2] + "-" + values[1] + "-" + values[0];
                    }
                    else {
                        date = values[2] + "-" + values[0] + "-" + values[1];
                    }

                }
                else if($scope.profile.date.match('[a-zA-Z]')) {
                    var tmp;
                    tmp = $scope.profile.date.replace(/[\.,#!$%\^&\*;:{}=_'~()]/g,"");
                    //Truncate the month name to three letters, just in case
                    tmp = $scope.profile.date.substring(0,4) + $scope.profile.date.substring($scope.profile.date.indexOf(" "), $scope.profile.date.length);
                    date = new Date(tmp);
                }
                else {
                    date = new Date($scope.profile.date);
                }
            }

            date = $filter('date')(date,"MMM dd yyyy");

            return date;
        };

        $scope.verifyDelete = function(callback) {
            $scope.deleteToggle = !$scope.deleteToggle;
            $scope.confirm = callback;
        };
        
        $scope.resourceValid = function(resource) {
            // if a resource doesn't have a property then its invalid
            if(resource.propertyTemplates.length <= 0 ) {
                return false;
            }
            else {
                var check = true;
                // Loop throught the resources properties
                angular.forEach(resource.propertyTemplates, function(property) {
                    // if one of the properties isn't valid then we are invalid
                    if(!$scope.propertyValid(property)) {
                        check = false;
                    }
                });
                return check;
            };
        };
        
        $scope.propertyValid = function(property) {
            // if we dont have resources in the property then return true
            if(property.resourceTemplates == null || property.resourceTemplates.length === 0) {
                return true;
            }
            else {
                var check = true;
                // Loop through the properties resources
                angular.forEach(property.resourceTemplates, function(resource) {
                    // if one of the resoruces isn't valid then we are invalid
                    if(!$scope.resourceValid(resource)) {
                        check = false;
                    }
                });
                return check;
            };
        };

        /*Created by -rsegura 12/10/2014
         * Follow two methods are used for making sure
         * the nested accordions have unique identifiers so that they
         * can collapse and expand without stepping on eachothers
         * toes.
         */
        $scope.getPropNest = function() {
            return $scope.propNest++;
        };
        
        $scope.getResNest = function() {
            return $scope.resNest++;
        };


        /* Created by - rsegura 12/8/2014
         * Following methods are designed as a work around to
         * Internet Explorer 8. They are used for toggling modals
         * on and off.
         */
        $scope.toggleAlert = function() {
            $scope.alertVisible = !$scope.alertVisible;
        };

        $scope.setMessage = function(message) {
            $scope.message = message;
        };
        
        $scope.incLoadCount = function() {
            $scope.loadCount++;
        };
        
        $scope.incLoading = function() {
            $scope.loaded++;
        };

    });
