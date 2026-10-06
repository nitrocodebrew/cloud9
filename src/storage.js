class Storage {

    constructor() {
        this.storage = this.getStorage();
    }

    getStorage() {
        try {
            const storage = window.localStorage;
            const test = '__cloud9_storage_test_key__';

            storage.setItem(test, '1');
            storage.removeItem(test);

            return storage;
        }
        catch {
            return null;
        }
    }

    get(key) {
        if(!this.storage) {
            return null;
        }

        try {
            return this.storage.getItem(key);
        }
        catch {
            return null;
        }
    }

    set(key, value) {
        if(!this.storage) {
            return false;
        }

        try {
            this.storage.setItem(key, value);
            return true;
        }
        catch {
            return false;
        }
    }

    remove(key) {
        if(!this.storage) {
            return false;
        }

        try {
            this.storage.removeItem(key);
            return true;
        }
        catch {
            return false;
        }
    }
}

export default Storage;