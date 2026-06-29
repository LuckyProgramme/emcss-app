'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User, Mail, Lock, ArrowRight, Hexagon, ShieldCheck, Phone, BookOpen, Hash, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// ─── Types ────────────────────────────────────────────────────────────────────

type SignupField =
  | 'full_name' | 'email' | 'password' | 'confirmPassword'
  | 'student_id' | 'course' | 'phone' | 'gender' | 'year_joined'

type SignupState = {
  full_name: string
  email: string
  password: string
  confirmPassword: string
  student_id: string
  course: string
  phone: string
  gender: string
  year_joined: string
  loading: boolean
  googleLoading: boolean
  error: string
  success: boolean
}

// ─── ViewModel ────────────────────────────────────────────────────────────────

function useSignupViewModel() {
  const supabase = createClient()

  const [state, setState] = useState<SignupState>({
    full_name: '', email: '', password: '', confirmPassword: '',
    student_id: '', course: '', phone: '', gender: '', year_joined: '',
    loading: false, googleLoading: false, error: '', success: false,
  })

  function setField(field: SignupField, value: string) {
    setState((s) => ({ ...s, [field]: value, error: '' }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (state.password !== state.confirmPassword) {
      setState((s) => ({ ...s, error: 'Passwords do not match.' }))
      return
    }
    if (state.password.length < 6) {
      setState((s) => ({ ...s, error: 'Password must be at least 6 characters.' }))
      return
    }

    setState((s) => ({ ...s, loading: true, error: '' }))

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: state.email,
      password: state.password,
      options: { data: { full_name: state.full_name } },
    })

    if (signUpError) {
      setState((s) => ({ ...s, loading: false, error: signUpError.message }))
      return
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').upsert(
        {
          id: data.user.id,
          full_name: state.full_name,
          email: state.email,
          student_id: state.student_id || null,
          course: state.course || null,
          phone: state.phone || null,
          gender: state.gender || null,
          year_joined: state.year_joined ? parseInt(state.year_joined) : null,
        },
        { onConflict: 'id', ignoreDuplicates: true }
      )

      if (profileError) {
        setState((s) => ({
          ...s, loading: false,
          error: `Account created but profile save failed: ${profileError.message}`,
        }))
        return
      }
    }

    setState((s) => ({ ...s, loading: false, success: true }))
  }

  async function signInWithGoogle() {
    setState((s) => ({ ...s, googleLoading: true, error: '' }))
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return { state, setField, handleSubmit, signInWithGoogle }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldInput({
  icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
}: {
  icon: React.ReactNode
  type?: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  required?: boolean
}) {
  return (
    <div className="relative flex items-center">
      <span className="absolute left-4 w-4 h-4 text-[#919378] pointer-events-none">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#2a2a2a] text-[#e4e2e1] placeholder-[#919378] pl-11 pr-4 py-3 rounded-[0.25rem] focus:outline-none focus:bg-[#343627] transition-all border-none text-sm"
        style={{ boxShadow: 'inset 2px 0 0 transparent' }}
        onFocus={(e) => (e.currentTarget.style.boxShadow = 'inset 2px 0 0 #e7ff04')}
        onBlur={(e) => (e.currentTarget.style.boxShadow = 'inset 2px 0 0 transparent')}
      />
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="block text-[0.75rem] font-medium tracking-[0.05em] text-[#adadad] uppercase mb-2"
      style={{ fontFamily: 'var(--font-label)' }}
    >
      {children}
    </label>
  )
}

// ─── Success screen ───────────────────────────────────────────────────────────

function SuccessScreen({ email }: { email: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1b1c1c]" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="w-full max-w-sm flex flex-col items-center gap-5 px-6 py-10 text-center">
        <div className="w-14 h-14 rounded-full bg-[#1e331f] flex items-center justify-center">
          <ShieldCheck className="w-7 h-7 text-[#e7ff04]" />
        </div>
        <h2 className="text-2xl font-bold text-[#e4e2e1]" style={{ fontFamily: 'var(--font-display)' }}>
          Check your email
        </h2>
        <p className="text-sm text-[#c7c9ab] leading-relaxed">
          We sent a confirmation link to{' '}
          <strong className="text-[#e4e2e1]">{email}</strong>. Click it to verify
          your account, then sign in.
        </p>
        <p className="text-xs text-[#adadad]">
          Your account will be reviewed by an admin before you get full access.
        </p>
        <Link href="/login" className="text-sm text-[#e7ff04] font-medium hover:underline">
          Back to sign in
        </Link>
      </div>
    </div>
  )
}

// ─── View ─────────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const { state, setField, handleSubmit, signInWithGoogle } = useSignupViewModel()

  if (state.success) return <SuccessScreen email={state.email} />

  return (
    <div
      className="min-h-screen flex w-full bg-[#1b1c1c] text-[#e4e2e1]"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {/* ── Left branding panel ─────────────────────────────────────────── */}
      <div className="hidden lg:flex w-1/2 bg-[#1e331f] flex-col justify-between p-12 relative overflow-hidden">

        {/* Abstract circular art */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 1000 1000" fill="none">
            <ellipse cx="500" cy="500" rx="300" ry="300" stroke="#e7ff04" strokeWidth="8" strokeLinecap="round" strokeDasharray="10 20" />
            <ellipse cx="500" cy="500" rx="250" ry="250" stroke="#bdd100" strokeWidth="12" strokeLinecap="round" strokeDasharray="20 10" />
            <ellipse cx="500" cy="500" rx="200" ry="200" stroke="#e7ff04" strokeWidth="16" strokeLinecap="round" strokeDasharray="10 5" />
            <path d="M500 200 C 600 300, 400 400, 500 500 S 600 700, 500 800" stroke="#55a183" strokeWidth="10" strokeLinecap="round" />
            <ellipse cx="300" cy="300" rx="100" ry="100" stroke="#e7ff04" strokeWidth="6" />
            <ellipse cx="700" cy="700" rx="150" ry="150" stroke="#55a183" strokeWidth="8" />
          </svg>
        </div>

        {/* Logo + hero */}
        <div className="space-y-16 z-10">
          <div className="flex items-center gap-3" style={{ fontFamily: 'var(--font-display)' }}>
            <Hexagon className="w-7 h-7 text-[#e7ff04]" />
            <span className="text-2xl font-bold text-white">EMCSS</span>
          </div>

          <div className="max-w-xl space-y-6">
            <h1
              className="text-[3.5rem] font-bold text-white leading-[1.1] tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Join the <br />
              <span className="text-[#e7ff04]">Vibrant Hub.</span>
            </h1>
            <p className="text-sm leading-relaxed text-[#c7c9ab]">
              Register as an EMCSS member. Fill in your details, verify your email,
              and an admin will activate your account.
            </p>
          </div>
        </div>

        {/* Version badge */}
        <div
          className="inline-flex items-center gap-2 bg-[#131408]/40 border border-[#464832]/30 px-3 py-1.5 rounded-[0.25rem] backdrop-blur-md text-[0.75rem] font-medium tracking-widest text-[#55a183] z-10 w-fit"
          style={{ fontFamily: 'var(--font-label)' }}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          SYSTEM BUILD V2.4.0
        </div>
      </div>

      {/* ── Right form panel ────────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-start justify-center p-8 sm:p-12 lg:p-16 overflow-y-auto">
        <div className="w-full max-w-[400px] space-y-7 py-4">

          {/* Header */}
          <div>
            <h2
              className="text-[1.75rem] font-semibold text-white leading-[1.2]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Create Account
            </h2>
            <p className="text-[#c7c9ab] mt-2 text-sm">
              Register for EMCSS membership.
            </p>
          </div>

          {/* Error banner */}
          {state.error && (
            <div className="bg-[#ffb4ab]/10 border border-[#ffb4ab]/30 text-[#ffb4ab] text-xs rounded-[0.25rem] px-4 py-3">
              {state.error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* Required fields */}
            <div className="space-y-4">
              <div>
                <FieldLabel>Full Name *</FieldLabel>
                <FieldInput
                  icon={<User className="w-4 h-4" />}
                  placeholder="Juan Dela Cruz"
                  value={state.full_name}
                  onChange={(v) => setField('full_name', v)}
                  required
                />
              </div>

              <div>
                <FieldLabel>Email Address *</FieldLabel>
                <FieldInput
                  icon={<Mail className="w-4 h-4" />}
                  type="email"
                  placeholder="hello@emcss.hub"
                  value={state.email}
                  onChange={(v) => setField('email', v)}
                  required
                />
              </div>

              <div>
                <FieldLabel>Password *</FieldLabel>
                <FieldInput
                  icon={<Lock className="w-4 h-4" />}
                  type="password"
                  placeholder="Min. 6 characters"
                  value={state.password}
                  onChange={(v) => setField('password', v)}
                  required
                />
              </div>

              <div>
                <FieldLabel>Confirm Password *</FieldLabel>
                <FieldInput
                  icon={<Lock className="w-4 h-4" />}
                  type="password"
                  placeholder="Re-enter password"
                  value={state.confirmPassword}
                  onChange={(v) => setField('confirmPassword', v)}
                  required
                />
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-[#343627]" />
              <span
                className="text-[0.7rem] text-[#919378]"
                style={{ fontFamily: 'var(--font-label)' }}
              >
                OPTIONAL INFO
              </span>
              <div className="h-[1px] flex-1 bg-[#343627]" />
            </div>

            {/* Optional fields */}
            <div className="space-y-4">
              <div>
                <FieldLabel>Student ID</FieldLabel>
                <FieldInput
                  icon={<Hash className="w-4 h-4" />}
                  placeholder="e.g. 2023-12345"
                  value={state.student_id}
                  onChange={(v) => setField('student_id', v)}
                />
              </div>

              <div>
                <FieldLabel>Course / Program</FieldLabel>
                <FieldInput
                  icon={<BookOpen className="w-4 h-4" />}
                  placeholder="e.g. BS Computer Science"
                  value={state.course}
                  onChange={(v) => setField('course', v)}
                />
              </div>

              <div>
                <FieldLabel>Phone Number</FieldLabel>
                <FieldInput
                  icon={<Phone className="w-4 h-4" />}
                  placeholder="e.g. 09123456789"
                  value={state.phone}
                  onChange={(v) => setField('phone', v)}
                />
              </div>

              <div>
                <FieldLabel>Gender</FieldLabel>
                <Select value={state.gender} onValueChange={(v) => setField('gender', v ?? '')}>
                  <SelectTrigger className="bg-[#2a2a2a] border-0 text-[#e4e2e1] rounded-[0.25rem] h-[46px] text-sm focus:outline-none focus:bg-[#343627] focus:ring-0" style={{ boxShadow: 'none' }}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#353535] border-[rgba(70,72,50,0.3)] text-[#e4e2e1] rounded-[0.25rem]">
                    <SelectItem value="Male" className="focus:bg-[#2a2a2a] focus:text-[#e4e2e1]">Male</SelectItem>
                    <SelectItem value="Female" className="focus:bg-[#2a2a2a] focus:text-[#e4e2e1]">Female</SelectItem>
                    <SelectItem value="Prefer not to say" className="focus:bg-[#2a2a2a] focus:text-[#e4e2e1]">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <FieldLabel>Year Joined</FieldLabel>
                <FieldInput
                  icon={<Calendar className="w-4 h-4" />}
                  type="number"
                  placeholder="e.g. 2024"
                  value={state.year_joined}
                  onChange={(v) => setField('year_joined', v)}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={state.loading}
              className="w-full flex items-center justify-center gap-2 bg-[#e7ff04] hover:bg-[#d8ef00] text-[#001c95] font-semibold py-3.5 rounded-[0.25rem] transition-all disabled:opacity-50 disabled:pointer-events-none mt-2"
            >
              <span
                className="text-[0.75rem] tracking-widest uppercase"
                style={{ fontFamily: 'var(--font-label)' }}
              >
                {state.loading ? 'Creating account…' : 'Create Account'}
              </span>
              {!state.loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
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

          {/* Sign in link */}
          <p className="text-center text-sm text-[#919378]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#e4e2e1] hover:text-[#e7ff04] font-medium transition-colors">
              Sign in
            </Link>
          </p>

          <p
            className="text-center text-[0.65rem] text-[#919378]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            By registering, you agree to the{' '}
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
