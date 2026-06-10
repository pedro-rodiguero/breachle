/**
 * Phish or Legit dataset. Every item is inert sample data — links are never
 * real anchors and nothing is clickable. Phishing items imitate the classic
 * patterns (lookalike domains, urgency, mismatched links, BEC); legit items
 * are the boring real thing. Append freely.
 */

export type PhishItem = {
  kind: 'email' | 'url'
  from?: string
  subject?: string
  body?: string
  /** Rendered as a fake link inside the email body (never clickable). */
  link?: { text: string; href: string }
  /** Small header chip, e.g. an SPF/DKIM result. */
  headerNote?: string
  displayUrl?: string
  isPhish: boolean
  /** The tells, shown on reveal. */
  tells: string[]
}

export const PHISH_ITEMS: PhishItem[] = [
  {
    kind: 'email',
    from: 'PayPal Support <service@paypal-account-verify.com>',
    subject: 'Your account has been limited — act within 24 hours',
    body: 'Dear Customer, we detected unusual activity. To avoid permanent suspension, please verify your information immediately.',
    link: { text: 'https://paypal.com/restore', href: 'http://paypal.com.account-restore.net/login' },
    isPhish: true,
    tells: [
      'Sender domain is paypal-account-verify.com, not paypal.com',
      'Link text says paypal.com but points to account-restore.net',
      'Urgency + threat of suspension is classic pressure',
      'Generic greeting ("Dear Customer") instead of your name',
    ],
  },
  {
    kind: 'email',
    from: 'GitHub <noreply@github.com>',
    subject: '[GitHub] A new public key was added to your account',
    body: 'Hey pedrodev, a new SSH key was added to your account. If you did this, you can safely ignore this email. If not, review your keys.',
    link: { text: 'https://github.com/settings/keys', href: 'https://github.com/settings/keys' },
    headerNote: 'SPF pass · DKIM pass',
    isPhish: false,
    tells: [
      'Sender is the exact github.com domain, SPF and DKIM pass',
      'Link text and real destination match',
      'Addresses you by username, states facts without panic',
      'Asks you to review settings — not to "verify" credentials',
    ],
  },
  {
    kind: 'url',
    displayUrl: 'https://login.micros0ft-online.support/oauth/authorize',
    isPhish: true,
    tells: [
      'Zero instead of "o" in micros0ft — a lookalike domain',
      'The registrable domain is micros0ft-online.support, not microsoft.com',
      '".support" is a cheap TLD rarely used by major vendors for logins',
    ],
  },
  {
    kind: 'url',
    displayUrl: 'https://accounts.google.com/signin/v2/identifier',
    isPhish: false,
    tells: [
      'The registrable domain is google.com — "accounts" is its real subdomain',
      'This is Google’s genuine sign-in host',
      'No brand names smuggled into the path or query string',
    ],
  },
  {
    kind: 'email',
    from: 'Margaret Chen <m.chen.ceo.office@gmail.com>',
    subject: 'Quick favor — are you at your desk?',
    body: 'I need you to handle something discreetly right now. Buy 5 × $100 gift cards for a client surprise and send me the codes. Don’t mention this to anyone yet, I’m in meetings all day.',
    isPhish: true,
    tells: [
      '"CEO" writing from a free Gmail address, not the company domain',
      'Urgency + secrecy + unusual payment method = BEC playbook',
      'Gift card codes are untraceable — a favorite of fraudsters',
      'Discourages verifying through normal channels',
    ],
  },
  {
    kind: 'email',
    from: 'IT Helpdesk <it-helpdesk@corp.globexbank.com>',
    subject: 'Scheduled maintenance: VPN unavailable Saturday 02:00–04:00 UTC',
    body: 'Hi team, the VPN gateway will be patched this Saturday. No action is required. If you have issues afterwards, open a ticket on the intranet portal.',
    link: { text: 'https://intranet.corp.globexbank.com/tickets', href: 'https://intranet.corp.globexbank.com/tickets' },
    headerNote: 'SPF pass · DKIM pass · internal sender',
    isPhish: false,
    tells: [
      'Internal sender domain matches the company and passes auth checks',
      'No action or credentials requested — purely informational',
      'Link goes to the matching internal intranet host',
    ],
  },
  {
    kind: 'url',
    displayUrl: 'https://drive-google.com.download-share.cc/file/inv0ice.pdf.exe',
    isPhish: true,
    tells: [
      'Real-looking brand is just a subdomain — the actual domain is download-share.cc',
      'Double extension ".pdf.exe" — that file is an executable, not a document',
      'Number-for-letter swap in "inv0ice"',
    ],
  },
  {
    kind: 'email',
    from: 'DocuSign <dse@docusgn-mail.com>',
    subject: 'You have received a document to review and sign',
    body: 'Completed: please review and sign your document. This link will expire in 24 hours.',
    link: { text: 'REVIEW DOCUMENT', href: 'http://docusgn-mail.com/d/7f3a' },
    headerNote: 'SPF fail',
    isPhish: true,
    tells: [
      'Misspelled domain: docusgn-mail.com is missing the "i"',
      'SPF failed — the sender is not authorized for that domain',
      'No sender name, company, or document context — pure generic bait',
      'Artificial 24-hour expiry to rush you',
    ],
  },
  {
    kind: 'url',
    displayUrl: 'https://www.cloudflare.com/learning/access-management/phishing-attack/',
    isPhish: false,
    tells: [
      'Registrable domain is cloudflare.com — a real, well-known company',
      'Plain educational path, no login form or credential bait',
      'HTTPS on the brand’s own domain, no lookalike tricks',
    ],
  },
  {
    kind: 'email',
    from: 'Netflix <info@netflix-billingupdate.com>',
    subject: 'Payment declined: update your billing information',
    body: 'Your last payment was declined. To keep watching without interruption, update your payment details now.',
    link: { text: 'Update payment method', href: 'http://netflix-billingupdate.com/billing' },
    isPhish: true,
    tells: [
      'netflix-billingupdate.com is not netflix.com — brands don’t bolt words onto their domain',
      'Payment-problem pressure is a top phishing lure',
      'Real services let you check billing by logging in yourself, not via email links',
    ],
  },
]
