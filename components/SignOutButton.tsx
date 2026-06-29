'use client'

import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SignOutButton() {
  const supabase = createClient()
  const router = useRouter()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <button
      onClick={handleSignOut}
      className="w-full text-left px-3 py-2 text-sm text-[#adadad] hover:text-[#e4e2e1] hover:bg-[#1f2113] rounded-[0.25rem] transition-colors"
    >
      Sign out
    </button>
  )
}
