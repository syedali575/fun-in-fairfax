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

    it("Should retrieve list of parks, if an object with latitude and longitude is provided as argument", function(doneCallback){
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
          // console.log("In .then of my no argument test",data);
          doneCallback("This should not happen");
        })
        .catch(function(error){
          // console.log("In my .catch of no argument test");
          expect(error).to.be.an.instanceof(Error);
          expect(error.message).to.equal("You must provide an object with latitude and longitude properties");

          doneCallback();
      });

      $rootScope.$digest();
    });




    it("Should provide an error message if incorrect argument is provided", function(doneCallback){
      var result = ParkService.parkList("apples");

      expect(result).to.be.a("object");
      expect(result.then).to.be.a("function");
      expect(result.catch).to.be.a("function");

      result
      .then(function(data){
        console.log("In my .then of wrong argument test3", data);
        doneCallback();
      })
      .catch(function(error){
        console.log("In my .catch of wrong argument test3", error);
        expect(error).to.be.an.instanceof(Error);
        expect(error.message).to.equal("You must provide an object with latitude and longitude properties");


        doneCallback();
      });

      $rootScope.$digest();
    });





  });
}());
