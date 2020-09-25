import { CategorysComponent } from './admin/categorys/categorys.component';
import { AccountSettingsComponent } from './admin/account-settings/account-settings.component';
import { ReviewsComponent } from './admin/reviews/reviews.component';
import { ProvidersComponent } from './admin/providers/providers.component';
import { CartsComponent } from './admin/carts/carts.component';
import { OrdersComponent } from './admin/orders/orders.component';
import { ProductsComponent } from './admin/products/products.component';
import { Routes } from '@angular/router';

import { HomeComponent } from './admin/home/home.component';
import { MessagesComponent } from './admin/messages/messages.component';
import { CustomersComponent } from './admin/customers/customers.component';
import { ProductComponent } from './admin/product/product.component';
import { CustomerComponent } from './admin/customer/customer.component';
import { ProviderComponent } from './admin/provider/provider.component';
import { OrderComponent } from './admin/order/order.component';

export const DashboardRoutes: Routes = [
  { path: '', redirectTo: '/dashboard/admin/home', pathMatch: 'full' },
  { 
    path: '', 
    children: [
      /* {
        path: 'home',
        component: HomeComponent,
        data: {
          title: 'Inicio',
          urls: [
            { title: 'Inicio', url: '/dashboard' },
            { title: 'Inicio' }
          ]
        }
      }, */
    ]
  },
  {
    path: 'admin',
    children: [
      {
        path: 'home',
        component: HomeComponent,
        data: {
          title: 'Inicio',
          urls: [
            { title: 'Inicio', url: '/dashboard/admin/home' },
            { title: 'Inicio' }
          ]
        }
      },
      {
        path: 'messages',
        component: MessagesComponent,
        data: {
          title: 'Mensajes',
          urls: [
            { title: 'Inicio', url: '/dashboard/admin/home' },
            { title: 'Mensajes' }
          ]
        }
      },
      {
        
        path: 'products',
        children: [
          {
            path: 'reviews',
            component: ReviewsComponent,
            data: {
              title: 'Reseñas',
              urls: [
                { title: 'Inicio', url: '/dashboard/admin/home' },
                { title: 'Reseñas' }
              ]
            }
          },
          {
            path: 'categorys',
            component: CategorysComponent,
            data: {
              title: 'Categorías',
              urls: [
                { title: 'Inicio', url: '/dashboard/admin/home' },
                { title: 'Categorías' }
              ]
            }
          },
          
        ]
        
      },
      {
        path: 'categorys',
        children: [
          {
            path: 'mens/:idcategory',
            component: ProductsComponent,
            data: {
              title: 'Hombres',
              urls: [
                { title: 'Inicio', url: '/dashboard/admin/home' },
                { title: 'Hombres' }
              ]
            }
          },
          {
            path: 'womens/:idcategory',
            component: ProductsComponent,
            data: {
              title: 'Mujeres',
              urls: [
                { title: 'Inicio', url: '/dashboard/admin/home' },
                { title: 'Mujeres' }
              ]
            }
          },
          {
            path: 'boys/:idcategory',
            component: ProductsComponent,
            data: {
              title: 'Niños',
              urls: [
                { title: 'Inicio', url: '/dashboard/admin/home' },
                { title: 'Niños' }
              ]
            }
          },
          {
            path: 'girls/:idcategory',
            component: ProductsComponent,
            data: {
              title: 'Niñas',
              urls: [
                { title: 'Inicio', url: '/dashboard/admin/home' },
                { title: 'Niñas' }
              ]
            }
          },
          {
            path: 'product/:id',
            component: ProductComponent,
            data: {
              title: 'Producto',
              urls: [
                { title: 'Inicio', url: '/dashboard/admin/home' },
                { title: 'Producto' }
              ]
            }
          },
        ]
      },
      {
        path: 'customers',
        children: [
          {
            path: 'customers',
            component: CustomersComponent,
            data: {
              title: 'Clientes',
              urls: [
                { title: 'Inicio', url: '/dashboard/admin/home' },
                { title: 'Clientes' }
              ]
            }
          },
          {
            path: 'customer/:id',
            component: CustomerComponent,
            data: {
              title: 'Edición de Cliente',
              urls: [
                { title: 'Inicio', url: '/dashboard/admin/home' },
                { title: 'Clientes' }
              ]
            }
          },
          {
            path: 'carts',
            component: CartsComponent,
            data: {
              title: 'Carritos',
              urls: [
                { title: 'Inicio', url: '/dashboard/admin/home' },
                { title: 'Carritos' }
              ]
            }
          },
        ]
      },
      {
        path: 'orders',
        component: OrdersComponent,
        data: {
          title: 'Pedidos',
          urls: [
            { title: 'Inicio', url: '/dashboard/admin/home' },
            { title: 'Pedidos' }
          ]
        }
      },
      {
        path: 'order/:id',
        component: OrderComponent,
        data: {
          title: 'Pedido',
          urls: [
            { title: 'Inicio', url: '/dashboard/admin/home' },
            { title: 'Pedido' }
          ]
        }
      },
      {
        path: 'providers',
        component: ProvidersComponent,
        data: {
          title: 'Proveedores',
          urls: [
            { title: 'Inicio', url: '/dashboard/admin/home' },
            { title: 'Proveedores' }
          ]
        }
      },
      {
        path: 'provider/:id',
        component: ProviderComponent,
        data: {
          title: 'Proveedor',
          urls: [
            { title: 'Inicio', url: '/dashboard/admin/home' },
            { title: 'Proveedores' }
          ]
        }
      },
      {
        path: 'account-settings',
        component: AccountSettingsComponent,
        data: {
          title: 'Ajustes de la cuenta',
          urls: [
            { title: 'Inicio', url: '/dashboard/admin/home' },
            { title: 'Ajustes de la cuenta' }
          ]
        }
      },
    ]
  }
];
