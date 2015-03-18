/**
 * @ngdoc controller
 * @name importController
 * @description
 * Coordinates services to handle file imports
 */
angular.module('locApp.modules.profile.controllers')

    .controller('importController', ['$upload', '$scope', 'Import', 'ProfileHandler', 'Alert', function($upload, $scope, Import, ProfileHandler, Alert) {
            
        $scope.onFileSelect = function($files) {
            //$files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                $scope.handleFile(file);
            }
        };
                    
        /**
         * @ngdoc function
         * @name handleFile
         * @description
         * Places the information contained in file in the profile form. Throws
         * an error if the file does not contain proper JSON or if the data
         * is not a valid BIBFRAME profile
         * @param {type} file - the file to parse
         * @returns {string} The contents of the file as a text string
         */
        $scope.handleFile = function(file) {
            Import.handleFileSelect(file)
                    .then(function(response) {
                        try {
                            var deserialized = angular.fromJson(response);

                            if(ProfileHandler.validateProfile(deserialized)) {
                                $scope.insertIntoForm(deserialized);
                            }
                        } catch(err) {
                            if(err.message){
                                if(err.message.indexOf("Unexpected token") !== -1) {
                                    err.message = "The selected file is not in the appropriate format. Files must be submitted in JSON format";
                                }
                                else if (err.message.indexOf("Unexpected end of input") !== -1){
                                    err.message = "The selected file contains no data";
                                }
                            }
                            $scope.setMessage(Alert.showModal(err));
                            //watched by the alert and export directives to know
                            //when to display error messages
                            $scope.toggleAlert();
                            console.log("Alert Should Happen");
                        }
            });
            //watched by the closeModal directive that handles closing the
            //import file modal dialog
            $scope.visible = !$scope.visible;
        };
    }]);