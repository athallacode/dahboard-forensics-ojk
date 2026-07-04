'use client';

import { useState } from 'react';
import styles from './knowledge-center.module.css';
import { 
  FileCheck, Building2, Landmark, ShieldCheck, Banknote, 
  ChevronDown, ArrowRight, Laptop, Smartphone, MessageSquareText
} from 'lucide-react';

export default function KnowledgeCenterPage() {
  const [activeTab, setActiveTab] = useState('Use Cases');
  const [expandedRow, setExpandedRow] = useState<number | null>(3); 

  const tabs = ['Use Cases', 'Services', 'Resources', 'Guidelines'];

  const rows = [
    {
      id: 0,
      useCase: 'Pemeriksaan Perangkat Handphone',
      sector: 'Perbankan, Pasar Modal, Asuransi, IAKD',
      icon: <Smartphone className={styles.rowIconSvg} size={24} />
    },
    {
      id: 1,
      useCase: 'Pemeriksaan Perangkat Komputer',
      sector: 'Perbankan, Pasar Modal, Asuransi, IAKD',
      icon: <Laptop className={styles.rowIconSvg} size={24} />
    },
    {
      id: 2,
      useCase: 'Pemeriksaan Komunikasi Digital',
      sector: 'Perbankan, Pasar Modal, Asuransi, IAKD',
      icon: <MessageSquareText className={styles.rowIconSvg} size={24} />
    },
    {
      id: 3,
      useCase: 'Validasi Dokumen Elektronik',
      sector: 'Perbankan, Pasar Modal, Asuransi, IAKD',
      icon: <FileCheck className={styles.rowIconSvg} size={24} />
    },
  ];

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className={styles.page}>
      
      <div className={styles.header}>
        <h1 className={styles.title}>Knowledge Center</h1>
        <p className={styles.subtitle}>Eksplorasi use cases, layanan, dan panduan forensik digital</p>
      </div>

      {/* Modern Tabs */}
      <div className={styles.tabsWrapper}>
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className={styles.content}>
        {activeTab === 'Use Cases' && (
          <div className={styles.cardsList}>
            {rows.map((row) => (
              <div 
                key={row.id} 
                className={`${styles.cardWrapper} ${expandedRow === row.id ? styles.cardExpanded : ''}`}
              >
                {/* Visible Row */}
                <div className={styles.cardHeader} onClick={() => toggleRow(row.id)}>
                  <div className={styles.rowIcon}>
                    {row.icon}
                  </div>
                  <div className={styles.rowInfo}>
                    <h3 className={styles.rowTitle}>{row.useCase}</h3>
                    <p className={styles.rowSector}>Sektor: {row.sector}</p>
                  </div>
                  <div className={styles.rowAction}>
                    <button className={`${styles.expandBtn} ${expandedRow === row.id ? styles.expandBtnActive : ''}`}>
                      <span>{expandedRow === row.id ? 'Tutup' : 'Lihat Detail'}</span>
                      <ChevronDown size={18} className={styles.chevron} />
                    </button>
                  </div>
                </div>

                {/* Expanded Content (Glassmorphism / Gradient) */}
                <div className={styles.expandedContentWrapper}>
                  <div className={styles.expandedContentInner}>
                    <div className={styles.expandedGrid}>
                      
                      {/* Left: Graphic/Icon */}
                      <div className={styles.expandedGraphic}>
                        <div className={styles.graphicCircle}>
                          <FileCheck size={64} strokeWidth={1.5} color="#4F46E5" />
                        </div>
                        <span className={styles.graphicLabel}>Validasi Keaslian<br/>Dokumen Elektronik</span>
                      </div>

                      {/* Right: Info Sections */}
                      <div className={styles.expandedInfo}>
                        
                        <div className={styles.infoBlock}>
                          <h4 className={styles.infoTitle}>Supervisory Context</h4>
                          <p className={styles.infoText}>
                            Dalam proses pengawasan dan/atau pemeriksaan, terdapat temuan berupa
                            ketidaksesuaian metadata, timestamp, maupun perubahan pada dokumen
                            elektronik yang memerlukan validasi lebih lanjut.
                          </p>
                        </div>

                        <div className={styles.infoRow}>
                          <div className={styles.infoBlock}>
                            <h4 className={styles.infoTitle}>Potensi Pemanfaatan</h4>
                            <ul className={styles.infoList}>
                              <li><ArrowRight size={14} className={styles.listIcon}/> Pemeriksaan metadata dokumen</li>
                              <li><ArrowRight size={14} className={styles.listIcon}/> Validasi keaslian dokumen</li>
                              <li><ArrowRight size={14} className={styles.listIcon}/> Analisis bukti pendukung</li>
                            </ul>
                          </div>

                          <div className={styles.infoBlock}>
                            <h4 className={styles.infoTitle}>Added Value</h4>
                            <ul className={styles.infoList}>
                              <li><ArrowRight size={14} className={styles.listIcon}/> Memvalidasi integritas dokumen</li>
                              <li><ArrowRight size={14} className={styles.listIcon}/> Technical validation untuk pengawasan</li>
                            </ul>
                          </div>
                        </div>

                        <div className={styles.infoBlock}>
                          <h4 className={styles.infoTitle}>Sektor Relevan</h4>
                          <div className={styles.sectorBadges}>
                            <span className={styles.badge}><Landmark size={14}/> Perbankan</span>
                            <span className={styles.badge}><Building2 size={14}/> Pasar Modal</span>
                            <span className={styles.badge}><ShieldCheck size={14}/> Asuransi</span>
                            <span className={styles.badge}><Banknote size={14}/> IAKD</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
