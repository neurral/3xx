// Omnibox suggestion formatting

import { isUrl } from './url-detect.js';

export interface Suggestion {
  content: string;
  description: string;
}

/**
 * Generates suggestions for omnibox input
 */
export function getSuggestions(
  input: string,
  searchEngineName: string
): Suggestion[] {
  const trimmed = input.trim();

  if (!trimmed) {
    return [
      {
        content: '',
        description: 'Type a URL or search query'
      }
    ];
  }

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
