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



      });
    };
  }

}());
