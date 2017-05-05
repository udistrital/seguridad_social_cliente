'use strict';

describe('Controller: TipoUpcCtrl', function () {

  // load the controller's module
  beforeEach(module('ssClienteApp'));

  var TipoUpcCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TipoUpcCtrl = $controller('TipoUpcCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TipoUpcCtrl.awesomeThings.length).toBe(3);
  });
});
