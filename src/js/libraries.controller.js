(function() {
  'use strict';

  angular.module("fairfax")
  .controller("LibraryController", LibraryController);

  LibraryController.$inject = ["LibraryService"];

  function LibraryController(LibraryService){

    var vm = this;
    vm.message = undefined;
    vm.libraryData = [];

    /**
     * [getLibrary description]
     * @return {[type]} [description]
     */
    this.getLibrary = function getLibrary(){

      navigator.geolocation.getCurrentPosition(function locationHandeler(location){
        console.log(location);

        LibraryService.libraryList(location.coords)
        .then(function sucessHandeler(data){
          console.log("Getting Libraries", data);

          vm.libraryData = data;
          console.log(vm.libraryData, "Library Data");
        })
        .catch(function failHandeler(xhr){
          console.log("Unable to communicate", xhr);

          vm.message = "We are unable to communicate due to network outage, please contact your Network Administrator";

        });

      });
    };
  }
}());
