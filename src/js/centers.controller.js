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
     * [getCenter description]
     * @return {[type]} [description]
     */
    this.getCenter = function getCenter(){

      navigator.geolocation.getCurrentPosition(function locationHandeler(location){
        console.log(location);

        CenterService.centerList(location.coords)
        .then(function sucessHandeler(data){
          console.log("Getting Centers", data);

          // vm.centerData = data.data.searchResults.results;
          vm.centerData = data;
          console.log(vm.centerData, "Center Data");
        })
        .catch(function failHandeler(xhr){
          console.log("Unable to communicate", xhr);

          vm.message = "We are unable to communicate due to network outage, please contact your Network Administrator";

        });
      });
    };
  }
}());
