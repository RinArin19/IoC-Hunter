const THREAT_KB = {
  'asyncrat': {
    name: 'win.asyncrat',
    mitreId: 'T1219',
    mitreName: 'Remote Access Software',
    tactic: 'Command and Control',
    desc: 'Kampanye malware AsyncRAT (Win.AsyncRAT) merupakan ancaman berbasis Remote Access Trojan (RAT) yang memberikan akses penuh kepada penyerang untuk mengendalikan sistem korban, mencuri kredensial, merekam aktivitas pengguna, melakukan keylogging, mengunduh malware tambahan, hingga menjadi pintu masuk ransomware. Kampanye AsyncRAT umumnya disebarkan melalui phishing email, lampiran berbahaya, file ZIP/LNK, penyalahgunaan layanan cloud, serta teknik social engineering modern. Aktivitas kampanye bersifat global dengan fokus pada pencurian kredensial, akses awal (initial access), pengintaian jaringan internal, dan eksfiltrasi data sensitif.'
  },
  'mirai': {
    name: 'elf.mirai',
    mitreId: 'T1219',
    mitreName: 'Remote Access Software',
    tactic: 'Command and Control',
    desc: 'Kampanye Mirai (ELF.Mirai) merupakan malware botnet yang secara khusus menargetkan sistem berbasis Linux dan perangkat Internet of Things (IoT) seperti router, DVR, IP Camera, NAS, dan perangkat jaringan lainnya. Mirai bekerja dengan melakukan pemindaian internet secara masif untuk mencari perangkat yang menggunakan kredensial default atau lemah, kemudian menginfeksi perangkat tersebut dan menghubungkannya ke infrastruktur Command & Control (C2). Setelah terinfeksi, perangkat akan menjadi bagian dari botnet yang dapat digunakan untuk melancarkan serangan Distributed Denial of Service (DDoS) berskala besar, penyebaran malware lanjutan, maupun aktivitas berbahaya lainnya.'
  },
  'adaptix_c2': {
    name: 'win.adaptix_c2',
    mitreId: 'T1219',
    mitreName: 'Remote Access Software',
    tactic: 'Command and Control',
    desc: 'Kampanye Adaptix C2 (Win.Adaptix_C2) merupakan ancaman berbasis Command and Control (C2) framework yang digunakan oleh pelaku ancaman untuk mempertahankan akses ke sistem yang telah berhasil dikompromi. Framework ini memungkinkan penyerang menjalankan perintah jarak jauh, melakukan enumerasi sistem, mengumpulkan kredensial, melakukan lateral movement, serta mengunduh payload tambahan. Adaptix C2 sering muncul pada tahap post-exploitation setelah keberhasilan phishing, eksploitasi kerentanan publik, atau penyalahgunaan kredensial yang valid.'
  },
  '32-bit': {
    name: '32-bit dropper',
    mitreId: 'T1204.002',
    mitreName: 'User Execution: Malicious File',
    tactic: 'Execution',
    desc: 'Kampanye 32-bit merujuk pada jenis malware dropper atau loader yang dikompilasi secara spesifik untuk arsitektur sistem 32-bit, yang sering digunakan sebagai tahap awal dalam rantai serangan siber. Malware ini berfungsi sebagai pintu masuk untuk mengunduh dan mengeksekusi payload berbahaya tambahan ke dalam sistem target. Teknik penyebarannya sangat bergantung pada manipulasi psikologis (rekayasa sosial), di mana pengguna diarahkan untuk membuka atau mengunduh file berbahaya melalui tautan.'
  },
  'mozi': {
    name: 'elf.mozi',
    mitreId: 'T1566.002',
    mitreName: 'Phishing: Spearphishing Link',
    tactic: 'Initial Access',
    desc: 'Kampanye ELF.Mozi merupakan kampanye malware botnet yang menargetkan perangkat Internet of Things (IoT) berbasis Linux, seperti router, kamera IP, DVR, dan perangkat jaringan lainnya yang memiliki layanan manajemen terbuka atau menggunakan kredensial bawaan yang lemah. Malware ini berfungsi untuk mengambil alih perangkat yang rentan dan memasukkannya ke dalam botnet yang dikendalikan melalui mekanisme peer-to-peer (P2P) berbasis Distributed Hash Table (DHT), sehingga tidak bergantung pada satu server Command and Control (C2).'
  },
  'backdoorit': {
    name: 'elf.backdoorit',
    mitreId: 'T1566.002',
    mitreName: 'Phishing: Spearphishing Link',
    tactic: 'Initial Access',
    desc: 'Kampanye ELF.BackdoorIT merujuk pada aktivitas penyebaran malware backdoor yang menargetkan sistem operasi Linux berbasis format ELF (Executable and Linkable Format). Malware ini dirancang untuk memberikan akses jarak jauh secara tidak sah kepada penyerang, sehingga memungkinkan pelaksanaan perintah jarak jauh (remote command execution), pengunduhan dan eksekusi payload tambahan, pencurian informasi, serta pengendalian penuh terhadap sistem yang telah terinfeksi.'
  },
  'formbook': {
    name: 'win.formbook',
    mitreId: 'T1204.002',
    mitreName: 'User Execution: Malicious File',
    tactic: 'Execution',
    desc: 'Kampanye Win.FormBook merupakan ancaman berbasis information stealer dan malware-as-a-service (MaaS) yang menargetkan sistem operasi Windows untuk mencuri informasi sensitif pengguna. Malware ini mampu merekam penekanan tombol (keylogging), mencuri kredensial yang tersimpan pada peramban web dan aplikasi klien email, mengambil isi clipboard, serta mengekstraksi informasi sistem sebelum mengirimkannya ke server Command and Control (C2).'
  },
  'botnet': {
    name: 'botnet',
    mitreId: 'T1071',
    mitreName: 'Application Layer Protocol',
    tactic: 'Command and Control',
    desc: 'Ancaman botnet merujuk pada sekumpulan perangkat terinfeksi yang dikendalikan dari jarak jauh oleh penyerang. Perangkat ini biasanya digunakan untuk meluncurkan serangan DDoS, spamming, atau mencuri data secara massal.'
  },
  'malware-c2': {
    name: 'Malware C2',
    mitreId: 'T1071',
    mitreName: 'Application Layer Protocol',
    tactic: 'Command and Control',
    desc: 'Server Command and Control (C2) yang digunakan oleh malware untuk menerima perintah dan mengeksfiltrasi data dari jaringan korban. Komunikasi C2 sering kali disamarkan menggunakan protokol umum (HTTP/S) atau DNS.'
  },
  'banker': {
    name: 'Banking Trojan',
    mitreId: 'T1056.001',
    mitreName: 'Keylogging',
    tactic: 'Credential Access',
    desc: 'Malware trojan perbankan dirancang khusus untuk mencuri kredensial finansial, mencegat otentikasi dua faktor, dan memanipulasi transaksi perbankan (web injects). Biasanya disebar melalui phising email dan lampiran Office macro.'
  }
};

function getThreatInfo(tag) {
  const key = Object.keys(THREAT_KB).find(k => tag.toLowerCase().includes(k)) || tag.toLowerCase();
  if (THREAT_KB[key]) return THREAT_KB[key];
  
  return {
    name: tag,
    mitreId: 'T1000',
    mitreName: 'Generic Threat Indicator',
    tactic: 'Unknown',
    desc: `Indikator ancaman diklasifikasikan sebagai '${tag}'. Entitas ini ditandai memiliki reputasi buruk atau terkait dengan aktivitas berbahaya, namun tidak ada deskripsi spesifik dalam knowledge base. Disarankan untuk memblokir indikator ini pada perimeter keamanan.`
  };
}

export default function ReportPreviewInner() {
  const searchParams = useSearchParams();
  const [iocs, setIocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const type = searchParams.get('type') || '';
      const source = searchParams.get('source') || '';
      const batchId = searchParams.get('batchId') || '';
      
      const params = new URLSearchParams();
      if (type) params.set('type', type);
      if (source) params.set('source', source);
      if (batchId) params.set('batchId', batchId);
      
      try {
        const res = await fetch(`/api/iocs?${params.toString()}`);
        const data = await res.json();
        setIocs(data.iocs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [searchParams]);

  if (loading) {
    return <div style={{ padding: 40, color: '#fff' }}>Loading preview...</div>;
  }

  // Extract unique campaigns from tags
  const campaigns = {};
  iocs.forEach(ioc => {
    let campaign = 'Unknown';
    // try to find a meaningful tag
    const skipTags = ['otx-pulse', 'abuse-confidence-high', 'url', 'sha256', 'md5', 'payload', 'malware-sample', 'malware-distribution'];
    const meaningfulTags = (ioc.tags || []).filter(t => !skipTags.includes(t));
    if (meaningfulTags.length > 0) {
      campaign = meaningfulTags[0];
    }

    if (!campaigns[campaign]) {
      campaigns[campaign] = { iocs: [], ips: 0, urls: 0, hashes: 0, info: getThreatInfo(campaign) };
    }
    campaigns[campaign].iocs.push(ioc);
    if (ioc.type === 'ip') campaigns[campaign].ips++;
    if (ioc.type === 'domain') campaigns[campaign].urls++;
    if (ioc.type === 'hash') campaigns[campaign].hashes++;
  });

  const campaignNames = Object.keys(campaigns).filter(c => c !== 'Unknown');

  // Compute top MITRE techniques
  const mitreCounts = {};
  Object.values(campaigns).forEach(c => {
    if (c.info.mitreId !== 'T1000') {
      mitreCounts[c.info.mitreId] = (mitreCounts[c.info.mitreId] || 0) + 1;
    }
  });
  const topMitre = Object.entries(mitreCounts)
    .sort((a, b) => b[1] - a[1])
    .map(x => x[0])
    .slice(0, 3);
  const mitreString = topMitre.length > 0 ? topMitre.join(', ') : 'N/A';

  return (
    <div className="report-container">
      <style dangerouslySetInnerHTML={{__html: `
        .topbar { display: none !important; }
        .shell { padding: 0 !important; max-width: 100% !important; margin: 0 !important; }
        body { background: #0f172a; color: #e2e8f0; font-family: 'Segoe UI', Arial, sans-serif; }
        .page { max-width: 1100px; margin: 0 auto; padding: 40px 32px; }
        .cover { background: linear-gradient(160deg,#1e293b 0%,#0f172a 60%); border: 1px solid #334155; border-radius: 16px; padding: 48px; margin-bottom: 28px; position: relative; overflow: hidden; }
        .cover::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg,#f97316,#38bdf8,#a78bfa); }
        .cover-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
        .csoc-brand { font-size: 11px; font-weight: 700; color: #38bdf8; letter-spacing: 2px; text-transform: uppercase; }
        .tlp { background: #dd6b20; color: #fff; padding: 5px 14px; border-radius: 6px; font-size: 11px; font-weight: 700; }
        .cover h1 { font-size: 30px; font-weight: 800; color: #f1f5f9; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
        .cover h2 { font-size: 16px; font-weight: 600; color: #38bdf8; margin-bottom: 16px; }
        .cover-desc { font-size: 13px; color: #64748b; line-height: 1.7; margin-bottom: 32px; }
        .cover-meta { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; border-top: 1px solid #334155; padding-top: 24px; }
        .ml { font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; color: #475569; font-weight: 700; margin-bottom: 3px; }
        .mv { font-size: 12px; color: #cbd5e1; font-weight: 600; }
        .section { background: #1e293b; border: 1px solid #334155; border-radius: 12px; margin-bottom: 20px; overflow: hidden; }
        .sh { background: #0f172a; padding: 14px 20px; border-bottom: 1px solid #334155; display: flex; align-items: center; gap: 10px; }
        .sn { background: #38bdf8; color: #0f172a; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; flex-shrink: 0; }
        .st { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #f1f5f9; }
        .ss { font-size: 11px; color: #64748b; margin-top: 2px; }
        .sb { padding: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th { padding: 9px 12px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #475569; background: #0f172a; border: 1px solid #334155; }
        .footer { text-align: center; padding: 20px; color: #475569; font-size: 11px; line-height: 1.8; }
        .print-btn {
          position: fixed; top: 20px; right: 20px; background: #38bdf8; color: #0f172a; padding: 10px 20px; border-radius: 6px; font-weight: 700; cursor: pointer; border: none; z-index: 100;
        }
        @media print {
          .no-print { display: none !important; }
          .page { padding: 0; }
          body { background: white !important; color: black !important; }
          .cover { background: white !important; border: 1px solid #ccc; color: black; }
          .cover h1, .cover h2, .cover-desc, .st, .mv { color: black !important; }
          .section { background: white !important; border: 1px solid #ccc; }
          .sh { background: #f8fafc !important; border-bottom: 1px solid #ccc; }
          .sh .st { color: black !important; }
          th { background: #f8fafc !important; color: black !important; border: 1px solid #ccc; }
          td { border: 1px solid #ccc !important; color: black !important; }
          .tag-chip, .type-pill { color: black !important; border: 1px solid #ccc !important; background: transparent !important; }
        }
      `}} />
      
      <button className="no-print print-btn" onClick={() => window.print()}>
        🖨️ Download / Print PDF
      </button>

      <div className="page">
        <div className="cover">
          <div className="cover-top">
            <div className="csoc-brand">Cyber Security Operations Center (CSOC)</div>
            <span className="tlp">TLP:AMBER</span>
          </div>
          <h1>Laporan Mingguan</h1>
          <h2>Threat Intelligence</h2>
          <p className="cover-desc">
            Laporan sinergi intelijen ancaman mingguan. Mencakup analisis kampanye HIGH severity, TTPs MITRE ATT&CK, dan rekomendasi mitigasi.
          </p>
          <div className="cover-meta">
            <div>
              <div className="ml">Total IoC</div>
              <div className="mv">{iocs.length}</div>
            </div>
            <div>
              <div className="ml">Periode</div>
              <div className="mv">{new Date().toLocaleDateString()}</div>
            </div>
            <div>
              <div className="ml">Klasifikasi</div>
              <div className="mv">Rahasia / TLP:AMBER</div>
            </div>
            <div>
              <div className="ml">Pembuat</div>
              <div className="mv">Team SOC</div>
            </div>
            <div>
              <div className="ml">Distribusi</div>
              <div className="mv">CISO, IT Security, Ops Team</div>
            </div>
            <div>
              <div className="ml">Generated</div>
              <div className="mv">{new Date().toISOString().split('T')[0]}</div>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="sh">
            <div className="sn">★</div>
            <div>
              <div className="st">Ringkasan Eksekutif</div>
              <div className="ss">HIGH & CRITICAL IOC MINGGU INI</div>
            </div>
          </div>
          <div className="sb">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 20 }}>
              <div style={{ background: '#0f172a', border: '1px solid #334155', borderTop: '3px solid #ef4444', borderRadius: 8, padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 40, fontWeight: 800, color: '#ef4444' }}>{iocs.length}</div>
                <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginTop: 6 }}>Total IOC HIGH Severity</div>
              </div>
              <div style={{ background: '#0f172a', border: '1px solid #334155', borderTop: '3px solid #f97316', borderRadius: 8, padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 40, fontWeight: 800, color: '#f97316' }}>{campaignNames.length}</div>
                <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginTop: 6 }}>Kampanye Aktif</div>
              </div>
              <div style={{ background: '#0f172a', border: '1px solid #334155', borderTop: '3px solid #38bdf8', borderRadius: 8, padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#38bdf8', padding: '12px 0' }}>{mitreString}</div>
                <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginTop: 6 }}>Top MITRE ATT&CK</div>
              </div>
            </div>
            <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, padding: '14px 18px', fontSize: 13, color: '#cbd5e1', lineHeight: 1.8 }}>
              Berdasarkan hasil pemantauan mingguan, sistem CSOC mendeteksi <strong style={{ color: '#ef4444' }}>{iocs.length} IOC berkategori HIGH severity</strong>.
              Terdapat <strong>{campaignNames.length} kampanye dominan</strong> yang teridentifikasi. MITRE ATT&CK teknik yang paling sering disalahgunakan melibatkan {mitreString}.
              Seluruh IOC memerlukan tindakan isolasi dan blokir pada perimeter segera.
            </div>
          </div>
        </div>

        <div className="section">
          <div className="sh">
            <div className="sn">I</div>
            <div>
              <div className="st">Cyber Threat Intelligence — Profil Ancaman</div>
              <div className="ss">Analisis kampanye HIGH severity aktif</div>
            </div>
          </div>
          <div className="sb">
            {Object.entries(campaigns).map(([name, data]) => (
              <div key={name} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: 16, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#f97316' }}>{data.info.name}</span>
                    <span style={{ marginLeft: 10, background: 'rgba(239,68,68,0.15)', color: '#f87171', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>HIGH</span>
                  </div>
                  <span style={{ fontSize: 12, color: '#38bdf8', fontWeight: 600 }}>{data.iocs.length} IOC</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
                  <div style={{ fontSize: 11 }}><span style={{ color: '#475569' }}>IP C2: </span><span style={{ color: '#f87171', fontWeight: 600 }}>{data.ips}</span></div>
                  <div style={{ fontSize: 11 }}><span style={{ color: '#475569' }}>URL: </span><span style={{ color: '#fbbf24', fontWeight: 600 }}>{data.urls}</span></div>
                  <div style={{ fontSize: 11 }}><span style={{ color: '#475569' }}>Hash: </span><span style={{ color: '#a78bfa', fontWeight: 600 }}>{data.hashes}</span></div>
                </div>
                <div style={{ fontSize: 11, marginBottom: 8 }}>
                  <span style={{ color: '#475569' }}>MITRE: </span>
                  <span style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{data.info.mitreId}</span>
                  <span style={{ color: '#64748b' }}> — </span>
                  <span style={{ color: '#cbd5e1' }}>{data.info.mitreName}</span>
                  <span style={{ color: '#64748b' }}> | Tactic: </span>
                  <span style={{ color: '#a78bfa' }}>{data.info.tactic}</span>
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, background: 'rgba(56,189,248,0.03)', borderLeft: '3px solid #334155', padding: '8px 12px', borderRadius: '0 4px 4px 0' }}>
                  {data.info.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <div className="sh">
            <div className="sn">II</div>
            <div>
              <div className="st">Indikator Kompromi per Kampanye</div>
              <div className="ss">Daftar IOC HIGH severity terkorelasi</div>
            </div>
          </div>
          <div className="sb" style={{ padding: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Nilai IOC</th>
                  <th style={{ textAlign: 'center' }}>Tipe</th>
                  <th>Sumber</th>
                  <th>MITRE ID</th>
                  <th>Tags</th>
                  <th style={{ textAlign: 'center' }}>Severity</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(campaigns).map(([name, data]) => (
                  <React.Fragment key={name}>
                    <tr style={{ background: '#0f172a' }}>
                      <td colSpan={6} style={{ padding: '10px 12px', border: '1px solid #334155', fontSize: 12, fontWeight: 700, color: '#f97316' }}>
                        🎯 {data.info.name}
                      </td>
                    </tr>
                    {data.iocs.map((ioc, idx) => (
                      <tr key={idx}>
                        <td style={{ padding: '8px 12px', border: '1px solid #1e293b', fontFamily: 'monospace', fontSize: 11, color: '#e2e8f0', wordBreak: 'break-all' }}>
                          {ioc.value}
                        </td>
                        <td style={{ padding: '8px 12px', border: '1px solid #1e293b', textAlign: 'center' }}>
                          <span style={{ background: '#1e3a5f', color: '#38bdf8', padding: '2px 8px', borderRadius: 4, fontSize: 10 }}>{ioc.type.toUpperCase()}</span>
                        </td>
                        <td style={{ padding: '8px 12px', border: '1px solid #1e293b', fontSize: 11, color: '#64748b' }}>
                          {ioc.source}
                        </td>
                        <td style={{ padding: '8px 12px', border: '1px solid #1e293b', fontFamily: 'monospace', fontSize: 11, color: '#38bdf8' }}>
                          {data.info.mitreId}
                        </td>
                        <td style={{ padding: '8px 12px', border: '1px solid #1e293b', fontSize: 11, color: '#94a3b8' }}>
                          {(ioc.tags || []).join(', ')}
                        </td>
                        <td style={{ padding: '8px 12px', border: '1px solid #1e293b', textAlign: 'center' }}>
                          <span style={{ background: '#ef4444', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>HIGH</span>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="section" style={{ pageBreakInside: 'avoid' }}>
          <div className="sh">
            <div className="sn">III</div>
            <div>
              <div className="st">Rekomendasi Mitigasi Umum</div>
              <div className="ss">Langkah preventif dan respons</div>
            </div>
          </div>
          <div className="sb" style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.7 }}>
            <ul style={{ paddingLeft: 20, marginBottom: 14 }}>
              <li style={{ marginBottom: 8 }}><strong style={{ color: '#38bdf8' }}>Isolasi & Pemblokiran:</strong> Segera blokir seluruh IP, Domain/URL, dan Hash yang terlampir pada perangkat keamanan perimeter (Firewall, IPS/IDS, Web Proxy) dan Endpoint (EDR/Antivirus).</li>
              <li style={{ marginBottom: 8 }}><strong style={{ color: '#38bdf8' }}>Threat Hunting:</strong> Lakukan pencarian ancaman (threat hunting) pada log SIEM menggunakan indikator (IoC) terkait untuk mendeteksi adanya intrusi yang sudah terjadi di dalam jaringan.</li>
              <li style={{ marginBottom: 8 }}><strong style={{ color: '#38bdf8' }}>Penguatan Autentikasi:</strong> Terapkan Multi-Factor Authentication (MFA) pada seluruh akses jarak jauh (VPN, SSH, RDP) dan portal aplikasi kritikal untuk mencegah penyalahgunaan kredensial hasil curian (Information Stealers).</li>
              <li style={{ marginBottom: 8 }}><strong style={{ color: '#38bdf8' }}>Manajemen Kerentanan:</strong> Pastikan seluruh sistem operasi, aplikasi, dan perangkat jaringan (terutama router/IoT) menggunakan versi terbaru dan mengaktifkan pengaturan keamanan standar.</li>
            </ul>
            <p style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>* Rekomendasi di atas bersifat general dan perlu disesuaikan dengan arsitektur keamanan organisasi.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
