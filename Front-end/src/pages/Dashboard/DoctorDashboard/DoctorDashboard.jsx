import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { 
  Calendar, 
  Users, 
  Video, 
  FileText, 
  Heart,
  Activity,
  Clock,
  Search,
  Bell,
  Settings,
  LogOut,
  Plus,
  Filter,
  Eye,
  Phone,
  Mail,
  MapPin,
  Stethoscope
} from 'lucide-react';
import DashboardSidebar from './DashboardSidebar';
import PatientListTab from './PatientListTab';
import ScheduleTab from './ScheduleTab';
import VideoConsultationTab from './VideoConsultationTab';
import PatientRecordsTab from './PatientRecordsTab';

const DoctorDashboard = ({ doctorName = "Dr. Sarah Johnson" }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for demonstration
  const dashboardStats = {
    todayAppointments: 8,
    totalPatients: 247,
    activeConsultations: 2,
    pendingReports: 5
  };

  const recentPatients = [
    {
      id: 1,
      name: "Emily Carter",
      age: 28,
      lastVisit: "2024-01-15",
      condition: "Hypertension",
      status: "stable",
      avatar: null
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      age: 45,
      lastVisit: "2024-01-14",
      condition: "Diabetes Type 2",
      status: "monitoring",
      avatar: null
    },
    {
      id: 3,
      name: "Jennifer Liu",
      age: 32,
      lastVisit: "2024-01-13",
      condition: "Asthma",
      status: "stable",
      avatar: null
    }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      patient: "Robert Thompson",
      time: "09:30 AM",
      type: "Follow-up",
      duration: "30 min"
    },
    {
      id: 2,
      patient: "Lisa Anderson",
      time: "11:00 AM", 
      type: "Consultation",
      duration: "45 min"
    },
    {
      id: 3,
      patient: "David Park",
      time: "02:15 PM",
      type: "Check-up",
      duration: "30 min"
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'patients':
        return <PatientListTab />;
      case 'schedule':
        return <ScheduleTab />;
      case 'video':
        return <VideoConsultationTab />;
      case 'records':
        return <PatientRecordsTab />;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Dashboard Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-r from-medical-primary to-medical-accent text-white shadow-medical">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Today's Appointments</p>
                <p className="text-3xl font-bold">{dashboardStats.todayAppointments}</p>
              </div>
              <Calendar className="h-8 w-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-medical-secondary to-medical-accent text-white shadow-medical">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Total Patients</p>
                <p className="text-3xl font-bold">{dashboardStats.totalPatients}</p>
              </div>
              <Users className="h-8 w-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-status-active to-medical-accent text-white shadow-medical">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Active Consultations</p>
                <p className="text-3xl font-bold">{dashboardStats.activeConsultations}</p>
              </div>
              <Video className="h-8 w-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-status-pending to-medical-warning text-white shadow-medical">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Pending Reports</p>
                <p className="text-3xl font-bold">{dashboardStats.pendingReports}</p>
              </div>
              <FileText className="h-8 w-8 text-white/80" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Appointments */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-foreground">Today's Appointments</CardTitle>
            <Button size="sm" className="bg-medical-primary hover:bg-medical-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Appointment
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div 
                  key={appointment.id}
                  className="flex items-center justify-between p-4 bg-medical-card rounded-lg border border-border hover:bg-medical-card-hover transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-medical-primary rounded-full">
                      <Clock className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{appointment.patient}</h4>
                      <p className="text-sm text-muted-foreground">{appointment.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-medical-primary">{appointment.time}</p>
                    <p className="text-sm text-muted-foreground">{appointment.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start bg-medical-primary hover:bg-medical-primary/90"
              onClick={() => setActiveTab('video')}
            >
              <Video className="h-4 w-4 mr-2" />
              Start Video Call
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-medical-secondary text-medical-secondary hover:bg-medical-secondary hover:text-white"
              onClick={() => setActiveTab('patients')}
            >
              <Users className="h-4 w-4 mr-2" />
              View All Patients
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-medical-accent text-medical-accent hover:bg-medical-accent hover:text-white"
              onClick={() => setActiveTab('schedule')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Manage Schedule
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-status-pending text-status-pending hover:bg-status-pending hover:text-white"
              onClick={() => setActiveTab('records')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Patient Records
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Patients */}
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">Recent Patients</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setActiveTab('patients')}
            className="border-medical-primary text-medical-primary hover:bg-medical-primary hover:text-white"
          >
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentPatients.map((patient) => (
              <div 
                key={patient.id}
                className="flex items-center gap-4 p-4 bg-medical-card rounded-lg border border-border hover:bg-medical-card-hover transition-colors cursor-pointer"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={patient.avatar} />
                  <AvatarFallback className="bg-medical-primary text-white">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{patient.name}</h4>
                  <p className="text-sm text-muted-foreground">Age: {patient.age}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant={patient.status === 'stable' ? 'default' : 'secondary'}
                      className={patient.status === 'stable' ? 'bg-medical-success' : 'bg-status-pending'}
                    >
                      {patient.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-medical-background">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-medical-primary to-medical-secondary shadow-medical-glow sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Stethoscope className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Kalafo Medical</h1>
                <p className="text-white/80 text-sm">Digital Stethoscope Platform</p>
              </div>
            </div>
            
            {/* Welcome Message */}
            <div className="hidden lg:block bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <p className="text-white/90 text-sm">Welcome back, <span className="font-semibold">{doctorName}</span></p>
              <p className="text-white/70 text-xs">Ready to help your patients today</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Enhanced Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
              <Input
                placeholder="Search patients, appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-80 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30"
              />
            </div>

            {/* Notifications with Badge */}
            <Button variant="ghost" size="sm" className="relative hover:bg-white/20 text-white">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-medical-error rounded-full text-xs flex items-center justify-center text-white font-bold">3</span>
            </Button>

            {/* Enhanced Doctor Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-white/30">
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-white">{doctorName}</p>
                <p className="text-xs text-white/80">General Physician • Online</p>
              </div>
              <Avatar className="h-12 w-12 ring-2 ring-white/30">
                <AvatarFallback className="bg-gradient-to-br from-medical-accent to-medical-secondary text-white font-bold">
                  {doctorName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-88px)]">
        {/* Enhanced Sidebar */}
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Area */}
        <main className="flex-1 bg-medical-background">
          <div className="p-6 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground capitalize">
                    {activeTab === 'overview' ? 'Dashboard Overview' : activeTab.replace(/([A-Z])/g, ' $1')}
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {activeTab === 'overview' && "Monitor your practice and manage patient care"}
                    {activeTab === 'patients' && "Manage your patient records and information"}
                    {activeTab === 'schedule' && "View and manage your appointments"}
                    {activeTab === 'video' && "Conduct video consultations with patients"}
                    {activeTab === 'records' && "Access comprehensive patient medical records"}
                    {activeTab === 'analytics' && "View practice analytics and insights"}
                  </p>
                </div>
                
                {/* Quick Stats */}
                <div className="hidden lg:flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-medical-primary">{dashboardStats.todayAppointments}</p>
                    <p className="text-xs text-muted-foreground">Today</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-medical-secondary">{dashboardStats.totalPatients}</p>
                    <p className="text-xs text-muted-foreground">Patients</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-status-active">{dashboardStats.activeConsultations}</p>
                    <p className="text-xs text-muted-foreground">Active</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="animate-fade-in">
              {renderTabContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;