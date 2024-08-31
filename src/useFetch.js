import { useEffect, useState } from "react";
import { localStorageAPI } from "./app/localStorageAPI";

const { getData, saveData } = localStorageAPI()
const STALE_TIME = 1000 * 60 * 60; // 1 hour
const UPDATE_TIME = 1000 * 60 // 1 minute

const cache = getData('fetchCache') || {};
const getFromCache = (url) => cache[url];
const saveToCache = (url, data) => {
    cache[url] = data;
    saveData('fetchCache', cache);
}

function getDataFromCache(url) {
    const data = getFromCache(url);
    if (data) {
        const { timestamp, data: dataFromCache } = data;
        const now = new Date().getTime();
        const diff = now - timestamp;
        if (diff < STALE_TIME) {
            return dataFromCache;
        }
    }
    return null;
}

function saveDataToCache(url, data) {
    saveToCache(url, { timestamp: new Date().getTime(), data });
}

function updateCache(url) {
}

function updateCacheInBackground(url) {
    return fetch(url)
        .then((res) => res.json())
        .then((data) => {
            saveDataToCache(url, data);
        }).catch((e) => {
            console.error('Error fetching data', e.message);
        });
}

function shouldFetchInBackground(url) {
    const data = getFromCache(url);
    if (data) {
        const { timestamp } = data;
        const now = new Date().getTime();
        const diff = now - timestamp;
        return diff > UPDATE_TIME;
    }
    return true;
}

export function useFetch(url) {

    const dataFromCache = getDataFromCache(url)
    if (dataFromCache) {
        if (shouldFetchInBackground(url)) {
            updateCacheInBackground(url)
        }
        return { data: dataFromCache, loading: false, error: null }
    }

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                setLoading(false);
                saveDataToCache(url, data);
            }).catch((e) => {
                console.error('Error fetching data', e.message);
                setError(e);
            });

    }, [url]);

    return { data, loading, error };
}