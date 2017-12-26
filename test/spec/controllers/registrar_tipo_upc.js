'use strict';

describe('Controller: RegistrarTipoUpcCtrl', function () {

  // load the controller's module
  beforeEach(module('ssClienteApp'));

  var RegistrarTipoUpcCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RegistrarTipoUpcCtrl = $controller('RegistrarTipoUpcCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RegistrarTipoUpcCtrl.awesomeThings.length).toBe(3);
  });
});
