import { MenuItem } from "../../interfaces/menu-item.feature";

export const menuData: MenuItem[] = [
    {
        id: 'administrative-management',
        label: 'GESTIÓN ADMINISTRATIVA',
        icon: 'administrative',
        permissions: [],
        children: [],
    },
    {
        id: 'service-management',
        label: 'GESTIÓN DE SERVICIOS',
        icon: 'services',
        route: 'service-management',
        permissions: ['MANAGE CLIENTS', 'MANAGE RATES', 'MANAGE ITEMS'],
        children: [
            {
                id: 'service-management/customers',
                label: 'CLIENTES',
                icon: 'customers',
                route: '/system/receptions/clients',
                permissions: ['MANAGE CLIENTS'],
                children: []
            },
            {
                id: 'service-management/service-items',
                label: 'ITEMS DE SERVICIOS',
                icon: 'service-items',
                route: 'service-items',
                permissions: ['MANAGE RATES', 'MANAGE ITEMS'],
                children: [
                    {
                        id: 'service-management/service-items/rates',
                        label: 'TARIFAS',
                        icon: 'rates',
                        route: '/system/items/rates',
                        permissions: ['MANAGE RATES']
                    },
                    {
                        id: 'service-management/service-items/creation-of-items',
                        label: 'CREACIÓN DE ITEMS',
                        icon: 'items',
                        route: '/system/items/list',
                        permissions: ['MANAGE ITEMS']
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
        children: [],
    },
    {
        id: 'operations',
        label: 'OPERACIONES',
        icon: 'operations',
        route: 'operations',
        permissions: ['MANAGE RECEPTIONS', 'MANAGE DIAGNOSES', 'MANAGE FAILURE MODES'],
        children: [
            {
                id: 'operations/receptions',
                label: 'RECEPCIONES',
                icon: 'receptions',
                route: '/system/receptions/list',
                permissions: ['MANAGE RECEPTIONS'],
                children: []
            },
            {
                id: 'operations/diagnostics',
                label: 'DIAGNÓSTICOS',
                icon: 'diagnostics',
                route: 'diagnostics',
                permissions: ['MANAGE DIAGNOSES', 'MANAGE FAILURE MODES'],
                children: [
                    {
                        id: 'operations/diagnostics/generate-diagnostics',
                        label: 'GENERAR DIAGNÓSTICOS',
                        icon: 'generate-diagnostics',
                        route: '/system/diagnoses/list',
                        permissions: ['MANAGE DIAGNOSES'],
                        children: []
                    },
                    {
                        id: 'operations/diagnostics/failure-modes',
                        label: 'MODOS DE FALLAS',
                        icon: 'failure-modes',
                        route: '/system/diagnoses/failure-modes/list',
                        permissions: ['MANAGE FAILURE MODES'],
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
        route: 'document-management',
        permissions: ['MANAGE RECEPTIONS'],
        children: [
            {
                id: 'document-management/reception-records',
                label: 'REGISTRO DE RECEPCIONES',
                icon: 'reception-records',
                route: '/system/receptions/list',
                permissions: ['MANAGE RECEPTIONS'],
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
        route: '/system/configurations',
        permissions: ['MANAGE CONFIGURATIONS'],
        children: [],
    },
    {
        id: 'create-users',
        label: 'CREAR USUARIOS',
        icon: 'create-users',
        route: '/system/access/users',
        permissions: ['MANAGE USERS'],
        children: [],
    },
    {
        id: 'assign-modules',
        label: 'ASIGNAR MÓDULOS',
        icon: 'assign-modules',
        route: '/system/access/rols',
        permissions: ['MANAGE PROFILES'],
        children: [],
    }
];