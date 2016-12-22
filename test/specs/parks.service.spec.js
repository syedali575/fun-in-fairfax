(function() {
  'use strict';

  var expect = chai.expect;


  describe("Able to retrieve list of parks in my vicinity", function(){
    var ParkService;
    var $httpBackend;
    var $rootScope;


  beforeEach(module("fairfax"));


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
    .whenGET("views/home.template.html")
    .respond("home template");

  }));

  it("should retrieve list of parks", function(doneCallback){

    var result = ParkService.parkList({latitude: 12.3456, longitude: 12.3456});

    expect(result).to.be.an("object");
    expect(result.then).to.be.a("function");
    // TODO: expect catch

    result
      .then(function(data){
        // TODO data assertions
        expect(data).to.be.a("array");
        doneCallback();
      })
      // TODO what if it fails? handle catch!
      ;

    $httpBackend.flush();
  });


  });
}());
