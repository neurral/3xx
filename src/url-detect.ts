// URL detection and normalization utilities

/**
 * Checks if the input string looks like a navigable URL
 */
export function isUrl(input: string): boolean {
  // Trim whitespace
  const trimmed = input.trim();

  // Explicit protocols
  if (/^(https?|ftp|file):\/\//i.test(trimmed)) {
    return true;
  }

  // IPv6 literals (must be in brackets)
  if (/^\[[\da-f:]+?\]$/i.test(trimmed)) {
    return true;
  }

  // IPv4 addresses
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(trimmed)) {
    return true;
  }

  // Domain-like patterns: word.word or word.word.word etc., optionally with port/path/query
  // Allow localhost, intranet, etc. as long as they have a TLD or port
  if (
    /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*(:[0-9]+)?(\/.*)?(\?.*)?(#.*)?$/i.test(
      trimmed
    )
  ) {
    // Must have at least one dot (for TLD) or a port, or be localhost
    return (
      trimmed.includes('.') ||
      trimmed.includes(':') ||
      trimmed.toLowerCase().startsWith('localhost')
    );
  }

  return false;
}

/**
 * Normalizes a URL by adding https:// if no protocol is present
 */
export function normalizeUrl(input: string): string {
  const trimmed = input.trim();

  if (/^(https?|ftp|file):\/\//i.test(trimmed)) {
    return trimmed;
  }

  // For IPv6, add brackets if not present
  if (/^[\da-f:]+$/i.test(trimmed) && !trimmed.startsWith('[')) {
    return `https://[${trimmed}]`;
  }

  return `https://${trimmed}`;
}
