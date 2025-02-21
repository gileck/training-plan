'use client'
import { useEffect } from 'react';

export function Client() {

  useEffect(() => {
    const tryToLogin = async () => {
      const { user } = await fetch(`/api/user`).then(res => res.json());
      if (!user.username) {
        window.location.href = '/login';
      } else {
        window.location.href = '/';
      }
    }
    tryToLogin();
  }, [])

  return <div></div>
}