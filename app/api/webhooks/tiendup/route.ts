import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Tiendup envía eventos de ventas/inscripciones/suscripciones.
// Cada evento trae un objeto con datos del comprador y el producto.
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 })
  }

  const event = body.event as string | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (body.data ?? body) as Record<string, any>

  // Extraer datos del comprador según estructura de Tiendup
  const buyer =
    data.buyer ?? data.customer ?? data.contact ?? data.user ?? data.enrollment ?? {}

  const fullName: string =
    buyer.name ?? buyer.full_name ?? buyer.nombre ??
    `${buyer.first_name ?? ''} ${buyer.last_name ?? ''}`.trim() ?? 'Comprador'

  const nameParts = fullName.trim().split(/\s+/)
  const firstName = nameParts[0] || 'Comprador'
  const lastName = nameParts.slice(1).join(' ') || '—'

  const email: string | null = buyer.email ?? data.email ?? null
  const phone: string | null = buyer.phone ?? buyer.whatsapp ?? data.phone ?? null
  const instagram: string | null = buyer.instagram ?? null

  const productName: string =
    data.product?.name ?? data.order?.items?.[0]?.name ??
    data.course?.name ?? data.plan?.name ?? data.subscription?.name ?? ''

  const amount: number =
    data.total ?? data.order?.total ?? data.amount ?? 22500

  const today = new Date().toISOString().split('T')[0]

  // Mapeo de evento → temperatura y estado
  const eventMap: Record<string, { temperature: string; status: string; label: string }> = {
    'orders.payment_paid':        { temperature: 'Caliente', status: 'Cliente activo', label: 'Compra confirmada' },
    'orders.creation':            { temperature: 'Tibio',    status: 'Nuevo lead',     label: 'Nueva orden' },
    'learning.course_enrollment': { temperature: 'Caliente', status: 'Cliente activo', label: 'Inscripción a curso' },
    'learning.course_completed':  { temperature: 'Caliente', status: 'Cliente activo', label: 'Curso completado' },
    'subscriptions.activated':    { temperature: 'Caliente', status: 'Cliente activo', label: 'Suscripción activa' },
    'events.event_enrollment':    { temperature: 'Tibio',    status: 'Nuevo lead',     label: 'Inscripción a evento' },
    'downloadables.content_access': { temperature: 'Tibio', status: 'Nuevo lead',     label: 'Descargó contenido' },
  }

  const meta = eventMap[event ?? ''] ?? { temperature: 'Frío', status: 'Nuevo lead', label: event ?? 'Tiendup' }
  const isClient = meta.status === 'Cliente activo'

  const notes = [
    meta.label,
    productName && `Producto: ${productName}`,
    amount != null && `Monto: $${amount}`,
    event && `Evento: ${event}`,
  ].filter(Boolean).join(' | ')

  // Buscar si ya existe un lead con ese email para no duplicar
  if (email) {
    const { data: existing } = await supabase
      .from('leads')
      .select('id, is_client')
      .eq('email', email)
      .eq('alpha_project', 'ProJump')
      .maybeSingle()

    if (existing) {
      // Actualizar si la compra lo convierte en cliente
      if (isClient && !existing.is_client) {
        await supabase
          .from('leads')
          .update({
            is_client: true,
            commercial_status: 'Cliente activo',
            temperature: 'Caliente',
            last_contact_date: today,
            quick_notes: notes,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
      }
      return NextResponse.json({ ok: true, action: 'updated', id: existing.id })
    }
  }

  // Crear nuevo lead
  const { data: created, error } = await supabase
    .from('leads')
    .insert([{
      first_name: firstName,
      last_name: lastName,
      email: email || null,
      phone: phone || null,
      instagram: instagram || null,
      alpha_project: 'ProJump',
      commercial_status: meta.status,
      temperature: meta.temperature,
      entry_channel: 'Web',
      priority: isClient ? 'Alta' : 'Media',
      is_client: isClient,
      quick_notes: notes,
      service_interested: productName || null,
      estimated_value: amount || null,
      currency: 'ARS',
      first_contact_date: today,
      last_contact_date: today,
    }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, action: 'created', id: created.id })
}
