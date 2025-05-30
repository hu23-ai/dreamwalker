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
      window.location.href = 'chat.html';
    });
  }
});
