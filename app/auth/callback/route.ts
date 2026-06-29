import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // OAuth provider returned an error
  if (error) {
    console.error('[auth/callback] OAuth error:', error, errorDescription)
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorDescription ?? error)}`)
  }

  if (!code) {
    console.error('[auth/callback] No code in callback URL')
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    console.error('[auth/callback] exchangeCodeForSession error:', exchangeError.message)
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(exchangeError.message)}`)
  }

  // Get the newly authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('[auth/callback] getUser error:', userError?.message)
    return NextResponse.redirect(`${origin}/login?error=no_user`)
  }

  // Fallback: ensure a profile row exists in case the DB trigger didn't fire
  const { error: upsertError } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      full_name: user.user_metadata?.name ?? user.email,
      email: user.email!,
      avatar_url: user.user_metadata?.picture ?? null,
    },
    { onConflict: 'id', ignoreDuplicates: true }
  )

  if (upsertError) {
    console.error('[auth/callback] profile upsert error:', upsertError.message)
  }

  return NextResponse.redirect(`${origin}/profile`)
}
