import { decryptData } from '@/crypto';
import { Home } from './home';
import { Client } from './client';
import { cookies } from 'next/headers'

const baseUrl = process.env.NODE_ENV === 'production' ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000';
console.log({ baseUrl });

export default async function () {
  const cookieStore = cookies()
  const cookie = cookieStore.get('key')
  const key = cookie?.value
  if (!key) {
    return <Client />
  }

  const [{ user }, { plans }] = await Promise.all([
    fetch(`${baseUrl}/api/user/`, {
      headers: {
        cookie: `key=${key}`
      }
    })
      .then(res => res.json())
      .catch((e) => {
        console.error('Error fetching data', e.message)
        return { user: null }
      })

    ,
    fetch(`${baseUrl}/api/trainingPlans/`, {
      headers: {
        cookie: `key=${key}`
      }
    })
      .then(res => res.json())
      .catch((e) => {
        console.error('Error fetching data', e.message)
        return { plans: [] }
      })

  ]).catch((e) => {
    console.error('Error fetching data', e.message)
    return [{ user: null }, { plans: [] }]
  })


  if (user) {
    return <Home user={user} trainingPlans={plans} />
  } else {
    return <Client />
  }
}