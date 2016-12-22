(function() {
  'use strict';

  var expect = chai.expect;


  describe("Able to retrieve list of parks in my vicinity", function(){
    var ParkService;
    var $httpBackend;
    var $rootScope;


  beforeEach(module("fairfax"));

  beforeEach(module(function($provide){
    $provide.value("ParkService");
  }));

  beforeEach(inject(function(_$rootScope_, _$httpBackend_, _ParkService_){
    ParkService = _ParkService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;

    $httpBackend
    .whenGET("http://www.fairfaxcounty.gov/FFXGISAPI/v1/search?feature=parks&format=json&center=12.3456,12.3456&distance=10000")
    .respond({
      name: "SKYLINE",
      region: "12.4567, -77.1234",
    });

    $httpBackend
    .whenGET("views/parks.template.html")
    .respond("park template");

  }));

  it("should retrieve list of parks", function(doneCallback){

    var result = ParkService.parkList(coordinates);
    expect(data.data.searchResults.results).to.be.a("object");


  });


  });
}());
