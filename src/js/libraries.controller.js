(function() {
  'use strict';

  angular.module("fairfax")
  .controller("LibraryController", LibraryController);

  LibraryController.$inject = ["LibraryService"];

  function LibraryController(LibraryService){

    var vm = this;
    vm.message = "";
    vm.libraryData = [];

    this.getLibrary = function getLibrary(){

      navigator.geolocation.getCurrentPosition(function locationHandeler(location){
        console.log(location);

        LibraryService.libraryList(location.coords)
        .then(function(data){
          console.log("Getting Libraries", data);

          vm.libraryData = data.data.searchResults.results;
        })
        .catch(function failHandeler(xhr){
          console.log("Unable to communicate", xhr);

          vm.message = "We are unable to retrieve library list at this momment";
        });
        
      });
    };
  }

}());
