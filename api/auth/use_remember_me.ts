"use client";

export const useRememberMe = () => {
  const getRememberedEmail = (): string | null => {
    if (typeof window === "undefined") return null;

    const rememberMe = localStorage.getItem("rememberMe");
    const expirationStr = localStorage.getItem("rememberMeExpiration");
    const email = localStorage.getItem("lastSignedInEmail");

    if (!rememberMe || !expirationStr || !email) {
      return null;
    }

    // Check if remember me has expired
    const expirationDate = new Date(expirationStr);
    if (new Date() > expirationDate) {
      clearRememberMe();
      return null;
    }

    return email;
  };

  const clearRememberMe = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("lastSignedInEmail");
    localStorage.removeItem("rememberMeExpiration");
  };

  const isRemembered = (): boolean => {
    return getRememberedEmail() !== null;
  };

  return {
    getRememberedEmail,
    clearRememberMe,
    isRemembered,
  };
};
