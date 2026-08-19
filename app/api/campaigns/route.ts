import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getRecipients(alpha_project: string, temperature: string, is_client: string | null) {
  let query = supabase
    .from('leads')
    .select('id, first_name, last_name, email, alpha_project')
    .not('email', 'is', null)

  if (alpha_project) query = query.eq('alpha_project', alpha_project)
  if (temperature) query = query.eq('temperature', temperature)
  if (is_client === 'true') query = query.eq('is_client', true)
  if (is_client === 'false') query = query.eq('is_client', false)

  const { data, error } = await query
  if (error) return []
  return (data ?? []).filter(l => l.email)
}

// GET — preview de destinatarios (lista completa)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const alpha_project = searchParams.get('alpha_project') ?? ''
  const temperature = searchParams.get('temperature') ?? ''
  const is_client = searchParams.get('is_client')

  const recipients = await getRecipients(alpha_project, temperature, is_client)
  return NextResponse.json({ count: recipients.length, recipients })
}

// POST — envío real
export async function POST(req: NextRequest) {
  const { subject, body, fromName, replyTo, filter, attachments } = await req.json()

  if (!subject || !body) {
    return NextResponse.json({ error: 'Faltan subject o body.' }, { status: 400 })
  }

  const recipients = await getRecipients(
    filter?.alpha_project ?? '',
    filter?.temperature ?? '',
    filter?.is_client !== undefined ? String(filter.is_client) : null
  )

  if (recipients.length === 0) {
    return NextResponse.json({ error: 'No hay destinatarios con email.' }, { status: 400 })
  }

  const from = `${fromName || 'Nahuel'} <noreply@nahuelcontent.com>`

  // Preparar adjuntos (base64 → Buffer)
  const resendAttachments = (attachments ?? []).map((a: { filename: string; content: string }) => ({
    filename: a.filename,
    content: Buffer.from(a.content, 'base64'),
  }))

  const results = { sent: 0, failed: 0, errors: [] as string[] }

  // Enviar en lotes de 50
  for (let i = 0; i < recipients.length; i += 50) {
    const chunk = recipients.slice(i, i + 50)
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
        ...(resendAttachments.length > 0 && { attachments: resendAttachments }),
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

  return NextResponse.json({ ok: true, sent: results.sent, failed: results.failed, errors: results.errors })
}
