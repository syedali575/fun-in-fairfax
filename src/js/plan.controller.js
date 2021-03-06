(function() {
  'use strict';

  angular.module("fairfax")
  .controller("PlanController", PlanController);

  PlanController.$inject = ["PlanService"];


  function PlanController(PlanService){
    var vm = this;
    vm.yourPlan = PlanService.getTodaysPlan();


    /**
    * This function clears out "plan" local storage, and make yourPlan empty.
    * @return {Void}
    */
    vm.clearTodaysPlan = function clearTodaysPlan(){
      PlanService.clear();
      vm.yourPlan = [];
    };
  }

}());
