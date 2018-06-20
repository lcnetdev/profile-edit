/**
 * @ngdoc service
 * @name Vocab
 * @description
 * Handles getting and parsing the pre-defined vocabularies
 */
angular.module('locApp.modules.profile.services').factory('Vocab', function($q, $http, localStorageService, Server) {
    vocab = {};

    var choosenResource = -1;
    var choosenProperty = -1;

    var vocabResourceData = [];
    var vocabPropertyData = [];
    
    var languageList = [];

    // Takes in the rdf JSON object and puts a list of resources
    // to save to local storage
    var buildResources = function(rdfResources) {
        var resourceData = [];

        if(!Array.isArray(rdfResources)) {
            var data = {};

            if(rdfResources.label != null) {
               data.label = rdfResources.label.__text.toString();
            }
            else {
                data.label = "";
            }

            data.comment = (rdfResources.comment != null) ? rdfResources.comment.__text.toString() : "";
            data.uri = rdfResources["_rdf:about"];
            resourceData.push(data);
            return resourceData;
        }

        angular.forEach(rdfResources, function(value) {
            var data = {};

            if(value.label != null) {
               data.label = value.label.__text.toString();
            }
            else {
                data.label = "";
            }

            data.comment = (value.comment != null) ? value.comment.__text.toString() : "";
            data.uri = value["_rdf:about"];
            resourceData.push(data);
        });

        return resourceData;
    };

    var buildProperties = function(rdfProperties) {
        var propertyData = [];

        if(!Array.isArray(rdfProperties)) {
            var data = {};

            if(rdfProperties.label != null) {
               data.label = rdfProperties.label.__text.toString();
            }
            else {
                data.label = "";
            }

            data.comment = (rdfProperties.comment != null) ? rdfProperties.comment.__text.toString() : "";
            data.uri = rdfProperties["_rdf:about"];
            propertyData.push(data);
            return propertyData;
        }

        angular.forEach(rdfProperties, function(value) {
            var data = {};

            if(value.label != null) {
               data.label = value.label.__text.toString();
            }
            else {
                data.label = "";
            }

            data.comment = (value.comment != null) ? value.comment.__text.toString() : "";
            data.uri = value["_rdf:about"];
            propertyData.push(data);
        });

        return propertyData;
    };

    // Method that will set the vocab data for each list.
    var _setVocabData = function(name, url, properties, resources) {
        var item = $q.defer();

        Server.get(url,{},false)
        .then(function(response) {
            // if a vocab file is empty then we will pass over it and return.
            if(response === undefined || response === "") {
                item.reject("No data");
                return;
            }

            // set the local storage with this data
            var jsonObj = response.json;
            
            var resource = {};
            var property = {};

            resource.key = name;
            resource.value = buildResources(jsonObj.RDF.Class);
            resources.push(resource);

            property.key = name;
            property.value = buildProperties(jsonObj.RDF.Property);
            properties.push(property);

            // Resolve the queue
            item.resolve("Finished");
        });

        return item.promise;
    };

    // Method to set the local storage of resource and properties
    var _setLocalStorage = function(resources, properties) {
        localStorageService.set("resourceReference", resources);
        localStorageService.set("propertyReference", properties);
        // Set Vocab data
        vocabResourceData = resources;
        vocabPropertyData = properties;
    };

    /**
     * @ngdoc function
     * @name setVocabData
     * @description
     * Gets the vocab data and adds them to the local machine.
     */
    vocab.setVocabData = function() {
        // if the local storage has expired, gather the data and set it up again
        // TODO: make this connect to the real RDF
      
        Server.get('/verso/api/configs?filter[where][configType]=vocabulary&filter[fields][name]=true&filter[fields][id]=true&filter[where][or][0][name]=Bibframe&filter[where][or][1][name]=MADSRDF', {}, false)
        .then(function(response){
            var listLength = 0;
            var returnNumber = 0;
            var resources = [];
            var properties = [];

            // loop through the list of vocabs and gather up the data.
            angular.forEach(response, function(value) {

                var url = '/verso/api/configs/' + value.id;
                // test that we hvae a key and this isn't a comment.
                if(value.id != null) {
                    listLength++;
                    _setVocabData(value.name, url, properties, resources)
                        .then(function() {
                            returnNumber++;

                            // Set local storage once we have all the data.
                            if(returnNumber >= listLength) {
                                _setLocalStorage(resources, properties);
                            }
                        }, function() {
                            returnNumber++;
                        });
                }

            });
        });
    };

    /**
     * @ngdoc function
     * @name retrieveVocabData
     * @description
     * Sets vocabResourceData and vocabPropertyData with current data. Called
     * when the app first runs.
     */
    vocab.retrieveVocabData = function() {
        // returns the vocab data
        var lsDate = localStorageService.get('date');
        var currDate = new Date(lsDate);
        var beginDate = new Date();
        var endDate = new Date();
        
        beginDate.setDate(beginDate.getDate() - 7);
        endDate.setDate(endDate.getDate() + 7);
        
        if(!lsDate || !(currDate >= beginDate && currDate <= endDate)) {
            localStorageService.clearAll();
            vocab.setVocabData();
            localStorageService.set('date', (new Date()).toDateString());
        }
        else {
            vocabResourceData = localStorageService.get("resourceReference");
            vocabPropertyData = localStorageService.get("propertyReference");
        }
    };

    /**
     * @ngdoc function
     * @name updateChosenResource
     * @description
     * Gets the resource data to use to update the resource that is open on
     * the page
     * @param {Number} resourceNumber - the number of the resource to update
     * @returns {Array} - The resource data
     */
    vocab.updateChosenResource = function(resourceNumber) {
        choosenResource = resourceNumber;

        vocab.fillData = fillResource;

        return vocabResourceData;
    };

    /**
     * @ngdoc function
     * @name updateChosenProperty
     * @description
     * Gets the property data to use to update the property template that is
     * open on the page
     * @param {Number} resourceNumber - the resource template number
     * @param {Number} propertyNumber - the property template number
     * @returns {Array} - the property template data
     */
    vocab.updateChosenProperty = function(item) {
        choosenProperty = item;

        vocab.fillData = fillProperty;

        return vocabPropertyData;
    };
    
    vocab.getLanguages = function() {
        var queue = $q.defer();
        
        if(languageList.length > 0) {
            queue.resolve(languageList);
        }
        else {
            var converter = new X2JS();

            Server.get('/verso/api/configs?filter[where][configType]=vocabulary&filter[where][name]=Languages', {}, false)
            .then(function(response) {
                var xmlData = response;
                var jsonObj = converter.xml_str2json(xmlData);

                var data = jsonObj.RDF.MADSScheme.hasTopMemberOfMADSScheme;
                var language;

                for(var i = 0; i < data.length; i++) {
                    language = data[i].Language;
                    if(typeof(language.label[0]) !== 'undefined') {
                        //Make sure it's the English name of the language
                        if(language.label[0]["_xml:lang"] === "en") {
                            languageList.push({key: language.label[0].__text,
                                value: language["_rdf:about"]});
                        } else {
                            for(var j = 0; j < language.label.length; j++) {
                                if(language.label[j]["_xml:lang"] === "en") {
                                    languageList.push({key: language.label[j].__text,
                                        value: language["_rdf:about"]});
                                }
                            }
                        }
                    } else if(typeof(language.label) !== 'undefined') {
                        languageList.push({key: language.label.__text,
                            value: language["_rdf:about"]});
                    } else {
                        languageList.push({key: language["_rdf:about"],
                            value: language["_rdf:about"]});
                    }
                }
                queue.resolve(languageList);
            });
        }
        
        return queue.promise;
        
    };

    fillResource = function(vocab) {
        var resource = choosenResource;
        resource.resourceURI = vocab.uri;
        resource.resourceLabel = vocab.label;
        resource.remark = vocab.comment;

    };

    fillProperty = function(vocab) {
        var property = choosenProperty;
        property.propertyURI = vocab.uri;
        property.propertyLabel = vocab.label;
        property.remark = vocab.comment;

    };

    return vocab;
});

