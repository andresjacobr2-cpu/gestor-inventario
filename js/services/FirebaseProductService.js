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
}
