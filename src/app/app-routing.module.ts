import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { InvoicesComponent } from './components/invoices/invoices.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { NotFoundComponent } from './components/not-found/not-found.component';


const routes: Routes = [
    { path: '', component: ProductsComponent },
    { path: 'invoices', component: InvoicesComponent },
    { path: 'productForm', component: ProductFormComponent },
    { path: 'productForm/:id', component: ProductFormComponent },
    {path: '**', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
