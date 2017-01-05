
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
      .whenGET("http://www.fairfaxcounty.gov/FFXGISAPI/v1/search?feature=libraries&format=json&center=12.3456,12.3456&distance=100000")
      .respond({searchResults:{results:[{doc:{metadata:{label: "GEORGE MASON REGIONAL LIBRARY"}}}]}});


      $httpBackend
      .whenGET("views/home.template.html")
      .respond("home template");



    }));

    it("Should retrieve list of libraries, if an object with latitude and longitude is provided as argument", function(doneCallback){
      var result = LibraryService.libraryList({latitude: 12.3456, longitude: 12.3456});

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
        console.log(error);
        doneCallback("There is something wrong");
      });

      $httpBackend.flush();
    });


  });
}());
