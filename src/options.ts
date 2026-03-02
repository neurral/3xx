// Options page script

const DEFAULT_TEMPLATE = 'https://duckduckgo.com/?q=%s';

const presets = {
  duckduckgo: 'https://duckduckgo.com/?q=%s',
  google: 'https://www.google.com/search?q=%s',
  bing: 'https://www.bing.com/search?q=%s',
  startpage: 'https://www.startpage.com/sp/search?q=%s',
  brave: 'https://search.brave.com/search?q=%s'
};

// Load current template
async function loadTemplate() {
  const result = await chrome.storage.sync.get(['searchTemplate']);
  const template = result.searchTemplate || DEFAULT_TEMPLATE;
  (document.getElementById('customTemplate') as HTMLInputElement).value =
    template;
}

// Save template
async function saveTemplate(template: string) {
  await chrome.storage.sync.set({ searchTemplate: template });
  showStatus('Settings saved!');
}

// Show status message
function showStatus(message: string) {
  const status = document.getElementById('status')!;
  status.textContent = message;
  setTimeout(() => (status.textContent = ''), 3000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', loadTemplate);

document.getElementById('customTemplate')!.addEventListener('input', e => {
  const template = (e.target as HTMLInputElement).value;
  saveTemplate(template);
});

Object.entries(presets).forEach(([key, template]) => {
  document.getElementById(key)!.addEventListener('click', () => {
    (document.getElementById('customTemplate') as HTMLInputElement).value =
      template;
    saveTemplate(template);
  });
});
