/**
 * CONTROLADOR PRINCIPAL (MVP) - Gestor de Inventario
 * Conecta la UI con los servicios de Firebase
 */
class AppController {
    constructor(productService, salesService) {
        this.productService = productService;
        this.salesService = salesService;

        // Cachés rápidas
        this.products = [];
        this.sales = [];

        // Selectores
        this.selectors = {
            TABS_CONTAINER: "div[tabs]",
            TABS_BUTTONS: ".tab-button",
            TAB_CONTENTS: ".content",

            // Productos
            PRODUCT_FORM: "#productForm",
            PRODUCT_ID_INPUT: "#productoId",
            PRODUCT_NOMBRE_INPUT: "#productoNombre",
            PRODUCT_CATEGORIA_INPUT: "#productoCategoria",
            PRODUCT_STOCK_INPUT: "#productoStock",
            PRODUCT_COSTO_INPUT: "#productoCosto",
            PRODUCT_VENTA_INPUT: "#productoVenta",
            PRODUCT_MINIMO_INPUT: "#productoMinimo",
            PRODUCT_TABLE_BODY: "#bodyProductos",

            // Ventas
            SALES_FORM: "#salesForm",
            SALES_FECHA_INPUT: "#ventaFecha",
            SALES_PRODUCTO_SELECT: "#ventaProducto",
            SALES_CANTIDAD_INPUT: "#ventaCantidad",
            SALES_PRECIO_INPUT: "#ventaPrecio",
            SALES_CLIENTE_INPUT: "#ventaCliente",
            SALES_PAGO_SELECT: "#ventaPago",
            SALES_TABLE_BODY: "#bodyVentas",

            // Análisis
            TOTAL_VENTAS_SPAN: "#totalVentas",
            TOTAL_UNIDADES_SPAN: "#totalUnidades",
            TICKET_PROMEDIO_SPAN: "#ticketPromedio",
            PRODUCTOS_ACTIVOS_SPAN: "#productosActivos",
            ALERTA_STOCK: "#alertaStock",
            BEST_SELLERS_TABLE_BODY: "#bodyMasVendidos",
            CATEGORIES_TABLE_BODY: "#bodyCategorias",
        };
    }

    /**
     * Inicialización general
     */
    async init() {
        console.log("🧠 AppController: inicializando...");

        this.bindEvents();
        await this.loadInitialData();
        this.updateUI();

        console.log("✅ AppController: listo");
    }

    /**
     * Cargar datos iniciales de Firebase
     */
    async loadInitialData() {
        const productoResult = await this.productService.getAllProducts();
        if (productoResult.success) {
            this.products = productoResult.data;
        } else {
            console.warn("⚠️ No se pudieron cargar productos:", productoResult.error);
        }

        const venteResult = await this.salesService.getAllSales();
        if (venteResult.success) {
            this.sales = venteResult.data;
        } else {
            console.warn("⚠️ No se pudieron cargar ventas:", venteResult.error);
        }
    }

    /**
     * Vincular eventos del DOM
     */
    bindEvents() {
        // Tabs
        document.querySelectorAll(this.selectors.TABS_BUTTONS).forEach(btn => {
            btn.addEventListener("click", () => this.onTabClick(btn.getAttribute("data-tab")));
        });

        // Productos
        const productForm = document.querySelector(this.selectors.PRODUCT_FORM);
        if (productForm) {
            productForm.addEventListener("submit", (e) => this.onProductFormSubmit(e));
        }

        // Ventas
        const salesForm = document.querySelector(this.selectors.SALES_FORM);
        if (salesForm) {
            salesForm.addEventListener("submit", (e) => this.onSalesFormSubmit(e));
        }

        // Recalcula precio de venta cuando cambia el producto
        const productoSelect = document.querySelector(this.selectors.SALES_PRODUCTO_SELECT);
        if (productoSelect) {
            productoSelect.addEventListener("change", () => this.onProductSelectChange());
        }
    }

    /**
     * Manejar click en pestaña del menú
     */
    onTabClick(tabName) {
        document.querySelectorAll(this.selectors.TAB_CONTENTS).forEach(tab => {
            tab.classList.remove("active");
        });

        const targetTab = document.getElementById(tabName);
        if (targetTab) {
            targetTab.classList.add("active");
        }

        document.querySelector(this.selectors.TABS_BUTTONS + " .active")?.classList.remove("active");
        event.target.classList.add("active");

        if (tabName === "analisis") {
            this.updateAnalysisUI();
        }
    }

    /**
     * Manejar envío de formulario de producto
     */
    async onProductFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const id = form.querySelector(this.selectors.PRODUCT_ID_INPUT).value.trim();
        const nombre = form.querySelector(this.selectors.PRODUCT_NOMBRE_INPUT).value.trim();
        const categoria = form.querySelector(this.selectors.PRODUCT_CATEGORIA_INPUT).value.trim();
        const stock = parseInt(form.querySelector(this.selectors.PRODUCT_STOCK_INPUT).value, 10) || 0;
        const costo = parseInt(form.querySelector(this.selectors.PRODUCT_COSTO_INPUT).value, 10) || 0;
        const venta = parseInt(form.querySelector(this.selectors.PRODUCT_VENTA_INPUT).value, 10) || 0;
        const minimo = parseInt(form.querySelector(this.selectors.PRODUCT_MINIMO_INPUT).value, 10) || 5;

        if (!id || !nombre || !categoria || costo <= 0 || venta <= 0) {
            this.showAlert("Por favor, completa todos los campos.", "error");
            return;
        }

        const existing = this.products.find(p => p.id === id);
        if (existing) {
            this.showAlert("El ID del producto ya existe.", "error");
            return;
        }

        const product = {
            id,
            nombre,
            categoria,
            stock,
            costo,
            venta,
            minimo,
        };

        const result = await this.productService.addProduct(product);
        if (result.success) {
            this.products.push(result.data);
            this.updateProductsUI(this.products);
            this.showAlert(result.message, "success");
            form.reset();
        } else {
            this.showAlert("❌ Error: " + result.message, "error");
        }
    }

    /**
     * Manejar envío de formulario de venta
     */
    async onSalesFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const fecha = form.querySelector(this.selectors.SALES_FECHA_INPUT).value;
        const productoId = form.querySelector(this.selectors.SALES_PRODUCTO_SELECT).value;
        const cantidad = parseInt(form.querySelector(this.selectors.SALES_CANTIDAD_INPUT).value, 10) || 1;
        const precio = parseInt(form.querySelector(this.selectors.SALES_PRECIO_INPUT).value, 10) || 0;
        const cliente = form.querySelector(this.selectors.SALES_CLIENTE_INPUT)?.value || "Consumidor";
        const pago = form.querySelector(this.selectors.SALES_PAGO_SELECT).value;

        if (!fecha || !productoId || cantidad <= 0 || precio <= 0 || !pago) {
            this.showAlert("Por favor, completa todos los campos.", "error");
            return;
        }

        const product = this.products.find(p => p.id === productoId);
        if (!product) {
            this.showAlert("Producto no válido.", "error");
            return;
        }

        const sale = {
            fecha,
            productoId: product.id,
            producto: product.nombre,
            cantidad,
            precio,
            cliente,
            pago,
        };

        const result = await this.salesService.registerSale(sale);
        if (result.success) {
            this.sales = result.data ? this.sales.concat(result.data) : this.sales;
            this.updateSalesUI(this.sales);
            this.updateAnalysisUI();
            this.showAlert(result.message, "success");

            form.reset();
            document.getElementById("ventaFecha").valueAsDate = new Date();
        } else {
            this.showAlert("❌ Error: " + result.message, "error");
        }
    }

    /**
     * Manejar cambio de producto en select de venta
     */
    onProductSelectChange() {
        const select = document.querySelector(this.selectors.SALES_PRODUCTO_SELECT);
        const input = document.querySelector(this.selectors.SALES_PRECIO_INPUT);

        if (!select || !input) return;

        const id = select.value;
        if (!id) {
            input.value = "";
            return;
        }

        const product = this.products.find(p => p.id === id);
        if (product) {
            input.value = product.venta || "";
        } else {
            input.value = "";
        }
    }

    /**
     * CRUD de productos - eliminar
     */
    async onProductDelete(id) {
        if (!confirm("¿Eliminar este producto?")) return;

        const result = await this.productService.deleteProduct(id);
        if (result.success) {
            this.products = this.products.filter(p => p.id !== id);
            this.updateProductsUI(this.products);
            this.showAlert("Producto eliminado.", "success");
        } else {
            this.showAlert("Error al eliminar producto: " + result.error, "error");
        }
    }

    /**
     * CRUD de ventas - eliminar
     */
    async onSaleDelete(index) {
        if (!confirm("¿Eliminar esta venta?")) return;

        const sale = this.sales[index];
        if (!sale?.docId) return;

        const result = await this.salesService.deleteSale(sale.docId);
        if (result.success) {
            this.sales.splice(index, 1);
            this.updateSalesUI(this.sales);
            this.updateAnalysisUI();
            this.showAlert("Venta eliminada.", "success");
        } else {
            this.showAlert("Error al eliminar venta: " + result.error, "error");
        }
    }

    /**
     * Actualizar tabla de productos
     */
    updateProductsUI(products) {
        const tbody = document.querySelector(this.selectors.PRODUCT_TABLE_BODY);
        if (!tbody) return;

        tbody.innerHTML = "";

        products.forEach(p => {
            const margenPct = ((p.venta - p.costo) / p.costo * 100).toFixed(0);
            const badgeClass = p.stock <= p.minimo ? "badge-danger" : "badge-success";
            const badgeText = p.stock <= p.minimo ? "⚠️ Bajo" : "✓ OK";

            const fila = `
            <tr>
              <td>${p.id}</td>
              <td>${this.sanitize(p.nombre)}</td>
              <td>${this.sanitize(p.categoria)}</td>
              <td>${p.stock}</td>
              <td>$${this.formatNumber(p.venta)}</td>
              <td>${margenPct}%</td>
              <td><span class="badge ${badgeClass}">${badgeText}</span></td>
              <td>
                <div class="action-buttons">
                  <button 
                    class="btn btn-small btn-danger" 
                    onclick="window.appController.onProductDelete('${p.id}')">
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
            `;
            tbody.insertAdjacentHTML("beforeend", fila);
        });

        this.updateSalesProdutoSelect(products);
    }

    /**
     * Actualizar combo de ventas ← productos
     */
    updateSalesProdutoSelect(products) {
        const select = document.querySelector(this.selectors.SALES_PRODUCTO_SELECT);
        if (!select) return;

        select.innerHTML = '<option value="">-- Seleccionar Producto --</option>';
        products.forEach(p => {
            const opcional = p.stock <= p.minimo ? " (⚠️ Bajo)" : "";
            select.insertAdjacentHTML(
                "beforeend",
                `<option value="${p.id}">${p.nombre} (Stock: ${p.stock})${opcional}</option>`
            );
        });
    }

    /**
     * Actualizar tabla de ventas
     */
    updateSalesUI(sales) {
        const tbody = document.querySelector(this.selectors.SALES_TABLE_BODY);
        if (!tbody) return;

        tbody.innerHTML = "";

        sales.forEach((v, index) => {
            const total = v.cantidad * v.precio;
            const fila = `
            <tr>
              <td>${v.fecha}</td>
              <td>${this.sanitize(v.producto)}</td>
              <td>${v.cantidad}</td>
              <td>$${this.formatNumber(v.precio)}</td>
              <td>$${this.formatNumber(total)}</td>
              <td>${this.sanitize(v.cliente)}</td>
              <td>${this.sanitize(v.pago)}</td>
              <td>
                <div class="action-buttons">
                  <button 
                    class="btn btn-small btn-danger" 
                    onclick="window.appController.onSaleDelete(${index})">
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
            `;
            tbody.insertAdjacentHTML("beforeend", fila);
        });
    }

    /**
     * Actualizar sección de análisis
     */
    async updateAnalysisUI() {
        const { success: salesSuccess, data: sales } = await this.salesService.getAllSales();
        const { success: productsSuccess, data: products } = await this.productService.getAllProducts();

        if (!salesSuccess || !productsSuccess) {
            console.error("⚠️ No se pudieron actualizar análisis");
            return;
        }

        this.updateSalesStatistics(sales);
        this.updateAlertaStock(products);
        this.updateTopSellers(sales);
        this.updateCategoriasResumen(products, sales);
    }

    /**
     * Análisis → totales
     */
    updateSalesStatistics(sales) {
        const totalVentas = sales.reduce((sum, v) => sum + (v.cantidad * v.precio), 0);
        const totalUnidades = sales.reduce((sum, v) => sum + v.cantidad, 0);
        const ticketPromedio = sales.length > 0 ? Math.round(totalVentas / sales.length) : 0;

        document.querySelector(this.selectors.TOTAL_VENTAS_SPAN).textContent = this.formatNumber(totalVentas);
        document.querySelector(this.selectors.TOTAL_UNIDADES_SPAN).textContent = totalUnidades;
        document.querySelector(this.selectors.TICKET_PROMEDIO_SPAN).textContent = this.formatNumber(ticketPromedio);
        document.querySelector(this.selectors.PRODUCTOS_ACTIVOS_SPAN).textContent = this.products.length;
    }

    /**
     * Análisis → alerta de stock bajo
     */
    updateAlertaStock(products) {
        const lowStock = products.filter(p => p.stock <= p.minimo);
        const alert = document.querySelector(this.selectors.ALERTA_STOCK);

        if (lowStock.length === 0) {
            alert.innerHTML = "";
            return;
        }

        let html = `
        <div class="alert alert-danger">
          <strong>⚠️ Activar reposición:</strong><br>
          ${lowStock.map(p => `${p.nombre}: ${p.stock}/${p.minimo}`).join("<br>")}.
        </div>
        `;
        alert.innerHTML = html;
    }

    /**
     * Análisis → productos más vendidos
     */
    updateTopSellers(sales) {
        const byProduct = {};
        sales.forEach(v => {
            if (!byProduct[v.productoId]) {
                byProduct[v.productoId] = {
                    nombre: v.producto,
                    cantidad: 0,
                    ingresos: 0,
                };
            }
            byProduct[v.productoId].cantidad += v.cantidad;
            byProduct[v.productoId].ingresos += v.cantidad * v.precio;
        });

        const top = Object.values(byProduct)
            .sort((a, b) => b.cantidad - a.cantidad)
            .slice(0, 5);

        const tbody = document.querySelector(this.selectors.BEST_SELLERS_TABLE_BODY);
        tbody.innerHTML = "";

        top.forEach(p => {
            tbody.insertAdjacentHTML(
                "beforeend",
                `
                <tr>
                  <td>${this.sanitize(p.nombre)}</td>
                  <td>${p.cantidad}</td>
                  <td>$${this.formatNumber(p.ingresos)}</td>
                </tr>`
            );
        });
    }

    /**
     * Análisis → categorías
     */
    updateCategoriasResumen(products, sales) {
        const byCat = {};
        products.forEach(p => {
            if (!byCat[p.categoria]) {
                byCat[p.categoria] = { productos: 0, stock: 0, valor: 0 };
            }
            byCat[p.categoria].productos += 1;
            byCat[p.categoria].stock += p.stock;
            byCat[p.categoria].valor += p.stock * p.venta;
        });

        const tbody = document.querySelector(this.selectors.CATEGORIES_TABLE_BODY);
        tbody.innerHTML = "";

        Object.entries(byCat).forEach(([cat, data]) => {
            tbody.insertAdjacentHTML(
                "beforeend",
                `
                <tr>
                  <td>${this.sanitize(cat)}</td>
                  <td>${data.productos}</td>
                  <td>${data.stock}</td>
                  <td>$${this.formatNumber(data.valor)}</td>
                </tr>`
            );
        });
    }

    /**
     * Mensajes de consola y alertas
     */
    showAlert(message, type) {
        const ele = document.createElement("div");
        ele.classList.add("alert");
        if (type === "error") ele.classList.add("alert-danger");
        ele.innerHTML = `<strong>⚠️ ${type}:</strong> ${this.sanitize(message)}`;
        ele.style.margin = "10px 0";

        const container = document.querySelector(".container") || document.body;
        container.prepend(ele);

        setTimeout(() => {
            ele.remove();
        }, 5000);
    }

    /**
     * Vistas independientes (para listener Firebase)
     */
    refreshProductsUI(products) {
        this.products = products;
        this.updateProductsUI(products);
        this.updateAnalyticsIfNeeded();
    }

    refreshSalesUI(sales) {
        this.sales = sales;
        this.updateSalesUI(sales);
        this.updateAnalyticsIfNeeded();
    }

    updateAnalyticsIfNeeded() {
        const analysisTab = document.getElementById("analisis");
        if (analysisTab && analysisTab.classList.contains("active")) {
            this.updateAnalysisUI();
        }
    }

    /**
     * Formateo y seguridad
     */
    sanitize(text) {
        return text ? String(text).replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
    }

    formatNumber(num) {
        return new Intl.NumberFormat("es-CO").format(num);
    }
}
