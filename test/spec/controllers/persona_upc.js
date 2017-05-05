'use strict';

describe('Controller: PersonaUpcCtrl', function () {

  // load the controller's module
  beforeEach(module('ssClienteApp'));

  var PersonaUpcCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PersonaUpcCtrl = $controller('PersonaUpcCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PersonaUpcCtrl.awesomeThings.length).toBe(3);
  });
});
