const languageButton = document.querySelector('#language');
function setLanguage(chinese) {
  document.documentElement.dataset.lang = chinese ? 'zh' : 'en';
  document.documentElement.lang = chinese ? 'zh-CN' : 'en';
  languageButton.textContent = chinese ? 'EN' : '中文';
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
