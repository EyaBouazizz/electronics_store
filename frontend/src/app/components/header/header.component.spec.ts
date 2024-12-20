import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../services/authentication/auth.service';
import { CartService } from '../../services/cart/cart.service';
import { TestimonialService } from '../../services/testimonial/testimonial.service';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  let authService: jasmine.SpyObj<AuthService>;
  let cartService: jasmine.SpyObj<CartService>;
  let testimonialService: jasmine.SpyObj<TestimonialService>;
  let toastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['login', 'signup']);
    const cartServiceMock = jasmine.createSpyObj('CartService', ['getCartItems']);
    const testimonialServiceMock = jasmine.createSpyObj('TestimonialService', ['getTestimonials']);
    const toastrServiceMock = jasmine.createSpyObj('ToastrService', ['success']);

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [ReactiveFormsModule, RouterModule.forRoot([]), HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: CartService, useValue: cartServiceMock },
        { provide: TestimonialService, useValue: testimonialServiceMock },
        { provide: ToastrService, useValue: toastrServiceMock },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    testimonialService = TestBed.inject(TestimonialService) as jasmine.SpyObj<TestimonialService>;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;

    fixture.detectChanges();
  });

  it('should create the header component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login and signup forms', () => {
    expect(component.loginForm).toBeTruthy();
    expect(component.signupForm).toBeTruthy();
  });

  it('should load cart count on initialization', () => {
    cartService.getCartItems.and.returnValue(of([{ id: 1 }, { id: 2 }]));
    component.loadCartCount();
    expect(cartService.getCartItems).toHaveBeenCalled();
    expect(component.cartItemCount).toEqual(2);
  });

  it('should handle login success', () => {
    const mockResponse = {
      id: 1,
      token: 'fake-jwt-token',
      username: 'testuser',
      status: 0,
    };
    authService.login.and.returnValue(of(mockResponse));
    spyOn(localStorage, 'setItem');

    component.loginForm.setValue({ username: 'testuser', password: 'password' });
    component.handleLogin();

    expect(authService.login).toHaveBeenCalledWith('testuser', 'password');
    expect(localStorage.setItem).toHaveBeenCalledWith('currentUser', JSON.stringify(mockResponse));
    expect(component.loginError).toBeNull();
  });

  it('should handle login error', () => {
    authService.login.and.returnValue(throwError(() => new Error('Invalid username or password')));
    component.loginForm.setValue({ username: 'testuser', password: 'wrongpassword' });

    component.handleLogin();

    expect(authService.login).toHaveBeenCalledWith('testuser', 'wrongpassword');
    expect(component.loginError).toEqual('Invalid username or password');
  });

  it('should handle signup success', () => {
    authService.signup.and.returnValue(of({}));
    spyOn(window, 'alert');
    component.signupForm.setValue({ username: 'newuser', password: 'password123' });

    component.handleSignup();

    expect(authService.signup).toHaveBeenCalledWith('newuser', 'password123');
    expect(window.alert).toHaveBeenCalledWith('Signup successful! Please log in.');
    expect(component.signupError).toBeNull();
  });

  it('should handle signup error', () => {
    authService.signup.and.returnValue(throwError(() => new Error('Signup failed')));
    component.signupForm.setValue({ username: 'newuser', password: 'password123' });

    component.handleSignup();

    expect(authService.signup).toHaveBeenCalledWith('newuser', 'password123');
    expect(component.signupError).toEqual('Failed to sign up. Try again later.');
  });

  // it('should load testimonials', () => {
  //   const mockTestimonials = [{ id: 1, text: 'Testimonial 1' }, { id: 2, text: 'Testimonial 2' }];
  //   testimonialService.getTestimonials.and.returnValue(of(mockTestimonials));

  //   component.loadTestimonials();

  //   expect(testimonialService.getTestimonials).toHaveBeenCalled();
  //   expect(component.testimonials).toEqual(mockTestimonials);
  // });

  it('should subscribe to cart updates and reload cart count', () => {
    const cartUpdateSubject = cartService.cartUpdated$;
    spyOn(cartUpdateSubject, 'subscribe');

    component.subscribeToCartChanges();

    expect(cartUpdateSubject.subscribe).toHaveBeenCalled();
  });
});
