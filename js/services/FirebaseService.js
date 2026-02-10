class FirebaseService {
    constructor() {
        this.db = window.firebaseDb;
        console.log('✅ FirebaseService listo');
    }
    
    async add(collectionName, data) {
        try {
            const docRef = await this.db.collection(collectionName).add({
                ...data,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { success: true, docId: docRef.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    async getAll(collectionName) {
        try {
            const snapshot = await this.db.collection(collectionName).get();
            const docs = [];
            snapshot.forEach(doc => {
                docs.push({ docId: doc.id, ...doc.data() });
            });
            return { success: true, data: docs };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    async delete(collectionName, docId) {
        try {
            await this.db.collection(collectionName).doc(docId).delete();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}
