/** 
* Start Angular Js Application Routes
*/
propertyApp.config(function($routeProvider) {
  
  $routeProvider
    .when('/', {
      controller:'propertyCtrl',
      templateUrl:'/vacation_rental_angularjs/angular/properties/templates/add-property.html'
    })
    .when('/feeds/:feedId', {
      controller:'propertyCtrl',
      templateUrl:'assets/angular/tutor/templates/feed-details.html'
    })
    .when('/404', {
      templateUrl:'/vacation_rental_angularjs/angular/properties/templates/404.html'
    })
    .otherwise({
      redirectTo:'/404'
    });
})
