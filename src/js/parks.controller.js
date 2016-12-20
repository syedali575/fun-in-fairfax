(function() {
  'use strict';

  angular.module("fairfax")
  .contoller("ParksController", ParksController);

  ParksController.$inject = ["ParkService"];

  function ParksController(ParkService){
    console.log("in ParksController");

    this.parks = [];


  }

}());
