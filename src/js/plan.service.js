(function() {
  'use strict';

  angular.module("fairfax")
  .factory("PlanService", PlanService);




  function PlanService(){

    var todaysPlan = [];
    var storedLocations = JSON.parse(localStorage.getItem("plan"));
    console.log("Stored Locations",storedLocations);
    todaysPlan = storedLocations || todaysPlan;


    return {
      addToPlan: addToPlan,
      getTodaysPlan: getTodaysPlan,
      locationStorage: locationStorage,
      clear: clear
    };

    function getTodaysPlan() {
      return todaysPlan;
    }


    /**
    * This function converts inconsistent location objects from Fairfax County to structured objects.
    * This function also adds converted object to addToPlan array.
    * @param {Object} data Object containing location information.
    */
    function addToPlan(data){

      // if (data.searchResults){
      //   return;
      // }

// console.log("Whats in here1",data.searchResults.PARKS_FCPA.PARK_NAME);
console.log("Whats in here2",data.searchResults);

      var updatedObject = {
        name: null,
        feature: null,
        streetNumber: null,
        address: null,
        zip: null,
        phone: null,
        web: null
      };




      if (data.searchResults.PARKS_FCPA) {
        updatedObject.name = data.searchResults.PARKS_FCPA.PARK_NAME;
        updatedObject.feature = "Fairfax County Park";
        updatedObject.address = data.searchResults.PARKS_FCPA.STREET;
        updatedObject.zip = data.searchResults.PARKS_FCPA.ZIP_CODE;
      }
      else if(data.searchResults.PARKS_NON_FCPA){
        updatedObject.name = data.searchResults.PARKS_NON_FCPA.NAME;
        updatedObject.feature = "Not Provided";
        updatedObject.address = "Not Provided";
        updatedObject.zip = "Not Provided";

      }
      else if (data.searchResults.Libraries) {
        updatedObject.name = data.searchResults.Libraries.DESCRIPTION;
        updatedObject.feature = "Fairfax County Library";
        updatedObject.streetNumber = data.searchResults.Libraries.STREET_NUMBER;
        updatedObject.address = data.searchResults.Libraries.STREET_NAME;
        updatedObject.zip = data.searchResults.Libraries.ZIP;
        updatedObject.phone = data.searchResults.Libraries.ERC_PHONE;
        updatedObject.web = data.searchResults.Libraries.WEB_ADDRESS;
      }
      else if (data.searchResults.COMMUNITY_CENTERS){
        updatedObject.name = data.searchResults.COMMUNITY_CENTERS.DESCRIPTION;
        updatedObject.feature = "Fairfax County Rec-center";
        updatedObject.streetNumber = data.searchResults.COMMUNITY_CENTERS.STREET_NUMBER;
        updatedObject.address = data.searchResults.COMMUNITY_CENTERS.STREET_NAME;
        updatedObject.zip = data.searchResults.COMMUNITY_CENTERS.ZIP;
        updatedObject.phone = data.searchResults.COMMUNITY_CENTERS.ERC_PHONE;
        updatedObject.web = data.searchResults.COMMUNITY_CENTERS.WEB_ADDRESS;
      }
      else {
        updatedObject.name = data.searchResults.SHOPPING_CENTERS.DESCRIPTIO;
        updatedObject.feature = "Fairfax County Shopping Center";
      }

      todaysPlan.push(updatedObject);
      locationStorage(todaysPlan);
    }


    /**
    * Stores choosen location to localStorage
    * @param  {Object} list [location that user wants to visit]
    * @return {void}
    */
    function locationStorage(planToSave){
      console.log(planToSave);
      localStorage.setItem("plan", angular.toJson(planToSave));
    }

    function clear() {
      localStorage.removeItem("plan");
      todaysPlan = [];
    }
  }

}());
