// Background service worker for 3xx extension

// Inline URL detection functions
function isUrl(input: string): boolean {
  const trimmed = input.trim();
  if (/^(https?|ftp|file):\/\//i.test(trimmed)) return true;
  if (/^\[[\da-f:]+?\]$/i.test(trimmed)) return true;
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(trimmed)) return true;
  if (
    /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*(:[0-9]+)?(\/.*)?(\?.*)?(#.*)?$/i.test(
      trimmed
    )
  ) {
    return (
      trimmed.includes('.') ||
      trimmed.includes(':') ||
      trimmed.toLowerCase().startsWith('localhost')
    );
  }
  return false;
}

function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (/^(https?|ftp|file):\/\//i.test(trimmed)) return trimmed;
  if (/^[\da-f:]+$/i.test(trimmed) && !trimmed.startsWith('['))
    return `https://[${trimmed}]`;
  return `https://${trimmed}`;
}

function getSuggestions(input: string, searchEngineName: string) {
  const trimmed = input.trim();
  if (!trimmed)
    return [{ content: '', description: 'Type a URL or search query' }];
  if (isUrl(trimmed)) {
    const normalized = trimmed.startsWith('http')
      ? trimmed
      : `https://${trimmed}`;
    return [
      {
        content: normalized,
        description: `Navigate to <match>${normalized}</match>`
      }
    ];
  } else {
    return [
      {
        content: trimmed,
        description: `Search <dim>${searchEngineName}</dim> for <match>${trimmed}</match>`
      }
    ];
  }
}

// Default search engine template
const DEFAULT_SEARCH_TEMPLATE = 'https://duckduckgo.com/?q=%s';

// Get stored search engine template
async function getSearchTemplate(): Promise<string> {
  const result = await chrome.storage.sync.get(['searchTemplate']);
  return result.searchTemplate || DEFAULT_SEARCH_TEMPLATE;
}

// Get search engine name from template
function getSearchEngineName(template: string): string {
  if (template.includes('duckduckgo.com')) return 'DuckDuckGo';
  if (template.includes('google.com')) return 'Google';
  if (template.includes('bing.com')) return 'Bing';
  if (template.includes('startpage.com')) return 'Startpage';
  if (template.includes('brave.com')) return 'Brave Search';
  return 'Search Engine';
}

// Handle omnibox input changes
chrome.omnibox.onInputChanged.addListener(async (text, suggest) => {
  const template = await getSearchTemplate();
  const engineName = getSearchEngineName(template);
  const suggestions = getSuggestions(text, engineName);
  suggest(suggestions);
});

// Handle omnibox input entered
chrome.omnibox.onInputEntered.addListener(async (text, disposition) => {
  const trimmed = text.trim();

  if (isUrl(trimmed)) {
    // Navigate to URL
    const url = normalizeUrl(trimmed);
    chrome.tabs.update({ url });
  } else {
    // Search
    const template = await getSearchTemplate();
    const searchUrl = template.replace('%s', encodeURIComponent(trimmed));
    chrome.tabs.update({ url: searchUrl });
  }
});
