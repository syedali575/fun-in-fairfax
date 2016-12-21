(function() {
  'use strict';

  angular.module("fairfax")
  .controller("ParksController", ParksController);

  ParksController.$inject = ["ParkService"];

  function ParksController(ParkService){
    // console.log("in ParksController");

    var vm = this;
    vm.message = "";
    vm.parkData = [];

    this.getParks = function getParks(){
      console.log("In getPark Function");
      ParkService.parkList()
      .then(function sucessHandeler(data){
        console.log("Its working", data);
        console.log(data.data.searchResults.results[5].doc.metadata.label);
        vm.parkData = data.data.searchResults.results;

        console.log("Getting my array", vm.parkData);
      })
      .catch(function failHandeler(xhr){
        console.log("Unable to communicate", xhr);
        vm.message = "We are unable to communicate, please try again";

      });
    };

  }

}());
