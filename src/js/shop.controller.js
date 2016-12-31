(function() {
  'use strict';

  angular.module("fairfax")
  .controller("ShopController", ShopController);

  ShopController.$inject = ["ShopService"];

  function ShopController(ShopService){

    var vm = this;
    vm.message = undefined;
    vm.shopData = [];


    /**
    * Locates currrent longitude and Latitude and passes them as argument while
    * excuting funtion to make ajax call to retrieve list of shop in vicinity.
    * @return {Void} [description]
    */
    this.getShop = function getShop(){

      navigator.geolocation.getCurrentPosition(function locationHandeler(location){
        console.log(location);

        ShopService.shopList(location.coords)
        .then(function successHandeler(data){
          console.log("In Shop Controller", data);
          vm.shopData = data;
        })
        .catch(function failHandeler(xhr){
          console.log("Unable to Communicate", xhr);

          vm.message = "We are unable to communicate due to network outage, please contact your Network Administrator";

        });

      });
    };
  }

}());
