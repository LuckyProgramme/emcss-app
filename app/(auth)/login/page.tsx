'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, ArrowRight, Hexagon, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase'

// ─── Types ────────────────────────────────────────────────────────────────────

type LoginField = 'email' | 'password'

type LoginState = {
  email: string
  password: string
  loading: boolean
  googleLoading: boolean
  error: string
}

// ─── ViewModel ────────────────────────────────────────────────────────────────

function useLoginViewModel() {
  const supabase = createClient()
  const router = useRouter()

  const [state, setState] = useState<LoginState>({
    email: '',
    password: '',
    loading: false,
    googleLoading: false,
    error: '',
  })

  function setField(field: LoginField, value: string) {
    setState((s) => ({ ...s, [field]: value, error: '' }))
  }

  async function signInWithEmail(e: React.FormEvent) {
    e.preventDefault()
    setState((s) => ({ ...s, loading: true, error: '' }))

    const { error } = await supabase.auth.signInWithPassword({
      email: state.email,
      password: state.password,
    })

    if (error) {
      setState((s) => ({ ...s, loading: false, error: error.message }))
      return
    }

    router.push('/profile')
  }

  async function signInWithGoogle() {
    setState((s) => ({ ...s, googleLoading: true, error: '' }))
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return { state, setField, signInWithEmail, signInWithGoogle }
}

// ─── View ─────────────────────────────────────────────────────────────────────

function LoginForm() {
  const searchParams = useSearchParams()
  const redirectError = searchParams.get('error')
  const { state, setField, signInWithEmail, signInWithGoogle } = useLoginViewModel()

  const displayError = redirectError ? decodeURIComponent(redirectError) : state.error

  return (
    <div
      className="min-h-screen flex w-full bg-[#1b1c1c] text-[#e4e2e1]"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {/* ── Left branding panel (desktop only) ─────────────────────────── */}
      <div className="hidden lg:flex w-1/2 bg-[#1e331f] flex-col justify-between p-12 relative overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute -top-32 -right-24 w-[30rem] h-[30rem] bg-[#e7ff04] rounded-full mix-blend-overlay opacity-10 blur-[100px]" />
        <div className="absolute -bottom-32 -left-24 w-[30rem] h-[30rem] bg-[#55a183] rounded-full mix-blend-overlay opacity-20 blur-[100px]" />

        {/* Logo */}
        <div
          className="flex items-center gap-2 text-white font-bold text-xl z-10"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <Hexagon className="text-[#e7ff04] w-6 h-6" />
          <span>EMCSS</span>
        </div>

        {/* Hero text */}
        <div className="max-w-md z-10">
          <h1
            className="text-[3.5rem] font-bold text-white leading-[1.1] tracking-[-0.02em] mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Enter the <br />
            <span className="text-[#e7ff04]">Vibrant Hub.</span>
          </h1>
          <p className="text-[#c7c9ab] text-base leading-relaxed mt-4">
            A digital environment that feels alive. Connect, collaborate, and
            experience the next generation of community spaces.
          </p>
        </div>

        {/* Version badge */}
        <div className="z-10">
          <div
            className="inline-flex items-center gap-2 bg-[#131408]/40 border border-[#464832]/30 px-3 py-1.5 rounded-[0.25rem] backdrop-blur-md text-[0.75rem] font-medium tracking-widest text-[#55a183]"
            style={{ fontFamily: 'var(--font-label)' }}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            SYSTEM BUILD V2.4.0
          </div>
        </div>
      </div>

      {/* ── Right login panel ───────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-[#1b1c1c]">
        <div className="w-full max-w-[400px] space-y-8">

          {/* Header */}
          <div>
            <h2
              className="text-[1.75rem] font-semibold text-white leading-[1.2]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Welcome Back
            </h2>
            <p className="text-[#c7c9ab] mt-2 text-sm">
              Secure access to your dashboard.
            </p>
          </div>

          {/* Error banner */}
          {displayError && (
            <div className="bg-[#ffb4ab]/10 border border-[#ffb4ab]/30 text-[#ffb4ab] text-xs rounded-[0.25rem] px-4 py-3">
              {displayError}
            </div>
          )}

          {/* Email / password form */}
          <form className="space-y-6" onSubmit={signInWithEmail}>
            {/* Email */}
            <div className="space-y-2">
              <label
                className="text-[0.75rem] font-medium tracking-[0.05em] text-[#adadad] uppercase block"
                style={{ fontFamily: 'var(--font-label)' }}
              >
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-4 h-4 text-[#919378] pointer-events-none" />
                <input
                  type="email"
                  placeholder="hello@emcss.hub"
                  required
                  value={state.email}
                  onChange={(e) => setField('email', e.target.value)}
                  className="w-full bg-[#2a2a2a] text-[#e4e2e1] placeholder-[#919378] pl-11 pr-4 py-3.5 rounded-[0.25rem] focus:outline-none focus:bg-[#343627] transition-all border-none text-sm"
                  style={{ boxShadow: 'inset 2px 0 0 transparent' }}
                  onFocus={(e) => (e.currentTarget.style.boxShadow = 'inset 2px 0 0 #e7ff04')}
                  onBlur={(e) => (e.currentTarget.style.boxShadow = 'inset 2px 0 0 transparent')}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  className="text-[0.75rem] font-medium tracking-[0.05em] text-[#adadad] uppercase"
                  style={{ fontFamily: 'var(--font-label)' }}
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#e4e2e1] hover:text-[#e7ff04] transition-colors font-medium"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-4 h-4 text-[#919378] pointer-events-none" />
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={state.password}
                  onChange={(e) => setField('password', e.target.value)}
                  className="w-full bg-[#2a2a2a] text-[#e4e2e1] placeholder-[#505050] pl-11 pr-4 py-3.5 rounded-[0.25rem] focus:outline-none focus:bg-[#343627] transition-all border-none text-sm"
                  style={{ boxShadow: 'inset 2px 0 0 transparent' }}
                  onFocus={(e) => (e.currentTarget.style.boxShadow = 'inset 2px 0 0 #e7ff04')}
                  onBlur={(e) => (e.currentTarget.style.boxShadow = 'inset 2px 0 0 transparent')}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={state.loading}
              className="w-full flex items-center justify-center gap-2 bg-[#e7ff04] hover:bg-[#d8ef00] text-[#001c95] font-semibold py-3.5 rounded-[0.25rem] transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              <span
                className="text-[0.75rem] tracking-widest uppercase"
                style={{ fontFamily: 'var(--font-label)' }}
              >
                {state.loading ? 'Signing in…' : 'Sign in to Hub'}
              </span>
              {!state.loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 py-1">
            <div className="h-[1px] flex-1 bg-[#343627]" />
            <span
              className="text-[0.75rem] text-[#919378] font-medium"
              style={{ fontFamily: 'var(--font-label)' }}
            >
              OR
            </span>
            <div className="h-[1px] flex-1 bg-[#343627]" />
          </div>

          {/* Google OAuth */}
          <button
            type="button"
            disabled={state.googleLoading}
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-[#15353a] font-medium py-3.5 rounded-[0.25rem] transition-all disabled:opacity-50 disabled:pointer-events-none text-sm"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {state.googleLoading ? 'Redirecting…' : 'Continue with Google'}
          </button>

          {/* Signup link */}
          <p className="text-center text-sm text-[#919378]">
            New member?{' '}
            <Link
              href="/signup"
              className="text-[#e4e2e1] hover:text-[#e7ff04] font-medium transition-colors"
            >
              Sign up here
            </Link>
          </p>

          {/* Footer */}
          <p
            className="text-center text-[0.65rem] text-[#919378]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            By authenticating, you agree to the{' '}
            <a href="#" className="text-[#e4e2e1] hover:text-white font-medium transition-colors">
              Protocols
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Page (Suspense boundary for useSearchParams) ─────────────────────────────

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
