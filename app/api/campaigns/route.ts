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

function buildHtml(bodyText: string, hasImage: boolean): string {
  const imgBlock = hasImage
    ? `<img src="cid:emailbanner" alt="" style="width:100%;max-width:600px;display:block;border-radius:8px;margin-bottom:28px"/>`
    : ''
  const paragraphs = bodyText
    .split('\n')
    .map(l => l.trim() === '' ? '<br/>' : `<p style="margin:0 0 14px;line-height:1.6">${l}</p>`)
    .join('')
  return `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;color:#111111;background:#ffffff">${imgBlock}${paragraphs}</body></html>`
}

// GET — lista completa de destinatarios
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
  const { subject, body, fromName, replyTo, filter, attachments, profileImage } = await req.json()

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
  const hasImage = !!profileImage

  // Adjuntos PDF
  const pdfAttachments = (attachments ?? []).map((a: { filename: string; content: string }) => ({
    filename: a.filename,
    content: a.content,
    content_type: 'application/pdf',
  }))

  // Imagen de portada como inline attachment (CID)
  const imageAttachment = hasImage ? (() => {
    const base64 = profileImage.includes(',') ? profileImage.split(',')[1] : profileImage
    const contentType = profileImage.match(/data:([^;]+)/)?.[1] ?? 'image/jpeg'
    return {
      filename: 'banner.jpg',
      content: base64,
      content_type: contentType,
      headers: {
        'Content-ID': '<emailbanner>',
        'Content-Disposition': 'inline; filename="banner.jpg"',
      },
    }
  })() : null

  const allAttachments = [
    ...(imageAttachment ? [imageAttachment] : []),
    ...pdfAttachments,
  ]

  const results = { sent: 0, failed: 0 }

  // Envíos individuales (más confiable con adjuntos)
  for (const lead of recipients) {
    const firstName = lead.first_name || 'Hola'
    const personalizedBody = body
      .replace(/\[Nombre\]/g, firstName)
      .replace(/\[nombre\]/g, firstName)

    try {
      await resend.emails.send({
        from,
        to: lead.email as string,
        replyTo: replyTo || 'nahuelcontent@gmail.com',
        subject,
        html: buildHtml(personalizedBody, hasImage),
        ...(allAttachments.length > 0 && { attachments: allAttachments }),
      })
      results.sent++
    } catch {
      results.failed++
    }
  }

  return NextResponse.json({ ok: true, sent: results.sent, failed: results.failed })
}
