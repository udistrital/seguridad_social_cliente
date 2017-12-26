'use strict';

describe('Controller: VistaPruebaCtrl', function () {

  // load the controller's module
  beforeEach(module('ssClienteApp'));

  var VistaPruebaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VistaPruebaCtrl = $controller('VistaPruebaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(VistaPruebaCtrl.awesomeThings.length).toBe(3);
  });
});
