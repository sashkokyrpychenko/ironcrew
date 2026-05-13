import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import Auth from "./Auth";
import IronCrew from "./IronCrew";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  if (loading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#0a0a0a",color:"#e8ff47",fontFamily:"'Bebas Neue',sans-serif",fontSize:32,letterSpacing:2}}>
      IRONCREW...
    </div>
  );

  return user ? <IronCrew user={user} /> : <Auth onLogin={() => {}} />;
}
