/**
 * APLICACIÓN PRINCIPAL
 * Integración con Firebase
 */

let appController;
let firebaseProductService;
let firebaseSalesService;

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Iniciando aplicación...');

    // ===== INICIALIZAR FIREBASE =====
    const firebaseReady = FirebaseService.initialize();

    if (!firebaseReady) {
        console.error('❌ Firebase no pudo inicializarse');
        alert('Error: No se pudo conectar a Firebase');
        return;
    }

    // ===== CREAR SERVICIOS =====
    firebaseProductService = new FirebaseProductService();
    firebaseSalesService = new FirebaseSalesService(firebaseProductService);

    firebaseProductService.init();
    firebaseSalesService.init();

    // ===== ESCUCHADORES EN TIEMPO REAL =====

    // Escuchar cambios en productos
    firebaseProductService.onProductsChange(products => {
        console.log('📦 Productos actualizados:', products.length);
        if (appController) {
            appController.refreshProductsUI(products);
        }
    });

    // Escuchar cambios en ventas
    firebaseSalesService.onSalesChange(sales => {
        console.log('💰 Ventas actualizadas:', sales.length);
        if (appController) {
            appController.refreshSalesUI(sales);
        }
    });

    // ===== CREAR CONTROLADOR =====
    appController = new AppController(firebaseProductService, firebaseSalesService);
    window.appController = appController;  // 👈👉 clave: así funcionan los onclick inline

    await appController.init();

    console.log('✅ Aplicación lista!');
});

// Limpiar listeners cuando se cierra la página
window.addEventListener('beforeunload', () => {
    if (firebaseProductService) {
        firebaseProductService.offProductsChange();
    }
    if (firebaseSalesService) {
        firebaseSalesService.offSalesChange();
    }
});
