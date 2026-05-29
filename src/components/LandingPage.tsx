import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeroGeometric } from './ui/shape-landing-hero';
import { LogoCloud } from './ui/logo-cloud-4';
import { cn } from '../lib/utils';

const techLogos = [
  {
    src: "https://svgl.app/library/nvidia-wordmark-light.svg",
    alt: "Nvidia Logo",
  },
  {
    src: "https://svgl.app/library/supabase_wordmark_light.svg",
    alt: "Supabase Logo",
  },
  {
    src: "https://svgl.app/library/openai_wordmark_light.svg",
    alt: "OpenAI Logo",
  },
  {
    src: "https://svgl.app/library/turso-wordmark-light.svg",
    alt: "Turso Logo",
  },
  {
    src: "https://svgl.app/library/vercel_wordmark.svg",
    alt: "Vercel Logo",
  },
  {
    src: "https://svgl.app/library/github_wordmark_light.svg",
    alt: "GitHub Logo",
  },
  {
    src: "https://svgl.app/library/claude-ai-wordmark-icon_light.svg",
    alt: "Claude AI Logo",
  },
  {
    src: "https://svgl.app/library/clerk-wordmark-light.svg",
    alt: "Clerk Logo",
  },
];

import {
  Cpu,
  TrendingUp,
  Radio,
  Workflow,
  Brain,
  Layers,
  Database,
  BarChart3,
  Code,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Activity,
  Server,
  Zap
} from 'lucide-react';
import { Project, GroupConfig, TelemetryLog } from '../types';

interface LandingPageProps {
  projects: Project[];
  groups: GroupConfig[];
  logs: TelemetryLog[];
  onOpenLogin: () => void;
  onEnterDashboardOfGroup: (slug: string) => void;
}

export default function LandingPage({
  projects,
  groups,
  logs,
  onOpenLogin,
  onEnterDashboardOfGroup
}: LandingPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [previewGroupSlug, setPreviewGroupSlug] = useState<string | null>(null);
  
  // Quote Carousel State
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);
  const quotes = [
    {
      text: "The computer was born to solve problems that did not exist before.",
      author: "Bill Gates",
      role: "Pioneer of Technology"
    },
    {
      text: "Talk is cheap. Show me the code.",
      author: "Linus Torvalds",
      role: "Creator of Linux & Git"
    },
    {
      text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
      author: "Martin Fowler",
      role: "Software Engineer"
    },
    {
      text: "I do not fear computers. I fear the lack of them.",
      author: "Isaac Asimov",
      role: "Visionary & Author"
    },
    {
      text: "Innovation distinguishes between a leader and a follower.",
      author: "Steve Jobs",
      role: "Tech Visionary"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [quotes.length]);

  // Q&A Accordion State
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const faqs = [
    {
      q: "Apa itu Pusat Inovasi & Projek Sistem Komputer?",
      a: "Platform ini adalah wadah showcase digital dan pusat kontrol terintegrasi yang khusus dikembangkan bagi mahasiswa Sistem Komputer untuk memamerkan, menguji, dan memantau proyek telemetri IoT mereka secara langsung."
    },
    {
      q: "Apakah platform ini mendukung arsitektur perangkat keras umum seperti ESP32?",
      a: "Tentu. Platform kami dirancang fleksibel untuk berkomunikasi dengan berbagai node edge seperti ESP32, Arduino, Raspberry Pi, dan sistem baremetal lainnya melalui protokol REST API maupun MQTT berkecepatan tinggi."
    },
    {
      q: "Bagaimana algoritma enkripsi dan keamanan data gateway diproses?",
      a: "Setiap perangkat fisik yang terhubung harus mengautentikasi diri menggunakan Private API Token unik. Seluruh transmisi payload data dilapisi keamanan transport agar tercegah dari modifikasi pihak ketiga atau injeksi sinyal anomali."
    },
    {
      q: "Dapatkah publik mengakses panel dasbor analitik?",
      a: "Data showcase kami berikan akses pantau awam secara view-only demi keperluan publikasi. Namun, kendali modular, kalibrasi aktuator, dan super-admin audit tetap terkunci aman untuk grup mahasiswa bersangkutan."
    }
  ];

  // Compute stats
  const stats = useMemo(() => {
    const totalGroups = groups.length;
    const onlineDevicesCount = projects.filter(p => p.status === 'online').length;
    const totalLogs = logs.length * 10 + 4120; // adding physical simulated history base
    const activeProjects = projects.length;
    return { totalGroups, onlineDevicesCount, totalLogs, activeProjects };
  }, [projects, groups, logs]);

  // Categories list
  const categories = ['All', 'IoT', 'Embedded', 'AI', 'Networking', 'Automation'];

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projects;
    return projects.filter(p => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  // Get active preview telemetry data
  const previewData = useMemo(() => {
    if (!previewGroupSlug) return null;
    const groupLog = logs.filter(l => l.groupSlug === previewGroupSlug).slice(-1)[0];
    const groupConf = groups.find(g => g.groupSlug === previewGroupSlug);
    return { log: groupLog, config: groupConf };
  }, [previewGroupSlug, logs, groups]);

  return (
    <div className="min-h-screen bg-[#030303] text-slate-100 font-sans selection:bg-indigo-500/25 selection:text-indigo-300">
      
      {/* Hero Section with Elegant Geometric Design */}
      <HeroGeometric
        badge="PROGRAM STUDI SISTEM KOMPUTER — LAB IoT"
        title1="Pusat Inovasi & Projek"
        title2="Sistem Komputer"
        description="Platform showcase digital dan pusat kendali terintegrasi untuk menampilkan hasil riset, inovasi perangkat keras, sistem siber-fisik, serta karya teknologi pintar mahasiswa program studi Sistem Komputer."
        onOpenLogin={onOpenLogin}
      />

      {/* Stats Counter Section */}
      <section className="relative z-20 -mt-20 sm:-mt-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02]/60 p-4 sm:p-6 shadow-2xl backdrop-blur-2xl">
          <div className="text-center p-2 border-r border-white/[0.06] last:border-0">
            <p className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">Kelompok Aktif</p>
            <h3 className="mt-1 text-2xl font-extrabold text-white font-mono md:text-3.5xl">
              {stats.totalGroups} <span className="text-indigo-300 text-lg">+</span>
            </h3>
          </div>
          <div className="text-center p-2 md:border-r border-white/[0.06] last:border-0">
            <p className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">Device Online</p>
            <h3 className="mt-1 text-2xl font-extrabold text-indigo-300 font-mono md:text-3.5xl">
              {stats.onlineDevicesCount} <span className="text-slate-300 text-xs font-normal">Online</span>
            </h3>
          </div>
          <div className="text-center p-2 border-r border-white/[0.06] last:border-0">
            <p className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">Data Telemetri</p>
            <h3 className="mt-1 text-2xl font-extrabold text-white font-mono md:text-3.5xl">
              {stats.totalLogs.toLocaleString()}+
            </h3>
          </div>
          <div className="text-center p-2 last:border-0">
            <p className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">Project Inovasi</p>
            <h3 className="mt-1 text-2xl font-extrabold text-sky-200 font-mono md:text-3.5xl">
              {stats.activeProjects} Active
            </h3>
          </div>
        </div>
      </section>

      {/* Focus Core Academic Expertise Areas */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans sm:text-3xl">
            Kurikulum & Pilar Riset Teknologi
          </h2>
          <p className="mt-3 text-slate-300 text-sm max-w-2xl mx-auto">
            Fokus riset Program Studi Sistem Komputer mengintegrasikan rekayasa perangkat keras dan komputasi siber intelijen.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-md hover:border-indigo-500/25 transition-all duration-300 p-6 shadow-md text-center sm:text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 mb-4 mx-auto sm:mx-0">
              <Radio className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-100">Internet of Things (IoT)</h4>
            <p className="mt-2 text-slate-300 text-sm leading-relaxed">
              Konektivitas nirkabel berdaya rendah, protokol MQTT/REST API, dan integrasi modul telemetri mikrokontroler menuju cloud database terdistribusi.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-md hover:border-indigo-500/25 transition-all duration-300 p-6 shadow-md text-center sm:text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 mb-4 mx-auto sm:mx-0">
              <Cpu className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-100">Embedded Systems</h4>
            <p className="mt-2 text-slate-300 text-sm leading-relaxed">
              Arsitektur mikrokontroler modern ESP32, ARM Cortex, FPGA, dan pemrosesan komputasi modular baremetal berbasis C/C++ berkecepatan tinggi.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-md hover:border-indigo-500/25 transition-all duration-300 p-6 shadow-md text-center sm:text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 mb-4 mx-auto sm:mx-0">
              <Brain className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-100">Artificial Intelligence</h4>
            <p className="mt-2 text-slate-300 text-sm leading-relaxed">
              Klasifikasi anomali log data, smart decision, visi komputer ringan, dan implementasi algoritma machine learning pada edge computing gateway.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-md hover:border-indigo-500/25 transition-all duration-300 p-6 shadow-md text-center sm:text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 mb-4 mx-auto sm:mx-0">
              <Workflow className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-100">Smart Automation</h4>
            <p className="mt-2 text-slate-300 text-sm leading-relaxed">
              Sistem kendali aktuator cerdas otomatis, sensor optik presisi, dan kustomisasi skenario loop tertutup guna produktivitas maksimal.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-md hover:border-indigo-500/25 transition-all duration-300 p-6 shadow-md text-center sm:text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 mb-4 mx-auto sm:mx-0">
              <Layers className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-100">API Brokerage & Networking</h4>
            <p className="mt-2 text-slate-300 text-sm leading-relaxed">
              Arsitektur API berorientasi layanan, broker MQTT handal, manajemen token perangkat aman, serta manajemen bandwith payload efisien.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-md hover:border-indigo-500/25 transition-all duration-300 p-6 shadow-md text-center sm:text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 mb-4 mx-auto sm:mx-0">
              <Database className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-100">Cloud Telemetry Logger</h4>
            <p className="mt-2 text-slate-300 text-sm leading-relaxed">
              Penyimpanan historis sensor terstruktur, pemantauan status kesehatan instrumen, audit logs, hingga ekspor data riset berformat CSV.
            </p>
          </div>
        </div>
      </section>

      {/* Showcase Student Projects Section */}
      <section id="showcase-projects" className="py-20 border-t border-white/[0.06] bg-[#030303]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/[0.06] pb-8 gap-4">
            <div>
              <span className="font-mono text-xs text-indigo-300 uppercase tracking-widest">SHOWCASE PEMBENTUKAN</span>
              <h2 className="text-3xl font-bold text-white mt-1">Daftar Project Teknologi Mahasiswa</h2>
              <p className="text-slate-300 text-sm mt-2 max-w-xl">
                Tinjau real-time data status dari project rintisan rancang bangun mahasiswa Sistem Komputer. Pilih kelompok untuk meninjau dasbor sensor interaktif.
              </p>
            </div>

            {/* Category Filter tabs */}
            <div className="flex flex-wrap gap-1.5 bg-white/[0.02] p-1 rounded-xl border border-white/[0.08]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-mono font-medium transition-all duration-300 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-indigo-500/15 text-indigo-200 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-indigo-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Project Cards Grid */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((p, index) => (
                <motion.div
                  key={p.id}
                  layoutId={p.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-indigo-500/25 hover:bg-[#08080b] transition-all duration-300 flex flex-col h-full overflow-hidden group shadow-xl"
                >
                  {/* Decorative high tech card header */}
                  <div className="p-4 border-b border-white/[0.06] bg-white/[0.01] flex items-center justify-between">
                    <span className="font-mono text-[10px] bg-white/[0.04] text-slate-200 px-2.5 py-1 rounded border border-white/[0.08]">
                      {p.groupSlug.toUpperCase()}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="relative flex h-2 w-2">
                        <span className={`absolute inline-flex h-full w-full rounded-full ${p.status === 'online' ? 'bg-indigo-400 animate-ping' : 'bg-red-400'} opacity-75`}></span>
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${p.status === 'online' ? 'bg-indigo-500' : 'bg-red-500'}`}></span>
                      </span>
                      <span className="font-mono text-[10px] text-slate-300">
                        {p.status === 'online' ? 'GATEWAY LIVE' : 'OFFLINE'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Project title */}
                      <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                        {p.name}
                      </h3>
                      <p className="mt-2 text-slate-300/90 text-xs leading-relaxed line-clamp-3">
                        {p.description}
                      </p>

                      {/* Info categories */}
                      <div className="mt-4 flex items-center space-x-2 text-[11px] font-mono text-slate-400">
                        <span className="bg-[#0a0a0c] px-2 py-0.5 rounded border border-white/[0.06] text-slate-300">
                          Cat: {p.category}
                        </span>
                        <span className="text-slate-700">|</span>
                        <span className="text-slate-300">Upb: {new Date(p.lastUpdated).toLocaleTimeString()}</span>
                      </div>
                    </div>

                    {/* Footer tags & Preview CTA buttons */}
                    <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-end justify-between">
                      <div className="flex flex-wrap gap-1">
                        {p.tags.slice(0, 2).map(t => (
                          <span key={t} className="text-[9px] font-mono bg-indigo-500/10 text-indigo-200/90 border border-indigo-500/20 px-2 py-0.5 rounded">
                            #{t}
                          </span>
                        ))}
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => setPreviewGroupSlug(previewGroupSlug === p.groupSlug ? null : p.groupSlug)}
                          className="flex items-center space-x-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
                        >
                          <Activity className="h-3.5 w-3.5 text-indigo-300" />
                          <span>Quick View</span>
                        </button>
                        <button
                          onClick={() => onEnterDashboardOfGroup(p.groupSlug)}
                          className="flex items-center justify-center p-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/25 hover:bg-indigo-500 hover:text-[#030303] text-indigo-200 transition-all cursor-pointer"
                          title="Meluncur Ke Dasbor Dedikasi"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Quick Realtime Floating Drawer preview */}
          <AnimatePresence>
            {previewGroupSlug && previewData && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="mt-8 rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl shadow-2xl"
              >
                <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/[0.06] pb-4 mb-4 gap-2">
                  <div className="flex items-center space-x-3">
                    <div className="bg-indigo-500/10 p-2 rounded-lg text-indigo-300">
                      <Activity className="h-5 w-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">
                        Real-time Telemetry Monitor
                        <span className="ml-2.5 inline-flex items-center rounded-md bg-indigo-400/10 px-2 py-0.5 text-xs font-mono font-medium text-indigo-300 ring-1 ring-inset ring-indigo-400/20">
                          {previewGroupSlug.toUpperCase()}
                        </span>
                      </h4>
                      <p className="text-slate-300 text-xs mt-0.5">
                        Menampilkan sinyal sensor terbaru hasil broadcast broker waktu-nyata di platform.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs text-slate-400">
                      Last Gateway Stamp: {previewData.log ? new Date(previewData.log.timestamp).toLocaleTimeString() : 'Waiting packet...'}
                    </span>
                    <button
                      onClick={() => setPreviewGroupSlug(null)}
                      className="text-slate-300 hover:text-white px-2.5 py-1 text-xs border border-white/[0.08] rounded bg-white/[0.02] cursor-pointer hover:bg-white/[0.06] transition-all duration-300"
                    >
                      Close
                    </button>
                  </div>
                </div>

                {/* Simulated Telemetry Cards within the Quick Preview */}
                {previewData.config && previewData.config.widgets && previewData.config.widgets.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {previewData.config.widgets.filter(w => w.type !== 'log_telemetry').map((widget) => {
                      const sensorVal = previewData.log ? previewData.log.data[widget.sensorKey] : null;
                      return (
                        <div key={widget.id} className="bg-[#0a0a0c] p-4 rounded-xl border border-white/[0.06] shadow-sm">
                          <p className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">{widget.title}</p>
                          <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-xl font-extrabold text-white font-mono">
                              {sensorVal !== undefined && sensorVal !== null 
                                ? (typeof sensorVal === 'number' ? sensorVal.toLocaleString() : String(sensorVal))
                                : '—'}
                            </span>
                            <span className="text-xs text-slate-400 font-mono font-medium ml-1">
                              {widget.unit}
                            </span>
                          </div>
                          {/* Simple percent progress bar */}
                          {typeof sensorVal === 'number' && widget.max > 0 && (
                            <div className="mt-3 w-full bg-neutral-900 h-1 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all duration-300"
                                style={{ 
                                  backgroundColor: widget.color === '#10b981' ? '#6366f1' : (widget.color || '#6366f1'), 
                                  width: `${Math.min(100, Math.max(0, ((sensorVal - widget.min) / (widget.max - widget.min)) * 100))}%` 
                                }}
                              ></div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-slate-400 text-xs py-4">Belum ada sinyal telemetri yang terpasang pada kelompok ini.</p>
                )}
                
                <div className="mt-4 pt-4 border-t border-white/[0.06] flex justify-end">
                  <button
                    onClick={() => {
                      onEnterDashboardOfGroup(previewGroupSlug);
                      setPreviewGroupSlug(null);
                    }}
                    className="text-xs font-semibold text-indigo-300 hover:text-indigo-200 flex items-center space-x-1 cursor-pointer transition-colors duration-300"
                  >
                    <span>Masuk ke Mode Interaktif Dasbor Modular Kelompok ini</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Industrial Features List Showcase */}
      <section className="hidden md:block py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="font-mono text-xs text-indigo-300 uppercase tracking-widest">INDUSTRI-GRADE ARCHITECTURE</span>
            <h2 className="text-3xl font-bold tracking-tight text-white mt-1">Platform IoT Terpadu Berbasis Cloud Kecepatan Tinggi</h2>
            <p className="mt-4 text-slate-300 text-base leading-relaxed">
              Academic IoT Platform didesain secara khusus untuk menjawab tantangan integrasi siber-fisik di era industri 4.0. Kami menyusun core monitoring tangguh, API Broker, dan machine learning siber server-side yang menyatu dalam satu ekosistem tangkas.
            </p>

            <ul className="mt-8 space-y-4">
              <li className="flex items-start space-x-3">
                <div className="mt-1 h-5 w-5 bg-white/[0.02] rounded border border-white/[0.08] text-indigo-300 flex items-center justify-center font-mono text-[10px]">1</div>
                <div>
                  <h5 className="font-bold text-slate-200 text-sm">Real-Time WebSocket & Server-Sent Events</h5>
                  <p className="text-slate-300 text-xs">Transmisi data latching berlatensi rendah di bawah 100ms dari gateway esp32 langsung terproyeksikan ke browser.</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="mt-1 h-5 w-5 bg-white/[0.02] rounded border border-white/[0.08] text-indigo-300 flex items-center justify-center font-mono text-[10px]">2</div>
                <div>
                  <h5 className="font-bold text-slate-200 text-sm">Modular Widget Configurator</h5>
                  <p className="text-slate-300 text-xs">Kelompok dibebaskan menyusun dan mengonfigurasi layout representasi telemetri sendiri sesuai kebutuhan instrumen fisiknya.</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="mt-1 h-5 w-5 bg-white/[0.02] rounded border border-white/[0.08] text-indigo-300 flex items-center justify-center font-mono text-[10px]">3</div>
                <div>
                  <h5 className="font-bold text-slate-200 text-sm">Server-Side AI Analytics (Gemini Pro)</h5>
                  <p className="text-slate-300 text-xs">Menerapkan algoritma generatif AI untuk menganalisis anomali, meramalkan data drift, sekaligus menghasilkan kode klien otomatis.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* High-tech mock illustration panel */}
          <div className="lg:ml-6 relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 overflow-hidden max-w-xl mx-auto shadow-2xl backdrop-blur-md">
            <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/5 rounded-full filter blur-3xl"></div>
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <div className="h-3.5 w-3.5 bg-red-400/20 rounded-full flex items-center justify-center">
                  <div className="h-1.5 w-1.5 bg-red-500 rounded-full"></div>
                </div>
                <span className="font-mono text-xs text-slate-300">REST API Gateway — CLI Client Mockup</span>
              </div>
              <span className="text-[10px] bg-[#0a0a0c] text-indigo-300 px-2.5 py-0.5 rounded font-mono border border-white/[0.04]">POST</span>
            </div>
            
            <div className="rounded-xl bg-[#0a0a0c] p-4 font-mono text-xs text-indigo-200 border border-white/[0.06] overflow-x-auto leading-relaxed h-72 shadow-inner">
              <p className="text-slate-500"># Kirim paket sensor dari ESP32 Anda</p>
              <p className="text-white mt-1">$ curl -X POST https://sistemkomputer.iot/api/telemetry/device/group-1 \</p>
              <p className="text-white">    -H "Content-Type: application/json" \</p>
              <p className="text-white">    -H <span className="text-sky-300">"X-API-Key: SK-KEY-G1-9874"</span> \</p>
              <p className="text-white">    -d '<span className="text-violet-300">{"{"}</span></p>
              <p className="text-white">         <span className="text-sky-300">"soil_moisture":</span> 68.2,</p>
              <p className="text-white">         <span className="text-sky-300">"temperature":</span> 31.4,</p>
              <p className="text-white">         <span className="text-sky-300">"air_humidity":</span> 58.0,</p>
              <p className="text-white">         <span className="text-sky-300">"pump_status":</span> 1</p>
              <p className="text-white">       <span className="text-violet-300">{"}"}</span>'</p>
              <p className="text-violet-300 mt-3">&gt;&gt; HTTP/1.1 200 OK {"{"}"success": true, "message": "Stored"{"}"}</p>
              <p className="text-indigo-300/80 animate-pulse mt-3">&gt;&gt; Broker broadcasted real-time SSE stream log payload...</p>
            </div>
            
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>Security Auth: Encrypted Key Verification</span>
              <span className="flex items-center text-indigo-300">
                <Zap className="h-3.5 w-3.5 mr-1" /> Ready
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Inspiring Quotes Glassmorphism Carousel */}
      <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 bg-indigo-500/10 rounded-full filter blur-[100px] pointer-events-none"></div>
        <div className="text-center mb-10 relative z-10">
          <span className="font-mono text-xs text-indigo-300 uppercase tracking-widest">Inspirasi Teknologi</span>
        </div>
        
        <div className="relative z-10 rounded-2xl border border-white/[0.04] bg-white/[0.01] p-8 md:p-12 shadow-2xl backdrop-blur-xl overflow-hidden min-h-[220px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeQuoteIndex}
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="text-center"
            >
              <p className="text-xl md:text-3xl font-bold text-white/90 leading-snug max-w-3xl mx-auto tracking-tight">
                "{quotes[activeQuoteIndex].text}"
              </p>
              <div className="mt-6 flex flex-col items-center justify-center">
                <span className="font-bold text-indigo-200 text-sm tracking-wide">{quotes[activeQuoteIndex].author}</span>
                <span className="font-mono text-[10px] text-slate-400 mt-1 uppercase tracking-widest">{quotes[activeQuoteIndex].role}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
            {quotes.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveQuoteIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeQuoteIndex ? 'w-6 bg-indigo-400' : 'w-1.5 bg-white/[0.1] hover:bg-white/[0.2]'
                }`}
                aria-label={`Go to quote ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Technology Partners Logo Cloud */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative border-t border-white/[0.04]">
        <div
          aria-hidden="true"
          className={cn(
            "-top-1/2 -translate-x-1/2 pointer-events-none absolute left-1/2 h-[80vmin] sm:h-[120vmin] w-[80vmin] sm:w-[120vmin] rounded-b-full",
            "bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.05),transparent_50%)]",
            "blur-[30px]"
          )}
        />
        <div className="w-full relative z-10">
          <h2 className="mb-10 text-center">
            <span className="block font-mono text-xs text-indigo-300 uppercase tracking-widest mb-2">
              Didukung Oleh
            </span>
            <span className="font-extrabold text-2xl text-white tracking-tight md:text-3xl font-display">
              Teknologi Industri Kelas Dunia
            </span>
          </h2>

          <LogoCloud logos={techLogos} />
        </div>
      </section>

      {/* Interactive Q&A Accordion Section */}
      <section className="py-24 border-t border-white/[0.04] bg-[#030303] relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center pb-12">
            <span className="font-mono text-xs text-indigo-300 uppercase tracking-widest">FAQ</span>
            <h2 className="text-3xl font-bold text-white mt-1">Pertanyaan Umum</h2>
          </div>
          
          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx} 
                  className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                    isOpen 
                      ? 'border-indigo-500/30 bg-white/[0.03] backdrop-blur-md shadow-lg shadow-indigo-500/5' 
                      : 'border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.02]'
                  }`}
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                  >
                    <span className="font-bold text-sm sm:text-base text-white pr-4">{faq.q}</span>
                    <ChevronRight className={`h-4 w-4 text-indigo-300 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-5 text-sm text-slate-300/80 leading-relaxed border-t border-white/[0.04] pt-4 mt-1">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modern High contrast footer */}
      <footer className="border-t border-white/[0.06] bg-[#030303] py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col space-y-10 md:space-y-0 md:grid md:grid-cols-12 md:gap-8">
            <div className="md:col-span-6 lg:col-span-5">
              <div className="flex items-center space-x-3">
                <Cpu className="h-6 w-6 sm:h-5 sm:w-5 text-indigo-300" />
                <span className="font-sans font-bold text-white text-base">Sistem Komputer academic technology platform</span>
              </div>
              <p className="mt-5 sm:mt-4 text-slate-300 text-sm sm:text-xs leading-relaxed md:max-w-md">
                Rintisan ekosistem pilar digital buatan mahasiswa demi menginspirasi riset dan rekayasa komputer siber handal nasional. Dioperasikan oleh Program Studi Sistem Komputer, Fakultas Teknologi & Informasi.
              </p>
            </div>

            <div className="md:col-span-3 lg:col-span-3">
              <h6 className="font-bold text-slate-200 text-xs uppercase tracking-widest font-mono">Quick Links</h6>
              <ul className="mt-5 sm:mt-4 space-y-3 sm:space-y-2 text-sm sm:text-xs text-slate-400">
                <li><a href="#showcase-projects" className="hover:text-indigo-200 transition-colors">Showcase Project</a></li>
                <li><button onClick={onOpenLogin} className="hover:text-indigo-200 transition-colors text-left cursor-pointer">Login Portal</button></li>
                <li><span className="text-slate-500 block">Jadwal Kuliah Lab</span></li>
                <li><span className="text-slate-500 block">Dokumentasi API MQTT</span></li>
              </ul>
            </div>

            <div className="md:col-span-3 lg:col-span-4">
              <h6 className="font-bold text-slate-200 text-xs uppercase tracking-widest font-mono">Kontak Jaringan</h6>
              <p className="mt-5 sm:mt-4 text-sm sm:text-xs text-slate-300 leading-relaxed max-w-xs sm:max-w-full">
                Lab Otomasi & IoT Kampus IT Sistem Komputer Indonesia.
                <br className="mb-2" />
                Email: <span className="text-indigo-200 break-all">akademik.siskom@universitas.sch.id</span>
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-center sm:text-left text-xs sm:text-[11px] text-slate-500 font-mono gap-4 sm:gap-0">
            <span>© 2026 Program Studi Sistem Komputer. All rights reserved.</span>
            <span>Version 2.4.0 (Production Stable Ver)</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
