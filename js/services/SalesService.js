/**
 * SERVICIO: SalesService
 * Gestiona la lógica de negocio de ventas
 */

class SalesService {
    constructor(productService) {
        this.sales = [];
        this.productService = productService;
    }
    
    /**
     * Inicializa las ventas desde storage
     */
    init() {
        const stored = StorageService.get(CONFIG.STORAGE_KEY);
        if (stored && stored.ventas) {
            this.sales = stored.ventas.map(v => 
                new Sale(v.fecha, v.productoId, v.producto, v.cantidad, v.precio, v.cliente, v.pago)
            );
        }
    }
    
    /**
     * Registra una nueva venta
     */
    registerSale(sale) {
        const product = this.productService.findById(sale.productoId);
        
        if (!product) {
            return { success: false, message: CONFIG.MESSAGES.ERROR_PRODUCT_NOT_FOUND };
        }
        
        if (sale.cantidad > product.stock) {
            return { success: false, message: CONFIG.MESSAGES.ERROR_INSUFFICIENT_STOCK };
        }
        
        product.updateStock(sale.cantidad);
        this.sales.push(sale);
        this.save();
        
        return { 
            success: true, 
            message: CONFIG.MESSAGES.SALE_REGISTERED,
            product: product
        };
    }
    
    /**
     * Obtiene todas las ventas
     */
    getAll() {
        return this.sales;
    }
    
    /**
     * Elimina una venta
     */
    deleteSale(index) {
        if (index >= 0 && index < this.sales.length) {
            this.sales.splice(index, 1);
            this.save();
            return true;
        }
        return false;
    }
    
    /**
     * Obtiene resumen de ventas por producto
     */
    getSalesByProduct() {
        return this.sales.reduce((acc, sale) => {
            if (!acc[sale.productoId]) {
                acc[sale.productoId] = {
                    nombre: sale.producto,
                    cantidad: 0,
                    ingresos: 0
                };
            }
            acc[sale.productoId].cantidad += sale.cantidad;
            acc[sale.productoId].ingresos += sale.getTotal();
            return acc;
        }, {});
    }
    
    /**
     * Obtiene totales de ventas
     */
    getTotals() {
        return {
            totalVentas: this.sales.reduce((sum, s) => sum + s.getTotal(), 0),
            totalUnidades: this.sales.reduce((sum, s) => sum + s.cantidad, 0),
            ticketPromedio: this.sales.length > 0 
                ? Math.round(this.sales.reduce((sum, s) => sum + s.getTotal(), 0) / this.sales.length)
                : 0
        };
    }
    
    /**
     * Guarda en storage
     */
    save() {
        const data = {
            productos: StorageService.get(CONFIG.STORAGE_KEY)?.productos || [],
            ventas: this.sales.map(v => v.toJSON())
        };
        StorageService.save(CONFIG.STORAGE_KEY, data);
    }
}
