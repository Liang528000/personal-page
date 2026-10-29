const languageButton = document.querySelector('#language');
function setLanguage(chinese) {
  document.documentElement.dataset.lang = chinese ? 'zh' : 'en';
  document.documentElement.lang = chinese ? 'zh-CN' : 'en';
  languageButton.textContent = chinese ? 'EN' : '中文';
  document.dispatchEvent(new Event('site-language-change'));
}
try {
  setLanguage(sessionStorage.getItem('site-lang') === 'zh');
} catch {
  setLanguage(false);
}
languageButton.addEventListener('click', () => {
  const chinese = document.documentElement.dataset.lang !== 'zh';
  setLanguage(chinese);
  try {
    sessionStorage.setItem('site-lang', chinese ? 'zh' : 'en');
  } catch {
    // The current page remains usable when storage is unavailable.
  }
});

document.querySelectorAll('.carousel').forEach((carousel) => {
  const slides = [...carousel.querySelectorAll('.slide')];
  const captions = [...carousel.querySelectorAll('.slide-caption')];
  const previous = carousel.querySelector('.carousel-prev');
  const next = carousel.querySelector('.carousel-next');
  const play = carousel.querySelector('.carousel-play');
  const count = carousel.querySelector('.carousel-count');
  let index = 0;
  let paused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lastChange = Date.now();

  function render() {
    slides.forEach((slide, i) => { slide.hidden = i !== index; });
    captions.forEach((caption, i) => { caption.hidden = i !== index; });
    count.textContent = `${index + 1} / ${slides.length}`;
    const chinese = document.documentElement.dataset.lang === 'zh';
    const labels = chinese
      ? ['上一张图片', '下一张图片', paused ? '播放轮播' : '暂停轮播']
      : ['Previous figure', 'Next figure', paused ? 'Play slideshow' : 'Pause slideshow'];
    [previous, next, play].forEach((button, i) => {
      button.setAttribute('aria-label', labels[i]);
      button.title = labels[i];
    });
    play.textContent = paused ? '▶' : 'Ⅱ';
  }

  function change(step) {
    index = (index + step + slides.length) % slides.length;
    lastChange = Date.now();
    render();
  }

  previous.addEventListener('click', () => change(-1));
  next.addEventListener('click', () => change(1));
  play.addEventListener('click', () => {
    paused = !paused;
    lastChange = Date.now();
    render();
  });
  document.addEventListener('site-language-change', render);
  window.setInterval(() => {
    const bounds = carousel.getBoundingClientRect();
    const visible = bounds.bottom > 0 && bounds.top < window.innerHeight;
    if (!paused && !document.hidden && visible && !carousel.matches(':hover') &&
        !carousel.contains(document.activeElement) && Date.now() - lastChange >= 7000) {
      change(1);
    }
  }, 1000);
  render();
});
