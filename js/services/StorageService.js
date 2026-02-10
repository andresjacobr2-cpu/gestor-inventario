/**
 * SERVICIO: StorageService
 * Gestiona la persistencia de datos en localStorage
 */

class StorageService {
    /**
     * Guarda datos en localStorage
     */
    static save(key, data) {
        try {
            const jsonData = JSON.stringify(data);
            localStorage.setItem(key, jsonData);
            return true;
        } catch (error) {
            console.error('Error al guardar datos:', error);
            return false;
        }
    }
    
    /**
     * Obtiene datos de localStorage
     */
    static get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error al recuperar datos:', error);
            return null;
        }
    }
    
    /**
     * Elimina datos de localStorage
     */
    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error al eliminar datos:', error);
            return false;
        }
    }
    
    /**
     * Limpia todo localStorage
     */
    static clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error al limpiar storage:', error);
            return false;
        }
    }
}
