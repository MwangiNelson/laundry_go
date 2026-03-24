"use client";

import { User } from "@supabase/supabase-js";
import React, { Dispatch, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createSupabaseClient } from "@/api/supabase/client";
import { IUser, useGetUser } from "@/api/auth/use_auth";

export interface IAuthContext {
  auth_user: User | null;
  setAuthUser: Dispatch<User | null>;
  vendor_id: string | undefined;
  setVendorId: Dispatch<string | undefined>;
  user: IUser | undefined;
  loading: boolean;
  logout: () => Promise<void>;
  fetchUser: () => void;
  clearState: () => void;
  loggedIn: boolean;
}

const AuthContext = React.createContext<IAuthContext | null>(null);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [auth_user, setAuthUser] = useState<User | null>(null);
  const [vendor_id, setVendorId] = useState<string | undefined>(undefined);
  const [authInitialized, setAuthInitialized] = useState(false);
  const { data: user, isPending, refetch } = useGetUser(auth_user?.id);
  const supabaseRef = useRef(createSupabaseClient());
  const loading = !authInitialized || (auth_user !== null && isPending);
  const loggedIn = Boolean(auth_user && user);
  const clearState = useCallback(() => {
    setAuthUser(null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabaseRef.current.auth.signOut();
      setAuthUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, []);

  useEffect(() => {
    const supabase = supabaseRef.current;

    // Set up auth state listener first so we don't miss events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setAuthUser(null);
      } else if (session?.user) {
        setAuthUser(session.user);
      }
    });

    // Then initialize current auth state
    const initializeAuth = async () => {
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (!sessionData.session || sessionError) {
          setAuthUser(null);
          setAuthInitialized(true);
          return;
        }

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          console.error("Auth error:", authError);
          setAuthUser(null);
        } else {
          setAuthUser(user);
        }
        setAuthInitialized(true);
      } catch (error) {
        console.error("Auth initialization error:", error);
        setAuthUser(null);
        setAuthInitialized(true);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const contextValue = useMemo<IAuthContext>(
    () => ({
      auth_user,
      setAuthUser,
      user,
      loading: loading ?? false,
      logout,
      fetchUser: refetch,
      clearState,
      loggedIn,
      vendor_id,
      setVendorId,
    }),
    [auth_user, user, loading, logout, refetch, clearState, loggedIn, vendor_id]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
