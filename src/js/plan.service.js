(function() {
  'use strict';

  angular.module("fairfax")
  .factory("PlanService", PlanService);

  var todaysPlan = [];
  var storedLocations = JSON.parse(localStorage.getItem("plan"));
  console.log("Stored Locations",storedLocations);
  todaysPlan = storedLocations || todaysPlan;


  function PlanService(){
    return {
      addToPlan: addToPlan,
      todaysPlan: todaysPlan,
      locationStorage: locationStorage
    };


    /**
    * This function converts inconsistent location objects from Fairfax County to structured objects.
    * This function also adds converted object to addToPlan array.
    * @param {Object} data Object containing location information.
    */
    function addToPlan(data){

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
        updatedObject.name = data.searchResults.PARKS_FCPA.PARK_NAME || "No name provided";
        updatedObject.feature = "Fairfax County Park";
        updatedObject.address = data.searchResults.PARKS_FCPA.STREET || "No address provided";
        updatedObject.zip = data.searchResults.PARKS_FCPA.ZIP_CODE || "No zip provided";
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
    function locationStorage(todaysPlan){
      localStorage.setItem("plan", angular.toJson(todaysPlan));
    }
  }

}());
