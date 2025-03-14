import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProductListComponent } from './components/product-list/product-list.component';


@NgModule({
  declarations: [CartComponent, NavbarComponent, ProductListComponent],
  imports: [CommonModule, FormsModule, RouterModule],
  exports: [NavbarComponent, RouterModule]
})
export class AppModule { }
