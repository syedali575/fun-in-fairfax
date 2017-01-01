(function() {
  'use strict';

  angular.module("fairfax")
  .controller("ParksController", ParksController);

  ParksController.$inject = ["ParkService"];

  function ParksController(ParkService){

    var vm = this;
    vm.message = undefined;
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
          console.log("Getting Parks", data);


          vm.parkData = data;
          console.log(vm.parkData, "Data in controller for html");
        })
        .catch(function failHandeler(xhr){
          console.log("Unable to communicate", xhr);

          vm.message = "We are unable to communicate due to network outage, please contact your Network Administrator";
        });

      });

    };
  }
}());
