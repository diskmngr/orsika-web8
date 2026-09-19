import { AdminShell, type AdminSection } from "@/components/admin/AdminShell";
import { AspirationsManager } from "@/components/admin/AspirationsManager";
import { DivisionsManager } from "@/components/admin/DivisionsManager";
import { EventsManager } from "@/components/admin/EventsManager";
import { OfficersManager } from "@/components/admin/OfficersManager";
import { Overview } from "@/components/admin/Overview";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState<AdminSection>("ringkasan");
  const aspirations = useQuery(api.orsika.listAspirations);

  const pendingCount = (aspirations ?? []).filter(
    (item) => item.status === "baru",
  ).length;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const userName = user?.name ?? user?.email ?? "Pengurus";

  return (
    <AdminShell
      active={section}
      onNavigate={setSection}
      userName={userName}
      userEmail={user?.email ?? undefined}
      onSignOut={handleSignOut}
      pendingAspirations={pendingCount}
    >
      {section === "ringkasan" && (
        <Overview userName={userName} onNavigate={setSection} />
      )}
      {section === "kegiatan" && <EventsManager />}
      {section === "kepengurusan" && <OfficersManager />}
      {section === "bidang" && <DivisionsManager />}
      {section === "aspirasi" && <AspirationsManager />}
    </AdminShell>
  );
}
