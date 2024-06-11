import getConfig from "next/config";

export function localStorageAPI() {

    if (typeof window === 'undefined') return {
        getData: () => { },
        saveData: () => { },
        cleanData: () => { },
        getConfig: () => { },
        saveConfig: () => { },
    }

    const getConfigObject = () => JSON.parse(localStorage.getItem('config') || "{}");

    return {
        getConfig: (key) => {
            const config = getConfigObject()
            return config[key];
        },
        saveConfig: (key, value) => {
            const config = getConfigObject()
            localStorage.setItem('config', JSON.stringify({ ...config, [key]: value }));

        },
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
