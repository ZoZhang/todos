import { TestBed, inject } from '@angular/core/testing';

import { Hotkeys } from './hotkeys.service';

describe('TodoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Hotkeys]
    });
  });

  it('should be created', inject([Hotkeys], (service: Hotkeys) => {
    expect(service).toBeTruthy();
  }));
});
