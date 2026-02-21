// Meta Pixel (Facebook Pixel) utility
// Pixel ID: 715141415840716

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    _fbq: (...args: any[]) => void;
  }
}

export const FB_PIXEL_ID = '715141415840716';

export const pageView = () => {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'PageView');
  }
};

export const trackViewContent = (contentName: string, contentCategory: string) => {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'ViewContent', {
      content_name: contentName,
      content_category: contentCategory,
    });
  }
};

export const trackAddToCart = (itemName: string, price: number, currency = 'INR') => {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'AddToCart', {
      content_name: itemName,
      value: price,
      currency,
    });
  }
};

export const trackInitiateCheckout = (totalValue: number, numItems: number, currency = 'INR') => {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'InitiateCheckout', {
      value: totalValue,
      currency,
      num_items: numItems,
    });
  }
};

export const trackPurchase = (orderId: string, totalValue: number, currency = 'INR') => {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Purchase', {
      value: totalValue,
      currency,
      content_name: orderId,
    });
  }
};
