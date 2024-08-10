'use client'
import { Home } from './home';
import { Client } from './client';
import { useState, useEffect } from 'react';
import { LinearProgress } from '@mui/material';
import { localStorageAPI } from './localStorageAPI';

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

    const plansFromLocalStorage = localStorageAPI().getData('trainingPlans')



    const [user, setUser] = useState(null);
    const [plans, setPlans] = useState(plansFromLocalStorage || []);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);



    async function getData() {
        setLoading(true)
        const dataToFetch = {
            user: {
                url: '',
                default: null
            },
            plans: {
                url: '/api/trainingPlans/',
                default: []
            }
        }

        fetch(`/api/user/`)
            .then(res => res.json())
            .then(data => {
                setUser(data.user)
                setLoading(false)

            })
            .catch((e) => {
                console.error('Error fetching data', e.message)
            })

        fetch(`/api/trainingPlans/`)
            .then(res => res.json())
            .then(data => {
                setPlans(data.plans)
                localStorageAPI().saveData('trainingPlans', data.plans)
            })
            .catch((e) => {
                console.error('Error fetching data', e.message)
            })



    }

    useEffect(() => {
        getData()
    }, [])

    if (loading) return <LinearProgress color="secondary" />

    if (user) {
        return <Home user={user} trainingPlans={plans} />
    } else {
        return <Client />
    }
}