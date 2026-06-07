import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

interface UserSession {
  id: string;
  email: string;
  venueId?: string;
  venueName?: string;
}

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, venueName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
      }

      const fetchVenueData = async (userId: string) => {
        try {
          const { data: venueData, error: venueError } = await supabase
            .from('venues')
            .select('id, name')
            .eq('owner_id', userId)
            .maybeSingle();
          
          if (venueData && !venueError) {
            return { venueId: venueData.id, venueName: venueData.name };
          }
        } catch (e) {
          console.error('Failed to load registered venue:', e);
        }
        return { venueId: '', venueName: '' };
      };

      if (session?.user) {
        const { venueId, venueName } = await fetchVenueData(session.user.id);
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          venueId,
          venueName,
        });
      } else {
        setUser(null);
      }
      setLoading(false);

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (session?.user) {
            const { venueId, venueName } = await fetchVenueData(session.user.id);
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              venueId,
              venueName,
            });
          } else {
            setUser(null);
          }
          setLoading(false);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data?.user) {
      const { data: venueData } = await supabase
        .from('venues')
        .select('id, name')
        .eq('owner_id', data.user.id)
        .maybeSingle();

      setUser({
        id: data.user.id,
        email: data.user.email || '',
        venueId: venueData?.id || '',
        venueName: venueData?.name || '',
      });
    }
  };

  const signUp = async (email: string, password: string, venueName: string) => {
    console.log('1. [signUp] Calling supabase.auth.signUp for:', email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    console.log('2. [signUp] auth.signUp response:', { data, error });

    if (error) {
      throw new Error(error.message);
    }

    if (data?.user) {
      console.log('3. [signUp] User created. Attempting venue insert for owner_id:', data.user.id);
      const { data: venueData, error: venueError } = await supabase
        .from('venues')
        .insert({ 
          name: venueName, 
          owner_id: data.user.id,
          slug: venueName.toLowerCase().replace(/\s+/g, '-')
        })
        .select()
        .single();

      console.log('4. [signUp] Venue insert result:', { data: venueData, error: venueError });

      if (venueError) {
        console.error('Error inserting venue row:', venueError.message);
      }

      setUser({
        id: data.user.id,
        email: data.user.email || '',
        venueId: venueData?.id || '',
        venueName: venueName,
      });
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}
