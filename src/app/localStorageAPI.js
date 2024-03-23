export function localStorageAPI() {

    return {
        getData: () => {
            return JSON.parse(localStorage.getItem('data') || null);
        },
        saveData: (data) => {
            localStorage.setItem('data', JSON.stringify(data));
        },
        removeData: (key = 'data') => {
            localStorage.removeItem(key);
        }
    };
}
