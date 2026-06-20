import { useState } from 'react';
import axios from 'axios';
import { Activity, HeartPulse, Brain, Image as ImageIcon, Pill, Stethoscope, AlertCircle } from 'lucide-react';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
function App() {
  const [activeTab, setActiveTab] = useState('triage');

  const tabs = [
    { id: 'triage', label: 'Disease Triage', icon: <Stethoscope className="w-5 h-5" /> },
    { id: 'maternal', label: 'Maternal Risk', icon: <Activity className="w-5 h-5" /> },
    { id: 'stroke', label: 'Stroke Risk', icon: <HeartPulse className="w-5 h-5" /> },
    { id: 'skin', label: 'Skin Disease', icon: <ImageIcon className="w-5 h-5" /> },
    { id: 'drug', label: 'Drug Sentiment', icon: <Pill className="w-5 h-5" /> },
    { id: 'mental', label: 'Mental Health', icon: <Brain className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-slate-950 to-emerald-900/20 pointer-events-none"></div>
      
      <div className="relative max-w-6xl mx-auto p-6 pt-12 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
          <div className="mb-8 px-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-emerald-400 tracking-tight">SwasthyaSetu</h1>
          </div>
          
          <div className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-white/10 text-white shadow-lg shadow-black/20 border border-white/10 backdrop-blur-md' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10">
            {activeTab === 'triage' && <TriageView />}
            {activeTab === 'maternal' && <MaternalView />}
            {activeTab === 'stroke' && <StrokeView />}
            {activeTab === 'skin' && <SkinView />}
            {activeTab === 'drug' && <DrugView />}
            {activeTab === 'mental' && <MentalView />}
          </div>
        </div>

      </div>
    </div>
  );
}

// --- Views ---

function TriageView() {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const sympList = symptoms.split(',').map(s => s.trim());
      const res = await axios.post(`${API_BASE}/predict/triage`, { symptoms: sympList });
      setResult(res.data);
    } catch (err) {
      alert("Failed to get prediction.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Disease Triage</h2>
        <p className="text-slate-400">Enter symptoms separated by commas to get a predicted condition.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Symptoms</label>
          <textarea 
            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all h-32"
            placeholder="e.g. fever, headache, nausea"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
        >
          {loading ? 'Analyzing...' : 'Predict Condition'}
        </button>
      </form>

      {result && (
        <div className="mt-8 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <p className="text-sm text-indigo-300 font-medium">Predicted Condition (Confidence: {(result.confidence * 100).toFixed(1)}%)</p>
            <p className="text-2xl font-bold text-white">{result.disease}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function MaternalView() {
  const [formData, setFormData] = useState({
    Age: '', SystolicBP: '', DiastolicBP: '', BS: '', BodyTemp: '', HeartRate: ''
  });
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = Object.fromEntries(Object.entries(formData).map(([k, v]) => [k, parseFloat(v)]));
      const res = await axios.post(`${API_BASE}/predict/maternal`, data);
      setResult(res.data);
    } catch (err) {
      alert("Failed to get prediction.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Maternal Risk Assessment</h2>
        <p className="text-slate-400">Enter patient vitals to predict maternal health risk.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {Object.keys(formData).map(key => (
          <div key={key}>
            <label className="block text-sm font-medium text-slate-300 mb-1">{key}</label>
            <input 
              type="number" step="0.1"
              className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              value={formData[key]}
              onChange={(e) => setFormData({...formData, [key]: e.target.value})}
              required
            />
          </div>
        ))}
        <div className="col-span-2 pt-4">
          <button type="submit" className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-emerald-500/25">
            Assess Risk
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4">
           <Activity className="w-8 h-8 text-emerald-400" />
           <div>
            <p className="text-sm text-emerald-300 font-medium">Risk Level (Confidence: {(result.confidence * 100).toFixed(1)}%)</p>
            <p className="text-2xl font-bold text-white capitalize">{result.risk_level}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function StrokeView() {
  const [formData, setFormData] = useState({
    gender: 'Male', age: '50', hypertension: '0', heart_disease: '0', ever_married: 'Yes', 
    work_type: 'Private', Residence_type: 'Urban', avg_glucose_level: '100', bmi: '25', smoking_status: 'never smoked'
  });
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        age: parseFloat(formData.age),
        hypertension: parseInt(formData.hypertension),
        heart_disease: parseInt(formData.heart_disease),
        avg_glucose_level: parseFloat(formData.avg_glucose_level),
        bmi: parseFloat(formData.bmi)
      };
      const res = await axios.post(`${API_BASE}/predict/stroke`, data);
      setResult(res.data);
    } catch (err) {
      alert("Failed to get prediction.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Stroke Prediction</h2>
        <p className="text-slate-400">Assess the likelihood of stroke based on patient history.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {Object.keys(formData).map(key => (
          <div key={key}>
            <label className="block text-sm font-medium text-slate-300 mb-1 capitalize">{key.replace('_', ' ')}</label>
            <input 
              type={['age', 'avg_glucose_level', 'bmi', 'hypertension', 'heart_disease'].includes(key) ? 'number' : 'text'}
              step="any"
              className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
              value={formData[key]}
              onChange={(e) => setFormData({...formData, [key]: e.target.value})}
              required
            />
          </div>
        ))}
        <div className="col-span-2 pt-4">
          <button type="submit" className="px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-rose-500/25">
            Predict Stroke Risk
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-8 p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-4">
           <HeartPulse className="w-8 h-8 text-rose-400" />
           <div>
            <p className="text-sm text-rose-300 font-medium">Prediction (Confidence: {(result.confidence * 100).toFixed(1)}%)</p>
            <p className="text-2xl font-bold text-white">{result.stroke_prediction}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function SkinView() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await axios.post(`${API_BASE}/predict/skin`, formData);
      setResult(res.data);
    } catch (err) {
      alert("Failed to get prediction.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Skin Disease Classifier</h2>
        <p className="text-slate-400">Upload a dermal image for classification using MobileNetV2.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:bg-white/5 transition-all">
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
            <ImageIcon className="w-12 h-12 text-slate-500 mb-4" />
            <span className="text-slate-300 font-medium">{file ? file.name : 'Click to select an image'}</span>
          </label>
        </div>
        <button 
          type="submit" disabled={!file || loading}
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Analyze Image'}
        </button>
      </form>

      {result && (
        <div className="mt-8 p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-4">
           <div>
            <p className="text-sm text-amber-300 font-medium">Classification Result (Confidence: {(result.confidence * 100).toFixed(1)}%)</p>
            <p className="text-2xl font-bold text-white">{result.disease}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function DrugView() {
  const [review, setReview] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/predict/drug_sentiment`, { review });
      setResult(res.data);
    } catch (err) {
      alert("Failed to get prediction.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Drug Review Sentiment</h2>
        <p className="text-slate-400">Analyze the sentiment of patient reviews for medications.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea 
          className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all h-32"
          placeholder="Type the drug review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
        />
        <button type="submit" className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-cyan-500/25">
          Analyze Sentiment
        </button>
      </form>

      {result !== null && (
        <div className="mt-8 p-6 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center gap-4">
           <Pill className="w-8 h-8 text-cyan-400" />
           <div>
            <p className="text-sm text-cyan-300 font-medium">Sentiment Score (Confidence: {(result.confidence * 100).toFixed(1)}%)</p>
            <p className="text-2xl font-bold text-white">{result.sentiment}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function MentalView() {
  const [formData, setFormData] = useState({
    gender: 'Female', course: 'Engineering', year_of_study: 'year 1', 
    cgpa: '3.00 - 3.49', marital_status: 'No', specialist_treatment: 'No'
  });
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/predict/mental_health`, formData);
      setResult(res.data);
    } catch (err) {
      alert("Failed to get prediction.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Student Mental Health Prediction</h2>
        <p className="text-slate-400">Assess potential mental health challenges based on student profiles.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {Object.keys(formData).map(key => (
          <div key={key}>
            <label className="block text-sm font-medium text-slate-300 mb-1 capitalize">{key.replace(/_/g, ' ')}</label>
            <input 
              type="text"
              className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all"
              value={formData[key]}
              onChange={(e) => setFormData({...formData, [key]: e.target.value})}
              required
            />
          </div>
        ))}
        <div className="col-span-2 pt-4">
          <button type="submit" className="px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 hover:from-fuchsia-400 hover:to-fuchsia-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-fuchsia-500/25">
            Predict Status
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-8 p-6 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-2xl flex items-center gap-4">
           <Brain className="w-8 h-8 text-fuchsia-400" />
           <div>
            <p className="text-sm text-fuchsia-300 font-medium">Predicted Diagnosis (Confidence: {(result.confidence * 100).toFixed(1)}%)</p>
            <p className="text-2xl font-bold text-white">{result.mental_health_status}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
