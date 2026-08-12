import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Usamos anon key — RLS tiene política public_all que permite inserts
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Acepta leads de páginas externas (Alpha Studio, Alpha Systems, InSync, etc.)
export async function POST(req: NextRequest) {
  // Validar API key
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.ALPHAFLOW_API_KEY}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 })
  }

  const {
    first_name,
    last_name,
    company,
    email,
    phone,
    instagram,
    website,
    alpha_project,
    temperature,
    quick_notes,
    service_interested,
    source,
  } = body

  if (!first_name || !alpha_project) {
    return NextResponse.json({ error: 'first_name y alpha_project son obligatorios.' }, { status: 400 })
  }

  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('leads')
    .insert([{
      first_name,
      last_name: last_name || '—',
      company: company || null,
      email: email || null,
      phone: phone || null,
      instagram: instagram || null,
      alpha_project,
      service_interested: service_interested || null,
      commercial_status: 'Nuevo lead',
      temperature: temperature || 'Frío',
      entry_channel: 'Web',
      priority: 'Media',
      quick_notes: quick_notes
        ? `[Desde ${source || alpha_project}] ${quick_notes}`
        : `Lead desde ${source || alpha_project}`,
      is_client: false,
      first_contact_date: today,
      last_contact_date: today,
    }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, id: data.id })
}
