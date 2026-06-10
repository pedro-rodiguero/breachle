// CVE-dle dataset. Verified against NVD on 2026-06-10.
// `year` is the disclosure year, which can differ from the CVE id year
// (PwnKit is CVE-2021-4034 but went public in Jan 2022). cvss/cvssVersion
// match NVD; sourceUrl is the NVD page. Add entries as needed.

export type Cve = {
  // Canonical answer, e.g. "Log4Shell".
  id: string
  // Accepted alternate spellings.
  aliases: string[]
  cveId?: string
  cvss: number
  // CVSS version for the score, e.g. "3.1".
  cvssVersion: string
  // Attack vector, e.g. "Network".
  vector: string
  // Year disclosed (see note above).
  year: number
  product: string
  // CWE family, human-readable.
  cwe: string
  // Shown with the answer name redacted.
  description: string
  // NVD page, for auditing.
  sourceUrl: string
  logoUrl?: string
}

const nvd = (cveId: string) => `https://nvd.nist.gov/vuln/detail/${cveId}`

export const CVES: Cve[] = [
  {
    id: 'Heartbleed',
    aliases: ['Heart bleed'],
    cveId: 'CVE-2014-0160',
    cvss: 7.5,
    cvssVersion: '3.1',
    vector: 'Network',
    year: 2014,
    product: 'OpenSSL',
    cwe: 'Buffer over-read',
    description:
      'A missing bounds check in the TLS heartbeat extension lets attackers read up to 64KB of server memory per request, leaking keys and passwords.',
    sourceUrl: nvd('CVE-2014-0160'),
  },
  {
    id: 'Log4Shell',
    aliases: ['Log4j', 'LogJam4j', 'Log4j RCE'],
    cveId: 'CVE-2021-44228',
    cvss: 10.0,
    cvssVersion: '3.1',
    vector: 'Network',
    year: 2021,
    product: 'Apache Log4j 2',
    cwe: 'JNDI / expression injection',
    description:
      'Logging a crafted string like ${jndi:ldap://…} makes the logger fetch and execute remote code, turning any logged user input into RCE.',
    sourceUrl: nvd('CVE-2021-44228'),
  },
  {
    id: 'Shellshock',
    aliases: ['Bashdoor', 'Bash bug'],
    cveId: 'CVE-2014-6271',
    cvss: 9.8,
    cvssVersion: '3.1',
    vector: 'Network',
    year: 2014,
    product: 'GNU Bash',
    cwe: 'OS command injection',
    description:
      'The shell executed trailing commands hidden in environment variable function definitions, exploitable through CGI scripts and DHCP clients.',
    sourceUrl: nvd('CVE-2014-6271'),
  },
  {
    id: 'EternalBlue',
    aliases: ['Eternal Blue', 'MS17-010'],
    cveId: 'CVE-2017-0144',
    cvss: 8.8,
    cvssVersion: '3.1',
    vector: 'Network',
    year: 2017,
    product: 'Microsoft Windows SMBv1',
    cwe: 'Remote code execution (memory corruption)',
    description:
      'An NSA exploit leaked by the Shadow Brokers targeting the SMBv1 protocol; it powered the WannaCry and NotPetya outbreaks.',
    sourceUrl: nvd('CVE-2017-0144'),
  },
  {
    id: 'Spectre',
    aliases: ['Spectre v1'],
    cveId: 'CVE-2017-5753',
    cvss: 5.6,
    cvssVersion: '3.1',
    vector: 'Local',
    year: 2018,
    product: 'Modern CPUs (Intel, AMD, ARM)',
    cwe: 'Side-channel information disclosure',
    description:
      'Abuses speculative execution and branch prediction to trick a processor into leaking another process’s secrets through cache timing.',
    sourceUrl: nvd('CVE-2017-5753'),
  },
  {
    id: 'Meltdown',
    aliases: [],
    cveId: 'CVE-2017-5754',
    cvss: 5.6,
    cvssVersion: '3.1',
    vector: 'Local',
    year: 2018,
    product: 'Intel CPUs',
    cwe: 'Side-channel information disclosure',
    description:
      'Out-of-order execution lets unprivileged code read kernel memory, melting the boundary between user space and the operating system.',
    sourceUrl: nvd('CVE-2017-5754'),
  },
  {
    id: 'Dirty COW',
    aliases: ['DirtyCOW', 'Dirty Cow'],
    cveId: 'CVE-2016-5195',
    cvss: 7.0,
    cvssVersion: '3.1',
    vector: 'Local',
    year: 2016,
    product: 'Linux kernel',
    cwe: 'Race condition',
    description:
      'A race in the kernel’s copy-on-write handling lets a local user write to read-only memory mappings and escalate to root.',
    sourceUrl: nvd('CVE-2016-5195'),
  },
  {
    id: 'BlueKeep',
    aliases: ['Blue Keep'],
    cveId: 'CVE-2019-0708',
    cvss: 9.8,
    cvssVersion: '3.1',
    vector: 'Network',
    year: 2019,
    product: 'Microsoft Windows RDP',
    cwe: 'Use after free',
    description:
      'A pre-authentication, wormable flaw in Remote Desktop Services; Microsoft even patched Windows XP out of fear of another WannaCry.',
    sourceUrl: nvd('CVE-2019-0708'),
  },
  {
    id: 'KRACK',
    aliases: ['Key Reinstallation Attack'],
    cveId: 'CVE-2017-13077',
    cvss: 6.8,
    cvssVersion: '3.1',
    vector: 'Adjacent network',
    year: 2017,
    product: 'WPA2 (Wi-Fi)',
    cwe: 'Cryptographic weakness',
    description:
      'Replaying handshake messages forces nonce reuse in the Wi-Fi encryption protocol, letting nearby attackers decrypt supposedly protected traffic.',
    sourceUrl: nvd('CVE-2017-13077'),
  },
  {
    id: 'POODLE',
    aliases: ['Poodle attack'],
    cveId: 'CVE-2014-3566',
    cvss: 3.4,
    cvssVersion: '3.1',
    vector: 'Network',
    year: 2014,
    product: 'SSL 3.0',
    cwe: 'Padding oracle / cryptographic weakness',
    description:
      'Forces a downgrade to an obsolete protocol version, then uses its broken CBC padding as an oracle to decrypt cookies byte by byte.',
    sourceUrl: nvd('CVE-2014-3566'),
  },
  {
    id: 'DROWN',
    aliases: ['DROWN attack'],
    cveId: 'CVE-2016-0800',
    cvss: 5.9,
    cvssVersion: '3.1',
    vector: 'Network',
    year: 2016,
    product: 'SSLv2 / OpenSSL',
    cwe: 'Cryptographic weakness',
    description:
      'Servers still speaking the ancient SSLv2 protocol can be used as an oracle to decrypt modern TLS sessions that share the same RSA key.',
    sourceUrl: nvd('CVE-2016-0800'),
  },
  {
    id: 'GHOST',
    aliases: ['Ghost glibc'],
    cveId: 'CVE-2015-0235',
    cvss: 9.8,
    cvssVersion: '3.1',
    vector: 'Network',
    year: 2015,
    product: 'GNU glibc',
    cwe: 'Buffer overflow',
    description:
      'A heap overflow in the gethostbyname() functions of the C standard library, remotely triggerable through software that resolves hostnames.',
    sourceUrl: nvd('CVE-2015-0235'),
  },
  {
    id: 'Stagefright',
    aliases: ['Stage fright'],
    cveId: 'CVE-2015-1538',
    cvss: 9.8,
    cvssVersion: '3.1',
    vector: 'Network',
    year: 2015,
    product: 'Android (libstagefright)',
    cwe: 'Integer overflow',
    description:
      'A malicious multimedia message could execute code on an estimated 950 million phones before the victim even opened it.',
    sourceUrl: nvd('CVE-2015-1538'),
  },
  {
    id: 'ProxyLogon',
    aliases: ['Proxy Logon'],
    cveId: 'CVE-2021-26855',
    cvss: 9.8,
    cvssVersion: '3.1',
    vector: 'Network',
    year: 2021,
    product: 'Microsoft Exchange Server',
    cwe: 'Server-side request forgery',
    description:
      'A pre-auth SSRF that impersonates the mail server itself; chained with a file-write bug it gave the HAFNIUM group shells on thousands of servers.',
    sourceUrl: nvd('CVE-2021-26855'),
  },
  {
    id: 'PrintNightmare',
    aliases: ['Print Nightmare'],
    cveId: 'CVE-2021-34527',
    cvss: 8.8,
    cvssVersion: '3.1',
    vector: 'Network',
    year: 2021,
    product: 'Microsoft Windows Print Spooler',
    cwe: 'Improper privilege management',
    description:
      'Authenticated users could load attacker-controlled printer drivers, yielding remote code execution as SYSTEM on domain controllers.',
    sourceUrl: nvd('CVE-2021-34527'),
  },
  {
    id: 'Zerologon',
    aliases: ['Zero Logon'],
    cveId: 'CVE-2020-1472',
    cvss: 10.0,
    cvssVersion: '3.1',
    vector: 'Network',
    year: 2020,
    product: 'Microsoft Netlogon',
    cwe: 'Cryptographic weakness',
    description:
      'An all-zero initialization vector in the domain logon protocol lets an attacker authenticate as the domain controller and reset its password.',
    sourceUrl: nvd('CVE-2020-1472'),
  },
  {
    id: 'Ghostcat',
    aliases: ['Ghost cat'],
    cveId: 'CVE-2020-1938',
    cvss: 9.8,
    cvssVersion: '3.1',
    vector: 'Network',
    year: 2020,
    product: 'Apache Tomcat (AJP)',
    cwe: 'File inclusion',
    description:
      'The AJP connector, often exposed by default on port 8009, lets attackers read or include any file in the web application directory.',
    sourceUrl: nvd('CVE-2020-1938'),
  },
  {
    id: 'Citrix ADC RCE',
    aliases: ['Shitrix', 'CVE-2019-19781'],
    cveId: 'CVE-2019-19781',
    cvss: 9.8,
    cvssVersion: '3.1',
    vector: 'Network',
    year: 2019,
    product: 'Citrix ADC / Gateway',
    cwe: 'Path traversal',
    description:
      'A directory traversal in a popular VPN appliance allowed unauthenticated remote code execution; mass-exploited within days of disclosure.',
    sourceUrl: nvd('CVE-2019-19781'),
  },
  {
    id: 'Follina',
    aliases: [],
    cveId: 'CVE-2022-30190',
    cvss: 7.8,
    cvssVersion: '3.1',
    vector: 'Local',
    year: 2022,
    product: 'Microsoft Windows MSDT',
    cwe: 'Remote code execution via URL handler',
    description:
      'Office documents could invoke the Windows diagnostic tool through an ms-msdt: URL and run PowerShell — no macros required.',
    sourceUrl: nvd('CVE-2022-30190'),
  },
  {
    id: 'ProxyShell',
    aliases: ['Proxy Shell'],
    cveId: 'CVE-2021-34473',
    cvss: 9.8,
    cvssVersion: '3.1',
    vector: 'Network',
    year: 2021,
    product: 'Microsoft Exchange Server',
    cwe: 'Path confusion / pre-auth access',
    description:
      'A pre-auth path confusion chain through the Autodiscover service; presented at Black Hat and immediately adopted by ransomware crews.',
    sourceUrl: nvd('CVE-2021-34473'),
  },
  {
    id: 'Spring4Shell',
    aliases: ['SpringShell', 'Spring Shell'],
    cveId: 'CVE-2022-22965',
    cvss: 9.8,
    cvssVersion: '3.1',
    vector: 'Network',
    year: 2022,
    product: 'Spring Framework',
    cwe: 'Data binding / class injection',
    description:
      'Crafted requests abuse data binding to reach ClassLoader internals and drop a web shell on JDK 9+ deployments of a major Java framework.',
    sourceUrl: nvd('CVE-2022-22965'),
  },
  {
    id: 'Text4Shell',
    aliases: ['Act4Shell'],
    cveId: 'CVE-2022-42889',
    cvss: 9.8,
    cvssVersion: '3.1',
    vector: 'Network',
    year: 2022,
    product: 'Apache Commons Text',
    cwe: 'Expression injection',
    description:
      'The string interpolation feature evaluated ${script:…} lookups, so untrusted input fed to a common text-processing library became code execution.',
    sourceUrl: nvd('CVE-2022-42889'),
  },
  {
    id: 'Dirty Pipe',
    aliases: ['DirtyPipe'],
    cveId: 'CVE-2022-0847',
    cvss: 7.8,
    cvssVersion: '3.1',
    vector: 'Local',
    year: 2022,
    product: 'Linux kernel',
    cwe: 'Improper initialization',
    description:
      'A flaw in pipe buffer flags lets unprivileged users overwrite data in the read-only page cache — including root-owned files like /etc/passwd.',
    sourceUrl: nvd('CVE-2022-0847'),
  },
  {
    id: 'PwnKit',
    aliases: ['Pwn Kit'],
    cveId: 'CVE-2021-4034',
    cvss: 7.8,
    cvssVersion: '3.1',
    vector: 'Local',
    year: 2022,
    product: 'polkit (pkexec)',
    cwe: 'Memory corruption (argument handling)',
    description:
      'Calling a setuid helper with an empty argument list corrupts its environment handling, giving instant root on most Linux distros; the bug hid for 12+ years.',
    sourceUrl: nvd('CVE-2021-4034'),
  },
  {
    id: 'Baron Samedit',
    aliases: ['BaronSamedit', 'Sudo heap overflow'],
    cveId: 'CVE-2021-3156',
    cvss: 7.8,
    cvssVersion: '3.1',
    vector: 'Local',
    year: 2021,
    product: 'sudo',
    cwe: 'Heap overflow',
    description:
      'A heap overflow in command-line backslash handling of the classic privilege tool, exploitable by any local user for root — undetected for a decade.',
    sourceUrl: nvd('CVE-2021-3156'),
  },
  {
    id: 'SMBGhost',
    aliases: ['SMB Ghost', 'CoronaBlue'],
    cveId: 'CVE-2020-0796',
    cvss: 10.0,
    cvssVersion: '3.1',
    vector: 'Network',
    year: 2020,
    product: 'Microsoft Windows SMBv3',
    cwe: 'Integer overflow',
    description:
      'A wormable integer overflow in SMB compression handling; details leaked before the patch, echoing the protocol’s 2017 disaster.',
    sourceUrl: nvd('CVE-2020-0796'),
  },
  {
    id: 'Citrix Bleed',
    aliases: ['CitrixBleed'],
    cveId: 'CVE-2023-4966',
    cvss: 9.4,
    cvssVersion: '3.1',
    vector: 'Network',
    year: 2023,
    product: 'Citrix NetScaler ADC / Gateway',
    cwe: 'Buffer over-read',
    description:
      'Leaks session tokens from appliance memory, letting attackers hijack authenticated sessions and bypass MFA; abused by the LockBit gang.',
    sourceUrl: nvd('CVE-2023-4966'),
  },
  {
    id: 'MOVEit SQLi',
    aliases: ['MOVEit', 'MOVEit Transfer'],
    cveId: 'CVE-2023-34362',
    cvss: 9.8,
    cvssVersion: '3.1',
    vector: 'Network',
    year: 2023,
    product: 'Progress MOVEit Transfer',
    cwe: 'SQL injection',
    description:
      'A SQL injection in a managed file-transfer product, mass-exploited as a zero-day by the Cl0p gang to steal data from 2,000+ organizations.',
    sourceUrl: nvd('CVE-2023-34362'),
  },
  {
    id: 'regreSSHion',
    aliases: ['regression openssh'],
    cveId: 'CVE-2024-6387',
    cvss: 8.1,
    cvssVersion: '3.1',
    vector: 'Network',
    year: 2024,
    product: 'OpenSSH',
    cwe: 'Signal handler race condition',
    description:
      'A race condition in the SSH server’s login timeout handling — a regression of a 2006 bug — allowing unauthenticated remote code execution as root.',
    sourceUrl: nvd('CVE-2024-6387'),
  },
  {
    id: 'XZ Backdoor',
    aliases: ['XZ Utils backdoor', 'xz backdoor', 'liblzma backdoor'],
    cveId: 'CVE-2024-3094',
    cvss: 10.0,
    cvssVersion: '3.1',
    vector: 'Network',
    year: 2024,
    product: 'XZ Utils (liblzma)',
    cwe: 'Supply-chain backdoor',
    description:
      'A maintainer account groomed over years slipped an SSH authentication backdoor into a compression library — caught because logins were 500ms slower.',
    sourceUrl: nvd('CVE-2024-3094'),
  },
  {
    id: 'Struts RCE',
    aliases: ['Apache Struts RCE', 'Equifax bug', 'CVE-2017-5638'],
    cveId: 'CVE-2017-5638',
    cvss: 10.0,
    cvssVersion: '3.1',
    vector: 'Network',
    year: 2017,
    product: 'Apache Struts 2',
    cwe: 'Expression language injection',
    description:
      'A crafted Content-Type header executes OGNL expressions in a Java web framework; an unpatched server led to the Equifax breach of 147M people.',
    sourceUrl: nvd('CVE-2017-5638'),
  },
  {
    id: 'Looney Tunables',
    aliases: ['LooneyTunables'],
    cveId: 'CVE-2023-4911',
    cvss: 7.8,
    cvssVersion: '3.1',
    vector: 'Local',
    year: 2023,
    product: 'GNU glibc (ld.so)',
    cwe: 'Buffer overflow',
    description:
      'A buffer overflow in the dynamic loader’s GLIBC_TUNABLES environment variable parsing gives local attackers root on major Linux distributions.',
    sourceUrl: nvd('CVE-2023-4911'),
  },
]
