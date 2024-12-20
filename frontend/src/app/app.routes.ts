import { provideRouter,Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { TestimonialComponent } from './components/testimonials/testimonials.component';
import { CartComponent } from './components/carts/cart/cart.component';
export const routes: Routes = [
    { path: '', component: ProductsComponent },
    //{ path: 'shop', component: ShopComponent },
    { path: 'testimonial', component: TestimonialComponent },
    { path: 'cart', component: CartComponent },
    //{ path: 'contact', component: ContactComponent },
  ];
