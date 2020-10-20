import { NewProductComponent } from './new-product/new-product.component';

import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { ProductComponent } from './product/product.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderComponent } from './order/order.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';

export const DashboardProviderRoutes: Routes = [
  { path: '', redirectTo: '/dashboard-provider/home', pathMatch: 'full' },
  {
    path: '',
    children: [
      {
        path: 'home',
        component: HomeComponent,
        data: {
          title: 'Bienvenido',
          urls: [
            { title: 'Inicio', url: '/dashboard-provider/home' },
            { title: 'Inicio' }
          ]
        }
      },
      {
        path: 'new-product',
        component: NewProductComponent,
        data: {
          title: 'Añadiendo Nuevo Producto',
          urls: [
            { title: 'Inicio', url: '/dashboard/admin-home' },
            { title: 'Pedidos' }
          ]
        }
      },
      {
        path: 'products',
        component: ProductsComponent,
        data: {
          title: 'Productos',
          urls: [
            { title: 'Inicio', url: '/dashboard/admin-home' },
            { title: 'Pedidos' }
          ]
        }
      },
      {
        path: 'product/:id',
        component: ProductComponent,
        data: {
          title: 'Editando producto',
          urls: [
            { title: 'Inicio', url: '/dashboard-provider/home' },
            { title: 'Producto' }
          ]
        }
      },
      {
        path: 'orders',
        component: OrdersComponent,
        data: {
          title: 'Pedidos',
          urls: [
            { title: 'Inicio', url: '/dashboard/admin-home' },
            { title: 'Pedidos' }
          ]
        }
      },
      {
        path: 'order/:id',
        component: OrderComponent,
        data: {
          title: '',
          urls: [
            { title: 'Inicio', url: '/dashboard/admin-home' },
            { title: 'Pedido' }
          ]
        }
      },
      {
        path: 'account-settings',
        component: AccountSettingsComponent,
        data: {
          title: 'Ajustes de la cuenta',
          urls: [
            { title: 'Inicio', url: '/dashboard/admin-home' },
            { title: 'Ajustes de la cuenta' }
          ]
        }
      },
    ]
  }
];
