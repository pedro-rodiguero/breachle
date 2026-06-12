// Triage dataset: Connections-style puzzles. 4 hidden categories (attack
// types), 4 tiles each (short log artifacts / IOCs / alert snippets).
// Difficulty 1 is easiest (yellow), 4 trickiest (purple).
//
// Tiles carry deliberate red-herring overlaps across groups (an MFA prompt
// storm reads like account takeover but is really social engineering).

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
  {
    groups: [
      {
        category: 'Ransomware',
        difficulty: 1,
        tiles: ['files renamed .lockd', 'ransom_note.txt dropped', 'vssadmin delete shadows', 'file entropy spike'],
      },
      {
        category: 'Credential Dumping',
        difficulty: 2,
        tiles: ['lsass.exe memory read', 'procdump -ma lsass', 'mimikatz sekurlsa::', 'NTDS.dit copied'],
      },
      {
        category: 'DNS Tunneling',
        difficulty: 3,
        tiles: ['TXT query, 4KB payload', '8k subdomain lookups/hr', 'base32 in hostnames', 'all DNS to one odd NS'],
      },
      {
        category: 'Scheduled Backup (Benign)',
        difficulty: 4,
        tiles: ['nightly 02:00 disk reads', 'veeam.exe heavy I/O', 'bulk copy to backup NAS', 'VSS snapshot created'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'Vulnerability Scanning',
        difficulty: 1,
        tiles: ['Nessus UA in access logs', 'sequential port probes', '404s on /admin /backup', 'nikto signature hits'],
      },
      {
        category: 'Web Shell Activity',
        difficulty: 2,
        tiles: ['cmd.aspx in /uploads', 'w3wp.exe spawns cmd.exe', 'POST to image.php?c=id', 'china chopper traffic'],
      },
      {
        category: 'Kerberos Abuse',
        difficulty: 3,
        tiles: ['TGS req RC4 downgrade', 'spike in SPN requests', 'ticket lifetime 10 years', 'AS-REP roastable accts'],
      },
      {
        category: 'Cryptomining',
        difficulty: 4,
        tiles: ['xmrig in process list', 'CPU pegged off-hours', 'stratum+tcp connection', 'GPU fans 100% at idle'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'Smishing',
        difficulty: 1,
        tiles: ['"USPS: pay $0.30 fee" SMS', 'bit.ly link in text msg', '"Mom, new number" text', 'SMS: bank acct locked'],
      },
      {
        category: 'Cloud Misconfiguration',
        difficulty: 2,
        tiles: ['S3 bucket public-read', 'SG allows 0.0.0.0/0:22', 'IAM key in public repo', 'anonymous blob container'],
      },
      {
        category: 'Process Injection',
        difficulty: 3,
        tiles: ['CreateRemoteThread call', 'hollowed svchost.exe', 'VirtualAllocEx + WRITE', 'notepad.exe loads ws2_32'],
      },
      {
        category: 'Log Tampering',
        difficulty: 4,
        tiles: ['wevtutil cl Security', 'bash_history symlinked', 'event gap 02:10–03:40', 'auditd service stopped'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'USB Attack',
        difficulty: 1,
        tiles: ['rubber ducky VID/PID', 'autorun.inf on E: drive', 'HID types 4000 WPM', 'USB drop in parking lot'],
      },
      {
        category: 'MFA Attacks',
        difficulty: 2,
        tiles: ['47 push prompts/10 min', 'push approved 03:12 local', 'OTP relayed via proxy', 'evilginx session capture'],
      },
      {
        category: 'Command & Control',
        difficulty: 3,
        tiles: ['beacon every 60s ±10%', 'TLS to raw IP, no SNI', 'long-poll to /jquery.js', 'hex blobs in cookies'],
      },
      {
        category: 'Pentest Activity (Benign)',
        difficulty: 4,
        tiles: ['ROE on file for this IP', 'red team calendar block', 'kali box on approved VLAN', 'report due to CISO Friday'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'SQL Injection',
        difficulty: 1,
        tiles: ["' OR 1=1-- in query log", 'UNION SELECT in URL', 'sleep(5) timing probes', '500s on search param'],
      },
      {
        category: 'Insider Threat',
        difficulty: 2,
        tiles: ['salary.xlsx to gmail', 'badge-in 11PM, no ticket', 'resignation + bulk export', 'CRM dump by sales rep'],
      },
      {
        category: 'Pass-the-Hash',
        difficulty: 3,
        tiles: ['NTLM logon type 3 burst', 'same NT hash, 14 hosts', 'ADMIN$ mounted remotely', 'NTLM used in Kerberos realm'],
      },
      {
        category: 'DGA Domains',
        difficulty: 4,
        tiles: ['qhxz3kv.top NXDOMAIN', '900 NXDOMAINs/host/hr', 'consonant-heavy FQDNs', 'domain age: 2 hours'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'Phishing Delivery',
        difficulty: 1,
        tiles: ['ISO attachment in email', 'href ≠ anchor text', 'urgent invoice .htm', 'reply-to differs from From'],
      },
      {
        category: 'IoT Botnet',
        difficulty: 2,
        tiles: ['telnet sweep from DVR', 'camera tries admin/admin', 'Mirai variant signature', 'thermostat floods SYNs'],
      },
      {
        category: 'Token Theft',
        difficulty: 3,
        tiles: ['cookie reused post-logout', 'token replay from new ASN', 'OAuth refresh via Tor exit', 'impossible travel, same JWT'],
      },
      {
        category: 'Normal Admin Activity',
        difficulty: 4,
        tiles: ['psexec by IT, ticketed', 'RDP from jump host', 'GPO push in patch window', 'local admin added, CHG-4412'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'Brute Force',
        difficulty: 1,
        tiles: ['Event 4625 ×600 in 5 min', 'sshd: 900 auth failures', 'lockouts on 40 accounts', 'one password, all users'],
      },
      {
        category: 'Email Spoofing Tells',
        difficulty: 2,
        tiles: ['SPF: softfail ~all', 'DKIM bodyhash mismatch', 'From ≠ Return-Path', 'display name "IT Support"'],
      },
      {
        category: 'Data Staging',
        difficulty: 3,
        tiles: ['archive.zip 9GB in %TEMP%', '7z a -p on file server', 'rar parts in C:\PerfLogs', 'chunked 500MB volumes'],
      },
      {
        category: 'Container Escape',
        difficulty: 4,
        tiles: ['--privileged flag set', 'docker.sock in container', 'cgroup release_agent write', 'host PID namespace shared'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'Physical Intrusion',
        difficulty: 1,
        tiles: ['tailgating on CCTV', 'badge cloned, used 2 sites', 'server room door forced', 'rogue device on patch panel'],
      },
      {
        category: 'PowerShell Abuse',
        difficulty: 2,
        tiles: ['powershell -enc JABz...', '-nop -w hidden -noni', 'IEX(New-Object WebClient)', 'PS engine v2 downgrade'],
      },
      {
        category: 'Certificate Anomalies',
        difficulty: 3,
        tiles: ['self-signed cert on 443', 'CN mismatch on login page', 'leaf cert age: 1 hour', 'serial reused across IPs'],
      },
      {
        category: 'Supply Chain',
        difficulty: 4,
        tiles: ['npm postinstall curl|sh', 'pip pkg "reqeusts" pulled', 'CI pulls unpinned image', 'signed installer, odd cert'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'Cross-Site Scripting',
        difficulty: 1,
        tiles: ['<script> in comment field', 'onerror=alert(1) probe', 'document.cookie in payload', 'stored JS in profile bio'],
      },
      {
        category: 'Honeypot Telemetry',
        difficulty: 2,
        tiles: ['canary token triggered', 'honeyuser logon attempt', 'decoy share accessed', 'tarpit conn held 90 min'],
      },
      {
        category: 'SIM Swapping',
        difficulty: 3,
        tiles: ['carrier port-out at 9PM', 'phone shows SOS only', '2FA SMS to new IMEI', 'acct recovery via phone'],
      },
      {
        category: 'Defense Evasion',
        difficulty: 4,
        tiles: ['AMSI patch in memory', 'ETW provider disabled', 'Defender exclusion added', 'timestomped DLL'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'Mobile Malware',
        difficulty: 1,
        tiles: ['sideloaded APK, off-store', 'accessibility svc abuse', 'app requests SMS perms', 'banking overlay drawn'],
      },
      {
        category: 'Wi-Fi Attacks',
        difficulty: 2,
        tiles: ['deauth frame flood', 'rogue AP, same SSID', 'WPA handshake captured', 'karma responds to probes'],
      },
      {
        category: 'Credential Stuffing',
        difficulty: 3,
        tiles: ['1 UA, 5,000 source IPs', 'breach combo list replay', 'login success rate 0.2%', 'same pwd pairs as 2019 dump'],
      },
      {
        category: 'Living off the Land',
        difficulty: 4,
        tiles: ['certutil -urlcache fetch', 'bitsadmin /transfer job', 'mshta remote .hta run', 'wmic process call create'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'Lateral Movement',
        difficulty: 1,
        tiles: ['wmiexec to 12 hosts', 'PsExec across /24 subnet', 'SMB tree connect spike', 'RDP hop via compromised box'],
      },
      {
        category: 'Rootkit Indicators',
        difficulty: 2,
        tiles: ['DKOM hides PID 4812', 'syscall hook in SSDT', '/proc/PID missing, port open', 'kernel module no signature'],
      },
      {
        category: 'OAuth Phishing',
        difficulty: 3,
        tiles: ['consent to "Read All Mail"', 'third-party app, broad scope', 'OAuth token, no pwd used', 'mail forward rule added'],
      },
      {
        category: 'Routine Patch Tuesday',
        difficulty: 4,
        tiles: ['SCCM push 09:00 Tuesday', 'msiexec mass installs', 'reboot wave 14 hosts', 'WUA activity in event log'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'Denial of Service',
        difficulty: 1,
        tiles: ['SYN flood 800 kpps', 'UDP amplification x140', 'HTTP/2 rapid reset burst', 'ICMP flood saturates link'],
      },
      {
        category: 'Account Takeover',
        difficulty: 2,
        tiles: ['new country first login', 'inbox rule: delete alerts', 'password reset 04:00 UTC', 'recovery email swapped'],
      },
      {
        category: 'Printer Exploitation',
        difficulty: 3,
        tiles: ['PrintSpooler RCE attempt', 'driver install by user', 'spoolsv spawns cmd.exe', 'DCERPC to spooler pipe'],
      },
      {
        category: 'Legitimate DevOps',
        difficulty: 4,
        tiles: ['Jenkins deploy 23:00', 'Terraform apply in CI', 'Docker pull from registry', 'k8s rollout restart prod'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'Initial Access via Macro',
        difficulty: 1,
        tiles: ['WINWORD spawns wscript', '.docm auto-open trigger', 'mshta.exe child of Office', 'VBA shell() to cmd'],
      },
      {
        category: 'Exfiltration via Cloud',
        difficulty: 2,
        tiles: ['20GB to personal Dropbox', 'rclone to unknown bucket', 'mega.nz upload at 3AM', 'curl PUT to pastebin API'],
      },
      {
        category: 'SSRF',
        difficulty: 3,
        tiles: ['req to 169.254.169.254', 'internal port scan via app', 'gopher:// in url param', 'app fetches file:///etc/passwd'],
      },
      {
        category: 'Firewall Rule Change',
        difficulty: 4,
        tiles: ['any-any rule added 02:15', 'FW policy export event', 'inbound 3389 opened', 'mgmt plane login off-hours'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'Spear Phishing',
        difficulty: 1,
        tiles: ['CEO name in lure doc', 'email cites real project', 'attacker knows hire date', 'reply-to: free webmail'],
      },
      {
        category: 'DNS Hijacking',
        difficulty: 2,
        tiles: ['registrar login from TOR', 'NS records changed 01:00', 'zone file diff via API', 'resolves to new ASN'],
      },
      {
        category: 'Steganography',
        difficulty: 3,
        tiles: ['PNG to C2: steg payload', 'exiftool shows extra data', 'image LSB entropy spike', 'large IDAT chunk, small img'],
      },
      {
        category: 'Acceptable-Use Violation (Benign)',
        difficulty: 4,
        tiles: ['Netflix on corp Wi-Fi', 'Steam download 18GB', 'personal Gmail in browser', 'Spotify desktop app'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'Privilege Escalation',
        difficulty: 1,
        tiles: ['SUID binary exploited', 'sudo -l: (ALL) NOPASSWD', 'token impersonation call', 'SeDebugPrivilege enabled'],
      },
      {
        category: 'Adversarial ML',
        difficulty: 2,
        tiles: ['prompt injection in PDF', 'malicious fine-tune submit', 'training data poisoning', 'model inversion attempt'],
      },
      {
        category: 'Time-Based Evasion',
        difficulty: 3,
        tiles: ['payload sleeps 30 days', 'C2 only contacts 9–5 UTC', 'sandbox uptime check', 'stager reads system clock'],
      },
      {
        category: 'Zero-Day Exploit',
        difficulty: 4,
        tiles: ['crash before patch exists', 'no public CVE at alert time', 'vendor notified same day', 'IOC matches 0 signatures'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'Reconnaissance',
        difficulty: 1,
        tiles: ['WHOIS burst on /24', 'Shodan scan of org ASN', 'LinkedIn harvest bot', 'subfinder on corp domain'],
      },
      {
        category: 'Firmware Attack',
        difficulty: 2,
        tiles: ['UEFI mod in flash write', 'BMC login from internet', 'SPI flash unusual write', 'iDRAC default creds used'],
      },
      {
        category: 'Cross-Tenant Abuse',
        difficulty: 3,
        tiles: ['guest→member role escalation', 'external collab file access', 'tenant misconfigured trust', 'cross-org Teams message lure'],
      },
      {
        category: 'Backup System Activity (Benign)',
        difficulty: 4,
        tiles: ['Veeam restores test VM', 'tape rotation 07:00 Mon', 'backup job NFS mount', 'agent reports to backup srv'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'Ransomware',
        difficulty: 1,
        tiles: ['README_DECRYPT.txt found', 'net stop "Volume Shadow"', 'encrypted shares go dark', 'Tor .onion in ransom note'],
      },
      {
        category: 'API Abuse',
        difficulty: 2,
        tiles: ['10k API calls/min, 1 key', 'GraphQL introspection on', 'REST DELETE /* attempted', 'API key in public JS file'],
      },
      {
        category: 'Watering Hole',
        difficulty: 3,
        tiles: ['industry site iframe inject', 'legit page loads hidden JS', 'profiled visitor targeting', 'drive-by on trade forum'],
      },
      {
        category: 'BGP Hijacking',
        difficulty: 4,
        tiles: ['prefix hijack in route table', 'AS path prepend anomaly', 'traffic rerouted via AS1234', 'RPKI invalid announcement'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'Persistence',
        difficulty: 1,
        tiles: ['HKCU Run key added', 'new service ImagePath odd', 'cron job added by www-data', 'LoginHook set on macOS'],
      },
      {
        category: 'Cryptomining',
        difficulty: 2,
        tiles: ['high CPU, no dev ticket', 'pool.minexmr.com in DNS', 'low-priority proc, steady', 'miner in K8s DaemonSet'],
      },
      {
        category: 'Physical Exfiltration',
        difficulty: 3,
        tiles: ['USB 64GB in badge-out log', 'laptop left in taxi report', 'hard drive wiped, returned', 'cam photos of screen seen'],
      },
      {
        category: 'Adversary-in-the-Middle',
        difficulty: 4,
        tiles: ['ARP spoof on gateway IP', 'SSL strip on port 80', 'duplicate MAC on switch', 'cert issued by rogue CA'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'Social Engineering',
        difficulty: 1,
        tiles: ['caller claims to be CEO', 'vishing to reset MFA', 'fake IT desk walk-in', 'pretexting for wire xfer'],
      },
      {
        category: 'Memory-Only Malware',
        difficulty: 2,
        tiles: ['no file on disk, shell runs', 'reflective DLL in memory', 'hollow process, no PE path', 'payload in page file only'],
      },
      {
        category: 'Kubernetes Misuse',
        difficulty: 3,
        tiles: ['pod with hostPath: /', 'anonymous kubectl access', 'tiller exposed port 44134', 'RBAC wildcard * on secrets'],
      },
      {
        category: 'Legitimate Backup (Benign)',
        difficulty: 4,
        tiles: ['Acronis reads all drives', 'daily shadow copy 03:00', 'robocopy to DR site', 'backup user bulk read'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'Credential Phishing',
        difficulty: 1,
        tiles: ['fake O365 login page', 'password entered, then 401', 'form POSTs to attacker IP', 'harvested creds in access log'],
      },
      {
        category: 'Exfiltration via DNS',
        difficulty: 2,
        tiles: ['hostname = base64 data', 'low-TTL subdomain flood', 'iodine tunnel detected', 'DNS reply carries payload'],
      },
      {
        category: 'Hardware Implant',
        difficulty: 3,
        tiles: ['unknown NIC on server', 'PCI device post-delivery', 'IPMI traffic to unknown IP', 'HDD firmware reflash event'],
      },
      {
        category: 'SIEM Misconfiguration (Benign)',
        difficulty: 4,
        tiles: ['log source silent 6 hrs', 'agent version mismatch', 'parsing error on new app', 'index rotation at 00:00'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'Business Email Compromise',
        difficulty: 1,
        tiles: ['wire transfer req from CEO', 'reply-to: ceo@gmail.com', 'urgent, bypass approvals', 'sent from mobile, typos'],
      },
      {
        category: 'Active Directory Recon',
        difficulty: 2,
        tiles: ['BloodHound ingestor ran', 'ldap query: all admin grps', 'net group "Domain Admins"', 'PowerView running in mem'],
      },
      {
        category: 'Bootkit',
        difficulty: 3,
        tiles: ['MBR hash mismatch', 'boot sector write at 02:00', 'BIOS/UEFI resists wipe', 'OS loader replaced'],
      },
      {
        category: 'Scheduled Scan (Benign)',
        difficulty: 4,
        tiles: ['CrowdStrike scan 01:00', 'Qualys agent daily check', 'AV sig update 04:30', 'EDR telemetry burst, daily'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'Exfiltration via Email',
        difficulty: 1,
        tiles: ['250 emails to hotmail', 'bulk BCC to personal acct', 'attachments zipped, sent out', '40MB PST forwarded out'],
      },
      {
        category: 'Living off the Land',
        difficulty: 2,
        tiles: ['regsvr32 scrobj.dll run', 'rundll32 loads remote DLL', 'odbcconf /a {regsvr}', 'forfiles /c "cmd /c calc"'],
      },
      {
        category: 'BGP Misconfiguration (Benign)',
        difficulty: 3,
        tiles: ['route leak to upstream', 'AS path longer than usual', 'peer session reset logged', 'prefix withdrawn, readded'],
      },
      {
        category: 'Kernel Exploit',
        difficulty: 4,
        tiles: ['nt!MiDispatchFault crash', 'win32k null deref attempt', 'KASLR bypass via info leak', 'ring-0 shellcode in pool'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'Phishing Delivery',
        difficulty: 1,
        tiles: ['HTML smuggling attach', 'zip: invoice.exe inside', 'lnk file calls powershell', 'pdf with embedded js'],
      },
      {
        category: 'Cloud Cryptojacking',
        difficulty: 2,
        tiles: ['50 GPU instances spun up', 'spot fleet: mining binary', 'IAM key used to scale EC2', 'billing spike: $14k/day'],
      },
      {
        category: 'LDAP Injection',
        difficulty: 3,
        tiles: ['*(uid=*))(|(uid=* in field', 'auth bypass via LDAP null', 'attr dump via crafted filter', 'dir service 500 errors'],
      },
      {
        category: 'Patch Deployment (Benign)',
        difficulty: 4,
        tiles: ['WSUS push 22:00 Sunday', 'chef-client apply run', 'ansible playbook: updates', 'yum update in cron 03:00'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'Ransomware',
        difficulty: 1,
        tiles: ['SMB shares bulk encrypted', 'backup catalog deleted', 'taskill /f on AV process', 'new .enc extension wave'],
      },
      {
        category: 'Subdomain Takeover',
        difficulty: 2,
        tiles: ['CNAME to defunct SaaS', 'dangling DNS entry found', 'claimed bucket, same name', 'attacker hosts on old CNAME'],
      },
      {
        category: 'Malicious Insider (Sabotage)',
        difficulty: 3,
        tiles: ['prod DB truncated at 23:55', 'admin drops tables, quits', 'git history wiped by owner', 'firewall rules deleted'],
      },
      {
        category: 'Developer Workflow (Benign)',
        difficulty: 4,
        tiles: ['git push to main 02:00', 'npm install in pipeline', 'localhost:3000 in browser', 'VS Code server on 8080'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'Account Takeover',
        difficulty: 1,
        tiles: ['leaked cred on dark web', 'session cookie replayed', 'profile email changed 3AM', 'new device, no MFA prompt'],
      },
      {
        category: 'Reverse Shell',
        difficulty: 2,
        tiles: ['bash -i >& /dev/tcp/…', 'nc -e /bin/sh to ext IP', 'python pty.spawn shell', 'child proc: /bin/sh -i'],
      },
      {
        category: 'Wi-Fi Deauthentication',
        difficulty: 3,
        tiles: ['802.11 reason code 7 flood', 'clients drop every 30s', 'AP logs: disassoc storm', 'management frame flood'],
      },
      {
        category: 'Routine Log Rotation (Benign)',
        difficulty: 4,
        tiles: ['logrotate 00:00 daily', 'syslog compressed .gz', 'old logs archived to S3', 'rsyslog reload signal'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'Defense Evasion',
        difficulty: 1,
        tiles: ['binary padded to 550MB', 'PE header stomped', 'signed binary sideloaded', 'legitimate cert on payload'],
      },
      {
        category: 'Typosquatting Attack',
        difficulty: 2,
        tiles: ['corp-rnail.com in headers', 'paypa1.com in URL bar', 'arnazon-orders.net link', 'googIe.com lookalike'],
      },
      {
        category: 'Industrial Control Attack',
        difficulty: 3,
        tiles: ['PLC ladder logic mod', 'HMI cmd outside SCADA', 'OT network lateral move', 'historian DB queried oddly'],
      },
      {
        category: 'Security Tool Update (Benign)',
        difficulty: 4,
        tiles: ['Splunk forwarder upgrade', 'carbon black sensor push', 'Tenable plugin refresh', 'CrowdStrike sensor update'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'Data Exfiltration',
        difficulty: 1,
        tiles: ['100GB outbound at 2AM', 'traffic to unfamiliar ASN', 'SFTP to residential IP', 'large PUT to storage API'],
      },
      {
        category: 'Persistence',
        difficulty: 2,
        tiles: ['DLL search-order hijack', 'COM object redirected', 'AppInit_DLLs value set', 'WMI event subscription'],
      },
      {
        category: 'Insider Data Theft',
        difficulty: 3,
        tiles: ['1,200 files opened last day', 'USB inserted, files copied', 'AirDrop to personal Mac', 'searched "how to resign"'],
      },
      {
        category: 'Cloud Automation (Benign)',
        difficulty: 4,
        tiles: ['Lambda runs every 5 min', 'EventBridge fires schedule', 'Azure runbook 06:00 daily', 'GCP Cloud Scheduler job'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'Spear Phishing',
        difficulty: 1,
        tiles: ['lure refs internal wiki', 'attacker spoofs HR email', 'onboarding doc malicious', 'target named in subject'],
      },
      {
        category: 'Command & Control',
        difficulty: 2,
        tiles: ['domain fronting via CDN', 'HTTPS to .onion bridge', 'low-freq callback: 6hr', 'binary protocol on 443'],
      },
      {
        category: 'Memory Forensics Indicators',
        difficulty: 3,
        tiles: ['injected VAD no file', 'MZ header in heap region', 'shellcode NOP sled found', 'export table stomped'],
      },
      {
        category: 'Certificate Renewal (Benign)',
        difficulty: 4,
        tiles: ["Let's Encrypt renew cron", 'ACME challenge to .well-known', 'cert expiry alert: 30 days', 'new cert same CN deployed'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'Supply Chain',
        difficulty: 1,
        tiles: ['upstream lib backdoored', 'build server compromised', 'artifact hash changed', 'dependency confusion pkg'],
      },
      {
        category: 'Exfiltration via ICMP',
        difficulty: 2,
        tiles: ['ICMP payload >64 bytes', 'ptunnel signature seen', 'ping reply carries data', 'ICMP type 0 with secrets'],
      },
      {
        category: 'Social Engineering',
        difficulty: 3,
        tiles: ['IT impersonated by phone', 'urgency + secrecy combo', '"do not tell your manager"', 'gift card req via email'],
      },
      {
        category: 'Network Maintenance (Benign)',
        difficulty: 4,
        tiles: ['link flap during fiber work', 'BGP session down 10 min', 'planned VLAN migration', 'switch reboot: CHG-7821'],
      },
    ],
  },
  {
    groups: [
      {
        category: 'Web Exploitation',
        difficulty: 1,
        tiles: ['LFI: ../../../../etc/passwd', 'RFI loads remote shell', 'XXE in SOAP body', 'SSTI: {{7*7}} returns 49'],
      },
      {
        category: 'Cryptomining',
        difficulty: 2,
        tiles: ['browser tab pegs CPU', 'coinhive-style JS loaded', 'WebAssembly miner in page', 'mining pool IP in proxy log'],
      },
      {
        category: 'Email Infrastructure Attack',
        difficulty: 3,
        tiles: ['open relay exploited', 'SPF record TXT removed', 'MX changed to attacker srv', 'DKIM private key leaked'],
      },
      {
        category: 'Legitimate Monitoring (Benign)',
        difficulty: 4,
        tiles: ['Datadog agent polling', 'SNMP walk every 60s', 'Pingdom probe from US/EU', 'Zabbix host check 30s'],
      },
    ],
  },
]
