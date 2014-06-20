'use strict';

describe('Service: Cloudmineservice', function () {

  // load the service's module
  beforeEach(module('cmBlogApp'));

  // instantiate service
  var Cloudmineservice;
  beforeEach(inject(function (_Cloudmineservice_) {
    Cloudmineservice = _Cloudmineservice_;
  }));

  it('should do something', function () {
    expect(!!Cloudmineservice).toBe(true);
  });

});
