import React from 'react';
import { Button } from "../../../components/ui/button";
import { cn } from "../../../components/lib/utils";
import { 
  Home,
  Users, 
  Calendar, 
  Video, 
  FileText, 
  Activity,
  Settings,
  LogOut,
  BarChart3
} from 'lucide-react';

const DashboardSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { 
      id: 'overview', 
      label: 'Dashboard Overview', 
      icon: Home,
      description: 'Main dashboard view'
    },
    { 
      id: 'patients', 
      label: 'Patient List', 
      icon: Users,
      description: 'Manage all patients'
    },
    { 
      id: 'schedule', 
      label: 'Appointments', 
      icon: Calendar,
      description: 'Schedule & calendar'
    },
    { 
      id: 'video', 
      label: 'Video Consultation', 
      icon: Video,
      description: 'Virtual consultations'
    },
    { 
      id: 'records', 
      label: 'Patient Records', 
      icon: FileText,
      description: 'Medical records & history'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3,
      description: 'Reports & insights'
    },
  ];

  return (
    <aside className="w-72 bg-white/95 backdrop-blur-sm border-r border-medical-border shadow-medical h-[calc(100vh-88px)] sticky top-[88px]">
      <div className="p-6 h-full flex flex-col">
        {/* Navigation Header */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">Navigation</h3>
          <div className="h-1 w-12 bg-gradient-to-r from-medical-primary to-medical-secondary rounded-full"></div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1 flex-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start h-auto p-4 text-left transition-all duration-300 rounded-xl group",
                  isActive 
                    ? "bg-gradient-to-r from-medical-primary to-medical-secondary text-white shadow-medical-glow scale-105" 
                    : "hover:bg-medical-card hover:scale-102 text-foreground hover:shadow-card"
                )}
                onClick={() => setActiveTab(item.id)}
              >
                <div className="flex items-center gap-4 w-full">
                  <div className={cn(
                    "p-2 rounded-lg transition-all duration-300",
                    isActive 
                      ? "bg-white/20 text-white" 
                      : "bg-medical-primary/10 text-medical-primary group-hover:bg-medical-primary/20"
                  )}>
                    <IconComponent className="h-5 w-5 flex-shrink-0" />
                  </div>
                  <div className="flex-1">
                    <div className={cn(
                      "font-medium text-sm",
                      isActive ? "text-white" : "text-foreground"
                    )}>
                      {item.label}
                    </div>
                    <div className={cn(
                      "text-xs mt-1 leading-tight",
                      isActive ? "text-white/80" : "text-muted-foreground"
                    )}>
                      {item.description}
                    </div>
                  </div>
                  {isActive && (
                    <div className="w-1 h-8 bg-white/50 rounded-full"></div>
                  )}
                </div>
              </Button>
            );
          })}
        </nav>

        {/* Enhanced Bottom Actions */}
        <div className="mt-6 space-y-3 border-t border-medical-border pt-6">
          <Button
            variant="ghost"
            className="w-full justify-start text-foreground hover:bg-medical-card hover:scale-102 transition-all duration-300 rounded-xl p-3"
          >
            <div className="p-2 bg-medical-primary/10 rounded-lg mr-3">
              <Settings className="h-4 w-4 text-medical-primary" />
            </div>
            <span className="font-medium">Settings</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-medical-error hover:bg-red-50 hover:scale-102 transition-all duration-300 rounded-xl p-3"
          >
            <div className="p-2 bg-medical-error/10 rounded-lg mr-3">
              <LogOut className="h-4 w-4" />
            </div>
            <span className="font-medium">Logout</span>
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;