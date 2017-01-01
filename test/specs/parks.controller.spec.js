(function() {
  'use strict';

  var expect = window.chai.expect;


  describe("ParksController", function(){
    var ParksController;
    var mockParkService = {};

    beforeEach(module("fairfax"));

    beforeEach(module(function($provide){
      $provide.value("ParkService", mockParkService);
    }));

    beforeEach(inject(function($controller, $q){

      mockParkService.parkList = function(){
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

    // it("Should receive list of parks form service", function(){
    //   var result = ParksController.getParks();
    //   expect(result).to.be.undefined;
    //
    // });


  });

}());
