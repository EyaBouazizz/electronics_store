import { Component , OnInit, PLATFORM_ID, Inject  } from '@angular/core';
import { FormBuilder, FormGroup, Validators , ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../../services/authentication/auth.service';
import { CartService } from '../../services/cart/cart.service';
import { TestimonialService } from '../../services/testimonial/testimonial.service';
import { CommonModule,isPlatformBrowser } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-header',
  imports:[CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  loginForm: FormGroup;
  signupForm: FormGroup;
  loginError: string | null = null;
  signupError: string | null = null;
  currentUser: any = null;
  cartItemCount: number = 0;
  status: number = 0;
  testimonials: any[] = [];

  constructor(private fb: FormBuilder, private authService: AuthService ,private testimonialService: TestimonialService ,private cartService: CartService,@Inject(PLATFORM_ID) private platformId: Object,private toastr: ToastrService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    this.signupForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  
  }
  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId) && typeof document !== 'undefined') {
      const hasToasterShown = localStorage.getItem('toasterShown');
      const userDetails = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (userDetails && !hasToasterShown ) {
        this.status = userDetails.status;
        this.toastr.success('Welcome, ' + userDetails.username + '!', 'Login Successful');
        localStorage.setItem('toasterShown', 'true');
      }
      this.loadCartCount();
      console.log(this.cartItemCount);
      this.subscribeToCartChanges();
      this.loadTestimonials();
      console.log(this.testimonials);      
    }    
  }

  handleLogin(): void {
    const { username, password } = this.loginForm.value;
    localStorage.removeItem('toasterShown');
    this.authService.login(username, password).subscribe(
      (response) => {
        this.loginError = null;
        
        // Save user details to localStorage
        const userDetails = {
          id: response.id,
          token: response.token, 
          username: response.username,
          status: response.status
        };
       
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(userDetails));
        }

        this.authService.currentUserSubject.next(userDetails); 
        window.location.reload();
      },
      (error) => {
        this.loginError = 'Invalid username or password';
        console.error('Login failed:', error);

      }
    );
    
  }
  

  handleSignup(): void {
    const { username, password } = this.signupForm.value;
    this.authService.signup(username, password).subscribe(
      () => {
        this.signupError = null;
        alert('Signup successful! Please log in.');
        window.location.reload();
      },
      (error) => {
        this.signupError = 'Failed to sign up. Try again later.';
      }
    );
  }

  clearErrors(): void {
    this.loginError = null;
    this.signupError = null;
  }

  loadCartCount(): void {
    const userDetails = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (userDetails && userDetails.id) {
      this.cartService.getCartItems(userDetails.id).subscribe(
        (cartItems) => {
          this.cartItemCount = cartItems.length; // Use the length of the cart items list
        },
        (error) => {
          console.error('Failed to load cart items:', error);
          this.cartItemCount = 0; // Reset count on error
        }
      );
    } else {
      this.cartItemCount = 0; // No user logged in
    }
  }
  

  subscribeToCartChanges(): void {
    this.cartService.cartUpdated$.subscribe(() => {
      this.loadCartCount(); // Reload the cart count when notified
    });
  }

  isAdmin(): boolean {
    return this.status === 1;
  }

  loadTestimonials(): void {
    this.testimonialService.getTestimonials().subscribe((data) => {
      this.testimonials = data;
    });
  }

}
