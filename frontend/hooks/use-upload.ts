"use client"

import { useState, useCallback } from 'react';
import { getCsrfTokenAsync } from '@/lib/csrf';
import { useToast } from './use-toast';

interface UploadOptions {
  endpoint: string;
  data: Record<string, any>;
  fileField?: string;
  file?: File | null;
  method?: 'POST' | 'PATCH';
}

interface UploadState {
  isLoading: boolean;
  error: Error | null;
  progress: number;
}

export function useUpload() {
  const { toast } = useToast();
  const [state, setState] = useState<UploadState>({
    isLoading: false,
    error: null,
    progress: 0,
  });

  const upload = useCallback(async (options: UploadOptions): Promise<any> => {
    const {
      endpoint,
      data,
      fileField = 'image',
      file = null,
      method = 'POST'
    } = options;

    setState({ isLoading: true, error: null, progress: 0 });

    try {
      // CSRF token olish
      const csrfToken = await getCsrfTokenAsync();
      if (!csrfToken) {
        throw new Error('CSRF token is missing. Cannot perform upload operation.');
      }

      // FormData yaratish
      const formData = new FormData();

      // Barcha text fieldlarni qo'shish
      Object.entries(data).forEach(([key, value]) => {
        if (key === fileField && file) return; // Fayl alohida qo'shiladi
        if (value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      // Fayl qo'shish (agar mavjud bo'lsa)
      if (file) {
        formData.append(fileField, file);
      }

      // Fetch request
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}${endpoint}`, {
        method,
        body: formData,
        headers: {
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      setState({ isLoading: false, error: null, progress: 100 });

      return result;
    } catch (error) {
      const errorObj = error as Error;
      setState({ isLoading: false, error: errorObj, progress: 0 });
      throw errorObj;
    }
  }, []);

  // Oson upload funksiyalari
  const uploadCategory = useCallback((data: any, file?: File) => {
    return upload({
      endpoint: '/categories/',
      data,
      fileField: 'image',
      file,
      method: 'POST'
    });
  }, [upload]);

  const updateCategory = useCallback((id: number, data: any, file?: File) => {
    return upload({
      endpoint: `/categories/${id}/`,
      data,
      fileField: 'image',
      file,
      method: 'PATCH'
    });
  }, [upload]);

  const uploadMenuItem = useCallback((data: any, file?: File) => {
    return upload({
      endpoint: '/menu-items/',
      data,
      fileField: 'image',
      file,
      method: 'POST'
    });
  }, [upload]);

  const updateMenuItem = useCallback((id: number, data: any, file?: File) => {
    return upload({
      endpoint: `/menu-items/${id}/`,
      data,
      fileField: 'image',
      file,
      method: 'PATCH'
    });
  }, [upload]);

  const uploadPromotion = useCallback((data: any, file?: File) => {
    return upload({
      endpoint: '/promotions/',
      data,
      fileField: 'image',
      file,
      method: 'POST'
    });
  }, [upload]);

  const updatePromotion = useCallback((id: number, data: any, file?: File) => {
    return upload({
      endpoint: `/promotions/${id}/`,
      data,
      fileField: 'image',
      file,
      method: 'PATCH'
    });
  }, [upload]);

  // Toast notification bilan upload
  const uploadWithToast = useCallback(async (
    options: UploadOptions,
    successMessage: string,
    errorMessage: string
  ): Promise<any> => {
    try {
      const result = await upload(options);
      toast({
        title: "✅ " + successMessage,
        description: "Successfully uploaded!",
      });
      return result;
    } catch (error) {
      toast({
        title: "❌ " + errorMessage,
        description: error instanceof Error ? error.message : "Upload failed",
        variant: "destructive",
      });
      throw error;
    }
  }, [upload, toast]);

  return {
    ...state,
    upload,
    uploadCategory,
    updateCategory,
    uploadMenuItem,
    updateMenuItem,
    uploadPromotion,
    updatePromotion,
    uploadWithToast,
  };
}

// Hook ishlatish misoli:
/*
function AdminComponent() {
  const { 
    uploadCategory, 
    uploadMenuItem, 
    uploadPromotion,
    isLoading, 
    error 
  } = useUpload();

  const handleCreateCategory = async (categoryData: any, imageFile: File) => {
    try {
      const result = await uploadCategory(categoryData, imageFile);
      console.log('Category created:', result);
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleCreateMenuItem = async (itemData: any, imageFile: File) => {
    try {
      const result = await uploadMenuItem(itemData, imageFile);
      console.log('Menu item created:', result);
    } catch (error) {
      console.error('Error creating menu item:', error);
    }
  };

  const handleCreatePromotion = async (promotionData: any, imageFile: File) => {
    try {
      const result = await uploadPromotion(promotionData, imageFile);
      console.log('Promotion created:', result);
    } catch (error) {
      console.error('Error creating promotion:', error);
    }
  };

  return (
    <div>
      {isLoading && <p>Uploading...</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
*/
