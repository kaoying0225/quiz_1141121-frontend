import { TestBed } from '@angular/core/testing';

import { FillinService } from './fillin.service';

describe('FillinService', () => {
  let service: FillinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FillinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
