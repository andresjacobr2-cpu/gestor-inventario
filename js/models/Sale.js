/**
 * MODELO: Sale
 * Representa una venta registrada
 */

class Sale {
    constructor(fecha, productoId, producto, cantidad, precio, cliente, pago) {
        this.fecha = fecha;
        this.productoId = productoId;
        this.producto = producto;
        this.cantidad = cantidad;
        this.precio = precio;
        this.cliente = cliente || 'Consumidor';
        this.pago = pago;
        this.createdAt = new Date();
    }
    
    /**
     * Calcula el total de la venta
     */
    getTotal() {
        return this.cantidad * this.precio;
    }
    
    /**
     * Convierte la venta a JSON
     */
    toJSON() {
        return {
            fecha: this.fecha,
            productoId: this.productoId,
            producto: this.producto,
            cantidad: this.cantidad,
            precio: this.precio,
            cliente: this.cliente,
            pago: this.pago
        };
    }
}
