# Seed data audit sheet

Every entry shipped in `src/data/`, laid out for human fact-checking. Items flagged **⚠ VERIFY** carry a claim I am not fully certain of — check those first. Everything else I believe to be accurate, but all real-world claims (CVSS scores, years, attributions, fun facts) deserve a pass before publishing.

Sources of truth I'd recommend: NVD (nvd.nist.gov) for CVSS/CWE/years, vendor advisories, and reputable write-ups (Microsoft MSRC, Cloudflare/Akamai blogs, Krebs, Wikipedia for the historical worms).

---

## 1. CVE-dle — `src/data/cves.ts` (31 entries)

CVSS column is the claim shown to players as the first clue. "Vector" and "Type" are simplified, player-facing labels (not strict CVSS/CWE strings) — judge them for fairness, not formal exactness.

| # | Answer | CVE | CVSS | Vector | Year | Product | Type | Flags |
|---|--------|-----|------|--------|------|---------|------|-------|
| 1 | Heartbleed | CVE-2014-0160 | 7.5 | Network | 2014 | OpenSSL | Buffer over-read | |
| 2 | Log4Shell | CVE-2021-44228 | 10.0 | Network | 2021 | Apache Log4j 2 | JNDI / expression injection | |
| 3 | Shellshock | CVE-2014-6271 | 9.8 | Network | 2014 | GNU Bash | OS command injection | |
| 4 | EternalBlue | CVE-2017-0144 | 8.1 | Network | 2017 | Windows SMBv1 | RCE (memory corruption) | ⚠ VERIFY CVSS 8.1 (NVD v3.1) |
| 5 | Spectre | CVE-2017-5753 | 5.6 | Local | 2018 | Modern CPUs | Side-channel disclosure | ⚠ VERIFY CVSS 5.6 |
| 6 | Meltdown | CVE-2017-5754 | 5.6 | Local | 2018 | Intel CPUs | Side-channel disclosure | ⚠ VERIFY CVSS 5.6 |
| 7 | Dirty COW | CVE-2016-5195 | 7.0 | Local | 2016 | Linux kernel | Race condition | ⚠ VERIFY CVSS 7.0 |
| 8 | BlueKeep | CVE-2019-0708 | 9.8 | Network | 2019 | Windows RDP | Use after free | |
| 9 | KRACK | CVE-2017-13077 | 6.8 | Adjacent network | 2017 | WPA2 (Wi-Fi) | Cryptographic weakness | ⚠ VERIFY CVSS 6.8 |
| 10 | POODLE | CVE-2014-3566 | 3.4 | Network | 2014 | SSL 3.0 | Padding oracle | ⚠ VERIFY CVSS 3.4 |
| 11 | DROWN | CVE-2016-0800 | 5.9 | Network | 2016 | SSLv2 / OpenSSL | Cryptographic weakness | ⚠ VERIFY CVSS 5.9 |
| 12 | GHOST | CVE-2015-0235 | 10.0 | Network | 2015 | GNU glibc | Buffer overflow | ⚠ VERIFY — 10.0 is the CVSS **v2** score; confirm what NVD lists today |
| 13 | Stagefright | CVE-2015-1538 | 9.8 | Network | 2015 | Android (libstagefright) | Integer overflow | ⚠ VERIFY CVSS 9.8; also the "~1 billion phones" claim in the description |
| 14 | ProxyLogon | CVE-2021-26855 | 9.8 | Network | 2021 | Exchange Server | SSRF | |
| 15 | PrintNightmare | CVE-2021-34527 | 8.8 | Network | 2021 | Windows Print Spooler | Improper privilege mgmt | |
| 16 | Zerologon | CVE-2020-1472 | 10.0 | Network | 2020 | Microsoft Netlogon | Cryptographic weakness | |
| 17 | Ghostcat | CVE-2020-1938 | 9.8 | Network | 2020 | Apache Tomcat (AJP) | File inclusion | |
| 18 | Citrix ADC RCE | CVE-2019-19781 | 9.8 | Network | 2019 | Citrix ADC / Gateway | Path traversal | |
| 19 | Follina | CVE-2022-30190 | 7.8 | Local | 2022 | Windows MSDT | RCE via URL handler | |
| 20 | ProxyShell | CVE-2021-34473 | 9.8 | Network | 2021 | Exchange Server | Path confusion | ⚠ VERIFY CVSS 9.8 |
| 21 | Spring4Shell | CVE-2022-22965 | 9.8 | Network | 2022 | Spring Framework | Data binding / class injection | |
| 22 | Text4Shell | CVE-2022-42889 | 9.8 | Network | 2022 | Apache Commons Text | Expression injection | |
| 23 | Dirty Pipe | CVE-2022-0847 | 7.8 | Local | 2022 | Linux kernel | Improper initialization | |
| 24 | PwnKit | CVE-2021-4034 | 7.8 | Local | 2022 | polkit (pkexec) | Memory corruption | Disclosed Jan 2022; CVE year is 2021 — check the "year" clue isn't confusing |
| 25 | Baron Samedit | CVE-2021-3156 | 7.8 | Local | 2021 | sudo | Heap overflow | |
| 26 | SMBGhost | CVE-2020-0796 | 10.0 | Network | 2020 | Windows SMBv3 | Integer overflow | |
| 27 | Citrix Bleed | CVE-2023-4966 | 9.4 | Network | 2023 | NetScaler ADC / Gateway | Buffer over-read | |
| 28 | MOVEit SQLi | CVE-2023-34362 | 9.8 | Network | 2023 | Progress MOVEit Transfer | SQL injection | Description claims "2,000+ organizations" — broadly reported, sanity-check |
| 29 | regreSSHion | CVE-2024-6387 | 8.1 | Network | 2024 | OpenSSH | Signal handler race | Description claims it regressed a 2006 bug (CVE-2006-5051) |
| 30 | XZ Backdoor | CVE-2024-3094 | 10.0 | Network | 2024 | XZ Utils (liblzma) | Supply-chain backdoor | Description's "500ms slower logins" detail — Andres Freund's account |
| 31 | Struts RCE | CVE-2017-5638 | 10.0 | Network | 2017 | Apache Struts 2 | Expression language injection | Description ties it to Equifax (147M) — well documented |

Also audit each entry's one-line description in `cves.ts` — they're shown (name-redacted) as the final clue and on the answer reveal.

---

## 2. Triage — `src/data/triage.ts` (5 puzzles × 16 tiles)

These are invented-but-plausible log artifacts, not factual claims. Audit for: (a) every tile genuinely belongs to its category, (b) red herrings are fair (plausibly confusable but defensibly correct), (c) no tile is *equally* valid in two categories.

### Puzzle 1
| Category (difficulty) | Tiles |
|---|---|
| Brute Force (1) | `500 failed logins/min` · `Failed password: root` · `hydra + rockyou.txt` · `account lockout storm` |
| Data Exfiltration (2) | `2GB POST to pastebin` · `base64 in DNS TXT` · `tar czf /tmp/.cache` · `rclone → unknown S3` |
| Persistence (3) | `@reboot /tmp/.x cron` · `new HKLM Run key` · `authorized_keys edit` · `service: svchost64` |
| Reconnaissance (4) | `nmap -sS -p- /24` · `whoami /priv` · `404s on /.git /admin` · `LDAP: all domain admins` |

Intended red herrings: `authorized_keys edit` (reads like brute-force aftermath, is persistence); `tar czf /tmp/.cache` (staging = exfil, could read as persistence); `whoami /priv` (post-exploit recon vs. privesc).

### Puzzle 2
| Category (difficulty) | Tiles |
|---|---|
| Phishing Delivery (1) | `invoice.pdf.exe` · `macro doc, ext. sender` · `micros0ft-secure.com` · `reply-to mismatch` |
| Privilege Escalation (2) | `NOPASSWD: ALL` · `JuicyPotato.exe` · `setuid on /usr/bin/find` · `dirtycow.c compiled` |
| Lateral Movement (3) | `psexec \\HR-PC` · `RDP chain ×4 hosts` · `pass-the-hash NTLM` · `ssh jump → db01` |
| Command & Control (4) | `60s beacon to CDN` · `DNS tunnel: evil.io` · `self-signed TLS to IP` · `Discord webhook on srv` |

Note: `setuid on /usr/bin/find` could also be read as persistence — verify you're comfortable calling it privesc (GTFOBins framing).

### Puzzle 3
| Category (difficulty) | Tiles |
|---|---|
| Ransomware (1) | `mass rename → .locked` · `vssadmin delete shadows` · `READ_ME_NOW.txt ×1000` · `SMB encryption @ 3AM` |
| Insider Threat (2) | `bulk DL pre-resignation` · `HR records, wrong role` · `USB on finance laptop` · `auto-fwd → personal mail` |
| Supply Chain (3) | `npm typosquat: lodahs` · `unsigned CI image` · `vendor cert changed` · `build runs curl \| bash` |
| Cryptomining (4) | `idle CPU at 100%` · `pool.minexmr.com` · `xmrig as 'kworker'` · `GPU fans maxed` |

`auto-fwd → personal mail` is also a classic account-takeover artifact — here it's insider threat; the ATO category appears in puzzle 5 with a different tile (`rule: delete security@`). Confirm the two stay distinguishable.

### Puzzle 4
| Category (difficulty) | Tiles |
|---|---|
| Web Exploitation (1) | `' OR 1=1--` · `<script>alert(1)</script>` · `../../etc/passwd` · `UNION SELECT creds` |
| Denial of Service (2) | `SYN flood, 2M pps` · `NTP amplification ×556` · `10k half-open conns` · `memcached reflection` |
| Defense Evasion (3) | `Event 1102: log cleared` · `AMSI bypass string` · `hollowed explorer.exe` · `timestomped binary` |
| Initial Access (4) | `RDP open to internet` · `login from new country` · `unpatched VPN exploit` · `drive-by via ad network` |

Factual details worth a check: NTP amplification factor "×556" (commonly cited as up to ~556×); Windows **Event ID 1102** = security audit log cleared.

### Puzzle 5
| Category (difficulty) | Tiles |
|---|---|
| Social Engineering (1) | `'IT helpdesk' cold call` · `30 MFA push prompts` · `CEO gift card ask` · `tailgating at door 4` |
| Cloud Misconfiguration (2) | `S3 Principal: *` · `SG 0.0.0.0/0 on :22` · `public DB snapshot` · `IAM key on GitHub` |
| Account Takeover (3) | `NY → Moscow in 1h` · `reset from new device` · `rogue OAuth grant` · `rule: delete security@` |
| Living off the Land (4) | `certutil -urlcache` · `bitsadmin /transfer` · `wmic process create` · `mshta http://…/x.hta` |

Intended red herring: `30 MFA push prompts` (MFA-fatigue is an SE technique even though it smells like ATO). All four LOLBins (`certutil`, `bitsadmin`, `wmic`, `mshta`) are on the LOLBAS list.

---

## 3. Phish or Legit — `src/data/phish.ts` (10 items)

All invented sample data (rendered inert in the UI — no real links). Audit for: realism, the correctness of each "tell", and that no legit item contains an actually-bad pattern (or vice versa).

| # | Kind | Content summary | Verdict | Tells (shown on reveal) |
|---|------|----------------|---------|------------------------|
| 1 | email | "PayPal" account-limited warning from `service@paypal-account-verify.com`; link text `https://paypal.com/restore` → actually `paypal.com.account-restore.net/login` | **PHISH** | wrong sender domain; mismatched link; urgency/threat; generic greeting |
| 2 | email | GitHub "new SSH key added" from `noreply@github.com`, link `github.com/settings/keys` matches, SPF/DKIM pass | **LEGIT** | exact domain + auth pass; matching link; addresses by username; review-not-verify framing |
| 3 | url | `https://login.micros0ft-online.support/oauth/authorize` | **PHISH** | zero-for-o; registrable domain isn't microsoft.com; odd TLD for vendor logins |
| 4 | url | `https://accounts.google.com/signin/v2/identifier` | **LEGIT** | real google.com subdomain; genuine sign-in host |
| 5 | email | "CEO" gift-card BEC from `m.chen.ceo.office@gmail.com`, secrecy + urgency, no links | **PHISH** | free webmail exec; BEC playbook; untraceable gift cards; discourages verification |
| 6 | email | Internal IT maintenance notice from `it-helpdesk@corp.globexbank.com`, intranet link matches, SPF/DKIM pass | **LEGIT** | matching internal domain; no action/credentials requested; matching intranet link |
| 7 | url | `https://drive-google.com.download-share.cc/file/inv0ice.pdf.exe` | **PHISH** | brand-as-subdomain (real domain `download-share.cc`); double extension `.pdf.exe`; `inv0ice` |
| 8 | email | "DocuSign" document from `dse@docusgn-mail.com`, **SPF fail** chip, generic body, 24h expiry | **PHISH** | misspelled domain (missing "i"); SPF fail; no document context; artificial expiry |
| 9 | url | `https://www.cloudflare.com/learning/access-management/phishing-attack/` | **LEGIT** | real cloudflare.com; educational path; no credential bait |
| 10 | email | "Netflix" payment-declined from `info@netflix-billingupdate.com` with billing link on same junk domain | **PHISH** | bolted-words domain; payment pressure; real services let you log in directly |

One judgment call to audit: item 2's body addresses "pedrodev" — a sample username, fine for a game; change if you want it fully generic. Item 9 references a real Cloudflare URL path — confirm it exists or swap for the domain root.

---

## 4. Malware or…? — `src/data/malware.ts` (42 entries)

### Real malware (22)

| # | Name | Type | Fact shown on reveal | Flags |
|---|------|------|---------------------|-------|
| 1 | Emotet | botnet/loader | 2014 banking trojan → malware delivery service; taken down 2021 (Operation Ladybird) | |
| 2 | Stuxnet | worm | physically destroyed Iranian uranium centrifuges via spin-speed sabotage | |
| 3 | Mydoom | email worm | fastest-spreading email worm (2004); "~1 in 4 emails at peak" | ⚠ VERIFY peak share figure |
| 4 | Conficker | worm | millions infected 2008; Microsoft's $250,000 bounty never claimed | |
| 5 | Zeus | banking trojan | source code leaked 2011, spawned successor families | |
| 6 | WannaCry | ransomware worm | stopped by kill-switch domain registration (Marcus Hutchins, 2017) | |
| 7 | NotPetya | wiper | ransomware-disguised wiper; ~$10B damage, costliest cyberattack | |
| 8 | Mirai | IoT botnet | "future" in Japanese; hacked cameras/routers; 2016 Dyn outage | |
| 9 | Ryuk | ransomware | named after the Death Note shinigami; hit hospitals/city govts | |
| 10 | TrickBot | banking trojan/botnet | 2016 banker → access broker for ransomware gangs | |
| 11 | QakBot | banking trojan | ~15-year run ended by FBI's 2023 "Operation Duck Hunt" | |
| 12 | ILOVEYOU | email worm | 2000 "love letter" from Manila; author unprosecutable — no PH law yet | |
| 13 | Melissa | macro virus | 1999 Word macro virus named after a Florida dancer | |
| 14 | Slammer | worm | 376 bytes; infected most vulnerable SQL servers in ~10 min (2003) | |
| 15 | Code Red | worm | named after the Mountain Dew flavor its discoverers were drinking | |
| 16 | Pegasus | spyware | NSO Group zero-click iPhone spyware | |
| 17 | DarkSide | ransomware | Colonial Pipeline 2021, East Coast fuel panic | |
| 18 | LockBit | ransomware | leak site seized & used to troll operators (Operation Cronos, 2024) | |
| 19 | Flame | espionage toolkit | ~20MB platform (2012); audio, screenshots, nearby Bluetooth | |
| 20 | CryptoLocker | ransomware | 2013; distributed via the GameOver Zeus botnet | |
| 21 | Gh0st RAT | RAT | used in GhostNet espionage vs embassies and the Dalai Lama's office | |
| 22 | Duqu | espionage toolkit | Stuxnet relative; hid stolen data inside JPEG files | |

### Decoys (20)

| # | Name | Category | Fact | Flags |
|---|------|----------|------|-------|
| 23 | Gojira | metal band | French prog-metal; also Godzilla's Japanese name | |
| 24 | Behemoth | metal band | Polish blackened death metal, fronted by Nergal | note: a few minor malware/tools have used this name — the game treats it as a band; acceptable? |
| 25 | Meshuggah | metal band | Swedish djent pioneers | |
| 26 | Sabaton | metal band | Swedish power metal, songs about battles; sabaton = foot armor | |
| 27 | Mastodon | metal band | Atlanta band; also the federated social network | |
| 28 | Zubat | Pokémon | the cave bat everyone hates | |
| 29 | Porygon | Pokémon | first artificial Pokémon; blamed for 1997 seizure episode (actually Pikachu's attack animation) | |
| 30 | Hypno | Pokémon | psychic-type with a pendulum | |
| 31 | Klefki | Pokémon | sentient key ring from X/Y | |
| 32 | Ditto | Pokémon | copies anything it sees | |
| 33 | Svelte | JS framework | compiles the framework away | |
| 34 | Qwik | JS framework | resumable framework by Angular's creator (Miško Hevery) | |
| 35 | Hono | JS framework | "flame" in Japanese — deliberate contrast with the Flame malware entry | |
| 36 | Astro | JS framework | ships zero JS by default | |
| 37 | Remix | JS framework | acquired by Shopify; merging into React Router | ⚠ check current status — this moves fast |
| 38 | KALLAX | IKEA | the vinyl-collector cube shelf | |
| 39 | MALM | IKEA | classic bed/dresser line | |
| 40 | POÄNG | IKEA | bentwood chair sold since 1976 | |
| 41 | HEMNES | IKEA | solid-pine series, Scandinavian place name | |
| 42 | SKARPSNO | IKEA | bedding | ⚠ VERIFY it's a real current/past IKEA product name |

---

## Quick audit checklist

- [ ] All 9 ⚠ CVSS scores vs NVD (rows 4–7, 9–13, 20 in the CVE table)
- [ ] PwnKit year clue (CVE says 2021, disclosure was Jan 2022)
- [ ] Mydoom "1 in 4 emails" and Stagefright "billion phones" superlatives
- [ ] SKARPSNO exists as an IKEA product
- [ ] Remix/React Router merge status as of mid-2026
- [ ] Triage red herrings are fair (one defensible home per tile)
- [ ] No phishing sample accidentally uses a real registered domain in a harmful way (all fake domains are invented: `paypal-account-verify.com`, `account-restore.net`, `micros0ft-online.support`, `download-share.cc`, `docusgn-mail.com`, `netflix-billingupdate.com`, `corp.globexbank.com` — consider checking none are real live sites)
