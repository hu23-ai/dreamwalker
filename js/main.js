// main.js

function typeWriterEffect(element, text, speed = 38, callback) {
  element.innerHTML = "";
  let i = 0;
  function type() {
    if (i <= text.length) {
      element.innerHTML =
        text.slice(0, i)
          .replace(/\n/g, "<br>")
          .replace(/  /g, "&nbsp;&nbsp;") +
        `<span class="type-cursor">|</span>`;
      i++;
      setTimeout(type, speed);
    } else {
      element.innerHTML = text.replace(/\n/g, "<br>").replace(/  /g, "&nbsp;&nbsp;");
      if (callback) callback();
    }
  }
  type();
}

window.addEventListener('DOMContentLoaded', function () {
  const desc = document.querySelector('.main-desc');
  if (desc) {
    desc.classList.remove('visible');
    desc.style.opacity = "1"; // ← 타이핑 시작 전에 무조건 보이게!
    const lines = desc.textContent.split('\n').length;
    desc.style.minHeight = (lines * 32) + 'px';
    typeWriterEffect(desc, desc.textContent, 34, function(){
      // 타이핑 끝난 후만 부드럽게 fade-in
      desc.classList.add('visible');
    });
  }
  // 버튼 이벤트 등은 기존대로 유지
  const consultBtn = document.getElementById('consult-btn');
  if (consultBtn) {
    consultBtn.addEventListener('click', () => {
      window.location.href = '/html/chat.html';
    });
  }
});

// main.js
(function() {
  const canvas = document.getElementById('pixel-flicker');
  const ctx    = canvas.getContext('2d');

  const STAR_COUNT       = 25;    // 별 개수
  const FLICKER_INTERVAL = 1000;   // 깜빡임 주기(ms)
  let stars = [];

  // 캔버스 리사이즈 + 별 위치 재생성
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = 300;        // CSS랑 동일하게
    initStars();
  }

  // 별 위치를 한 번만 랜덤으로 생성
  function initStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height
      });
    }
  }

  window.addEventListener('resize', resize);
  resize();

  // 별 위치는 고정, alpha만 랜덤으로 바꿔서 그리기
  function flicker() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const star of stars) {
      const alpha = (Math.random() * 0.8 + 0.2).toFixed(2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fillRect(star.x, star.y, 1, 1);
    }
  }

  setInterval(flicker, FLICKER_INTERVAL);
})();
