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
  User,
  Heart,
  Activity
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
      condition: "Hypertension",
      status: "stable",
      avatar: null,
      bloodType: "O+",
      allergies: ["Penicillin"],
      medications: ["Lisinopril 10mg"],
      vitals: {
        bloodPressure: "130/85",
        heartRate: "72",
        temperature: "98.6°F",
        weight: "145 lbs"
      }
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
      condition: "Diabetes Type 2",
      status: "monitoring",
      avatar: null,
      bloodType: "A+",
      allergies: ["None known"],
      medications: ["Metformin 500mg", "Insulin"],
      vitals: {
        bloodPressure: "125/80",
        heartRate: "68",
        temperature: "98.4°F",
        weight: "180 lbs"
      }
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
      condition: "Asthma",
      status: "stable",
      avatar: null,
      bloodType: "B+",
      allergies: ["Dust", "Pollen"],
      medications: ["Albuterol inhaler"],
      vitals: {
        bloodPressure: "118/75",
        heartRate: "75",
        temperature: "98.7°F",
        weight: "125 lbs"
      }
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
      condition: "Heart Disease",
      status: "critical",
      avatar: null,
      bloodType: "AB+",
      allergies: ["Aspirin"],
      medications: ["Atorvastatin", "Metoprolol"],
      vitals: {
        bloodPressure: "145/95",
        heartRate: "85",
        temperature: "98.2°F",
        weight: "200 lbs"
      }
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
      condition: "Anxiety",
      status: "improving",
      avatar: null,
      bloodType: "O-",
      allergies: ["None known"],
      medications: ["Sertraline 50mg"],
      vitals: {
        bloodPressure: "110/70",
        heartRate: "65",
        temperature: "98.5°F",
        weight: "130 lbs"
      }
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
                         patient.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || patient.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'stable':
        return 'bg-medical-success text-white';
      case 'monitoring':
        return 'bg-status-pending text-white';
      case 'critical':
        return 'bg-medical-error text-white';
      case 'improving':
        return 'bg-medical-primary text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Patient Management</h2>
          <p className="text-muted-foreground">Manage and view all patient information</p>
        </div>
        <Button className="bg-medical-primary hover:bg-medical-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add New Patient
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients by name, condition, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {filterOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={selectedFilter === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(option.value)}
                  className={cn(
                    "whitespace-nowrap",
                    selectedFilter === option.value 
                      ? "bg-medical-primary hover:bg-medical-primary/90" 
                      : "border-medical-primary text-medical-primary hover:bg-medical-primary hover:text-white"
                  )}
                >
                  {option.label} ({option.count})
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient List */}
      <div className="grid gap-4">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-elevated transition-shadow duration-200 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={patient.avatar} />
                    <AvatarFallback className="bg-medical-primary text-white text-lg">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{patient.name}</h3>
                        <p className="text-muted-foreground">{patient.age} years old • {patient.gender}</p>
                      </div>
                      <Badge className={getStatusColor(patient.status)}>
                        {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-foreground">Contact Information</h4>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {patient.phone}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {patient.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {patient.address}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-foreground">Medical Information</h4>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Condition:</span> {patient.condition}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Blood Type:</span> {patient.bloodType}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Allergies:</span> {patient.allergies.join(', ')}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-foreground">Recent Vitals</h4>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Heart className="h-3 w-3 text-medical-error" />
                            BP: {patient.vitals.bloodPressure}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Activity className="h-3 w-3 text-medical-primary" />
                            HR: {patient.vitals.heartRate} bpm
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Temp: {patient.vitals.temperature}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Weight: {patient.vitals.weight}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-foreground">Appointments</h4>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Last: {new Date(patient.lastVisit).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-medical-primary">
                            <Calendar className="h-3 w-3" />
                            Next: {new Date(patient.nextAppointment).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="bg-medical-primary hover:bg-medical-primary/90">
                        <Eye className="h-4 w-4 mr-2" />
                        View Full Record
                      </Button>
                      <Button size="sm" variant="outline" className="border-medical-secondary text-medical-secondary hover:bg-medical-secondary hover:text-white">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Appointment
                      </Button>
                      <Button size="sm" variant="outline" className="border-medical-accent text-medical-accent hover:bg-medical-accent hover:text-white">
                        <Phone className="h-4 w-4 mr-2" />
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
        <Card className="shadow-card">
          <CardContent className="p-12 text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No patients found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria or add a new patient.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PatientListTab;