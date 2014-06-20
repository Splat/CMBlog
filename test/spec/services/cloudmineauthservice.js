'use strict';

describe('Service: cloudmineAuthService', function () {

  // load the service's module
  beforeEach(module('cmBlogApp'));

  // instantiate service
  var cloudmineAuthService;
  beforeEach(inject(function (_cloudmineAuthService_) {
    cloudmineAuthService = _cloudmineAuthService_;
  }));

  it('should do something', function () {
    expect(!!cloudmineAuthService).toBe(true);
  });

});
