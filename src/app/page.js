'use client'
import { Client } from './client';
import { LinearProgress } from '@mui/material';
import { useFetch } from '@/useFetch';
import dynamic from 'next/dynamic'


const HomeLazy = dynamic(() => import('./home').then(m => m.Home), { ssr: false })

export default function () {


    const { data, loading } = useFetch('/api/user', { shouldUsecache: true });
    const user = data?.user

    if (loading) return <LinearProgress color="secondary" />

    if (user) {
        return <HomeLazy user={user} />
    } else {
        return <Client />
    }
}