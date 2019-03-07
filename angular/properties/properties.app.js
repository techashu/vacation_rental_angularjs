Dropzone.autoDiscover = false;
var propertyApp   = angular.module('propertyApp', ['ngRoute', 'ui.bootstrap', 'ui.tinymce', 'ui.dropzone']);


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

  
  $scope.onLoad = function(){

    $scope.dzOptions = {
      paramName : 'photo',
      maxFilesize : '10'
    };
    
    $scope.dzCallbacks = {
      'addedfile' : function(file){
        console.info('File added from dropzone 1.', file);
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

    console.log('$scope.property', $scope.property);
  }

  $scope.onLoad();
});
