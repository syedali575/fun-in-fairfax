(function() {
  'use strict';

  var expect = window.chai.expect;


  describe("ParksController", function(){
    var ParksController;
    var mockParkService = {};
    window.navigator.geolocation = {};
    window.navigator.geolocation.getCurrentPosition = function mockGetCurrentPosition(callback) {
      callback({coords: {latitude: 38.8986131, longitude: -77.0319384}});
    };

    beforeEach(module("fairfax"));

    // beforeEach(inject(function(_$rootScope_){
    //   $rootScope = _$rootScope_;
    // }));

    beforeEach(module(function($provide){
      $provide.value("ParkService", mockParkService);

    }));

    beforeEach(inject(function($controller, $q){

      mockParkService.parkList = function(){
        console.log('resolving mock parklist');
        return $q.resolve(
          [{doc:{metadata:{label: "SKYLINE"}}}]
        );
      };
      ParksController = $controller("ParksController");
    }));


    it("Should have correct scope variables", function(){
      expect(ParksController.parkData).to.be.an("array");
      expect(ParksController.parkData.length).to.equal(0);
      expect(ParksController.message).to.equal(undefined);
    });

    it("Should receive list of parks form service", function(callback){
      var result = ParksController.getParks(function(){

        console.log("SEE",ParksController.parkData[0].doc.metadata.label);
        // expect(ParksController.parkData[0].doc.metadata.label).to.equal("SKYLINE");
        expect(typeof(ParksController.parkData[0].doc.metadata.label)).to.equal("string");
        callback();
      });
      expect(result).to.be.undefined;


    });

// $rootScope.$digest();
  });

}());
