(function() {
  'use strict';

  angular.module("fairfax")
  .controller("CenterController", CenterController);

  CenterController.$inject = ["CenterService"];

  function CenterController(CenterService){

    var vm = this;
    vm.centerData = [];

    this.getCenter = function getCenter(){

      navigator.geolocation.getCurrentPosition(function locationHandeler(location){
        console.log(location);

        CenterService.getCenter(location.coords)
        .then(function sucessHandeler(data){
          console.log("Getting Centers", data);
        })
        .catch(function failHandeler(xhr){
          console.log("Unable to communicate", xhr);
        });


      });
    };
  }
}());
