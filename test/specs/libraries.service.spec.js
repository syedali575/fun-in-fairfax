
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
      .respond(
        {
          "searchResults": {
            "totalHits": 2,
            "hitFeatures": [
              {
                "hitFeatureName": "libraries",
                "hitFeatureCount": 2
              }
            ],
            "results": [
              {
                "index": 1,
                "url": "http://www.fairfaxcounty.gov/FFXGISAPI/v1/retrieve/json/37cd070a-7874-e6c5-533a-a67f5b251cfb",
                "distance": "0",
                "doc": {
                  "uniqueID": "37cd070a-7874-e6c5-533a-a67f5b251cfb",
                  "metadata": {
                    "label": "GEORGE MASON REGIONAL LIBRARY",
                    "last-modified-date": "2013-03-28T17:20:35.612-04:00",
                    "geo-elements": [
                      "point",
                      "38.82741035 -77.186215558"
                    ],
                    "adv-geo": {
                      "geo-elements": []
                    },
                    "feature": "libraries",
                    "legacy_id_list": [
                      {
                        "id-type": "OBJECTID",
                        "id-value": "9"
                      },
                      {
                        "id-type": "POI_ID",
                        "id-value": "2"
                      }
                    ]
                  }
                }
              },
              {
                "index": 2,
                "url": "http://www.fairfaxcounty.gov/FFXGISAPI/v1/retrieve/json/6083efa3-8791-2d18-aeae-f306e9484690",
                "distance": "13394",
                "doc": {
                  "uniqueID": "6083efa3-8791-2d18-aeae-f306e9484690",
                  "metadata": {
                    "label": "SHERWOOD REGIONAL LIBRARY",
                    "last-modified-date": "2013-03-28T17:20:35.612-04:00",
                    "geo-elements": [
                      "point",
                      "38.743484047 -77.0748970619999"
                    ],
                    "adv-geo": {
                      "geo-elements": []
                    },
                    "feature": "libraries",
                    "legacy_id_list": [
                      {
                        "id-type": "OBJECTID",
                        "id-value": "11"
                      },
                      {
                        "id-type": "POI_ID",
                        "id-value": "16"
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
      .whenGET("http://www.fairfaxcounty.gov/FFXGISAPI/v1/retrieve/json/6083efa3-8791-2d18-aeae-f306e9484690")
      .respond({
        "searchResults": {
          "uniqueID": "6083efa3-8791-2d18-aeae-f306e9484690",
          "feature": "libraries",
          "label": "SHERWOOD REGIONAL LIBRARY",
          "Libraries": {
            "OBJECTID": "11",
            "DESCRIPTION": "SHERWOOD REGIONAL LIBRARY",
            "JURISDICTION": "COUNTY OF FAIRFAX",
            "WEB_ADDRESS": "www.fairfaxcounty.gov/library/branches/sh/default.htm",
            "STREET_NUMBER": "2501",
            "STREET_NAME": "SHERWOOD HALL LN",
            "CITY": "ALEXANDRIA",
            "ZIP": "22306",
            "ERC_PHONE": "(703) 765-3645",
            "POI_ID": "16",
            "pointProperty": {
              "Point": {
                "pos": "38.743484047 -77.0748970619999"
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
        expect(data.length).to.equal(2);
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
