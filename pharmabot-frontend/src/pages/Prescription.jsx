import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axios';
import toast from 'react-hot-toast';
import {
  Pill, Zap, FileText, Trash2,
  ChevronRight, AlertTriangle, CheckCircle
} from 'lucide-react';

const Prescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [extracting, setExtracting] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchPrescription();
  }, [id]);

  const fetchPrescription = async () => {
    try {
      const res = await api.get(`/prescriptions/${id}`);
      setPrescription(res.data.prescription);
    } catch (err) {
      toast.error('Prescription not found');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleExtract = async () => {
    setExtracting(true);
    try {
      const res = await api.post(`/prescriptions/${id}/extract`);
      setPrescription(res.data.prescription);
      toast.success(`Found ${res.data.drugsFound?.length || 0} drugs`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Extraction failed');
    } finally {
      setExtracting(false);
    }
  };

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      await api.post(`/prescriptions/${id}/report`);
      toast.success('Report generated!');
      navigate(`/prescription/${id}/report`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Report generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this prescription?')) return;
    try {
      await api.delete(`/prescriptions/${id}`);
      toast.success('Deleted');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0f' }}>
        <Sidebar />
        <main style={{ marginLeft: '260px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LoadingSpinner size="lg" text="Loading prescription..." />
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0f' }}>
      <Sidebar />

      <main style={{ marginLeft: '260px', flex: 1, padding: '40px', display: 'flex', justifyContent: 'center', boxSizing: 'border-box' }}>
        <div style={{ width: '100%', maxWidth: '720px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', gap: '16px' }}>
            <div style={{ minWidth: 0 }}>
              <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>
                <Link to="/dashboard" style={{ color: '#94a3b8', textDecoration: 'none' }}>Dashboard</Link>
                <ChevronRight style={{ width: '12px', height: '12px', display: 'inline', margin: '0 4px', verticalAlign: 'middle' }} />
                Prescription
              </p>
              <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, margin: 0, wordBreak: 'break-word' }}>
                {prescription.fileName || 'Text Prescription'}
              </h1>
            </div>
            <button
              onClick={handleDelete}
              style={{
                padding: '10px',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                borderRadius: '10px',
                flexShrink: 0
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; }}
            >
              <Trash2 style={{ width: '17px', height: '17px' }} />
            </button>
          </div>

          {/* Status */}
          <div style={{ background: '#111118', border: '1px solid #22222f', borderRadius: '14px', padding: '22px', marginBottom: '20px' }}>
            <h2 style={{ color: '#fff', fontWeight: 600, fontSize: '15px', marginBottom: '14px', marginTop: 0 }}>Status</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {['pending', 'extracted', 'reported'].map((step, i) => {
                const order = ['pending', 'extracted', 'analysed', 'classified', 'reported'];
                const current = order.indexOf(prescription.status);
                const stepIndex = order.indexOf(step);
                const done = current >= stepIndex;
                return (
                  <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '12.5px',
                      fontWeight: 500,
                      textTransform: 'capitalize',
                      background: done ? 'rgba(99,102,241,0.15)' : '#1a1a24',
                      color: done ? '#818cf8' : '#64748b',
                      border: done ? '1px solid rgba(99,102,241,0.3)' : '1px solid #2a2a3a'
                    }}>
                      {done && <CheckCircle style={{ width: '13px', height: '13px' }} />}
                      {step}
                    </div>
                    {i < 2 && <ChevronRight style={{ width: '13px', height: '13px', color: '#3a3a4a' }} />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Raw Text */}
          {prescription.rawText && (
            <div style={{ background: '#111118', border: '1px solid #22222f', borderRadius: '14px', padding: '22px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <FileText style={{ width: '15px', height: '15px', color: '#94a3b8' }} />
                <h2 style={{ color: '#fff', fontWeight: 600, fontSize: '15px', margin: 0 }}>Prescription Text</h2>
              </div>
              <p style={{
                color: '#cbd5e1',
                fontSize: '13.5px',
                lineHeight: '1.7',
                background: '#1a1a24',
                borderRadius: '10px',
                padding: '16px',
                fontFamily: 'monospace',
                margin: 0,
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap'
              }}>
                {prescription.rawText}
              </p>
            </div>
          )}

          {/* Drugs */}
          {prescription.drugs?.length > 0 ? (
            <div style={{ background: '#111118', border: '1px solid #22222f', borderRadius: '14px', padding: '22px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Pill style={{ width: '15px', height: '15px', color: '#818cf8' }} />
                <h2 style={{ color: '#fff', fontWeight: 600, fontSize: '15px', margin: 0 }}>Drugs Detected</h2>
                <span style={{ marginLeft: 'auto', color: '#64748b', fontSize: '12px' }}>{prescription.drugs.length} found</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {prescription.drugs.map(drug => (
                  <span
                    key={drug}
                    style={{
                      padding: '8px 14px',
                      background: 'rgba(99,102,241,0.1)',
                      border: '1px solid rgba(99,102,241,0.2)',
                      color: '#818cf8',
                      borderRadius: '10px',
                      fontSize: '13.5px',
                      fontWeight: 500
                    }}
                  >
                    {drug}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ background: '#111118', border: '1px solid #22222f', borderRadius: '14px', padding: '22px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <AlertTriangle style={{ width: '20px', height: '20px', color: '#fbbf24', flexShrink: 0 }} />
                <div>
                  <p style={{ color: '#fff', fontWeight: 500, fontSize: '14px', margin: 0 }}>Drugs not extracted yet</p>
                  <p style={{ color: '#94a3b8', fontSize: '12.5px', margin: '4px 0 0 0' }}>Run AI extraction to identify drug names</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {(!prescription.drugs || prescription.drugs.length === 0) && (
              <button
                onClick={handleExtract}
                disabled={extracting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 22px',
                  background: '#6366f1',
                  color: '#fff',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 500,
                  border: 'none',
                  cursor: extracting ? 'not-allowed' : 'pointer',
                  opacity: extracting ? 0.6 : 1
                }}
              >
                {extracting ? (
                  <div style={{ width: '15px', height: '15px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                ) : (
                  <Zap style={{ width: '15px', height: '15px' }} />
                )}
                {extracting ? 'Extracting...' : 'Extract Drugs'}
              </button>
            )}

            {prescription.drugs?.length >= 2 && prescription.status !== 'reported' && (
              <button
                onClick={handleGenerateReport}
                disabled={generating}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 22px',
                  background: 'linear-gradient(135deg, #6366f1, #9333ea)',
                  color: '#fff',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: generating ? 'not-allowed' : 'pointer',
                  opacity: generating ? 0.6 : 1
                }}
              >
                {generating ? (
                  <div style={{ width: '15px', height: '15px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                ) : (
                  <FileText style={{ width: '15px', height: '15px' }} />
                )}
                {generating ? 'Generating Report...' : 'Generate Safety Report'}
              </button>
            )}

            {prescription.drugs?.length === 1 && (
              <p style={{ color: '#fbbf24', fontSize: '13px', alignSelf: 'center' }}>
                Need at least 2 drugs to check interactions
              </p>
            )}

            {prescription.status === 'reported' && (
              <Link
                to={`/prescription/${id}/report`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 22px',
                  background: 'rgba(74,222,128,0.15)',
                  border: '1px solid rgba(74,222,128,0.3)',
                  color: '#4ade80',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 500,
                  textDecoration: 'none'
                }}
              >
                <FileText style={{ width: '15px', height: '15px' }} />
                View Report
              </Link>
            )}
          </div>
        </div>
      </main>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Prescription;