// CSRF token utility functions

// Cookie-dan CSRF token olish
export function getCsrfToken(): string | null {
  if (typeof document === "undefined") return null;

  const name = "csrftoken=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(";");

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name)) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null;
}

// API-dan CSRF token olish
export async function fetchCsrfToken(): Promise<string | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/csrf/`, {
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      return data.csrfToken;
    }
  } catch (error) {
    console.warn('Failed to fetch CSRF token:', error);
  }
  return null;
}

// CSRF token olish (cookie-dan yoki API-dan)
export async function getCsrfTokenAsync(): Promise<string | null> {
  // Avval cookie-dan tekshirish
  const tokenFromCookie = getCsrfToken();
  if (tokenFromCookie) {
    return tokenFromCookie;
  }

  // Agar cookie-da yo'q bo'lsa, API-dan olish
  return await fetchCsrfToken();
}

// CSRF headers tayyorlash
export function getCsrfHeaders(): Record<string, string> {
  const token = getCsrfToken();
  return token ? { 'X-CSRFToken': token } : {};
}

// CSRF headers tayyorlash (async)
export async function getCsrfHeadersAsync(): Promise<Record<string, string>> {
  const token = await getCsrfTokenAsync();
  return token ? { 'X-CSRFToken': token } : {};
}
