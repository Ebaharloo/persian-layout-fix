// Content script: reads the selection, converts it, writes it back.
// Layout tables + conversion live in mapping.js (pure, unit tested).
(function () {
  'use strict';

  const NOTIFICATION_ID = 'persian-fix-notification';
  const NOTIFICATION_MS = 3000;
  const MAX_PREVIEW = 60;

  // input types where selectionStart / setRangeText actually work
  const TEXT_INPUT_TYPES = /^(text|search|url|tel|password|email|)$/i;

  function isTextField(el) {
    return !!el && el.tagName === 'INPUT' && TEXT_INPUT_TYPES.test(el.type || 'text');
  }

  function isTextArea(el) {
    return !!el && el.tagName === 'TEXTAREA';
  }

  function injectStyle() {
    if (document.getElementById('persian-fix-style')) return;
    const style = document.createElement('style');
    style.id = 'persian-fix-style';
    style.textContent = `
      @font-face {
        font-family: 'Noto Sans Arabic';
        font-style: normal;
        font-weight: 400;
        src: url('${chrome.runtime.getURL('fonts/NotoSansArabic.ttf')}') format('truetype');
      }
      #${NOTIFICATION_ID} {
        font-family: 'Noto Sans Arabic', Tahoma, sans-serif !important;
        font-weight: 500;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  const isTopFrame = window === window.top;

  // Messages reach every frame, so error toasts come from the top frame only.
  function errorNotice(message) {
    if (isTopFrame) showNotification(message, true);
  }

  function preview(text) {
    const clean = text.replace(/\s+/g, ' ').trim();
    return clean.length > MAX_PREVIEW ? clean.slice(0, MAX_PREVIEW) + '…' : clean;
  }

  function showNotification(message, isError = false) {
    const old = document.getElementById(NOTIFICATION_ID);
    if (old) old.remove();

    const notification = document.createElement('div');
    notification.id = NOTIFICATION_ID;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${isError ? '#f44336' : '#4CAF50'};
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      z-index: 2147483647;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      max-width: 400px;
      overflow-wrap: anywhere;
      direction: rtl;
      text-align: right;
      border: 2px solid ${isError ? '#d32f2f' : '#45a049'};
    `;
    notification.textContent = message;
    (document.body || document.documentElement).appendChild(notification);
    setTimeout(() => notification.remove(), NOTIFICATION_MS);
  }

  // execCommand keeps the site's own input handling and the undo stack alive.
  function replaceSelection(text) {
    try {
      if (document.execCommand('insertText', false, text)) return true;
    } catch (e) {
      /* fall through to manual splice */
    }

    const el = document.activeElement;
    if (isTextField(el) || isTextArea(el)) {
      el.setRangeText(text, el.selectionStart, el.selectionEnd, 'end');
      el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
      return true;
    }

    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return false;
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(text));
    range.collapse(false);
    return true;
  }

  function autoConvert() {
    const el = document.activeElement;
    let selected = '';

    if (isTextField(el) || isTextArea(el)) {
      if (el.selectionStart === el.selectionEnd) {
        return errorNotice('❌ لطفاً متنی را انتخاب کنید');
      }
      selected = el.value.slice(el.selectionStart, el.selectionEnd);
    } else {
      const selection = window.getSelection();
      selected = selection ? selection.toString() : '';
      if (!selected.trim()) {
        return errorNotice('❌ لطفاً متنی را انتخاب کنید');
      }
    }

    const direction = detectDirection(selected);
    if (!direction) {
      return errorNotice('❌ نوع متن قابل تشخیص نیست');
    }

    const converted = direction === 'fa2en' ? faToEn(selected) : enToFa(selected);
    if (!replaceSelection(converted)) {
      return errorNotice('❌ جایگزینی متن ناموفق بود');
    }

    const label = direction === 'fa2en' ? '🔠 فارسی ← انگلیسی' : '🔤 انگلیسی ← فارسی';
    showNotification(`${label}\n${preview(selected)} → ${preview(converted)}`);
  }

  chrome.runtime.onMessage.addListener((request) => {
    if (request && request.action === 'autoConvert') autoConvert();
  });

  injectStyle();
})();
