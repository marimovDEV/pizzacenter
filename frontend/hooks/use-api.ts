"use client"

import { useCSRF } from './use-csrf';
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  MenuItem,
  Category,
  Promotion,
  Review,
  RestaurantInfo,
  SiteSettings,
  Feedback
} from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// API client hook - CSRF token bilan avtomatik ishlaydi
export function useApiClient() {
  const { makeAuthenticatedRequest, isLoading: csrfLoading } = useCSRF();

  const apiClient = useMemo(() => ({
    // GET so'rovlar
    async get<T>(endpoint: string): Promise<T> {
      // Cache-busting uchun timestamp qo'shish
      const timestamp = new Date().getTime();
      const random = Math.random().toString(36).substring(7);
      const separator = endpoint.includes('?') ? '&' : '?';
      const url = `${API_URL}${endpoint}${separator}t=${timestamp}&r=${random}`;

      let lastError;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            cache: 'no-cache',
            signal: AbortSignal.timeout(10000), // 10 second timeout
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
          }

          return await response.json() as T;
        } catch (error) {
          lastError = error;
          const err = error as Error;

          // Don't retry on client errors (4xx) or specific server errors
          if (err.message && (
            err.message.includes('400') || err.message.includes('401') ||
            err.message.includes('403') || err.message.includes('404') ||
            err.message.includes('500')
          )) {
            throw error;
          }

          if (attempt < 3) {
            await new Promise(resolve => setTimeout(resolve, attempt * 1000));
          }
        }
      }

      throw lastError;
    },

    // POST so'rovlar
    async post<T>(endpoint: string, data: any): Promise<T> {
      const response = await makeAuthenticatedRequest(
        `${API_URL}${endpoint}`,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      if (response.status === 204) return undefined as any as T;
      const text = await response.text();
      return (text ? JSON.parse(text) : undefined) as T;
    },

    // PUT so'rovlar
    async put<T>(endpoint: string, data: any): Promise<T> {
      const response = await makeAuthenticatedRequest(
        `${API_URL}${endpoint}`,
        {
          method: 'PUT',
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      if (response.status === 204) return undefined as any as T;
      const text = await response.text();
      return (text ? JSON.parse(text) : undefined) as T;
    },

    // PATCH so'rovlar
    async patch<T>(endpoint: string, data: any): Promise<T> {
      const response = await makeAuthenticatedRequest(
        `${API_URL}${endpoint}`,
        {
          method: 'PATCH',
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      if (response.status === 204) return undefined as any as T;
      const text = await response.text();
      return (text ? JSON.parse(text) : undefined) as T;
    },

    // DELETE so'rovlar
    async delete(endpoint: string): Promise<void> {
      const response = await makeAuthenticatedRequest(
        `${API_URL}${endpoint}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }
    },

    // FormData bilan so'rovlar (fayl yuklash uchun)
    async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
      const response = await makeAuthenticatedRequest(
        `${API_URL}${endpoint}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      if (response.status === 204) return undefined as any as T;
      const text = await response.text();
      return (text ? JSON.parse(text) : undefined) as T;
    },

    // PATCH FormData bilan
    async patchFormData<T>(endpoint: string, formData: FormData): Promise<T> {
      const response = await makeAuthenticatedRequest(
        `${API_URL}${endpoint}`,
        {
          method: 'PATCH',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      if (response.status === 204) return undefined as any as T;
      const text = await response.text();
      return (text ? JSON.parse(text) : undefined) as T;
    },
  }), [makeAuthenticatedRequest]);

  return {
    ...apiClient,
    get: apiClient.get,
    isLoading: csrfLoading,
  };
}

// Reviews hook
export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/reviews/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const approvedReviews = (data.results || []).filter(
          (review: Review) => review.approved && !review.deleted
        );
        setReviews(approvedReviews);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return { reviews, loading, error };
}

// Restaurant Info hook
export function useRestaurantInfo() {
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRestaurantInfo = async () => {
      try {
        setLoading(true);
        const timestamp = new Date().getTime();
        const response = await fetch(`${API_URL}/restaurant-info/?t=${timestamp}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          cache: 'no-cache',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setRestaurantInfo(data || null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantInfo();
  }, []);

  return { restaurantInfo, loading, error };
}


// Site Settings hook
export function useSiteSettings() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        setLoading(true);
        const timestamp = new Date().getTime();
        const response = await fetch(`${API_URL}/site-settings/?t=${timestamp}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          cache: 'no-cache',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setSiteSettings(data || null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteSettings();
  }, []);

  return { siteSettings, loading, error };
}

// Categories hook
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  const fetchCategories = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && now - lastFetchTime < 5000) return;

    try {
      setLoading(true);
      setError(null);
      const timestamp = new Date().getTime();
      const response = await fetch(`${API_URL}/categories/?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        cache: 'no-cache',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const items = Array.isArray(data) ? data : (data.results || []);
      setCategories(items as Category[]);
      setLastFetchTime(now);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [lastFetchTime]);

  useEffect(() => {
    fetchCategories(true);
  }, []);

  const refetch = useCallback(() => {
    fetchCategories(true);
  }, [fetchCategories]);

  return { categories, loading, error, refetch };
}

// Admin Categories hook
export function useAdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const timestamp = new Date().getTime();
      const response = await fetch(`${API_URL}/categories/?show_all=true&t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        cache: 'no-cache',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const items = Array.isArray(data) ? data : (data.results || []);
      setCategories(items as Category[]);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const refetch = useCallback(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch };
}

// Menu Items hook
export function useMenuItems() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  const fetchMenuItems = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && now - lastFetchTime < 5000) return;

    try {
      setLoading(true);
      setError(null);
      const timestamp = new Date().getTime();
      const response = await fetch(`${API_URL}/menu-items/?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        cache: 'no-cache',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const items = Array.isArray(data) ? data : (data.results || []);
      setMenuItems(items as MenuItem[]);
      setLastFetchTime(now);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [lastFetchTime]);

  useEffect(() => {
    fetchMenuItems(true);
  }, []);

  const refetch = useCallback(() => {
    fetchMenuItems(true);
  }, [fetchMenuItems]);

  return { menuItems, loading, error, refetch };
}

// Admin Menu Items hook
export function useAdminMenuItems() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  const fetchMenuItems = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && now - lastFetchTime < 5000) return;

    try {
      setLoading(true);
      setError(null);
      const timestamp = new Date().getTime();
      const response = await fetch(`${API_URL}/menu-items/?show_all=true&t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        cache: 'no-cache',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const items = Array.isArray(data) ? data : (data.results || []);
      setMenuItems(items as MenuItem[]);
      setLastFetchTime(now);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [lastFetchTime]);

  useEffect(() => {
    fetchMenuItems(true);
  }, []);

  const refetch = useCallback(() => {
    fetchMenuItems(true);
  }, [fetchMenuItems]);

  return { menuItems, loading, error, refetch };
}

// Single Menu Item hook
export function useMenuItem(id: string | number) {
  const { get } = useApiClient();
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchMenuItem = async () => {
      try {
        setLoading(true);
        const response = await get<MenuItem>(`/menu-items/${id}/`);
        setMenuItem(response);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItem();
  }, [id, get]);

  return { menuItem, loading, error };
}

// Promotions hook
export function usePromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  const fetchPromotions = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && now - lastFetchTime < 5000) return;

    try {
      setLoading(true);
      setError(null);
      const timestamp = new Date().getTime();
      const response = await fetch(`${API_URL}/promotions/?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        cache: 'no-cache',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const items = Array.isArray(data) ? data : (data.results || []);
      setPromotions(items as Promotion[]);
      setLastFetchTime(now);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [lastFetchTime]);

  useEffect(() => {
    fetchPromotions(true);
  }, []);

  const refetch = useCallback(() => {
    fetchPromotions(true);
  }, [fetchPromotions]);

  return { promotions, loading, error, refetch };
}

// Admin Orders hook
export function useAdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const timestamp = new Date().getTime();
      const response = await fetch(`${API_URL}/orders/?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        cache: 'no-cache',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const items = Array.isArray(data) ? data : (data.results || []);
      setOrders(items as Order[]);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const refetch = useCallback(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch };
}

// Admin Reviews hook (shows all, including unapproved)
export function useAdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const timestamp = new Date().getTime();
      const response = await fetch(`${API_URL}/admin/reviews/?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        cache: 'no-cache',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const items = Array.isArray(data) ? data : (data.results || []);
      setReviews(items as Review[]);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const refetch = useCallback(() => {
    fetchReviews();
  }, [fetchReviews]);

  return { reviews, loading, error, refetch };
}

// Admin Feedback hook
export function useAdminFeedback() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFeedback = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const timestamp = new Date().getTime();
      const response = await fetch(`${API_URL}/feedback/?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        cache: 'no-cache',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const items = Array.isArray(data) ? data : (data.results || []);
      setFeedback(items as Feedback[]);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const refetch = useCallback(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  return { feedback, loading, error, refetch };
}

// Admin Site Settings hook (for editing)
export function useAdminSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const timestamp = new Date().getTime();
      const response = await fetch(`${API_URL}/site-settings/?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        cache: 'no-cache',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setSettings(data || null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const refetch = useCallback(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { settings, loading, error, refetch };
}

// Admin Restaurant Info hook (for editing)
export function useAdminRestaurantInfo() {
  const [info, setInfo] = useState<RestaurantInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const timestamp = new Date().getTime();
      const response = await fetch(`${API_URL}/restaurant-info/?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        cache: 'no-cache',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setInfo(data || null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo]);

  const refetch = useCallback(() => {
    fetchInfo();
  }, [fetchInfo]);

  return { info, loading, error, refetch };
}