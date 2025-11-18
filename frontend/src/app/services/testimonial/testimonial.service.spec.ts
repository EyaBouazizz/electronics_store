import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestimonialService } from './testimonial.service';

describe('TestimonialService', () => {
  let service: TestimonialService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TestimonialService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TestimonialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
