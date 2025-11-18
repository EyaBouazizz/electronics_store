import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

import { TestimonialsComponent } from './testimonials.component';

describe('TestimonialsComponent', () => {
  let component: TestimonialsComponent;
  let fixture: ComponentFixture<TestimonialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimonialsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        // Provide mock ToastrService to avoid "No provider for InjectionToken ToastConfig" error
        { provide: ToastrService, useValue: jasmine.createSpyObj('ToastrService', ['success', 'error', 'info']) },
        // Provide mock ActivatedRoute for routing dependencies
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestimonialsComponent);
    component = fixture.componentInstance;
    
    // Mock jQuery and owlCarousel before detectChanges to prevent errors during ngAfterViewInit
    (window as any).$ = jasmine.createSpy('$').and.returnValue({
      owlCarousel: jasmine.createSpy('owlCarousel'),
    });
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
