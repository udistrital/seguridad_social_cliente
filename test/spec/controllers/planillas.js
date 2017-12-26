'use strict';

describe('Controller: PlanillasCtrl', function () {

  // load the controller's module
  beforeEach(module('ssClienteApp'));

  var PlanillasCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlanillasCtrl = $controller('PlanillasCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PlanillasCtrl.awesomeThings.length).toBe(3);
  });
});
