
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sampleMetrics, getMetricHistory } from '@/data/sampleData';
import { Activity, Plus, Search, Filter, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { HealthMetricCategory } from '@/types/health';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const VitalMetrics = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMetric, setSelectedMetric] = useState(sampleMetrics[0]);
  const [metricHistory, setMetricHistory] = useState(getMetricHistory(sampleMetrics[0].name));
  const { toast } = useToast();
  
  const handleAddMetric = () => {
    toast({
      title: "Metric added",
      description: "Your health metric has been recorded.",
    });
  };
  
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };
  
  const handleMetricSelect = (metric: typeof sampleMetrics[0]) => {
    setSelectedMetric(metric);
    setMetricHistory(getMetricHistory(metric.name));
  };
  
  // Get available categories from the data
  const categories = ['All', ...Array.from(new Set(sampleMetrics.map(m => m.category)))];
  
  // Filter metrics based on search term and category
  const filteredMetrics = sampleMetrics.filter(metric => {
    const matchesSearch = metric.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         metric.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || metric.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Group metrics by category for the "By Category" tab
  const metricsByCategory = filteredMetrics.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
    return acc;
  }, {} as Record<string, typeof sampleMetrics>);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Vital Metrics</h1>
          <p className="text-muted-foreground">Track and monitor your health metrics over time</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Metric
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Health Metric</DialogTitle>
              <DialogDescription>
                Record a new health metric measurement.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="metric-type">Metric Type</Label>
                <Select defaultValue="blood-pressure">
                  <SelectTrigger id="metric-type">
                    <SelectValue placeholder="Select metric type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blood-pressure">Blood Pressure</SelectItem>
                    <SelectItem value="glucose">Blood Glucose</SelectItem>
                    <SelectItem value="cholesterol">Cholesterol</SelectItem>
                    <SelectItem value="heart-rate">Heart Rate</SelectItem>
                    <SelectItem value="weight">Weight</SelectItem>
                    <SelectItem value="temperature">Temperature</SelectItem>
                    <SelectItem value="custom">Custom Metric</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="metric-value">Value</Label>
                <Input id="metric-value" type="number" placeholder="Enter value" />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="metric-unit">Unit</Label>
                <Input id="metric-unit" placeholder="e.g., mg/dL" />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="metric-date">Date</Label>
                <Input id="metric-date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="metric-notes">Notes (Optional)</Label>
                <Input id="metric-notes" placeholder="Any additional notes" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleAddMetric}>Add Metric</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search metrics..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Tabs defaultValue="all">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">All Metrics</TabsTrigger>
              <TabsTrigger value="category" className="flex-1">By Category</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4 space-y-4">
              {filteredMetrics.length > 0 ? (
                filteredMetrics.map(metric => {
                  // Determine status and indicator
                  let StatusIcon = ArrowRight;
                  let statusColor = "text-health-green";
                  let statusBg = "bg-green-50";
                  
                  if (metric.normalRange) {
                    if (metric.value < metric.normalRange.min) {
                      StatusIcon = ArrowDownRight;
                      statusColor = "text-health-orange";
                      statusBg = "bg-orange-50";
                    } else if (metric.value > metric.normalRange.max) {
                      StatusIcon = ArrowUpRight;
                      statusColor = "text-health-red";
                      statusBg = "bg-red-50";
                    }
                  }
                  
                  return (
                    <Card 
                      key={metric.id} 
                      className={`cursor-pointer hover:shadow-md transition-all ${selectedMetric.id === metric.id ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => handleMetricSelect(metric)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{metric.name}</h3>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{metric.date}</span>
                            </div>
                          </div>
                          <div className={`p-1.5 rounded-full ${statusBg} ${statusColor}`}>
                            <StatusIcon className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="text-xl font-bold">{metric.value}</span>
                          <span className="text-sm ml-1">{metric.unit}</span>
                        </div>
                        <div className="mt-1 text-xs">
                          <Badge variant="outline" className="font-normal">
                            {metric.category}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center p-6 text-muted-foreground">
                  No metrics found matching your criteria.
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="category" className="mt-4 space-y-6">
              {Object.keys(metricsByCategory).length > 0 ? (
                Object.entries(metricsByCategory).map(([category, metrics]) => (
                  <div key={category}>
                    <h3 className="text-lg font-medium mb-3">{category}</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {metrics.map(metric => (
                        <Card 
                          key={metric.id} 
                          className={`cursor-pointer hover:shadow-md transition-all ${selectedMetric.id === metric.id ? 'ring-2 ring-primary' : ''}`}
                          onClick={() => handleMetricSelect(metric)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{metric.name}</h4>
                              <span className="text-xl font-bold">{metric.value} <span className="text-sm">{metric.unit}</span></span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Recorded on {metric.date}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-6 text-muted-foreground">
                  No categories found matching your criteria.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{selectedMetric.name}</CardTitle>
                  <CardDescription>
                    {selectedMetric.category} • Last recorded: {selectedMetric.date}
                  </CardDescription>
                </div>
                <Badge className="px-2 py-1">
                  Current: {selectedMetric.value} {selectedMetric.unit}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="trend">
                <TabsList>
                  <TabsTrigger value="trend">Trend</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>
                
                <TabsContent value="trend" className="space-y-4">
                  <div className="h-64 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={metricHistory}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#0EA5E9" 
                          name={`${selectedMetric.name} (${selectedMetric.unit})`} 
                          activeDot={{ r: 8 }} 
                        />
                        
                        {selectedMetric.normalRange && (
                          <>
                            <Line 
                              type="monotone" 
                              dataKey={() => selectedMetric.normalRange?.max} 
                              stroke="#EF4444" 
                              strokeDasharray="3 3" 
                              name={`Max (${selectedMetric.unit})`} 
                              dot={false}
                            />
                            <Line 
                              type="monotone" 
                              dataKey={() => selectedMetric.normalRange?.min} 
                              stroke="#F97316" 
                              strokeDasharray="3 3" 
                              name={`Min (${selectedMetric.unit})`} 
                              dot={false}
                            />
                          </>
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    <div className="health-card">
                      <div className="text-sm text-muted-foreground">Current</div>
                      <div className="text-xl font-bold">{selectedMetric.value} {selectedMetric.unit}</div>
                    </div>
                    
                    <div className="health-card">
                      <div className="text-sm text-muted-foreground">Average</div>
                      <div className="text-xl font-bold">
                        {(metricHistory.reduce((sum, item) => sum + item.value, 0) / metricHistory.length).toFixed(1)} {selectedMetric.unit}
                      </div>
                    </div>
                    
                    <div className="health-card">
                      <div className="text-sm text-muted-foreground">Minimum</div>
                      <div className="text-xl font-bold">
                        {Math.min(...metricHistory.map(item => item.value)).toFixed(1)} {selectedMetric.unit}
                      </div>
                    </div>
                    
                    <div className="health-card">
                      <div className="text-sm text-muted-foreground">Maximum</div>
                      <div className="text-xl font-bold">
                        {Math.max(...metricHistory.map(item => item.value)).toFixed(1)} {selectedMetric.unit}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="details">
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Metric Name</h3>
                        <p className="mt-1">{selectedMetric.name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                        <p className="mt-1">{selectedMetric.category}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Current Value</h3>
                        <p className="mt-1">{selectedMetric.value} {selectedMetric.unit}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Last Recorded</h3>
                        <p className="mt-1">{selectedMetric.date}</p>
                      </div>
                      
                      {selectedMetric.normalRange && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Normal Range</h3>
                          <p className="mt-1">{selectedMetric.normalRange.min} - {selectedMetric.normalRange.max} {selectedMetric.unit}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-sm font-medium">Recent Readings</h3>
                      <div className="mt-2 space-y-2">
                        {metricHistory.map((reading, index) => (
                          <div key={index} className="flex justify-between items-center p-2 border rounded-md hover:bg-accent/10">
                            <span>{reading.date}</span>
                            <span className="font-medium">{reading.value} {selectedMetric.unit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Export Data</Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Add New Reading</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Reading for {selectedMetric.name}</DialogTitle>
                    <DialogDescription>
                      Record a new measurement for this health metric.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="new-value">Value</Label>
                      <Input id="new-value" type="number" placeholder={`Enter value in ${selectedMetric.unit}`} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-date">Date</Label>
                      <Input id="new-date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-notes">Notes (Optional)</Label>
                      <Input id="new-notes" placeholder="Any additional notes" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleAddMetric}>Add Reading</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VitalMetrics;
