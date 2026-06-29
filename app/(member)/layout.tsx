import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SignOutButton from '@/components/SignOutButton'

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url, role, status')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin'

  return (
    <div className="flex min-h-screen bg-[#131408]">
      {/* Sidebar */}
      <aside className="w-56 bg-[#1b1c1c]/80 backdrop-blur-xl fixed top-0 left-0 h-full flex flex-col border-r border-[rgba(70,72,50,0.15)]">
        {/* Logo */}
        <div className="px-5 py-5">
          <div className="text-2xl mb-1">📚</div>
          <h1
            className="text-sm font-bold text-[#e4e2e1] tracking-wide"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            EMCSS Archive
          </h1>
        </div>

        {/* User info */}
        <div className="px-5 py-3 mb-1 flex items-center gap-3">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="avatar" className="w-8 h-8 rounded-full object-cover ring-1 ring-[#e7ff04]/30" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#1e331f] flex items-center justify-center text-xs font-bold text-[#e7ff04]">
              {profile?.full_name?.[0] ?? '?'}
            </div>
          )}
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-[#e4e2e1] truncate">{profile?.full_name ?? 'Member'}</p>
            <p className="text-[10px] text-[#adadad] capitalize" style={{ fontFamily: 'var(--font-label)' }}>
              {profile?.role ?? 'member'}
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 flex flex-col gap-0.5">
          <Link
            href="/profile"
            className="flex items-center gap-2.5 px-3 py-2 rounded-[0.25rem] text-sm text-[#c7c9ab] hover:text-[#e4e2e1] hover:bg-[#1f2113] transition-colors"
          >
            <span className="text-base">👤</span>
            My Profile
          </Link>
          <Link
            href="/card"
            className="flex items-center gap-2.5 px-3 py-2 rounded-[0.25rem] text-sm text-[#c7c9ab] hover:text-[#e4e2e1] hover:bg-[#1f2113] transition-colors"
          >
            <span className="text-base">🪪</span>
            My Card
          </Link>

          {isAdmin && (
            <>
              <p
                className="mt-5 mb-1 px-3 text-[10px] text-[#adadad] uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-label)' }}
              >
                Admin
              </p>
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2.5 px-3 py-2 rounded-[0.25rem] text-sm text-[#c7c9ab] hover:text-[#e4e2e1] hover:bg-[#1f2113] transition-colors"
              >
                <span className="text-base">🛠️</span>
                Dashboard
              </Link>
              <Link
                href="/admin/members"
                className="flex items-center gap-2.5 px-3 py-2 rounded-[0.25rem] text-sm text-[#c7c9ab] hover:text-[#e4e2e1] hover:bg-[#1f2113] transition-colors"
              >
                <span className="text-base">👥</span>
                Members
              </Link>
            </>
          )}
        </nav>

        {/* Sign out */}
        <div className="px-3 py-4">
          <SignOutButton />
        </div>
      </aside>

      <main className="ml-56 flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
