// Persian to English mapping (REVERSE mapping)
const persianToEnglishMap = {
  // Persian characters to English keys
  'ض': 'q', 'ص': 'w', 'ث': 'e', 'ق': 'r', 'ف': 't', 'غ': 'y', 'ع': 'u',
  'ه': 'i', 'خ': 'o', 'ح': 'p', 'ج': '[', 'چ': ']', 'ش': 'a', 'س': 's',
  'ی': 'd', 'ب': 'f', 'ل': 'g', 'ا': 'h', 'ت': 'j', 'ن': 'k', 'م': 'l',
  'ک': ';', 'گ': "'", 'ظ': 'z', 'ط': 'x', 'ز': 'c', 'ر': 'v', 'ذ': 'b',
  'د': 'n', 'ئ': 'm', 'و': ',', ' ': ' ',
  
  // Persian numbers to English numbers
  '۱': '1', '۲': '2', '۳': '3', '۴': '4', '۵': '5', '۶': '6',
  '۷': '7', '۸': '8', '۹': '9', '۰': '0',
  
  // Additional Persian characters that might appear
  'أ': 'H', 'إ': 'Y', 'لأ': 'G', 'لإ': 'T',
  'َ': 'Q', 'ً': 'W', 'ُ': 'E', 'ٌ': 'R', 'ِ': 'A', 'ٍ': 'S', 'ْ': 'Z', 'ّ': 'X'
};

// English to Persian mapping (ORIGINAL mapping)
const englishToPersianMap = {
  // Lowercase letters
  'q': 'ض', 'w': 'ص', 'e': 'ث', 'r': 'ق', 't': 'ف', 'y': 'غ', 'u': 'ع',
  'i': 'ه', 'o': 'خ', 'p': 'ح', '[': 'ج', ']': 'چ', 'a': 'ش', 's': 'س',
  'd': 'ی', 'f': 'ب', 'g': 'ل', 'h': 'ا', 'j': 'ت', 'k': 'ن', 'l': 'م',
  ';': 'ک', "'": 'گ', 'z': 'ظ', 'x': 'ط', 'c': 'ز', 'v': 'ر', 'b': 'ذ',
  'n': 'د', 'm': 'ئ', ',': 'و', '.': '.', '/': '/', ' ': ' ',
  
  // Uppercase letters
  'Q': 'َ', 'W': 'ً', 'E': 'ُ', 'R': 'ٌ', 'T': 'لإ', 'Y': 'إ', 'U': '‘',
  'I': '÷', 'O': '×', 'P': '؛', '{': '}', '}': '}', 'A': 'ِ', 'S': 'ٍ',
  'D': ']', 'F': '[', 'G': 'لأ', 'H': 'أ', 'J': 'ـ', 'K': '،', 'L': '/',
  ':': ':', '"': '"', 'Z': 'ْ', 'X': 'ّ', 'C': '}', 'V': '{', 'B': 'ذ',
  'N': 'د', 'M': '}', '<': '>', '>': '<', '?': '?',
  
  // Numbers
  '`': 'ْ', '1': '۱', '2': '۲', '3': '۳', '4': '۴', '5': '۵', '6': '۶',
  '7': '۷', '8': '۸', '9': '۹', '0': '۰', '~': 'ّ', '!': '!', '@': '٬',
  '#': '٫', '$': '﷼', '%': '٪', '^': 'ْ', '&': 'ُ', '*': 'ٌ', '(': ')',
  ')': '(', '_': 'ـ', '-': '-', '=': '=', '+': '+'
};

function isPersianCharacter(char) {
  const persianRegex = /[\u0600-\u06FF]/;
  return persianRegex.test(char);
}

function isEnglishCharacter(char) {
  return /[a-zA-Z]/.test(char);
}

function detectTextType(text) {
  if (!text.trim()) return 'unknown';
  
  let persianCount = 0;
  let englishCount = 0;
  
  for (let char of text) {
    if (isPersianCharacter(char)) {
      persianCount++;
    } else if (isEnglishCharacter(char)) {
      englishCount++;
    }
  }
  
  // If we have any Persian characters, it's Persian
  if (persianCount > 0) {
    return 'persian';
  }
  // If we have English characters and common Persian layout patterns, it's English layout
  else if (englishCount > 0) {
    // Check for common Persian words typed with English layout
    const commonPatterns = ['sghl', 'p,f', 'isjl', 'ovd', 'slonj', 'dl', 'sd'];
    const lowerText = text.toLowerCase();
    if (commonPatterns.some(pattern => lowerText.includes(pattern))) {
      return 'english-layout';
    }
    return 'english-layout';
  }
  
  return 'unknown';
}

function convertToPersian(text) {
  let result = '';
  for (let char of text) {
    result += englishToPersianMap[char] || char;
  }
  return result;
}

function convertToEnglish(text) {
  let result = '';
  for (let char of text) {
    result += persianToEnglishMap[char] || char;
  }
  return result;
}

function showNotification(message, isError = false) {
  const existingNotification = document.getElementById('persian-fix-notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  const notification = document.createElement('div');
  notification.id = 'persian-fix-notification';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${isError ? '#f44336' : '#4CAF50'};
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    z-index: 10000;
    font-family: Tahoma, sans-serif;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    max-width: 400px;
    word-wrap: break-word;
    border: 2px solid ${isError ? '#d32f2f' : '#45a049'};
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (document.body.contains(notification)) {
      document.body.removeChild(notification);
    }
  }, 3000);
}

function triggerInputEvent(element) {
  // Trigger all possible events to make sure the change is committed
  const events = ['input', 'change', 'blur', 'keyup', 'keydown'];
  events.forEach(eventType => {
    const event = new Event(eventType, { bubbles: true });
    element.dispatchEvent(event);
  });
}

function replaceSelectedText(convertedText) {
  const activeElement = document.activeElement;
  const isInput = activeElement && (
    activeElement.tagName === 'INPUT' || 
    activeElement.tagName === 'TEXTAREA' ||
    activeElement.isContentEditable
  );
  
  if (isInput) {
    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
      const start = activeElement.selectionStart;
      const end = activeElement.selectionEnd;
      
      // Replace the text
      activeElement.value = activeElement.value.substring(0, start) + convertedText + activeElement.value.substring(end);
      
      // Set cursor position
      const newCursorPos = start + convertedText.length;
      activeElement.setSelectionRange(newCursorPos, newCursorPos);
      
      // 🔥 CRITICAL: Trigger events to commit the change
      triggerInputEvent(activeElement);
      
    } else if (activeElement.isContentEditable) {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(convertedText));
    }
  } else {
    // Regular page text
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(convertedText));
  }
}

function autoConvert() {
  const activeElement = document.activeElement;
  const isInput = activeElement && (
    activeElement.tagName === 'INPUT' || 
    activeElement.tagName === 'TEXTAREA' ||
    activeElement.isContentEditable
  );
  
  let selectedText = '';
  
  if (isInput) {
    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
      const start = activeElement.selectionStart;
      const end = activeElement.selectionEnd;
      
      if (start === end) {
        showNotification('❌ لطفاً متنی را انتخاب کنید', true);
        return;
      }
      
      selectedText = activeElement.value.substring(start, end);
    } else if (activeElement.isContentEditable) {
      const selection = window.getSelection();
      if (!selection.toString().trim()) {
        showNotification('❌ لطفاً متنی را انتخاب کنید', true);
        return;
      }
      selectedText = selection.toString();
    }
  } else {
    const selection = window.getSelection();
    selectedText = selection.toString().trim();
    
    if (!selectedText) {
      showNotification('❌ لطفاً متنی را در صفحه انتخاب کنید', true);
      return;
    }
  }
  
  const detectedType = detectTextType(selectedText);
  let convertedText, message, direction;
  
  if (detectedType === 'persian') {
    // Convert Persian to English layout
    convertedText = convertToEnglish(selectedText);
    direction = 'فارسی به انگلیسی';
    message = `🔠 ${direction}:\n${selectedText} → ${convertedText}`;
  } else if (detectedType === 'english-layout') {
    // Convert English layout to Persian
    convertedText = convertToPersian(selectedText);
    direction = 'انگلیسی به فارسی';
    message = `🔤 ${direction}:\n${selectedText} → ${convertedText}`;
  } else {
    showNotification('❌ نوع متن قابل تشخیص نیست', true);
    return;
  }
  
  // Replace the text
  replaceSelectedText(convertedText);
  showNotification(message);
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request) => {
  switch (request.action) {
    case "autoConvert":
      autoConvert();
      break;
      // You can add more cases here in the future
    default:
      console.log('Unknown action:', request.action);
  }

fontStyle.textContent = `
  @font-face {
    font-family: 'Noto Sans Arabic';
    font-style: normal;
    font-weight: 400;
    src: url('${chrome.runtime.getURL('fonts/NotoSansArabic.ttf')}') format('truetype');
  }
  
  #persian-fix-notification {
    font-family: 'Noto Sans Arabic', Tahoma, sans-serif !important;
    font-weight: 500;
  }
`;
document.head.appendChild(fontStyle);
});
