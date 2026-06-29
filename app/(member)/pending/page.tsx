import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import ProfileForm from '@/components/ProfileForm'

export default async function PendingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    return (
      <div className="text-[#ffb4ab] text-sm">
        Could not load your profile. Please sign out and sign in again.
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-5">
      {/* Pending banner */}
      <div className="bg-[#e7ff04]/8 border border-[#e7ff04]/20 rounded-[0.25rem] px-5 py-4 flex items-start gap-3">
        <span className="text-xl mt-0.5">⏳</span>
        <div>
          <p className="font-semibold text-[#e4e2e1] text-sm" style={{ fontFamily: 'var(--font-display)' }}>
            Your account is pending approval
          </p>
          <p className="text-sm text-[#c7c9ab] mt-1">
            An EMCSS admin will review your registration and activate your account.
            You will have full access once approved. In the meantime, complete your profile below.
          </p>
        </div>
      </div>

      <div className="bg-[#1b1c1c] rounded-[0.25rem] p-6">
        <p className="text-xs text-[#adadad] mb-5" style={{ fontFamily: 'var(--font-label)' }}>
          COMPLETE YOUR PROFILE WHILE YOU WAIT
        </p>
        <ProfileForm profile={profile} />
      </div>
    </div>
  )
}
