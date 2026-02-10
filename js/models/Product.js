/**
 * MODELO: Product
 * Representa un producto del inventario
 */

class Product {
    constructor(id, nombre, categoria, stock, costo, venta, minimo) {
        this.id = id;
        this.nombre = nombre;
        this.categoria = categoria;
        this.stock = stock;
        this.costo = costo;
        this.venta = venta;
        this.minimo = minimo;
        this.createdAt = new Date();
    }
    
    /**
     * Calcula el margen de ganancia en porcentaje
     */
    getMargin() {
        return ((this.venta - this.costo) / this.costo * 100).toFixed(0);
    }
    
    /**
     * Verifica si el stock está bajo
     */
    isLowStock() {
        return this.stock <= this.minimo;
    }
    
    /**
     * Actualiza el stock
     */
    updateStock(quantity) {
        this.stock -= quantity;
        return this.stock;
    }
    
    /**
     * Convierte el producto a JSON
     */
    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            categoria: this.categoria,
            stock: this.stock,
            costo: this.costo,
            venta: this.venta,
            minimo: this.minimo
        };
    }
}
