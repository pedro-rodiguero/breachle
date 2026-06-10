/**
 * Triage dataset: Connections-style puzzles. Each puzzle has 4 hidden
 * categories (attack types) × 4 tiles (short log artifacts / IOCs / alert
 * snippets). Difficulty 1 = easiest (yellow) … 4 = trickiest (purple).
 *
 * Tiles are deliberately written with red-herring overlaps across groups
 * (e.g. an MFA prompt storm reads like account takeover but is social
 * engineering). Append new puzzles freely.
 */

export type TriageGroup = {
  category: string
  difficulty: 1 | 2 | 3 | 4
  tiles: string[]
}

export type TriagePuzzle = {
  date?: string
  groups: TriageGroup[]
}

export const TRIAGE_PUZZLES: TriagePuzzle[] = [
  {
    groups: [
      {
        category: 'Brute Force',
        difficulty: 1,
        tiles: ['500 failed logins/min', 'Failed password: root', 'hydra + rockyou.txt', 'account lockout storm'],
      },
      {
        category: 'Data Exfiltration',
        difficulty: 2,
        tiles: ['2GB POST to pastebin', 'base64 in DNS TXT', 'tar czf /tmp/.cache', 'rclone → unknown S3'],
      },
      {
        category: 'Persistence',
        difficulty: 3,
        tiles: ['@reboot /tmp/.x cron', 'new HKLM Run key', 'authorized_keys edit', 'service: svchost64'],
      },
      {
        category: 'Reconnaissance',
        difficulty: 4,
        tiles: ['nmap -sS -p- /24', 'whoami /priv', '404s on /.git /admin', 'LDAP: all domain admins'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'Phishing Delivery',
        difficulty: 1,
        tiles: ['invoice.pdf.exe', 'macro doc, ext. sender', 'micros0ft-secure.com', 'reply-to mismatch'],
      },
      {
        category: 'Privilege Escalation',
        difficulty: 2,
        tiles: ['NOPASSWD: ALL', 'JuicyPotato.exe', 'setuid on /usr/bin/find', 'dirtycow.c compiled'],
      },
      {
        category: 'Lateral Movement',
        difficulty: 3,
        tiles: ['psexec \\\\HR-PC', 'RDP chain ×4 hosts', 'pass-the-hash NTLM', 'ssh jump → db01'],
      },
      {
        category: 'Command & Control',
        difficulty: 4,
        tiles: ['60s beacon to CDN', 'DNS tunnel: evil.io', 'self-signed TLS to IP', 'Discord webhook on srv'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'Ransomware',
        difficulty: 1,
        tiles: ['mass rename → .locked', 'vssadmin delete shadows', 'READ_ME_NOW.txt ×1000', 'SMB encryption @ 3AM'],
      },
      {
        category: 'Insider Threat',
        difficulty: 2,
        tiles: ['bulk DL pre-resignation', 'HR records, wrong role', 'USB on finance laptop', 'auto-fwd → personal mail'],
      },
      {
        category: 'Supply Chain',
        difficulty: 3,
        tiles: ['npm typosquat: lodahs', 'unsigned CI image', 'vendor cert changed', 'build runs curl | bash'],
      },
      {
        category: 'Cryptomining',
        difficulty: 4,
        tiles: ['idle CPU at 100%', 'pool.minexmr.com', "xmrig as 'kworker'", 'GPU fans maxed'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'Web Exploitation',
        difficulty: 1,
        tiles: ["' OR 1=1--", '<script>alert(1)</script>', '../../etc/passwd', 'UNION SELECT creds'],
      },
      {
        category: 'Denial of Service',
        difficulty: 2,
        tiles: ['SYN flood, 2M pps', 'NTP amplification ×556', '10k half-open conns', 'memcached reflection'],
      },
      {
        category: 'Defense Evasion',
        difficulty: 3,
        tiles: ['Event 1102: log cleared', 'AMSI bypass string', 'hollowed explorer.exe', 'timestomped binary'],
      },
      {
        category: 'Initial Access',
        difficulty: 4,
        tiles: ['RDP open to internet', 'valid creds via VPN, no MFA', 'unpatched VPN exploit', 'drive-by via ad network'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'Social Engineering',
        difficulty: 1,
        tiles: ["'IT helpdesk' cold call", '30 MFA push prompts', 'CEO gift card ask', 'tailgating at door 4'],
      },
      {
        category: 'Cloud Misconfiguration',
        difficulty: 2,
        tiles: ['S3 Principal: *', 'SG 0.0.0.0/0 on :22', 'public DB snapshot', 'IAM key on GitHub'],
      },
      {
        category: 'Account Takeover',
        difficulty: 3,
        tiles: ['NY → Moscow in 1h', 'reset from new device', 'rogue OAuth grant', 'rule: delete security@'],
      },
      {
        category: 'Living off the Land',
        difficulty: 4,
        tiles: ['certutil -urlcache', 'bitsadmin /transfer', 'wmic process create', 'mshta http://…/x.hta'],
      },
    ],
  },
]
