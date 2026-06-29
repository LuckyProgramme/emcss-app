import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AdminDashboardClient from '@/components/AdminDashboardClient'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: members, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, student_id, course, phone, gender, role, status, year_joined, avatar_url, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="text-[#ffb4ab] text-sm">Failed to load members: {error.message}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-bold text-[#e4e2e1]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Member Dashboard
        </h1>
        <p className="text-sm text-[#adadad] mt-1">{members?.length ?? 0} total members</p>
      </div>
      <AdminDashboardClient members={members ?? []} />
    </div>
  )
}
