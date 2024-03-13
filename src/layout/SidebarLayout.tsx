import Sidebar, { SidebarItem } from "../components/Sidebar";
import { QrCode, Trophy, Users } from "lucide-react";

type Props = {};

export default function SidebarLayout({ children }) {
  return (
    <main className="flex">
      <Sidebar>
        <SidebarItem
          icon={<Trophy size={20} />}
          text="Undian"
          path="/admin/undian"
        />
        <SidebarItem
          icon={<Users size={20} />}
          text="Data Peserta"
          path="/admin/data-peserta"
        />
        <SidebarItem
          icon={<QrCode size={20} />}
          text="QR Registrasi"
          path="/admin/qr-registrasi"
        />
      </Sidebar>
      <div className="flex-1 p-4">{children}</div>
    </main>
  );
}
