(function() {
  'use strict';

  angular.module("fairfax")
  .factory("PlanService", PlanService);

  function PlanService(){
    return {
      addToPlan: addToPlan
    };

    function addToPlan(){
      // var todayPlan = [];
      // localStorage.setItem("plan", angular.toJson(todayPlan));
      console.log("addToPlan is working");
    }

  }

}());
