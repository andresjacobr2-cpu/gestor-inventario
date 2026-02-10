/**
 * APLICACIÓN PRINCIPAL
 * Punto de entrada de la aplicación
 */

let appController;

// Inicializa la aplicación cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    // Crear servicios
    const productService = new ProductService();
    const salesService = new SalesService(productService);
    
    // Inicializar servicios
    productService.init();
    salesService.init();
    
    // Crear controlador
    appController = new AppController(productService, salesService);
    appController.init();
});
