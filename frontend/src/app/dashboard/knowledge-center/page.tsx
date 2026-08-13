'use client';

import { useState } from 'react';
import { 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Video,
  Download,
  ShieldAlert,
  Search,
  CheckCircle2,
  Briefcase,
  HelpCircle,
  Clock,
  Landmark
} from 'lucide-react';
import styles from './knowledge.module.css';
import { useCases, services, resources, guidelines } from '@/data/knowledgeCenter';

export default function KnowledgeCenterPage() {
  const [activeTab, setActiveTab] = useState<'usecases' | 'services' | 'resources' | 'guidelines'>('usecases');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleRow = (id: string) => {
    setExpandedRow(prev => prev === id ? null : id);
  };

  const toggleAccordion = (id: string) => {
    setExpandedAccordion(prev => prev === id ? null : id);
  };

  const getResourceIcon = (type: string) => {
    if (type === 'VIDEO') return <Video size={24} />;
    return <FileText size={24} />;
  };

  return (
    <div className={styles.page}>
      
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Knowledge Center</h1>
          <p className={styles.subtitle}>Pusat informasi, panduan teknis, dan layanan Laboratorium Forensik IT OJK</p>
        </div>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Cari referensi..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'usecases' ? styles.activeTab : ''}`}
          onClick={() => { setActiveTab('usecases'); setExpandedRow(null); }}
        >
          <BookOpen size={16} /> Use Cases
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'services' ? styles.activeTab : ''}`}
          onClick={() => { setActiveTab('services'); setExpandedRow(null); }}
        >
          <Briefcase size={16} /> Services
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'resources' ? styles.activeTab : ''}`}
          onClick={() => { setActiveTab('resources'); }}
        >
          <Download size={16} /> Resources
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'guidelines' ? styles.activeTab : ''}`}
          onClick={() => { setActiveTab('guidelines'); }}
        >
          <HelpCircle size={16} /> Guidelines
        </button>
      </div>

      {/* Tab 1: Use Cases */}
      {activeTab === 'usecases' && (
        <div className={styles.tabContent}>
          <div className={styles.tableCard}>
            {useCases.filter(u => u.title.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
              <div key={item.id} className={styles.expandableItem}>
                
                {/* Row Header */}
                <div className={styles.rowHeader} onClick={() => toggleRow(item.id)}>
                  <div className={styles.rowTitleArea}>
                    <h3 className={styles.rowTitle}>{item.title}</h3>
                    <p className={styles.rowDesc}>{item.description}</p>
                  </div>
                  <div className={styles.rowIcon}>
                    {expandedRow === item.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* Expanded Detail */}
                {expandedRow === item.id && (
                  <div className={styles.expandedDetail}>
                    <div className={styles.detailGrid}>
                      <div className={styles.detailBox}>
                        <div className={styles.detailHeader}>
                          <ShieldAlert size={16} className={styles.detailIcon} />
                          <h4>Supervisory Context</h4>
                        </div>
                        <p>{item.supervisoryContext}</p>
                      </div>
                      <div className={styles.detailBox}>
                        <div className={styles.detailHeader}>
                          <Search size={16} className={styles.detailIcon} />
                          <h4>Potensi Pemanfaatan</h4>
                        </div>
                        <p>{item.potensiPemanfaatan}</p>
                      </div>
                      <div className={styles.detailBox}>
                        <div className={styles.detailHeader}>
                          <CheckCircle2 size={16} className={styles.detailIcon} />
                          <h4>Added Value</h4>
                        </div>
                        <p>{item.addedValue}</p>
                      </div>
                    </div>
                    
                    <div className={styles.sektorBox}>
                      <strong>Sektor Relevan: </strong>
                      <div className={styles.sektorList}>
                        {item.sektorRelevan.map(s => (
                          <span key={s} className={styles.sektorPill}><Landmark size={12} /> {s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Services */}
      {activeTab === 'services' && (
        <div className={styles.tabContent}>
          <div className={styles.tableCard}>
            {services.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
              <div key={item.id} className={styles.expandableItem}>
                <div className={styles.rowHeader} onClick={() => toggleRow(item.id)}>
                  <div className={styles.rowTitleArea}>
                    <h3 className={styles.rowTitle}>{item.title}</h3>
                    <p className={styles.rowDesc}>{item.description}</p>
                  </div>
                  <div className={styles.rowIcon}>
                    {expandedRow === item.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {expandedRow === item.id && (
                  <div className={styles.expandedDetail}>
                    <div className={styles.servicesSplit}>
                      <div className={styles.deliverablesList}>
                        <h4>Deliverables (Hasil Layanan):</h4>
                        <ul>
                          {item.deliverables.map((del, i) => (
                            <li key={i}><CheckCircle2 size={14} className={styles.checkIcon} /> {del}</li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.slaBox}>
                        <Clock size={20} className={styles.slaIcon} />
                        <div className={styles.slaText}>
                          <span>Estimasi SLA:</span>
                          <strong>{item.sla}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Resources */}
      {activeTab === 'resources' && (
        <div className={styles.tabContent}>
          <div className={styles.resourcesGrid}>
            {resources.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
              <div key={item.id} className={styles.resourceCard}>
                <div className={styles.resourceLeft}>
                  <div className={`${styles.resourceIconBox} ${item.type === 'VIDEO' ? styles.videoIconBox : styles.pdfIconBox}`}>
                    {getResourceIcon(item.type)}
                  </div>
                  <div className={styles.resourceInfo}>
                    <h4>{item.title}</h4>
                    <div className={styles.resourceMeta}>
                      <span className={styles.resourceType}>{item.type}</span>
                      <span>•</span>
                      <span>{item.size}</span>
                    </div>
                  </div>
                </div>
                <button className={styles.downloadBtn}>
                  <Download size={16} /> Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Guidelines */}
      {activeTab === 'guidelines' && (
        <div className={styles.tabContent}>
          <div className={styles.accordionContainer}>
            {guidelines.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
              <div key={item.id} className={styles.accordionItem}>
                <button 
                  className={`${styles.accordionHeader} ${expandedAccordion === item.id ? styles.accordionActive : ''}`}
                  onClick={() => toggleAccordion(item.id)}
                >
                  <span className={styles.accordionTitle}>{item.title}</span>
                  {expandedAccordion === item.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedAccordion === item.id && (
                  <div className={styles.accordionBody}>
                    <ol className={styles.stepList}>
                      {item.steps.map((step, i) => (
                        <li key={i}>
                          <span className={styles.stepNumber}>{i+1}</span>
                          <span className={styles.stepText}>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
