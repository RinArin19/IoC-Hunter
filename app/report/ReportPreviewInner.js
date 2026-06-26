'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

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
    const skipTags = ['otx-pulse', 'abuse-confidence-high', 'url', 'sha256', 'md5', 'payload', 'malware-sample'];
    const meaningfulTags = (ioc.tags || []).filter(t => !skipTags.includes(t));
    if (meaningfulTags.length > 0) {
      campaign = meaningfulTags[0];
    }

    if (!campaigns[campaign]) {
      campaigns[campaign] = { iocs: [], ips: 0, urls: 0, hashes: 0 };
    }
    campaigns[campaign].iocs.push(ioc);
    if (ioc.type === 'ip') campaigns[campaign].ips++;
    if (ioc.type === 'domain') campaigns[campaign].urls++;
    if (ioc.type === 'hash') campaigns[campaign].hashes++;
  });

  const campaignNames = Object.keys(campaigns).filter(c => c !== 'Unknown');

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
            Laporan sinergi intelijen ancaman. Mencakup analisis kampanye HIGH severity, TTPs MITRE ATT&CK, dan rekomendasi mitigasi.
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
              <div className="ss">HIGH & CRITICAL IOC</div>
            </div>
          </div>
          <div className="sb">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16, marginBottom: 20 }}>
              <div style={{ background: '#0f172a', border: '1px solid #334155', borderTop: '3px solid #ef4444', borderRadius: 8, padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 48, fontWeight: 800, color: '#ef4444' }}>{iocs.length}</div>
                <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginTop: 6 }}>Total IOC HIGH Severity</div>
              </div>
              <div style={{ background: '#0f172a', border: '1px solid #334155', borderTop: '3px solid #f97316', borderRadius: 8, padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 48, fontWeight: 800, color: '#f97316' }}>{campaignNames.length}</div>
                <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginTop: 6 }}>Kampanye Aktif</div>
              </div>
            </div>
            <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, padding: '14px 18px', fontSize: 13, color: '#cbd5e1', lineHeight: 1.8 }}>
              Sistem CSOC mendeteksi <strong style={{ color: '#ef4444' }}>{iocs.length} IOC berkategori HIGH severity</strong>.
              Seluruh IOC telah dikorelasi dan memerlukan tindakan blokir segera.
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
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#f97316' }}>{name}</span>
                    <span style={{ marginLeft: 10, background: 'rgba(239,68,68,0.15)', color: '#f87171', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>HIGH</span>
                  </div>
                  <span style={{ fontSize: 12, color: '#38bdf8', fontWeight: 600 }}>{data.iocs.length} IOC</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
                  <div style={{ fontSize: 11 }}><span style={{ color: '#475569' }}>IP C2: </span><span style={{ color: '#f87171', fontWeight: 600 }}>{data.ips}</span></div>
                  <div style={{ fontSize: 11 }}><span style={{ color: '#475569' }}>URL: </span><span style={{ color: '#fbbf24', fontWeight: 600 }}>{data.urls}</span></div>
                  <div style={{ fontSize: 11 }}><span style={{ color: '#475569' }}>Hash: </span><span style={{ color: '#a78bfa', fontWeight: 600 }}>{data.hashes}</span></div>
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
                  <th>Tags</th>
                  <th style={{ textAlign: 'center' }}>Severity</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(campaigns).map(([name, data]) => (
                  <React.Fragment key={name}>
                    <tr style={{ background: '#0f172a' }}>
                      <td colSpan={5} style={{ padding: '10px 12px', border: '1px solid #334155', fontSize: 12, fontWeight: 700, color: '#f97316' }}>
                        🎯 {name}
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
      </div>
    </div>
  );
}
