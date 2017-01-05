(function() {
  'use strict';

  angular.module("fairfax")
  .controller("PlanController", PlanController);

  PlanController.$inject = ["PlanService"];


  function PlanController(PlanService){

    var vm = this;
    vm.yourPlan = PlanService.todaysPlan;
    // vm.yourPlan = JSON.parse(localStorage.getItem("plan"));



  }
}());
