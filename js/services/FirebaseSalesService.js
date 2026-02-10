class FirebaseSalesService {
    constructor(productService) {
        this.service = new FirebaseService();
        this.productService = productService;
        this.collection = 'ventas';
        console.log('💰 SalesService listo');
    }
    
    async registerSale(sale) {
        // Simple por ahora
        return await this.service.add(this.collection, sale);
    }
    
    async getAllSales() {
        return await this.service.getAll(this.collection);
    }
}
