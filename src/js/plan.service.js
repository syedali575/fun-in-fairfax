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

      var updatedObject = {
        name: null,
        streetNumber: null,
        address: null,
        zip: null,
        phone: null,
        web: null
      };

      if (data.searchResults.PARKS_FCPA) {
        updatedObject.name = data.searchResults.PARKS_FCPA.PARK_NAME;
        updatedObject.address = data.searchResults.PARKS_FCPA.STREET;
        updatedObject.zip = data.searchResults.PARKS_FCPA.ZIP_CODE;
      }
      else if (data.searchResults.Libraries) {
        updatedObject.name = data.searchResults.Libraries.DESCRIPTION;
        updatedObject.streetNumber = data.searchResults.Libraries.STREET_NUMBER;
        updatedObject.address = data.searchResults.Libraries.STREET_NAME;
        updatedObject.zip = data.searchResults.Libraries.ZIP;
        updatedObject.phone = data.searchResults.Libraries.ERC_PHONE;
        updatedObject.web = data.searchResults.Libraries.WEB_ADDRESS;
      }




      todaysPlan.push(updatedObject);

      console.log("addToPlan is working", updatedObject);
      console.log("Whats in todaysPlan", updatedObject);
      // localStorage.setItem("plan", angular.toJson(todaysPlan));
    }

  }

}());
