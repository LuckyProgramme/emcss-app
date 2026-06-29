'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { X, User } from 'lucide-react'

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

type StatusFilter = 'all' | 'pending' | 'active' | 'inactive'

const statusVariant: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  active: 'default',
  pending: 'secondary',
  inactive: 'destructive',
}

const statusLabel: Record<string, { text: string; color: string }> = {
  pending:  { text: 'Awaiting Approval', color: '#c7c9ab' },
  active:   { text: 'Active Member',     color: '#55a183' },
  inactive: { text: 'Application Rejected', color: '#ffb4ab' },
}

export default function AdminDashboardClient({ members: initial }: { members: Member[] }) {
  const supabase = createClient()

  const [members, setMembers] = useState(initial)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending')
  const [selected, setSelected] = useState<Member | null>(null)
  const [updating, setUpdating] = useState(false)
  const [actionError, setActionError] = useState('')

  const counts = {
    all: members.length,
    pending: members.filter((m) => m.status === 'pending').length,
    active: members.filter((m) => m.status === 'active').length,
    inactive: members.filter((m) => m.status === 'inactive').length,
  }

  const filtered = members.filter((m) => {
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter
    const q = search.toLowerCase()
    const matchesSearch =
      m.full_name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (m.student_id ?? '').toLowerCase().includes(q) ||
      (m.course ?? '').toLowerCase().includes(q)
    return matchesStatus && matchesSearch
  })

  async function processStatus(member: Member, status: 'active' | 'inactive') {
    setUpdating(true)
    setActionError('')
    const { error } = await supabase.from('profiles').update({ status }).eq('id', member.id)
    if (error) {
      setActionError(error.message)
      setUpdating(false)
      return
    }
    // Remove from dashboard — processed members appear in the Members list page
    setMembers((prev) => prev.filter((m) => m.id !== member.id))
    setSelected(null)
    setUpdating(false)
  }

  const catalogId = selected
    ? `VQ-${selected.id.slice(0, 4).toUpperCase()}`
    : ''

  return (
    <>
      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <Input
          placeholder="Search name, email, student ID, course…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        <div className="flex gap-1 bg-[#1f2113] rounded-[0.25rem] p-1">
          {(['all', 'pending', 'active', 'inactive'] as StatusFilter[]).map((s) => (
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
      </div>

      {/* Table */}
      <div className="rounded-[0.25rem] overflow-hidden bg-[#1b1c1c]">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[rgba(70,72,50,0.2)] hover:bg-transparent">
              {['Member', 'Student ID', 'Course', 'Year', 'Status', 'Role', 'Actions'].map((h, i) => (
                <TableHead
                  key={h}
                  className={`text-[#adadad] text-xs font-medium${i === 6 ? ' text-right' : ''}`}
                  style={{ fontFamily: 'var(--font-label)' }}
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={7} className="text-center text-[#adadad] py-12 text-sm">
                  No members found.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((m) => (
              <TableRow key={m.id} className="border-b border-[rgba(70,72,50,0.12)] hover:bg-[#1f2113]/60 transition-colors">
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
                <TableCell className="text-sm text-[#c7c9ab] max-w-[140px] truncate">{m.course ?? '—'}</TableCell>
                <TableCell className="text-sm text-[#c7c9ab]">{m.year_joined ?? '—'}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[m.status]} className="capitalize text-xs">
                    {m.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize text-xs">{m.role}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7"
                    onClick={() => { setSelected(m); setActionError('') }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ── Verification Modal ─────────────────────────────────────────────── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#131408]/80 backdrop-blur-sm p-4"
          onClick={() => setSelected(null)}
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <div
            className="w-full max-w-[600px] bg-[#2a2a2a] rounded-[0.25rem] border border-[#464832]/30 relative flex flex-col"
            style={{ boxShadow: '0 0 50px rgba(231,255,4,0.08)' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Meta bar */}
            <div className="flex justify-between items-center px-6 pt-5 pb-3">
              <div
                className="flex gap-4 text-[0.65rem] font-medium tracking-[0.05em] text-[#adadad] uppercase"
                style={{ fontFamily: 'var(--font-label)' }}
              >
                <span>FILE_TYPE: .VER</span>
                <span>CATALOG_ID: {catalogId}</span>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-[#919378] hover:text-[#e4e2e1] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-8 pb-4 pt-2 flex flex-col items-center">
              <h2
                className="text-xs font-bold text-white uppercase tracking-widest mb-5"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Member Verification
              </h2>

              {/* Avatar */}
              <div
                className="w-20 h-20 rounded-[0.25rem] border-2 border-[#e7ff04] flex items-center justify-center bg-[#1b1c1c] mb-4 overflow-hidden"
                style={{ boxShadow: '0 0 15px rgba(231,255,4,0.15)' }}
              >
                {selected.avatar_url ? (
                  <img src={selected.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-[#e7ff04]" />
                )}
              </div>

              {/* Name + status */}
              <div className="text-center mb-8">
                <h3
                  className="text-xl font-semibold text-white mb-1"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {selected.full_name}
                </h3>
                <p
                  className="text-[0.75rem] font-semibold uppercase tracking-[0.1em]"
                  style={{
                    fontFamily: 'var(--font-label)',
                    color: statusLabel[selected.status]?.color ?? '#c7c9ab',
                  }}
                >
                  {statusLabel[selected.status]?.text}
                </p>
              </div>

              {/* Verification data */}
              <div className="w-full space-y-4">
                <h4
                  className="text-[0.65rem] font-medium tracking-[0.05em] text-[#adadad] uppercase border-b border-[#343627] pb-2"
                  style={{ fontFamily: 'var(--font-label)' }}
                >
                  Verification Data
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left */}
                  <div className="space-y-4">
                    <DataField label="Student ID" value={selected.student_id} />
                    <DataField label="Course / Major" value={selected.course} />
                    <DataField label="Gender" value={selected.gender} />
                  </div>
                  {/* Right */}
                  <div className="space-y-4">
                    <DataField label="Registered Contact" value={selected.email} />
                    <DataField label="Phone" value={selected.phone} />
                    <DataField label="Year Joined" value={selected.year_joined?.toString()} />
                  </div>
                </div>

                <DataField
                  label="Registered"
                  value={new Date(selected.created_at).toLocaleDateString('en-PH', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                />
              </div>

              {/* Action error */}
              {actionError && (
                <p className="text-[#ffb4ab] text-xs mt-4 text-center">{actionError}</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="px-8 pb-7 pt-2 flex gap-3">
              <button
                disabled={updating || selected.status === 'active'}
                onClick={() => processStatus(selected, 'active')}
                className="flex-1 bg-[#e7ff04] hover:bg-[#d8ef00] text-[#001c95] font-bold text-xs uppercase tracking-widest py-4 rounded-[0.25rem] transition-all disabled:opacity-40 disabled:pointer-events-none"
                style={{ fontFamily: 'var(--font-label)', boxShadow: '0 0 15px rgba(231,255,4,0.15)' }}
              >
                {updating ? 'Processing…' : 'Approve Member'}
              </button>
              <button
                disabled={updating || selected.status === 'inactive'}
                onClick={() => processStatus(selected, 'inactive')}
                className="flex-1 bg-transparent border border-[#464832] hover:bg-[#343627] text-[#ffb4ab] font-bold text-xs uppercase tracking-widest py-4 rounded-[0.25rem] transition-all disabled:opacity-40 disabled:pointer-events-none"
                style={{ fontFamily: 'var(--font-label)' }}
              >
                Reject Application
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function DataField({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="space-y-0.5">
      <p
        className="text-[0.65rem] uppercase tracking-wider text-[#55a183]"
        style={{ fontFamily: 'var(--font-label)' }}
      >
        {label}
      </p>
      <p className="text-[#e4e2e1] text-sm">{value ?? '—'}</p>
    </div>
  )
}
