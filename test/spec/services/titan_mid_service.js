'use strict';

describe('Service: titanMidService', function () {

  // load the service's module
  beforeEach(module('ssClienteApp'));

  // instantiate service
  var titanMidService;
  beforeEach(inject(function (_titanMidService_) {
    titanMidService = _titanMidService_;
  }));

  it('should do something', function () {
    expect(!!titanMidService).toBe(true);
  });

});
