'use strict';

describe('Controller: CambioEntidadCtrl', function () {

  // load the controller's module
  beforeEach(module('ssClienteApp'));

  var CambioEntidadCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CambioEntidadCtrl = $controller('CambioEntidadCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CambioEntidadCtrl.awesomeThings.length).toBe(3);
  });
});
