/**
 * SERVICIO: FirebaseProductService
 * Gestión de productos con Firebase
 */

class FirebaseProductService {
    constructor() {
        this.collection = 'productos';
        this.unsubscribe = null;
    }
    
    /**
     * Inicializar servicio
     */
    init() {
        console.log('🔥 ProductService inicializado con Firebase');
    }
    
    /**
     * Agregar nuevo producto
     */
    async addProduct(product) {
        const result = await FirebaseService.add(this.collection, {
            id: product.id,
            nombre: product.nombre,
            categoria: product.categoria,
            stock: product.stock,
            costo: product.costo,
            venta: product.venta,
            minimo: product.minimo
        });
        
        if (!result.success) {
            return { 
                success: false, 
                message: result.error 
            };
        }
        
        return { 
            success: true, 
            message: '✅ Producto agregado',
            data: result.data
        };
    }
    
    /**
     * Obtener todos los productos
     */
    async getAllProducts() {
        return await FirebaseService.getAll(this.collection);
    }
    
    /**
     * Obtener producto por ID
     */
    async getProductById(productId) {
        return await FirebaseService.getById(this.collection, productId);
    }
    
    /**
     * Actualizar producto
     */
    async updateProduct(docId, updates) {
        return await FirebaseService.update(this.collection, docId, updates);
    }
    
    /**
     * Eliminar producto
     */
    async deleteProduct(docId) {
        return await FirebaseService.delete(this.collection, docId);
    }
    
    /**
     * Obtener productos con stock bajo
     */
    async getLowStockProducts() {
        return await FirebaseService.query(
            this.collection, 
            'stock', 
            '<=', 
            10
        );
    }
    
    /**
     * Obtener productos por categoría
     */
    async getProductsByCategory(category) {
        return await FirebaseService.query(
            this.collection,
            'categoria',
            '==',
            category
        );
    }
    
    /**
     * Escuchar cambios en tiempo real
     */
    onProductsChange(callback) {
        this.unsubscribe = FirebaseService.onSnapshot(
            this.collection,
            callback,
            (error) => {
                console.error('Error escuchando productos:', error);
            }
        );
        return this.unsubscribe;
    }
    
    /**
     * Dejar de escuchar
     */
    offProductsChange() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
    
    /**
     * Obtener todas las categorías únicas
     */
    async getCategories() {
        const result = await this.getAllProducts();
        if (result.success) {
            const categories = [...new Set(result.data.map(p => p.categoria))];
            return { success: true, data: categories };
        }
        return result;
    }
}
