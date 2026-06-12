# Seed data audit sheet

> **Status: audited & resolved (2026-06-10).** All flagged items were human-checked; corrections applied: EternalBlue 8.1→8.8, GHOST 10.0→9.8, Stagefright "≈1 billion"→"950 million", disclosure-year convention adopted (PwnKit = 2022), `cvssVersion`+`sourceUrl` fields added to every CVE; Mydoom figure softened, SKARPSNO→SMÅSPORRE, Behemoth→Opeth, Remix fact rewritten (Remix 3 no-React reboot), POÄNG fact now mentions POEM; phish item 9 → cloudflare.com/learning/ root + "fictional domains" footer in the game shell; Triage puzzle 4 "login from new country"→"valid creds via VPN, no MFA". Tables below reflect the corrected state.

Every entry shipped in `src/data/`, laid out for human fact-checking. All real-world claims (CVSS scores, years, attributions, fun facts) deserve a fresh pass whenever entries are added.

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
| 9 | url | `https://www.cloudflare.com/learning/` | **LEGIT** | real cloudflare.com; educational path; no credential bait |
| 10 | email | "Netflix" payment-declined from `info@netflix-billingupdate.com` with billing link on same junk domain | **PHISH** | bolted-words domain; payment pressure; real services let you log in directly |

One judgment call to audit: item 2's body addresses "pedrodev" — a sample username, fine for a game; change if you want it fully generic. Item 9 now uses the cloudflare.com/learning/ root. The game shell also shows a permanent "all phishing domains are fictional, nothing clickable" footer.

---

## 4. Malware or…? — `src/data/malware.ts` (42 entries)

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
