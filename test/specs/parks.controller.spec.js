(function() {
  'use strict';

  var expect = window.chai.expect;


  describe("ParksController", function(){
    var ParksController;
    var $rootScope;
    var mockParkService = {};
    window.navigator.geolocation = {};
    window.navigator.geolocation.getCurrentPosition = function mockGetCurrentPosition(callback) {
      callback({coords: {latitude: 38.8986131, longitude: -77.0319384}});
    };

    beforeEach(module("fairfax"));


    beforeEach(module(function($provide){
      $provide.value("ParkService", mockParkService);

    }));

    beforeEach(inject(function($controller, $q,_$rootScope_){
      $rootScope = _$rootScope_;
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

    it("Should receive list of parks from service", function(callback){
      var result = ParksController.getParks(function(){
        console.log(result);
        // console.log("SEE",ParksController.parkData[0].doc.metadata.label);
        expect(ParksController.parkData[0].doc.metadata.label).to.equal("SKYLINE");
        expect(typeof(ParksController.parkData[0].doc.metadata.label)).to.equal("string");
        callback();
      });
      $rootScope.$digest();
    });




  });
}());
