
(function() {
  'use strict';

  var expect = window.chai.expect;


  describe("Able to retrieve list of libraries in my vicinity", function(){
    var LibraryService;
    var $httpBackend;
    var $rootScope;


    beforeEach(module("fairfax"));


    beforeEach(inject(function(_$rootScope_, _$httpBackend_, _LibraryService_){
      LibraryService = _LibraryService_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;



      $httpBackend
      .whenGET("http://www.fairfaxcounty.gov/FFXGISAPI/v1/search?feature=libraries&format=json&center=38.8986131,-77.0319384&distance=100000")
      .respond({searchResults:{libraries:[{doc:{metadata:{label: "GEORGE MASON REGIONAL LIBRARY"}}}]}});

//       .respond({
// searchResults: {
// uniqueID: "37cd070a-7874-e6c5-533a-a67f5b251cfb",
// feature: "libraries",
// label: "GEORGE MASON REGIONAL LIBRARY",
// Libraries: {
// OBJECTID: "9",
// DESCRIPTION: "GEORGE MASON REGIONAL LIBRARY",
// JURISDICTION: "COUNTY OF FAIRFAX",
// WEB_ADDRESS: "www.fairfaxcounty.gov/library/branches/gm/default.htm",
// STREET_NUMBER: "7001",
// STREET_NAME: "LITTLE RIVER TPKE",
// CITY: "ANNANDALE",
// ZIP: "22003",
// ERC_PHONE: "(703) 256-3800",
// POI_ID: "2",
// pointProperty: { Point: { pos: "38.82741035 -77.186215558"}}
// }
// }
// }
// );



      $httpBackend
      .whenGET("views/home.template.html")
      .respond("home template");



    }));

    it("Should retrieve list of libraries, if an object with latitude and longitude is provided as argument", function(doneCallback){
      var result = LibraryService.libraryList({latitude: 38.8986131, longitude: -77.0319384});

      expect(result).to.be.an("object");
      expect(result.then).to.be.a("function");
      expect(result.catch).to.be.a("function");


      result
      .then(function(data){
        console.log(data);
        expect(data).to.be.an("array");
        expect(data[0].doc.metadata.label).to.equal("GEORGE MASON REGIONAL LIBRARY");

        doneCallback();
      })
      .catch(function(error){
        console.log("doneCallback error message",error.message);
        doneCallback("There is something wrong in libraries", error);
      });

      $httpBackend.flush();
    });


  });
}());
