'use client'
import { Client } from './client';
import { LinearProgress } from '@mui/material';
import { useFetch } from '@/useFetch';
import dynamic from 'next/dynamic'


// const baseUrl = process.env.NODE_ENV === 'production' ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000';
// console.log({ baseUrl });

const HomeLazy = dynamic(() => import('./home'), { ssr: false })

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
        return <HomeLazy user={user} />
    } else {
        return <Client />
    }
}