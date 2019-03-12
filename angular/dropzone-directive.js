/**!
 * AngularJS dropzone directive
 * 
 * 
 
 

angular.module('app.directive.dropzone',[])
    .directive('dropZone',[
        function(){
    
            
            var config = {
                template:'<label class="drop-zone">'+
                         '<input type="file" multiple accept="jpg" />'+
                         '<div ng-transclude></div>'+       // <= transcluded stuff
                         '</label>',
                transclude:true,
                replace: true,
                require: '?ngModel',
                link: function(scope, element, attributes, ngModel){
                    var upload = element[0].querySelector('input');    
                        upload.addEventListener('dragover', uploadDragOver, false);
                        upload.addEventListener('drop', uploadFileSelect, false);
                        upload.addEventListener('change', uploadFileSelect, false);                
                        config.scope = scope;                
                        config.model = ngModel; 
                }
            }
            return config;


            // Helper functions
            function uploadDragOver(e) { e.stopPropagation(); e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }
            function uploadFileSelect(e) {
                console.log(this)
                e.stopPropagation();
                e.preventDefault();
                var files = e.dataTransfer ? e.dataTransfer.files: e.target.files;
                for (var i = 0, file; file = files[i]; ++i) {
                    console.log(file);
                    var reader = new FileReader();
                    reader.onload = (function(file) {
                        return function(e) { 
                            
                            // Data handling (just a basic example):
                            // [object File] produces an empty object on the model
                            // why we copy the properties to an object containing
                            // the Filereader base64 data from e.target.result
                            var data={
                                data:e.target.result,
                                dataSize: e.target.result.length
                            };
                            for(var p in file){ data[p] = file[p] }
                            
                            config.scope.$apply(function(){ config.model.$viewValue.push(data) })
                        }
                    })(file);
                    reader.readAsDataURL(file);
                }
            }
        }
    ])


*/


 
(function(root){
    'use strict';
  function factory(angular, Dropzone){
      
    angular.module('ui.dropzone', []).provider('dropzoneOps', function(){
      /*
       *  Add default options here
      **/
      var defOps = {
        //Add your options here
      };
      
      return {
        setOptions : function(newOps){
          angular.extend(defOps, newOps);
        },
        $get : function(){
          return defOps;
        }
      }
    }).directive('ngDropzone', ['$timeout', 'dropzoneOps', function($timeout, dropzoneOps){
      return {
        restrict : 'AE',
        template : '<div></div>',
        replace : true,
        scope : {
          options : '=?', //http://www.dropzonejs.com/#configuration-options
          callbacks : '=?', //http://www.dropzonejs.com/#events
          methods : '=?' //http://www.dropzonejs.com/#dropzone-methods
        },
        link : function(scope, iElem, iAttr){
          //Set options for dropzone {override from dropzone options provider}
          scope.options = scope.options || {};
          var initOps = angular.extend({}, dropzoneOps, scope.options);
          
          
          //Instantiate dropzone with initOps
          var dropzone = new Dropzone(iElem[0], initOps);
          
          
          /*********************************************/
          
          
          //Instantiate Dropzone methods (Control actions)
          scope.methods = scope.methods || {};
          
          scope.methods.getDropzone = function(){ 
            return dropzone; //Return dropzone instance
          };
          
          scope.methods.getAllFiles = function(){ 
            return dropzone.files; //Return all files
          };
          
          var controlMethods = [
            'removeFile', 'removeAllFiles', 'processQueue',
            'getAcceptedFiles', 'getRejectedFiles', 'getQueuedFiles', 'getUploadingFiles',
            'disable', 'enable', 'confirm', 'createThumbnailFromUrl'
          ];
          
          angular.forEach(controlMethods, function(methodName){
            scope.methods[methodName] = function(){
              dropzone[methodName].apply(dropzone, arguments);
              if(!scope.$$phase && !scope.$root.$$phase) scope.$apply();
            }
          });
          
          
          /*********************************************/
          
          
          //Set invents (callbacks)
          if(scope.callbacks){
            var callbackMethods = [
              'drop', 'dragstart', 'dragend',
              'dragenter', 'dragover', 'dragleave', 'addedfile', 'removedfile',
              'thumbnail', 'error', 'processing', 'uploadprogress',
              'sending', 'success', 'complete', 'canceled', 'maxfilesreached',
              'maxfilesexceeded', 'processingmultiple', 'sendingmultiple', 'successmultiple',
              'completemultiple', 'canceledmultiple', 'totaluploadprogress', 'reset', 'queuecomplete'
            ];
            angular.forEach(callbackMethods, function(method){
              var callback = (scope.callbacks[method] || angular.noop);
              dropzone.on(method, function(){
                callback.apply(null, arguments);
                if(!scope.$$phase && !scope.$root.$$phase) scope.$apply();
              });
            });
          }
        }
      }
    }]);
  }
  
  

  if ((typeof module === 'object') && module.exports) {
    /* CommonJS module */
    module.exports = factory(require('angular'), require('dropzone'));
  } else if (typeof define === 'function' && define.amd) {
    /* AMD module */
    define(['angular', 'dropzone'], factory);
  } else {
    /* Browser global */
    factory(root.angular, root.Dropzone);
  }
})(this);