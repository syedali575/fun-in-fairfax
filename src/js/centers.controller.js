(function() {
  'use strict';

  angular.module("fairfax")
  .controller("CenterController", CenterController);

  CenterController.$inject = ["CenterService"];

  function CenterController(CenterService){

    var vm = this;
    vm.message = undefined;
    vm.centerData = [];

    /**
    * [This function acquires location (latitude and longitude) of a user and execute centerList function]
    * @return {Void}
    */
    this.getCenter = function getCenter(){

      navigator.geolocation.getCurrentPosition(function locationHandeler(location){
        console.log(location);

        CenterService.centerList(location.coords)
        .then(function sucessHandeler(data){
          console.log("Getting Centers", data);
          vm.centerData = data;
        })
        .catch(function failHandeler(xhr){
          console.log("Unable to communicate", xhr);
          vm.message = "We are unable to communicate due to network outage, please contact your Network Administrator";
        });
      });
    };
  }
}());
