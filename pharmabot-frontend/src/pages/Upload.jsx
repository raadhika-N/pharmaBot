import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Upload as UploadIcon, FileText, ArrowRight } from 'lucide-react';

const Upload = () => {
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rawText.trim()) {
      toast.error('Please enter prescription text');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('rawText', rawText);

      const res = await api.post('/prescriptions/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Prescription uploaded!');
      navigate(`/prescription/${res.data.prescription.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const samples = [
    { label: 'High Risk', text: 'Take Warfarin 5mg once daily. Continue Aspirin 75mg. Ibuprofen 400mg for pain. Metformin 500mg twice daily.' },
    { label: 'Complex', text: 'Continue Warfarin 5mg daily. Clopidogrel 75mg OD. Omeprazole 20mg BD. Simvastatin 40mg at night. Lisinopril 5mg morning.' },
    { label: 'Simple', text: 'Tab. Amoxicillin 500mg TDS x 7 days. Paracetamol 500mg SOS. Omeprazole 20mg BD before food.' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0f' }}>
      <Sidebar />

      <main style={{ marginLeft: '260px', flex: 1, padding: '40px', maxWidth: 'calc(100vw - 260px)' }}>
        <div style={{ maxWidth: '640px' }}>
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: 0 }}>Upload Prescription</h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: '6px 0 0 0' }}>
              Type or paste prescription text to begin analysis
            </p>
          </div>

          {/* Sample prescriptions */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '10px' }}>Try a sample:</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {samples.map(s => (
                <button
                  key={s.label}
                  onClick={() => setRawText(s.text)}
                  style={{
                    padding: '8px 14px',
                    background: '#1a1a24',
                    border: '1px solid #2a2a3a',
                    color: '#cbd5e1',
                    fontSize: '12.5px',
                    borderRadius: '10px',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#22222f'}
                  onMouseLeave={e => e.currentTarget.style.background = '#1a1a24'}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ background: '#111118', border: '1px solid #22222f', borderRadius: '14px', padding: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <FileText style={{ width: '16px', height: '16px', color: '#818cf8' }} />
                <span style={{ color: '#fff', fontWeight: 500, fontSize: '14px' }}>Prescription Text</span>
              </div>
              <textarea
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                placeholder="Tab. Warfarin 5mg OD. Continue Aspirin 75mg BD. Ibuprofen 400mg TDS for joint pain..."
                rows={8}
                style={{
                  width: '100%',
                  background: '#1a1a24',
                  border: '1px solid #2a2a3a',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  color: '#fff',
                  fontSize: '14px',
                  resize: 'none',
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
              <p style={{ color: '#64748b', fontSize: '12px', marginTop: '8px', marginBottom: 0 }}>
                {rawText.length} characters
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !rawText.trim()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 24px',
                background: 'linear-gradient(135deg, #6366f1, #9333ea)',
                color: '#fff',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '14px',
                border: 'none',
                cursor: loading || !rawText.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !rawText.trim() ? 0.5 : 1
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadIcon style={{ width: '16px', height: '16px' }} />
                  Upload & Analyse
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </>
              )}
            </button>
          </form>
        </div>
      </main>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Upload;