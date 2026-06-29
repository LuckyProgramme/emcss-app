import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, Users, ShieldCheck, QrCode } from 'lucide-react'
import ProfileForm from '@/components/ProfileForm'

// ─── Static activity feed (hardcoded; real data from activity_log TBD) ────────

const activityFeed = [
  {
    icon: FileText,
    title: 'Protocol Blueprint Uploaded',
    subtitle: 'SYSTEM ARCHITECTURE',
    time: '2 HOURS AGO',
    accent: '#55a183',
  },
  {
    icon: Users,
    title: 'Node Synchronization Meeting',
    subtitle: 'SECTOR 4',
    time: 'YESTERDAY',
    accent: '#c7c9ab',
  },
  {
    icon: ShieldCheck,
    title: 'Security Clearance Renewed',
    subtitle: 'ADMINISTRATIVE',
    time: 'OCT 13, 2025',
    accent: '#c7c9ab',
  },
]

// ─── Status badge styles ──────────────────────────────────────────────────────

const statusStyle: Record<string, { bg: string; text: string; label: string }> = {
  active:   { bg: 'rgba(85,161,131,0.2)',  text: '#55a183', label: 'ACTIVE STATUS' },
  pending:  { bg: 'rgba(231,255,4,0.12)',  text: '#b8cc00', label: 'PENDING APPROVAL' },
  inactive: { bg: 'rgba(255,180,171,0.15)', text: '#ffb4ab', label: 'INACTIVE' },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProfilePage() {
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
      <p className="text-[#ffb4ab] text-sm">
        Could not load your profile. Please sign out and sign in again.
      </p>
    )
  }

  const status = statusStyle[profile.status] ?? statusStyle.pending
  const roleLabel = (profile.role as string).toUpperCase()
  const initials = profile.full_name?.[0]?.toUpperCase() ?? '?'

  return (
    <div
      className="max-w-5xl mx-auto space-y-10"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {/* ── Hero header ──────────────────────────────────────────────────── */}
      <header className="space-y-4">
        <h1
          className="text-[3rem] md:text-[3.5rem] font-bold text-[#e4e2e1] leading-[1.1] tracking-[-0.02em] uppercase"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {profile.full_name}
        </h1>

        <div className="flex gap-3 flex-wrap">
          {/* Status badge */}
          <span
            className="px-4 py-1.5 rounded-[0.25rem] text-xs font-bold tracking-wider"
            style={{
              backgroundColor: status.bg,
              color: status.text,
              fontFamily: 'var(--font-label)',
            }}
          >
            {status.label}
          </span>

          {/* Year joined badge */}
          {profile.year_joined && (
            <span
              className="px-4 py-1.5 rounded-[0.25rem] text-xs font-bold tracking-wider"
              style={{
                backgroundColor: 'rgba(199,201,171,0.15)',
                color: '#c7c9ab',
                fontFamily: 'var(--font-label)',
              }}
            >
              MEMBER SINCE {profile.year_joined}
            </span>
          )}
        </div>
      </header>

      {/* ── Main grid: Identity Card + Access Pass ────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">

        {/* Core Identity Card */}
        <div
          className="bg-[#1b1c1c] rounded-[0.25rem] p-6 relative"
          style={{ boxShadow: '0 0 30px rgba(85,161,131,0.12)' }}
        >
          {/* Verified tag */}
          <div
            className="absolute top-0 right-0 bg-[#55a183] text-[#002116] text-xs font-bold px-4 py-2 rounded-bl-none rounded-[0.25rem] uppercase tracking-wider"
            style={{ fontFamily: 'var(--font-label)', borderRadius: '0 0.25rem 0 0.25rem' }}
          >
            VERIFIED // HUB
          </div>

          <div className="flex flex-col md:flex-row gap-6 mt-4">
            {/* Avatar / photo */}
            <div className="w-full md:w-44 shrink-0 aspect-[3/4] bg-[#131408] rounded-[0.25rem] overflow-hidden flex items-center justify-center">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span
                  className="text-5xl font-bold text-[#e7ff04]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {initials}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col justify-between py-2">
              <div>
                <h3
                  className="text-white text-2xl font-bold mb-3"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Core Identity
                </h3>
                <p className="text-[#c7c9ab] text-sm leading-relaxed">
                  {profile.course
                    ? `Enrolled in ${profile.course}.`
                    : 'EMCSS member.'}{' '}
                  Part of the Entertainment Multimedia Computing Students Society
                  digital network. Connect, collaborate, and grow.
                </p>
              </div>

              {/* Stat boxes */}
              <div className="flex gap-4 mt-6">
                <div className="bg-[#131408] rounded-[0.25rem] p-4 flex-1 border border-[rgba(70,72,50,0.2)]">
                  <p
                    className="text-[0.65rem] text-[#adadad] uppercase tracking-widest mb-1"
                    style={{ fontFamily: 'var(--font-label)' }}
                  >
                    Role
                  </p>
                  <p
                    className="text-[#e4e2e1] text-xl font-bold"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {roleLabel}
                  </p>
                </div>
                <div className="bg-[#131408] rounded-[0.25rem] p-4 flex-1 border border-[rgba(70,72,50,0.2)]">
                  <p
                    className="text-[0.65rem] text-[#adadad] uppercase tracking-widest mb-1"
                    style={{ fontFamily: 'var(--font-label)' }}
                  >
                    Year Joined
                  </p>
                  <p
                    className="text-[#55a183] text-xl font-bold"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {profile.year_joined ?? '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Digital Access Pass */}
        <div className="bg-[#1b1c1c] rounded-[0.25rem] p-6 flex flex-col justify-between border border-[rgba(70,72,50,0.2)]">
          <div className="flex justify-between items-center mb-4">
            <h3
              className="text-[#adadad] text-xs tracking-widest uppercase"
              style={{ fontFamily: 'var(--font-label)' }}
            >
              Digital Access Pass
            </h3>
            <QrCode className="w-5 h-5 text-[#adadad]" />
          </div>

          {/* QR placeholder grid */}
          <div className="flex-1 bg-[#131408] rounded-[0.25rem] p-6 flex items-center justify-center mb-4 relative overflow-hidden min-h-[180px]">
            {/* Decorative QR-like blocks */}
            <div className="grid grid-cols-6 gap-1.5 opacity-60">
              {Array.from({ length: 36 }).map((_, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-[0.1rem]"
                  style={{
                    backgroundColor:
                      [0,1,6,7,5,11,12,18,24,30,35,25,29,13,19,23].includes(i)
                        ? '#e7ff04'
                        : [2,4,8,14,20,26,32,33,34,15,21,27].includes(i)
                        ? '#55a183'
                        : '#2a2a2a',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex items-center justify-center gap-2 p-3 bg-[#55a183]/10 rounded-[0.25rem] mb-3">
            <ShieldCheck className="w-4 h-4 text-[#55a183]" />
            <span
              className="text-[#55a183] text-xs font-bold"
              style={{ fontFamily: 'var(--font-label)' }}
            >
              ACTIVE &amp; SECURE
            </span>
          </div>

          <Link
            href="/card"
            className="block text-center text-xs text-[#adadad] hover:text-[#e7ff04] transition-colors uppercase tracking-widest"
            style={{ fontFamily: 'var(--font-label)' }}
          >
            View Full Card →
          </Link>
        </div>
      </section>

      {/* ── Activity Feed ──────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <p
          className="text-[0.7rem] text-[#adadad] uppercase tracking-[0.2em]"
          style={{ fontFamily: 'var(--font-label)' }}
        >
          Activity Feed
        </p>

        {activityFeed.map((item, i) => {
          const Icon = item.icon
          return (
            <div
              key={i}
              className="bg-[#1b1c1c] rounded-[0.25rem] p-5 flex items-center justify-between border border-[rgba(70,72,50,0.15)] transition-all hover:border-[rgba(85,161,131,0.2)]"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-[0.25rem] bg-[#131408] flex items-center justify-center border border-[rgba(70,72,50,0.2)] shrink-0">
                  <Icon className="w-5 h-5" style={{ color: item.accent }} />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">{item.title}</h4>
                  <p
                    className="text-[#55a183] text-xs uppercase tracking-widest mt-0.5"
                    style={{ fontFamily: 'var(--font-label)' }}
                  >
                    {item.subtitle}
                  </p>
                </div>
              </div>
              <span
                className="text-[#adadad] text-xs uppercase tracking-widest shrink-0 ml-4"
                style={{ fontFamily: 'var(--font-label)' }}
              >
                {item.time}
              </span>
            </div>
          )
        })}
      </section>

      {/* ── Edit profile section ───────────────────────────────────────────── */}
      <section className="pt-4 border-t border-[rgba(70,72,50,0.2)]">
        <p
          className="text-[0.7rem] text-[#adadad] uppercase tracking-[0.2em] mb-5"
          style={{ fontFamily: 'var(--font-label)' }}
        >
          Update Profile
        </p>
        <div className="bg-[#1b1c1c] rounded-[0.25rem] p-6">
          <ProfileForm profile={profile} />
        </div>
      </section>
    </div>
  )
}
