'use client'
import { Home } from './home';
import { Client } from './client';
import { useState, useEffect } from 'react';
import { LinearProgress } from '@mui/material';
import { localStorageAPI } from './localStorageAPI';
import { useFetch } from '@/useFetch';

const baseUrl = process.env.NODE_ENV === 'production' ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000';
// console.log({ baseUrl });

export default function () {
    // const cookieStore = cookies()
    // const cookie = cookieStore.get('key')
    // const userKey = cookie?.value
    // if (!userKey) {
    //     return <Client />
    // }

    // fetch(`${baseUrl}/api/enter`, {
    //     headers: {
    //         cookie: `key=${userKey}`
    //     }
    // })

    // const plansFromLocalStorage = localStorageAPI().getData('trainingPlans')



    // const [user, setUser] = useState(null);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);

    const { data, loading } = useFetch('/api/user')
    const user = data?.user

    if (loading) return <LinearProgress color="secondary" />

    if (user) {
        return <Home user={user} />
    } else {
        return <Client />
    }
}