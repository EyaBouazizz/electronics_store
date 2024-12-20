import { Component, OnInit, PLATFORM_ID, Inject  } from '@angular/core';
import { CommonModule,isPlatformBrowser } from '@angular/common';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../models/product.model';
import { CartItem } from '../../models/cartItem.model';
import { CartService } from '../../services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-products',
  imports: [CommonModule,RouterModule,ReactiveFormsModule],
  standalone: true,
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  status: number = 0;
  products: Product[] = []; // To store the list of products
  cartItems: CartItem[] = [];
  productForm: FormGroup;
  editproductForm: FormGroup;
  isEditing: boolean = false;
  productToEdit: Product | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalPages: number = 0;

  constructor(
    private productsService: ProductService,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      brand: ['', Validators.required],
      popularity: [0, [Validators.required, Validators.min(0)]],
      numberOfSales: [0, [Validators.required, Validators.min(0)]],
      image: ['', Validators.required],
      availableColors: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
    });
    this.editproductForm = this.fb.group({
      id: [0,Validators.required],
      productName: ['', Validators.required],
      category: ['', Validators.required],
      brand: ['', Validators.required],
      popularity: [0, [Validators.required, Validators.min(0)]],
      numberOfSales: [0, [Validators.required, Validators.min(0)]],
      image: ['', Validators.required],
      availableColors: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }


  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userDetails = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (userDetails ) {
        this.status = userDetails.status;
        console.log('User Status:', this.status);
      } else {
        console.warn('No user is logged in.');
      }
    } else {
      console.warn('localStorage is not available in this environment.');
    }

    this.loadProducts();
  }
  
  // Fetch the products from the backend
  fetchProducts(): void {
    this.productsService.getProducts().subscribe(
      (products: Product[]) => {
        this.products = products; // Assign the response value to the products array
        console.log('Products:', this.products);
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }
  loadProducts(): void {
    this.productsService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
      this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
    });
  }

  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.products.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  fetchProductsByCategory(category: string): void {
    this.productsService.getProductsByCategory(category).subscribe(
      (products) => (this.products = products),
      (error) => console.error(`Error fetching products by category (${category}):`, error)
    );
  }

  addProduct(): void {
    if (this.productForm.invalid) {
      return; // Prevent submission if form is invalid
    }
    const productData = this.productForm.value;
  
    // Add new product
    this.productsService.addProduct(productData).subscribe(
      (response) => {
        this.toastr.success('Product added successfully!', 'Success');
        this.fetchProducts(); // Refresh the product list
        this.productForm.reset(); // Reset the form after adding
        this.router.navigate(['/products']); // Redirect to the products list
      },
      (error) => {
        this.toastr.error('Failed to add product', 'Error');
        console.error('Error adding product:', error);
      }
    );
  }

  editProduct(): void {
  if (this.editproductForm.invalid || !this.productToEdit) {
    return; // Prevent submission if form is invalid or no product selected
  }
  const productData = this.editproductForm.value;
console.log('button clicked');
  // Edit existing product
  this.productsService.updateProduct(this.productToEdit.id, productData).subscribe(
    (updatedProduct) => {
      this.toastr.success('Product updated successfully!', 'Success');
      this.fetchProducts(); // Refresh the product list
      this.editproductForm.reset(); // Reset the form after editing
      this.productToEdit = null; // Clear the productToEdit reference
      window.location.reload();
    },
    (error) => {
      this.toastr.error('Failed to update product', 'Error');
      console.error('Error updating product:', error);
    }
  );
}

  loadProductForEdit(product: any): void {
    this.editproductForm.patchValue({
      id: product.id,
      productName: product.productName,
      category: product.category,
      brand: product.brand,
      popularity: product.popularity,
      numberOfSales: product.numberOfSales,
      image: product.image,
      availableColors: product.availableColors,
      description: product.description,
      date: product.date,
      price: product.price,
    });
  }
  
  clearForm(): void {
    this.productForm.reset(); // Clear the form when the modal is closed
  }
  
  cleareditForm(): void {
    this.productForm.reset(); // Clear the form when the modal is closed
  }

  deleteProduct(id: number): void {
    this.productsService.deleteProduct(id).subscribe(
      () => {
        this.toastr.success('Product deleted successfully!', 'Success');
        this.fetchProducts();
      },
      (error) => {
        this.toastr.error('Failed to delete product', 'Error');
        console.error('Error deleting product:', error);
      }
    );
  }

  loadCart(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userDetails = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
      if (userDetails) {
        const userId = userDetails.id; // Retrieve userId from stored user details
  
    this.cartService.getCart(userId).subscribe(cart => {
      this.cartItems = cart.cartItems;
    
    });
    } else {
      console.warn('User is not logged in. Cannot add to cart.');
    }
  }
}

  addToCart(productId: number, quantity: number): void {
    if (isPlatformBrowser(this.platformId)) {
      const userDetails = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
      if (userDetails) {
        const userId = userDetails.id; // Retrieve userId from stored user details
  
        this.cartService.addItem(userId, productId, quantity).subscribe(() => {
          this.loadCart();
          this.toastr.success('Item Added to cart ', 'Item Added Successfully');
        });
      } else {
        console.warn('User is not logged in. Cannot add to cart.');
      }
    }
  }
  
  isAdmin(): boolean {
    return this.status === 1;
  }
}
