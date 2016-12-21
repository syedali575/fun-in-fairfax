(function() {
  'use strict';

  angular.module("fairfax")
  .controller("ParksController", ParksController);

  ParksController.$inject = ["ParkService"];

  function ParksController(ParkService){
    // console.log("in ParksController");


    this.getParks = function getParks(){
      console.log("In getPark Function");
      ParkService.parkList()
      .then(function sucessHandeler(data){
        console.log("Its working", data);
        console.log(data.data.searchResults.results[0].doc.metadata.label);
      })
      .catch(function failHandeler(xhr){
        console.log("Unable to communicate", xhr);
      });
    };

  }

}());
