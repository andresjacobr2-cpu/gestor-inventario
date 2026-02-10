class FirebaseService {
    constructor() {
        this.db = window.firebaseDb;
        if (!this.db) {
            throw new Error('Firebase no está inicializado');
        }
        console.log('✅ FirebaseService v9 listo');
    }
    
    async add(collectionName, data) {
        try {
            const docRef = await this.db.collection(collectionName).add({
                ...data,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log(`✅ Agregado ${collectionName}:`, docRef.id);
            return { 
                success: true, 
                docId: docRef.id,
                data: { docId: docRef.id, ...data }
            };
        } catch (error) {
            console.error('❌ Error add:', error);
            return { success: false, error: error.message };
        }
    }
    
    async getAll(collectionName) {
        try {
            const snapshot = await this.db.collection(collectionName).get();
            const docs = [];
            snapshot.forEach(doc => {
                docs.push({ 
                    docId: doc.id,
                    ...doc.data()
                });
            });
            console.log(`📦 ${docs.length} de ${collectionName}`);
            return { success: true, data: docs };
        } catch (error) {
            console.error('❌ Error getAll:', error);
            return { success: false, error: error.message };
        }
    }
    
    async delete(collectionName, docId) {
        try {
            await this.db.collection(collectionName).doc(docId).delete();
            console.log(`🗑️ Eliminado ${collectionName}/${docId}`);
            return { success: true };
        } catch (error) {
            console.error('❌ Error delete:', error);
            return { success: false, error: error.message };
        }
    }
    
    async update(collectionName, docId, data) {
        try {
            await this.db.collection(collectionName).doc(docId).update({
                ...data,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log(`✏️ Actualizado ${collectionName}/${docId}`);
            return { success: true };
        } catch (error) {
            console.error('❌ Error update:', error);
            return { success: false, error: error.message };
        }
    }
}
