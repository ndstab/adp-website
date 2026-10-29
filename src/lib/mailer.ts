import {site} from '@/content';

type Mail = {subject: string; text: string; replyTo?: string};

/**
 * Delivers form submissions through Resend (RESEND_API_KEY) or SMTP (SMTP_HOST).
 * With neither configured, development logs the message and production fails loudly.
 */
export async function sendMail({subject, text, replyTo}: Mail) {
  const to = process.env.CONTACT_TO_EMAIL || site.email;
  const from = process.env.CONTACT_FROM_EMAIL || `website@${site.domain}`;

  if (process.env.RESEND_API_KEY) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({from, to: [to], subject, text, reply_to: replyTo})
    });
    if (!res.ok) throw new Error(`Resend responded ${res.status}`);
    return;
  }

  if (process.env.SMTP_HOST) {
    const nodemailer = await import('nodemailer');
    const port = Number(process.env.SMTP_PORT || 587);
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: process.env.SMTP_USER ? {user: process.env.SMTP_USER, pass: process.env.SMTP_PASS} : undefined
    });
    await transport.sendMail({from, to, subject, text, replyTo});
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.info(`[mail:dev] ${subject}\n${text}`);
    return;
  }
  throw new Error('No mail transport configured: set RESEND_API_KEY or SMTP_HOST');
}
