import type { PagesFunction } from '@cloudflare/workers-types';
interface Env {
  RESEND_API_KEY: string;
  CONTACT_EMAIL: string;
  TURNSTILE_SECRET_KEY: string;
}

async function verifyTurnstile(token: string, secret: string, ip: string | null): Promise<boolean> {
  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', token);
  if (ip) body.set('remoteip', ip);

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  const outcome = await res.json() as { success: boolean };
  return outcome.success === true;
}

const CORS_ORIGIN = 'https://nio.gt';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const headers = {
    'Access-Control-Allow-Origin': CORS_ORIGIN,
    'Content-Type': 'application/json',
  };

  try {
    const data = await request.formData();
    const nombre = data.get('nombre') as string;
    const empresa = data.get('empresa') as string;
    const contacto = data.get('contacto') as string;
    const problema = data.get('problema') as string;
    const turnstileToken = data.get('cf-turnstile-response') as string;

    if (!nombre || !contacto || !problema) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Campos incompletos.' }),
        { status: 400, headers }
      );
    }

    if (!turnstileToken) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Verificación de seguridad faltante.' }),
        { status: 400, headers }
      );
    }

    const clientIp = request.headers.get('CF-Connecting-IP');
    const humano = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, clientIp);

    if (!humano) {
      return new Response(
        JSON.stringify({ ok: false, error: 'No se pudo verificar que sos humano. Intentá de nuevo.' }),
        { status: 403, headers }
      );
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'NioSystems Web <web@nio.gt>',
        to: [env.CONTACT_EMAIL],
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

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });

  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ ok: false, error: 'Error interno.' }),
      { status: 500, headers }
    );
  }
};

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': CORS_ORIGIN,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });