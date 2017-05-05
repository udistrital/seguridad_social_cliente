'use strict';

describe('Controller: VerUpcCtrl', function () {

  // load the controller's module
  beforeEach(module('ssClienteApp'));

  var VerUpcCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VerUpcCtrl = $controller('VerUpcCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(VerUpcCtrl.awesomeThings.length).toBe(3);
  });
});
