import { MenuItem } from "../../interfaces/menu-item.feature";

export const menuData: MenuItem[] = [
    {
        id: 'administrative-management',
        label: 'GESTIÓN ADMINISTRATIVA',
        icon: 'administrative',
        route: '/main-menu/administrative-management',
        permissions: [],
        children: [],
    },
    {
        id: 'service-management',
        label: 'GESTIÓN DE SERVICIOS',
        icon: 'services',
        route: '/main-menu/service-management',
        permissions: [],
        children: [
            {
                id: 'service-management/customers',
                label: 'CLIENTES',
                icon: 'customers',
                route: '/main-menu/service-management/customers',
                permissions: [],
                children: []
            },
            {
                id: 'service-management/service-items',
                label: 'ITEMS DE SERVICIOS',
                icon: 'service-items',
                route: '/main-menu/service-management/service-items',
                permissions: [],
                children: [
                    {
                        id: 'service-management/service-items/rates',
                        label: 'TARIFAS',
                        icon: 'rates',
                        route: '/main-menu/service-management/service-items/rates',
                        permissions: [],
                        children: []
                    },
                    {
                        id: 'service-management/service-items/creation-of-items',
                        label: 'CREACIÓN DE ITEMS',
                        icon: 'items',
                        route: '/main-menu/service-management/service-items/creation-of-items',
                        permissions: [],
                        children: []
                    },
                ]
            },
            {
                id: 'service-management/quotations',
                label: 'COTIZACIONES',
                icon: 'quotations',
                route: '/main-menu/service-management/quotations',
                permissions: [],
                children: []
            },
        ],
    },
    {
        id: 'inventory-management-and-purchasing',
        label: 'GESTIÓN DE INVENTARIO Y COMPRAS',
        icon: 'inventory',
        route: '/main-menu/inventory-management-and-purchasing',
        permissions: [],
        children: [
            // Agrega aquí los submenús correspondientes
        ],
    },
    {
        id: 'operations',
        label: 'OPERACIONES',
        icon: 'operations',
        route: '/main-menu/operations',
        permissions: [],
        children: [
            {
                id: 'operations/receptions',
                label: 'RECEPCIONES',
                icon: 'receptions',
                route: '/main-menu/operations/receptions',
                permissions: [],
                children: []
            },
            {
                id: 'operations/diagnostics',
                label: 'DIAGNÓSTICOS',
                icon: 'diagnostics',
                route: '/main-menu/operations/diagnostics',
                permissions: [],
                children: [
                    {
                        id: 'operations/diagnostics/generate-diagnostics',
                        label: 'GENERAR DIAGNÓSTICOS',
                        icon: 'generate-diagnostics',
                        route: '/main-menu/operations/diagnostics/generate-diagnostics',
                        permissions: [],
                        children: []
                    },
                    {
                        id: 'operations/diagnostics/failure-modes',
                        label: 'MODOS DE FALLAS',
                        icon: 'failure-modes',
                        route: '/main-menu/operations/diagnostics/failure-modes',
                        permissions: [],
                        children: []
                    },
                ]
            }
        ],
    },
    {
        id: 'equipment-tracking',
        label: 'SEGUIMIENTO DE EQUIPOS',
        icon: 'equipment',
        route: '/main-menu/equipment-tracking',
        permissions: [],
        children: [],
    },
    {
        id: 'document-management',
        label: 'GESTIÓN DOCUMENTAL',
        icon: 'documents',
        route: '/main-menu/document-management',
        permissions: [],
        children: [
            {
                id: 'document-management/reception-records',
                label: 'REGISTRO DE RECEPCIONES',
                icon: 'reception-records',
                route: '/main-menu/document-management/reception-records',
                permissions: [],
                children: []
            },
            {
                id: 'document-management/quotation-records',
                label: 'REGISTRO DE COTIZACIONES',
                icon: 'quotation-records',
                route: '/main-menu/document-management/quotation-records',
                permissions: [],
                children: []
            },
            {
                id: 'document-management/report-records',
                label: 'REGISTRO DE INFORMES',
                icon: 'report-records',
                route: '/main-menu/document-management/report-records',
                permissions: [],
                children: []
            },
            {
                id: 'document-management/delivery-records',
                label: 'REGISTRO DE ENTREGAS',
                icon: 'delivery-records',
                route: '/main-menu/document-management/delivery-records',
                permissions: [],
                children: []
            }
        ],
    },
    {
        id: 'configurations',
        label: 'CONFIGURACIONES',
        icon: 'configurations',
        route: '/main-menu/configurations',
        permissions: [],
        children: [],
    },
];