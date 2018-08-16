'use strict';

describe('Directive: buscarProveedor', function () {

  // load the directive's module
  beforeEach(module('ssClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<buscar-proveedor></buscar-proveedor>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the buscarProveedor directive');
  }));
});
