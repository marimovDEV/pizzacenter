import {
  MenuItem,
  Category,
  Order,
  Cart,
  Promotion,
  Review,
  Feedback,
  SiteSettings,
  RestaurantInfo,
  TextContent,
  FeaturedDish
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Re-export types for convenience
export type {
  MenuItem,
  Category,
  Order,
  Cart,
  Promotion,
  Review,
  Feedback,
  SiteSettings,
  RestaurantInfo,
  TextContent,
  FeaturedDish
};

// API functions
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async getCsrfToken(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/csrf/`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        return data.csrfToken;
      }
    } catch (error) {
      console.warn('Failed to get CSRF token:', error);
    }
    return '';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}, parseJson: boolean = true, retries: number = 2): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // Get CSRF token for POST/PUT/DELETE requests
    let csrfToken = '';
    if (options.method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method.toUpperCase())) {
      csrfToken = await this.getCsrfToken();
    }

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(url, {
        headers: {
          // Only set Content-Type for JSON requests, not for FormData
          ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
          ...(csrfToken && { 'X-CSRFToken': csrfToken }),
          ...options.headers,
        },
        credentials: 'include', // Include cookies for session management
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.text();
          if (errorData) {
            errorMessage += ` - ${errorData}`;
          }
        } catch (e) {
          // Ignore parsing errors
        }

        // Retry for server errors (5xx) or network issues
        if (retries > 0 && (response.status >= 500 || response.status === 0)) {
          console.warn(`Retrying request to ${endpoint}, attempts left: ${retries}`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (3 - retries))); // Exponential backoff
          return this.request<T>(endpoint, options, parseJson, retries - 1);
        }

        throw new Error(errorMessage);
      }

      // Don't try to parse JSON for DELETE requests that return 204 No Content
      if (!parseJson || response.status === 204) {
        return undefined as T;
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle unknown error type in TS 4.4+
      const err = error as Error;

      // Retry for network errors or timeouts
      if (retries > 0 && (err.name === 'AbortError' || err.name === 'TypeError')) {
        console.warn(`Retrying request to ${endpoint}, attempts left: ${retries}`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (3 - retries))); // Exponential backoff
        return this.request<T>(endpoint, options, parseJson, retries - 1);
      }

      throw error;
    }
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const response = await this.request<{ results: Category[] }>('/categories/');
    return response.results;
  }

  async getCategory(id: number): Promise<Category> {
    return this.request<Category>(`/categories/${id}/`);
  }

  async createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'> & { imageFile?: File }): Promise<Category> {
    const formData = new FormData();
    Object.entries(category).forEach(([key, value]) => {
      if (key === 'imageFile') return;
      if (key === 'image' && !value) return;
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    if (category.imageFile) {
      formData.append('image', category.imageFile);
    }

    return this.request<Category>('/categories/', {
      method: 'POST',
      body: formData,
    });
  }

  async updateCategory(id: number, category: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>> & { imageFile?: File }): Promise<Category> {
    const formData = new FormData();
    Object.entries(category).forEach(([key, value]) => {
      if (key === 'imageFile') return;
      if (key === 'image' && !value) return;
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    if (category.imageFile) {
      formData.append('image', category.imageFile);
    }

    return this.request<Category>(`/categories/${id}/`, {
      method: 'PATCH',
      body: formData,
    });
  }

  async deleteCategory(id: number): Promise<void> {
    await this.request<void>(`/categories/${id}/`, {
      method: 'DELETE',
    });
  }

  // Menu Items
  async getMenuItems(): Promise<MenuItem[]> {
    const response = await this.request<{ results: MenuItem[] }>('/menu-items/');
    return response.results;
  }

  async getMenuItem(id: number): Promise<MenuItem> {
    return this.request<MenuItem>(`/menu-items/${id}/`);
  }

  async createMenuItem(menuItem: Omit<MenuItem, 'id' | 'created_at' | 'updated_at' | 'category_name' | 'category_name_uz' | 'category_name_ru'> & { imageFile?: File }): Promise<MenuItem> {
    const formData = new FormData();
    Object.entries(menuItem).forEach(([key, value]) => {
      if (key === 'imageFile') return;
      if (key === 'image' && !value) return;
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    if (menuItem.imageFile) {
      formData.append('image', menuItem.imageFile);
    }

    return this.request<MenuItem>('/menu-items/', {
      method: 'POST',
      body: formData,
    });
  }

  async updateMenuItem(id: number, menuItem: Partial<Omit<MenuItem, 'id' | 'created_at' | 'updated_at' | 'category_name' | 'category_name_uz' | 'category_name_ru'>> & { imageFile?: File }): Promise<MenuItem> {
    const formData = new FormData();
    Object.entries(menuItem).forEach(([key, value]) => {
      if (key === 'imageFile') return;
      if (key === 'image' && !value) return;
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    if (menuItem.imageFile) {
      formData.append('image', menuItem.imageFile);
    }

    return this.request<MenuItem>(`/menu-items/${id}/`, {
      method: 'PATCH',
      body: formData,
    });
  }

  async deleteMenuItem(id: number): Promise<void> {
    await this.request<void>(`/menu-items/${id}/`, {
      method: 'DELETE',
    });
  }

  async getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]> {
    const response = await this.request<{ results: MenuItem[] }>(`/categories/${categoryId}/menu-items/`);
    return response.results;
  }

  async searchMenuItems(query: string, categoryId?: number): Promise<MenuItem[]> {
    const params = new URLSearchParams({ q: query });
    if (categoryId) {
      params.append('category', categoryId.toString());
    }
    return this.request<MenuItem[]>(`/search/?${params}`);
  }

  // Promotions
  async getPromotions(): Promise<Promotion[]> {
    const response = await this.request<{ results: Promotion[] }>('/promotions/');
    return response.results;
  }

  async getPromotion(id: number): Promise<Promotion> {
    return this.request<Promotion>(`/promotions/${id}/`);
  }

  async createPromotion(promotion: Omit<Promotion, 'id' | 'created_at' | 'updated_at' | 'category_name'> & { imageFile?: File }): Promise<Promotion> {
    const formData = new FormData();
    Object.entries(promotion).forEach(([key, value]) => {
      if (key === 'imageFile') return;
      if (key === 'image' && !value) return;
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    if (promotion.imageFile) {
      formData.append('image', promotion.imageFile);
    }

    return this.request<Promotion>('/promotions/', {
      method: 'POST',
      body: formData,
    });
  }

  async updatePromotion(id: number, promotion: Partial<Omit<Promotion, 'id' | 'created_at' | 'updated_at' | 'category_name'>> & { imageFile?: File }): Promise<Promotion> {
    const formData = new FormData();
    Object.entries(promotion).forEach(([key, value]) => {
      if (key === 'imageFile') return;
      if (key === 'image' && !value) return;
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    if (promotion.imageFile) {
      formData.append('image', promotion.imageFile);
    }

    return this.request<Promotion>(`/promotions/${id}/`, {
      method: 'PATCH',
      body: formData,
    });
  }

  async deletePromotion(id: number): Promise<void> {
    await this.request<void>(`/promotions/${id}/`, {
      method: 'DELETE',
    });
  }

  // Reviews & Feedback
  async getReviews(): Promise<Review[]> {
    const response = await this.request<{ results: Review[] }>('/reviews/');
    return response.results;
  }

  async getAllFeedbacks(): Promise<Feedback[]> {
    const response = await this.request<{ results: Feedback[] }>('/feedback/');
    return response.results;
  }

  async createFeedback(feedback: Omit<Feedback, 'id' | 'created_at' | 'updated_at'>): Promise<Feedback> {
    return this.request<Feedback>('/feedback/', {
      method: 'POST',
      body: JSON.stringify(feedback),
    });
  }

  async deleteFeedback(id: number): Promise<void> {
    return this.request<void>(`/feedback/${id}/`, {
      method: 'DELETE',
    });
  }

  async createReview(review: Omit<Review, 'id' | 'date' | 'approved'>): Promise<Review> {
    return this.request<Review>('/reviews/', {
      method: 'POST',
      body: JSON.stringify(review),
    });
  }

  async updateReview(id: number, data: Partial<Review>): Promise<Review> {
    return this.request<Review>(`/reviews/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteReview(id: number): Promise<void> {
    await this.request<void>(`/reviews/${id}/`, {
      method: 'DELETE',
    }, false);
  }

  // Admin Carts & Orders
  async getAllCarts(): Promise<any[]> {
    return this.request<any[]>('/admin/carts/');
  }

  async clearAdminCart(cartId?: number): Promise<void> {
    const url = cartId ? `/admin/carts/${cartId}/` : '/admin/carts/';
    await this.request<void>(url, {
      method: 'DELETE',
    }, false);
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    const response = await this.request<{ results: Order[] }>('/orders/');
    return response.results;
  }

  async getOrder(id: number): Promise<Order> {
    return this.request<Order>(`/orders/${id}/`);
  }

  async createOrder(order: {
    table_number: number;
    customer_name?: string;
    notes?: string;
    items: {
      menu_item: number;
      quantity: number;
      notes?: string;
    }[];
  }): Promise<Order> {
    return this.request<Order>('/orders/', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  async updateOrderStatus(id: number, status: Order['status']): Promise<Order> {
    return this.request<Order>(`/orders/${id}/status/`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Stats & Settings
  async getStats(): Promise<{
    total_categories: number;
    total_menu_items: number;
    available_menu_items: number;
    total_promotions: number;
    total_reviews: number;
    average_rating: number;
  }> {
    return this.request('/stats/');
  }

  async getFeaturedDishes(): Promise<FeaturedDish[]> {
    const response = await this.request<{ results: FeaturedDish[] }>('/featured-dishes/');
    return response.results;
  }

  async getSiteSettings(): Promise<SiteSettings> {
    return this.request<SiteSettings>('/site-settings/');
  }

  async getRestaurantInfo(): Promise<RestaurantInfo> {
    return this.request<RestaurantInfo>('/restaurant-info/');
  }

  // User Cart
  async getCart(): Promise<Cart> {
    try {
      return await this.request<Cart>('/cart/');
    } catch (error) {
      const err = error as Error;
      if (err.message && err.message.includes('404')) {
        return {
          id: 0,
          session_key: '',
          table_number: null,
          customer_name: null,
          notes: null,
          total_items: 0,
          total_price: 0,
          items: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      throw error;
    }
  }

  async addToCart(data: {
    menu_item_id: number;
    quantity: number;
    notes?: string;
  }): Promise<Cart> {
    return this.request<Cart>('/cart/add/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCartItem(itemId: number, data: {
    quantity?: number;
    notes?: string;
  }): Promise<Cart> {
    return this.request<Cart>(`/cart/items/${itemId}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async removeFromCart(itemId: number): Promise<Cart> {
    return this.request<Cart>(`/cart/items/${itemId}/`, {
      method: 'DELETE',
    });
  }

  async clearCart(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/cart/', {
      method: 'DELETE',
    });
  }

  async createOrderFromCart(data: {
    table_number: number;
    customer_name?: string;
    notes?: string;
  }): Promise<Order> {
    return this.request<Order>('/cart/order/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();

// Utils
export const formatPrice = (price: number): string => {
  return `${Math.round(price).toLocaleString("uz-UZ")} so'm`;
};

export const formatWeight = (weight: number): string => {
  return `${Math.round(weight)}г`;
};

export const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '/placeholder.svg';
  if (imagePath.startsWith('http') || imagePath.startsWith('data:') || imagePath.startsWith('blob:')) return imagePath;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  const backendUrl = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;

  // Ensure we don't end up with double slashes if backendUrl ends with / or path starts with /
  const cleanBackendUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  if (path === '/logo.png') return `${cleanBackendUrl}/static/logo.png`;
  return `${cleanBackendUrl}${path}`;
};
