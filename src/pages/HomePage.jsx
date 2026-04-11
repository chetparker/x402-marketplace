import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

// ─── Theme ───
const DARK = {
  bg: '#0C0B0F', surface: '#13121A', surface2: '#1A1922',
  border: 'rgba(245,240,232,0.06)', borderHover: 'rgba(245,240,232,0.12)',
  text: '#F5F0E8', muted: '#9B9590', dim: '#5C5856',
  accent: '#C45426', accentHover: '#D4622E',
  green: '#2D6B4A', greenLight: '#3D8B5F',
  gold: '#D4A94B', goldDim: 'rgba(212,169,75,0.15)',
  red: '#C44326',
  particleData: 'rgba(245,240,232,0.35)',
  particleGold: 'rgba(212,169,75,1)',
  particleGreen: 'rgba(45,107,74,0.6)',
  gateway: 'rgba(212,169,75,0.4)',
};

const LIGHT = {
  bg: '#FAFAF8', surface: '#FFFFFF', surface2: '#F5F3EF',
  border: 'rgba(12,11,15,0.08)', borderHover: 'rgba(12,11,15,0.15)',
  text: '#1A1A18', muted: '#6B6966', dim: '#9B9590',
  accent: '#C45426', accentHover: '#D4622E',
  green: '#2D6B4A', greenLight: '#3D8B5F',
  gold: '#B8922E', goldDim: 'rgba(184,146,46,0.1)',
  red: '#C44326',
  particleData: 'rgba(12,11,15,0.12)',
  particleGold: 'rgba(184,146,46,0.9)',
  particleGreen: 'rgba(45,107,74,0.5)',
  gateway: 'rgba(184,146,46,0.3)',
};

// ─── Particle Animation ───
function useParticleAnimation(canvasRef, theme) {
  const stateRef = useRef({ particles: [], coins: [], postParticles: [], frame: 0, mouseX: 0.5, mouseY: 0.5, W: 0, H: 0, gatewayX: 0 });
  const themeRef = useRef(theme);
  useEffect(() => { themeRef.current = theme; }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s = stateRef.current;
    let raf;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement.getBoundingClientRect();
      s.W = rect.width; s.H = rect.height;
      canvas.width = s.W * dpr; canvas.height = s.H * dpr;
      canvas.style.width = s.W + 'px'; canvas.style.height = s.H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      s.gatewayX = s.W * 0.52;
    }

    class DataParticle {
      constructor(scattered) {
        this.scattered = scattered;
        this.reset(true);
      }
      reset(init) {
        if (this.scattered) {
          this.x = Math.random() * s.W;
          this.y = Math.random() * s.H;
          this.angle = Math.random() * Math.PI * 2;
          this.orbitRadius = 30 + Math.random() * 80;
          this.orbitSpeed = (0.002 + Math.random() * 0.006) * (Math.random() < 0.5 ? 1 : -1);
          this.orbitCenterX = this.x;
          this.orbitCenterY = this.y;
          this.driftAngle = Math.random() * Math.PI * 2;
          this.driftAngleSpeed = (Math.random() - 0.5) * 0.005;
        } else {
          this.x = init ? Math.random() * s.W * 0.45 : -Math.random() * 100 - 20;
          this.y = s.H * 0.1 + Math.random() * s.H * 0.8;
          this.vx = 0.3 + Math.random() * 0.6;
          this.vy = (Math.random() - 0.5) * 0.8;
          this.curvature = (Math.random() - 0.5) * 0.02;
          this.wobblePhase = Math.random() * Math.PI * 2;
          this.wobbleFreq = 0.005 + Math.random() * 0.015;
        }
        this.size = 0.8 + Math.random() * 2;
        this.alpha = 0.06 + Math.random() * 0.2;
        this.baseAlpha = this.alpha;
        this.waiting = false;
        this.waitTimer = 0;
      }
      update() {
        const px = (s.mouseX - 0.5) * 12;
        const py = (s.mouseY - 0.5) * 8;
        if (this.scattered) {
          this.angle += this.orbitSpeed;
          this.driftAngle += this.driftAngleSpeed;
          this.orbitCenterX += Math.cos(this.driftAngle) * 0.15 + px * 0.003;
          this.orbitCenterY += Math.sin(this.driftAngle) * 0.15 + py * 0.003;
          this.x = this.orbitCenterX + Math.cos(this.angle) * this.orbitRadius;
          this.y = this.orbitCenterY + Math.sin(this.angle) * this.orbitRadius;
          if (this.orbitCenterX < -100) this.orbitCenterX = s.W + 50;
          if (this.orbitCenterX > s.W + 100) this.orbitCenterX = -50;
          if (this.orbitCenterY < -100) this.orbitCenterY = s.H + 50;
          if (this.orbitCenterY > s.H + 100) this.orbitCenterY = -50;
          const distToGateway = Math.abs(this.x - s.gatewayX);
          this.alpha = distToGateway < 60 ? this.baseAlpha * (0.5 + distToGateway / 120) : this.baseAlpha;
        } else {
          if (this.waiting) {
            this.waitTimer++;
            this.alpha *= 0.97;
            this.y += Math.sin(s.frame * 0.03 + this.wobblePhase) * 0.3;
            if (this.waitTimer > 80) { this.waiting = false; this.alpha = 0.02; this.vx = 0.1; }
            return;
          }
          this.vy += this.curvature;
          this.vy *= 0.995;
          this.x += this.vx + px * 0.005;
          this.y += this.vy + Math.sin(s.frame * this.wobbleFreq + this.wobblePhase) * 0.5 + py * 0.003;
          if (this.x > s.gatewayX - 30 && this.x < s.gatewayX && !this.waiting) {
            this.waiting = true; this.waitTimer = 0;
            if (Math.random() < 0.06) s.coins.push(new CoinParticle(this.x, this.y));
          }
          if (this.x > s.W + 60) this.reset(false);
          if (this.y < -50 || this.y > s.H + 50) this.reset(false);
        }
      }
      draw(ctx, t) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        const c = t === 'dark' ? '245,240,232' : '12,11,15';
        ctx.fillStyle = `rgba(${c},${this.alpha})`;
        ctx.fill();
      }
    }

    class CoinParticle {
      constructor(x, y) {
        this.x = x; this.y = y; this.startX = x; this.startY = y;
        this.targetX = s.gatewayX + 40 + Math.random() * 20;
        this.targetY = y + (Math.random() - 0.5) * 40;
        this.alpha = 0; this.size = 3; this.life = 0; this.maxLife = 100;
        this.crossed = false; this.trail = [];
        this.arcHeight = (Math.random() - 0.5) * 60;
      }
      update() {
        this.life++;
        const t = this.life / this.maxLife;
        if (t < 0.15) { this.alpha = t / 0.15; this.size = 3 + this.alpha * 2; }
        else if (t < 0.6) {
          const crossT = (t - 0.15) / 0.45;
          const ease = crossT < 0.5 ? 2 * crossT * crossT : 1 - Math.pow(-2 * crossT + 2, 2) / 2;
          this.x = this.startX + (this.targetX - this.startX) * ease;
          this.y = this.startY + (this.targetY - this.startY) * ease + Math.sin(crossT * Math.PI) * this.arcHeight;
          this.alpha = 1; this.size = 4 + Math.sin(this.life * 0.1) * 0.5;
          if (!this.crossed && this.x > s.gatewayX) {
            this.crossed = true;
            for (let i = 0; i < 8; i++) s.postParticles.push(new PostParticle(this.x, this.y));
          }
        } else { this.alpha *= 0.93; this.size *= 0.98; }
        this.trail.push({ x: this.x, y: this.y, a: this.alpha });
        if (this.trail.length > 16) this.trail.shift();
        return this.life < this.maxLife;
      }
      draw(ctx, th) {
        const gc = th === 'dark' ? '212,169,75' : '184,146,46';
        for (let i = 0; i < this.trail.length; i++) {
          const pt = this.trail[i]; const ratio = i / this.trail.length;
          ctx.beginPath(); ctx.arc(pt.x, pt.y, 1.5 * ratio, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${gc},${ratio * pt.a * 0.25})`; ctx.fill();
        }
        const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 4);
        grd.addColorStop(0, `rgba(${gc},${this.alpha * 0.6})`);
        grd.addColorStop(0.3, `rgba(${gc},${this.alpha * 0.15})`);
        grd.addColorStop(1, `rgba(${gc},0)`);
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd; ctx.fill();
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,235,180,${this.alpha})`; ctx.fill();
      }
    }

    class PostParticle {
      constructor(x, y) {
        this.x = x; this.y = y;
        const angle = (Math.random() - 0.5) * 1.2;
        const speed = 1.5 + Math.random() * 3;
        this.vx = Math.cos(angle) * speed + 1.5;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 0.4 + Math.random() * 0.4;
        this.size = 0.8 + Math.random() * 1.8;
        this.drag = 0.98 + Math.random() * 0.015;
        this.wobblePhase = Math.random() * Math.PI * 2;
      }
      update() {
        this.x += this.vx; this.y += this.vy + Math.sin(s.frame * 0.02 + this.wobblePhase) * 0.3;
        this.vx *= this.drag; this.vy *= this.drag; this.alpha *= 0.988;
        return this.alpha > 0.015 && this.x < s.W + 60;
      }
      draw(ctx) {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(45,107,74,${this.alpha})`; ctx.fill();
      }
    }

    function drawGateway() {
      const shimmer = Math.sin(s.frame * 0.015) * 0.08 + 0.2;
      const th = themeRef.current;
      const gc = th === 'dark' ? '212,169,75' : '184,146,46';
      ctx.save();
      ctx.beginPath(); ctx.moveTo(s.gatewayX, s.H * 0.05); ctx.lineTo(s.gatewayX, s.H * 0.95);
      ctx.strokeStyle = `rgba(${gc},${shimmer})`; ctx.lineWidth = 0.5;
      ctx.setLineDash([2, 10]); ctx.lineDashOffset = -s.frame * 0.3; ctx.stroke();
      ctx.setLineDash([]); ctx.restore();
      const grd = ctx.createLinearGradient(s.gatewayX - 40, 0, s.gatewayX + 40, 0);
      grd.addColorStop(0, `rgba(${gc},0)`);
      grd.addColorStop(0.5, `rgba(${gc},${shimmer * 0.15})`);
      grd.addColorStop(1, `rgba(${gc},0)`);
      ctx.fillStyle = grd; ctx.fillRect(s.gatewayX - 40, s.H * 0.05, 80, s.H * 0.9);
      ctx.font = '500 9px "DM Sans",system-ui';
      ctx.fillStyle = `rgba(${gc},${shimmer + 0.12})`; ctx.textAlign = 'center';
      ctx.fillText('402', s.gatewayX, s.H * 0.04);
    }

    function init() {
      resize();
      s.particles = [];
      const scatteredCount = Math.min(Math.floor(s.W * s.H / 6000), 100);
      for (let i = 0; i < scatteredCount; i++) s.particles.push(new DataParticle(true));
      const flowCount = Math.min(Math.floor(s.W * s.H / 8000), 60);
      for (let i = 0; i < flowCount; i++) { const p = new DataParticle(false); p.x = Math.random() * (s.gatewayX - 50); s.particles.push(p); }
    }

    function animate() {
      s.frame++;
      const th = themeRef.current;
      ctx.clearRect(0, 0, s.W, s.H);
      drawGateway();
      for (const p of s.particles) { p.update(); p.draw(ctx, th); }
      s.coins = s.coins.filter(c => { const alive = c.update(); if (alive) c.draw(ctx, th); return alive; });
      s.postParticles = s.postParticles.filter(p => { const alive = p.update(); if (alive) p.draw(ctx); return alive; });
      raf = requestAnimationFrame(animate);
    }

    const onMove = (e) => {
      const rect = canvas.parentElement.getBoundingClientRect();
      s.mouseX = (e.clientX - rect.left) / rect.width;
      s.mouseY = (e.clientY - rect.top) / rect.height;
    };
    const onResize = () => {
      resize();
      s.particles.forEach(p => { if (p.scattered) { p.orbitCenterX = Math.random() * s.W; p.orbitCenterY = Math.random() * s.H; } });
    };

    canvas.parentElement.addEventListener('mousemove', onMove);
    window.addEventListener('resize', onResize);
    init(); animate();

    return () => {
      cancelAnimationFrame(raf);
      canvas.parentElement?.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
    };
  }, [canvasRef]);
}

// ─── Scroll reveal hook ───
function useScrollReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ─── Animated counter hook ───
function useCounter(target, duration = 2000, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    let raf;
    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(target * ease));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return val;
}

// ─── CSS ───
const css = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

.hp { --serif: 'Instrument Serif', Georgia, serif; --sans: 'DM Sans', system-ui, sans-serif; font-family: var(--sans); transition: background 0.4s, color 0.4s; }

.hp a { color: inherit; text-decoration: none; }

.reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal.visible { opacity: 1; transform: translateY(0); }
.reveal-d1 { transition-delay: 0.1s; }
.reveal-d2 { transition-delay: 0.2s; }
.reveal-d3 { transition-delay: 0.3s; }

/* Nav */
.hp-nav { position: relative; z-index: 10; display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 2rem; }
.hp-logo { font-family: var(--sans); font-weight: 500; font-size: 15px; letter-spacing: -0.02em; }
.hp-logo-accent { color: var(--accent); }
.hp-nav-links { display: flex; gap: 1.75rem; align-items: center; }
.hp-nav-links a { font-size: 13px; color: var(--muted); transition: color 0.2s; }
.hp-nav-links a:hover { color: var(--text); }
.hp-nav-cta { font-size: 13px !important; color: var(--text) !important; background: rgba(196,84,38,0.12); border: 1px solid rgba(196,84,38,0.25); padding: 6px 16px; border-radius: 6px; transition: all 0.2s; }
.hp-nav-cta:hover { background: rgba(196,84,38,0.25) !important; border-color: rgba(196,84,38,0.4); }
.hp-theme-btn { background: none; border: 1px solid var(--border); width: 32px; height: 32px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--muted); transition: all 0.2s; }
.hp-theme-btn:hover { border-color: var(--borderHover); color: var(--text); }

/* Hero */
.hp-hero { position: relative; min-height: 100vh; min-height: 100dvh; display: flex; flex-direction: column; overflow: hidden; }
.hp-hero canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
.hp-hero-content { position: relative; z-index: 10; flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 0 2rem 4rem; max-width: 720px; margin: 0 auto; text-align: center; }
.hp-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--gold); background: var(--goldDim); border: 1px solid rgba(212,169,75,0.2); padding: 5px 14px; border-radius: 100px; margin: 0 auto 2rem; letter-spacing: 0.03em; text-transform: uppercase; font-weight: 500; }
.hp-badge-dot { width: 6px; height: 6px; background: var(--gold); border-radius: 50%; animation: pulseDot 2s ease-in-out infinite; }
@keyframes pulseDot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.7); } }
.hp-headline { font-family: var(--serif); font-size: clamp(2.5rem,6vw,4.2rem); color: var(--text); line-height: 1.1; margin-bottom: 1.5rem; font-weight: 400; }
.hp-headline em { font-style: italic; color: var(--accent); }
.hp-sub { font-size: clamp(1rem,2vw,1.15rem); color: var(--muted); line-height: 1.6; margin-bottom: 2.5rem; font-weight: 300; max-width: 540px; margin-left: auto; margin-right: auto; }
.hp-actions { display: flex; gap: 1rem; justify-content: center; align-items: center; flex-wrap: wrap; margin-bottom: 3.5rem; }
.btn-p { font-family: var(--sans); font-size: 15px; font-weight: 500; color: #fff; background: var(--accent); border: none; padding: 14px 32px; border-radius: 8px; cursor: pointer; transition: all 0.25s; letter-spacing: -0.01em; }
.btn-p:hover { background: var(--accentHover); transform: translateY(-1px); box-shadow: 0 8px 24px rgba(196,84,38,0.3); }
.btn-g { font-family: var(--sans); font-size: 14px; color: var(--muted); background: transparent; border: none; cursor: pointer; transition: color 0.2s; display: flex; align-items: center; gap: 6px; }
.btn-g:hover { color: var(--text); }
.btn-g:hover svg { transform: translateX(3px); }
.btn-g svg { transition: transform 0.2s; }
.hp-stats { display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap; }
.hp-stat-val { font-size: 20px; font-weight: 500; color: var(--text); letter-spacing: -0.02em; }
.hp-stat-label { font-size: 12px; color: var(--muted); margin-top: 2px; letter-spacing: 0.02em; }
.hp-stat-div { width: 1px; height: 32px; background: var(--border); align-self: center; }
.scroll-hint { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); z-index: 10; }
.scroll-line { width: 1px; height: 32px; background: linear-gradient(to bottom, var(--muted), transparent); animation: scrollFade 2s ease-in-out infinite; }
@keyframes scrollFade { 0%,100% { opacity:0.3; transform:scaleY(0.6); } 50% { opacity:0.8; transform:scaleY(1); } }

/* Sections */
.hp-section { padding: 6rem 2rem; }
.hp-inner { max-width: 900px; margin: 0 auto; }
.hp-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 500; margin-bottom: 1rem; }
.hp-title { font-family: var(--serif); font-size: clamp(1.8rem,4vw,2.8rem); color: var(--text); line-height: 1.15; margin-bottom: 1rem; font-weight: 400; }
.hp-title em { font-style: italic; color: var(--accent); }
.hp-subtitle { font-size: clamp(0.95rem,1.8vw,1.1rem); color: var(--muted); line-height: 1.6; margin-bottom: 3.5rem; max-width: 580px; font-weight: 300; }

/* Value Prop */
.vp-grid { display: grid; grid-template-columns: 1fr auto 1fr; margin-bottom: 3rem; }
.vp-card { background: var(--surface); border: 1px solid var(--border); padding: 2.5rem 2rem; display: flex; flex-direction: column; }
.vp-old { border-radius: 12px 0 0 12px; border-right: none; }
.vp-new { border-radius: 0 12px 12px 0; border-left: none; }
.vp-vs { display: flex; align-items: center; justify-content: center; z-index: 2; }
.vp-vs-c { width: 44px; height: 44px; border-radius: 50%; background: var(--bg); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 500; color: var(--dim); text-transform: uppercase; }
.vp-card-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--dim); margin-bottom: 1.5rem; font-weight: 500; }
.vp-card-price { font-family: var(--serif); font-size: clamp(2rem,5vw,3.2rem); color: var(--text); font-weight: 400; margin-bottom: 0.25rem; line-height: 1; }
.vp-old .vp-card-price { text-decoration: line-through; text-decoration-color: var(--red); text-decoration-thickness: 2px; }
.vp-new .vp-card-price { color: var(--greenLight); }
.vp-new .vp-card-label { color: var(--greenLight); }
.vp-card-period { font-size: 13px; color: var(--dim); margin-bottom: 2rem; }
.vp-features { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; margin-top: auto; }
.vp-features li { font-size: 13px; color: var(--muted); display: flex; align-items: flex-start; gap: 8px; line-height: 1.5; }
.vp-feat-icon { flex-shrink: 0; width: 16px; height: 16px; margin-top: 2px; }
.vp-old .vp-feat-icon { color: var(--red); opacity: 0.6; }
.vp-new .vp-feat-icon { color: var(--greenLight); }

.vp-breakeven { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 2rem 2.5rem; display: flex; align-items: center; gap: 2rem; margin-bottom: 3rem; }
.vp-be-track { height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; position: relative; }
.vp-be-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, var(--green), var(--greenLight)); width: 0%; transition: width 1.5s cubic-bezier(0.22,1,0.36,1); }
.vp-be-fill.active { width: 100%; }
.vp-be-number { font-family: var(--serif); font-size: clamp(1.5rem,3vw,2.2rem); color: var(--gold); font-weight: 400; line-height: 1; }

.vp-bottom { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: var(--border); border-radius: 12px; overflow: hidden; }
.vp-bottom-cell { background: var(--surface); padding: 1.75rem 1.5rem; text-align: center; }
.vp-bottom-val { font-family: var(--serif); font-size: clamp(1.4rem,3vw,2rem); color: var(--text); font-weight: 400; margin-bottom: 4px; }
.vp-bottom-desc { font-size: 12px; color: var(--dim); }

/* How it works */
.hw-steps { display: flex; flex-direction: column; position: relative; }
.hw-timeline { position: absolute; left: 23px; top: 48px; bottom: 48px; width: 1px; background: var(--border); }
.hw-tl-fill { width: 100%; height: 0%; background: linear-gradient(180deg, var(--accent), var(--gold), var(--green)); border-radius: 1px; transition: height 2s cubic-bezier(0.22,1,0.36,1); }
.hw-step { display: grid; grid-template-columns: 48px 1fr; gap: 1.5rem; padding: 1.5rem 0; }
.hw-num { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-family: var(--serif); font-size: 20px; font-weight: 400; position: relative; z-index: 2; }
.hw-step-content { padding: 0.5rem 0 2rem; border-bottom: 1px solid var(--border); }
.hw-step:last-child .hw-step-content { border-bottom: none; }
.hw-step-title { font-family: var(--serif); font-size: clamp(1.25rem,2.5vw,1.6rem); color: var(--text); font-weight: 400; margin-bottom: 0.5rem; }
.hw-step-desc { font-size: 14px; color: var(--muted); line-height: 1.65; margin-bottom: 1.25rem; max-width: 480px; font-weight: 300; }
.hw-tag { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; padding: 4px 10px; border-radius: 6px; font-weight: 500; }
.hw-cta { margin-top: 3rem; display: flex; align-items: center; gap: 1.5rem; padding-left: calc(48px + 1.5rem); }
.hw-time { font-size: 13px; color: var(--dim); font-style: italic; font-family: var(--serif); }

/* Profession grid */
.wf-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(200px,1fr)); gap: 1px; background: var(--border); border-radius: 12px; overflow: hidden; margin-bottom: 3rem; }
.wf-card { background: var(--surface); padding: 1.5rem; cursor: default; transition: background 0.3s; position: relative; overflow: hidden; }
.wf-card:hover { background: var(--surface2); }
.wf-card-title { font-size: 14px; font-weight: 500; color: var(--text); margin-bottom: 6px; }
.wf-card-data { font-size: 12px; color: var(--dim); line-height: 1.5; margin-bottom: 12px; }
.wf-card-earn { font-family: var(--serif); font-size: 18px; color: var(--greenLight); font-weight: 400; opacity: 0; transform: translateY(6px); transition: opacity 0.3s, transform 0.3s; }
.wf-card-earn-label { font-size: 10px; color: var(--dim); margin-top: 2px; opacity: 0; transition: opacity 0.3s 0.05s; }
.wf-card:hover .wf-card-earn, .wf-card:hover .wf-card-earn-label { opacity: 1; transform: translateY(0); }
.wf-card-line { position: absolute; bottom: 0; left: 0; width: 0; height: 2px; background: var(--green); transition: width 0.4s cubic-bezier(0.22,1,0.36,1); }
.wf-card:hover .wf-card-line { width: 100%; }
.wf-callout { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 2rem 2.5rem; display: flex; align-items: center; justify-content: space-between; gap: 2rem; flex-wrap: wrap; }
.wf-callout-text { font-family: var(--serif); font-size: clamp(1.1rem,2.2vw,1.4rem); color: var(--text); font-weight: 400; line-height: 1.4; }
.wf-callout-text em { font-style: italic; color: var(--gold); }

/* Social proof */
.sp-tags { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 2.5rem; }
.sp-tag { font-size: 12px; color: var(--muted); background: var(--surface); border: 1px solid var(--border); padding: 6px 14px; border-radius: 100px; }
.sp-built-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--dim); margin-bottom: 0.75rem; font-weight: 500; }
.sp-built-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 3rem; }
.sp-built-tag { font-size: 12px; color: var(--muted); background: rgba(45,107,74,0.06); border: 1px solid rgba(45,107,74,0.12); padding: 5px 12px; border-radius: 6px; }
.sp-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: var(--border); border-radius: 12px; overflow: hidden; }
.sp-stat-cell { background: var(--surface); padding: 1.75rem 1.5rem; text-align: center; }

/* Pricing */
.pr-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 3rem; }
.pr-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 2rem; display: flex; flex-direction: column; }
.pr-featured { border-color: rgba(212,169,75,0.25); position: relative; }
.pr-badge { position: absolute; top: -10px; left: 2rem; font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 500; background: var(--gold); color: #1a1a1a; padding: 3px 10px; border-radius: 4px; }
.pr-name { font-family: var(--serif); font-size: 1.4rem; color: var(--text); font-weight: 400; margin-bottom: 0.5rem; }
.pr-price { font-family: var(--serif); font-size: 2rem; color: var(--text); font-weight: 400; margin-bottom: 0.25rem; }
.pr-note { font-size: 12px; color: var(--dim); margin-bottom: 1.5rem; }
.pr-features { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 2rem; flex: 1; }
.pr-features li { font-size: 13px; color: var(--muted); display: flex; align-items: center; gap: 8px; }
.pr-check { width: 14px; height: 14px; flex-shrink: 0; color: var(--greenLight); }
.pr-featured .pr-check { color: var(--gold); }
.pr-btn { font-family: var(--sans); font-size: 14px; font-weight: 500; padding: 12px 0; border-radius: 8px; cursor: pointer; transition: all 0.25s; text-align: center; width: 100%; }
.pr-btn-free { color: var(--text); background: transparent; border: 1px solid var(--border); }
.pr-btn-free:hover { border-color: var(--borderHover); }
.pr-btn-go { color: #fff; background: var(--accent); border: none; }
.pr-btn-go:hover { background: var(--accentHover); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(196,84,38,0.25); }

/* Final CTA */
.fc-section { background: var(--surface); padding: 6rem 2rem; text-align: center; border-top: 1px solid var(--border); }
.fc-inner { max-width: 640px; margin: 0 auto; }
.fc-title { font-family: var(--serif); font-size: clamp(1.8rem,4.5vw,3rem); color: var(--text); line-height: 1.15; margin-bottom: 1rem; font-weight: 400; }
.fc-title em { font-style: italic; color: var(--accent); }
.fc-sub { font-size: clamp(0.95rem,1.8vw,1.1rem); color: var(--muted); line-height: 1.6; margin-bottom: 2.5rem; font-weight: 300; }
.fc-btn { font-family: var(--sans); font-size: 16px; font-weight: 500; color: #fff; background: var(--accent); border: none; padding: 16px 40px; border-radius: 8px; cursor: pointer; transition: all 0.25s; display: inline-block; margin-bottom: 1.5rem; }
.fc-btn:hover { background: var(--accentHover); transform: translateY(-2px); box-shadow: 0 10px 30px rgba(196,84,38,0.3); }
.fc-trust { font-size: 12px; color: var(--dim); line-height: 1.6; }

/* Mobile */
@media (max-width: 768px) {
  .hp-nav { padding: 1rem 1.25rem; }
  .hp-nav-links a:not(.hp-nav-cta) { display: none; }
  .hp-hero-content { padding: 0 1.25rem 3rem; }
  .hp-stats { gap: 1.25rem; }
  .hp-stat-div { height: 24px; }
  .hp-stat-val { font-size: 17px; }
  .hp-section { padding: 4rem 1.25rem; }
  .vp-grid { grid-template-columns: 1fr; }
  .vp-old { border-radius: 12px 12px 0 0; border-right: 1px solid var(--border); border-bottom: none; }
  .vp-new { border-radius: 0 0 12px 12px; border-left: 1px solid var(--border); border-top: none; }
  .vp-vs { height: 0; position: relative; }
  .vp-vs-c { position: absolute; top: -22px; }
  .vp-card { padding: 2rem 1.5rem; }
  .vp-breakeven { flex-direction: column; gap: 1.25rem; padding: 1.5rem; text-align: center; }
  .vp-bottom { grid-template-columns: 1fr; }
  .hw-step { grid-template-columns: 40px 1fr; gap: 1rem; }
  .hw-num { width: 40px; height: 40px; font-size: 17px; border-radius: 10px; }
  .hw-timeline { left: 19px; }
  .hw-cta { padding-left: calc(40px + 1rem); flex-direction: column; align-items: flex-start; }
  .wf-grid { grid-template-columns: 1fr 1fr; }
  .wf-card { padding: 1.25rem; }
  .wf-card-earn, .wf-card-earn-label { opacity: 1 !important; transform: none !important; }
  .wf-callout { flex-direction: column; text-align: center; padding: 1.5rem; }
  .sp-stats { grid-template-columns: 1fr; }
  .pr-cards { grid-template-columns: 1fr; }
  .fc-section { padding: 4rem 1.25rem; }
}

/* Mobile menu */
.hp-mobile-menu { display: none; background: none; border: 1px solid var(--border); width: 32px; height: 32px; border-radius: 8px; cursor: pointer; color: var(--muted); align-items: center; justify-content: center; }
@media (max-width: 768px) { .hp-mobile-menu { display: flex; } }
.hp-mobile-nav { position: fixed; inset: 0; z-index: 100; background: var(--bg); display: flex; flex-direction: column; padding: 1.25rem; }
.hp-mobile-nav a { font-size: 18px; color: var(--text); padding: 14px 0; border-bottom: 1px solid var(--border); }
`;

// ─── SVGs ───
const XIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const CheckIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ArrowIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const SunIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M8 2v1M8 13v1M2 8h1M13 8h1M3.8 3.8l.7.7M11.5 11.5l.7.7M12.2 3.8l-.7.7M4.5 11.5l-.7.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const MoonIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.5 8.5a5.5 5.5 0 01-6-6 5.5 5.5 0 106 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ClockIcon = () => <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const MenuIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;

// ─── Profession data ───
const PROFESSIONS = [
  { title: 'Mortgage brokers', data: 'Affordability calculators, rate comparisons, property valuations', earn: '$1,000-3,000/mo' },
  { title: 'Recruiters', data: 'Candidate matching, salary benchmarks, job market data', earn: '$750-2,250/mo' },
  { title: 'Accountants', data: 'Tax calculations, HMRC rules, company filings, MTD compliance', earn: '$1,500-4,500/mo' },
  { title: 'Estate agents', data: 'Property comparables, local market data, planning permissions', earn: '$625-1,875/mo' },
  { title: 'Solicitors', data: 'Land Registry checks, company searches, AML screening', earn: '$1,250-3,750/mo' },
  { title: 'Logistics managers', data: 'Route optimisation, customs codes, shipping rates', earn: '$875-2,625/mo' },
  { title: 'Compliance officers', data: 'FCA regulations, sanctions checks, PEP screening', earn: '$1,875-5,625/mo' },
  { title: 'Insurance underwriters', data: 'Risk scoring, flood data, claims history, actuarial tables', earn: '$1,125-3,375/mo' },
  { title: 'Pharmacists', data: 'Drug interactions, BNF data, dosage calculators', earn: '$750-2,250/mo' },
  { title: 'Quantity surveyors', data: 'Material costs, BOQ generation, construction benchmarks', earn: '$1,000-3,000/mo' },
];

// ─── Component ───
export default function HomePage() {
  const [theme, setTheme] = useState('dark');
  const [mobileNav, setMobileNav] = useState(false);
  const canvasRef = useRef(null);
  const t = theme === 'dark' ? DARK : LIGHT;

  useParticleAnimation(canvasRef, theme);

  // Scroll reveal refs
  const [vpRef, vpVis] = useScrollReveal(0.2);
  const [beRef, beVis] = useScrollReveal(0.4);
  const [hwRef, hwVis] = useScrollReveal(0.15);
  const [wfRef, wfVis] = useScrollReveal(0.15);
  const [spRef, spVis] = useScrollReveal(0.2);
  const [prRef, prVis] = useScrollReveal(0.2);
  const [fcRef, fcVis] = useScrollReveal(0.3);

  const beCount = useCounter(7500000, 2000, beVis);
  const [hwStepsVisible, setHwStepsVisible] = useState(0);
  useEffect(() => {
    if (hwVis && hwStepsVisible < 3) {
      const id = setTimeout(() => setHwStepsVisible(p => Math.min(p + 1, 3)), hwStepsVisible * 200);
      return () => clearTimeout(id);
    }
  }, [hwVis, hwStepsVisible]);

  const themeVars = {};
  for (const [k, v] of Object.entries(t)) themeVars[`--${k}`] = v;

  return (
    <div className="hp" style={{ ...themeVars, background: t.bg, color: t.text }}>
      <SEOHead page="home" />
      <style>{css}</style>

      {/* ─── HERO ─── */}
      <section className="hp-hero">
        <canvas ref={canvasRef} />

        <nav className="hp-nav">
          <Link to="/" className="hp-logo">pay<span className="hp-logo-accent">api</span> market</Link>
          <div className="hp-nav-links">
            <Link to="/marketplace">Marketplace</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/agents">Agents</Link>
            <Link to="/about">About</Link>
            <button className="hp-theme-btn" onClick={() => setTheme(th => th === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            <Link to="/list" className="hp-nav-cta">List your API</Link>
            <button className="hp-mobile-menu" onClick={() => setMobileNav(true)}><MenuIcon /></button>
          </div>
        </nav>

        {mobileNav && (
          <div className="hp-mobile-nav" style={themeVars}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <span className="hp-logo">pay<span className="hp-logo-accent">api</span> market</span>
              <button className="hp-theme-btn" onClick={() => setMobileNav(false)} style={{ fontSize: 18 }}>×</button>
            </div>
            <Link to="/marketplace" onClick={() => setMobileNav(false)}>Marketplace</Link>
            <Link to="/pricing" onClick={() => setMobileNav(false)}>Pricing</Link>
            <Link to="/agents" onClick={() => setMobileNav(false)}>Agents</Link>
            <Link to="/about" onClick={() => setMobileNav(false)}>About</Link>
            <Link to="/list" onClick={() => setMobileNav(false)}>List your API</Link>
            <div style={{ marginTop: '1rem' }}>
              <button className="hp-theme-btn" onClick={() => setTheme(th => th === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </button>
            </div>
          </div>
        )}

        <div className="hp-hero-content">
          <div className="hp-badge"><span className="hp-badge-dot" /> x402 protocol — backed by Coinbase, Cloudflare</div>
          <h1 className="hp-headline">Your expertise.<br /><em>Earning while you sleep.</em><br />Paid by AI agents.</h1>
          <p className="hp-sub">List your API on PayAPI Market. AI agents discover it via MCP, pay per request in USDC, and you keep 97%. No subscriptions. No support tickets. No code required.</p>
          <div className="hp-actions">
            <Link to="/list"><button className="btn-p">List your API — free</button></Link>
            <Link to="/marketplace" className="btn-g">Explore the marketplace <ArrowIcon /></Link>
          </div>
          <div className="hp-stats">
            <div style={{ textAlign: 'center' }}><div className="hp-stat-val">10</div><div className="hp-stat-label">Live APIs</div></div>
            <div className="hp-stat-div" />
            <div style={{ textAlign: 'center' }}><div className="hp-stat-val">65</div><div className="hp-stat-label">Endpoints</div></div>
            <div className="hp-stat-div" />
            <div style={{ textAlign: 'center' }}><div className="hp-stat-val">$3K+</div><div className="hp-stat-label">Monthly revenue</div></div>
            <div className="hp-stat-div" />
            <div style={{ textAlign: 'center' }}><div className="hp-stat-val">97%</div><div className="hp-stat-label">Kept by providers</div></div>
          </div>
        </div>
        <div className="scroll-hint"><div className="scroll-line" /></div>
      </section>

      {/* ─── VALUE PROP ─── */}
      <section className="hp-section" style={{ borderTop: `1px solid ${t.border}` }}>
        <div className="hp-inner">
          <div ref={vpRef} className={`reveal ${vpVis ? 'visible' : ''}`}>
            <div className="hp-label" style={{ color: t.accent }}>Why PayAPI</div>
            <h2 className="hp-title">Enterprise data providers<br />charge you for the privilege.</h2>
            <p className="hp-subtitle">Subscriptions, seat licences, annual contracts. Your agents don't need any of that. They need data, and they need to pay for exactly what they use.</p>
          </div>

          <div className={`vp-grid reveal ${vpVis ? 'visible' : ''} reveal-d1`}>
            <div className="vp-card vp-old">
              <div className="vp-card-label">Enterprise data provider</div>
              <div className="vp-card-price">$15,000</div>
              <div className="vp-card-period">per year, minimum commitment</div>
              <ul className="vp-features">
                <li><span className="vp-feat-icon"><XIcon /></span>Annual contract, locked in</li>
                <li><span className="vp-feat-icon"><XIcon /></span>Human signup, credit card, sales call</li>
                <li><span className="vp-feat-icon"><XIcon /></span>AI agents can't sign contracts</li>
                <li><span className="vp-feat-icon"><XIcon /></span>Pay the same whether you use it or not</li>
              </ul>
            </div>
            <div className="vp-vs"><div className="vp-vs-c">vs</div></div>
            <div className="vp-card vp-new">
              <div className="vp-card-label">PayAPI Market</div>
              <div className="vp-card-price">$0.002</div>
              <div className="vp-card-period">per request, no commitment</div>
              <ul className="vp-features">
                <li><span className="vp-feat-icon"><CheckIcon /></span>No contract, no minimum spend</li>
                <li><span className="vp-feat-icon"><CheckIcon /></span>Agents discover and pay autonomously</li>
                <li><span className="vp-feat-icon"><CheckIcon /></span>USDC on Base, sub-second settlement</li>
                <li><span className="vp-feat-icon"><CheckIcon /></span>Pay only for what you use</li>
              </ul>
            </div>
          </div>

          <div ref={beRef} className={`vp-breakeven reveal ${beVis ? 'visible' : ''} reveal-d2`}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: t.dim, marginBottom: '0.75rem' }}>Requests before you break even on the enterprise plan</div>
              <div className="vp-be-track">
                <div className={`vp-be-fill ${beVis ? 'active' : ''}`} />
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div className="vp-be-number">{beCount.toLocaleString('en-GB')}</div>
              <div style={{ fontSize: 12, color: t.dim, marginTop: 4 }}>requests to break even</div>
            </div>
          </div>

          <div className={`vp-bottom reveal ${beVis ? 'visible' : ''} reveal-d3`}>
            <div className="vp-bottom-cell"><div className="vp-bottom-val">&lt;$0.001</div><div className="vp-bottom-desc">Transaction fee on Base</div></div>
            <div className="vp-bottom-cell"><div className="vp-bottom-val">~400ms</div><div className="vp-bottom-desc">Settlement finality</div></div>
            <div className="vp-bottom-cell"><div className="vp-bottom-val">0</div><div className="vp-bottom-desc">Support tickets needed</div></div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="hp-section" style={{ borderTop: `1px solid ${t.border}` }}>
        <div className="hp-inner">
          <div ref={hwRef} className={`reveal ${hwVis ? 'visible' : ''}`}>
            <div className="hp-label" style={{ color: t.green }}>How it works</div>
            <h2 className="hp-title">Three steps. Five minutes.<br />Then your API earns for you.</h2>
            <p className="hp-subtitle">You don't need to be a developer. You need domain expertise worth paying for.</p>
          </div>

          <div className="hw-steps">
            <div className="hw-timeline"><div className="hw-tl-fill" style={{ height: hwVis ? `${(hwStepsVisible / 3) * 100}%` : '0%' }} /></div>

            {[
              { num: '1', title: 'List your API', desc: 'Add your endpoint URL, set a price per request (from $0.001), write a description. We handle the x402 payment layer and MCP registration. Your API is live in the marketplace within minutes.', tag: '5 minutes', tagIcon: <ClockIcon />, color: t.accent, colorBg: 'rgba(196,84,38,0.12)', colorBorder: 'rgba(196,84,38,0.2)', tagBg: 'rgba(196,84,38,0.08)', tagBorder: 'rgba(196,84,38,0.15)' },
              { num: '2', title: 'AI agents discover you', desc: "Your API appears in the Model Context Protocol registry. Claude Desktop, Cursor, LangChain agents, and any MCP-compatible client can find and connect to your tools automatically.", tag: 'Automatic via MCP', tagIcon: null, color: t.gold, colorBg: 'rgba(212,169,75,0.1)', colorBorder: 'rgba(212,169,75,0.18)', tagBg: 'rgba(212,169,75,0.06)', tagBorder: 'rgba(212,169,75,0.12)' },
              { num: '3', title: 'Agents pay, you keep 97%', desc: 'Every request triggers an x402 micropayment. USDC settles on Base in under a second. You keep 97% of every payment. No invoicing, no chasing, no support needed.', tag: 'USDC on Base', tagIcon: <CheckIcon />, color: t.greenLight, colorBg: 'rgba(45,107,74,0.12)', colorBorder: 'rgba(45,107,74,0.2)', tagBg: 'rgba(45,107,74,0.08)', tagBorder: 'rgba(45,107,74,0.15)' },
            ].map((step, i) => (
              <div key={i} className={`hw-step reveal ${hwStepsVisible > i ? 'visible' : ''}`} style={{ transitionDelay: `${i * 0.15}s` }}>
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 2 }}>
                  <div className="hw-num" style={{ background: step.colorBg, color: step.color, border: `1px solid ${step.colorBorder}` }}>{step.num}</div>
                </div>
                <div className="hw-step-content">
                  <div className="hw-step-title">{step.title}</div>
                  <div className="hw-step-desc">{step.desc}</div>
                  <span className="hw-tag" style={{ background: step.tagBg, color: step.color, border: `1px solid ${step.tagBorder}` }}>
                    {step.tagIcon} {step.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="hw-cta">
            <Link to="/list"><button className="btn-p" style={{ fontSize: 14, padding: '12px 28px' }}>List your API — free</button></Link>
            <span className="hw-time">Takes about 5 minutes</span>
          </div>
        </div>
      </section>

      {/* ─── WHO IS THIS FOR ─── */}
      <section className="hp-section" style={{ borderTop: `1px solid ${t.border}` }}>
        <div className="hp-inner" style={{ maxWidth: 960 }}>
          <div ref={wfRef} className={`reveal ${wfVis ? 'visible' : ''}`}>
            <div className="hp-label" style={{ color: t.gold }}>Who is this for</div>
            <h2 className="hp-title">You don't need to be a developer.<br />You need <em>domain expertise.</em></h2>
            <p className="hp-subtitle">If you have specialist knowledge that people pay for today, AI agents will pay for it tomorrow.</p>
          </div>

          <div className={`wf-grid reveal ${wfVis ? 'visible' : ''} reveal-d1`}>
            {PROFESSIONS.map((p, i) => (
              <div key={i} className="wf-card">
                <div className="wf-card-title">{p.title}</div>
                <div className="wf-card-data">{p.data}</div>
                <div className="wf-card-earn">{p.earn}</div>
                <div className="wf-card-earn-label">estimated earnings</div>
                <div className="wf-card-line" />
              </div>
            ))}
          </div>

          <div className={`wf-callout reveal ${wfVis ? 'visible' : ''} reveal-d2`}>
            <div className="wf-callout-text">Be one of the first 10 providers.<br /><em>Early movers set the market rate.</em></div>
            <Link to="/list"><button className="btn-p" style={{ fontSize: 14, padding: '12px 24px' }}>List your API — free</button></Link>
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF ─── */}
      <section className="hp-section" style={{ borderTop: `1px solid ${t.border}` }}>
        <div className="hp-inner">
          <div ref={spRef} className={`reveal ${spVis ? 'visible' : ''}`}>
            <div className="hp-label" style={{ color: t.dim }}>Trusted by the ecosystem</div>
            <h2 className="hp-title">Listed where agents look.</h2>
          </div>

          <div className={`sp-tags reveal ${spVis ? 'visible' : ''} reveal-d1`}>
            {['Official MCP Registry', 'PulseMCP', 'mcp.so', 'Smithery', 'Glama', 'x402 ecosystem'].map(n => <span key={n} className="sp-tag">{n}</span>)}
          </div>

          <div className={`reveal ${spVis ? 'visible' : ''} reveal-d1`} style={{ marginBottom: '3rem' }}>
            <div className="sp-built-label">Built for</div>
            <div className="sp-built-tags">
              {['Claude Desktop', 'Cursor', 'Continue', 'LangChain', 'AutoGen / CrewAI'].map(n => <span key={n} className="sp-built-tag">{n}</span>)}
            </div>
          </div>

          <div className={`sp-stats reveal ${spVis ? 'visible' : ''} reveal-d2`}>
            <div className="sp-stat-cell"><div className="vp-bottom-val">72,400+</div><div className="vp-bottom-desc">Requests processed</div></div>
            <div className="sp-stat-cell"><div className="vp-bottom-val">$3K+</div><div className="vp-bottom-desc">Monthly revenue</div></div>
            <div className="sp-stat-cell"><div className="vp-bottom-val">0</div><div className="vp-bottom-desc">Support tickets</div></div>
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section className="hp-section" style={{ borderTop: `1px solid ${t.border}` }}>
        <div className="hp-inner">
          <div ref={prRef} className={`reveal ${prVis ? 'visible' : ''}`}>
            <div className="hp-label" style={{ color: t.accent }}>Pricing</div>
            <h2 className="hp-title">List free. Upgrade when you're ready.</h2>
          </div>

          <div className={`pr-cards reveal ${prVis ? 'visible' : ''} reveal-d1`}>
            <div className="pr-card">
              <div className="pr-name">Free</div>
              <div className="pr-price">$0</div>
              <div className="pr-note">3% platform fee per request</div>
              <ul className="pr-features">
                {['MCP registry listing', 'x402 payment layer included', 'Dashboard and analytics', 'USDC settlement on Base'].map(f => (
                  <li key={f}><span className="pr-check"><CheckIcon /></span>{f}</li>
                ))}
              </ul>
              <Link to="/list"><button className="pr-btn pr-btn-free">Get started free</button></Link>
            </div>
            <div className="pr-card pr-featured">
              <div className="pr-badge">Recommended</div>
              <div className="pr-name">Featured</div>
              <div className="pr-price">$49/mo</div>
              <div className="pr-note">2% platform fee per request</div>
              <ul className="pr-features">
                {['Everything in Free', 'Featured placement in marketplace', 'Gold border and verified badge', 'Lower 2% fee (keep 98%)', 'Priority in agent discovery'].map(f => (
                  <li key={f}><span className="pr-check"><CheckIcon /></span>{f}</li>
                ))}
              </ul>
              <Link to="/list?tier=featured"><button className="pr-btn pr-btn-go">Go featured — $49/mo</button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="fc-section" ref={fcRef}>
        <div className={`fc-inner reveal ${fcVis ? 'visible' : ''}`}>
          <h2 className="fc-title">The agent economy is here.<br /><em>Your knowledge should be earning.</em></h2>
          <p className="fc-sub">10 APIs earning $3,000+ a month with zero hours of customer support. Yours could be next.</p>
          <Link to="/list"><button className="fc-btn">List your API — free</button></Link>
          <div className="fc-trust">Free to list. Live in 5 minutes. USDC on Base. x402 protocol.<br />Built using Claude. Backed by the ecosystem.</div>
        </div>
      </section>
    </div>
  );
}
