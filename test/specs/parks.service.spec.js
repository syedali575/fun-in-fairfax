(function() {
  'use strict';

  var expect = window.chai.expect;


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
      .respond({searchResults:{results:[{doc:{metadata:{label: "SKYLINE"}}}]}});


      $httpBackend
      .whenGET("views/home.template.html")
      .respond("home template");

    }));

    it("Should retrieve list of parks", function(doneCallback){
      var result = ParkService.parkList({latitude: 12.3456, longitude: 12.3456});

      expect(result).to.be.an("object");
      expect(result.then).to.be.a("function");
      expect(result.catch).to.be.a("function");

      result
      .then(function(data){
        expect(data).to.be.a("array");
        expect(data[0].doc.metadata.label).to.equal("SKYLINE");

        doneCallback();
      })
      .catch(function(error){
        console.log(error);
        doneCallback("There is something wrong");
      });

      $httpBackend.flush();
    });




    it("Should provide an error message if no arguments are provided", function(doneCallback){
      var result = ParkService.parkList();

      expect(result).to.be.a("object");
      expect(result.then).to.be.a("function");
      expect(result.catch).to.be.a("function");

      result
      .then(function(data){
        console.log(data);
        doneCallback();
      })
        .catch(function(error){
          expect(error).to.be.a("string");
          expect(error).to.equal("You must provide an object with latitude and longitude properties");

          doneCallback();

      });

        
    });




    // it("Should give an error message if wrong argument is provided", function(){
    //   var result = ParkService.parkList([1,2,3]);
    //
    //
    //
    //   result
    //   .catch();
    // });


    // it('right args');
    // it('wrong args');


  });
}());
