let razorpayPromise: Promise<void> | null = null;

export const loadRazorpay = (): Promise<void> => {
  if (window.Razorpay) return Promise.resolve();
  if (razorpayPromise) return razorpayPromise;

  razorpayPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      razorpayPromise = null;
      reject(new Error("Failed to load Razorpay"));
    };
    document.body.appendChild(script);
  });

  return razorpayPromise;
};
