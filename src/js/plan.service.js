(function() {
  'use strict';

  angular.module("fairfax")
  .factory("PlanService", PlanService);


  var todaysPlan = [];

  function PlanService(){
    return {
      addToPlan: addToPlan,
      todaysPlan: todaysPlan

    };

    function addToPlan(data){
      // var todaysPlan = [];
      todaysPlan.push(data);

      console.log("addToPlan is working", data);
      console.log("Whats in todaysPlan", todaysPlan);
      // localStorage.setItem("plan", angular.toJson(todaysPlan));
    }

  }

}());
