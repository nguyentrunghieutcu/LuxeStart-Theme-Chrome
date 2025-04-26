chrome.runtime.onMessage.addListener((request, _, cb) => {
  const handler = new Promise<string>((resolve, reject) => {
    if (request) {
      // resolve(`Hi from contentPage! You are currently on: ${window.location.href}`)
    } else {
      reject('request is empty.')
    }
  })

  handler.then((message) => cb(message)).catch((error) => cb(error))

  return true
})
async function fetchTranslations() {
  const sheetUrl = 'https://script.google.com/macros/s/AKfycbx4H1AhX8MVBE-TROCnTwLsVkm1WYM8hXPPH_sNEEr9vrZcHRvmLuGKbeMsL4liNORWAg/exec'; // API từ Google Apps Script
  try {
    const response = await fetch(sheetUrl);
    const data = await response.json();
    await chrome.storage.local.set({ translations: data });
    console.log('✅ Dữ liệu dịch đã lưu vào storage:', data);
  } catch (error) {
    console.error('❌ Lỗi khi tải dữ liệu dịch:', error);
  }
}

// Chạy khi lần đầu cài Extension hoặc cập nhật
chrome.runtime.onInstalled.addListener(() => {
  fetchTranslations();
});

// Lắng nghe sự kiện khi mở extension, kiểm tra nếu chưa có thì tải lại
chrome.runtime.onStartup.addListener(async () => {
  const storageData = await chrome.storage.local.get('translations');
  if (!storageData.translations) {
    fetchTranslations();
  }
});

chrome.alarms.create("updateTranslations", { periodInMinutes: 1440 }); // 24h

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "updateTranslations") {
    fetchTranslations();
  }
});