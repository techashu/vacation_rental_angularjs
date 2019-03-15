Dropzone.autoDiscover = false;
var propertyApp   = angular.module('propertyApp', ['ngRoute', 'ui.bootstrap', 'ui.tinymce', 'ui.dropzone', 'ui', 'ngMaterial', 'angularMoment']);

propertyApp.controller('propertyCtrl',function($interval, $timeout, $http, $scope, $rootScope, $window, $uibModal){


/********** Property Defaults ********/
    

    $scope.data = { upload:[] }
    $scope.currentFormSection = 1;
    var defaultRentalType = {
      suitedFor: 1,
      sizeDim: 'sqft',
      sizeLength: 1,
      noOfUnit: 1,
      name: 'Rental Type #1',
      index: 1,
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


  var currentYear = new Date().getFullYear();
  var reviewYears = []
  for (var i = 0; i < 5; i++) {
    
    reviewYears.push(currentYear--);
  }

  console.log('reviewYears', reviewYears);
  $rootScope.reviewYears = reviewYears;
  
  $scope.onLoad = function(){

    $scope.dzOptions = {
      paramName : 'photo',
      maxFilesize : '10'
    };

    $http.get('assets/js/json/countries-code.json').then(function(response) {
      
      $scope.phoneCodes = response.data;
    });

    $http.get('assets/js/json/languages-code.json').then(function(response) {
      
      $scope.languageCodes = response.data;
    });

    $scope.dzCallbacks = {
      'addedfile' : function(file){
        console.info('File added from dropzone 1.', file);
        console.info('rentalTypes', $scope.property.rentalTypes);
      }
    };
	  
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

    // used in add reviews modal
    $rootScope.rentalTypes = $scope.property.rentalTypes;

    console.log('$scope.property', $scope.property);
  }

  $scope.onLoad();

  $scope.filterBySource = function() {

    console.log('sourceFilter');
  }

  $scope.filterByStatus = function() {

    console.log('filterByStatus');
  }

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

    // used in add reviews modal
    $rootScope.rentalTypes = $scope.property.rentalTypes;

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

  /*********REVIEWS MODAL STARTS************/ 
  var pc = this;
  pc.data = "Lorem Name Test"; 
  $rootScope.reviews = [];

  pc.open = function (size) {
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: baseUrl+'angular/properties/templates/add-review.html',
      controller: 'ModalInstanceCtrl',
      controllerAs: 'pc',
      size: size,
      resolve: {
        data: function () {
          return pc.data;
        }
      }
    });

   
    modalInstance.result.then(function (data) {
      
      $rootScope.reviews.push(data);
      
      var totalRating = 0;

      for (var i = 0; i < $rootScope.reviews.length; i++) {
        
          totalRating += $rootScope.reviews[i].rating;
      }
      
      $rootScope.averageRating = totalRating/$rootScope.reviews.length;

      console.log('review', data);
    });
  };
  /*********REVIEWS MODAL ENDS************/ 


});

angular.module('propertyApp').controller('ModalInstanceCtrl', function ($uibModalInstance, data, $scope, $rootScope, moment) {
  
  var review = this;

  review.ok = function () {
    //{...}
    console.log("You clicked the ok button.", $scope.review); 
    $uibModalInstance.close($scope.review);
  };

  review.cancel = function () {
    //{...}
    console.log("You clicked the cancel button."); 
    $uibModalInstance.dismiss('cancel');
  };

  /**STAR ***/ 
  $scope.review = [];
  $scope.rating = 0;
  $scope.ratings = [{
      current: -1,
      max: 5
  }];

  $scope.review.currentDate = moment().format('MMM DD YYYY');

  $scope.getSelectedRating = function (rating) {
      
      $scope.review.rating = rating;
  }

});




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


propertyApp.directive('starRating', function () {
    return {
        restrict: 'A',
        template: '<ul class="rating">' +
            '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
            '\u2605' +
            '</li>' +
            '</ul>',
        scope: {
            ratingValue: '=',
            max: '=',
            onRatingSelected: '&'
        },
        link: function (scope, elem, attrs) {

            var updateStars = function () {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            };

            scope.toggle = function (index) {
                scope.ratingValue = index + 1;
                scope.onRatingSelected({
                    rating: index + 1
                });
            };

            scope.$watch('ratingValue', function (oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });
        }
    }
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

