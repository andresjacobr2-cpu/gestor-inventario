/**
 * FIREBASE SERVICE v12 - Compatible con tu configuración
 */

class FirebaseService {
    constructor() {
        this.db = window.firebaseDb;
        if (!this.db) {
            throw new Error('🔴 Firebase no está inicializado');
        }
        console.log('✅ FirebaseService v12 listo');
    }
    
    async add(collectionName, data) {
        try {
            const colRef = window.collection(this.db, collectionName);
            const { id } = await window.addDoc(colRef, {
                ...data,
                createdAt: window.serverTimestamp(),
                updatedAt: window.serverTimestamp()
            });
            
            console.log(`✅ Agregado ${collectionName}:`, id);
            return { 
                success: true, 
                docId: id,
                data: { docId: id, ...data }
            };
        } catch (error) {
            console.error('❌ Error add:', error);
            return { success: false, error: error.message };
        }
    }
    
    async getAll(collectionName) {
        try {
            const colRef = window.collection(this.db, collectionName);
            const snapshot = await window.getDocs(colRef);
            const docs = snapshot.docs.map(doc => ({
                docId: doc.id,
                ...doc.data()
            }));
            
            console.log(`📦 ${docs.length} de ${collectionName}`);
            return { success: true, data: docs };
        } catch (error) {
            console.error('❌ Error getAll:', error);
            return { success: false, error: error.message };
        }
    }
    
    async delete(collectionName, docId) {
        try {
            const docRef = window.doc(this.db, collectionName, docId);
            await window.deleteDoc(docRef);
            console.log(`🗑️ Eliminado ${collectionName}/${docId}`);
            return { success: true };
        } catch (error) {
            console.error('❌ Error delete:', error);
            return { success: false, error: error.message };
        }
    }
    
    async update(collectionName, docId, data) {
        try {
            const docRef = window.doc(this.db, collectionName, docId);
            await window.updateDoc(docRef, {
                ...data,
                updatedAt: window.serverTimestamp()
            });
            console.log(`✏️ Actualizado ${collectionName}/${docId}`);
            return { success: true };
        } catch (error) {
            console.error('❌ Error update:', error);
            return { success: false, error: error.message };
        }
    }
}

// Inicializar servicio
window.FirebaseService = FirebaseService;
console.log('🔧 FirebaseService cargado');
