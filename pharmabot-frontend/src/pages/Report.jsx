import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import RiskBadge from '../components/RiskBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axios';
import toast from 'react-hot-toast';
import {
  AlertTriangle, CheckCircle, Info,
  ChevronRight, Shield, FileText
} from 'lucide-react';

const Report = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/prescriptions/${id}/report`);
        setReport(res.data.report);
      } catch (err) {
        toast.error('Report not found');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const getPriorityIcon = (priority) => {
    if (priority === 'URGENT') return <AlertTriangle style={{ width: '16px', height: '16px', color: '#f87171' }} />;
    if (priority === 'MONITOR') return <Info style={{ width: '16px', height: '16px', color: '#fbbf24' }} />;
    return <CheckCircle style={{ width: '16px', height: '16px', color: '#4ade80' }} />;
  };

  const getPriorityStyle = (priority) => {
    if (priority === 'URGENT') return { border: '1px solid rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.05)' };
    if (priority === 'MONITOR') return { border: '1px solid rgba(251,191,36,0.3)', background: 'rgba(251,191,36,0.05)' };
    return { border: '1px solid rgba(74,222,128,0.3)', background: 'rgba(74,222,128,0.05)' };
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0f' }}>
        <Sidebar />
        <main style={{ marginLeft: '260px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LoadingSpinner size="lg" text="Loading report..." />
        </main>
      </div>
    );
  }

  if (!report) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0f' }}>
        <Sidebar />
        <main style={{ marginLeft: '260px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#94a3b8' }}>Report not found</p>
            <Link to="/dashboard" style={{ color: '#818cf8', fontSize: '13px', marginTop: '8px', display: 'block' }}>Back to dashboard</Link>
          </div>
        </main>
      </div>
    );
  }

  const classifications = Array.isArray(report.classifications) ? report.classifications : [];
  const actionItems = Array.isArray(report.actionItems) ? report.actionItems : [];
  const drugs = Array.isArray(report.drugs) ? report.drugs : [];
  const summary = report.summary || {};

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0f' }}>
      <Sidebar />

      <main style={{ marginLeft: '260px', flex: 1, padding: '40px', display: 'flex', justifyContent: 'center', boxSizing: 'border-box' }}>
        <div style={{ width: '100%', maxWidth: '780px' }}>
          {/* Breadcrumb */}
          <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>
            <Link to="/dashboard" style={{ color: '#94a3b8', textDecoration: 'none' }}>Dashboard</Link>
            <ChevronRight style={{ width: '12px', height: '12px', display: 'inline', margin: '0 4px', verticalAlign: 'middle' }} />
            <Link to={`/prescription/${id}`} style={{ color: '#94a3b8', textDecoration: 'none' }}>Prescription</Link>
            <ChevronRight style={{ width: '12px', height: '12px', display: 'inline', margin: '0 4px', verticalAlign: 'middle' }} />
            Safety Report
          </p>

          {/* Header */}
          <div style={{ background: '#111118', border: '1px solid #22222f', borderRadius: '14px', padding: '24px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Shield style={{ width: '18px', height: '18px', color: '#818cf8' }} />
                  <h1 style={{ color: '#fff', fontSize: '19px', fontWeight: 700, margin: 0 }}>Patient Safety Report</h1>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
                  Generated {new Date(report.generatedAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
              <RiskBadge risk={report.overallRisk} />
            </div>

            <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {drugs.map(drug => (
                <span key={drug} style={{ padding: '6px 12px', background: '#1a1a24', color: '#cbd5e1', borderRadius: '10px', fontSize: '12.5px', border: '1px solid #2a2a3a' }}>
                  {drug}
                </span>
              ))}
            </div>
          </div>

          {/* Summary Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Total', value: summary.total || 0, color: '#fff' },
              { label: 'High Risk', value: summary.high || 0, color: '#f87171' },
              { label: 'Moderate', value: summary.moderate || 0, color: '#fbbf24' },
              { label: 'Low Risk', value: summary.low || 0, color: '#4ade80' }
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: '#111118', border: '1px solid #22222f', borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: '24px', fontWeight: 700, color, margin: 0 }}>{value}</p>
                <p style={{ color: '#94a3b8', fontSize: '12px', margin: '4px 0 0 0' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Narrative */}
          <div style={{ background: '#111118', border: '1px solid #22222f', borderRadius: '14px', padding: '24px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <FileText style={{ width: '15px', height: '15px', color: '#818cf8' }} />
              <h2 style={{ color: '#fff', fontWeight: 600, fontSize: '15px', margin: 0 }}>Clinical Summary</h2>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>{report.narrative}</p>
          </div>

          {/* Classifications */}
          {classifications.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ color: '#fff', fontWeight: 600, fontSize: '16px', marginBottom: '14px' }}>Drug Interactions</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {classifications.map((c, i) => (
                  <div key={i} style={{ background: '#111118', border: '1px solid #22222f', borderRadius: '14px', padding: '22px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                      <h3 style={{ color: '#fff', fontWeight: 600, fontSize: '15px', margin: 0 }}>{c.drugA} + {c.drugB}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{Math.round((c.confidence || 0) * 100)}% confidence</span>
                        <RiskBadge risk={c.severity} size="sm" />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <p style={{ color: '#64748b', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>Reason</p>
                        <p style={{ color: '#cbd5e1', fontSize: '13.5px', margin: 0, lineHeight: '1.6' }}>{c.reason}</p>
                      </div>
                      {c.mechanism && (
                        <div>
                          <p style={{ color: '#64748b', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>Mechanism</p>
                          <p style={{ color: '#cbd5e1', fontSize: '13.5px', margin: 0, lineHeight: '1.6' }}>{c.mechanism}</p>
                        </div>
                      )}
                      {c.recommendation && (
                        <div style={{ background: '#1a1a24', borderRadius: '10px', padding: '12px', border: '1px solid #2a2a3a' }}>
                          <p style={{ color: '#64748b', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>Recommendation</p>
                          <p style={{ color: '#cbd5e1', fontSize: '13.5px', margin: 0, lineHeight: '1.6' }}>{c.recommendation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Items */}
          {actionItems.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ color: '#fff', fontWeight: 600, fontSize: '16px', marginBottom: '14px' }}>Action Items</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {actionItems.map((action, i) => {
                  const style = getPriorityStyle(action.priority);
                  return (
                    <div key={i} style={{ ...style, borderRadius: '14px', padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        {getPriorityIcon(action.priority)}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{
                            fontSize: '11.5px',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            color: action.priority === 'URGENT' ? '#f87171' : action.priority === 'MONITOR' ? '#fbbf24' : '#4ade80'
                          }}>
                            {action.priority}
                          </span>
                          <p style={{ color: '#fff', fontSize: '13.5px', fontWeight: 500, margin: '4px 0 0 0' }}>{action.action}</p>
                          <p style={{ color: '#94a3b8', fontSize: '12.5px', margin: '4px 0 0 0' }}>{action.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div style={{ background: '#111118', border: '1px solid #22222f', borderRadius: '14px', padding: '16px' }}>
            <p style={{ color: '#64748b', fontSize: '12px', lineHeight: '1.6', margin: 0 }}>
              <strong style={{ color: '#94a3b8' }}>Disclaimer:</strong> This report is generated for educational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider before making any medication decisions.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Report;