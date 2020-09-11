import { TestBed } from '@angular/core/testing';

import { ApiLiveDataService } from './api-live-data.service';

describe('ApiLiveDataService', () => {
  let service: ApiLiveDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiLiveDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
