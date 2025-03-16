import { Routes } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ProductListComponent } from './components/product-list/product-list.component';

export const routes: Routes = [
  { path: "cart", component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: "products", component: ProductListComponent },
  { path: "**", redirectTo: "products" },
];
