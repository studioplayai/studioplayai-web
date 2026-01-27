
import React from 'react';

export enum ToolCategory {
    Auto = 'auto',
    Ideas = 'ideas',
    Editing = 'editing',
    Creation = 'creation',
    Accessories = 'accessories',
    Typography = 'typography',
    ECommerce = 'ecommerce',
    Video = 'video',
    Publish = 'publish',
    StyleStudio = 'stylestudio',
}

export type MediaType = 'image' | 'video' | 'text' | 'bundle';

export type FieldType = 'textarea' | 'select' | 'text' | 'buttongroup' | 'toggle';

export interface ToolField {
    id: string;
    label: string;
    type: FieldType;
    group: string; // Group name for UI rendering
    placeholder?: string;
    options?: { value: string; label:string; }[];
    columns?: 1 | 2; // For side-by-side fields
    defaultValue?: string | boolean | number;
    icon?: React.ComponentType<{ className?: string }>;
}
export interface Tool {
    id: string;
    icon: React.ComponentType<{ className?: string }>;
    name: string;
    desc: string;
    isPro?: boolean;
    media: MediaType;
    prompt: string;
    category: ToolCategory;
    fields?: ToolField[];
    loadingText?: string;
}

export interface ToastMessage {
    message: string;
    type: 'success' | 'error' | 'info';
}

export interface MediaBundle {
    post: string; // base64 square
    story: string; // base64 vertical
    cover: string; // base64 landscape
    captions: {
        headline: string;
        body: string;
        hashtags: string;
    };
}

export interface GalleryItem {
    id: string;
    timestamp: number;
    type: MediaType;
    data: string; // For bundle, this will be a JSON string of MediaBundle
    prompt: string;
    sourceData?: string;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  emailVerified: boolean;
}

declare global {
    interface AIStudio {
        hasSelectedApiKey: () => Promise<boolean>;
        openSelectKey: () => Promise<void>;
    }

    interface Window {
        aistudio?: AIStudio;
        webkitAudioContext?: typeof AudioContext;
    }
}
export type User = {
  id: string;
  email: string;
  name?: string | null;
  role?: "user" | "admin" | string;
  plan?: "free" | "basic" | "pro" | "max" | "agency" | string;
  credits?: number;
  joinedAt?: number | string;
  lastSeen?: number | string;
currentActivity?: any;


  
};

export type Transaction = {
  id?: string;
  userId?: string;
  type?: string;
  amount?: number;
  status?: string;
  createdAt?: string;
  raw?: any;
};


