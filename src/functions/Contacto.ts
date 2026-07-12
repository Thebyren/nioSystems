
// functions/api/contacto.ts
// Cloudflare Pages Function — recibe el POST del formulario
// y reenvía el mensaje a tu email vía Resend (gratuito hasta 3k/mes).
//
// Configurar en Cloudflare Pages → Settings → Environment variables:
//   RESEND_API_KEY = re_xxxxxxxxxx   (obtener en resend.com)
//   CONTACT_EMAIL  = hola@nio.gt

interface Env {
  RESEND_API_KEY: string;
  CONTACT_EMAIL:  string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // CORS básico
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const data = await request.formData();
    const nombre   = data.get('nombre')   as string;
    const empresa  = data.get('empresa')  as string;
    const contacto = data.get('contacto') as string;
    const problema = data.get('problema') as string;

    if (!nombre || !contacto || !problema) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Campos incompletos.' }),
        { status: 400, headers }
      );
    }

    // Enviar via Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:    'NioSystems Web <web@nio.gt>',
        to:      [env.CONTACT_EMAIL],
        subject: `Contacto web — ${nombre}${empresa ? ` (${empresa})` : ''}`,
        text: [
          `Nombre:   ${nombre}`,
          `Empresa:  ${empresa || '—'}`,
          `Contacto: ${contacto}`,
          '',
          `Problema:`,
          problema,
        ].join('\n'),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Resend error:', err);
      return new Response(
        JSON.stringify({ ok: false, error: 'Error al enviar.' }),
        { status: 500, headers }
      );
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers }
    );

  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ ok: false, error: 'Error interno.' }),
      { status: 500, headers }
    );
  }
};

// Preflight CORS
export const onRequestOptions: PagesFunction = async () =>
  new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin':  'https://nio.gt',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });