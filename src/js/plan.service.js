(function() {
  'use strict';

  angular.module("fairfax")
  .factory("PlanService", PlanService);

  function PlanService(){
    return {
      addToPlan: addToPlan
    };

    function addToPlan(data){
      var todaysPlan = [];
      todaysPlan.push(data);
      // localStorage.setItem("plan", angular.toJson(todayPlan));
      console.log("addToPlan is working", data);
      console.log("Whats in todaysPlan", todaysPlan);
    }

  }

}());
