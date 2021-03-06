import { BrandsComponent } from './brands/brands.component';
import { CategorysComponent } from './categorys/categorys.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { ProvidersComponent } from './providers/providers.component';
import { OrdersComponent } from './orders/orders.component';
import { ProductsComponent } from './products/products.component';
import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { CustomersComponent } from './customers/customers.component';
import { ProductComponent } from './product/product.component';
import { CustomerComponent } from './customer/customer.component';
import { ProviderComponent } from './provider/provider.component';
import { OrderComponent } from './order/order.component';

export const DashboardAdminRoutes: Routes = [
  { path: '', redirectTo: '/dashboard-admin/home', pathMatch: 'full' },
  {
    path: '',
    children: [
      {
        path: 'home',
        component: HomeComponent,
        data: {
          title: 'Inicio',
          urls: [
            { title: 'Inicio', url: '/dashboard-admin/home' },
            { title: 'Inicio' }
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
                { title: 'Inicio', url: '/dashboard-admin/home' },
                { title: 'Reseñas' }
              ]
            }
          },
          {
            path: 'categories',
            component: CategorysComponent,
            data: {
              title: 'Categorías',
              urls: [
                { title: 'Inicio', url: '/dashboard-admin/home' },
                { title: 'Categorías' }
              ]
            }
          },
          {
            path: 'brands',
            component: BrandsComponent,
            data: {
              title: 'Marcas',
              urls: [
                { title: 'Inicio', url: '/dashboard-admin/home' },
                { title: 'Marcas' }
              ]
            }
          },
        ]
        
      },
      {
        path: 'product/:idProduct',
        component: ProductComponent,
        data: {
          title: 'Editando Producto',
          urls: [
            { title: 'Inicio', url: '/dashboard-admin/home' },
            { title: 'Producto' }
          ]
        }
      },
      {
        path: 'categorys',
        children: [
          {
            path: ':genre/:idCategory',
            component: ProductsComponent,
            data: {
              title: 'Hombres',
              urls: [
                { title: 'Inicio', url: '/dashboard-admin/home' },
                { title: 'Hombres' }
              ]
            }
          },
          {
            path: 'womens/:idCategory',
            component: ProductsComponent,
            data: {
              title: 'Mujeres',
              urls: [
                { title: 'Inicio', url: '/dashboard-admin/home' },
                { title: 'Mujeres' }
              ]
            }
          },
          {
            path: 'boys/:idCategory',
            component: ProductsComponent,
            data: {
              title: 'Niños',
              urls: [
                { title: 'Inicio', url: '/dashboard-admin/home' },
                { title: 'Niños' }
              ]
            }
          },
          {
            path: 'girls/:idCategory',
            component: ProductsComponent,
            data: {
              title: 'Niñas',
              urls: [
                { title: 'Inicio', url: '/dashboard-admin/home' },
                { title: 'Niñas' }
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
                { title: 'Inicio', url: '/dashboard-admin/home' },
                { title: 'Clientes' }
              ]
            }
          },
          {
            path: 'customer/:idCustomer',
            component: CustomerComponent,
            data: {
              title: 'Edición de Cliente',
              urls: [
                { title: 'Inicio', url: '/dashboard-admin/home' },
                { title: 'Clientes' }
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
            { title: 'Inicio', url: '/dashboard/admin-home' },
            { title: 'Pedidos' }
          ]
        }
      },
      {
        path: 'order/:idOrder',
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
        path: 'providers',
        component: ProvidersComponent,
        data: {
          title: 'Proveedores',
          urls: [
            { title: 'Inicio', url: '/dashboard/admin-home' },
            { title: 'Proveedores' }
          ]
        }
      },
      {
        path: 'provider/:idProvider',
        component: ProviderComponent,
        data: {
          title: 'Proveedor',
          urls: [
            { title: 'Inicio', url: '/dashboard/admin-home' },
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
            { title: 'Inicio', url: '/dashboard/admin-home' },
            { title: 'Ajustes de la cuenta' }
          ]
        }
      },
    ]
  }
];
