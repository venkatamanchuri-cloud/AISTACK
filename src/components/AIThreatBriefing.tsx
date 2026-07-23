import React, { useState } from 'react';
import {
  Sparkles,
  ShieldAlert,
  Bot,
  Send,
  User,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  MessageSquare,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import {
  AIIntelligenceReport,
  ChatMessage,
  CurrentWeather,
  DailyForecast,
  LocationInfo,
} from '../types';

interface AIThreatBriefingProps {
  location: LocationInfo;
  weather: CurrentWeather;
  daily: DailyForecast[];
  airQuality: any;
}

export const AIThreatBriefing: React.FC<AIThreatBriefingProps> = ({
  location,
  weather,
  daily,
  airQuality,
}) => {
  const [report, setReport] = useState<AIIntelligenceReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Hello! I am your Weather Intelligence AI Assistant. I have ingested live meteorological telemetry for ${location.name}. Ask me any operational or supply chain questions regarding weather impacts!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        'Will current wind affect crane operations today?',
        'Analyze logistics delay risk for intercity freight.',
        'What is the 3-day solar power generation outlook?',
      ],
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);

  // Generate AI Executive Report
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/weather/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          current: weather,
          daily,
          airQuality,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setReport(data);
      }
    } catch (err) {
      console.error('Failed to generate AI intelligence report:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Send Chat Message
  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isSendingChat) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsSendingChat(true);

    try {
      const res = await fetch('/api/weather/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          location,
          currentWeather: weather,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsSendingChat(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top AI Briefing Generator Header in Bento style */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">INTELLIGENCE SYNTHESIS</span>
          <h3 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-2 mt-0.5">
            <Sparkles className="w-4 h-4 text-sky-400" />
            GEMINI AI EXECUTIVE OPERATIONAL BRIEFING
          </h3>
          <p className="text-[11px] font-mono text-slate-500 mt-1">Generate automated risk assessments, hazard windows, and dispatch guidance for {location.name}</p>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-sky-500/20 transition flex items-center gap-2 shrink-0 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin text-slate-950" />
              <span>Analyzing Telemetry...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{report ? 'Re-Generate AI Report' : 'Generate C-Suite Briefing'}</span>
            </>
          )}
        </button>
      </div>

      {/* Generated AI Report Card in Bento style */}
      {report && (
        <div className="bg-slate-900 border border-sky-500/30 rounded-2xl p-6 shadow-2xl space-y-6 animate-in fade-in">
          {/* Risk Level Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Threat Assessment Status</span>
              <span className="text-lg font-bold font-mono text-white mt-0.5 block">{report.riskRating}</span>
            </div>

            <div className="text-[10px] font-mono text-slate-500 uppercase">
              GENERATED: {new Date(report.generatedAt).toLocaleTimeString()}
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-sky-400" /> Executive Operational Brief
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed font-sans bg-slate-950/60 p-4 border border-slate-800 rounded-xl">
              {report.executiveSummary}
            </p>
          </div>

          {/* Threat Radar Cards */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Identified Operational Threats
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {report.threats.map((t, idx) => (
                <div key={idx} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm uppercase">{t.title}</span>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 uppercase">
                      Window: {t.impactWindow}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{t.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sector Takeaways Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
              <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-widest block">Logistics & Fleet</span>
              <p className="text-xs text-slate-300 mt-1">{report.industryInsights?.logistics}</p>
            </div>
            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
              <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-widest block">Energy & Power Grid</span>
              <p className="text-xs text-slate-300 mt-1">{report.industryInsights?.energy}</p>
            </div>
            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
              <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-widest block">Agriculture & Soils</span>
              <p className="text-xs text-slate-300 mt-1">{report.industryInsights?.agriculture}</p>
            </div>
            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
              <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-widest block">Civil Construction</span>
              <p className="text-xs text-slate-300 mt-1">{report.industryInsights?.construction}</p>
            </div>
          </div>

          {/* Operational Mitigations */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Recommended Risk Mitigations
            </h4>
            <div className="space-y-1.5">
              {report.operationalMitigations.map((step, idx) => (
                <div key={idx} className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-200 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Chat Console with Weather Intelligence AI */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <MessageSquare className="w-4 h-4 text-sky-400" />
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">NATURAL LANGUAGE CONSOLE</span>
            <h4 className="text-base font-bold text-white uppercase tracking-tight mt-0.5">ASK WEATHER INTELLIGENCE AI</h4>
          </div>
        </div>

        {/* Message Log */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2 no-scrollbar">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-mono text-xs ${
                  m.sender === 'user'
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'bg-slate-950 border border-slate-800 text-sky-400'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-xl p-3.5 rounded-2xl text-xs space-y-2 ${
                  m.sender === 'user'
                    ? 'bg-sky-500 text-slate-950 font-medium rounded-tr-none'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none font-sans'
                }`}
              >
                <div className="leading-relaxed whitespace-pre-wrap">{m.text}</div>
                <div className={`text-[10px] font-mono text-right ${m.sender === 'user' ? 'text-slate-900' : 'text-slate-500'}`}>
                  {m.timestamp}
                </div>

                {/* Suggested Chips */}
                {m.suggestedActions && m.suggestedActions.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5 border-t border-slate-800">
                    {m.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(action)}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-sky-400 border border-sky-500/30 rounded-lg text-[11px] font-mono transition text-left flex items-center gap-1 uppercase"
                      >
                        <span>{action}</span>
                        <ArrowRight className="w-3 h-3 text-sky-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isSendingChat && (
            <div className="flex items-center gap-2 text-xs text-sky-400 font-mono italic">
              <Bot className="w-4 h-4 animate-bounce" /> Analyzing query against meteorological models...
            </div>
          )}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 pt-2 border-t border-slate-800"
        >
          <input
            type="text"
            placeholder="ASK AI ABOUT WIND SHEAR, FLIGHT DELAYS, CROP FROST, OR ENERGY GRID LOAD..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500 uppercase tracking-wider"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isSendingChat}
            className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-sky-500/20 transition flex items-center gap-1.5 disabled:opacity-50 shrink-0"
          >
            <Send className="w-4 h-4" /> Send
          </button>
        </form>
      </div>
    </div>
  );
};
