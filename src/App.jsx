import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const heartEmojis = ['💕', '🌹', '💖', '✨', '🥀', '💗', '💝', '🌸'];

const FloatingHearts = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const newHearts = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
      left: Math.random() * 100 + 'vw',
      fontSize: (Math.random() * 1.2 + 0.8) + 'rem',
      animationDuration: (Math.random() * 8 + 8) + 's',
      animationDelay: (Math.random() * 8) + 's',
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="hearts-bg">
      {hearts.map(h => (
        <div
          key={h.id}
          className="heart-float"
          style={{
            left: h.left,
            fontSize: h.fontSize,
            animationDuration: h.animationDuration,
            animationDelay: h.animationDelay
          }}
        >
          {h.emoji}
        </div>
      ))}
    </div>
  );
};

const Confetti = () => {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    const colors = ['#ff4e7e','#f4c542','#fff','#c9184a','#ffd6e7','#ff8fab'];
    const newPieces = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + 'vw',
      background: colors[Math.floor(Math.random() * colors.length)],
      width: (Math.random() * 10 + 6) + 'px',
      height: (Math.random() * 10 + 6) + 'px',
      borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      animationDuration: (Math.random() * 2.5 + 2) + 's',
      animationDelay: (Math.random() * 0.5) + 's',
      delayToRemove: i * 30, // to mimic staggered creation
    }));
    
    // We can just render them all at once with animation delays
    setPieces(newPieces);
    
  }, []);

  return (
    <>
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            background: p.background,
            width: p.width,
            height: p.height,
            borderRadius: p.borderRadius,
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay
          }}
        />
      ))}
    </>
  );
};

const responsesData = {
  yes: {
    emoji: '🥺💖',
    heading: 'Thank You So Much! 💕',
    text: `I messed up... and I'm really sorry for that.\n\nI promise I'll be better for you.\n\nPlease forgive me... You mean so much to me.\n\nI'm really sorry, my love. I accidentally upset the most precious and adorable person in my life — you. 🥹\n\nPlease forgive me if I hurt you or wasted even a little of your precious time. I promise I didn't mean to. 🥺💕\n\nI love you so much my cutie ❤️`,
    themeClass: 'text-gold drop-shadow-[0_0_30px_rgba(244,197,66,0.6)]',
    cardTheme: 'border-rose/50 bg-rose/10',
    confetti: true
  },
  maybe: {
    emoji: '🌸💭',
    heading: 'Take All the Time You Need…',
    text: `And that's completely okay, beautiful. 🌸\n\nI'll be right here — patient, smiling, and absolutely not going anywhere.\n\nBecause you are worth every single second of waiting. No rush, no pressure.\n\nWhenever you're ready, this heart will be right here with your name already written on it. 💌`,
    themeClass: 'text-gold',
    cardTheme: 'border-gold/50 bg-gold/10',
    confetti: false
  },
  no: {
    emoji: '🥀💔',
    heading: 'It\'s Okay, I Understand…',
    text: `Ouch — but it's okay. 💔\n\nThe heart wants what it wants, and I respect yours more than anything.\n\nBut just know — the way you laugh, the way you exist in this world, is something genuinely magical.\n\nWhoever gets to call you theirs someday will be the luckiest person alive. I'll be rooting for your happiness — always. 🥀`,
    themeClass: 'text-rose',
    cardTheme: 'border-rose/50 bg-black/40',
    confetti: false
  }
};

const loadingMessages = [
  'Scanning the universe for someone this adorable…',
  'Found impossible levels of cuteness…',
  'Calibrating the heart-meter…',
  'Results are off the charts! 🚨',
  'Warning: Too much cute detected! 💥',
];

const bgImages = [
  '/IMG_9486.jpg',
  '/IMG_9524.JPG.jpeg',
  '/IMG_9525.JPG.jpeg',
  '/IMG_9526.JPG.jpeg',
  '/IMG_9528.JPG.jpeg'
];

export default function App() {
  const [stage, setStage] = useState('loading'); // loading, main, response
  const [responseType, setResponseType] = useState(null);
  const [bgIndex, setBgIndex] = useState(0);

  const [msgIdx, setMsgIdx] = useState(0);
  const [msgOpacity, setMsgOpacity] = useState(1);
  const [meterWidth, setMeterWidth] = useState(0);
  const [showPercent, setShowPercent] = useState(false);
  const [currentPercent, setCurrentPercent] = useState(1);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showEnterBtn, setShowEnterBtn] = useState(false);
  const [finalMsg, setFinalMsg] = useState(false);

  // For dodging "No" button
  const [isDodging, setIsDodging] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (stage !== 'loading') return;

    // Messages interval
    const msgInterval = setInterval(() => {
      setMsgOpacity(0);
      setTimeout(() => {
        setMsgIdx(prev => (prev + 1) % loadingMessages.length);
        setMsgOpacity(1);
      }, 300);
    }, 1800);

    // Initial load timings
    const initTimer = setTimeout(() => {
      setMeterWidth(100);
      setShowPercent(true); // Fade in the number container
      
      const duration = 3200; // time it takes to fill the bar
      const targetPercent = 175;
      const startTime = performance.now();

      const animatePercent = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing to make it slow down towards the end
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const nextValue = Math.max(1, Math.floor(easeOut * targetPercent));
        
        setCurrentPercent(nextValue);

        if (progress < 1) {
          requestAnimationFrame(animatePercent);
        } else {
          setCurrentPercent(targetPercent);
        }
      };
      requestAnimationFrame(animatePercent);

      const percentTimer = setTimeout(() => {
        setShowEmoji(true);
        clearInterval(msgInterval);
        setFinalMsg(true);

        const btnTimer = setTimeout(() => {
          setShowEnterBtn(true);
        }, 700);

        return () => clearTimeout(btnTimer);
      }, 3400);

      return () => clearTimeout(percentTimer);
    }, 600);

    return () => {
      clearInterval(msgInterval);
      clearTimeout(initTimer);
    };
  }, [stage]);

  useEffect(() => {
    if (stage !== 'main') return;
    const interval = setInterval(() => {
      setBgIndex(prev => (prev + 1) % bgImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [stage]);

  const handleResponse = (type) => {
    setResponseType(type);
    setStage('response');
  };

  const handleNoHover = () => {
    if (!isDodging) setIsDodging(true);
    const maxX = window.innerWidth - 120;
    const maxY = window.innerHeight - 60;
    setNoPos({
      x: Math.max(20, Math.random() * maxX),
      y: Math.max(20, Math.random() * maxY)
    });
  };

  return (
    <>
      <FloatingHearts />
      <AnimatePresence mode="wait">
        {stage === 'loading' && (
          <motion.div
            key="loading"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_40%_30%,#6b0f2a_0%,#2d0518_40%,#0e0208_100%)]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="font-vibes text-[clamp(2.8rem,8vw,5rem)] text-gold pulse-glow mb-8">
              For My Piu 💕
            </div>

            <div className="w-[min(380px,90vw)] text-center">
              <div className="font-lora italic text-[#f9d5e2] text-[1.1rem] mb-3 tracking-wide">
                ✨ Measuring your cuteness…
              </div>
              <div className="bg-white/10 border border-rose/30 rounded-full p-[5px] relative overflow-hidden">
                <div 
                  className="meter-bar h-[28px] rounded-full" 
                  style={{ width: `${meterWidth}%` }}
                />
              </div>
              
              <div 
                className="font-vibes text-[3.5rem] text-gold mt-4 drop-shadow-[0_0_20px_rgba(244,197,66,0.8)] transition-all duration-[800ms] ease-[cubic-bezier(.34,1.56,.64,1)]"
                style={{
                  opacity: showPercent ? 1 : 0,
                  transform: showPercent ? 'scale(1)' : 'scale(0.5)'
                }}
              >
                {currentPercent}%
              </div>
              
              <div 
                className={`text-4xl mt-2 ${showEmoji ? 'bounce-in' : 'opacity-0'}`}
              >
                🌹
              </div>
              
              <div 
                className="text-[#f9d5e2]/70 text-[0.85rem] mt-6 italic min-h-[1.2em] tracking-wide transition-opacity duration-500"
                style={{ 
                  opacity: finalMsg ? 1 : msgOpacity,
                  color: finalMsg ? '#f4c542' : undefined
                }}
              >
                {finalMsg ? "🎉 Official result: You're the cutest person alive!" : loadingMessages[msgIdx]}
              </div>
            </div>

            <button 
              className={`mt-10 px-11 py-[0.9rem] font-vibes text-[1.8rem] text-white bg-gradient-to-br from-rose to-deep-rose rounded-full cursor-pointer shadow-[0_8px_30px_rgba(255,78,126,0.5)] transition-all duration-300 hover:scale-[1.06] hover:shadow-[0_12px_40px_rgba(255,78,126,0.7)] ${showEnterBtn ? 'pop-in opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
              onClick={() => setStage('main')}
            >
              Open My Heart 💖
            </button>
          </motion.div>
        )}

        {stage === 'main' && (
          <motion.div
            key="main"
            className="fixed inset-0 z-40 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute inset-0 z-0 overflow-hidden bg-black">
              <AnimatePresence>
                <motion.div
                  key={bgIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="bg-photo"
                  style={{ backgroundImage: `url('${bgImages[bgIndex]}')` }}
                />
              </AnimatePresence>
            </div>
            <div className="bg-overlay" />

            <div className="relative z-10 text-center p-4 sm:p-8 max-w-[560px] w-full max-h-[100dvh] overflow-y-auto flex flex-col justify-center">
              <motion.div 
                className="font-vibes text-[clamp(2.5rem,8vw,5.5rem)] text-gold drop-shadow-[0_0_40px_rgba(244,197,66,0.5)] leading-tight mb-1 sm:mb-2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                Hey, Piu 🌹
              </motion.div>
              
              <motion.div 
                className="font-lora italic text-[#f9d5e2] text-[0.9rem] sm:text-[1.05rem] mb-4 sm:mb-10 tracking-wide"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                There's something I've been wanting to ask you…
              </motion.div>

              <motion.div 
                className="bg-white/5 backdrop-blur-md border border-rose/30 rounded-2xl p-5 sm:p-8 pb-6 sm:pb-10 mb-5 sm:mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <span className="text-3xl sm:text-4xl block mb-2 sm:mb-3">💌</span>
                <p className="font-lora text-[0.95rem] sm:text-[1.25rem] text-white leading-relaxed">
                  Meri aankhon ke samne tera chehra ho,<br/>
                  Tere chehre par mera pehra ho,<br/>
                  Tujhe mujhse ishq ho,<br/>
                  Khuda kare yeh ishq samandar se bhi gehra ho...<br/><br/>
                  <strong className="text-gold font-bold">I am sorry for everything wrong I've done, but my love for you remains forever. ❤️</strong>
                </p>
              </motion.div>

              <motion.div 
                className="flex flex-col gap-3 sm:gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.7 }}
              >
                <button 
                  className="choice-btn px-4 py-3 sm:px-6 sm:py-4 rounded-full font-quicksand text-[0.95rem] sm:text-base font-semibold tracking-wide bg-gradient-to-br from-rose to-deep-rose text-white shadow-[0_6px_25px_rgba(255,78,126,0.5)]"
                  onClick={() => handleResponse('yes')}
                >
                  💖 Yes! Of course I will!
                </button>
                <motion.button 
                  className="choice-btn px-4 py-3 sm:px-6 sm:py-4 rounded-full font-quicksand text-[0.95rem] sm:text-base font-semibold tracking-wide bg-gradient-to-br from-gold to-[#e07b00] text-[#1a0a0f] shadow-[0_6px_25px_rgba(244,197,66,0.4)]"
                  onMouseEnter={handleNoHover}
                  onClick={handleNoHover}
                  animate={isDodging ? { x: noPos.x, y: noPos.y } : {}}
                  style={isDodging ? { position: 'fixed', left: 0, top: 0, zIndex: 100 } : {}}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  No 🙈
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stage === 'response' && responseType && (
          <motion.div
            key="response"
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0a0208]/95 backdrop-blur-xl p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {responsesData[responseType].confetti && <Confetti />}
            
            <div className={`w-full max-w-[500px] bg-white/5 border border-rose/30 rounded-2xl py-8 sm:py-12 px-6 sm:px-10 text-center card-enter ${responsesData[responseType].cardTheme}`}>
              <span className="text-5xl sm:text-[4rem] mb-3 sm:mb-5 block">{responsesData[responseType].emoji}</span>
              <div className={`font-vibes text-[clamp(2rem,6vw,3.5rem)] mb-3 sm:mb-4 ${responsesData[responseType].themeClass}`}>
                {responsesData[responseType].heading}
              </div>
              <p className="font-lora italic text-[0.95rem] sm:text-[1.1rem] leading-relaxed text-[#f9d5e2] whitespace-pre-wrap">
                {responsesData[responseType].text}
              </p>
              <button 
                className="mt-6 sm:mt-8 px-6 sm:px-8 py-3 rounded-full bg-transparent border border-rose/50 text-[#f9d5e2] font-quicksand text-sm cursor-pointer transition-all hover:bg-rose/20"
                onClick={() => setStage('main')}
              >
                ← Go back
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
