document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Iniciando aplicación...');

    // Firebase ya está inicializado arriba
    const firebaseService = new FirebaseService();  // 👈 CAMBIO AQUÍ
    
    // Crear servicios
    firebaseProductService = new FirebaseProductService();
    firebaseSalesService = new FirebaseSalesService(firebaseProductService);
    
    firebaseProductService.init();
    firebaseSalesService.init();

    // Listeners (igual)
    firebaseProductService.onProductsChange(products => {
        console.log('📦 Productos actualizados:', products.length);
        if (appController) appController.refreshProductsUI(products);
    });

    firebaseSalesService.onSalesChange(sales => {
        console.log('💰 Ventas actualizadas:', sales.length);
        if (appController) appController.refreshSalesUI(sales);
    });

    // Controlador
    appController = new AppController(firebaseProductService, firebaseSalesService);
    window.appController = appController;
    await appController.init();

    console.log('✅ ¡TODO LISTO!');
});
