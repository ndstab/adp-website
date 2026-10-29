'use server';

import {headers} from 'next/headers';
import {z} from 'zod';
import {pillarIds} from '@/content/schema';
import {sendMail} from '@/lib/mailer';
import {rateLimit} from '@/lib/rate-limit';

export type FormState =
  | {status: 'idle'}
  | {status: 'success'}
  | {status: 'error'; error: 'validation' | 'rate' | 'server'; fields?: string[]};

async function clientKey(form: string) {
  const h = await headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown';
  return `${form}:${ip}`;
}

// Bots fill every field, including the visually hidden "website" one.
const isBot = (data: FormData) => Boolean(data.get('website'));

const Contact = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  company: z.string().trim().min(1).max(160),
  phone: z
    .string()
    .trim()
    .max(30)
    .refine((v) => v === '' || /^\+?[0-9\s()-]{7,20}$/.test(v)),
  interest: z.enum([...pillarIds, 'other']),
  message: z.string().trim().min(5).max(4000),
  consent: z.literal('on'),
  locale: z.enum(['ar', 'en'])
});

export async function submitContact(_prev: FormState, data: FormData): Promise<FormState> {
  if (isBot(data)) return {status: 'success'};

  const parsed = Contact.safeParse(Object.fromEntries(data));
  if (!parsed.success) {
    return {status: 'error', error: 'validation', fields: [...new Set(parsed.error.issues.map((i) => String(i.path[0])))]};
  }
  if (!rateLimit(await clientKey('contact'))) return {status: 'error', error: 'rate'};

  const f = parsed.data;
  try {
    await sendMail({
      subject: `Website enquiry: ${f.company} (${f.interest})`,
      replyTo: f.email,
      text: [
        `Name: ${f.name}`,
        `E-mail: ${f.email}`,
        `Company: ${f.company}`,
        `Phone: ${f.phone || '-'}`,
        `Area of interest: ${f.interest}`,
        `Language: ${f.locale}`,
        `PDPL consent: given at ${new Date().toISOString()}`,
        '',
        f.message
      ].join('\n')
    });
    return {status: 'success'};
  } catch (err) {
    console.error('[contact] delivery failed', err);
    return {status: 'error', error: 'server'};
  }
}

const Newsletter = z.object({
  email: z.string().trim().email().max(200),
  consent: z.literal('on'),
  locale: z.enum(['ar', 'en'])
});

export async function subscribeNewsletter(_prev: FormState, data: FormData): Promise<FormState> {
  if (isBot(data)) return {status: 'success'};

  const parsed = Newsletter.safeParse(Object.fromEntries(data));
  if (!parsed.success) {
    return {status: 'error', error: 'validation', fields: [...new Set(parsed.error.issues.map((i) => String(i.path[0])))]};
  }
  if (!rateLimit(await clientKey('newsletter'))) return {status: 'error', error: 'rate'};

  try {
    await sendMail({
      subject: 'Newsletter sign-up',
      replyTo: parsed.data.email,
      text: `E-mail: ${parsed.data.email}\nLanguage: ${parsed.data.locale}\nConsent: given at ${new Date().toISOString()}`
    });
    return {status: 'success'};
  } catch (err) {
    console.error('[newsletter] delivery failed', err);
    return {status: 'error', error: 'server'};
  }
}

const Alliance = z.object({
  company: z.string().trim().min(1).max(160),
  website: z.string().trim().max(200).optional().default(''),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z
    .string()
    .trim()
    .max(30)
    .refine((v) => v === '' || /^\+?[0-9\s()-]{7,20}$/.test(v)),
  country: z.string().trim().min(2).max(80),
  category: z.enum([...pillarIds, 'other']),
  message: z.string().trim().min(10).max(4000),
  consent: z.literal('on'),
  locale: z.enum(['ar', 'en'])
});

export async function submitAlliance(_prev: FormState, data: FormData): Promise<FormState> {
  // The honeypot here is "fax"; "website" is a real field on this form.
  if (data.get('fax')) return {status: 'success'};

  const parsed = Alliance.safeParse(Object.fromEntries(data));
  if (!parsed.success) {
    return {status: 'error', error: 'validation', fields: [...new Set(parsed.error.issues.map((i) => String(i.path[0])))]};
  }
  if (!rateLimit(await clientKey('alliance'))) return {status: 'error', error: 'rate'};

  const f = parsed.data;
  try {
    await sendMail({
      subject: `Alliance enquiry: ${f.company} (${f.category})`,
      replyTo: f.email,
      text: [
        `Company: ${f.company}`,
        `Website: ${f.website || '-'}`,
        `Contact: ${f.name}`,
        `E-mail: ${f.email}`,
        `Phone: ${f.phone || '-'}`,
        `Country: ${f.country}`,
        `Pillar: ${f.category}`,
        `Language: ${f.locale}`,
        `PDPL consent: given at ${new Date().toISOString()}`,
        '',
        f.message
      ].join('\n')
    });
    return {status: 'success'};
  } catch (err) {
    console.error('[alliance] delivery failed', err);
    return {status: 'error', error: 'server'};
  }
}
