/**
 * FIREBASE SERVICE v12
 * Compatible con tu configuración
 */

class FirebaseService {
    constructor() {
        this.db = window.firebaseDb;
        if (!this.db) {
            throw new Error('Firebase no está inicializado');
        }
    }
    
    /**
     * Guardar documento
     */
    async add(collection, data) {
        try {
            const { id } = await addDoc(collection(this.db), {
                ...data,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            
            console.log(`✅ Agregado a ${collection}:`, id);
            return { success: true, id, data };
        } catch (error) {
            console.error('❌ Error:', error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Obtener todos
     */
    async getAll(collection) {
        try {
            const snapshot = await getDocs(collection(this.db));
            const docs = snapshot.docs.map(doc => ({
                docId: doc.id,
                ...doc.data()
            }));
            
            console.log(`📦 ${docs.length} documentos de ${collection}`);
            return { success: true, data: docs };
        } catch (error) {
            console.error('❌ Error:', error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Eliminar
     */
    async delete(collection, docId) {
        try {
            await deleteDoc(doc(collection(this.db), docId));
            console.log(`🗑️ Eliminado ${collection}/${docId}`);
            return { success: true };
        } catch (error) {
            console.error('❌ Error:', error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Actualizar
     */
    async update(collection, docId, data) {
        try {
            await updateDoc(doc(collection(this.db), docId), {
                ...data,
                updatedAt: serverTimestamp()
            });
            console.log(`✏️ Actualizado ${collection}/${docId}`);
            return { success: true };
        } catch (error) {
            console.error('❌ Error:', error);
            return { success: false, error: error.message };
        }
    }
}
