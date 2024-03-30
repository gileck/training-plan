export function localStorageAPI() {

    return {
        getData: (key) => {
            return JSON.parse(localStorage.getItem(key) || null);
        },
        saveData: (key, data) => {
            localStorage.setItem(key, JSON.stringify(data));
        },
        cleanData: (key) => {
            localStorage.removeItem(key);
            console.log('cleaned');
        }
    };
}
