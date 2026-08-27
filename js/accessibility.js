/**
 * 한국아그로 웹 접근성 편의 제공 도구 (Web Accessibility Suite)
 * 준수 기준: K-WAH 2.2 (한국형 웹 콘텐츠 접근성 지침), WCAG 2.2 AA, 장애인차별금지법 제21조
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'agrokorea_a11y_prefs_v1';
  var isEn = document.documentElement.lang === 'en' || window.location.pathname.indexOf('/en/') !== -1;

  var defaultPrefs = {
    fontSize: 'normal', // 'normal', 'lg', 'xl'
    contrast: false,
    grayscale: false,
    legibleFont: false,
    highlightLinks: false,
    stopMotion: false,
    focusRing: false
  };

  var prefs = defaultPrefs;
  try {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      prefs = Object.assign({}, defaultPrefs, JSON.parse(stored));
    }
  } catch (e) {
    // LocalStorage inaccessible (sandboxed or private mode)
  }

  // 1. 초기 클래스 즉시 적용 (깜빡임 방지)
  function applyClasses() {
    var html = document.documentElement;
    html.classList.remove('a11y-font-lg', 'a11y-font-xl');
    if (prefs.fontSize === 'lg') html.classList.add('a11y-font-lg');
    if (prefs.fontSize === 'xl') html.classList.add('a11y-font-xl');

    html.classList.toggle('a11y-contrast', !!prefs.contrast);
    html.classList.toggle('a11y-grayscale', !!prefs.grayscale);
    html.classList.toggle('a11y-legible-font', !!prefs.legibleFont);
    html.classList.toggle('a11y-highlight-links', !!prefs.highlightLinks);
    html.classList.toggle('a11y-stop-motion', !!prefs.stopMotion);
    html.classList.toggle('a11y-focus-ring', !!prefs.focusRing);
  }
  applyClasses();

  function savePrefs() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) {}
    applyClasses();
  }

  // 2. DOM 주입
  function initDOM() {
    if (document.getElementById('a11yWidgetBtn')) return;

    var texts = isEn
      ? {
          triggerTip: 'Accessibility Helper (Alt+A)',
          triggerAria: 'Open Accessibility Helper Panel',
          title: 'Accessibility Helper',
          shortcut: 'Alt+A',
          close: 'Close',
          fontSizeLabel: 'Text Size',
          normal: '100%',
          large: '115%',
          largest: '130%',
          contrastName: 'High Contrast',
          contrastDesc: 'Black/yellow 7:1 maximum contrast',
          grayscaleName: 'Grayscale Mode',
          grayscaleDesc: 'Filter colors to monochrome',
          fontName: 'Legible Font',
          fontDesc: 'Clear, high-legibility sans-serif',
          linksName: 'Highlight Links',
          linksDesc: 'Bold underline & high-vis border',
          motionName: 'Pause Motion',
          motionDesc: 'Stop animations & transitions',
          focusName: 'High-Vis Focus',
          focusDesc: 'Bold neon green focus outline',
          reset: 'Reset All',
          policy: 'Accessibility Statement',
          policyTitle: 'Korea Agro Accessibility Statement',
          policyNotice:
            'Korea Agro Co., Ltd. is committed to ensuring equal digital access for all users, including individuals with disabilities and the elderly, in compliance with Korean law and international WCAG 2.2 AA standards.',
          policyFeatures: [
            'Keyboard Accessible: All interactive elements are operable via keyboard alone.',
            'Text Resizing & Contrast: Real-time customization for low-vision and color-blind users.',
            'Screen Reader Optimized: Semantic HTML5, ARIA labels, and logical heading hierarchies.',
            'Motion Control: Safe viewing mode eliminating flashing content and reducing motion sickness.'
          ],
          policyContactTitle: 'Accessibility Inquiries & Assistance',
          policyContactDesc: 'If you encounter any difficulty accessing content on our website, please contact us:',
          policyPhone: 'Tel: +82-2-6949-5708',
          policyEmail: 'Email: name_hyosun@naver.com'
        }
      : {
          triggerTip: '웹 접근성 도우미 (Alt+A)',
          triggerAria: '웹 접근성 편의 도우미 열기',
          title: '웹 접근성 편의 도우미',
          shortcut: 'Alt+A',
          close: '닫기',
          fontSizeLabel: '글자 크기 조절',
          normal: '기본 (100%)',
          large: '크게 (115%)',
          largest: '최대 (130%)',
          contrastName: '초고대비 모드',
          contrastDesc: '검정-노랑 7:1 이상 초고대비 테마',
          grayscaleName: '흑백 모드',
          grayscaleDesc: '모든 색상을 흑백 단색으로 전환',
          fontName: '가독성 폰트',
          fontDesc: '난독증·저시력자용 선명한 폰트',
          linksName: '링크·버튼 강조',
          linksDesc: '모든 클릭 요소에 굵은 밑줄/테두리',
          motionName: '애니메이션 정지',
          motionDesc: '광과민성/어지럼증 방지 모션 정지',
          focusName: '키보드 포커스 강화',
          focusDesc: '탭 이동 시 굵은 네온초록 테두리',
          reset: '설정 초기화',
          policy: '웹 접근성 정책',
          policyTitle: '㈜한국아그로 웹 접근성 준수 정책',
          policyNotice:
            '㈜한국아그로는 「장애인차별금지 및 권리구제 등에 관한 법률」 제21조 및 「한국형 웹 콘텐츠 접근성 지침(K-WAH 2.2)」에 따라 장애인 및 고령자가 웹사이트를 이용하는 데 불편함이 없도록 차별 없는 접근 편의를 적극 제공하고 있습니다.',
          policyFeatures: [
            '키보드 조작 편의: 마우스 없이 Tab 및 방향키로 모든 콘텐츠를 100% 탐색 및 실행 가능합니다.',
            '저시력인 배려: 화면 좌측 하단 [웹 접근성 도우미]를 통해 글자 크기 3단계 확대 및 초고대비 흑백 반전 모드를 상시 지원합니다.',
            '스크린리더 음성 지원: 이미지마다 충실한 대체 텍스트(alt) 및 WAI-ARIA 속성을 부여하여 음성 낭독기 이용을 완벽히 보장합니다.',
            '광과민성 발작 예방: 깜빡이거나 번쩍이는 시각 요소를 배제하고 원클릭 애니메이션 정지 기능을 지원합니다.'
          ],
          policyContactTitle: '웹 접근성 불편 접수 및 담당 안내',
          policyContactDesc: '홈페이지 이용 중 접근성 관련 불편 사항이나 개선 의견이 있으시면 언제든지 연락 주시기 바랍니다.',
          policyPhone: '고객지원실: 02-6949-5708',
          policyEmail: '이메일: name_hyosun@naver.com'
        };

    // 2-1. 플로팅 트리거 버튼
    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.id = 'a11yWidgetBtn';
    trigger.className = 'a11y-widget-btn a11y-ignore';
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', 'a11yPanel');
    trigger.setAttribute('aria-label', texts.triggerAria);
    trigger.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M12 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>' +
      '</svg>' +
      '<span class="a11y-btn-tip">' + texts.triggerTip + '</span>';
    document.body.appendChild(trigger);

    // 2-2. 접근성 패널
    var panel = document.createElement('div');
    panel.id = 'a11yPanel';
    panel.className = 'a11y-panel a11y-ignore';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-label', texts.title);

    panel.innerHTML =
      '<div class="a11y-panel-header">' +
        '<div class="a11y-panel-title">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/></svg>' +
          '<span>' + texts.title + '</span>' +
        '</div>' +
        '<span class="a11y-panel-shortcut" aria-hidden="true">' + texts.shortcut + '</span>' +
        '<button type="button" class="a11y-panel-close a11y-ignore" id="a11yCloseBtn" aria-label="' + texts.close + '">&times;</button>' +
      '</div>' +
      '<div class="a11y-panel-body">' +
        // 글자 크기
        '<div class="a11y-item">' +
          '<span class="a11y-item-label">' + texts.fontSizeLabel + '</span>' +
          '<div class="a11y-btn-group" role="group" aria-label="' + texts.fontSizeLabel + '">' +
            '<button type="button" class="a11y-btn a11y-ignore' + (prefs.fontSize === 'normal' ? ' active' : '') + '" data-font="normal">' + texts.normal + '</button>' +
            '<button type="button" class="a11y-btn a11y-ignore' + (prefs.fontSize === 'lg' ? ' active' : '') + '" data-font="lg">' + texts.large + '</button>' +
            '<button type="button" class="a11y-btn a11y-ignore' + (prefs.fontSize === 'xl' ? ' active' : '') + '" data-font="xl">' + texts.largest + '</button>' +
          '</div>' +
        '</div>' +
        // 초고대비
        '<div class="a11y-toggle-row">' +
          '<div class="a11y-toggle-info">' +
            '<span class="a11y-toggle-name">' + texts.contrastName + '</span>' +
            '<span class="a11y-toggle-desc">' + texts.contrastDesc + '</span>' +
          '</div>' +
          '<button type="button" class="a11y-switch a11y-ignore" id="a11yToggleContrast" role="switch" aria-checked="' + (prefs.contrast ? 'true' : 'false') + '" aria-label="' + texts.contrastName + '"></button>' +
        '</div>' +
        // 흑백 모드
        '<div class="a11y-toggle-row">' +
          '<div class="a11y-toggle-info">' +
            '<span class="a11y-toggle-name">' + texts.grayscaleName + '</span>' +
            '<span class="a11y-toggle-desc">' + texts.grayscaleDesc + '</span>' +
          '</div>' +
          '<button type="button" class="a11y-switch a11y-ignore" id="a11yToggleGrayscale" role="switch" aria-checked="' + (prefs.grayscale ? 'true' : 'false') + '" aria-label="' + texts.grayscaleName + '"></button>' +
        '</div>' +
        // 가독성 폰트
        '<div class="a11y-toggle-row">' +
          '<div class="a11y-toggle-info">' +
            '<span class="a11y-toggle-name">' + texts.fontName + '</span>' +
            '<span class="a11y-toggle-desc">' + texts.fontDesc + '</span>' +
          '</div>' +
          '<button type="button" class="a11y-switch a11y-ignore" id="a11yToggleFont" role="switch" aria-checked="' + (prefs.legibleFont ? 'true' : 'false') + '" aria-label="' + texts.fontName + '"></button>' +
        '</div>' +
        // 링크/버튼 강조
        '<div class="a11y-toggle-row">' +
          '<div class="a11y-toggle-info">' +
            '<span class="a11y-toggle-name">' + texts.linksName + '</span>' +
            '<span class="a11y-toggle-desc">' + texts.linksDesc + '</span>' +
          '</div>' +
          '<button type="button" class="a11y-switch a11y-ignore" id="a11yToggleLinks" role="switch" aria-checked="' + (prefs.highlightLinks ? 'true' : 'false') + '" aria-label="' + texts.linksName + '"></button>' +
        '</div>' +
        // 애니메이션 정지
        '<div class="a11y-toggle-row">' +
          '<div class="a11y-toggle-info">' +
            '<span class="a11y-toggle-name">' + texts.motionName + '</span>' +
            '<span class="a11y-toggle-desc">' + texts.motionDesc + '</span>' +
          '</div>' +
          '<button type="button" class="a11y-switch a11y-ignore" id="a11yToggleMotion" role="switch" aria-checked="' + (prefs.stopMotion ? 'true' : 'false') + '" aria-label="' + texts.motionName + '"></button>' +
        '</div>' +
        // 포커스 링 강화
        '<div class="a11y-toggle-row">' +
          '<div class="a11y-toggle-info">' +
            '<span class="a11y-toggle-name">' + texts.focusName + '</span>' +
            '<span class="a11y-toggle-desc">' + texts.focusDesc + '</span>' +
          '</div>' +
          '<button type="button" class="a11y-switch a11y-ignore" id="a11yToggleFocus" role="switch" aria-checked="' + (prefs.focusRing ? 'true' : 'false') + '" aria-label="' + texts.focusName + '"></button>' +
        '</div>' +
      '</div>' +
      '<div class="a11y-panel-footer">' +
        '<button type="button" class="a11y-link-policy a11y-ignore" id="a11yOpenPolicyBtn">' + texts.policy + '</button>' +
        '<button type="button" class="a11y-btn-reset a11y-ignore" id="a11yResetBtn">' + texts.reset + '</button>' +
      '</div>';
    document.body.appendChild(panel);

    // 2-3. 웹 접근성 정책 모달
    var policyFeaturesHtml = texts.policyFeatures.map(function(item) {
      return '<li>' + item + '</li>';
    }).join('');

    var policyModal = document.createElement('div');
    policyModal.id = 'a11yPolicyModal';
    policyModal.className = 'a11y-policy-modal a11y-ignore';
    policyModal.setAttribute('role', 'dialog');
    policyModal.setAttribute('aria-modal', 'true');
    policyModal.setAttribute('aria-label', texts.policyTitle);
    policyModal.innerHTML =
      '<div class="a11y-policy-card">' +
        '<div class="a11y-policy-head">' +
          '<h3>' + texts.policyTitle + '</h3>' +
          '<button type="button" class="a11y-policy-close a11y-ignore" id="a11yPolicyCloseBtn" aria-label="' + texts.close + '">&times;</button>' +
        '</div>' +
        '<div class="a11y-policy-body">' +
          '<p>' + texts.policyNotice + '</p>' +
          '<h4>' + (isEn ? 'Key Accessibility Features' : '주요 접근 편의 제공 내용') + '</h4>' +
          '<ul>' + policyFeaturesHtml + '</ul>' +
          '<h4>' + texts.policyContactTitle + '</h4>' +
          '<p>' + texts.policyContactDesc + '</p>' +
          '<p><strong>' + texts.policyPhone + '</strong><br>' + texts.policyEmail + '</p>' +
        '</div>' +
      '</div>';
    document.body.appendChild(policyModal);

    // 3. 이벤트 바인딩
    function togglePanel(show) {
      var willOpen = typeof show === 'boolean' ? show : !panel.classList.contains('is-open');
      panel.classList.toggle('is-open', willOpen);
      trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      if (willOpen) {
        panel.querySelector('button').focus();
      } else {
        trigger.focus();
      }
    }

    function togglePolicy(show) {
      var willOpen = typeof show === 'boolean' ? show : !policyModal.classList.contains('is-open');
      policyModal.classList.toggle('is-open', willOpen);
      if (willOpen) {
        document.body.style.overflow = 'hidden';
        document.getElementById('a11yPolicyCloseBtn').focus();
      } else {
        document.body.style.overflow = '';
      }
    }

    trigger.addEventListener('click', function () {
      togglePanel();
    });

    document.getElementById('a11yCloseBtn').addEventListener('click', function () {
      togglePanel(false);
    });

    // 폰트 버튼
    panel.querySelectorAll('[data-font]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        panel.querySelectorAll('[data-font]').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        prefs.fontSize = btn.getAttribute('data-font');
        savePrefs();
      });
    });

    // 토글 스위치 헬퍼
    function bindSwitch(id, propKey) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('click', function () {
        prefs[propKey] = !prefs[propKey];
        el.setAttribute('aria-checked', prefs[propKey] ? 'true' : 'false');
        savePrefs();
      });
    }

    bindSwitch('a11yToggleContrast', 'contrast');
    bindSwitch('a11yToggleGrayscale', 'grayscale');
    bindSwitch('a11yToggleFont', 'legibleFont');
    bindSwitch('a11yToggleLinks', 'highlightLinks');
    bindSwitch('a11yToggleMotion', 'stopMotion');
    bindSwitch('a11yToggleFocus', 'focusRing');

    // 초기화 버튼
    document.getElementById('a11yResetBtn').addEventListener('click', function () {
      prefs = Object.assign({}, defaultPrefs);
      savePrefs();
      panel.querySelectorAll('[data-font]').forEach(function (b) {
        b.classList.toggle('active', b.getAttribute('data-font') === 'normal');
      });
      panel.querySelectorAll('.a11y-switch').forEach(function (sw) {
        sw.setAttribute('aria-checked', 'false');
      });
    });

    // 정책 모달 열기/닫기
    document.getElementById('a11yOpenPolicyBtn').addEventListener('click', function () {
      togglePanel(false);
      togglePolicy(true);
    });
    document.getElementById('a11yPolicyCloseBtn').addEventListener('click', function () {
      togglePolicy(false);
    });
    policyModal.addEventListener('click', function (e) {
      if (e.target === policyModal) togglePolicy(false);
    });

    // 풋터 내 .btn-a11y-policy 클릭 연결
    document.querySelectorAll('.btn-a11y-policy').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        togglePolicy(true);
      });
    });

    // 키보드 단축키 (Alt + A) 및 ESC 닫기
    document.addEventListener('keydown', function (e) {
      if (e.altKey && (e.key === 'a' || e.key === 'A' || e.keyCode === 65)) {
        e.preventDefault();
        togglePanel();
      } else if (e.key === 'Escape') {
        if (policyModal.classList.contains('is-open')) {
          togglePolicy(false);
        } else if (panel.classList.contains('is-open')) {
          togglePanel(false);
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDOM);
  } else {
    initDOM();
  }
})();
