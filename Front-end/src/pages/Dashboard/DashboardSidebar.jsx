import React from 'react';
import { Button } from "../../components/ui/button";
import { cn } from "../../components/lib/utils";
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
    <aside className="dashboard-sidebar">
      <div className="dashboard-sidebar-content">
        {/* Navigation Header */}
        <div className="dashboard-sidebar-header">
          <h3 className="dashboard-sidebar-title">Navigation</h3>
          <div className="dashboard-sidebar-header-underline"></div>
        </div>

        {/* Navigation Menu */}
        <nav className="dashboard-sidebar-nav">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`dashboard-sidebar-item ${isActive ? 'dashboard-sidebar-item-active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <div className="dashboard-sidebar-item-content">
                  <div className={`dashboard-sidebar-icon-container ${isActive ? 'dashboard-sidebar-icon-active' : ''}`}>
                    <IconComponent className="dashboard-sidebar-icon" />
                  </div>
                  <div className="dashboard-sidebar-text">
                    <div className={`dashboard-sidebar-label ${isActive ? 'dashboard-sidebar-label-active' : ''}`}>
                      {item.label}
                    </div>
                    <div className={`dashboard-sidebar-description ${isActive ? 'dashboard-sidebar-description-active' : ''}`}>
                      {item.description}
                    </div>
                  </div>
                  {isActive && (
                    <div className="dashboard-sidebar-active-indicator"></div>
                  )}
                </div>
              </Button>
            );
          })}
        </nav>

        {/* Enhanced Bottom Actions */}
        <div className="dashboard-sidebar-bottom">
          <Button
            variant="ghost"
            className="dashboard-sidebar-bottom-button"
          >
            <div className="dashboard-sidebar-bottom-icon-container">
              <Settings className="dashboard-sidebar-bottom-icon" />
            </div>
            <span className="dashboard-sidebar-bottom-text">Settings</span>
          </Button>
          <Button
            variant="ghost"
            className="dashboard-sidebar-bottom-button dashboard-sidebar-logout-button"
          >
            <div className="dashboard-sidebar-bottom-icon-container dashboard-sidebar-logout-icon-container">
              <LogOut className="dashboard-sidebar-bottom-icon" />
            </div>
            <span className="dashboard-sidebar-bottom-text">Logout</span>
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;