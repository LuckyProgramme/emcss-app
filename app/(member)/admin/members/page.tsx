import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AdminMembersClient from '@/components/AdminMembersClient'

export default async function AdminMembersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch all non-pending members (active + inactive)
  const { data: members, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, student_id, course, phone, gender, role, status, year_joined, avatar_url, created_at')
    .neq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="text-[#ffb4ab] text-sm">Failed to load members: {error.message}</div>
  }

  const total = members?.length ?? 0
  const active = members?.filter((m) => m.status === 'active').length ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-bold text-[#e4e2e1]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Member List
        </h1>
        <div className="flex gap-4 mt-2">
          <p className="text-sm text-[#adadad]">
            <span className="text-[#55a183] font-semibold">{active}</span> active
          </p>
          <p className="text-sm text-[#adadad]">
            <span className="text-[#e4e2e1] font-semibold">{total}</span> total processed
          </p>
        </div>
      </div>

      <AdminMembersClient members={members ?? []} />
    </div>
  )
}
