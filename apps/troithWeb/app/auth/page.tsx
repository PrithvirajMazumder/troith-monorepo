'use client'
import { signIn } from 'next-auth/react'
import { H1 } from '@troith/shared'

export default function AuthPage() {
  return (
    <>
      <H1>OAuth</H1>
      <button onClick={() => signIn('google', {
        redirect: true,
        redirectTo: '/tool'
      })}>Google Sign</button>
    </>
  )
}
