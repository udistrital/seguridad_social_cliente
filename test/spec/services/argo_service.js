'use strict';

describe('Service: argoService', function () {

  // load the service's module
  beforeEach(module('ssClienteApp'));

  // instantiate service
  var argoService;
  beforeEach(inject(function (_argoService_) {
    argoService = _argoService_;
  }));

  it('should do something', function () {
    expect(!!argoService).toBe(true);
  });

});
