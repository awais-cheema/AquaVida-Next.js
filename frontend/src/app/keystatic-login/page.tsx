'use client'

import { Suspense } from 'react'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/keystatic'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push(from)
        router.refresh()
      } else {
        setError('Incorrect password. Please try again.')
        setLoading(false)
      }
    } catch {
      setError('Connection error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0e17',
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: '#111827',
          padding: '2.5rem',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '400px',
          border: '1px solid #1f2937',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        }}
      >
        {/* Logo mark */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h1
            style={{
              color: '#f9fafb',
              fontSize: '1.375rem',
              fontWeight: 600,
              fontFamily: 'system-ui, sans-serif',
              margin: 0,
            }}
          >
            AquaVida Admin
          </h1>
          <p
            style={{
              color: '#6b7280',
              fontSize: '0.875rem',
              marginTop: '0.25rem',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            SEO Management Portal
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="password"
            style={{
              display: 'block',
              color: '#9ca3af',
              fontSize: '0.8125rem',
              fontWeight: 500,
              marginBottom: '0.375rem',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoFocus
            placeholder="Enter admin password"
            style={{
              display: 'block',
              width: '100%',
              padding: '0.625rem 0.875rem',
              background: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#f9fafb',
              fontSize: '0.9375rem',
              boxSizing: 'border-box',
              outline: 'none',
              marginBottom: '0.75rem',
              fontFamily: 'system-ui, sans-serif',
            }}
          />

          {error && (
            <p
              style={{
                color: '#f87171',
                fontSize: '0.8125rem',
                marginBottom: '0.75rem',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'block',
              width: '100%',
              padding: '0.6875rem',
              background: loading ? '#1f2937' : '#2563eb',
              color: loading ? '#6b7280' : '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.9375rem',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'system-ui, sans-serif',
              transition: 'background 0.15s',
            }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function KeystaticLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
