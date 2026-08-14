import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const { subject, body, fromName, replyTo, filter } = await req.json()

  if (!subject || !body) {
    return NextResponse.json({ error: 'Faltan subject o body.' }, { status: 400 })
  }

  // Obtener leads según el filtro
  let query = supabase.from('leads').select('id, first_name, last_name, email, alpha_project')
    .not('email', 'is', null)

  if (filter?.alpha_project) query = query.eq('alpha_project', filter.alpha_project)
  if (filter?.temperature) query = query.eq('temperature', filter.temperature)
  if (filter?.is_client !== undefined) query = query.eq('is_client', filter.is_client)

  const { data: leads, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const recipients = (leads ?? []).filter(l => l.email)
  if (recipients.length === 0) {
    return NextResponse.json({ error: 'No hay destinatarios con email.' }, { status: 400 })
  }

  const from = `${fromName || 'Nahuel'} <noreply@nahuelcontent.com>`

  // Enviar en lotes de 50 (límite de Resend batch)
  const results = { sent: 0, failed: 0, errors: [] as string[] }

  const chunks = []
  for (let i = 0; i < recipients.length; i += 50) {
    chunks.push(recipients.slice(i, i + 50))
  }

  for (const chunk of chunks) {
    const emails = chunk.map(lead => {
      const firstName = lead.first_name || 'Hola'
      const personalizedBody = body
        .replace(/\[Nombre\]/g, firstName)
        .replace(/\[nombre\]/g, firstName)

      return {
        from,
        to: lead.email as string,
        reply_to: replyTo || 'nahuelcontent@gmail.com',
        subject,
        text: personalizedBody,
      }
    })

    try {
      await resend.batch.send(emails)
      results.sent += chunk.length
    } catch (err: unknown) {
      results.failed += chunk.length
      results.errors.push(err instanceof Error ? err.message : String(err))
    }
  }

  return NextResponse.json({
    ok: true,
    sent: results.sent,
    failed: results.failed,
    total: recipients.length,
    errors: results.errors,
  })
}

// Preview: cuántos destinatarios tiene el filtro
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const alpha_project = searchParams.get('alpha_project') || ''
  const temperature = searchParams.get('temperature') || ''
  const is_client = searchParams.get('is_client')

  let query = supabase.from('leads').select('id, first_name, email, alpha_project', { count: 'exact' })
    .not('email', 'is', null)

  if (alpha_project) query = query.eq('alpha_project', alpha_project)
  if (temperature) query = query.eq('temperature', temperature)
  if (is_client === 'true') query = query.eq('is_client', true)
  if (is_client === 'false') query = query.eq('is_client', false)

  const { count, data } = await query
  return NextResponse.json({ count: count ?? 0, sample: (data ?? []).slice(0, 3) })
}
