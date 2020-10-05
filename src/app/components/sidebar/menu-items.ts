import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
    {
        path: '/dashboard/admin/home',
        title: 'Inicio',
        icon: 'icon-Car-Wheel',
        class: '',
        extralink: false,
        submenu: []
    },
    /* {
        path: '/dashboard/admin/messages',
        title: 'Mensajes',
        icon: 'icon-Car-Wheel',
        class: '',
        extralink: false,
        submenu: []
    }, */
    {
        path: '/dashboard/admin/products/product',
        title: 'Administrador',
        icon: 'icon-Car-Wheel',
        class: 'has-arrow',
        extralink: false,
        submenu: [
            {
                path: '/dashboard/admin/products/reviews',
                title: 'Reseñas',
                icon: 'icon-Car-Wheel ',
                class: 'fas fa-search-minus ma-l-40',
                extralink: false,
                submenu: []
            },
            {
                path: '/dashboard/admin/providers',
                title: 'Proveedores',
                icon: 'icon-Car-Wheel',
                class: '',
                extralink: false,
                submenu: []
            },
            {
                path: '/dashboard/admin/customers/customers',
                title: 'Clientes',
                icon: 'icon-Car-Wheel',
                class: '',
                extralink: false,
                submenu: []
            },
            {
                path: '/dashboard/admin/products/categorys',
                title: 'Categorías',
                icon: 'icon-Car-Wheel',
                class: '',
                extralink: false,
                submenu: []
            },
            {
                path: '/dashboard/admin/products/categorys',
                title: 'Métodos de Envió',
                icon: 'icon-Car-Wheel',
                class: '',
                extralink: false,
                submenu: []
            },
        ]
    },
    {
        path: '/dashboard/admin/categorys/',
        title: 'Productos',
        icon: 'icon-Car-Wheel',
        class: 'has-arrow',
        extralink: false,
        submenu: [
            {
                path: '/dashboard/admin/categorys/mens',
                title: 'Hombres',
                icon: 'icon-Car-Wheel',
                class: 'padding-submenu has-arrow',
                extralink: false,
                submenu: [
                    {
                        path: '/dashboard/admin/categorys/mens/0',
                        title: 'Vestir (etiqueta)',
                        icon: '',
                        class: 'padding-submenu',
                        extralink: false,
                        submenu: []
                    },{
                        path: '/dashboard/admin/categorys/mens/1',
                        title: 'Playeras / Blusas',
                        icon: '',
                        class: 'padding-submenu',
                        extralink: false,
                        submenu: []
                    },]
            },
            {
                path: '/dashboard/admin/categorys/womens',
                title: 'Mujeres',
                icon: 'icon-Car-Wheel',
                class: 'padding-submenu has-arrow',
                extralink: false,
                submenu: [
                    {
                        path: '/dashboard/admin/categorys/womens/0',
                        title: 'Shorts',
                        icon: '',
                        class: 'padding-submenu',
                        extralink: false,
                        submenu: []
                    },
                    {
                        path: '/dashboard/admin/categorys/womens/0',
                        title: 'Calzado',
                        icon: '',
                        class: 'padding-submenu',
                        extralink: false,
                        submenu: []
                    },
                    {
                        path: '/dashboard/admin/categorys/womens/0',
                        title: 'Accesorios',
                        icon: '',
                        class: 'padding-submenu',
                        extralink: false,
                        submenu: []
                    },]
            },
            {
                path: '/dashboard/admin/categorys/boys',
                title: 'Niños',
                icon: 'icon-Car-Wheel',
                class: 'padding-submenu has-arrow',
                extralink: false,
                submenu: [
                    {
                        path: '/dashboard/admin/categorys/boys/0',
                        title: 'Vestir (etiqueta)',
                        icon: '',
                        class: 'padding-submenu',
                        extralink: false,
                        submenu: []
                    },
                    {
                        path: '/dashboard/admin/categorys/boys/0',
                        title: 'Playeras / Blusas',
                        icon: '',
                        class: 'padding-submenu',
                        extralink: false,
                        submenu: []
                    },]
            },
            {
                path: '/dashboard/admin/categorys/girls',
                title: 'Niñas',
                icon: 'icon-Car-Wheel',
                class: 'padding-submenu has-arrow',
                extralink: false,
                submenu: [
                    {
                        path: '/dashboard/admin/categorys/girls/0',
                        title: 'Vestir (etiqueta)',
                        icon: '',
                        class: 'padding-submenu',
                        extralink: false,
                        submenu: []
                    },{
                        path: '/dashboard/admin/categorys/girls/0',
                        title: 'Playeras / Blusas',
                        icon: '',
                        class: 'padding-submenu',
                        extralink: false,
                        submenu: []
                    },{
                        path: '/dashboard/admin/categorys/girls/0',
                        title: 'Vestir (etiqueta)',
                        icon: '',
                        class: 'padding-submenu',
                        extralink: false,
                        submenu: []
                    },
                    {
                        path: '/dashboard/admin/categorys/girls/0',
                        title: 'Playeras / Blusas',
                        icon: '',
                        class: 'padding-submenu',
                        extralink: false,
                        submenu: []
                    },
                    {
                        path: '/dashboard/admin/categorys/girls/0',
                        title: 'Pantalones',
                        icon: '',
                        class: 'padding-submenu',
                        extralink: false,
                        submenu: []
                    },]
            },
        ]
    },
    
    {
        path: '/dashboard/admin/orders',
        title: 'Pedidos',
        icon: 'icon-Car-Wheel',
        class: '',
        extralink: false,
        submenu: []
    },
    {
        path: '/dashboard/admin/account-settings',
        title: 'Ajustes de la cuenta',
        icon: 'icon-Car-Wheel',
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
