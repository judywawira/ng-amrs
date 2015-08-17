/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069
*/
(function() {
    'use strict';

    angular
        .module('app.formentry')
        .controller('tabCtrl', tabCtrl);

    tabCtrl.$inject = ['$translate', 'dialogs', '$location', '$rootScope',  '$stateParams', '$state', '$scope', 'FormentryService', 'EncounterResService', '$timeout', 'FormsMetaData'];

    function tabCtrl($translate, dialogs, $location, $rootScope, $stateParams, $state, $scope, FormentryService, EncounterResService, $timeout, FormsMetaData) {
        $scope.vm = {};
        $scope.vm.model = {};
        $scope.vm.patient = $rootScope.broadcastPatient;
        var formSchema;
        $scope.vm.formlyFields;
        $timeout(function () {
         FormentryService.getFormSchema('form', function(schema){
          formSchema = schema;
          console.log('New Form Schema');
          console.log(formSchema);

          FormentryService.createForm(formSchema, function(formlySchema){
            $scope.vm.formlyFields = formlySchema;
            $scope.vm.tabs = $scope.vm.formlyFields;

            angular.forEach($scope.vm.tabs, function(tab){
              console.log('Tab Structure');
              console.log(tab);
              tab.form['model']=$scope.vm.model;
            });
            ///FormentryService.getEncounter('encData', formlySchema)
            var params = {uuid:'33158613-0f76-45a5-9c49-28f5928185aa'};
            EncounterResService.getEncounterByUuid(params,
              function(data){
              var encData = data;
              console.log('Rest Feeback')
              console.log(encData);
              if (data)
              {
                FormentryService.getEncounter(encData,formlySchema);
              }

             });
          });
         });

       },1000);

          $scope.vm.originalTabs = angular.copy($scope.vm.form);

          // function definition
          $scope.vm.onSubmit = function() {
            console.log('testing submit button');
            var payLoad = FormentryService.generateFormPayLoad($scope.vm.model);

            //alert(JSON.stringify($scope.vm.model), null, 2);
          }


          $scope.vm.cancel = function()
          {
            console.log($state);
            var dlg = dialogs.confirm('Close Form', 'Do you want to close this form?');
  					dlg.result.then(function(btn){
  						$location.path($rootScope.previousState + '/' +$rootScope.previousStateParams.uuid);
  					},function(btn){
  						//$scope.vm.confirmed = 'You confirmed "No."';
  					});

          }
    }
})();
