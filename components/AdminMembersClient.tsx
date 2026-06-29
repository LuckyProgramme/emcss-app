'use client'

import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { ArrowUpDown } from 'lucide-react'

type Member = {
  id: string
  full_name: string
  email: string
  student_id: string | null
  course: string | null
  phone: string | null
  gender: string | null
  role: 'admin' | 'member'
  status: 'active' | 'inactive' | 'pending'
  year_joined: number | null
  avatar_url: string | null
  created_at: string
}

type SortKey = 'newest' | 'oldest' | 'name-asc' | 'name-desc'
type StatusFilter = 'active' | 'inactive' | 'all'

const statusVariant: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  active: 'default',
  pending: 'secondary',
  inactive: 'destructive',
}

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'name-asc', label: 'Name A → Z' },
  { value: 'name-desc', label: 'Name Z → A' },
]

export default function AdminMembersClient({ members: initial }: { members: Member[] }) {
  const supabase = createClient()

  const [members, setMembers] = useState(initial)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortKey>('newest')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('active')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const counts = {
    active: members.filter((m) => m.status === 'active').length,
    inactive: members.filter((m) => m.status === 'inactive').length,
    all: members.length,
  }

  const displayList = useMemo(() => {
    let list = members.filter((m) => {
      if (statusFilter !== 'all' && m.status !== statusFilter) return false
      const q = search.toLowerCase()
      return (
        m.full_name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.student_id ?? '').toLowerCase().includes(q) ||
        (m.course ?? '').toLowerCase().includes(q)
      )
    })

    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'newest': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'name-asc': return a.full_name.localeCompare(b.full_name)
        case 'name-desc': return b.full_name.localeCompare(a.full_name)
      }
    })

    return list
  }, [members, search, sort, statusFilter])

  async function toggleRole(member: Member) {
    const newRole = member.role === 'admin' ? 'member' : 'admin'
    setUpdatingId(member.id)
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', member.id)
    if (!error) {
      setMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, role: newRole } : m))
      )
    }
    setUpdatingId(null)
  }

  async function deactivate(member: Member) {
    setUpdatingId(member.id)
    const { error } = await supabase
      .from('profiles')
      .update({ status: 'inactive' })
      .eq('id', member.id)
    if (!error) {
      setMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, status: 'inactive' } : m))
      )
    }
    setUpdatingId(null)
  }

  async function reactivate(member: Member) {
    setUpdatingId(member.id)
    const { error } = await supabase
      .from('profiles')
      .update({ status: 'active' })
      .eq('id', member.id)
    if (!error) {
      setMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, status: 'active' } : m))
      )
    }
    setUpdatingId(null)
  }

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
        <Input
          placeholder="Search name, email, student ID, course…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        {/* Status filter */}
        <div className="flex gap-1 bg-[#1f2113] rounded-[0.25rem] p-1">
          {(['active', 'inactive', 'all'] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-[0.25rem] text-xs font-medium capitalize transition-colors ${
                statusFilter === s
                  ? 'bg-[#2a2a2a] text-[#e4e2e1]'
                  : 'text-[#adadad] hover:text-[#c7c9ab]'
              }`}
              style={{ fontFamily: 'var(--font-label)' }}
            >
              {s} <span className="opacity-50">({counts[s]})</span>
            </button>
          ))}
        </div>

        {/* Sort control */}
        <div className="flex items-center gap-2 ml-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#adadad]" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="bg-[#2a2a2a] text-[#e4e2e1] text-xs rounded-[0.25rem] border-0 px-3 py-1.5 outline-none focus:bg-[#353535] cursor-pointer"
            style={{ fontFamily: 'var(--font-label)' }}
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[0.25rem] overflow-hidden bg-[#1b1c1c]">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[rgba(70,72,50,0.2)] hover:bg-transparent">
              {['Member', 'Student ID', 'Course', 'Year', 'Status', 'Role', 'Registered', 'Actions'].map((h, i) => (
                <TableHead
                  key={h}
                  className={`text-[#adadad] text-xs font-medium${i === 7 ? ' text-right' : ''}`}
                  style={{ fontFamily: 'var(--font-label)' }}
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayList.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={8} className="text-center text-[#adadad] py-12 text-sm">
                  No members found.
                </TableCell>
              </TableRow>
            )}
            {displayList.map((m) => {
              const busy = updatingId === m.id
              return (
                <TableRow
                  key={m.id}
                  className="border-b border-[rgba(70,72,50,0.12)] hover:bg-[#1f2113]/60 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {m.avatar_url ? (
                        <img src={m.avatar_url} className="w-8 h-8 rounded-full object-cover" alt="" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#1e331f] flex items-center justify-center text-[#e7ff04] text-xs font-bold">
                          {m.full_name[0]}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-[#e4e2e1]">{m.full_name}</p>
                        <p className="text-xs text-[#adadad]">{m.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-[#c7c9ab]">{m.student_id ?? '—'}</TableCell>
                  <TableCell className="text-sm text-[#c7c9ab] max-w-[130px] truncate">{m.course ?? '—'}</TableCell>
                  <TableCell className="text-sm text-[#c7c9ab]">{m.year_joined ?? '—'}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[m.status]} className="capitalize text-xs">
                      {m.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize text-xs">{m.role}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-[#adadad]">
                    {new Date(m.created_at).toLocaleDateString('en-PH', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1.5 justify-end flex-wrap">
                      {/* Role toggle */}
                      <button
                        disabled={busy}
                        onClick={() => toggleRole(m)}
                        className="px-2 py-1 text-[0.65rem] font-medium uppercase tracking-wider rounded-[0.25rem] border border-[rgba(70,72,50,0.4)] text-[#e7ff04] hover:bg-[#e7ff04]/10 transition-colors disabled:opacity-40"
                        style={{ fontFamily: 'var(--font-label)' }}
                      >
                        {m.role === 'admin' ? 'Demote' : 'Make Admin'}
                      </button>

                      {/* Status toggle */}
                      {m.status === 'active' ? (
                        <button
                          disabled={busy}
                          onClick={() => deactivate(m)}
                          className="px-2 py-1 text-[0.65rem] font-medium uppercase tracking-wider rounded-[0.25rem] border border-[#ffb4ab]/30 text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-colors disabled:opacity-40"
                          style={{ fontFamily: 'var(--font-label)' }}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          disabled={busy}
                          onClick={() => reactivate(m)}
                          className="px-2 py-1 text-[0.65rem] font-medium uppercase tracking-wider rounded-[0.25rem] border border-[#55a183]/30 text-[#55a183] hover:bg-[#55a183]/10 transition-colors disabled:opacity-40"
                          style={{ fontFamily: 'var(--font-label)' }}
                        >
                          Reactivate
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
