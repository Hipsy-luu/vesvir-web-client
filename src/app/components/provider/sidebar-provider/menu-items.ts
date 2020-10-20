import { RouteInfo } from './sidebar-provider.metadata';

export const ROUTES: RouteInfo[] = [
    {
        path: '/dashboard-provider/home',
        title: 'Inicio',
        icon: 'fas fa-home',
        class: '',
        extralink: false,
        submenu: []
    },
    {
        path: '/dashboard-provider/new-product',
        title: 'Nuevo Producto',
        icon: 'fas fa-plus-square',
        class: '',
        extralink: false,
        submenu: []
    },
    {
        path: '/dashboard-provider/products/',
        title: 'Productos',
        icon: 'fas fa-tags',
        class: '',
        extralink: false,
        submenu: [
        ]
    },
    
    {
        path: '/dashboard-provider/orders',
        title: 'Pedidos',
        icon: 'fas fa-box-open',
        class: '',
        extralink: false,
        submenu: []
    },
    {
        path: '/dashboard-provider/account-settings',
        title: 'Ajustes de la Empresa',
        icon: 'ti-settings',
        class: '',
        extralink: false,
        submenu: []
    },
/*     {
        path: '/apps/email',
        title: 'Email',
        icon: 'icon-Mailbox-Empty',
        class: '',
        extralink: false,
        submenu: []
    }, */
];

