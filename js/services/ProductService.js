/**
 * SERVICIO: ProductService
 * Gestiona la lógica de negocio de productos
 */

class ProductService {
    constructor() {
        this.products = [];
    }
    
    /**
     * Inicializa los productos desde storage o con datos por defecto
     */
    init() {
        const stored = StorageService.get(CONFIG.STORAGE_KEY);
        if (stored && stored.productos) {
            this.products = stored.productos.map(p => 
                new Product(p.id, p.nombre, p.categoria, p.stock, p.costo, p.venta, p.minimo)
            );
        } else {
            this.products = this.getDefaultProducts();
        }
    }
    
    /**
     * Obtiene productos por defecto
     */
    getDefaultProducts() {
        return [
            new Product('001', 'Producto A', 'Categoría 1', 50, 5000, 8000, 10),
            new Product('002', 'Producto B', 'Categoría 1', 30, 8000, 12000, 15),
            new Product('003', 'Producto C', 'Categoría 2', 45, 3000, 5500, 20),
            new Product('004', 'Producto D', 'Categoría 2', 22, 6000, 9500, 10),
            new Product('005', 'Producto E', 'Categoría 3', 15, 10000, 15000, 5),
        ];
    }
    
    /**
     * Añade un nuevo producto
     */
    addProduct(product) {
        if (this.findById(product.id)) {
            return { success: false, message: CONFIG.MESSAGES.ERROR_DUPLICATE_ID };
        }
        this.products.push(product);
        this.save();
        return { success: true, message: CONFIG.MESSAGES.PRODUCT_ADDED };
    }
    
    /**
     * Busca producto por ID
     */
    findById(id) {
        return this.products.find(p => p.id === id);
    }
    
    /**
     * Elimina un producto
     */
    deleteProduct(id) {
        const index = this.products.findIndex(p => p.id === id);
        if (index > -1) {
            this.products.splice(index, 1);
            this.save();
            return true;
        }
        return false;
    }
    
    /**
     * Obtiene todos los productos
     */
    getAll() {
        return this.products;
    }
    
    /**
     * Obtiene productos con stock bajo
     */
    getLowStockProducts() {
        return this.products.filter(p => p.isLowStock());
    }
    
    /**
     * Obtiene productos agrupados por categoría
     */
    getGroupedByCategory() {
        return this.products.reduce((acc, product) => {
            if (!acc[product.categoria]) {
                acc[product.categoria] = [];
            }
            acc[product.categoria].push(product);
            return acc;
        }, {});
    }
    
    /**
     * Guarda en storage
     */
    save() {
        const data = {
            productos: this.products.map(p => p.toJSON()),
            ventas: StorageService.get(CONFIG.STORAGE_KEY)?.ventas || []
        };
        StorageService.save(CONFIG.STORAGE_KEY, data);
    }
}
