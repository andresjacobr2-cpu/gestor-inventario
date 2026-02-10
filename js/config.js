/**
 * CONFIGURACIÓN GLOBAL DEL PROYECTO
 * Centraliza todas las constantes y configuraciones
 */

const CONFIG = {
    // Claves de localStorage
    STORAGE_KEY: 'gestorInventario',
    
    // Mensajes
    MESSAGES: {
        PRODUCT_ADDED: 'Producto agregado exitosamente',
        PRODUCT_DELETED: 'Producto eliminado',
        SALE_REGISTERED: 'Venta registrada correctamente',
        SALE_DELETED: 'Venta eliminada',
        ERROR_DUPLICATE_ID: 'El ID del producto ya existe',
        ERROR_INSUFFICIENT_STOCK: 'Stock insuficiente',
        ERROR_PRODUCT_NOT_FOUND: 'Producto no encontrado',
    },
    
    // Valores por defecto
    DEFAULTS: {
        MIN_STOCK_ALERT: 5,
    },
    
    // Elementos del DOM
    SELECTORS: {
        TABS_CONTAINER: '#mainTabs',
        MAIN_TABS_BUTTONS: '.tabs__button',
        TAB_CONTENTS: '.content',
        
        // Productos
        PRODUCT_FORM: '#productForm',
        PRODUCT_TABLE: '#bodyProductos',
        SALES_SELECT: '#ventaProducto',
        
        // Ventas
        SALES_FORM: '#salesForm',
        SALES_TABLE: '#bodyVentas',
        SALES_PRICE_INPUT: '#ventaPrecio',
        
        // Análisis
        STATS_GRID: '#statsGrid',
        BEST_SELLERS_TABLE: '#bodyMasVendidos',
        CATEGORIES_TABLE: '#bodyCategorias',
        ALERT_CONTAINER: '#alertaStock',
        EXPORT_BTN: '#exportBtn',
    }
};

Object.freeze(CONFIG);
