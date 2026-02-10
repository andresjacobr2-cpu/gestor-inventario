class FirebaseProductService {
    constructor() {
        this.service = new FirebaseService();
        this.collection = 'productos';
        this.listeners = [];
        console.log('🛒 ProductService listo');
    }
    
    async addProduct(product) {
        return await this.service.add(this.collection, product);
    }
    
    async getAllProducts() {
        return await this.service.getAll(this.collection);
    }
    
    async deleteProduct(docId) {
        return await this.service.delete(this.collection, docId);
    }
    
    /**
     * Listener en tiempo real - NUEVO
     */
    onProductsChange(callback) {
        const unsubscribe = this.service.db.collection(this.collection)
            .onSnapshot((snapshot) => {
                const products = [];
                snapshot.forEach((doc) => {
                    products.push({ 
                        docId: doc.id, 
                        ...doc.data() 
                    });
                });
                console.log('🔄 Productos sincronizados:', products.length);
                callback(products);
            }, (error) => {
                console.error('Error listener productos:', error);
            });
        
        this.listeners.push(unsubscribe);
        console.log('👂 Listener productos activo');
        return unsubscribe;
    }
    
    /**
     * Limpiar listeners
     */
    offProductsChange() {
        this.listeners.forEach((unsubscribe) => unsubscribe());
        this.listeners = [];
        console.log('🛑 Listeners productos detenidos');
    }
}
