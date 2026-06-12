# Seed data audit sheet

> **Status: audited & resolved (2026-06-10).** All flagged items were checked by hand; corrections applied: EternalBlue 8.1→8.8, GHOST 10.0→9.8, Stagefright "≈1 billion"→"950 million", disclosure-year convention adopted (PwnKit = 2022), `cvssVersion`+`sourceUrl` fields added to every CVE; Mydoom figure softened, SKARPSNO→SMÅSPORRE, Behemoth→Opeth, Remix fact rewritten (Remix 3 no-React reboot), POÄNG fact now mentions POEM; phish item 9 → cloudflare.com/learning/ root + "fictional domains" footer in the game shell; Triage puzzle 4 "login from new country"→"valid creds via VPN, no MFA". Tables below reflect the corrected state.

Every entry shipped in `src/data/`, laid out for fact-checking. All real-world claims (CVSS scores, years, attributions, fun facts) deserve a fresh pass whenever entries are added.

Sources of truth I'd recommend: NVD (nvd.nist.gov) for CVSS/CWE/years, vendor advisories, and reputable write-ups (Microsoft MSRC, Cloudflare/Akamai blogs, Krebs, Wikipedia for the historical worms).

---

## 1. CVE-dle — `src/data/cves.ts` (33 entries)

Every entry now carries `cvssVersion` (all "3.1") and `sourceUrl` (NVD detail page). CVSS column is the claim shown to players as the first clue. "Vector" and "Type" are simplified, player-facing labels (not strict CVSS/CWE strings) — judge them for fairness, not formal exactness.

| # | Answer | CVE | CVSS | Vector | Year | Product | Type | Flags |
|---|--------|-----|------|--------|------|---------|------|-------|
| 1 | Heartbleed | CVE-2014-0160 | 7.5 | Network | 2014 | OpenSSL | Buffer over-read | |
| 2 | Log4Shell | CVE-2021-44228 | 10.0 | Network | 2021 | Apache Log4j 2 | JNDI / expression injection | |
| 3 | Shellshock | CVE-2014-6271 | 9.8 | Network | 2014 | GNU Bash | OS command injection | |
| 4 | EternalBlue | CVE-2017-0144 | 8.8 | Network | 2017 | Windows SMBv1 | RCE (memory corruption) | ✓ corrected from 8.1 |
| 5 | Spectre | CVE-2017-5753 | 5.6 | Local | 2018 | Modern CPUs | Side-channel disclosure | ✓ confirmed |
| 6 | Meltdown | CVE-2017-5754 | 5.6 | Local | 2018 | Intel CPUs | Side-channel disclosure | ✓ confirmed |
| 7 | Dirty COW | CVE-2016-5195 | 7.0 | Local | 2016 | Linux kernel | Race condition | ✓ confirmed |
| 8 | BlueKeep | CVE-2019-0708 | 9.8 | Network | 2019 | Windows RDP | Use after free | |
| 9 | KRACK | CVE-2017-13077 | 6.8 | Adjacent network | 2017 | WPA2 (Wi-Fi) | Cryptographic weakness | ✓ confirmed |
| 10 | POODLE | CVE-2014-3566 | 3.4 | Network | 2014 | SSL 3.0 | Padding oracle | ✓ confirmed |
| 11 | DROWN | CVE-2016-0800 | 5.9 | Network | 2016 | SSLv2 / OpenSSL | Cryptographic weakness | ✓ confirmed |
| 12 | GHOST | CVE-2015-0235 | 9.8 | Network | 2015 | GNU glibc | Buffer overflow | ✓ corrected to CVSS v3.1 9.8 |
| 13 | Stagefright | CVE-2015-1538 | 9.8 | Network | 2015 | Android (libstagefright) | Integer overflow | ✓ confirmed; description now says "950 million" |
| 14 | ProxyLogon | CVE-2021-26855 | 9.8 | Network | 2021 | Exchange Server | SSRF | |
| 15 | PrintNightmare | CVE-2021-34527 | 8.8 | Network | 2021 | Windows Print Spooler | Improper privilege mgmt | |
| 16 | Zerologon | CVE-2020-1472 | 10.0 | Network | 2020 | Microsoft Netlogon | Cryptographic weakness | |
| 17 | Ghostcat | CVE-2020-1938 | 9.8 | Network | 2020 | Apache Tomcat (AJP) | File inclusion | |
| 18 | Citrix ADC RCE | CVE-2019-19781 | 9.8 | Network | 2019 | Citrix ADC / Gateway | Path traversal | |
| 19 | Follina | CVE-2022-30190 | 7.8 | Local | 2022 | Windows MSDT | RCE via URL handler | |
| 20 | ProxyShell | CVE-2021-34473 | 9.8 | Network | 2021 | Exchange Server | Path confusion | ✓ confirmed |
| 21 | Spring4Shell | CVE-2022-22965 | 9.8 | Network | 2022 | Spring Framework | Data binding / class injection | |
| 22 | Text4Shell | CVE-2022-42889 | 9.8 | Network | 2022 | Apache Commons Text | Expression injection | |
| 23 | Dirty Pipe | CVE-2022-0847 | 7.8 | Local | 2022 | Linux kernel | Improper initialization | |
| 24 | PwnKit | CVE-2021-4034 | 7.8 | Local | 2022 | polkit (pkexec) | Memory corruption | ✓ disclosure-year convention (2022) adopted dataset-wide |
| 25 | Baron Samedit | CVE-2021-3156 | 7.8 | Local | 2021 | sudo | Heap overflow | |
| 26 | SMBGhost | CVE-2020-0796 | 10.0 | Network | 2020 | Windows SMBv3 | Integer overflow | |
| 27 | Citrix Bleed | CVE-2023-4966 | 9.4 | Network | 2023 | NetScaler ADC / Gateway | Buffer over-read | |
| 28 | MOVEit SQLi | CVE-2023-34362 | 9.8 | Network | 2023 | Progress MOVEit Transfer | SQL injection | Description claims "2,000+ organizations" — broadly reported, sanity-check |
| 29 | regreSSHion | CVE-2024-6387 | 8.1 | Network | 2024 | OpenSSH | Signal handler race | Description claims it regressed a 2006 bug (CVE-2006-5051) |
| 30 | XZ Backdoor | CVE-2024-3094 | 10.0 | Network | 2024 | XZ Utils (liblzma) | Supply-chain backdoor | Description's "500ms slower logins" detail — Andres Freund's account |
| 31 | Struts RCE | CVE-2017-5638 | 10.0 | Network | 2017 | Apache Struts 2 | Expression language injection | Description ties it to Equifax (147M) — well documented |
| 32 | Looney Tunables | CVE-2023-4911 | 7.8 | Local | 2023 | GNU glibc (ld.so) | Buffer overflow | |
| 33 | IngressNightmare | CVE-2025-1974 | 9.8 | Network | 2025 | Kubernetes ingress-nginx | Code injection | **NEW 2026-06-11** — verify CVSS 9.8 + the "~40% of cloud clusters" claim (Wiz figure) vs NVD/advisory |

Also audit each entry's one-line description in `cves.ts` — they're shown (name-redacted) as the final clue and on the answer reveal.

### 1b. Guess pool — `src/lib/data/cvepool.ts` (57 entries) — **NEEDS AUDIT (added 2026-06-11)**

Guess-only entries: they autocomplete and get scored per attribute, but are **never the daily answer** (no descriptions shown). Errors here surface as wrong severity/vector/vendor/year/type cells when someone guesses them. CVSS targets the NVD v3 base score; the two pre-2015 entries (MS08-067, SQL Slammer) use NVD's CVSS v2 since no v3 was retro-assigned. `year` = disclosure year.

| Name | CVE | CVSS | Vector | Year | Check in particular |
|------|-----|------|--------|------|---------------------|
| SIGRed | CVE-2020-1350 | 10.0 | Network | 2020 | |
| CurveBall | CVE-2020-0601 | 8.1 | Network | 2020 | score |
| SeriousSAM | CVE-2021-36934 | 7.8 | Local | 2021 | |
| PetitPotam | CVE-2021-36942 | 5.3 | Network | 2021 | score (NVD lists 5.3; ecosystem impact higher) |
| ProxyNotShell | CVE-2022-41040 | 8.8 | Network | 2022 | |
| DejaBlue | CVE-2019-1181 | 9.8 | Network | 2019 | |
| Outlook NTLM Leak | CVE-2023-23397 | 9.8 | Network | 2023 | |
| MSHTML RCE | CVE-2021-40444 | 8.8 | Local | 2021 | vector (NVD AV; user-interaction delivery) |
| Equation Editor | CVE-2017-11882 | 7.8 | Local | 2017 | |
| EternalRomance | CVE-2017-0145 | 8.8 | Network | 2017 | score vs CVE-2017-0144 sibling |
| MS08-067 | CVE-2008-4250 | 10.0 | Network | 2008 | CVSS v2 (no v3 on NVD) |
| SQL Slammer | CVE-2002-0649 | 7.5 | Network | 2002 | CVSS v2; vuln disclosed 2002, worm hit 2003 |
| SACK Panic | CVE-2019-11477 | 7.5 | Network | 2019 | |
| Sequoia | CVE-2021-33909 | 7.8 | Local | 2021 | |
| Stack Clash | CVE-2017-1000364 | 7.8 | Local | 2017 | score |
| Mutagen Astronomy | CVE-2018-14634 | 7.8 | Local | 2018 | score |
| GameOver(lay) | CVE-2023-2640 | 7.8 | Local | 2023 | |
| SambaCry | CVE-2017-7494 | 9.8 | Network | 2017 | score |
| BlueBorne | CVE-2017-1000251 | 8.0 | Adjacent | 2017 | score |
| glibc getaddrinfo | CVE-2015-7547 | 8.1 | Network | 2016 | |
| Badlock | CVE-2016-2118 | 7.5 | Network | 2016 | score |
| runc Escape | CVE-2019-5736 | 8.6 | Local | 2019 | |
| Kubernetes API Proxy | CVE-2018-1002105 | 9.8 | Network | 2018 | |
| CCS Injection | CVE-2014-0224 | 7.4 | Network | 2014 | |
| SpookySSL | CVE-2022-3602 | 7.5 | Network | 2022 | |
| Terrapin | CVE-2023-48795 | 5.9 | Network | 2023 | |
| FREAK | CVE-2015-0204 | 3.7 | Network | 2015 | |
| Logjam | CVE-2015-4000 | 3.7 | Network | 2015 | |
| Foreshadow | CVE-2018-3615 | 6.4 | Local | 2018 | score |
| ZombieLoad | CVE-2018-12130 | 6.5 | Local | 2019 | score |
| Downfall | CVE-2022-40982 | 6.5 | Local | 2023 | |
| Zenbleed | CVE-2023-20593 | 5.5 | Local | 2023 | |
| Drupalgeddon2 | CVE-2018-7600 | 9.8 | Network | 2018 | |
| ImageTragick | CVE-2016-3714 | 8.4 | Network | 2016 | score |
| Apache Path Traversal | CVE-2021-41773 | 7.5 | Network | 2021 | |
| Confluence OGNL | CVE-2022-26134 | 9.8 | Network | 2022 | |
| GitLab ExifTool | CVE-2021-22205 | 10.0 | Network | 2021 | |
| WebLogic Deserialization | CVE-2019-2725 | 9.8 | Network | 2019 | |
| ActiveMQ RCE | CVE-2023-46604 | 10.0 | Network | 2023 | |
| Return of the WIZard | CVE-2019-10149 | 9.8 | Network | 2019 | |
| BIG-IP iControl | CVE-2022-1388 | 9.8 | Network | 2022 | |
| BIG-IP TMUI | CVE-2020-5902 | 9.8 | Network | 2020 | |
| Pulse Secure VPN | CVE-2019-11510 | 10.0 | Network | 2019 | |
| FortiOS Path Traversal | CVE-2018-13379 | 9.8 | Network | 2019 | score; CVE id 2018, public 2019 |
| XORtigate | CVE-2023-27997 | 9.8 | Network | 2023 | |
| Ivanti Command Injection | CVE-2024-21887 | 9.1 | Network | 2024 | |
| Ivanti EPMM | CVE-2023-35078 | 10.0 | Network | 2023 | |
| SlashAndGrab | CVE-2024-1709 | 10.0 | Network | 2024 | |
| Cisco IOS XE Web UI | CVE-2023-20198 | 10.0 | Network | 2023 | |
| GlobalProtect RCE | CVE-2024-3400 | 10.0 | Network | 2024 | |
| vCenter Upload RCE | CVE-2021-21972 | 9.8 | Network | 2021 | |
| Barracuda ESG | CVE-2023-2868 | 9.8 | Network | 2023 | |
| PaperCut RCE | CVE-2023-27350 | 9.8 | Network | 2023 | |
| Kaseya VSA | CVE-2021-30116 | 9.8 | Network | 2021 | score (disclosed post-REvil) |
| WinRAR Spoofing | CVE-2023-38831 | 7.8 | Local | 2023 | |
| libwebp Overflow | CVE-2023-4863 | 8.8 | Network | 2023 | |
| FORCEDENTRY | CVE-2021-30860 | 7.8 | Local | 2021 | vector |
| Flash UAF | CVE-2018-4878 | 9.8 | Network | 2018 | score |

---

## 2. Triage — `src/data/triage.ts` (35 puzzles × 16 tiles)

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
| Initial Access (4) | `RDP open to internet` · `valid creds via VPN, no MFA` · `unpatched VPN exploit` · `drive-by via ad network` |

Factual details worth a check: NTP amplification factor "×556" (commonly cited as up to ~556×); Windows **Event ID 1102** = security audit log cleared.

### Puzzle 5
| Category (difficulty) | Tiles |
|---|---|
| Social Engineering (1) | `'IT helpdesk' cold call` · `30 MFA push prompts` · `CEO gift card ask` · `tailgating at door 4` |
| Cloud Misconfiguration (2) | `S3 Principal: *` · `SG 0.0.0.0/0 on :22` · `public DB snapshot` · `IAM key on GitHub` |
| Account Takeover (3) | `NY → Moscow in 1h` · `reset from new device` · `rogue OAuth grant` · `rule: delete security@` |
| Living off the Land (4) | `certutil -urlcache` · `bitsadmin /transfer` · `wmic process create` · `mshta http://…/x.hta` |

Intended red herring: `30 MFA push prompts` (MFA-fatigue is an SE technique even though it smells like ATO). All four LOLBins (`certutil`, `bitsadmin`, `wmic`, `mshta`) are on the LOLBAS list.

### Puzzles 6–35 — batches 3–5 (added 2026-06-12) — **NEEDS AUDIT**

30 puzzles merged after validation: 4 groups × 4 tiles each, difficulties exactly {1,2,3,4}, no duplicate tile or category within a puzzle, no fingerprint match against any other puzzle. New twist vs the original five: explicit **benign** categories (scheduled backups, Patch Tuesday, pentest with ROE, log rotation, cert renewal, monitoring…) — audit that each benign group reads as clearly *not* an incident, and that no malicious tile could be defensibly filed under the benign group of the same puzzle.

| # | Categories (difficulty 1 → 4) |
|---|---|
| 6 | Ransomware · Credential Dumping · DNS Tunneling · Scheduled Backup (Benign) |
| 7 | Vulnerability Scanning · Web Shell Activity · Kerberos Abuse · Cryptomining |
| 8 | Smishing · Cloud Misconfiguration · Process Injection · Log Tampering |
| 9 | USB Attack · MFA Attacks · Command & Control · Pentest Activity (Benign) |
| 10 | SQL Injection · Insider Threat · Pass-the-Hash · DGA Domains |
| 11 | Phishing Delivery · IoT Botnet · Token Theft · Normal Admin Activity |
| 12 | Brute Force · Email Spoofing Tells · Data Staging · Container Escape |
| 13 | Physical Intrusion · PowerShell Abuse · Certificate Anomalies · Supply Chain |
| 14 | Cross-Site Scripting · Honeypot Telemetry · SIM Swapping · Defense Evasion |
| 15 | Mobile Malware · Wi-Fi Attacks · Credential Stuffing · Living off the Land |
| 16 | Lateral Movement · Rootkit Indicators · OAuth Phishing · Routine Patch Tuesday |
| 17 | Denial of Service · Account Takeover · Printer Exploitation · Legitimate DevOps |
| 18 | Initial Access via Macro · Exfiltration via Cloud · SSRF · Firewall Rule Change |
| 19 | Spear Phishing · DNS Hijacking · Steganography · Acceptable-Use Violation (Benign) |
| 20 | Privilege Escalation · Adversarial ML · Time-Based Evasion · Zero-Day Exploit |
| 21 | Reconnaissance · Firmware Attack · Cross-Tenant Abuse · Backup System Activity (Benign) |
| 22 | Ransomware · API Abuse · Watering Hole · BGP Hijacking |
| 23 | Persistence · Cryptomining · Physical Exfiltration · Adversary-in-the-Middle |
| 24 | Social Engineering · Memory-Only Malware · Kubernetes Misuse · Legitimate Backup (Benign) |
| 25 | Credential Phishing · Exfiltration via DNS · Hardware Implant · SIEM Misconfiguration (Benign) |
| 26 | Business Email Compromise · Active Directory Recon · Bootkit · Scheduled Scan (Benign) |
| 27 | Exfiltration via Email · Living off the Land · BGP Misconfiguration (Benign) · Kernel Exploit |
| 28 | Phishing Delivery · Cloud Cryptojacking · LDAP Injection · Patch Deployment (Benign) |
| 29 | Ransomware · Subdomain Takeover · Malicious Insider (Sabotage) · Developer Workflow (Benign) |
| 30 | Account Takeover · Reverse Shell · Wi-Fi Deauthentication · Routine Log Rotation (Benign) |
| 31 | Defense Evasion · Typosquatting Attack · Industrial Control Attack · Security Tool Update (Benign) |
| 32 | Data Exfiltration · Persistence · Insider Data Theft · Cloud Automation (Benign) |
| 33 | Spear Phishing · Command & Control · Memory Forensics Indicators · Certificate Renewal (Benign) |
| 34 | Supply Chain · Exfiltration via ICMP · Social Engineering · Network Maintenance (Benign) |
| 35 | Web Exploitation · Cryptomining · Email Infrastructure Attack · Legitimate Monitoring (Benign) |

Watch-items spotted during merge: `AS-REP roastable accts` (puzzle 7, Kerberos Abuse) could read as a vuln-scan finding next to that puzzle's Vulnerability Scanning group; `mail forward rule added` (puzzle 16, OAuth Phishing) is also a classic ATO artifact — fine here since no ATO group shares the puzzle; puzzle 26 pairs Defense Evasion at difficulty 1 with a benign Security Tool Update group at 4 — confirm `signed binary sideloaded` vs `CrowdStrike sensor update` stay distinguishable.

---

## 3. Phish or Legit — `src/data/phish.ts` (80 items)

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
| 9 | url | `https://www.cloudflare.com/learning/` | **LEGIT** | real cloudflare.com; educational path; no credential bait |
| 10 | email | "Netflix" payment-declined from `info@netflix-billingupdate.com` with billing link on same junk domain | **PHISH** | bolted-words domain; payment pressure; real services let you log in directly |
| 11 | email | "Your NDA is ready for signature" from `docusign.net` | **LEGIT** | Real docusign.net sender domain |
| 12 | email | "Action required: your VPN certificate expires tonight" from `corp-helpdesk.net` | **PHISH** | corp-helpdesk.net is not a corporate domain — lookalike registered externally |
| 13 | url | `https://www.linkedin.com/in/yourprofile` | **LEGIT** | Correct linkedin.com domain |
| 14 | email | "Direct deposit change confirmation needed" from `payr0ll-update.com` | **PHISH** | payr0ll-update.com uses zero instead of "o" — digit substitution |
| 15 | url | `https://microsofft-online.com/office365/login` | **PHISH** | microsofft-online.com has a doubled "f" — typosquat |
| 16 | email | "Your AWS bill for May is ready" from `aws.amazon.com` | **LEGIT** | aws.amazon.com is the legitimate AWS sender domain |
| 17 | email | "Unusual sign-in blocked on your Microsoft account" from `microsecure-notify.com` | **PHISH** | microsecure-notify.com is not a Microsoft domain — attacker-registered |
| 18 | email | "Sarah Chen shared a folder with you" from `dropbox.com` | **LEGIT** | Sender is no-reply@dropbox.com — correct domain |
| 19 | email | "OVERDUE: Invoice #4492 — payment required today" from `invoic3-portal.net` | **PHISH** | invoic3-portal.net uses digit substitution for "e" |
| 20 | url | `https://app.slack.com/client/T012AB3CD/C024BE91L` | **LEGIT** | Correct app.slack.com domain |
| 21 | email | "Welcome — complete your onboarding by Friday" from `onboard-portaI.com` | **PHISH** | onboard-portaI.com uses uppercase I instead of lowercase l — homoglyph attack **FLAG:** homoglyph relies on capital I vs lowercase l — confirm the UI font keeps them distinguishable-on-inspection |
| 22 | email | "A payout of $1,240.00 has been sent to your bank" from `stripe.com` | **LEGIT** | Sender is no-reply@stripe.com — correct domain |
| 23 | email | "Your authenticator app must be re-enrolled today" from `corp-mfa-reset.net` | **PHISH** | corp-mfa-reset.net is not a legitimate internal domain |
| 24 | url | `https://zoom.us/j/92345678901` | **LEGIT** | Correct zoom.us domain |
| 25 | email | "Your package could not be delivered — reschedule now" from `fedex-parcel-notify.com` | **PHISH** | fedex-parcel-notify.com is not fedex.com — attacker-registered lookalike |
| 26 | email | "Storage policy update for your organisation" from `google.com` | **LEGIT** | Sender is admin-console@google.com — legitimate Google domain **FLAG:** verify `admin-console@google.com` is a plausible real Google sender (lesson still holds: @google.com) |
| 27 | email | "Subpoena notice — your response required within 48 hours" from `lega1-compliance-notice.org` | **PHISH** | lega1-compliance-notice.org uses digit "1" instead of "l" |
| 28 | email | "You've been added to a Confluence space" from `atlassian.com` | **LEGIT** | Sender is no-reply@atlassian.com — correct domain |
| 29 | url | `https://outlook-secure-login.com/owa/auth` | **PHISH** | outlook-secure-login.com is not microsoft.com or outlook.com |
| 30 | email | "Alex Rivera invited you to a workspace" from `mail.notion.so` | **LEGIT** | mail.notion.so is the legitimate Notion email subdomain |
| 31 | email | "Important document shared with you — view before it expires" from `gdrive-fileshare.net` | **PHISH** | gdrive-fileshare.net is not google.com or drive.google.com |
| 32 | email | "[HIGH] CPU utilisation alert — prod-web-01" from `pagerduty.com` | **LEGIT** | Sender is no-reply@pagerduty.com — correct domain |
| 33 | email | "KYC verification required — account restricted" from `kyc-verify-portal.com` | **PHISH** | kyc-verify-portal.com is not a legitimate financial institution domain |
| 34 | url | `https://github.com/stripe/stripe-python` | **LEGIT** | Correct github.com domain |
| 35 | email | "Your password expired 2 days ago — reset required" from `passwd-expired-alert.com` | **PHISH** | passwd-expired-alert.com is an attacker-controlled domain, not corporate IT |
| 36 | email | "A new device signed in to your account" from `okta.com` | **LEGIT** | Sender is noreply@okta.com — correct domain |
| 37 | email | "Your application — offer letter enclosed" from `talentacquire-hq.com` | **PHISH** | talentacquire-hq.com is a fictional attacker domain, not a known employer |
| 38 | email | "Your Twilio account: monthly usage summary" from `twilio.com` | **LEGIT** | Sender is no-reply@twilio.com — correct domain |
| 39 | email | "Banking details updated for future payments" from `vendor-invoice-update.net` | **PHISH** | vendor-invoice-update.net is a fictional attacker domain |
| 40 | email | "Scheduled maintenance: Salesforce unavailable Sunday 01:00–03:00 UTC" from `salesforce.com` | **LEGIT** | Sender is noreply@salesforce.com — correct domain |
| 41 | email | "Your Apple ID has been used to sign in on a new iPhone" from `id-apple-secure.com` | **PHISH** | id-apple-secure.com is not apple.com — attacker-registered lookalike |
| 42 | email | "Action required: renew your Cloudflare subscription" from `cloudflare.com` | **LEGIT** | Sender is no-reply@cloudflare.com — correct domain |
| 43 | url | `https://login.salesforce-secure-access.net/id/login` | **PHISH** | salesforce-secure-access.net is not salesforce.com |
| 44 | email | "Your Zoom meeting recording is available" from `zoom.us` | **LEGIT** | Sender is no-reply@zoom.us — correct domain |
| 45 | email | "Please e-sign the attached agreement today" from `echosign-portal.net` | **PHISH** | echosign-portal.net is a fictional attacker domain mimicking Adobe Acrobat Sign (formerly EchoSign) |
| 46 | email | "Security advisory: update your packages" from `npmjs.com` | **LEGIT** | Sender is support@npmjs.com — correct npm domain |
| 47 | email | "Open enrollment closes Friday — don't lose your benefits" from `hr-benefits-enroll.com` | **PHISH** | hr-benefits-enroll.com is not a recognised HR or benefits platform domain |
| 48 | url | `https://pypi.org/project/requests/` | **LEGIT** | Correct pypi.org domain |
| 49 | email | "International wire pending — verify within 2 hours" from `intl-payment-verify.com` | **PHISH** | intl-payment-verify.com is a fictional attacker domain |
| 50 | email | "Your Terraform Cloud run completed successfully" from `hashicorp.com` | **LEGIT** | Sender is noreply@hashicorp.com — correct domain |
| 51 | email | "Monitor alert resolved: API latency returned to normal" from `datadoghq.com` | **LEGIT** | Sender is noreply@datadoghq.com — correct domain |
| 52 | url | `https://secure-office365-verify.com/login/common/oauth2` | **PHISH** | secure-office365-verify.com is not microsoft.com |
| 53 | email | "Jordan Lee commented on your design" from `figma.com` | **LEGIT** | Sender is noreply@figma.com — correct domain |
| 54 | email | "Mandatory security awareness training — complete by EOD" from `corp-audit-compliance.net` | **PHISH** | corp-audit-compliance.net is not an internal corporate training domain |
| 55 | email | "New critical vulnerability in your project" from `snyk.io` | **LEGIT** | Sender is alerts@snyk.io — correct domain |
| 56 | email | "Unusual spending detected on your cloud account" from `gcloud-billing-alert.com` | **PHISH** | gcloud-billing-alert.com is not google.com or cloud.google.com |
| 57 | url | `https://aws.amazon.com/console/home` | **LEGIT** | Correct aws.amazon.com domain |
| 58 | email | "Your signature is required on a legal document" from `docverify-secure.net` | **PHISH** | docverify-secure.net is a fictional attacker domain, not a known e-signature provider |
| 59 | email | "You were assigned an issue: BUG-2241" from `linear.app` | **LEGIT** | Sender is notifications@linear.app — correct domain |
| 60 | email | "Recovery code sent — did you request this?" from `account-recovery-google.com` | **PHISH** | account-recovery-google.com is not google.com — attacker-registered |
| 61 | email | "Deployment successful: production" from `vercel.com` | **LEGIT** | Sender is no-reply@vercel.com — correct domain |
| 62 | email | "Your expense report was approved" from `expensify.com` | **LEGIT** | Sender is noreply@expensify.com — correct domain |
| 63 | email | "Identity verification required to continue withdrawals" from `coinbase-verify-id.com` | **PHISH** | coinbase-verify-id.com is not coinbase.com — attacker-registered lookalike |
| 64 | email | "[PROJ-884] Status changed to In Review" from `atlassian.com` | **LEGIT** | Sender is jira@atlassian.com — correct domain |
| 65 | url | `https://paypal.com-secure-login.net/signin` | **PHISH** | paypal.com is a subdomain of com-secure-login.net — the real domain is com-secure-login.net |
| 66 | email | "New order #8821 received in your store" from `shopify.com` | **LEGIT** | Sender is noreply@shopify.com — correct domain |
| 67 | email | "DDoS attack mitigated on your zone" from `notify.cloudflare.com` | **LEGIT** | notify.cloudflare.com is a legitimate Cloudflare notification subdomain |
| 68 | email | "Confidential: board resolution document for your review" from `secure-docs-review.net` | **PHISH** | secure-docs-review.net is a fictional attacker domain |
| 69 | email | "A new device has been added to your account" from `1password.com` | **LEGIT** | Sender is no-reply@1password.com — correct domain |
| 70 | url | `https://www.dropbox.com/sh/abc123/AAAdefg456` | **LEGIT** | Correct www.dropbox.com domain |
| 71 | email | "Mandatory Active Directory password reset — all staff" from `active-directory-reset.com` | **PHISH** | active-directory-reset.com is not an internal corporate domain |
| 72 | email | "Your support ticket #ZD-44821 has been updated" from `zendesk.com` | **LEGIT** | Sender is support@zendesk.com — correct domain |
| 73 | email | "You clicked a phishing simulation link" from `corp.internal` | **LEGIT** | Sender domain is corp.internal — consistent with internal security team **FLAG:** judgment call: internal phishing-sim debrief marked LEGIT, links to knowbe4.com |
| 74 | email | "Your DHL parcel is held at customs — pay duty fee" from `dhl-parcel-track.net` | **PHISH** | dhl-parcel-track.net is not dhl.com — fictional attacker domain |
| 75 | url | `https://trello.com/b/abc123/project-roadmap` | **LEGIT** | Correct trello.com domain |
| 76 | email | "AWS account suspended — unpaid balance $1,203.44" from `aws-billing-overdue.com` | **PHISH** | aws-billing-overdue.com is not amazon.com or aws.amazon.com |
| 77 | email | "Pipeline failed: main — build stage" from `mg.gitlab.com` | **LEGIT** | mg.gitlab.com is the legitimate GitLab sending domain via Mailgun |
| 78 | email | "Update your payroll information before the 15th" from `hrpay-portal-update.com` | **PHISH** | hrpay-portal-update.com is a fictional attacker domain, not a known payroll provider |
| 79 | email | "Weekly infrastructure digest" from `datadoghq.com` | **LEGIT** | Sender is noreply@datadoghq.com — correct domain |
| 80 | url | `https://onedrive.live.com/edit.aspx?resid=ABC123!456` | **LEGIT** | Correct onedrive.live.com domain |

One judgment call to audit: item 2's body addresses "pedrodev" — a sample username, fine for a game; change if you want it fully generic. Item 9 now uses the cloudflare.com/learning/ root. The game shell also shows a permanent "all phishing domains are fictional, nothing clickable" footer.


**Batch 6 (items 11–80, added 2026-06-12) — NEEDS AUDIT.** 75 candidates drafted, 70 merged. Rejected: #5 (functional dup of existing item 2 — GitHub legit security-notice email (SSH key added vs 2FA enabled, same sender/lesson)); #30 (same registrable domain + verdict as an earlier URL item (google.com:false)); #43 (functional dup of existing item 1 — PayPal "account limited" phish (same brand + lure + verdict)); #55 (same registrable domain + verdict as an earlier URL item (amazon.com:false)); #61 (within-batch dup of #28 — unsolicited recruiting lure delivering a .docm). Same-brand legit pairs kept deliberately — confirm the scenarios stay distinct: Atlassian (Confluence invite vs Jira status), Cloudflare (renewal vs DDoS-mitigated), Datadog (alert-resolved vs weekly digest). Recurring phish families kept for realism: corporate-IT credential resets (VPN cert / MFA re-enroll / password expiry / AD reset), e-signature lures (3), delivery-fee scams (FedEx/DHL), cloud-billing suspensions (GCP/AWS), payroll lures (2), fake-Microsoft logins (3 + existing item 3). Item 64's tells were rewritten during the merge (the draft was cut off mid-list) — review them.

---

## 4. Malware or…? — `src/data/malware.ts` (233 entries)

### Real malware (22)

| # | Name | Type | Fact shown on reveal | Flags |
|---|------|------|---------------------|-------|
| 1 | Emotet | botnet/loader | 2014 banking trojan → malware delivery service; taken down 2021 (Operation Ladybird) | |
| 2 | Stuxnet | worm | physically destroyed Iranian uranium centrifuges via spin-speed sabotage | |
| 3 | Mydoom | email worm | fastest-spreading email worm (2004); "by some estimates as much as a quarter of global email at its peak" | ✓ softened |
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
| 24 | Opeth | metal band | Swedish progressive death metal turned ’70s prog worship | ✓ replaced Behemoth (name collision with minor malware/tools) |
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
| 37 | Remix | JS framework | v2 features merged into React Router; Remix 3 reborn as a from-scratch, no-React reboot | ✓ rewritten |
| 38 | KALLAX | IKEA | the vinyl-collector cube shelf | |
| 39 | MALM | IKEA | classic bed/dresser line | |
| 40 | POÄNG | IKEA | bentwood chair launched 1976 as “POEM”, renamed POÄNG in 1992 | ✓ |
| 41 | HEMNES | IKEA | solid-pine series, Scandinavian place name | |
| 42 | SMÅSPORRE | IKEA | duvet | ✓ replaced SKARPSNO |

### Batch 8 — real malware additions (59) — added 2026-06-12, **NEEDS AUDIT**

| # | Name | Type | Fact shown on reveal (clipped) | Flags |
|---|------|------|-------------------------------|-------|
| 1 | Conti | ransomware | Operated like a professional company with HR, salaries and performance reviews; its internal chat logs were le… |  |
| 2 | BlackCat | ransomware | The first major ransomware family written in Rust, making it cross-platform and harder for analysts to reverse… |  |
| 3 | Maze | ransomware | Pioneered the double-extortion tactic in 2019, threatening to publish stolen data publicly if the ransom was n… |  |
| 4 | REvil | ransomware | Demanded $70 million in Bitcoin for a universal decryptor after simultaneously infecting up to 1,500 businesse… |  |
| 5 | Locky | ransomware | Spread primarily through malicious Word macro attachments in 2016 and at its peak was being delivered in 500,0… | "500,000 phishing emails per hour" figure |
| 6 | Cerber | ransomware | Used a text-to-speech engine to literally read the ransom note aloud to victims — an early example of ransomwa… |  |
| 7 | Clop | ransomware | Exploited the MOVEit Transfer zero-day over a 2023 Memorial Day weekend, stealing data from over 2,500 organis… | "over 2,500 organisations" — later counts run higher (~2,770) |
| 8 | Blaster | worm | Contained a hidden message in its code reading "I just want to say LOVE YOU SAN!!" along with an insult direct… |  |
| 9 | Sasser | worm | Written by an 18-year-old German student in 2004; it crashed computers at Delta Air Lines, forcing the cancell… |  |
| 10 | Nimda | worm | Used five different propagation methods simultaneously — email, web, network shares, IIS exploits and Code Red… |  |
| 11 | Morris | worm | Released in 1988 by a Cornell student, it was the first worm to gain widespread attention and led directly to… |  |
| 12 | DarkComet | RAT | Widely used by the Syrian government to spy on opposition activists during the 2011 civil war; its author even… |  |
| 13 | njRAT | RAT | Particularly prevalent in the Middle East and North Africa; its Arabic-language builder interface made it acce… |  |
| 14 | AsyncRAT | RAT | Published as open-source on GitHub in 2019; within a year it had been weaponised by dozens of threat actors, i… |  |
| 15 | Quasar | RAT | Also originally open-source; it was adopted by APT10 for espionage campaigns targeting managed service provide… |  |
| 16 | PlugX | RAT | A modular RAT associated with multiple Chinese APT groups; it is often delivered via DLL sideloading alongside… |  |
| 17 | Remcos | RAT | Sold legally as "remote administration software" on its own website but appears so consistently in cybercrime… |  |
| 18 | NetWire | RAT | Sold on underground forums for over a decade; its administrator was arrested in Croatia in 2023 following a jo… |  |
| 19 | BlackShades | RAT | Its 2014 takedown resulted in over 90 arrests across 19 countries in a single coordinated sweep — one of the l… | "over 90 arrests" — reports say ~97 |
| 20 | Havoc | RAT | An open-source post-exploitation framework released in 2022 that rapidly became popular with both red teams an… | dual-use C2 framework marked malware; deliberate near-pair with the band Havok |
| 21 | Necurs | botnet | At its peak controlled over 9 million infected computers and was responsible for distributing roughly 90% of t… | "~90% of malware-laden spam" figure |
| 22 | Kelihos | botnet | Sinkholed three separate times between 2011 and 2017, only to rebuild each time; its suspected operator was fi… |  |
| 23 | Gameover Zeus | botnet | Used a peer-to-peer architecture with no central C2 server, making it far harder to take down than earlier bot… |  |
| 24 | RedLine | stealer | Sold for as little as $150 on dark web forums; it became the most widely deployed credential stealer in 2022,… |  |
| 25 | Raccoon | stealer | Its alleged developer was arrested in the Netherlands in 2022; the malware-as-a-service stole data from over 4… |  |
| 26 | Vidar | stealer | Uses legitimate social media profiles — including Mastodon and Steam — as dead-drop resolvers to communicate i… |  |
| 27 | Lumma | stealer | Microsoft and the DOJ disrupted its infrastructure in 2025 by seizing over 2,300 domains, in one of the larges… | 2025 takedown (2,300 domains) — recent claim, verify |
| 28 | Azorult | stealer | First appeared on Russian-language forums in 2016; it was frequently bundled with ransomware to ensure attacke… |  |
| 29 | FormBook | stealer | Hooks the Windows GetClipboardData and NtQuerySystemInformation APIs to steal data directly from form fields b… |  |
| 30 | Cobalt Strike | APT tool | Originally a legitimate red-team platform; cracked versions became so prevalent in ransomware attacks that its… | dual-use red-team tool marked malware — game-frame judgment call |
| 31 | Mimikatz | APT tool | Created by a French researcher to demonstrate a Windows credential caching flaw he believed Microsoft would ne… | dual-use credential tool marked malware — game-frame judgment call |
| 32 | Metasploit | APT tool | The most widely used penetration testing framework on the planet; its payloads appear so often in real attacks… | dual-use pentest framework marked malware — weakest of the dual-use cluster, consider cutting |
| 33 | Turla | APT tool | A Russian APT toolset that once hijacked satellite internet links to route its C2 traffic — using dish receive… | APT *group* name used as a tool name (implants usually called Snake/Uroburos) — verify framing |
| 34 | Triton | APT tool | Targeted safety instrumented systems at a Saudi petrochemical plant in 2017 — the first malware ever designed… |  |
| 35 | Industroyer | APT tool | Caused a power blackout in Kyiv in December 2016 by directly speaking industrial control protocols; a successo… |  |
| 36 | Regin | APT tool | A modular espionage platform used to compromise the Belgian telecoms company Belgacom; its sophistication led… |  |
| 37 | FinFisher | APT tool | Sold exclusively to governments as a "lawful intercept" tool; leaked files confirmed it was sold to regimes th… |  |
| 38 | Carbanak | APT tool | Allowed attackers to watch bank employee screens for months, learning procedures well enough to instruct ATMs… |  |
| 39 | BlackLotus | bootkit | The first publicly known UEFI bootkit capable of bypassing Secure Boot on fully patched Windows 11 systems, pe… |  |
| 40 | Rustock | rootkit | A spam botnet rootkit that at its 2010 peak was sending 30 billion spam emails per day — roughly half of all g… | "30 billion spam/day" — takedown-era estimates vary widely |
| 41 | ZeroAccess | rootkit | Infected over 9 million machines and used them for click fraud and Bitcoin mining, generating an estimated $2.… | "$2.7M per month" click-fraud figure |
| 42 | WannaMine | cryptominer | A fileless cryptominer that spreads using EternalBlue and runs entirely in PowerShell and WMI, leaving no bina… |  |
| 43 | XMRig | cryptominer | A legitimate open-source Monero miner so frequently bundled into malware campaigns that its presence on a syst… | legitimate OSS miner marked malware — the fact itself explains the nuance |
| 44 | Lemon Duck | cryptominer | Spreads via phishing, USB, and brute force, then mines Monero while also removing competing cryptominers from… |  |
| 45 | DarkTequila | spyware | A sophisticated Latin American banking malware active from at least 2013; it only activated on machines connec… |  |
| 46 | Joker | spyware | An Android spyware family that repeatedly sneaks into the Google Play Store hidden inside seemingly legitimate… |  |
| 47 | HermeticWiper | wiper | Deployed against Ukrainian organisations hours before Russia's 2022 invasion; it abused a legitimate disk mana… |  |
| 48 | WhisperGate | wiper | Disguised itself as ransomware by displaying a ransom note, but actually contained no decryption capability —… |  |
| 49 | Shamoon | wiper | Wiped the master boot records of roughly 35,000 Saudi Aramco workstations in 2012 in under a few hours, replac… | "roughly 35,000 workstations" — 30,000 is the more common figure |
| 50 | CaddyWiper | wiper | One of at least four separate wiper malware families deployed against Ukraine in 2022; like HermeticWiper it t… |  |
| 51 | Sunburst | APT tool | Hiding inside a digitally signed SolarWinds Orion update, it gave Russian intelligence access to networks of 1… |  |
| 52 | Sliver | APT tool | An open-source red team C2 framework in Go; threat actors adopted it rapidly after Cobalt Strike crackdowns, u… | dual-use C2 framework marked malware — game-frame judgment call |
| 53 | BPFDoor | APT tool | A Linux backdoor that uses the Berkeley Packet Filter to sniff network traffic for a magic packet, opening a s… |  |
| 54 | Dridex | botnet | A banking trojan turned ransomware dropper; the US Treasury sanctioned its alleged operator — a Russian nation… |  |
| 55 | IcedID | botnet | Originally a banking trojan, it evolved into a primary loader for ransomware gangs including Conti and REvil,… |  |
| 56 | Ursnif | botnet | One of the oldest active banking trojans — its lineage traces back to a 2006 source code leak that spawned mor… |  |
| 57 | AgentTesla | stealer | Marketed as a "keylogger and remote access tool" on its own website; it steals credentials from over 55 applic… | "over 55 applications" figure |
| 58 | Gootloader | loader | Infects victims via SEO poisoning — poisoning Google search results for legal and financial document templates… | category changed from "APT tool" to "loader" during merge |
| 59 | GootKit | botnet | A modular banking trojan that evolved into a full loader platform; its SEO-poisoning delivery mechanism became… |  |

### Batch 8 — decoy additions (132) — added 2026-06-12, **NEEDS AUDIT**

| # | Name | Category | Fact (clipped) | Flags |
|---|------|----------|----------------|-------|
| 1 | Slayer | metal band | Formed in Huntington Park, California in 1981; their 1986 album Reign in Blood runs exactl… | Reign in Blood runtime "28:58" — verify |
| 2 | Carcass | metal band | A Liverpool band whose early "goregrind" albums were filled with medical terminology; thei… |  |
| 3 | Mayhem | metal band | A Norwegian black metal band whose 1990s history includes a member murder, church arsons a… | name collision: obscure 2014 *nix "Mayhem" botnet — kept, band reading dominant |
| 4 | Obituary | metal band | A Florida death metal pioneer formed in 1984; their vocalist John Tardy is famous for impr… |  |
| 5 | Sepultura | metal band | A Brazilian thrash and groove metal band from Belo Horizonte; their 1996 album Roots incor… |  |
| 6 | Exodus | metal band | A Bay Area thrash band formed in 1979 whose early lineup included Kirk Hammett before he l… | name collision: 2019 Italian "Exodus" Android spyware — kept, band far better known |
| 7 | Napalm Death | metal band | Their 1987 song "You Suffer" lasts one second and holds the Guinness World Record for the… |  |
| 8 | Coven | metal band | A 1960s occult rock band who used an inverted cross and satanic imagery on their 1969 debu… | horns-gesture origin claim is contested folklore |
| 9 | Testament | metal band | A Bay Area thrash band whose vocalist Chuck Billy is of Pomo Native American descent; he s… |  |
| 10 | Bolt Thrower | metal band | A British death metal band from Coventry whose entire discography draws on Warhammer 40,00… |  |
| 11 | Havok | metal band | A Denver thrash revival band formed in 2004 whose politically charged lyrics and technical… | one letter from the Havoc C2 added in this same batch — deliberate near-pair, confirm intended |
| 12 | Possessed | metal band | Their 1985 debut Seven Churches is widely credited as the first death metal album ever rec… |  |
| 13 | Torment | metal band | A Swedish death metal band from the early 1990s Gothenburg scene whose obscure demos are p… |  |
| 14 | Cryptopsy | metal band | A Montreal brutal death metal band whose 1996 album None So Vile is considered one of the… |  |
| 15 | Malevolent Creation | metal band | A Florida death metal band formed in 1987 whose 1991 debut The Ten Commandments establishe… |  |
| 16 | Pestilence | metal band | A Dutch death metal band who incorporated jazz fusion and atonal guitar work into their la… |  |
| 17 | Goatwhore | metal band | A New Orleans blackened death metal band formed by former members of Acid Bath; their name… | venue-cancellation superlative is unverifiable hyperbole |
| 18 | Warbringer | metal band | A Ventura County thrash revival band whose 2008 debut was recorded for under $10,000 and l… | "recorded for under $10,000" figure |
| 19 | Destroyer 666 | metal band | An Australian blackened thrash band formed in Melbourne in 1994 whose confrontational live… |  |
| 20 | Dying Fetus | metal band | A Maryland brutal death metal band known for combining blast-beat intensity with political… |  |
| 21 | Kreator | metal band | An Essen thrash metal band formed in 1982; along with Sodom and Destruction they form the… | grammar fixed during merge ("An Essen") |
| 22 | Unleashed | metal band | A Swedish death metal band formed in 1989 by former Nihilist members; their Viking mytholo… |  |
| 23 | Revocation | metal band | A Boston technical thrash and death metal band led by guitarist Dave Davidson, who holds a… |  |
| 24 | Aborted | metal band | A Belgian goregrind and death metal band formed in 1995 whose clinical surgical imagery an… |  |
| 25 | Vader | metal band | A Polish death metal institution formed in 1983 that managed to rehearse and record throug… |  |
| 26 | Jungle Rot | metal band | A Wisconsin death metal band whose no-frills, groove-heavy approach has earned them a loya… |  |
| 27 | Necrophagist | metal band | A German technical death metal band whose guitarist Muhammed Suiçmez recorded the entire d… |  |
| 28 | Impaled Nazarene | metal band | A Finnish black/thrash band formed in 1990 whose short, brutal songs and provocative image… |  |
| 29 | Entombed | metal band | Swedish pioneers who defined the Stockholm death metal sound using a Boss HM-2 distortion… |  |
| 30 | Carnage | metal band | A short-lived Swedish death metal band whose only 1990 album Dark Recollections is conside… |  |
| 31 | Suffocation | metal band | A New York brutal death metal band credited with inventing the "slam" riff — a breakdown-s… |  |
| 32 | Nile | metal band | A South Carolina technical death metal band whose lyrics, artwork and song structures are… |  |
| 33 | Morbid Angel | metal band | A Tampa death metal band whose 1989 debut Altars of Madness is credited as one of the foun… |  |
| 34 | Darkthrone | metal band | A Norwegian black metal duo who deliberately record in lo-fi on cheap equipment as an ideo… |  |
| 35 | Hypocrisy | metal band | A Swedish melodic death metal band whose vocalist Peter Tägtgren is a prolific producer wh… |  |
| 36 | Terrorizer | metal band | A Los Angeles grindcore band whose 1989 debut World Downfall featured future Morbid Angel… |  |
| 37 | Immolation | metal band | A New York death metal band whose dissonant, doom-influenced approach has remained deliber… |  |
| 38 | Desecrator | metal band | An Australian thrash metal band whose 2012 debut To the Gallows was recorded in a home stu… |  |
| 39 | Werewolf | metal band | A Finnish black metal solo project known for raw production and misanthropic lyrics; the p… | BI.ZONE names APT clusters "* Werewolf" — plain name kept |
| 40 | Witchery | metal band | A Swedish blackened thrash supergroup formed in 1997 featuring members of Mercyful Fate, T… |  |
| 41 | Impiety | metal band | A Singaporean blackened death metal band formed in 1990 — one of the oldest and most influ… |  |
| 42 | Exhumed | metal band | A California goregrind and death metal band whose self-described "gore metal" blends Carca… |  |
| 43 | Cryptic Slaughter | metal band | A Los Angeles crossover thrash band formed in 1984 whose hardcore punk and thrash metal fu… |  |
| 44 | Pyrexia | metal band | A New York brutal death metal band formed in 1991 whose slam-heavy approach and guttural v… |  |
| 45 | Centinex | metal band | A Swedish melodic death metal band formed in 1990 whose Gothenburg-influenced sound earned… | "Gothenburg-influenced melodic death" genre claim is shaky (straight Swedish DM from Dalarna) |
| 46 | Haunter | Pokémon | A Generation I Ghost-type that can pass through walls; its Pokédex entry warns it will try… |  |
| 47 | Darkrai | Pokémon | A Generation IV Mythical Pokémon that involuntarily causes endless nightmares in anyone wh… |  |
| 48 | Duskull | Pokémon | A Generation III Ghost-type whose Pokédex entry says it will follow a crying child through… |  |
| 49 | Spiritomb | Pokémon | A Generation IV Pokémon formed from 108 spirits bound into an Odd Keystone as punishment;… |  |
| 50 | Hydreigon | Pokémon | A Generation V Dark/Dragon pseudo-legendary whose Pokédex entry describes it as a cruel Po… |  |
| 51 | Sableye | Pokémon | A Generation III Dark/Ghost Pokémon that had no type weaknesses at all until the Fairy typ… | fact edited during merge to scope the no-weakness claim to pre-Gen VI |
| 52 | Banette | Pokémon | A Generation III Ghost-type born from a discarded stuffed toy that came to life out of pur… |  |
| 53 | Misdreavus | Pokémon | A Generation II Ghost-type that sneaks up on people to scare them and feeds on the resulti… |  |
| 54 | Absol | Pokémon | A Generation III Dark-type that can sense coming disasters; it is often blamed for causing… |  |
| 55 | Cacturne | Pokémon | A Generation III Grass/Dark Pokémon that follows travelers through deserts at night, waiti… |  |
| 56 | Seviper | Pokémon | A Generation III Poison-type with a centuries-old rivalry with Zangoose; the two species n… |  |
| 57 | Crawdaunt | Pokémon | A Generation III Water/Dark Pokémon so violent it drives every other Pokémon out of any po… |  |
| 58 | Houndoom | Pokémon | A Generation II Dark/Fire Pokémon whose burns never heal; in ancient times people believed… |  |
| 59 | Weavile | Pokémon | A Generation IV Dark/Ice Pokémon that hunts in packs and communicates by carving cryptic s… |  |
| 60 | Toxicroak | Pokémon | A Generation IV Poison/Fighting Pokémon that stores toxins collected from prey in its thro… |  |
| 61 | Drapion | Pokémon | A Generation IV Poison/Dark Pokémon strong enough to crush a car; despite its fearsome app… |  |
| 62 | Skuntank | Pokémon | A Generation IV Poison/Dark Pokémon that sprays a noxious fluid from its tail tip; the sme… |  |
| 63 | Croagunk | Pokémon | A Generation IV Poison/Fighting Pokémon whose poison jab is a move it uses even on teammat… |  |
| 64 | Gengar | Pokémon | One of the original 151 Pokémon; it lurks in cold shadows and Pokédex entries across multi… |  |
| 65 | Giratina | Pokémon | A Generation IV Ghost/Dragon Legendary banished to the Distortion World for its violent na… |  |
| 66 | Deoxys | Pokémon | A Generation III Psychic Legendary that originated as a space virus whose DNA mutated upon… |  |
| 67 | Zoroark | Pokémon | A Generation V Dark-type that can create hyper-realistic illusions of entire landscapes to… |  |
| 68 | Krookodile | Pokémon | A Generation V Ground/Dark Pokémon known as the "Intimidation Pokémon"; it clamps down on… |  |
| 69 | Mandibuzz | Pokémon | A Generation V Dark/Flying Pokémon that builds its nest from the bones of its prey; all wi… |  |
| 70 | Pangoro | Pokémon | A Generation VI Fighting/Dark Pokémon that carries a bamboo stalk in its mouth to track an… |  |
| 71 | Yveltal | Pokémon | A Generation VI Dark/Flying Legendary that absorbs the life force of all living things whe… |  |
| 72 | Greninja | Pokémon | A Generation VI Water/Dark Pokémon that creates throwing stars from compressed water; it w… |  |
| 73 | Noivern | Pokémon | A Generation VI Flying/Dragon Pokémon that flies through the darkest nights guided entirel… |  |
| 74 | Incineroar | Pokémon | A Generation VII Fire/Dark Pokémon styled after a professional heel wrestler; it deliberat… |  |
| 75 | Mimikyu | Pokémon | A Generation VII Ghost/Fairy Pokémon so frightening in its true form that a researcher who… |  |
| 76 | Salazzle | Pokémon | A Generation VII Poison/Fire Pokémon that exudes pheromone-laden gas to reverse-tame male… |  |
| 77 | Buzzwole | Pokémon | A Generation VII Bug/Fighting Ultra Beast that entered the Pokémon world through an Ultra… |  |
| 78 | Nihilego | Pokémon | A Generation VII Rock/Poison Ultra Beast that parasitises its host's nervous system, bring… |  |
| 79 | Grimmsnarl | Pokémon | A Generation VIII Dark/Fairy Pokémon that uses hair wrapped around its body like muscle; i… |  |
| 80 | Dragapult | Pokémon | A Generation VIII Dragon/Ghost pseudo-legendary that launches the Dreepy living in its hor… |  |
| 81 | Eternatus | Pokémon | A Generation VIII Poison/Dragon Legendary that arrived on Earth inside a meteorite 20,000… |  |
| 82 | Spectrier | Pokémon | A Generation VIII Ghost-type Legendary that steals the life force of sleeping creatures; i… |  |
| 83 | Basculegion | Pokémon | A Generation VIII Water/Ghost Pokémon possessed by the souls of fellow Basculin that peris… |  |
| 84 | Ceruledge | Pokémon | A Generation IX Fire/Ghost Pokémon clad in ancient armour fragments that absorbed so much… |  |
| 85 | Bombirdier | Pokémon | A Generation IX Flying/Dark Pokémon that drops things from great heights for reasons even… |  |
| 86 | Mabosstiff | Pokémon | A Generation IX Dark-type whose bond with its trainer is central to the Pokémon Scarlet an… |  |
| 87 | Kingambit | Pokémon | A Generation IX Dark/Steel Pokémon that only evolves after defeating other Bisharp who car… |  |
| 88 | Ursaluna | Pokémon | A Generation VIII Ground/Normal Pokémon that can detect objects buried deep underground us… |  |
| 89 | Revavroom | Pokémon | A Generation IX Steel/Poison Pokémon that forms a symbiotic relationship with the Team Sta… |  |
| 90 | Gholdengo | Pokémon | A Generation IX Steel/Ghost Pokémon made of 1,000 coins; it blocks all status moves direct… |  |
| 91 | Roaring Moon | Pokémon | A Generation IX Dragon/Dark Paradox Pokémon described as an ancient form of Salamence; its… |  |
| 92 | Iron Moth | Pokémon | A Generation IX Fire/Poison Paradox Pokémon resembling a futuristic Volcarona; it emits ra… |  |
| 93 | Pecharunt | Pokémon | A Generation IX Poison/Ghost Mythical Pokémon introduced in The Indigo Disk DLC; it contro… | technically debuted in the post-Indigo Disk "Mochi Mayhem" epilogue |
| 94 | Vite | JS framework | Created by Evan You (the creator of Vue) in 2020; it uses native ES module imports during… |  |
| 95 | Bun | JS framework | A JavaScript runtime, bundler, test runner and package manager in a single binary written… | "30× faster than npm" early-benchmark claim |
| 96 | Turbopack | JS framework | Vercel's Rust-based successor to Webpack, announced in 2022 as part of Next.js 13; it uses… |  |
| 97 | Rollup | JS framework | A module bundler that pioneered "tree shaking" — the process of removing unused code from… |  |
| 98 | Parcel | JS framework | A zero-configuration bundler that automatically infers build settings from file types, des… |  |
| 99 | Deno | JS framework | Created by Node.js inventor Ryan Dahl as a direct response to mistakes he acknowledged mak… |  |
| 100 | Elysia | JS framework | A TypeScript-first web framework built specifically for the Bun runtime; it uses a custom… |  |
| 101 | Nitro | JS framework | The server engine powering Nuxt 3; it compiles a universal server that can be deployed to… |  |
| 102 | Solid | JS framework | A reactive UI library that achieves React-like syntax but compiles reactive primitives dir… |  |
| 103 | Preact | JS framework | A 3KB alternative to React with an identical API; it was adopted by Google for several pro… |  |
| 104 | Vitest | JS framework | A Vite-native test runner that reuses Vite's transform pipeline to run tests without a sep… |  |
| 105 | Playwright | JS framework | A Microsoft-developed browser automation library that controls Chromium, Firefox and WebKi… |  |
| 106 | Turborepo | JS framework | A high-performance monorepo build system that caches task outputs and only reruns tasks wh… |  |
| 107 | Nx | JS framework | A monorepo tool that uses a computation cache and dependency graph to identify exactly whi… |  |
| 108 | Pnpm | JS framework | A package manager that stores every version of every package once on disk in a content-add… |  |
| 109 | Oxc | JS framework | A Rust-based JavaScript toolchain (parser, linter, formatter, transformer) designed to be… |  |
| 110 | Biome | JS framework | A Rust-based formatter and linter compatible with Prettier and ESLint configs; it formats… |  |
| 111 | WinterJS | JS framework | A JavaScript runtime built on the SpiderMonkey engine and written in Rust; it targets edge… | requests-per-second superlative is a vendor marketing claim |
| 112 | Tauri | JS framework | A desktop application framework that uses the OS's native web renderer instead of bundling… |  |
| 113 | BILLY | IKEA product | Introduced in 1979, BILLY is IKEA's longest-selling bookcase; an estimated one is sold som… |  |
| 114 | LACK | IKEA product | A minimalist side table whose top is a hollow honeycomb cardboard core between two fibrebo… |  |
| 115 | BESTÅ | IKEA product | A modular storage system designed around wall mounting; its name comes from the Swedish ve… | renamed from BESTA; dubious "the best" etymology replaced with "to endure" |
| 116 | IVAR | IKEA product | An untreated solid pine shelving system sold since 1953, making it one of IKEA's oldest co… |  |
| 117 | KLIPPAN | IKEA product | A two-seat sofa introduced in 1979 whose slip-on covers can be replaced and washed — a des… |  |
| 118 | FRIHETEN | IKEA product | A corner sofa-bed with a built-in storage chaise; it became one of IKEA's top-selling sofa… |  |
| 119 | TROFAST | IKEA product | A children's storage system with angled bins designed so that children can easily reach in… |  |
| 120 | NORDLI | IKEA product | A modular chest of drawers with built-in cable management holes and a top surface designed… |  |
| 121 | STUVA | IKEA product | A children's storage combination that includes loft bed frames, desks, drawers and wardrob… |  |
| 122 | PELLO | IKEA product | A low-profile armchair with a removable, washable cover designed to be a compact and affor… |  |
| 123 | EKTORP | IKEA product | A fully upholstered sofa range with deep seats and removable machine-washable covers; its… |  |
| 124 | RÅSKOG | IKEA product | A wheeled three-tier utility cart originally designed for the kitchen but widely adopted f… | diacritic restored (was RASKOG) |
| 125 | DIGNITET | IKEA product | A stainless steel curtain wire system that uses tension rather than a rod, allowing curtai… |  |
| 126 | SKÅDIS | IKEA product | A pegboard system with interchangeable accessories including shelves, cups and hooks; it w… | diacritic restored (was SKADIS) |
| 127 | MITTZON | IKEA product | A 2024 office furniture range designed to replace the BEKANT series; it includes sit-stand… | 2024 BEKANT-successor claim — verify |
| 128 | DUKTIG | IKEA product | A children's play kitchen made from solid birch that is scaled to child height; it has bee… | unverifiable "since 1987" softened to "for decades" |
| 129 | ALGOT | IKEA product | A wall-mounted storage system using a single bracket rail from which shelves, rods and bas… |  |
| 130 | BRIMNES | IKEA product | A bedroom range that includes a wardrobe with frosted glass doors and a headboard with bui… |  |
| 131 | KVISTBRO | IKEA product | A storage table with a hollow top accessed by lifting the tabletop lid; the interior is si… |  |
| 132 | FLISAT | IKEA product | A children's table with a built-in tilting tabletop that adjusts to different angles for d… |  |

### Batch 8 — rejected (34)

| Name | Reason |
|------|--------|
| WannaCry | already in malware.ts |
| NotPetya | already in malware.ts |
| Ryuk | already in malware.ts |
| LockBit | already in malware.ts |
| DarkSide | already in malware.ts |
| Stuxnet | already in malware.ts |
| Conficker | already in malware.ts |
| Mydoom | already in malware.ts |
| Slammer | already in malware.ts |
| CodeRed | already in malware.ts |
| ILOVEYOU | already in malware.ts |
| Gh0st | already in malware.ts |
| Mirai | already in malware.ts |
| Zeus | already in malware.ts |
| Emotet | already in malware.ts |
| TrickBot | already in malware.ts |
| Qakbot | already in malware.ts |
| Flame | already in malware.ts |
| GrayKey | law-enforcement forensic hardware, not malware — "threat intel flagged GrayKey" makes no sense |
| Pegasus | already in malware.ts |
| Necromancer | cannot verify a notable Linux rootkit by this name — likely fabricated |
| Grayware | a detection *category*, not a malware family — the reveal would assert a falsehood |
| Mastodon | already in malware.ts |
| Venom | fair-play conflict: VenomRAT + the VENOM vuln (CVE-2015-3456) make "malware" a defensible answer |
| Warzone | fair-play conflict: Warzone RAT (AveMaria) is a major commodity malware family |
| KALLAX | already in malware.ts |
| MALM | already in malware.ts |
| POÄNG | already in malware.ts |
| HEMNES | already in malware.ts |
| Svelte | already in malware.ts |
| Astro | already in malware.ts |
| Remix | already in malware.ts |
| Qwik | already in malware.ts |
| Hono | already in malware.ts |

---

## 5. Warm-up archive — `src/lib/data/warmup.ts` (3 days) — **NEEDS AUDIT (added 2026-06-12)**

Three pre-launch days (2026-06-09 → 06-11) playable from the archive so it isn't empty on day one. Content is exclusive to this file — nothing drawn from the daily pools. Triage runs deliberately easy; the malware deck is the comedy set. Claims to verify:

| Item | Claim to check |
|------|----------------|
| VENOM (CVE-2015-3456) | NVD CVSS **7.7 (v2)**; QEMU floppy controller compiled in regardless of config |
| goto fail (CVE-2014-1266) | NVD CVSS **5.8 (v2)**; duplicated `goto fail;` skipped the TLS signature check |
| BootHole (CVE-2020-10713) | NVD CVSS **8.2 (v3.1)**; grub.cfg parsing overflow defeats Secure Boot |
| Brain | 1986 first PC virus; authors' names/address/**two** phone numbers embedded |
| Anna Kournikova | author turned himself in; **mayor of Sneek job offer** |
| MEMZ | made for a YouTube series; Nyan Cat bootloader |
| Michelangelo | March 6 trigger; ~10k actual victims vs millions predicted |
| Stoned | "Your PC is now Stoned! Legalise Marijuana" wording |
| CIH | BIOS flash overwrite; author faced no prison time |
| Cascade / Ping-Pong / Happy99 | falling letters / bouncing dot / fireworks + self-mailing |
| Hatebeak | parrot vocalist Waldo; never plays live |
| Okilly Dokilly | "Nedal"; video aired over Simpsons credits |
| Mac Sabbath / Dethklok | Ronald Osbourne persona; Dethalbum II Billboard #15 (highest-charting death metal at the time) |
| FARTFULL / JÄTTEBRA / HUVUDROLL | real IKEA names; translations ("speedy" / "really great" / "leading role") |
| left-pad | 11 lines; 2016 npm unpublish broke React/Babel builds |
| haveibeenpwned.com (phish day 2) | legit-item claim — Troy Hunt attribution |

Mechanics note: warm-up dates are valid archive keys (`daily.svelte.ts`), render a `--warmup` badge instead of a day number, and the three CVE answers join the CVE-dle guess pool (typeable, never daily answers).

---

## Quick audit checklist

- [x] All flagged CVSS scores vs NVD — EternalBlue→8.8, GHOST→9.8, rest confirmed
- [x] PwnKit year clue — disclosure-year convention adopted dataset-wide
- [x] Mydoom figure softened; Stagefright → "950 million"
- [x] SKARPSNO → SMÅSPORRE (duvet)
- [x] Remix fact rewritten for the Remix 3 no-React reboot
- [x] Triage red herrings reviewed; puzzle 4 tile swapped for clarity
- [x] Fictional-domain disclaimer added to the Phish or Legit shell
- [ ] **NEW (2026-06-11):** guess pool `cvepool.ts` (57 entries) — verify CVSS/vector/year/product against NVD, esp. rows flagged in the "Check in particular" column
- [ ] **NEW (2026-06-12):** Triage puzzles 6–35 — tile-to-category fit + fairness of the benign groups
- [ ] **NEW (2026-06-12):** Phish items 11–80 — realism + every tell factually correct (esp. flagged rows 12/17/68 by original batch numbering)
- [ ] **NEW (2026-06-12):** Malware batch 8 (191 entries) — facts + the dual-use cluster judgment calls (Metasploit/XMRig/Cobalt Strike et al.)
- [ ] **NEW (2026-06-12):** Warm-up archive (section 5) — 3 CVE scores vs NVD + the comedy-deck facts
