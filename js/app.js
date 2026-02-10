/**
 * APP PRINCIPAL - VERSIÓN FINAL
 */

let appController;
let firebaseProductService;
let firebaseSalesService;

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Iniciando aplicación...');

    // Crear FirebaseService (no necesita init)
    const firebaseService = new FirebaseService();
    
    // Crear ProductService
    firebaseProductService = new FirebaseProductService();
    console.log('✅ ProductService creado');
    
    // Crear SalesService (necesita ProductService)
    firebaseSalesService = new FirebaseSalesService(firebaseProductService);
    console.log('✅ SalesService creado');
    
    // Listeners en tiempo real
    firebaseProductService.onProductsChange(products => {
        console.log('📦 Productos actualizados:', products.length);
        if (appController) {
            appController.refreshProductsUI(products);
        }
    });
    
    firebaseSalesService.onSalesChange(sales => {
        console.log('💰 Ventas actualizadas:', sales.length);
        if (appController) {
            appController.refreshSalesUI(sales);
        }
    });
    
    // Crear controlador
    appController = new AppController(firebaseProductService, firebaseSalesService);
    window.appController = appController;  // Para onclick inline
    
    // Inicializar app
    await appController.init();
    
    console.log('🎉 ¡APPLICACIÓN COMPLETA LISTA!');
});
