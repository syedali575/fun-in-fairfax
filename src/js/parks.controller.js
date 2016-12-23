(function() {
  'use strict';

  angular.module("fairfax")
  .controller("ParksController", ParksController);

  ParksController.$inject = ["ParkService"];

  function ParksController(ParkService){

    var vm = this;
    vm.message = "";
    vm.parkData = [];

    /**
     * [getParks description]
     * @return {[type]} [description]
     */
    this.getParks = function getParks(){

      navigator.geolocation.getCurrentPosition(function locationHandeler(location) {
        console.log(location);

        ParkService.parkList(location.coords)
        .then(function sucessHandeler(data){
          console.log("In Controller", data);

          vm.parkData = data;
          console.log(vm.parkData, "Data in controller for html");
        })
        .catch(function failHandeler(xhr){
          console.log("Unable to communicate", xhr);

          vm.message = "We are unable to communicate, please try again";

        });

      });

    };
  }
}());
