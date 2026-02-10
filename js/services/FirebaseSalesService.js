class FirebaseSalesService {
    constructor(productService) {
        this.service = new FirebaseService();
        this.productService = productService;
        this.collection = 'ventas';
        this.listeners = [];
        console.log('💰 SalesService listo');
    }
    
    async registerSale(sale) {
        return await this.service.add(this.collection, sale);
    }
    
    async getAllSales() {
        return await this.service.getAll(this.collection);
    }
    
    /**
     * Listener en tiempo real - NUEVO
     */
    onSalesChange(callback) {
        const unsubscribe = this.service.db.collection(this.collection)
            .onSnapshot((snapshot) => {
                const sales = [];
                snapshot.forEach((doc) => {
                    sales.push({ 
                        docId: doc.id, 
                        ...doc.data() 
                    });
                });
                console.log('🔄 Ventas sincronizadas:', sales.length);
                callback(sales);
            }, (error) => {
                console.error('Error listener ventas:', error);
            });
        
        this.listeners.push(unsubscribe);
        console.log('👂 Listener ventas activo');
        return unsubscribe;
    }
    
    /**
     * Limpiar listeners
     */
    offSalesChange() {
        this.listeners.forEach((unsubscribe) => unsubscribe());
        this.listeners = [];
        console.log('🛑 Listeners ventas detenidos');
    }
}
