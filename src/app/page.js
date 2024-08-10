import { decryptData } from '@/crypto';
import { Home } from './home';
import { Client } from './client';
import { cookies } from 'next/headers'

const baseUrl = process.env.NODE_ENV === 'production' ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000';
// console.log({ baseUrl });

export default async function () {
    const cookieStore = cookies()
    const cookie = cookieStore.get('key')
    const userKey = cookie?.value
    if (!userKey) {
        return <Client />
    }

    fetch(`${baseUrl}/api/enter`, {
        headers: {
            cookie: `key=${userKey}`
        }
    })

    const dataToFetch = {
        user: {
            url: '/api/user/',
            default: null
        },
        plans: {
            url: '/api/trainingPlans/',
            default: []
        }
    }

    const data = Object.assign(...await Promise.all(Object.entries(dataToFetch).map(async ([key, { url, default: defaultValue }]) => {
        return fetch(`${baseUrl}${url}`, {
            headers: {
                cookie: `key=${userKey}`
            }
        })
            .then(res => res.json())
            .then(data => ({ [key]: data[key] }))
            .catch((e) => {
                console.error('Error fetching data', e.message)
                return { [key]: defaultValue }
            })
    })))

    // console.log({ data });

    const { user, plans } = data

    if (user) {
        return <Home user={user} trainingPlans={plans} />
    } else {
        return <Client />
    }
}