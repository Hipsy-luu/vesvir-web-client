import { RouteInfo } from './sidebar-admin.metadata';

export const ADMINMENU: RouteInfo[] = [
    {
        path: '/dashboard-admin/home',
        title: 'Inicio',
        icon: 'fas fa-home',
        class: '',
        extralink: false,
        submenu: []
    },
    {
        path: '/dashboard-admin/products/product',
        title: 'Administrador',
        icon: 'fas fa-clipboard-list',
        class: 'has-arrow',
        extralink: false,
        submenu: [
            {
                path: '/dashboard-admin/products/reviews',
                title: 'Reseñas',
                icon: 'fas fa-comments',
                class: '',
                extralink: false,
                submenu: []
            },
            {
                path: '/dashboard-admin/providers',
                title: 'Proveedores',
                icon: 'ti-id-badge',
                class: '',
                extralink: false,
                submenu: []
            },
            {
                path: '/dashboard-admin/customers/customers',
                title: 'Clientes',
                icon: 'fas fa-users',
                class: '',
                extralink: false,
                submenu: []
            },
            {
                path: '/dashboard-admin/products/categories',
                title: 'Categorías',
                icon: 'fas fa-sitemap',
                class: '',
                extralink: false,
                submenu: []
            },
            {
                path: '/dashboard-admin/products/brands',
                title: 'Marcas',
                icon: 'fas fa-trademark',
                class: '',
                extralink: false,
                submenu: []
            },
            /* {
                path: '/dashboard-admin/products/categorys',
                title: 'Métodos de Envió',
                icon: 'icon-Car-Wheel',
                class: '',
                extralink: false,
                submenu: []
            }, */
        ]
    },
    {
        path: '/dashboard-admin/categorys/',
        title: 'Productos',
        icon: 'fas fa-tags',
        class: 'has-arrow',
        extralink: false,
        submenu: [
            {
                path: '/dashboard-admin/categorys/mens',
                title: 'Hombres',
                icon: 'fas fa-male',
                class: 'padding-submenu has-arrow',
                extralink: false,
                submenu: []
            },
            {
                path: '/dashboard-admin/categorys/womens',
                title: 'Mujeres',
                icon: 'fas fa-female',
                class: 'padding-submenu has-arrow',
                extralink: false,
                submenu: []
            },
            {
                path: '/dashboard-admin/categorys/boys',
                title: 'Niños',
                icon: 'fas fa-child',
                class: 'padding-submenu has-arrow',
                extralink: false,
                submenu: []
            },
            {
                path: '/dashboard-admin/categorys/girls',
                title: 'Niñas',
                icon: 'fas fa-child',
                class: 'padding-submenu has-arrow',
                extralink: false,
                submenu: []
            },
        ]
    },
    
    {
        path: '/dashboard-admin/orders',
        title: 'Pedidos',
        icon: 'ti-ticket',
        class: '',
        extralink: false,
        submenu: []
    },
    {
        path: '/dashboard-admin/account-settings',
        title: 'Ajustes de la cuenta',
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
