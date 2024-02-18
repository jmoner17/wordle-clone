import { useState, useEffect } from "react";

export const useUser = (supabase) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
        const {
            data: { user },
          } = await supabase.auth.getUser();
      if (user) {
        setUser(user ?? null);
      }
      setLoading(false);
    };

    fetchUser();
  }, [supabase]);

  return { user, loading };
};