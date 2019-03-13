Dropzone.autoDiscover = false;
var propertyApp   = angular.module('propertyApp', ['ngRoute', 'ui.bootstrap', 'ui.tinymce', 'ui.dropzone', 'ui', 'ngMaterial']);


propertyApp.config(function(dropzoneOpsProvider){
  dropzoneOpsProvider.setOptions({
    url : 'http://localhost/upload.php',
    acceptedFiles : 'image/jpeg, images/jpg, image/png',
    addRemoveLinks : true,
    dictDefaultMessage : 'Click to add or drop photos',
    dictRemoveFile : 'Remove photo',
    dictResponseError : 'Could not upload this photo'
  });
});


propertyApp.directive("select2", function($timeout, $parse) {
  return {
    restrict: 'AC',
    require: 'ngModel',
    link: function(scope, element, attrs) {
      console.log(attrs);
      $timeout(function() {
        element.select2();
        element.select2Initialized = true;
      });

      var refreshSelect = function() {
        if (!element.select2Initialized) return;
        $timeout(function() {
          element.trigger('change');
        });
      };
      
      var recreateSelect = function () {
        if (!element.select2Initialized) return;
        $timeout(function() {
          element.select2('destroy');
          element.select2();
        });
      };

      scope.$watch(attrs.ngModel, refreshSelect);

      if (attrs.ngOptions) {
        var list = attrs.ngOptions.match(/ in ([^ ]*)/)[1];
        // watch for option list change
        scope.$watch(list, recreateSelect);
      }

      if (attrs.ngDisabled) {
        scope.$watch(attrs.ngDisabled, refreshSelect);
      }
    }
  };
});


propertyApp.controller('propertyCtrl',function($interval, $timeout, $http, $scope, $rootScope, $window){


/********** Property Defaults ********/
    

    $scope.data = { upload:[] }
    $scope.currentFormSection = 1;
    var defaultRentalType = {
      suitedFor: 1,
      sizeDim: 'sqft',
      sizeLength: 1,
      noOfUnit: 1,
      gallery: [],
      bathroom: {
        have: false,
        count: 1,
        type: 'private'
      },
      bedroom: {
        have: false,
        count: 1,
        type: 'private'
      },
      kitchen: {
        have: false,
        count: 1,
        type: 'private'
      },
      balcony: {
        have: false,
        type: 'private'
      }

    };
  
  $scope.onLoad = function(){

    $scope.dzOptions = {
      paramName : 'photo',
      maxFilesize : '10'
    };

    $scope.list = ["one", "two", "three", "four", "five", "six"];
    
    $scope.dzCallbacks = {
      'addedfile' : function(file){
        console.info('File added from dropzone 1.', file);
        console.info('rentalTypes', $scope.property.rentalTypes);
      }
    };

	  $scope.showLoader = true;
	  $scope.heading = "Welcome";
	  
	  $scope.property = {
	  	types: [{
	      name: 'Holiday House'
	    }, {
	      name: 'Holiday Apartment'
	    }, {
	      name: 'Bed & Breakfast'
	    }, {
	      name: 'Boat House'
	    }]
    }


    $scope.property.currentRentalType = 1;
    $scope.property.rentalTypes = [defaultRentalType];



    console.log('$scope.property', $scope.property);
  }

  $scope.onLoad();

  // Add new rental type with default values
  $scope.showSection = function(section) {

    $scope.currentFormSection = section;
  }

  // Add new rental type with default values
  $scope.addRentalType = function() {
    let newRentalType = {
      suitedFor: 1,
      sizeDim: 'sqft',
      sizeLength: 1,
      noOfUnit: 1,
      gallery: [],
      bathroom: {
        have: false,
        count: 1,
        type: 'private'
      },
      bedroom: {
        have: false,
        count: 1,
        type: 'private'
      },
      kitchen: {
        have: false,
        count: 1,
        type: 'private'
      },
      balcony: {
        have: false,
        type: 'private'
      }

    };
    $scope.property.rentalTypes.push(newRentalType);
    $scope.property.currentRentalType = $scope.property.rentalTypes.length;
    console.log('rentalTypes', $scope.property.rentalTypes);
    console.log('currentRentalType', $scope.property.currentRentalType);
  }

  // cancel editing of rental type
  $scope.cancelRentalTypeEdit = function() {

    $scope.property.currentRentalType = 0; // do not match any
    console.log('currentRentalType', $scope.property.currentRentalType);
  }

  // allow editing of a rental type 
  $scope.allowEditRentalType = function(currentRentalType) {
    
    $scope.property.currentRentalType = currentRentalType;
    console.log('currentRentalType', $scope.property.currentRentalType);
  }

  // allow editing of a rental type 
  $scope.saveRentalType = function() {

    console.log('rentalTypes', $scope.property.rentalTypes);
  }
});
