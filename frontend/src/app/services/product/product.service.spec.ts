import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController ,provideHttpClientTesting} from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../../models/product.model';
import { provideHttpClient } from '@angular/common/http';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Import HttpClientTestingModule
      providers: [ProductService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // it('should be created', () => {
  //   expect(service).toBeTruthy();
  // });

  it('should retrieve products from the API via GET', () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        productName: 'Laptop',
        category: 'Electronics',
        description: 'High-end',
        price: 1000,
        image: 'laptop.png',
        brand: 'Brand A',              // Add the missing properties
        popularity: 5,
        numberOfSales: 100,
        availableColors: 'Black ,Silver',
        date: '2024-12-12'
    },
    {
        id: 2,
        productName: 'Phone',
        category: 'Electronics',
        description: 'Smartphone',
        price: 700,
        image: 'phone.png',
        brand: 'Brand B',
        popularity: 4,
        numberOfSales: 150,
        availableColors: 'Blue , White',
        date: '2024-12-12'
    }
    ];

    service.getProducts().subscribe((products) => {
        expect(products.length).toBe(2);
        expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne('http://localhost:8090/api/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
});

  afterEach(() => {
    httpMock.verify(); // Ensures that no HTTP requests are pending
  });
});
