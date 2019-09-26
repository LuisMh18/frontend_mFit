import { TestBed } from '@angular/core/testing';

import { ObjetivosService } from './objetivos.service';

describe('ObjetivosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ObjetivosService = TestBed.get(ObjetivosService);
    expect(service).toBeTruthy();
  });
});
