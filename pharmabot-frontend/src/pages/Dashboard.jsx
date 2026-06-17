import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import RiskBadge from '../components/RiskBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Upload, FileText, AlertTriangle,
  ChevronRight, Plus, Activity
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [presRes, repRes] = await Promise.all([
          api.get('/prescriptions'),
          api.get('/reports')
        ]);
        setPrescriptions(presRes.data.prescriptions || []);
        setReports(repRes.data.reports || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Prescriptions', value: prescriptions.length, icon: FileText, color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
    { label: 'Reports Generated', value: reports.length, icon: Activity, color: '#818cf8', bg: 'rgba(129,140,248,0.1)' },
    { label: 'High Risk Found', value: reports.filter(r => r.overallRisk === 'HIGH').length, icon: AlertTriangle, color: '#f87171', bg: 'rgba(248,113,113,0.1)' }
  ];

  const getStatusStyle = (status) => {
    const styles = {
      pending: { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
      extracted: { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
      analysed: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
      classified: { color: '#c084fc', bg: 'rgba(192,132,252,0.1)' },
      reported: { color: '#4ade80', bg: 'rgba(74,222,128,0.1)' }
    };
    return styles[status] || styles.pending;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0f' }}>
      <Sidebar />

      <main style={{ marginLeft: '260px', flex: 1, padding: '40px', maxWidth: 'calc(100vw - 260px)' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: 0 }}>
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: '6px 0 0 0' }}>
              Here's your medication safety overview
            </p>
          </div>
          <Link
            to="/upload"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '11px 20px',
              background: 'linear-gradient(135deg, #6366f1, #9333ea)',
              color: '#fff',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '14px',
              textDecoration: 'none'
            }}
          >
            <Plus style={{ width: '16px', height: '16px' }} />
            New Prescription
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
            <LoadingSpinner size="lg" text="Loading your data..." />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
              {stats.map(({ label, value, icon: Icon, color, bg }) => (
                <div
                  key={label}
                  style={{
                    background: '#111118',
                    border: '1px solid #22222f',
                    borderRadius: '14px',
                    padding: '24px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon style={{ width: '20px', height: '20px', color }} />
                    </div>
                    <span style={{ fontSize: '30px', fontWeight: 700, color: '#fff' }}>{value}</span>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Recent Prescriptions */}
            <div style={{ background: '#111118', border: '1px solid #22222f', borderRadius: '14px', marginBottom: '24px', overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #22222f', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ color: '#fff', fontWeight: 600, fontSize: '16px', margin: 0 }}>Recent Prescriptions</h2>
                <Link to="/upload" style={{ color: '#818cf8', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                  <Plus style={{ width: '14px', height: '14px' }} />
                  New
                </Link>
              </div>

              {prescriptions.length === 0 ? (
                <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                  <Upload style={{ width: '40px', height: '40px', color: '#3a3a4a', margin: '0 auto 16px' }} />
                  <p style={{ color: '#94a3b8', marginBottom: '16px', fontSize: '14px' }}>No prescriptions yet</p>
                  <Link
                    to="/upload"
                    style={{
                      display: 'inline-block',
                      padding: '10px 20px',
                      background: '#6366f1',
                      color: '#fff',
                      borderRadius: '10px',
                      fontSize: '14px',
                      textDecoration: 'none',
                      fontWeight: 500
                    }}
                  >
                    Upload your first prescription
                  </Link>
                </div>
              ) : (
                <div>
                  {prescriptions.slice(0, 5).map(p => {
                    const statusStyle = getStatusStyle(p.status);
                    return (
                      <Link
                        key={p.id}
                        to={`/prescription/${p.id}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '18px 24px',
                          borderBottom: '1px solid #22222f',
                          textDecoration: 'none',
                          transition: 'background 0.15s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#1a1a24'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#1a1a24', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <FileText style={{ width: '17px', height: '17px', color: '#94a3b8' }} />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <p style={{ color: '#fff', fontSize: '14px', fontWeight: 500, margin: 0 }}>
                              {p.fileName || 'Text Prescription'}
                            </p>
                            <p style={{ color: '#64748b', fontSize: '12.5px', margin: '4px 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '400px' }}>
                              {p.drugs?.length > 0 ? p.drugs.join(', ') : 'Not extracted yet'}
                            </p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                          <span style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '20px', fontWeight: 500, textTransform: 'capitalize', color: statusStyle.color, background: statusStyle.bg }}>
                            {p.status}
                          </span>
                          <ChevronRight style={{ width: '16px', height: '16px', color: '#3a3a4a' }} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Reports */}
            {reports.length > 0 && (
              <div style={{ background: '#111118', border: '1px solid #22222f', borderRadius: '14px', overflow: 'hidden' }}>
                <div style={{ padding: '18px 24px', borderBottom: '1px solid #22222f' }}>
                  <h2 style={{ color: '#fff', fontWeight: 600, fontSize: '16px', margin: 0 }}>Recent Reports</h2>
                </div>
                <div>
                  {reports.slice(0, 3).map(r => (
                    <Link
                      key={r.id}
                      to={`/prescription/${r.prescriptionId}/report`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '18px 24px',
                        borderBottom: '1px solid #22222f',
                        textDecoration: 'none'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#1a1a24'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ minWidth: 0 }}>
                        <p style={{ color: '#fff', fontSize: '14px', fontWeight: 500, margin: 0 }}>
                          {Array.isArray(r.drugs) ? r.drugs.join(', ') : 'Drug Report'}
                        </p>
                        <p style={{ color: '#64748b', fontSize: '12.5px', margin: '4px 0 0 0' }}>
                          {r.summary?.total || 0} interaction(s) found
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                        <RiskBadge risk={r.overallRisk} size="sm" />
                        <ChevronRight style={{ width: '16px', height: '16px', color: '#3a3a4a' }} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;