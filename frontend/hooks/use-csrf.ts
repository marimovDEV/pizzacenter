"use client"

import { useState, useEffect, useCallback } from 'react';

// Cookie-dan token olish uchun funksiya
function getCookie(name: string): string | null {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// API-dan CSRF token olish uchun funksiya
async function fetchCSRFToken(): Promise<string> {
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
  return '';
}

export function useCSRF() {
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Avval cookie-dan token olishga harakat qilish
  useEffect(() => {
    const tokenFromCookie = getCookie('csrftoken');
    if (tokenFromCookie) {
      setCsrfToken(tokenFromCookie);
    }
  }, []);

  // CSRF token olish uchun funksiya
  const getCSRFToken = useCallback(async (): Promise<string> => {
    setIsLoading(true);
    try {
      // Avval cookie-dan tekshirish
      const tokenFromCookie = getCookie('csrftoken');
      if (tokenFromCookie) {
        setCsrfToken(tokenFromCookie);
        setIsLoading(false);
        return tokenFromCookie;
      }

      // Agar cookie-da yo'q bo'lsa, API-dan olish
      const token = await fetchCSRFToken();
      setCsrfToken(token);
      return token;
    } catch (error) {
      console.error('Error getting CSRF token:', error);
      return '';
    } finally {
      setIsLoading(false);
    }
  }, [csrfToken]);

  // POST/PUT/DELETE so'rovlar uchun header tayyorlash
  const getCSRFHeaders = useCallback((): Record<string, string> => {
    const token = csrfToken || getCookie('csrftoken');
    return token ? { 'X-CSRFToken': token } : {};
  }, [csrfToken]);

  // So'rov yuborish uchun to'liq funksiya
  const makeAuthenticatedRequest = useCallback(async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {

    // Agar POST/PUT/DELETE bo'lsa, CSRF token kerak
    const method = options.method?.toUpperCase();
    if (method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      let token = csrfToken || getCookie('csrftoken');

      // Agar token yo'q bo'lsa, yangi olish
      if (!token) {
        token = await getCSRFToken();
      }

      // Headers-ga CSRF token qo'shish
      const headers = {
        // Faqat FormData bo'lmagan holatlarda Content-Type qo'shamiz
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token && { 'X-CSRFToken': token }),
        ...options.headers,
      };

      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      return response;
    }

    // GET so'rovlar uchun oddiy fetch
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
    });

    return response;
  }, [csrfToken, getCSRFToken]);

  return {
    csrfToken,
    isLoading,
    getCSRFToken,
    getCSRFHeaders,
    makeAuthenticatedRequest,
  };
}

// Hook ishlatish misoli:
/*
function MyComponent() {
  const { makeAuthenticatedRequest, isLoading } = useCSRF();

  const handleSubmit = async (data: any) => {
    try {
      const response = await makeAuthenticatedRequest(
        'http://192.168.1.11:8000/api/menu-items/',
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      
      if (response.ok) {
        // Success
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      {isLoading && <p>Loading CSRF token...</p>}
      <button onClick={() => handleSubmit({ name: 'Test' })}>
        Submit
      </button>
    </div>
  );
}
*/
