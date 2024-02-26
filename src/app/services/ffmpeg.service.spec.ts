import { TestBed } from '@angular/core/testing';

import { FfmpegService } from './ffmpeg.service';

describe('FfmpegService', () => {
  let service: FfmpegService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FfmpegService);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });
});
