import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";


import '../../../pages/Dashboard/DoctorDashboard/index.css';
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
    <div className="overview-container">
      {/* Dashboard Stats */}
      <div className="overview-stats-grid">
        <div className="overview-stat-card overview-stat-card-primary">
          <div className="overview-stat-card-content">
            <div>
              <p className="overview-stat-label">Today's Appointments</p>
              <p className="overview-stat-value">{dashboardStats.todayAppointments}</p>
            </div>
            <Calendar className="overview-stat-icon" />
          </div>
        </div>

        <div className="overview-stat-card overview-stat-card-secondary">
          <div className="overview-stat-card-content">
            <div>
              <p className="overview-stat-label">Total Patients</p>
              <p className="overview-stat-value">{dashboardStats.totalPatients}</p>
            </div>
            <Users className="overview-stat-icon" />
          </div>
        </div>

        <div className="overview-stat-card overview-stat-card-active">
          <div className="overview-stat-card-content">
            <div>
              <p className="overview-stat-label">Active Consultations</p>
              <p className="overview-stat-value">{dashboardStats.activeConsultations}</p>
            </div>
            <Video className="overview-stat-icon" />
          </div>
        </div>

        <div className="overview-stat-card overview-stat-card-pending">
          <div className="overview-stat-card-content">
            <div>
              <p className="overview-stat-label">Pending Reports</p>
              <p className="overview-stat-value">{dashboardStats.pendingReports}</p>
            </div>
            <FileText className="overview-stat-icon" />
          </div>
        </div>
      </div>

      <div className="overview-content-grid">
        {/* Today's Appointments */}
        <div className="overview-appointments-card">
          <div className="overview-card-header">
            <h3 className="overview-card-title">Today's Appointments</h3>
            <button className="overview-add-btn">
              <Plus style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
              Add Appointment
            </button>
          </div>
          <div className="overview-card-content">
            <div className="overview-appointments-list">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="overview-appointment-item">
                  <div className="overview-appointment-left">
                    <div className="overview-appointment-icon">
                      <Clock style={{ width: '1rem', height: '1rem' }} />
                    </div>
                    <div>
                      <h4 className="overview-appointment-patient">{appointment.patient}</h4>
                      <p className="overview-appointment-type">{appointment.type}</p>
                    </div>
                  </div>
                  <div className="overview-appointment-right">
                    <p className="overview-appointment-time">{appointment.time}</p>
                    <p className="overview-appointment-duration">{appointment.duration}</p>
                    <Button 
            onClick={() => window.location.href = "/dashboard/video-consultation"}
            className="video-consultation-start-btn"
          >
            <Video className="video-consultation-btn-icon" />
            Start Call
          </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="overview-quick-actions-card">
          <div className="overview-card-header">
            <h3 className="overview-card-title">Quick Actions</h3>
          </div>
          <div className="overview-quick-actions-content">
            <button 
              className="overview-action-btn overview-action-btn-primary"
              onClick={() => setActiveTab('video')}
            >
              <Video style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
              Start Video Call
            </button>
            <button 
              className="overview-action-btn overview-action-btn-outline overview-action-btn-secondary"
              onClick={() => setActiveTab('patients')}
            >
              <Users style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
              View All Patients
            </button>
            <button 
              className="overview-action-btn overview-action-btn-outline overview-action-btn-accent"
              onClick={() => setActiveTab('schedule')}
            >
              <Calendar style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
              Manage Schedule
            </button>
            <button 
              className="overview-action-btn overview-action-btn-outline overview-action-btn-pending"
              onClick={() => setActiveTab('records')}
            >
              <FileText style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
              Patient Records
            </button>
          </div>
        </div>
      </div>

      {/* Recent Patients */}
      <div className="overview-recent-patients-card">
        <div className="overview-card-header">
          <h3 className="overview-card-title">Recent Patients</h3>
          <button 
            className="overview-view-all-btn"
            onClick={() => setActiveTab('patients')}
          >
            View All
          </button>
        </div>
        <div className="overview-card-content">
          <div className="overview-recent-patients-grid">
            {recentPatients.map((patient) => (
              <div key={patient.id} className="overview-patient-item">
                <div className="overview-patient-avatar">
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="overview-patient-info">
                  <h4 className="overview-patient-name">{patient.name}</h4>
                  <p className="overview-patient-age">Age: {patient.age}</p>
                  <div className="overview-patient-badges">
                    <span 
                      className={`overview-patient-badge ${
                        patient.status === 'stable' 
                          ? 'overview-patient-badge-stable' 
                          : 'overview-patient-badge-monitoring'
                      }`}
                    >
                      {patient.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-min-height">
      {/* Enhanced Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-header-left">
            <div className="dashboard-header-logo">
              <div className="dashboard-logo-icon">
                <Stethoscope style={{ width: '1.75rem', height: '1.75rem', color: 'white' }} />
              </div>
              <div>
                <h1 className="dashboard-title">Kalafo Medical</h1>
                <p className="dashboard-subtitle">Digital Stethoscope Platform</p>
              </div>
            </div>
            
            {/* Welcome Message */}
            <div className="dashboard-welcome">
              <p className="dashboard-welcome-text">Welcome back, <span style={{ fontWeight: '600' }}>{doctorName}</span></p>
              <p className="dashboard-welcome-subtext">Ready to help your patients today</p>
            </div>
          </div>

          <div className="dashboard-header-right">
            {/* Enhanced Search */}
            <div className="dashboard-search-container">
              <Search className="dashboard-search-icon" />
              <input
                type="text"
                placeholder="  Search patients, appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="dashboard-search-input"
              />
            </div>

            {/* Notifications with Badge */}
            <button className="dashboard-notification-btn">
              <Bell style={{ width: '1.25rem', height: '1.25rem' }} />
              <span className="dashboard-notification-badge">3</span>
            </button>

            {/* Enhanced Doctor Profile */}
            <div className="dashboard-profile-section">
              <div className="dashboard-profile-info">
                <p className="dashboard-profile-name">{doctorName}</p>
                <p className="dashboard-profile-status">General Physician • Online</p>
              </div>
              <div className="dashboard-avatar">
                {doctorName.split(' ').map(n => n[0]).join('')}
              </div>
              <button className="dashboard-settings-btn">
                <Settings style={{ width: '1rem', height: '1rem' }} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-flex-container">
        {/* Enhanced Sidebar */}
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Area */}
        <main className="dashboard-main-content">
          <div className="dashboard-content-wrapper">
            {/* Page Header */}
            <div className="dashboard-page-header">
              <div className="dashboard-page-header-content">
                <div>
                  <h2 className="dashboard-page-title">
                    {activeTab === 'overview' ? 'Dashboard Overview' : activeTab.replace(/([A-Z])/g, ' $1')}
                  </h2>
                  <p className="dashboard-page-description">
                    {activeTab === 'overview' && "Monitor your practice and manage patient care"}
                    {activeTab === 'patients' && "Manage your patient records and information"}
                    {activeTab === 'schedule' && "View and manage your appointments"}
                    {activeTab === 'video' && "Conduct video consultations with patients"}
                    {activeTab === 'records' && "Access comprehensive patient medical records"}
                    {activeTab === 'analytics' && "View practice analytics and insights"}
                  </p>
                </div>
                
                {/* Quick Stats */}
                <div className="dashboard-quick-stats">
                  <div className="dashboard-quick-stat">
                    <p className="dashboard-quick-stat-value dashboard-quick-stat-primary">{dashboardStats.todayAppointments}</p>
                    <p className="dashboard-quick-stat-label">Today</p>
                  </div>
                  <div className="dashboard-quick-stat">
                    <p className="dashboard-quick-stat-value dashboard-quick-stat-secondary">{dashboardStats.totalPatients}</p>
                    <p className="dashboard-quick-stat-label">Patients</p>
                  </div>
                  <div className="dashboard-quick-stat">
                    <p className="dashboard-quick-stat-value dashboard-quick-stat-active">{dashboardStats.activeConsultations}</p>
                    <p className="dashboard-quick-stat-label">Active</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="dashboard-content-area">
              {renderTabContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;