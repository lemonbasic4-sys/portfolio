const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");
let w, h, dpr, points = [], mx = 0, my = 0, targetX = 0, targetY = 0;

function resize() {
  dpr = Math.min(devicePixelRatio || 1, 2); w = innerWidth; h = innerHeight;
  canvas.width = w * dpr; canvas.height = h * dpr; canvas.style.width = w + "px"; canvas.style.height = h + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  points = Array.from({ length: Math.min(85, Math.floor(w / 13)) }, () => ({
    x: Math.random() * w, y: Math.random() * h, z: .3 + Math.random() * .7,
    r: .5 + Math.random() * 1.6, dx: (Math.random() - .5) * .38, dy: (Math.random() - .5) * .38
  }));
}
function draw() {
  ctx.clearRect(0, 0, w, h);
  mx += (targetX - mx) * .09; my += (targetY - my) * .09;
  const glow = ctx.createRadialGradient(w * .72 + mx * .07, h * .38 + my * .07, 0, w * .72 + mx * .07, h * .38 + my * .07, Math.min(w, h) * .55);
  glow.addColorStop(0, "rgba(183,255,60,.08)"); glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h);
  for (const p of points) {
    p.x += p.dx; p.y += p.dy; if (p.x < 0) p.x = w; if (p.x > w) p.x = 0; if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
    const x = p.x + mx * .055 * p.z, y = p.y + my * .055 * p.z;
    ctx.beginPath(); ctx.arc(x, y, p.r * p.z, 0, Math.PI * 2); ctx.fillStyle = `rgba(220,235,220,${.12 + p.z * .22})`; ctx.fill();
  }
  requestAnimationFrame(draw);
}
addEventListener("resize", resize);
addEventListener("pointermove", e => { targetX = (e.clientX - w / 2); targetY = (e.clientY - h / 2) });
addEventListener("touchmove", e => { const t = e.touches[0]; targetX = (t.clientX - w / 2); targetY = (t.clientY - h / 2); }, { passive: true });
addEventListener("touchstart", e => { const t = e.touches[0]; targetX = (t.clientX - w / 2); targetY = (t.clientY - h / 2); }, { passive: true });
resize(); draw();

const menu = document.getElementById("menu"), nav = document.getElementById("nav");
menu.addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
document.getElementById("year").textContent = new Date().getFullYear();

// ─── PROJECT DETAILS MODAL ───────────────────────────────────────────────────

const projectData = {
  1: {
    eyebrow: 'HRIS / CAPSTONE PROJECT',
    title: 'Raquel Pawnshop HR Workforce Analytics & Evaluation Platform',
    desc: 'A centralized workforce and human resource information system designed to streamline employee records, performance evaluations, career progression, analytics, reporting, role-based access, and audit trails for Raquel Pawnshop.',
    slides: [
      { src: 'assets/xplit-formal-1mb.jpeg', label: 'xplit-formal-1mb.jpeg' },
      { label: 'Analytics Report · Coming Soon' },
      { label: 'Employee Management · Coming Soon' },
    ]
  },
  2: {
    eyebrow: 'CLIENT SYSTEM / INCUBATION PROJECT',
    title: 'Gym Management & Analytics System',
    desc: 'A responsive gym management system featuring RFID-based check-ins, automated membership tracking, and analytics for monitoring attendance, sales, and member activity.',
    slides: [
      { label: 'Member Dashboard · Coming Soon' },
      { label: 'Attendance Analytics · Coming Soon' },
    ]
  },
  3: {
    eyebrow: 'N8N-AI AUTOMATION / PROJECT',
    title: 'COFR: Facebook Automation Suite',
    desc: 'A web-based outreach platform featuring automated Facebook scheduling, inbox handling, engagement workflows, and exportable performance reports.',
    slides: [
      { label: 'Automation Flow · Coming Soon' },
      { label: 'Reports Dashboard · Coming Soon' },
    ]
  },
  4: {
    eyebrow: 'STATIC WEBSITE',
    title: 'Alther.Things Handcrafted Creations',
    desc: 'A responsive static storefront website for a handcrafted floral and crochet brand. Features product collections, custom-order info, customer reviews, FAQs, and social contact channels.',
    slides: [
      { label: 'Homepage · Coming Soon' },
      { label: 'Products Page · Coming Soon' },
    ]
  },
  5: {
    eyebrow: 'GAME DEVELOPMENT PROJECT',
    title: 'Arcade Hub',
    desc: 'A GameMaker launcher that brings multiple arcade games together in one interactive interface, allowing players to select and launch different games from a single menu.',
    slides: [
      { label: 'Launcher Screen · Coming Soon' },
      { label: 'Game Select · Coming Soon' },
    ]
  }
};

// DOM refs
const modal = document.getElementById('projectModal');
const modalClose = document.getElementById('modalClose');
const modalEyebrow = document.getElementById('modalEyebrow');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const carTrack = document.getElementById('carouselTrack');
const carPrev = document.getElementById('carouselPrev');
const carNext = document.getElementById('carouselNext');
const carDots = document.getElementById('carouselDots');

let currentSlide = 0;
let totalSlides = 0;

function buildCarousel(slides) {
  carTrack.innerHTML = '';
  carDots.innerHTML = '';
  totalSlides = slides.length;
  currentSlide = 0;

  slides.forEach((s, idx) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    if (s.src) {
      const img = document.createElement('img');
      img.src = s.src;
      img.alt = s.label || `Screenshot ${idx + 1}`;
      slide.appendChild(img);
    } else {
      slide.innerHTML = `
        <span class="slide-icon">${s.icon || '🖼️'}</span>
        <span class="slide-label">${s.label || 'Screenshot coming soon'}</span>
        <span style="font-size:.65rem;opacity:.45">Add your screenshot to bring this to life</span>`;
    }
    carTrack.appendChild(slide);

    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (idx === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
    dot.addEventListener('click', () => goTo(idx));
    carDots.appendChild(dot);
  });

  const multi = totalSlides > 1;
  carPrev.style.display = multi ? 'flex' : 'none';
  carNext.style.display = multi ? 'flex' : 'none';
  carDots.style.display = multi ? 'flex' : 'none';
  goTo(0);
}

function goTo(idx) {
  currentSlide = (idx + totalSlides) % totalSlides;
  carTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  carDots.querySelectorAll('.carousel-dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
  });
}

function openModal(id) {
  const data = projectData[id];
  if (!data) return;
  modalEyebrow.textContent = data.eyebrow;
  modalTitle.textContent = data.title;
  modalDesc.textContent = data.desc;
  buildCarousel(data.slides);
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Wire up buttons
document.querySelectorAll('.details-btn').forEach(btn => {
  btn.addEventListener('click', () => openModal(Number(btn.dataset.project)));
});

// Close controls
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

// Carousel arrows
carPrev.addEventListener('click', () => goTo(currentSlide - 1));
carNext.addEventListener('click', () => goTo(currentSlide + 1));

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (!modal.classList.contains('active')) return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowLeft') goTo(currentSlide - 1);
  if (e.key === 'ArrowRight') goTo(currentSlide + 1);
});

// Touch swipe on carousel
let swipeX = 0;
carTrack.addEventListener('touchstart', e => { swipeX = e.touches[0].clientX; }, { passive: true });
carTrack.addEventListener('touchend', e => {
  const diff = swipeX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) goTo(currentSlide + (diff > 0 ? 1 : -1));
}, { passive: true });
