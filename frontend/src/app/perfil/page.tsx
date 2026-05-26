"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  useEffect(() => {
    redirect("/dashboard/profile");
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <p className="text-neutral-500 font-black uppercase tracking-[0.3em] text-xs">Redirecionando para seu Perfil Real...</p>
    </div>
  );
}
