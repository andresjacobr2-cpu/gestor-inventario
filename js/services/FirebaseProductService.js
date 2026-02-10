class FirebaseProductService {
    constructor() {
        this.service = new FirebaseService();
        this.collection = 'productos';
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
    // 👇 AGREGAR AL FINAL de FirebaseProductService.js
    onProductsChange(callback) {
    const unsubscribe = this.service.db.collection(this.collection)
        .onSnapshot(snapshot => {
            const products = [];
            snapshot.forEach(doc => {
                products.push({ 
                    docId: doc.id, 
                    ...doc.data() 
                });
            });
            callback(products);
        });
    
    console.log('👂 Listener productos activo');
    return unsubscribe;
}

offProductsChange() {
    // Para limpiar después
    console.log('🛑 Listener productos detenido');
}



}
