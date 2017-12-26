'use strict';

describe('Controller: VerIncapacidadesCtrl', function () {

  // load the controller's module
  beforeEach(module('ssClienteApp'));

  var VerIncapacidadesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VerIncapacidadesCtrl = $controller('VerIncapacidadesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(VerIncapacidadesCtrl.awesomeThings.length).toBe(3);
  });
});
