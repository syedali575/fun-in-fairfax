// (function() {
//   'use strict';
//
//   var expect = window.chai.expect;
//
//
//   describe("LibraryController", function(){
//     var LibraryController;
//     var mockLibraryService = {};
//
//     beforeEach(module("fairfax"));
//
//     beforeEach(module(function($provide){
//       $provide.value("LibraryService", mockLibraryService);
//     }));
//
//     beforeEach(inject(function($controller, $q){
//
//       mockLibraryService.libraryList = function(){
//         return $q.resolve(
//           [{doc:{metadata:{label: "GEORGE MASON REGIONAL LIBRARY"}}}]
//         );
//       };
//       LibraryController = $controller("LibraryController");
//     }));
//
//
//     it("Should have correct scope variables", function(){
//       expect(LibraryController.libraryData).to.be.an("array");
//       // expect(LibraryController.libraryData.length).to.equal(0);
//       // expect(LibraryController.message).to.be.a("string");
//       // expect(LibraryController.message.length).to.equal(0);
//     });
//
//
//
//
//   });
//
// }());
