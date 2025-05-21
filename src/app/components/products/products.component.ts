import { Component, inject, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IProduct } from 'src/app/core/interfaces/iproducts';
import { ProductsService } from 'src/app/core/services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: IProduct[] = [];
  searchText: string = '';
  selectedProduct: IProduct | null = null;
  showingLowStock: boolean = false;

  currentPage: number = 1;
  itemsPerPage: number = 5;

  private readonly productsService = inject(ProductsService);
  private readonly toastr = inject(ToastrService);

  ngOnInit(): void {
    this.loadProducts();
  }

  get pagedProducts(): IProduct[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.products.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.products.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  loadProducts(): void {
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res;
        this.currentPage = 1;
        this.toastr.success('Products loaded successfully', 'Success');
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.toastr.error('Failed to load products', 'Error');
      },
    });
  }

  createNew(): void {
    this.selectedProduct = null;
  }

  edit(product: IProduct): void {
    this.selectedProduct = { ...product };
  }

  delete(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productsService.deleteProduct(id).subscribe({
        next: () => {
          this.toastr.success('Product deleted successfully', 'Deleted');
          this.loadProducts();
        },
        error: (err) => {
          console.error('Error deleting product', err);
          this.toastr.error('Failed to delete product', 'Error');
        },
      });
    }
  }

  onFormSaved(savedProduct?: IProduct): void {
    this.selectedProduct = null;
    if (savedProduct) {
      const message = savedProduct.id
        ? 'Product updated successfully'
        : 'Product created successfully';
      this.toastr.success(message, 'Saved');
    }
    this.loadProducts();
  }

  searchProducts(query: string): void {
    if (query) {
      this.productsService.searchProducts(query).subscribe({
        next: (res) => {
          this.products = res;
          this.currentPage = 1;
          this.toastr.success('Search completed', 'Success');
        },
        error: (err) => {
          console.error('Error searching products', err);
          this.toastr.error('Failed to search products', 'Error');
        },
      });
    } else {
      this.loadProducts();
    }
  }

  clearSearch(): void {
    this.searchText = '';
    this.loadProducts();
  }

  toggleLowStock(): void {
    this.showingLowStock = !this.showingLowStock;

    if (this.showingLowStock) {
      this.productsService.getLowStockProducts().subscribe({
        next: (res) => {
          this.products = res;
          this.currentPage = 1;
          this.toastr.success('Low stock products loaded', 'Success');
        },
        error: (err) => {
          console.error('Error loading low stock products', err);
          this.toastr.error('Failed to load low stock products', 'Error');
        },
      });
    } else {
      this.loadProducts();
    }
  }
}
