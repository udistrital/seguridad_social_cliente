'use strict';

describe('Controller: IbcParafiscalesCtrl', function () {

  // load the controller's module
  beforeEach(module('ssClienteApp'));

  var IbcParafiscalesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    IbcParafiscalesCtrl = $controller('IbcParafiscalesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(IbcParafiscalesCtrl.awesomeThings.length).toBe(3);
  });
});
