import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBkO4WtYaHvHpVhmuLnA_DxoO7TegwIJ04",
  authDomain: "v90games.firebaseapp.com",
  projectId: "v90games",
  storageBucket: "v90games.firebasestorage.app",
  messagingSenderId: "233370041321",
  appId: "1:233370041321:web:abd032f0aa47a8504aa978",
  measurementId: "G-QKKN1VX9T1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// قائمة الألعاب الثابتة
const games = [
  {
    title: "Among Us Online",
    description: "اللعب الجماعي الممتع — اكتشف المحتال قبل فوات الأوان!",
    url: "https://now.gg/apps/innersloth-llc/4041/among-us.html",
    thumbnail: "https://play-lh.googleusercontent.com/XeKQxvUswGhHoNdycIhja83xMyqqkqt26MV2D0wYuSWR0k8x3AtU-hgyUylVeTg9Eg=w240-h480-rw"
  },
  {
    title: "Slope Game",
    description: "اختبر سرعتك في لعبة الكرة المائلة الشهيرة.",
    url: "https://slopegame.io/",
    thumbnail: "https://slopegame.io/data/image/slope-game.png"
  },
  {
    title: "Subway Surfers",
    description: "اهرب من الشرطي وتجاوز القطارات بسرعة خارقة!",
    url: "https://now.gg/apps/sybo-games/4210/subway-surfers.html",
    thumbnail: "https://play-lh.googleusercontent.com/HNdeAoTKtRpsUpG3V3eM-YIsNmjX50Q2oUXhL3M6ZpPdoGRDbOsvHDQJHoY3Wbd9qg=w240-h480-rw"
  }
];

const gamesListEl = document.getElementById('gamesList');

// دالة عرض الألعاب
function renderGames() {
  gamesListEl.innerHTML = '';
  games.forEach(game => {
    const card = document.createElement('div');
    card.className = 'card';

    const thumb = document.createElement('div');
    thumb.className = 'thumb';
    thumb.style.backgroundImage = `url(${game.thumbnail})`;
    thumb.style.backgroundSize = 'cover';
    thumb.style.backgroundPosition = 'center';

    const title = document.createElement('h3');
    title.textContent = game.title;

    const desc = document.createElement('p');
    desc.textContent = game.description;

    const playBtn = document.createElement('button');
    playBtn.className = 'play-btn';
    playBtn.textContent = 'تشغيل اللعبة';
    playBtn.onclick = () => window.open(game.url, '_blank');

    card.appendChild(thumb);
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(playBtn);
    gamesListEl.appendChild(card);
  });
}

// دالة رسالة منع
function renderLoginMessage() {
  gamesListEl.innerHTML = `
    <div style="text-align:center;padding:40px">
      <h2>🔒 يجب تسجيل الدخول للعب</h2>
      <p>الرجاء <a href="login.html" style="color:#2ad38a;font-weight:bold">تسجيل الدخول</a> للوصول إلى الألعاب.</p>
    </div>
  `;
}

// مراقبة حالة تسجيل الدخول
onAuthStateChanged(auth, user => {
  if (user) {
    console.log("✅ مستخدم مسجل:", user.email);
    renderGames();
  } else {
    console.log("❌ لا يوجد مستخدم");
    renderLoginMessage();
  }
});

const logoutLink = document.getElementById('logoutLink');
onAuthStateChanged(auth, user => {
  if (user) logoutLink.style.display = 'inline';
  else logoutLink.style.display = 'none';
});
logoutLink.onclick = () => signOut(auth);
