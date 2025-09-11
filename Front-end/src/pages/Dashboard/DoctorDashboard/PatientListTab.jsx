import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  User
} from 'lucide-react';
import { cn } from "../../../components/lib/utils";

const PatientListTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const patients = [
    {
      id: 1,
      name: "Emily Carter",
      age: 28,
      gender: "Female",
      phone: "+1 (555) 123-4567",
      email: "emily.carter@email.com",
      address: "123 Main St, City, State 12345",
      lastVisit: "2024-01-15",
      nextAppointment: "2024-01-22",
      status: "stable"
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      age: 45,
      gender: "Male",
      phone: "+1 (555) 234-5678",
      email: "michael.rodriguez@email.com",
      address: "456 Oak Ave, City, State 12345",
      lastVisit: "2024-01-14",
      nextAppointment: "2024-01-25",
      status: "monitoring"
    },
    {
      id: 3,
      name: "Jennifer Liu",
      age: 32,
      gender: "Female",
      phone: "+1 (555) 345-6789",
      email: "jennifer.liu@email.com",
      address: "789 Pine Rd, City, State 12345",
      lastVisit: "2024-01-13",
      nextAppointment: "2024-01-20",
      status: "stable"
    },
    {
      id: 4,
      name: "Robert Thompson",
      age: 58,
      gender: "Male",
      phone: "+1 (555) 456-7890",
      email: "robert.thompson@email.com",
      address: "321 Elm St, City, State 12345",
      lastVisit: "2024-01-12",
      nextAppointment: "2024-01-18",
      status: "critical"
    },
    {
      id: 5,
      name: "Sarah Wilson",
      age: 26,
      gender: "Female",
      phone: "+1 (555) 567-8901",
      email: "sarah.wilson@email.com",
      address: "654 Cedar Dr, City, State 12345",
      lastVisit: "2024-01-11",
      nextAppointment: "2024-01-23",
      status: "improving"
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Patients', count: patients.length },
    { value: 'stable', label: 'Stable', count: patients.filter(p => p.status === 'stable').length },
    { value: 'monitoring', label: 'Monitoring', count: patients.filter(p => p.status === 'monitoring').length },
    { value: 'critical', label: 'Critical', count: patients.filter(p => p.status === 'critical').length },
    { value: 'improving', label: 'Improving', count: patients.filter(p => p.status === 'improving').length }
  ];

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || patient.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'stable':
        return 'patient-status-stable';
      case 'monitoring':
        return 'patient-status-monitoring';
      case 'critical':
        return 'patient-status-critical';
      case 'improving':
        return 'patient-status-improving';
      default:
        return 'patient-status-default';
    }
  };

  return (
    <div className="patient-list-container">
      {/* Header */}
      <div className="patient-list-header">
        <div>
          <h2 className="patient-list-title">Patient Management</h2>
          <p className="patient-list-subtitle">Manage and view all patient information</p>
        </div>
        <Button className="patient-list-add-button">
          <Plus className="patient-list-add-icon" />
          Add New Patient
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="patient-list-search-card">
        <CardContent className="patient-list-search-content">
          <div className="patient-list-search-container">
            <div className="patient-list-search-input-container">
              <Search className="patient-list-search-icon" />
              <Input
                placeholder="Search patients by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="patient-list-search-input"
              />
            </div>
            <div className="patient-list-filter-container">
              {filterOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={selectedFilter === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(option.value)}
                  className={`patient-list-filter-button ${selectedFilter === option.value ? 'patient-list-filter-button-active' : ''}`}
                >
                  {option.label} ({option.count})
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient List */}
      <div className="patient-list-grid">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="patient-card">
            <CardContent className="patient-card-content">
              <div className="patient-card-header">
                <div className="patient-card-main-info">
                  <Avatar className="patient-avatar">
                    <AvatarImage src={patient.avatar} />
                    <AvatarFallback className="patient-avatar-fallback">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="patient-details">
                    <div className="patient-name-container">
                      <div>
                        <h3 className="patient-name">{patient.name}</h3>
                        <p className="patient-demographics">{patient.age} years old • {patient.gender}</p>
                      </div>
                      <Badge className={`patient-status ${getStatusColor(patient.status)}`}>
                        {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="patient-info-grid">
                      <div className="patient-info-section">
                        <h4 className="patient-info-title">Contact Information</h4>
                        <div className="patient-info-list">
                          <div className="patient-info-item">
                            <Phone className="patient-info-icon" />
                            {patient.phone}
                          </div>
                          <div className="patient-info-item">
                            <Mail className="patient-info-icon" />
                            {patient.email}
                          </div>
                          <div className="patient-info-item">
                            <MapPin className="patient-info-icon" />
                            {patient.address}
                          </div>
                        </div>
                      </div>

                      <div className="patient-info-section">
                        <h4 className="patient-info-title">Appointments</h4>
                        <div className="patient-info-list">
                          <div className="patient-info-item">
                            <Calendar className="patient-info-icon" />
                            Last: {new Date(patient.lastVisit).toLocaleDateString()}
                          </div>
                          <div className="patient-info-item patient-next-appointment">
                            <Calendar className="patient-info-icon" />
                            Next: {new Date(patient.nextAppointment).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="patient-actions">
                      <Button size="sm" className="patient-action-view">
                        <Eye className="patient-action-icon" />
                        View Full Record
                      </Button>
                      <Button size="sm" variant="outline" className="patient-action-schedule">
                        <Calendar className="patient-action-icon" />
                        Schedule Appointment
                      </Button>
                      <Button size="sm" variant="outline" className="patient-action-contact">
                        <Phone className="patient-action-icon" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <Card className="patient-list-empty">
          <CardContent className="patient-list-empty-content">
            <User className="patient-list-empty-icon" />
            <h3 className="patient-list-empty-title">No patients found</h3>
            <p className="patient-list-empty-text">Try adjusting your search criteria or add a new patient.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PatientListTab;