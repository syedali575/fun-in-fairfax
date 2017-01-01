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
    * [This function acquires location (latitude and longitude) of a user and execute shopList function]
    * @return {Void}
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
