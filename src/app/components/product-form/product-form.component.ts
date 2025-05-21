import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/core/services/products.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      productCode: ['', Validators.required],
      availableQuantity: [0, [Validators.required, Validators.min(0)]],
      buyingPrice: [0, [Validators.required, Validators.min(0)]],
      sellingPrice: [0, [Validators.required, Validators.min(0)]],
      reorderLevel: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.params['id']
      ? Number(this.route.snapshot.params['id'])
      : null;

    if (this.productId) {
      this.isEditMode = true;
      this.productsService.getSpecificProduct(this.productId).subscribe({
        next: (product) => {
          this.productForm.patchValue(product);
          this.toastr.success('Product loaded successfully', 'Success');
        },
        error: (err) => {
          console.error('Error loading product', err);
          this.toastr.error('Failed to load product', 'Error');
        },
      });
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    const formValue = this.productForm.value;

    if (this.isEditMode && this.productId) {
      this.productsService.updateProduct(this.productId, formValue).subscribe({
        next: () => {
          this.toastr.success('Product updated successfully', 'Updated');
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Failed to update product', err);
          this.toastr.error('Failed to update product', 'Error');
        },
      });
    } else {
      this.productsService.createProduct(formValue).subscribe({
        next: () => {
          this.toastr.success('Product created successfully', 'Created');
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Failed to create product', err);
          this.toastr.error('Failed to create product', 'Error');
        },
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }
}
