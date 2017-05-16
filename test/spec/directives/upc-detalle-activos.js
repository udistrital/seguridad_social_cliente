'use strict';

describe('Directive: upcDetalleActivos', function () {

  // load the directive's module
  beforeEach(module('ssClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<upc-detalle-activos></upc-detalle-activos>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the upcDetalleActivos directive');
  }));
});
