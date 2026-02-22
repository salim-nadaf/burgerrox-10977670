export const FB_PIXEL_ID = '1524642025268726';

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

export const pageView = () => {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'PageView');
  }
};

export const trackViewContent = (contentName: string, value?: number, currency = 'INR') => {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'ViewContent', {
      content_name: contentName,
      ...(value !== undefined && { value, currency }),
    });
  }
};

export const trackAddToCart = (contentName: string, value: number, currency = 'INR') => {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'AddToCart', {
      content_name: contentName,
      value,
      currency,
      contents: [{ id: contentName, quantity: 1 }],
      content_type: 'product',
    });
  }
};

export const trackInitiateCheckout = (
  value: number,
  numItems: number,
  contents: { id: string; quantity: number }[] = [],
  currency = 'INR'
) => {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'InitiateCheckout', {
      value,
      currency,
      num_items: numItems,
      contents,
      content_type: 'product',
    });
  }
};

export const trackPurchase = (
  value: number,
  contents: { id: string; quantity: number }[] = [],
  currency = 'INR'
) => {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Purchase', {
      value,
      currency,
      contents,
      content_type: 'product',
    });
  }
};
