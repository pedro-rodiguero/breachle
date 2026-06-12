// Warm-up archive: three hand-built days that predate launch, so the archive
// isn't empty on day one. Content lives only here — nothing is drawn from (or
// burned out of) the daily pools. Triage runs gentler than the dailies and the
// malware deck leans into the joke.

import type { Cve } from './cves'
import type { MalwareItem } from './malware'
import type { PhishItem } from './phish'
import type { TriagePuzzle } from './triage'

export const WARMUP_DAYS = ['2026-06-09', '2026-06-10', '2026-06-11'] as const

export function isWarmupDay(key: string): boolean {
  return (WARMUP_DAYS as readonly string[]).includes(key)
}

const nvd = (id: string) => `https://nvd.nist.gov/vuln/detail/${id}`

export const WARMUP_CVES: Record<string, Cve> = {
  '2026-06-09': {
    id: 'VENOM',
    aliases: ['Virtualized Environment Neglected Operations Manipulation'],
    cveId: 'CVE-2015-3456',
    cvss: 7.7,
    cvssVersion: '2.0',
    vector: 'Local',
    year: 2015,
    product: 'QEMU virtual floppy controller',
    cwe: 'Buffer overflow',
    description:
      'A legacy virtual floppy-disk controller — compiled into the hypervisor even when no floppy was attached — let a guest VM overflow its buffer and break out onto the host.',
    sourceUrl: nvd('CVE-2015-3456'),
  },
  '2026-06-10': {
    id: 'goto fail',
    aliases: ['gotofail', 'Apple SSL bug'],
    cveId: 'CVE-2014-1266',
    cvss: 5.8,
    cvssVersion: '2.0',
    vector: 'Network',
    year: 2014,
    product: 'Apple SecureTransport (iOS/macOS)',
    cwe: 'Improper certificate validation',
    description:
      "One accidentally duplicated line in Apple's TLS handshake skipped the signature check entirely, letting any on-path attacker impersonate any HTTPS server to iPhones and Macs.",
    sourceUrl: nvd('CVE-2014-1266'),
  },
  '2026-06-11': {
    id: 'BootHole',
    aliases: ['Boot Hole'],
    cveId: 'CVE-2020-10713',
    cvss: 8.2,
    cvssVersion: '3.1',
    vector: 'Local',
    year: 2020,
    product: 'GRUB2 bootloader',
    cwe: 'Buffer overflow',
    description:
      "A config-file parsing overflow in the world's most common Linux bootloader allowed code execution before the OS loads, defeating Secure Boot on a huge share of machines.",
    sourceUrl: nvd('CVE-2020-10713'),
  },
}

export const WARMUP_TRIAGE: Record<string, TriagePuzzle> = {
  '2026-06-09': {
    groups: [
      {
        category: 'Phishing Email',
        difficulty: 1,
        tiles: ['prince needs your help', 'CEO wants gift cards NOW', 'invoice from unknown vendor', 'click here to claim prize'],
      },
      {
        category: 'Bad Passwords',
        difficulty: 2,
        tiles: ['password is "password123"', 'same password on 9 sites', 'sticky note on monitor', 'admin/admin still works'],
      },
      {
        category: 'Malware Symptoms',
        difficulty: 3,
        tiles: ['homepage hijacked', '47 popups per minute', 'fans roar at idle', 'files renamed to .crypt'],
      },
      {
        category: 'Good Security Habits',
        difficulty: 4,
        tiles: ['auto-updates turned on', 'password manager in use', 'MFA on every account', 'backups tested monthly'],
      },
    ],
  },
  '2026-06-10': {
    groups: [
      {
        category: 'Physical Security Fails',
        difficulty: 1,
        tiles: ['stranger tailgates in', 'badge lent to intern', 'server room unlocked', 'laptop left in café'],
      },
      {
        category: 'Scam Phone Calls',
        difficulty: 2,
        tiles: ['"IT" asks for your password', 'caller spoofs boss\'s number', '"bank" wants your PIN', 'you won a free cruise'],
      },
      {
        category: 'Sketchy Downloads',
        difficulty: 3,
        tiles: ['free_movie.exe', 'crack for paid software', 'codec_required.zip', 'minecraft_hacks.bat'],
      },
      {
        category: 'Perfectly Normal',
        difficulty: 4,
        tiles: ['Windows updates overnight', 'AV scan pegs CPU briefly', 'router LEDs blink fast', 'phone warm during charge'],
      },
    ],
  },
  '2026-06-11': {
    groups: [
      {
        category: 'Ransomware',
        difficulty: 1,
        tiles: ['every file ends in .locked', 'wallpaper demands Bitcoin', 'countdown timer to pay', 'READ_ME_TO_DECRYPT.txt'],
      },
      {
        category: 'Spam Tells',
        difficulty: 2,
        tiles: ['ALL CAPS SUBJECT LINE!!!', 'S3LL1NG cheap watches', '"act now, offer expires"', 'unsubscribe goes nowhere'],
      },
      {
        category: 'Oops, Not Malicious',
        difficulty: 3,
        tiles: ['intern emails all@company', 'prod deleted, meant staging', 'reply-all storm of "stop"', 'coffee on the firewall'],
      },
      {
        category: 'Helpdesk Classics',
        difficulty: 4,
        tiles: ['have you tried rebooting', 'ticket closed: works now', 'the printer is haunted', 'cable was unplugged'],
      },
    ],
  },
}

export const WARMUP_PHISH: Record<string, PhishItem[]> = {
  '2026-06-09': [
    {
      kind: 'email',
      from: 'Prince Adekunle <prince.adekunle1971@gmail.com>',
      subject: 'CONFIDENTIAL BUSINESS PROPOSAL — URGENT REPLY NEEDED',
      body: 'Greetings dear friend. I am a prince with $25,500,000.00 USD trapped in a foreign account. Kindly send your bank details and a small transfer fee, and 10% shall be yours. God bless.',
      isPhish: true,
      tells: [
        'Royalty does not use a numbered Gmail address',
        'Millions for a stranger in exchange for a "small fee" — the oldest advance-fee scam there is',
        'Asks directly for your bank details',
        'ALL CAPS urgency in the subject line',
      ],
    },
    {
      kind: 'url',
      displayUrl: 'https://en.wikipedia.org/wiki/Phishing',
      isPhish: false,
      tells: [
        'Registrable domain is wikipedia.org — the real encyclopedia',
        'HTTPS, no lookalike characters',
        'Reading about phishing is, in fact, encouraged',
      ],
    },
    {
      kind: 'email',
      from: 'Prize Department <prizes@total1y-real-prizes.win>',
      subject: '🎉 You WON a FREE iPhone 16 Pro!!!',
      body: 'Congratulations! You were randomly selected from 50,000 entries. Your iPhone is reserved for 15 minutes. Just pay $1.00 shipping to claim it now.',
      link: { text: 'Claim My iPhone', href: 'https://total1y-real-prizes.win/claim?card=needed' },
      isPhish: true,
      tells: [
        'The domain literally has "1" swapped into "totally" — and a .win TLD',
        'You cannot win a contest you never entered',
        '"$1 shipping" exists to harvest your card number',
        '15-minute countdown to stop you thinking',
      ],
    },
    {
      kind: 'email',
      from: 'Spotify <no-reply@spotify.com>',
      subject: 'Your Discover Weekly is ready',
      body: 'Your new Discover Weekly playlist is here — 30 songs picked for you, refreshed every Monday. Open Spotify to listen.',
      headerNote: 'SPF pass · DKIM pass',
      isPhish: false,
      tells: [
        'Sender is no-reply@spotify.com — correct domain',
        'SPF and DKIM pass',
        'No link begging for credentials — just open the app',
        'Routine product notification with zero urgency',
      ],
    },
    {
      kind: 'url',
      displayUrl: 'http://185.63.112.9/paypal/secure-login.html',
      isPhish: true,
      tells: [
        'A bank does not live at a bare IP address',
        'Plain HTTP — no padlock at all',
        'The brand name is smuggled into the path, not the domain',
      ],
    },
  ],
  '2026-06-10': [
    {
      kind: 'email',
      from: 'Steam <noreply@steampowered-gifts.com>',
      subject: 'A friend sent you a $50 Steam gift card',
      body: 'Someone on your friends list has gifted you $50 in Steam Wallet funds. Log in within 24 hours to accept the gift before it expires.',
      link: { text: 'Accept Gift', href: 'https://steampowered-gifts.com/login?gift=50' },
      isPhish: true,
      tells: [
        'steampowered-gifts.com is not steampowered.com — bolted-on word',
        'An anonymous "friend" with free money',
        'The login page is the product — it harvests Steam credentials',
        '24-hour expiry pressure',
      ],
    },
    {
      kind: 'email',
      from: 'Duolingo <hello@duolingo.com>',
      subject: 'You made Duo sad 🦉',
      body: 'Your 14-day Spanish streak is in danger! Just one lesson today keeps it alive. These reminders seem to be working — you always come back.',
      headerNote: 'SPF pass · DKIM pass',
      isPhish: false,
      tells: [
        'Sender is hello@duolingo.com — correct domain',
        'SPF and DKIM pass',
        'Emotional blackmail from an owl is the product, not an attack',
        'No credentials, no payment, no panic',
      ],
    },
    {
      kind: 'url',
      displayUrl: 'https://www.faceb00k-login.com/recover',
      isPhish: true,
      tells: [
        'Two zeros where the "o"s should be',
        'Real account recovery happens on facebook.com',
        'A "recover" path is bait for people already worried about their account',
      ],
    },
    {
      kind: 'email',
      from: 'Microsoft Support <urgent@windows-defender-alerts.live>',
      subject: '⚠️ VIRUS DETECTED ON YOUR COMPUTER — CALL NOW',
      body: 'Windows Defender has detected 5 viruses on your PC. Your files will be deleted in 2 hours. Call our certified technicians immediately at the number below. Do NOT turn off your computer.',
      isPhish: true,
      tells: [
        'Microsoft never emails you about viruses on your PC',
        'windows-defender-alerts.live is not a Microsoft domain',
        'Phone-number callback is the tech-support-scam playbook',
        '"Do not turn off your computer" — they need it on to "fix" it for $299',
      ],
    },
    {
      kind: 'url',
      displayUrl: 'https://haveibeenpwned.com/',
      isPhish: false,
      tells: [
        "Troy Hunt's real breach-checking service",
        'Correct domain, HTTPS, no tricks',
        'Checking if your email was breached is good hygiene — this is the legit place',
      ],
    },
  ],
  '2026-06-11': [
    {
      kind: 'email',
      from: 'Sophia <sophia.trades.fx@gmail.com>',
      subject: 'Hi again! About that investment opportunity 😊',
      body: 'Hello dear, it was so nice chatting last week. As promised — my crypto mentor helped me make $12,400 in seven days. I can introduce you, but spots in the program close tomorrow. Do you have WhatsApp?',
      isPhish: true,
      tells: [
        'You have never chatted with this person',
        'Guaranteed crypto returns + a "mentor" = pig-butchering script',
        'Moves you to WhatsApp, away from spam filters',
        'Artificial deadline on a "program" that never existed',
      ],
    },
    {
      kind: 'email',
      from: 'Mozilla <newsletter@mozilla.org>',
      subject: 'Welcome to the Firefox newsletter',
      body: "You're in! Expect monthly updates on Firefox features, privacy tips, and internet health. You can unsubscribe at any time from the link in the footer.",
      headerNote: 'SPF pass · DKIM pass',
      isPhish: false,
      tells: [
        'Sender is newsletter@mozilla.org — correct domain',
        'SPF and DKIM pass',
        'Confirms a subscription you actually signed up for',
        'No urgency, no credentials, no payment',
      ],
    },
    {
      kind: 'email',
      from: 'Hot Singles Daily <mail@bulk-mailer-pro.net>',
      subject: 'Confirm your subscription to Hot Singles Daily',
      body: 'You have been subscribed to Hot Singles Daily (3 emails per day). If you did not request this, click Unsubscribe below to verify your email address and remove yourself from the list.',
      link: { text: 'Unsubscribe', href: 'https://bulk-mailer-pro.net/unsub?confirm=email' },
      isPhish: true,
      tells: [
        'You never subscribed — the "unsubscribe" button is the payload',
        'Clicking confirms your address is live and read by a human',
        '"Verify your email address to unsubscribe" is backwards on purpose',
        'Embarrassment is the lever: they want a fast, unthinking click',
      ],
    },
    {
      kind: 'url',
      displayUrl: 'https://secure-login-appleid.apple.com.account-verify.icu/',
      isPhish: true,
      tells: [
        'Read domains right to left: the registrable domain is account-verify.icu',
        'Everything before it — including "apple.com" — is just subdomain dressing',
        'Apple does not operate on a .icu TLD',
      ],
    },
    {
      kind: 'url',
      displayUrl: 'https://breachle.app/#/phish',
      isPhish: false,
      tells: [
        'Registrable domain is breachle.app — you are literally here right now',
        'HTTPS, no lookalike characters, no smuggled brands',
        'If this one got you, take a lap',
      ],
    },
  ],
}

export const WARMUP_MALWARE: Record<string, MalwareItem[]> = {
  '2026-06-09': [
    {
      name: 'Brain',
      isMalware: true,
      category: 'boot sector virus',
      fact: 'The first PC virus (1986). Its Pakistani authors put their real names, shop address and two phone numbers in the code so victims could call for a cure — and people called, from all over the world.',
    },
    {
      name: 'Wobbuffet',
      isMalware: false,
      category: 'Pokémon',
      fact: "The punching-bag Pokémon that can't attack first — it only counters. Team Rocket's kept popping out of its ball uninvited for two decades.",
    },
    {
      name: 'Okilly Dokilly',
      isMalware: false,
      category: 'metal band',
      fact: 'A Phoenix metal band where everyone dresses as Ned Flanders and the lyrics are mostly Flanders quotes. They call the genre "Nedal". The Simpsons aired one of their videos over the end credits.',
    },
    {
      name: 'MEMZ',
      isMalware: true,
      category: 'trojan',
      fact: 'A meme trojan built for a YouTube series. It opens absurd popups, mangles the screen, then replaces the bootloader with an endlessly scrolling Nyan Cat.',
    },
    {
      name: 'FARTFULL',
      isMalware: false,
      category: 'IKEA product',
      fact: 'A real (discontinued) IKEA workbench. The name roughly means "speedy" in Swedish. English-speaking customers did not read it that way.',
    },
    {
      name: 'Anna Kournikova',
      isMalware: true,
      category: 'email worm',
      fact: 'A 2001 worm promising a photo of the tennis star. The Dutch author built it in an afternoon with a point-and-click kit, turned himself in — and the mayor of his town offered him a job.',
    },
    {
      name: 'Bidoof',
      isMalware: false,
      category: 'Pokémon',
      fact: 'The buck-toothed beaver the internet crowned a deity. Officially the "Plump Mouse Pokémon"; unofficially the patron saint of carrying everyone else\'s HMs.',
    },
    {
      name: 'Grunt',
      isMalware: false,
      category: 'JS framework',
      fact: 'The original JavaScript task runner (2012). Once in every project on Earth; these days it survives mainly in legacy build folders nobody dares to touch.',
    },
  ],
  '2026-06-10': [
    {
      name: 'Michelangelo',
      isMalware: true,
      category: 'boot sector virus',
      fact: "A 1992 boot virus set to strike on the artist's March 6 birthday. Experts predicted millions of wiped PCs; in the end maybe ten thousand were hit. The panic sold a lot of antivirus.",
    },
    {
      name: 'Magikarp',
      isMalware: false,
      category: 'Pokémon',
      fact: 'Famously the most useless Pokémon — its signature move, Splash, has no effect whatsoever. Persist anyway and it becomes a six-meter rage dragon.',
    },
    {
      name: 'Hatebeak',
      isMalware: false,
      category: 'metal band',
      fact: 'A grindcore band whose lead vocalist is Waldo, an African grey parrot. They have never played live — the volume would distress the singer.',
    },
    {
      name: 'Stoned',
      isMalware: true,
      category: 'boot sector virus',
      fact: 'A 1987 boot-sector virus that randomly greeted you with "Your PC is now Stoned! Legalise Marijuana." It spawned so many variants that "Stoned" became an entire family tree.',
    },
    {
      name: 'left-pad',
      isMalware: false,
      category: 'JS framework',
      fact: 'Eleven lines of code that padded strings. When its author unpublished it from npm in 2016, builds broke across the planet — React and Babel included. Eleven. Lines.',
    },
    {
      name: 'CIH',
      isMalware: true,
      category: 'virus',
      fact: 'Aka Chernobyl (1998). It overwrote the BIOS flash chip, literally bricking motherboards — one of the only viruses to ever break hardware. Its Taiwanese author faced no prison time.',
    },
    {
      name: 'Stunfisk',
      isMalware: false,
      category: 'Pokémon',
      fact: 'A completely flat fish that lives in mud and zaps whatever steps on it. Widely beloved as the saddest pancake in the entire franchise.',
    },
    {
      name: 'JÄTTEBRA',
      isMalware: false,
      category: 'IKEA product',
      fact: 'A plant pot whose name just means "really great" in Swedish. It is, to be fair, a perfectly fine pot.',
    },
  ],
  '2026-06-11': [
    {
      name: 'Happy99',
      isMalware: true,
      category: 'email worm',
      fact: 'The 1999 worm that played a fireworks animation wishing you "Happy New Year 1999!!" while quietly emailing itself to everyone you knew. For many people, the first worm they ever saw.',
    },
    {
      name: 'Snorlax',
      isMalware: false,
      category: 'Pokémon',
      fact: 'Sleeps all day, weighs 460 kg, and blocks public roads so thoroughly that waking one requires a special flute.',
    },
    {
      name: 'Mac Sabbath',
      isMalware: false,
      category: 'metal band',
      fact: 'A McDonald\'s-themed Black Sabbath parody fronted by "Ronald Osbourne", with songs like "Frying Pan" and "Pair-a-Buns". The members\' identities are a closely guarded secret.',
    },
    {
      name: 'Cascade',
      isMalware: true,
      category: 'virus',
      fact: 'A 1987 virus that made every letter on screen tumble into a heap at the bottom. It encrypted itself to avoid detection — then gave itself away by, well, the letters falling down.',
    },
    {
      name: 'HUVUDROLL',
      isMalware: false,
      category: 'IKEA product',
      fact: 'The official product name of the IKEA meatballs. It means "leading role" — fitting for the most popular item in the entire building.',
    },
    {
      name: 'Ping-Pong',
      isMalware: true,
      category: 'boot sector virus',
      fact: 'A 1988 boot virus whose entire payload was a dot bouncing around your screen like Pong. Annoying, mostly harmless, weirdly hypnotic.',
    },
    {
      name: 'Dethklok',
      isMalware: false,
      category: 'metal band',
      fact: 'The cartoon death metal band from Metalocalypse — except the albums are real, and one charted higher on the Billboard 200 than any death metal record before it.',
    },
    {
      name: 'Slowpoke',
      isMalware: false,
      category: 'Pokémon',
      fact: "Takes about five seconds to notice it's been hit. Its tail grows back after being bitten off — and villains have built entire criminal schemes around selling them.",
    },
  ],
}
