
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  Shield, 
  CheckSquare, 
  FileText, 
  Briefcase,
  Clock,
  User
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, href, active }) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
};

export function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="hidden lg:flex flex-col gap-6 border-r bg-background px-2 py-4 h-full">
      <div className="flex flex-col gap-1">
        <h2 className="px-4 text-lg font-semibold">Navigation</h2>
        <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/dashboard" active={pathname === '/dashboard'} />
        <SidebarItem icon={Users} label="Users" href="/users" active={pathname === '/users'} />
        <SidebarItem icon={ClipboardList} label="Access Requests" href="/requests" active={pathname === '/requests'} />
        <SidebarItem icon={Shield} label="Access Reviews" href="/reviews" active={pathname === '/reviews'} />
        <SidebarItem icon={CheckSquare} label="Approvals" href="/approvals" active={pathname === '/approvals'} />
        <SidebarItem icon={FileText} label="Reports" href="/reports" active={pathname === '/reports'} />
        <SidebarItem icon={Briefcase} label="Job Functions" href="/job-functions" active={pathname === '/job-functions'} />
        <SidebarItem icon={Clock} label="Audit Logs" href="/audit-logs" active={pathname === '/audit-logs'} />
      </div>
      <div className="mt-auto">
        <SidebarItem icon={User} label="Profile" href="/profile" active={pathname === '/profile'} />
      </div>
    </div>
  );
}
