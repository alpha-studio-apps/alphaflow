import { Lead, Task, Service, EmailTemplate, Proposal, ContactHistory } from '@/types'

export const mockLeads: Lead[] = []

export const mockTasks: Task[] = []

export const mockServices: Service[] = [
  {
    id: '1',
    alpha_project: 'NahuelContent',
    name: 'Dirección creativa',
    description: 'Servicio para ordenar el mensaje, definir cómo debe ser percibido el profesional y transformar su conocimiento en contenido estratégico.',
    ideal_client: 'Profesionales con experiencia que sienten que su contenido no los representa.',
    problem_solved: 'Falta de claridad, dirección y posicionamiento.',
    deliverables: 'Dirección mensual de contenido, revisión de piezas, estrategia editorial.',
    base_price: 150000,
    currency: 'ARS',
    duration: 'Mensual',
    active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '2',
    alpha_project: 'Alpha Studio',
    name: 'Producción mensual de contenido',
    description: 'Jornada mensual de producción + edición + piezas listas para publicar.',
    ideal_client: 'Marcas que necesitan contenido profesional constante.',
    problem_solved: 'Falta de contenido visual ordenado y profesional.',
    deliverables: 'Fotos, videos, reels, stories, piezas gráficas.',
    base_price: 200000,
    currency: 'ARS',
    duration: 'Mensual',
    active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '3',
    alpha_project: 'Alpha Systems',
    name: 'Implementación CRM',
    description: 'Sistema para ordenar leads, etapas, tareas, seguimiento y reportes.',
    ideal_client: 'Negocios que reciben consultas pero pierden oportunidades por falta de seguimiento.',
    problem_solved: 'Desorden comercial, leads sin seguimiento, oportunidades perdidas.',
    deliverables: 'CRM configurado, pipeline de ventas, flujos de seguimiento.',
    base_price: 80000,
    currency: 'ARS',
    duration: 'Proyecto único',
    active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '4',
    alpha_project: 'Alpha Athlete',
    name: 'Highlights deportivos',
    description: 'Edición de highlights, presentación deportiva y perfil visual.',
    ideal_client: 'Deportistas que necesitan mostrarse profesionalmente.',
    problem_solved: 'Falta de material deportivo claro, atractivo y profesional.',
    deliverables: 'Video de highlights, perfil deportivo, contenido para redes.',
    base_price: 45000,
    currency: 'ARS',
    duration: 'Por proyecto',
    active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
]

export const mockEmailTemplates: EmailTemplate[] = [
  {
    id: '1',
    title: 'NahuelContent — Respuesta cuando pide más info',
    alpha_project: 'NahuelContent',
    service_id: '1',
    commercial_stage: 'Respuesta cuando pide más información',
    recommended_temperature: 'Tibio',
    subject: 'Sobre cómo trabajo la dirección creativa',
    body: `Hola [Nombre], ¿cómo estás?

Te cuento brevemente cómo trabajo.

Mi enfoque no es simplemente ayudarte a publicar más contenido, sino ordenar qué querés comunicar, cómo querés ser percibido/a y cómo transformar tu experiencia en contenido que realmente te posicione.

Normalmente empezamos con un diagnóstico de tu perfil, tu mensaje actual y el tipo de cliente o audiencia que querés atraer. A partir de eso, armamos una dirección clara para que cada contenido tenga intención y no sea solamente una publicación más.

La idea es que tu contenido empiece a representar mejor lo que sabés, lo que hacés y el nivel profesional que querés transmitir.

Si te parece, puedo pasarte cómo sería la modalidad de trabajo y qué incluiría.`,
    active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Alpha Studio — Respuesta cuando pide más info',
    alpha_project: 'Alpha Studio',
    service_id: '2',
    commercial_stage: 'Respuesta cuando pide más información',
    recommended_temperature: 'Tibio',
    subject: 'Sobre cómo podríamos trabajar tu contenido',
    body: `Hola [Nombre], ¿cómo estás?

Te cuento brevemente cómo trabajamos desde Alpha Studio.

La idea es ayudarte a resolver la producción de contenido de una forma más ordenada y profesional, para que tu marca tenga material visual claro, consistente y listo para publicar.

Normalmente trabajamos con una planificación previa, una jornada de producción y luego la edición de las piezas necesarias para el mes.

No se trata solo de grabar o sacar fotos, sino de que el contenido tenga una intención clara y represente bien lo que la marca quiere comunicar.

Si querés, puedo pasarte una modalidad posible según lo que necesite [Marca].`,
    active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '3',
    title: 'Alpha Systems — Respuesta cuando pide más info',
    alpha_project: 'Alpha Systems',
    service_id: '3',
    commercial_stage: 'Respuesta cuando pide más información',
    recommended_temperature: 'Tibio',
    subject: 'Sobre cómo podríamos ordenar tu sistema comercial',
    body: `Hola [Nombre], ¿cómo estás?

Te cuento un poco cómo trabajamos desde Alpha Systems.

La idea no es sumar una herramienta más porque sí, sino ordenar todo el proceso comercial: desde que entra una consulta hasta que se hace seguimiento, se agenda, se vende o se reactiva más adelante.

Muchas veces el problema no es la falta de leads, sino que no hay un sistema claro para saber en qué estado está cada persona, qué se le respondió, qué falta hacer y cuándo volver a contactarla.

Lo que hacemos es armar un sistema simple para que puedas ver tus oportunidades, ordenar tus contactos, seguir cada caso y no perder ventas por desorganización.

Si querés, puedo hacerte unas preguntas rápidas para entender cómo están manejando hoy las consultas y decirte qué sistema tendría más sentido.`,
    active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '4',
    title: 'Alpha Athlete — Respuesta cuando pide más info',
    alpha_project: 'Alpha Athlete',
    service_id: '4',
    commercial_stage: 'Respuesta cuando pide más información',
    recommended_temperature: 'Tibio',
    subject: 'Sobre cómo podemos armar tu material deportivo',
    body: `Hola [Nombre], ¿cómo estás?

Te cuento brevemente cómo trabajamos desde Alpha Athlete.

La idea es ayudarte a mostrarte de una forma más profesional como deportista, ordenando tu material y transformándolo en piezas claras, atractivas y fáciles de compartir.

Podemos trabajar highlights, videos para enviar a clubes, perfil deportivo y contenido para que tu Instagram comunique mejor tu nivel.

No se trata solo de editar jugadas lindas, sino de mostrar tu rendimiento con criterio y dirección.

Si querés, puedo pasarte qué necesitaríamos para empezar y qué opciones tendría más sentido según tu caso.`,
    active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '5',
    title: 'NahuelContent — Seguimiento suave después de propuesta',
    alpha_project: 'NahuelContent',
    service_id: '1',
    commercial_stage: 'Seguimiento suave',
    recommended_temperature: 'Caliente',
    subject: 'Sobre la propuesta que te envié',
    body: `Hola [Nombre], ¿cómo vas?

Te escribo para ver si tuviste oportunidad de revisar lo que te envié.

Quedo disponible si tenés alguna pregunta o si querés que ajustemos algo antes de arrancar.`,
    active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
]

export const mockProposals: Proposal[] = []

export const mockHistory: ContactHistory[] = []
