export interface MenuItem {
    id: string; 
    label: string; 
    permissions?: string[];
    icon?: string; 
    route?: string; 
    children?: MenuItem[];
}
