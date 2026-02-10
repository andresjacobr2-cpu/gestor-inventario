/**
 * SERVICIO: FirebaseService
 * Gestión central de Firebase Firestore
 * 
 * Uso:
 * - Inicializar en app.js
 * - Usar desde ProductService y SalesService
 */

class FirebaseService {
    static db = null;
    
    /**
     * Inicializar Firebase
     */
    static initialize() {
        try {
            // Verificar que la configuración exista
            if (!FIREBASE_CONFIG || !FIREBASE_CONFIG.projectId) {
                throw new Error('FIREBASE_CONFIG no está definido');
            }
            
            // Inicializar Firebase
            firebase.initializeApp(FIREBASE_CONFIG);
            
            // Obtener referencia a Firestore
            this.db = firebase.firestore();
            
            console.log('✅ Firebase inicializado correctamente');
            console.log('🔥 Proyecto:', FIREBASE_CONFIG.projectId);
            
            return true;
        } catch (error) {
            console.error('❌ Error inicializando Firebase:', error.message);
            alert('❌ Error conectando a Firebase. Revisa la consola.');
            return false;
        }
    }
    
    /**
     * ===== OPERACIONES CRUD =====
     */
    
    /**
     * Agregar nuevo documento a una colección
     * @param {string} collection - Nombre de la colección
     * @param {object} data - Datos a guardar
     * @returns {Promise}
     */
    static async add(collection, data) {
        try {
            const docRef = await this.db.collection(collection).add({
                ...data,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log(`✅ Documento agregado a ${collection}:`, docRef.id);
            return { 
                success: true, 
                id: docRef.id,
                data: { id: docRef.id, ...data }
            };
        } catch (error) {
            console.error(`❌ Error agregando a ${collection}:`, error);
            return { 
                success: false, 
                error: error.message 
            };
        }
    }
    
    /**
     * Actualizar documento
     */
    static async update(collection, docId, data) {
        try {
            await this.db.collection(collection).doc(docId).update({
                ...data,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log(`✅ Documento actualizado en ${collection}`);
            return { success: true };
        } catch (error) {
            console.error(`❌ Error actualizando ${collection}:`, error);
            return { 
                success: false, 
                error: error.message 
            };
        }
    }
    
    /**
     * Obtener todos los documentos de una colección
     */
    static async getAll(collection) {
        try {
            const snapshot = await this.db.collection(collection).get();
            const docs = [];
            
            snapshot.forEach(doc => {
                docs.push({ 
                    docId: doc.id,  // ID del documento
                    ...doc.data() 
                });
            });
            
            console.log(`✅ Obtenidos ${docs.length} documentos de ${collection}`);
            return { 
                success: true, 
                data: docs 
            };
        } catch (error) {
            console.error(`❌ Error obteniendo ${collection}:`, error);
            return { 
                success: false, 
                error: error.message 
            };
        }
    }
    
    /**
     * Obtener un documento por ID
     */
    static async getById(collection, docId) {
        try {
            const doc = await this.db.collection(collection).doc(docId).get();
            
            if (doc.exists) {
                return { 
                    success: true, 
                    data: { docId: doc.id, ...doc.data() } 
                };
            } else {
                return { 
                    success: false, 
                    error: 'Documento no encontrado' 
                };
            }
        } catch (error) {
            console.error(`❌ Error obteniendo documento:`, error);
            return { 
                success: false, 
                error: error.message 
            };
        }
    }
    
    /**
     * Eliminar documento
     */
    static async delete(collection, docId) {
        try {
            await this.db.collection(collection).doc(docId).delete();
            
            console.log(`✅ Documento eliminado de ${collection}`);
            return { success: true };
        } catch (error) {
            console.error(`❌ Error eliminando documento:`, error);
            return { 
                success: false, 
                error: error.message 
            };
        }
    }
    
    /**
     * ===== BÚSQUEDAS Y QUERIES =====
     */
    
    /**
     * Buscar documentos con filtro
     * @param {string} collection - Colección
     * @param {string} field - Campo a filtrar
     * @param {string} operator - Operador: '==', '<', '>', '<=', '>=', '!='
     * @param {*} value - Valor a comparar
     */
    static async query(collection, field, operator, value) {
        try {
            let query = this.db.collection(collection);
            query = query.where(field, operator, value);
            
            const snapshot = await query.get();
            const docs = [];
            
            snapshot.forEach(doc => {
                docs.push({ 
                    docId: doc.id,
                    ...doc.data() 
                });
            });
            
            console.log(`✅ Query: ${docs.length} resultados`);
            return { 
                success: true, 
                data: docs 
            };
        } catch (error) {
            console.error(`❌ Error en búsqueda:`, error);
            return { 
                success: false, 
                error: error.message 
            };
        }
    }
    
    /**
     * Query compleja con múltiples filtros
     */
    static async complexQuery(collection, filters) {
        try {
            let query = this.db.collection(collection);
            
            // Aplicar cada filtro: { field: 'stock', operator: '<=', value: 10 }
            filters.forEach(filter => {
                query = query.where(filter.field, filter.operator, filter.value);
            });
            
            const snapshot = await query.get();
            const docs = [];
            
            snapshot.forEach(doc => {
                docs.push({ 
                    docId: doc.id,
                    ...doc.data() 
                });
            });
            
            return { 
                success: true, 
                data: docs 
            };
        } catch (error) {
            console.error(`❌ Error en búsqueda compleja:`, error);
            return { 
                success: false, 
                error: error.message 
            };
        }
    }
    
    /**
     * ===== ESCUCHADORES EN TIEMPO REAL =====
     */
    
    /**
     * Escuchar cambios en tiempo real de una colección completa
     */
    static onSnapshot(collection, callback, errorCallback) {
        try {
            const unsubscribe = this.db.collection(collection)
                .onSnapshot(
                    (snapshot) => {
                        const docs = [];
                        snapshot.forEach(doc => {
                            docs.push({ 
                                docId: doc.id,
                                ...doc.data() 
                            });
                        });
                        callback(docs);
                    },
                    (error) => {
                        console.error(`❌ Error en listener:`, error);
                        if (errorCallback) errorCallback(error);
                    }
                );
            
            console.log(`✅ Escuchador iniciado para ${collection}`);
            return unsubscribe; // Retorna función para desuscribirse
        } catch (error) {
            console.error(`❌ Error creando listener:`, error);
            return null;
        }
    }
    
    /**
     * Escuchar cambios en un documento específico
     */
    static onDocSnapshot(collection, docId, callback) {
        try {
            const unsubscribe = this.db
                .collection(collection)
                .doc(docId)
                .onSnapshot((doc) => {
                    if (doc.exists) {
                        callback({ 
                            docId: doc.id,
                            ...doc.data() 
                        });
                    }
                });
            
            return unsubscribe;
        } catch (error) {
            console.error(`❌ Error en listener de documento:`, error);
            return null;
        }
    }
    
    /**
     * ===== BATCH OPERATIONS =====
     */
    
    /**
     * Operación batch: múltiples writes atómicos
     */
    static async batch(operations) {
        try {
            const batch = this.db.batch();
            
            operations.forEach(op => {
                const ref = this.db.collection(op.collection).doc(op.id);
                
                if (op.type === 'set') {
                    batch.set(ref, op.data);
                } else if (op.type === 'update') {
                    batch.update(ref, op.data);
                } else if (op.type === 'delete') {
                    batch.delete(ref);
                }
            });
            
            await batch.commit();
            
            console.log(`✅ Batch de ${operations.length} operaciones ejecutado`);
            return { success: true };
        } catch (error) {
            console.error(`❌ Error en batch:`, error);
            return { 
                success: false, 
                error: error.message 
            };
        }
    }
    
    /**
     * ===== UTILIDADES =====
     */
    
    /**
     * Obtener timestamp actual del servidor
     */
    static getServerTimestamp() {
        return firebase.firestore.FieldValue.serverTimestamp();
    }
    
    /**
     * Verificar conexión
     */
    static isConnected() {
        return this.db !== null;
    }
    
    /**
     * Limpiar datos de prueba (útil en desarrollo)
     */
    static async clearCollection(collection) {
        try {
            const snapshot = await this.db.collection(collection).get();
            const batch = this.db.batch();
            
            snapshot.forEach(doc => {
                batch.delete(doc.ref);
            });
            
            await batch.commit();
            console.log(`✅ Colección ${collection} limpiada`);
            return { success: true };
        } catch (error) {
            console.error(`❌ Error limpiando colección:`, error);
            return { 
                success: false, 
                error: error.message 
            };
        }
    }
}
