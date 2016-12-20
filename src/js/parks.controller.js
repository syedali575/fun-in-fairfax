(function() {
  'use strict';

  angular.module("fairfax")
  .controller("ParksController", ParksController);

  ParksController.$inject = ["ParkService"];

  function ParksController(ParkService){
    console.log("in ParksController");

    var vm = this;
    console.log(vm);

    this.parks = [];

    this.getParks = function getParks(){
      console.log("In getPark Function");
      ParkService.parkList()
      ;
    };


  }

}());
