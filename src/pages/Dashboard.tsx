
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Calendar, FileText, Heart, PlusCircle, Activity, Pill, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { sampleMetrics, sampleTimelineEvents, sampleMedications } from '@/data/sampleData';
import { BarChart as RechartBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Filter to active medications
  const activeMedications = sampleMedications.filter(med => med.isActive);
  
  // Get recent metrics
  const recentMetrics = sampleMetrics
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);
  
  // Get recent timeline events
  const recentEvents = sampleTimelineEvents
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-health-blue" />
                  Health Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">2</div>
                <p className="text-muted-foreground text-sm">Recent health reports</p>
                <div className="mt-4">
                  <Link to="/reports">
                    <Button variant="outline" size="sm" className="w-full">
                      View All Reports
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Pill className="mr-2 h-5 w-5 text-health-purple" />
                  Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{activeMedications.length}</div>
                <p className="text-muted-foreground text-sm">Active medications</p>
                <div className="mt-4">
                  <Link to="/medications">
                    <Button variant="outline" size="sm" className="w-full">
                      Manage Medications
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-health-green" />
                  Vital Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{sampleMetrics.length}</div>
                <p className="text-muted-foreground text-sm">Tracked health metrics</p>
                <div className="mt-4">
                  <Link to="/vitals">
                    <Button variant="outline" size="sm" className="w-full">
                      View All Metrics
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-health-teal" />
                  Recent Key Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMetrics.slice(0, 3).map(metric => {
                    // Calculate if metric is within normal range
                    let status = "normal";
                    let statusColor = "text-health-green";
                    
                    if (metric.normalRange) {
                      if (metric.value < metric.normalRange.min) {
                        status = "low";
                        statusColor = "text-health-orange";
                      } else if (metric.value > metric.normalRange.max) {
                        status = "high";
                        statusColor = "text-health-red";
                      }
                    }
                    
                    // Calculate progress percentage for visualization
                    let percentage = 50; // Default middle value
                    
                    if (metric.normalRange) {
                      const range = metric.normalRange.max - metric.normalRange.min;
                      percentage = Math.min(100, Math.max(0, 
                        ((metric.value - metric.normalRange.min) / range) * 100
                      ));
                    }
                    
                    return (
                      <div key={metric.id} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">{metric.name}</span>
                          <span className={`text-sm font-semibold ${statusColor}`}>
                            {metric.value} {metric.unit}
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          {metric.normalRange && (
                            <>
                              <span>{metric.normalRange.min} {metric.unit}</span>
                              <span>{metric.normalRange.max} {metric.unit}</span>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  <Link to="/vitals">
                    <Button variant="ghost" size="sm" className="w-full mt-2">
                      View All Metrics
                      <span className="ml-1">→</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-health-blue" />
                  Your Health Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentEvents.slice(0, 4).map(event => {
                    // Determine icon based on event type
                    let EventIcon = FileText;
                    let iconColor = "text-health-blue";
                    
                    if (event.type === 'medication') {
                      EventIcon = Pill;
                      iconColor = "text-health-purple";
                    } else if (event.type === 'metric') {
                      EventIcon = Activity;
                      iconColor = "text-health-green";
                    }
                    
                    return (
                      <div key={event.id} className="flex items-start space-x-3">
                        <div className={`mt-0.5 p-1.5 rounded-full ${iconColor} bg-accent`}>
                          <EventIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{event.title}</p>
                          <p className="text-xs text-muted-foreground">{event.date}</p>
                          <p className="text-sm mt-1">{event.details}</p>
                        </div>
                      </div>
                    );
                  })}
                  
                  <Link to="/timeline">
                    <Button variant="ghost" size="sm" className="w-full mt-2">
                      View Full Timeline
                      <span className="ml-1">→</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-health-teal" />
                Health Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { month: 'May', bp: 128, glucose: 94, cholesterol: 190 },
                      { month: 'Jun', bp: 125, glucose: 96, cholesterol: 188 },
                      { month: 'Jul', bp: 124, glucose: 95, cholesterol: 185 },
                      { month: 'Aug', bp: 126, glucose: 92, cholesterol: 183 },
                      { month: 'Sep', bp: 123, glucose: 90, cholesterol: 180 },
                      { month: 'Oct', bp: 125, glucose: 92, cholesterol: 185 },
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="bp" stroke="#0EA5E9" name="Blood Pressure (Systolic)" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="glucose" stroke="#10B981" name="Glucose (mg/dL)" />
                    <Line type="monotone" dataKey="cholesterol" stroke="#8B5CF6" name="Cholesterol (mg/dL)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex justify-center mt-4">
                <Link to="/analytics">
                  <Button>
                    View Detailed Analytics
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Health Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentMetrics.map(metric => {
                  // Calculate if metric is within normal range
                  let status = "normal";
                  let statusColor = "text-health-green";
                  
                  if (metric.normalRange) {
                    if (metric.value < metric.normalRange.min) {
                      status = "low";
                      statusColor = "text-health-orange";
                    } else if (metric.value > metric.normalRange.max) {
                      status = "high";
                      statusColor = "text-health-red";
                    }
                  }
                  
                  return (
                    <div key={metric.id} className="health-card">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{metric.name}</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-muted">
                          {metric.category}
                        </span>
                      </div>
                      <div className={`text-xl font-bold ${statusColor}`}>
                        {metric.value} {metric.unit}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {metric.normalRange && (
                          <span>Normal range: {metric.normalRange.min} - {metric.normalRange.max} {metric.unit}</span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        Recorded on {metric.date}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="medications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Medications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeMedications.map(medication => (
                  <div key={medication.id} className="health-card">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{medication.name}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-accent text-accent-foreground">
                        {medication.isActive ? 'Active' : 'Completed'}
                      </span>
                    </div>
                    <div className="text-lg">
                      {medication.dosage}, {medication.frequency}
                    </div>
                    <div className="text-sm mt-1">
                      For: {medication.forCondition}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {medication.notes}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Started on {medication.startDate}
                      {medication.endDate && ` • Ended on ${medication.endDate}`}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Health Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEvents.map(event => {
                  // Determine icon based on event type
                  let EventIcon = FileText;
                  let iconColor = "text-health-blue bg-accent";
                  
                  if (event.type === 'medication') {
                    EventIcon = Pill;
                    iconColor = "text-health-purple bg-accent";
                  } else if (event.type === 'metric') {
                    EventIcon = Activity;
                    iconColor = "text-health-green bg-accent";
                  }
                  
                  return (
                    <div key={event.id} className="flex group">
                      <div className="mr-4 flex flex-col items-center">
                        <div className={`p-2 rounded-full ${iconColor} group-hover:scale-110 transition-transform`}>
                          <EventIcon className="h-5 w-5" />
                        </div>
                        <div className="w-px h-full bg-border mt-2" />
                      </div>
                      <div className="health-card w-full -mt-2 group-hover:bg-accent/10 transition-colors">
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {event.date}
                        </div>
                        <div className="mt-1">
                          {event.details}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
