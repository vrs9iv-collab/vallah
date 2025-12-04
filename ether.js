// ether.js — Liquid Ether (Vanilla Canvas)
// تأثير سوائل متوهجة تتحرك بلطف خلف المحتوى (بدون React).

(() => {
  const canvas = document.getElementById('ether-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });

  // إعدادات قابلة للتعديل
  const CONFIG = {
    blobs: 6,             // عدد الفقاعات/السوائل
    baseRadius: 180,      // نصف قطر أساسي لكل فقاعة (سيلحقه تذبذب)
    jitter: 90,           // تذبذب الحجم
    speed: 0.15,          // سرعة الحركة العامة
    hueBase: 150,         // درجة اللون الأساسية (أخضر)
    hueSpread: 18,        // تنويع درجات الأخضر
    sat: 72,              // التشبع %
    light: 52,            // الإضاءة %
    alpha: 0.35,          // شفافية اللون لكل طبقة
    layers: 2,            // طبقات رسم لنفس الفقاعة لعمق أكبر
  };

  // دعم الشاشات العالية الدقة
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  let W = 0, H = 0, T = 0;

  // توليد فقاعات
  const blobs = Array.from({ length: CONFIG.blobs }).map((_, i) => ({
    // مواقع ابتدائية عشوائية
    x: Math.random(),
    y: Math.random(),
    // طور/زوايا للحركة
    ax: Math.random() * Math.PI * 2,
    ay: Math.random() * Math.PI * 2,
    // سرعات مختلفة قليلاً لكل فقاعة
    vx: (Math.random() * 0.6 + 0.4) * CONFIG.speed,
    vy: (Math.random() * 0.6 + 0.4) * CONFIG.speed,
    // إزاحة حجم فردية
    rShift: Math.random(),
    // لون لكل فقاعة ضمن نطاق أخضر
    hue: CONFIG.hueBase + (Math.random() * 2 - 1) * CONFIG.hueSpread,
  }));

  function resize() {
    const { clientWidth, clientHeight } = canvas;
    W = canvas.width = Math.max(1, (canvas.offsetWidth || clientWidth || window.innerWidth) * dpr);
    H = canvas.height = Math.max(1, (canvas.offsetHeight || clientHeight || window.innerHeight) * dpr);
  }

  // تدرّج شعاعي مع اندماج add
  function drawBlob(x, y, r, hue) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    // قلب اللون للأخضر بتدرّج ناعم نحو الشفافية
    const c1 = `hsla(${hue}, ${CONFIG.sat}%, ${CONFIG.light}%, ${CONFIG.alpha})`;
    const c2 = `hsla(${hue}, ${CONFIG.sat}%, ${CONFIG.light}%, 0)`;
    g.addColorStop(0.0, c1);
    g.addColorStop(1.0, c2);

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function tick(t) {
    T = t * 0.001; // ثوانٍ
    ctx.clearRect(0, 0, W, H);

    // خلفية سوداء خفيفة (للحالات اللي ما فيها خلفية صلبة)
    // يمكنك تعليق السطرين التاليين إن كنت تملك خلفية داكنة جاهزة في CSS.
    // ctx.fillStyle = '#0a0f0d';
    // ctx.fillRect(0, 0, W, H);

    ctx.globalCompositeOperation = 'lighter'; // مزج ضوئي جميل

    // مركز الحركة كنسبة من الشاشة
    const cx = W * 0.5;
    const cy = H * 0.5;
    const radiusTrack = Math.min(W, H) * 0.28;

    for (let i = 0; i < blobs.length; i++) {
      const b = blobs[i];

      // حراك ناعم باستخدام جيوب/جيوب تمام (بدون ضجيج خارجي)
      const ox = Math.cos(b.ax + T * b.vx) * (radiusTrack * (0.25 + (i / blobs.length) * 0.5));
      const oy = Math.sin(b.ay + T * b.vy) * (radiusTrack * (0.25 + (i / blobs.length) * 0.5));

      // موضع فعلي
      const x = cx + ox;
      const y = cy + oy;

      // تذبذب الحجم ببطء ليتنفس الشكل
      const r = (CONFIG.baseRadius + Math.sin(T * (0.7 + b.rShift)) * CONFIG.jitter) * dpr;

      // طبقات خفيفة لنفس الفقاعة لعمق إضافي
      for (let l = 0; l < CONFIG.layers; l++) {
        const rr = r * (1 - l * 0.18);
        drawBlob(x, y, rr, b.hue + l * 6);
      }
    }

    ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(tick);
  }

  // تحجيم تلقائي
  resize();
  requestAnimationFrame(tick);
  window.addEventListener('resize', resize, { passive: true });

  // تحسينات اختيارية:
  // إيقاف/تشغيل الحركة عند إخفاء/إظهار التبويب لتوفير طاقة
  let rafId = null;
  const _tick = (ts) => { rafId = requestAnimationFrame(_tick); tick(ts); };
  // لو تبغى استبدال requestAnimationFrame أعلاه بـ _tick، بدّل السطر:
  // requestAnimationFrame(tick);
  // إلى:
  // rafId = requestAnimationFrame(_tick);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (rafId) cancelAnimationFrame(rafId), rafId = null;
    } else {
      rafId = requestAnimationFrame(_tick);
    }
  });
})();
