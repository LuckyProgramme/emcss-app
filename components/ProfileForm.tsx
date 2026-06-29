'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Profile = {
  id: string
  full_name: string
  email: string
  student_id: string | null
  role: 'admin' | 'member'
  status: 'active' | 'inactive' | 'pending'
  year_joined: number | null
  avatar_url: string | null
  course: string | null
  phone: string | null
  gender: string | null
}

const statusVariant: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  active: 'default',
  pending: 'secondary',
  inactive: 'destructive',
}

export default function ProfileForm({ profile }: { profile: Profile }) {
  const supabase = createClient()
  const [studentId, setStudentId] = useState(profile.student_id ?? '')
  const [yearJoined, setYearJoined] = useState(profile.year_joined?.toString() ?? '')
  const [course, setCourse] = useState(profile.course ?? '')
  const [phone, setPhone] = useState(profile.phone ?? '')
  const [gender, setGender] = useState(profile.gender ?? '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSave() {
    setSaving(true)
    setMessage('')

    const { error } = await supabase
      .from('profiles')
      .update({
        student_id: studentId || null,
        year_joined: yearJoined ? parseInt(yearJoined) : null,
        course: course || null,
        phone: phone || null,
        gender: gender || null,
      })
      .eq('id', profile.id)

    setSaving(false)
    setMessage(error ? `Error: ${error.message}` : 'Profile saved!')
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Avatar + name header */}
      <div className="flex items-center gap-4">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt="avatar"
            className="w-14 h-14 rounded-full object-cover ring-2 ring-[#e7ff04]/30"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-[#1e331f] flex items-center justify-center text-2xl font-bold text-[#e7ff04]">
            {profile.full_name?.[0] ?? '?'}
          </div>
        )}
        <div>
          <h2
            className="text-lg font-bold text-[#e4e2e1]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {profile.full_name}
          </h2>
          <p className="text-sm text-[#adadad]">{profile.email}</p>
          <div className="flex gap-1.5 mt-1.5">
            <Badge variant={statusVariant[profile.status] ?? 'secondary'} className="capitalize">
              {profile.status}
            </Badge>
            <Badge variant="outline" className="capitalize">{profile.role}</Badge>
          </div>
        </div>
      </div>

      <div className="border-t border-[rgba(70,72,50,0.2)]" />

      {/* Editable fields */}
      <div className="grid gap-4 max-w-md">
        <div className="space-y-1.5">
          <Label htmlFor="student_id" className="text-[#c7c9ab] text-xs">Student ID</Label>
          <Input
            id="student_id"
            placeholder="e.g. 2023-12345"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="course" className="text-[#c7c9ab] text-xs">Course / Program</Label>
          <Input
            id="course"
            placeholder="e.g. BS Computer Science"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-[#c7c9ab] text-xs">Phone Number</Label>
          <Input
            id="phone"
            placeholder="e.g. 09123456789"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="gender" className="text-[#c7c9ab] text-xs">Gender</Label>
          <Select value={gender} onValueChange={(v) => setGender(v ?? '')}>
            <SelectTrigger id="gender" className="bg-[#2a2a2a] border-0 text-[#e4e2e1] rounded-[0.25rem] h-9">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="bg-[#353535] border-[rgba(70,72,50,0.3)] text-[#e4e2e1] rounded-[0.25rem]">
              <SelectItem value="Male" className="focus:bg-[#2a2a2a] focus:text-[#e4e2e1]">Male</SelectItem>
              <SelectItem value="Female" className="focus:bg-[#2a2a2a] focus:text-[#e4e2e1]">Female</SelectItem>
              <SelectItem value="Prefer not to say" className="focus:bg-[#2a2a2a] focus:text-[#e4e2e1]">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="year_joined" className="text-[#c7c9ab] text-xs">Year Joined</Label>
          <Input
            id="year_joined"
            type="number"
            placeholder="e.g. 2023"
            min={2000}
            max={new Date().getFullYear()}
            value={yearJoined}
            onChange={(e) => setYearJoined(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 pt-1">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
          {message && (
            <p className={`text-sm ${message.startsWith('Error') ? 'text-[#ffb4ab]' : 'text-[#55a183]'}`}>
              {message}
            </p>
          )}
        </div>
      </div>

      <div className="text-xs text-[#adadad] space-y-1 pt-3 border-t border-[rgba(70,72,50,0.2)]">
        <p>Name and email are managed by your sign-in provider and cannot be changed here.</p>
        <p>Role and status are managed by your organization admin.</p>
      </div>
    </div>
  )
}
