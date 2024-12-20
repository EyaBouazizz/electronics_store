import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestimonialService } from './testimonial.service';

describe('TestimonialService', () => {
  let service: TestimonialService;
  let httpMock: HttpTestingController; 
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Import HttpClientTestingModule
      providers: [TestimonialService] 
    });
    service = TestBed.inject(TestimonialService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify(); // Ensures that no HTTP requests are pending
  });
});
