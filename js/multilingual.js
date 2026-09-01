/**
 * AgroKorea Multilingual Google Translate Controller
 * Supports 15+ partner countries: Korea, USA, China, Japan, Germany, France,
 * Slovakia, Mexico/Spain, Thailand, Philippines, India, Vietnam, etc.
 *
 * Dynamic Branding:
 * - Korean ('ko'): Shows [Logo] (주)한국아그로
 * - Foreign Languages: Shows [Logo] AGROKOREA
 */

(function () {
  const LANGUAGES = [
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'zh-CN', label: '中文 (简体)', flag: '🇨🇳' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'es', label: 'Español', flag: '🇲🇽' },
    { code: 'sk', label: 'Slovenčina', flag: '🇸🇰' },
    { code: 'th', label: 'ไทย', flag: '🇹🇭' },
    { code: 'tl', label: 'Filipino', flag: '🇵🇭' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' }
  ];

  // Hidden Google Element init callback
  window.googleTranslateElementInit = function () {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: 'ko',
        includedLanguages: 'ko,en,zh-CN,ja,de,fr,es,sk,th,tl,hi,vi,ru,pt,it,nl,ar',
        autoDisplay: false,
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
      },
      'google_translate_element'
    );
  };

  // Load Google Translate API asynchronously
  function loadGoogleScript() {
    if (document.getElementById('google-translate-api-script')) return;
    const s = document.createElement('script');
    s.id = 'google-translate-api-script';
    s.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    document.body.appendChild(s);
  }

  // Clear all googtrans cookies completely across all domains and paths
  function clearGoogleTranslateCookie() {
    const host = window.location.hostname;
    const hostParts = host.split('.');
    const domains = ['', host, '.' + host];
    if (hostParts.length > 2) {
      domains.push('.' + hostParts.slice(1).join('.'));
    }
    const paths = ['/', window.location.pathname, window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'))];

    domains.forEach(d => {
      paths.forEach(p => {
        if (!p) return;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${p};` + (d ? ` domain=${d};` : '');
      });
    });
  }

  // Detect current language from cookie or URL
  function getCurrentLang() {
    const match = document.cookie.match(/(?:^|;\s*)googtrans=\/([^\/]+)\/([^\/;]+)/);
    if (match && match[2] && match[2] !== 'ko') {
      return match[2];
    }
    if (window.location.pathname.startsWith('/en/')) {
      return 'en';
    }
    return 'ko';
  }

  // Dynamically update Logo between "(주)한국아그로" and "Agrokorea"
  function updateBrandLogo(langCode) {
    const isKorean = (langCode === 'ko');
    const targetFile = isKorean ? 'logo.png' : 'logo-en.png';
    const altText = isKorean ? '㈜한국아그로' : 'Agrokorea';

    document.querySelectorAll('.brand-logo').forEach(img => {
      if (img.src.includes('footer-logo')) {
        return;
      }
      if (img.src.endsWith('/logo.png') || img.src.endsWith('/logo-en.png') || img.src.includes('logo.png') || img.src.includes('logo-en.png')) {
        const newSrc = img.src.replace(/logo(-en)?\.png$/, targetFile);
        if (img.src !== newSrc) {
          img.src = newSrc;
        }
        img.alt = altText;
      }
    });
  }

  // Trigger language change programmatically
  function changeLanguage(langCode) {
    if (langCode === 'ko') {
      clearGoogleTranslateCookie();
      try {
        const select = document.querySelector('.goog-te-combo');
        if (select) {
          select.value = '';
          select.dispatchEvent(new Event('change'));
        }
      } catch (e) {}

      updateBrandLogo('ko');

      if (window.location.pathname.startsWith('/en/')) {
        window.location.href = window.location.pathname.replace(/^\/en\//, '/');
      } else {
        window.location.reload();
      }
      return;
    }

    updateBrandLogo(langCode);

    // Set translation cookie for target language
    const host = window.location.hostname;
    const cookieVal = '/ko/' + langCode;
    document.cookie = `googtrans=${cookieVal}; path=/; domain=${host}`;
    document.cookie = `googtrans=${cookieVal}; path=/;`;
    
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
    } else {
      window.location.reload();
    }
  }

  // Build custom language selector UI
  function initSelector() {
    if (!document.getElementById('google_translate_element')) {
      const gWrap = document.createElement('div');
      gWrap.id = 'google_translate_element';
      gWrap.style.display = 'none';
      document.body.appendChild(gWrap);
    }

    const currentCode = getCurrentLang();
    const currentObj = LANGUAGES.find(l => l.code === currentCode) || LANGUAGES[0];

    // Update brand logo to match initial language
    updateBrandLogo(currentCode);

    // Find and replace existing .nav-lang container or single toggle link cleanly
    const existingNavLang = document.querySelector('.nav-lang');
    const existingLangBtn = document.querySelector('.lang-btn, .lang-toggle, a[href*="en/index.html"], a[href*="../index.html"]');

    const wrapper = document.createElement('div');
    wrapper.className = 'custom-lang-selector';
    wrapper.innerHTML = `
      <button type="button" class="lang-selector-btn" aria-haspopup="listbox" aria-expanded="false" title="Language / 다국어 선택">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        <span class="lang-flag">${currentObj.flag}</span>
        <span class="lang-current-code">${currentObj.code === 'ko' ? 'KO' : currentObj.code.toUpperCase()}</span>
        <svg class="lang-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div class="lang-dropdown-menu" role="listbox" tabindex="-1">
        <div class="lang-menu-header">
          <span>Global Partner Languages (15+)</span>
        </div>
        <div class="lang-menu-grid">
          ${LANGUAGES.map(l => `
            <button type="button" class="lang-option-item ${l.code === currentCode ? 'is-active' : ''}" data-code="${l.code}">
              <span class="l-flag">${l.flag}</span>
              <span class="l-name">${l.label}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    if (existingNavLang) {
      existingNavLang.replaceWith(wrapper);
    } else if (existingLangBtn && existingLangBtn.parentElement) {
      existingLangBtn.parentElement.replaceChild(wrapper, existingLangBtn);
    } else {
      const headerNav = document.querySelector('.site-nav, .nav-side, .header-inner, header');
      if (headerNav) headerNav.appendChild(wrapper);
    }

    const toggleBtn = wrapper.querySelector('.lang-selector-btn');

    toggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = wrapper.classList.toggle('is-open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', function (e) {
      if (!wrapper.contains(e.target)) {
        wrapper.classList.remove('is-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    wrapper.querySelectorAll('.lang-option-item').forEach(btn => {
      btn.addEventListener('click', function () {
        const code = this.getAttribute('data-code');
        wrapper.classList.remove('is-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        changeLanguage(code);
      });
    });

    loadGoogleScript();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSelector);
  } else {
    initSelector();
  }
})();
