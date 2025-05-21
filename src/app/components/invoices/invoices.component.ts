import { Component, OnInit } from '@angular/core';
import { IInvoiceCreate, IInvoice, type, Item } from 'src/app/core/interfaces/iinvoices';
import { IProduct } from 'src/app/core/interfaces/iproducts';
import { InvoicesService } from 'src/app/core/services/invoices.service';
import { ProductsService } from 'src/app/core/services/products.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
})
export class InvoicesComponent implements OnInit {
  invoices: IInvoice[] = [];
  pagedInvoices: IInvoice[] = [];
  products: IProduct[] = [];

  newInvoice: IInvoiceCreate = {
    customerName: '',
    discountPercentage: 0,
    type: type.Sale,
    items: [{ productId: 0, quantity: 1 }]
  };

  subTotal: number = 0;
  discountValue: number = 0;
  total: number = 0;

  text: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  invoiceTypes = type;

  constructor(
    private invoiceService: InvoicesService,
    private productService: ProductsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadInvoices();
    this.loadProducts();
  }

  loadInvoices() {
    this.invoiceService.getAllInvoices().subscribe({
      next: (data) => {
        this.invoices = data;
        this.totalPages = Math.ceil(this.invoices.length / this.pageSize);
        this.currentPage = 1;
        this.setPagedInvoices();
        this.toastr.success('Invoices loaded successfully', 'Success');
      },
      error: (err) => {
        console.error('Error loading invoices:', err);
        this.toastr.error('Failed to load invoices', 'Error');
      }
    });
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.toastr.success('Products loaded successfully', 'Success');
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.toastr.error('Failed to load products', 'Error');
      }
    });
  }

  setPagedInvoices() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedInvoices = this.invoices.slice(start, end);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.setPagedInvoices();
  }

  addItem() {
    this.newInvoice.items.push({ productId: 0, quantity: 1 });
    this.updateTotals();
  }

  removeItem(index: number) {
    this.newInvoice.items.splice(index, 1);
    this.updateTotals();
  }

  updateTotals() {
    this.subTotal = this.newInvoice.items.reduce((acc, item) => {
      const product = this.products.find(p => p.id === item.productId);
      if (!product) return acc;

      const price = this.newInvoice.type === type.Sale ? product.sellingPrice : product.buyingPrice;
      return acc + (item.quantity * price);
    }, 0);

    const percentage = this.newInvoice.discountPercentage || 0;
    this.discountValue = this.subTotal * (percentage / 100);
    this.total = this.subTotal - this.discountValue;
  }

  createInvoice() {
    this.invoiceService.createInvoice(this.newInvoice).subscribe({
      next: () => {
        this.toastr.success('Invoice created successfully', 'Created');
        this.loadInvoices();
        const modal = (window as any).bootstrap?.Modal.getInstance(document.getElementById('createModal')!);
        modal?.hide();
        this.resetForm();
      },
      error: (err) => {
        console.error('Failed to create invoice:', err);
        this.toastr.error('Failed to create invoice', 'Error');
      }
    });
  }

  resetForm() {
    this.newInvoice = {
      customerName: '',
      discountPercentage: 0,
      type: type.Sale,
      items: [{ productId: 0, quantity: 1 }]
    };
    this.subTotal = 0;
    this.discountValue = 0;
    this.total = 0;
  }

  invoiceTypeLabel(invoiceType: type): string {
    return invoiceType === type.Sale ? 'Sale' : 'Purchase';
  }

  onSearch() {
    const query = this.text.trim();

    if (query.length === 0) {
      this.loadInvoices();
      return;
    }

    this.invoiceService.searchInvoices(query).subscribe({
      next: (res) => {
        this.invoices = res;
        this.currentPage = 1;
        this.totalPages = Math.ceil(this.invoices.length / this.pageSize);
        this.setPagedInvoices();
        this.toastr.success('Search completed', 'Done');
      },
      error: (err) => {
        console.error('Search error:', err);
        this.invoices = [];
        this.pagedInvoices = [];
        this.toastr.error('Search failed', 'Error');
      }
    });
  }

  clearSearch(): void {
    this.text = '';
    this.loadInvoices();
  }
}
