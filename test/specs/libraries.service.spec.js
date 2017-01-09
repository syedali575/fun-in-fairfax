
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
      .whenGET("http://www.fairfaxcounty.gov/FFXGISAPI/v1/search?feature=libraries&format=json&center=38.82741035,-77.186215558&distance=100000")
      // .respond({searchResults:{results:[{
      //   url: "http://www.fairfaxcounty.gov/FFXGISAPI/v1/retrieve/json/37cd070a-7874-e6c5-533a-a67f5b251cfb",
      //   doc:{metadata:{label: "GEORGE MASON REGIONAL LIBRARY"}}}]}});

      .respond(
        {
          searchResults: {
            totalHits: 1,
            hitFeatures: [
              {
                hitFeatureName: "libraries",
                hitFeatureCount: 1
              }
            ],
            results: [
              {
                index: 1,
                url: "http://www.fairfaxcounty.gov/FFXGISAPI/v1/retrieve/json/37cd070a-7874-e6c5-533a-a67f5b251cfb",
                distance: "0",
                doc: {
                  uniqueID: "37cd070a-7874-e6c5-533a-a67f5b251cfb",
                  metadata: {
                    label: "GEORGE MASON REGIONAL LIBRARY",
                    last_modified_date: "2013-03-28T17:20:35.612-04:00",
                    geo_elements: [
                      "point",
                      "38.82741035 -77.186215558"
                    ],
                    adv_geo: {
                      geo_elements: []
                    },
                    feature: "libraries",
                    legacy_id_list: [
                      {
                        id_type: "OBJECTID",
                        id_value: "9"
                      },
                      {
                        id_type: "POI_ID",
                        id_value: "2"
                      }
                    ]
                  }
                }
              }
            ]
          }
        }
      );

      $httpBackend
      .whenGET("http://www.fairfaxcounty.gov/FFXGISAPI/v1/retrieve/json/37cd070a-7874-e6c5-533a-a67f5b251cfb")
      .respond({
        "searchResults": {
          "uniqueID": "37cd070a-7874-e6c5-533a-a67f5b251cfb",
          "feature": "libraries",
          "label": "GEORGE MASON REGIONAL LIBRARY",
          "Libraries": {
            "OBJECTID": "9",
            "DESCRIPTION": "GEORGE MASON REGIONAL LIBRARY",
            "JURISDICTION": "COUNTY OF FAIRFAX",
            "WEB_ADDRESS": "www.fairfaxcounty.gov/library/branches/gm/default.htm",
            "STREET_NUMBER": "7001",
            "STREET_NAME": "LITTLE RIVER TPKE",
            "CITY": "ANNANDALE",
            "ZIP": "22003",
            "ERC_PHONE": "(703) 256-3800",
            "POI_ID": "2",
            "pointProperty": {
              "Point": {
                "pos": "38.82741035 -77.186215558"
              }
            }
          }
        }
      });



      $httpBackend
      .whenGET("views/home.template.html")
      .respond("home template");



    }));


    it("Should retrieve list of libraries, if an object with latitude and longitude is provided as argument", function(doneCallback){
      var result = LibraryService.libraryList({latitude: 38.82741035, longitude: -77.186215558});

      expect(result).to.be.an("object");
      expect(result.then).to.be.a("function");
      expect(result.catch).to.be.a("function");


      result
      .then(function(data){
        console.log("I am here bro",data);
        expect(data).to.be.an("array");
        // expect(data.length).to.equal(2);
        expect(data[0].searchResults.label).to.equal("GEORGE MASON REGIONAL LIBRARY");

        doneCallback();
      })
      .catch(function(error){
        console.log("doneCallback error message",error.message);
        doneCallback("There is something wrong in libraries", error.message);
      });

      $httpBackend.flush();
    });


  });
}());
