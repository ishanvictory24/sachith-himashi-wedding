'use client';

import { useState, useEffect, useRef } from 'react';

type AppState = 'gate' | 'main';
type TabName = 'cover' | 'story' | 'venue' | 'timeline' | 'gallery' | 'rsvp';

export default function LuxuryApp() {
  const [appState, setAppState] = useState<AppState>('gate');
  const [activeTab, setActiveTab] = useState<TabName>('cover');
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [rsvpState, setRsvpState] = useState<'none' | 'yes' | 'no'>('none');
  const [gyro, setGyro] = useState({ x: 0, y: 0 });
  
  const touchStartX = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tabSequence: TabName[] = ['cover', 'story', 'venue', 'timeline', 'gallery', 'rsvp'];

  useEffect(() => {
    audioRef.current = new Audio('/music.mp3');
    audioRef.current.loop = true;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (appState === 'main' && e.gamma && e.beta) {
        setGyro({
          x: Math.min(Math.max(e.gamma * 0.4, -15), 15),
          y: Math.min(Math.max(e.beta * 0.4, -15), 15),
        });
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [appState]);

  const unlockApp = () => {
    setAppState('main');
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setAudioPlaying(true))
        .catch(() => console.log("Audio engagement verified."));
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (audioPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setAudioPlaying(!audioPlaying);
  };

  const handleSwipe = (direction: 'LEFT' | 'RIGHT') => {
    if (activePhoto || activeTab === 'gallery') return;
    const currentIdx = tabSequence.indexOf(activeTab);
    if (direction === 'LEFT' && currentIdx < tabSequence.length - 1) {
      setActiveTab(tabSequence[currentIdx + 1]);
    } else if (direction === 'RIGHT' && currentIdx > 0) {
      setActiveTab(tabSequence[currentIdx - 1]);
    }
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-[#030303] select-none"
      onTouchStart={(e) => touchStartX.current = e.changedTouches[0].screenX}
      onTouchEnd={(e) => {
        const deltaX = touchStartX.current - e.changedTouches[0].screenX;
        if (Math.abs(deltaX) > 60) {
          handleSwipe(deltaX > 0 ? 'LEFT' : 'RIGHT');
        }
      }}
    >
      {/* GATE ENTRANCE */}
      {appState === 'gate' && (
        <div className="absolute inset-0 z-50 h-screen bg-[#030303] flex flex-col justify-between items-center p-12 text-center transition-all duration-[1200ms]">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_0)] bg-[size:24px_24px] pointer-events-none"></div>
          <div className="pt-16">
            <span className="font-serif text-[11px] tracking-[1.2em] text-[#D4AF37] block mb-2">ROYAL REGISTRY</span>
            <div className="h-[0.5px] w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto"></div>
          </div>

          <div className="relative my-auto flex flex-col items-center">
            <button onClick={unlockApp} className="relative w-40 h-40 rounded-full border border-[#D4AF37]/30 flex items-center justify-center bg-[#0F0F0F]/80 group active:scale-95 transition-all duration-500 shadow-[0_0_40px_rgba(214,175,55,0.15)]">
              <div className="absolute inset-2 rounded-full border border-double border-[#D4AF37]/10"></div>
              <div className="text-center">
                <span className="block font-serif text-3xl tracking-[0.25em] text-[#D4AF37]">S & H</span>
                <span className="block font-sans text-[7px] tracking-[0.6em] uppercase text-[#6B635D] group-hover:text-white transition-colors mt-2">UNVEIL</span>
              </div>
            </button>
          </div>
          <div className="pb-8 font-serif text-[9px] tracking-[0.8em] text-[#D4AF37]/30">CINNAMON LAKESIDE • COLOMBO</div>
        </div>
      )}

      {/* SYSTEM MAIN APPS */}
      {appState === 'main' && (
        <div className="relative h-full flex flex-col justify-between p-6">
          <div 
            className="absolute inset-0 z-0 transition-transform duration-700 ease-out scale-110"
            style={{ transform: `scale(1.15) translate(${gyro.x}px, ${gyro.y}px)` }}
          >
            <img 
              src={activeTab === 'gallery' ? '/3.jpg' : activeTab === 'venue' || activeTab === 'timeline' ? '/2.jpg' : '/1.jpg'} 
              className="w-full h-full object-cover opacity-25"
              alt="Backdrop"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-transparent to-[#030303]"></div>
          </div>

          <header className="relative z-20 flex justify-between items-center px-2 pt-2">
            <div className="w-6"></div>
            <p className="font-serif text-[12px] tracking-[0.6em] text-[#D4AF37]">SACHITH & HIMASHI</p>
            <button onClick={toggleAudio} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0F0F0F] border border-[#D4AF37]/30 text-[#D4AF37]">
              <span>{audioPlaying ? '⏸' : '▶'}</span>
            </button>
          </header>

          <main className="relative z-20 flex-grow flex items-center justify-center py-4 overflow-hidden">
            {activeTab === 'cover' && (
              <div className="w-full text-center space-y-6 px-4 animate-fade-in">
                <p className="font-sans text-[9px] tracking-[0.5em] uppercase text-[#6B635D]">Together with their Families</p>
                <h1 className="font-serif text-5xl tracking-[0.15em] text-white font-light">SACHITH</h1>
                <p className="font-serif italic text-xl text-[#D4AF37]">&</p>
                <h1 className="font-serif text-5xl tracking-[0.15em] text-white font-light">HIMASHI</h1>
                <div className="w-16 h-[0.5px] bg-[#D4AF37]/40 mx-auto"></div>
                <p className="font-serif text-xs tracking-[0.3em] uppercase text-[#D4AF37] leading-relaxed">Request the honor of your presence<br />at their Wedding Celebration</p>
                <p className="font-sans text-[11px] tracking-[0.25em] text-stone-400">DECEMBER 11, 2026 • COLOMBO</p>
              </div>
            )}

            {activeTab === 'story' && (
              <div className="w-full max-w-sm px-4">
                <div className="bg-[#0F0F0F]/95 border border-[#D4AF37]/20 p-6 rounded-none shadow-2xl max-h-[55dvh] overflow-y-auto no-scrollbar space-y-4">
                  <h3 className="font-serif text-xs text-[#D4AF37] tracking-[0.4em] uppercase text-center mb-4">THE CHRONICLES OF US</h3>
                  <div className="space-y-4 font-sans text-xs text-stone-400 leading-relaxed text-center px-2">
                    <p className="italic font-serif text-sm text-white">"Two paths weaving into a single design."</p>
                    <p>From instant connection to deep partnership, our timeline has been a quiet, elegant unfolding of shared vision, humor, and respect.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'venue' && (
              <div className="w-full space-y-6 text-center px-6">
                <div className="bg-[#0F0F0F]/95 border border-[#D4AF37]/20 p-8 rounded-none shadow-2xl space-y-5 max-w-sm mx-auto">
                  <h3 className="font-serif text-xs tracking-[0.3em] uppercase text-[#D4AF37] mb-2">The Destination</h3>
                  <p className="font-sans text-xs tracking-widest text-white font-medium">CINNAMON LAKESIDE</p>
                  <p className="font-serif text-xs text-stone-400 italic mt-1">Sir Chittampalam A Gardiner Mawatha, Colombo</p>
                  <div className="w-8 h-[0.5px] bg-[#D4AF37]/20 mx-auto"></div>
                  <p className="font-sans text-xs tracking-widest text-stone-300">Formal Attire / Ceremonial Black Tie</p>
                  <a href="https://maps.google.com" target="_blank" className="block w-full py-3.5 bg-[#D4AF37] text-[#030303] text-[10px] tracking-[0.3em] uppercase font-bold transition text-center">LAUNCH DIRECTIONS</a>
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="w-full max-w-sm px-4">
                <div className="bg-[#0F0F0F]/95 border border-[#D4AF37]/20 p-6 rounded-none shadow-2xl max-h-[55dvh] overflow-y-auto no-scrollbar">
                  <h3 className="font-serif text-xs text-[#D4AF37] tracking-[0.3em] uppercase text-center mb-6">Auspicious Schedule</h3>
                  <div className="relative border-l border-[#D4AF37]/20 ml-3 space-y-6 text-left">
                    <div className="relative pl-6">
                      <div className="absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-none bg-[#D4AF37] rotate-45"></div>
                      <p className="font-sans text-[9px] tracking-widest uppercase text-[#D4AF37] font-medium">09:00 AM</p>
                      <p className="font-serif text-sm text-white tracking-wide">Arrival of Groom & Procession</p>
                    </div>
                    <div className="relative pl-6">
                      <div className="absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-none bg-[#D4AF37] rotate-45"></div>
                      <p className="font-sans text-[9px] tracking-widest uppercase text-[#D4AF37] font-medium">09:25 AM</p>
                      <p className="font-serif text-sm text-white tracking-wide">Sacred Poruwa Ceremony (Nekatha)</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="w-full px-2 text-center">
                <h3 className="font-serif text-xs text-[#D4AF37] tracking-[0.3em] uppercase mb-4">PORTRAIT REGISTRY</h3>
                <div className="flex space-x-4 overflow-x-auto no-scrollbar snap-x snap-mandatory py-2 px-4 max-w-full" onTouchStart={(e) => e.stopPropagation()} onTouchEnd={(e) => e.stopPropagation()}>
                  {Array.from({ length: 19 }, (_, i) => i + 1).map((num) => (
                    <div key={num} onClick={() => setActivePhoto(`/${num}.jpg`)} className="snap-center shrink-0 w-60 h-80 bg-stone-900 border border-[#D4AF37]/20 shadow-2xl overflow-hidden relative cursor-pointer transform active:scale-95 transition-transform duration-300">
                      <img src={`/${num}.jpg`} className="w-full h-full object-cover" loading="lazy" alt="Gallery Portrait" />
                      <div className="absolute bottom-2 right-3 text-[7px] font-sans text-[#D4AF37]/40" >NO. {num}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'rsvp' && (
              <div className="w-full max-w-xs px-4 text-center">
                <div className="bg-[#0F0F0F]/95 border border-[#D4AF37]/20 p-8 rounded-none shadow-2xl space-y-4">
                  {rsvpState === 'none' ? (
                    <>
                      <h3 className="font-serif text-xs text-[#D4AF37] tracking-[0.2em] uppercase">BALLROOM RSVP</h3>
                      <button onClick={() => setRsvpState('yes')} className="w-full py-3.5 bg-[#D4AF37] text-[#030303] text-[10px] tracking-widest uppercase font-bold">ACCEPT WITH PLEASURE</button>
                      <button onClick={() => setRsvpState('no')} className="w-full py-3.5 border border-stone-800 text-stone-400 text-[10px] tracking-widest uppercase bg-transparent">DECLINE WITH REGRET</button>
                    </>
                  ) : rsvpState === 'yes' ? (
                    <div className="py-4 space-y-2">
                      <span className="text-xl text-[#D4AF37] block">⚜️</span>
                      <h4 className="font-serif text-xs text-[#D4AF37] tracking-widest uppercase">ATTENDANCE LOCKED</h4>
                      <p className="font-sans text-xs text-stone-400 leading-relaxed pt-2">Your seat has been verified within our guest registry.</p>
                    </div>
                  ) : (
                    <div className="py-4 space-y-2">
                      <h4 className="font-serif text-xs text-[#6B635D] tracking-widest uppercase">REGRETS COMPLETED</h4>
                      <p className="font-sans text-xs text-stone-500 leading-relaxed pt-2">Your warm blessings have been logged into our network.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>

          {/* LIGHTBOX POPUP */}
          {activePhoto && (
            <div className="absolute inset-0 z-50 bg-[#030303]/95 flex flex-col justify-center items-center p-4" onClick={() => setActivePhoto(null)} onTouchStart={(e) => e.stopPropagation()}>
              <div className="relative max-w-full max-h-[85dvh] border border-[#D4AF37]/30 bg-[#0F0F0F] shadow-2xl overflow-hidden">
                <img src={activePhoto} className="max-w-full max-h-[85dvh] object-contain" alt="Enlarged View" />
              </div>
            </div>
          )}

          <nav className="relative z-30 w-full max-w-md mx-auto mb-2">
            <div className="bg-[#0F0F0F]/95 border border-[#D4AF37]/20 rounded-none p-1 shadow-2xl flex justify-between items-center text-center overflow-x-auto no-scrollbar">
              {tabSequence.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 px-1 min-w-[55px] ${activeTab === tab ? 'text-[#D4AF37] font-bold border-b-2 border-[#D4AF37]' : 'text-stone-600'}`}>
                  <span className="block font-sans text-[8px] tracking-wider uppercase">{tab === 'venue' ? 'destination' : tab === 'timeline' ? 'nekatha' : tab === 'gallery' ? 'shoot' : tab}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
