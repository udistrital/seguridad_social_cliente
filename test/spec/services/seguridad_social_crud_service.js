'use strict';

describe('Service: seguridadSocialCrudService', function () {

  // load the service's module
  beforeEach(module('ssClienteApp'));

  // instantiate service
  var seguridadSocialCrudService;
  beforeEach(inject(function (_seguridadSocialCrudService_) {
    seguridadSocialCrudService = _seguridadSocialCrudService_;
  }));

  it('should do something', function () {
    expect(!!seguridadSocialCrudService).toBe(true);
  });

});
