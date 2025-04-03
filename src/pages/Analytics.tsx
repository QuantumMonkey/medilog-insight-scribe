
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { HealthMetric } from '@/types/health';
import { sampleMetrics, getMetricHistory } from '@/data/sampleData';
import { 
  BarChart, LineChart, PieChart, ArrowRight, Calendar, Download, 
  ChevronDown, BarChart as BarChartIcon, LineChart as LineChartIcon 
} from "lucide-react";
import { 
  LineChart as RechartsLineChart, 
  Line, 
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('6month');
  const [selectedMetric, setSelectedMetric] = useState<string>('blood-pressure');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  
  const timeRangeOptions = [
    { value: '1month', label: 'Last Month' },
    { value: '3month', label: 'Last 3 Months' },
    { value: '6month', label: 'Last 6 Months' },
    { value: '1year', label: 'Last Year' },
  ];
  
  const metricOptions = [
    { value: 'blood-pressure', label: 'Blood Pressure' },
    { value: 'glucose', label: 'Blood Glucose' },
    { value: 'cholesterol', label: 'Cholesterol Levels' },
    { value: 'heart-rate', label: 'Heart Rate' },
    { value: 'weight', label: 'Weight' },
  ];
  
  // Sample data for analytics
  const bloodPressureData = [
    { month: 'May', systolic: 128, diastolic: 82 },
    { month: 'Jun', systolic: 126, diastolic: 80 },
    { month: 'Jul', systolic: 124, diastolic: 79 },
    { month: 'Aug', systolic: 125, diastolic: 81 },
    { month: 'Sep', systolic: 123, diastolic: 80 },
    { month: 'Oct', systolic: 122, diastolic: 78 },
  ];
  
  const glucoseData = [
    { month: 'May', fasting: 94, postMeal: 142 },
    { month: 'Jun', fasting: 96, postMeal: 136 },
    { month: 'Jul', fasting: 95, postMeal: 138 },
    { month: 'Aug', fasting: 92, postMeal: 134 },
    { month: 'Sep', fasting: 90, postMeal: 130 },
    { month: 'Oct', fasting: 92, postMeal: 128 },
  ];
  
  const cholesterolData = [
    { month: 'May', total: 190, ldl: 110, hdl: 62 },
    { month: 'Jun', month: 'Jun', total: 188, ldl: 112, hdl: 60 },
    { month: 'Jul', month: 'Jul', total: 185, ldl: 108, hdl: 63 },
    { month: 'Aug', month: 'Aug', total: 183, ldl: 105, hdl: 65 },
    { month: 'Sep', month: 'Sep', total: 180, ldl: 102, hdl: 64 },
    { month: 'Oct', month: 'Oct', total: 182, ldl: 104, hdl: 63 },
  ];
  
  // Distribution data for pie charts
  const categoryDistribution = [
    { name: 'Blood', value: 3 },
    { name: 'Heart', value: 2 },
    { name: 'Kidney', value: 1 },
    { name: 'Liver', value: 1 },
    { name: 'Thyroid', value: 1 },
    { name: 'Glucose', value: 1 },
    { name: 'Cholesterol', value: 3 },
  ];
  
  const colors = ['#0EA5E9', '#8B5CF6', '#10B981', '#F97316', '#EF4444', '#EC4899', '#0D9488'];
  
  // Get the appropriate data based on selected metric
  const getChartData = () => {
    switch(selectedMetric) {
      case 'blood-pressure':
        return bloodPressureData;
      case 'glucose':
        return glucoseData;
      case 'cholesterol':
        return cholesterolData;
      default:
        return bloodPressureData;
    }
  };
  
  // Get the appropriate lines based on selected metric
  const getChartLines = () => {
    switch(selectedMetric) {
      case 'blood-pressure':
        return (
          <>
            <Line type="monotone" dataKey="systolic" stroke="#0EA5E9" name="Systolic (mmHg)" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="diastolic" stroke="#8B5CF6" name="Diastolic (mmHg)" />
          </>
        );
      case 'glucose':
        return (
          <>
            <Line type="monotone" dataKey="fasting" stroke="#10B981" name="Fasting (mg/dL)" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="postMeal" stroke="#F97316" name="Post-meal (mg/dL)" />
          </>
        );
      case 'cholesterol':
        return (
          <>
            <Line type="monotone" dataKey="total" stroke="#0EA5E9" name="Total (mg/dL)" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="ldl" stroke="#EF4444" name="LDL (mg/dL)" />
            <Line type="monotone" dataKey="hdl" stroke="#10B981" name="HDL (mg/dL)" />
          </>
        );
      default:
        return (
          <Line type="monotone" dataKey="value" stroke="#0EA5E9" name="Value" activeDot={{ r: 8 }} />
        );
    }
  };
  
  // Get the appropriate bars based on selected metric
  const getChartBars = () => {
    switch(selectedMetric) {
      case 'blood-pressure':
        return (
          <>
            <Bar dataKey="systolic" fill="#0EA5E9" name="Systolic (mmHg)" />
            <Bar dataKey="diastolic" fill="#8B5CF6" name="Diastolic (mmHg)" />
          </>
        );
      case 'glucose':
        return (
          <>
            <Bar dataKey="fasting" fill="#10B981" name="Fasting (mg/dL)" />
            <Bar dataKey="postMeal" fill="#F97316" name="Post-meal (mg/dL)" />
          </>
        );
      case 'cholesterol':
        return (
          <>
            <Bar dataKey="total" fill="#0EA5E9" name="Total (mg/dL)" />
            <Bar dataKey="ldl" fill="#EF4444" name="LDL (mg/dL)" />
            <Bar dataKey="hdl" fill="#10B981" name="HDL (mg/dL)" />
          </>
        );
      default:
        return (
          <Bar dataKey="value" fill="#0EA5E9" name="Value" />
        );
    }
  };
  
  // Get metric summary stats
  const getMetricSummary = () => {
    const data = getChartData();
    
    if (selectedMetric === 'blood-pressure') {
      const systolicValues = data.map(item => item.systolic);
      const diastolicValues = data.map(item => item.diastolic);
      
      return (
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Systolic Average</div>
              <div className="text-2xl font-bold text-health-blue">
                {(systolicValues.reduce((a, b) => a + b, 0) / systolicValues.length).toFixed(1)} mmHg
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Diastolic Average</div>
              <div className="text-2xl font-bold text-health-purple">
                {(diastolicValues.reduce((a, b) => a + b, 0) / diastolicValues.length).toFixed(1)} mmHg
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Systolic Range</div>
              <div className="text-2xl font-bold text-health-blue">
                {Math.min(...systolicValues)} - {Math.max(...systolicValues)} mmHg
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Diastolic Range</div>
              <div className="text-2xl font-bold text-health-purple">
                {Math.min(...diastolicValues)} - {Math.max(...diastolicValues)} mmHg
              </div>
            </CardContent>
          </Card>
        </div>
      );
    } else if (selectedMetric === 'glucose') {
      const fastingValues = data.map(item => item.fasting);
      const postMealValues = data.map(item => item.postMeal);
      
      return (
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Fasting Average</div>
              <div className="text-2xl font-bold text-health-green">
                {(fastingValues.reduce((a, b) => a + b, 0) / fastingValues.length).toFixed(1)} mg/dL
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Post-meal Average</div>
              <div className="text-2xl font-bold text-health-orange">
                {(postMealValues.reduce((a, b) => a + b, 0) / postMealValues.length).toFixed(1)} mg/dL
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Fasting Range</div>
              <div className="text-2xl font-bold text-health-green">
                {Math.min(...fastingValues)} - {Math.max(...fastingValues)} mg/dL
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Post-meal Range</div>
              <div className="text-2xl font-bold text-health-orange">
                {Math.min(...postMealValues)} - {Math.max(...postMealValues)} mg/dL
              </div>
            </CardContent>
          </Card>
        </div>
      );
    } else if (selectedMetric === 'cholesterol') {
      const totalValues = data.map(item => item.total);
      const ldlValues = data.map(item => item.ldl);
      const hdlValues = data.map(item => item.hdl);
      
      return (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Total Average</div>
              <div className="text-2xl font-bold text-health-blue">
                {(totalValues.reduce((a, b) => a + b, 0) / totalValues.length).toFixed(1)} mg/dL
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">LDL Average</div>
              <div className="text-2xl font-bold text-health-red">
                {(ldlValues.reduce((a, b) => a + b, 0) / ldlValues.length).toFixed(1)} mg/dL
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">HDL Average</div>
              <div className="text-2xl font-bold text-health-green">
                {(hdlValues.reduce((a, b) => a + b, 0) / hdlValues.length).toFixed(1)} mg/dL
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Health Analytics</h1>
        <p className="text-muted-foreground">Analyze your health data and track trends over time</p>
      </div>
      
      <Tabs defaultValue="trends">
        <TabsList>
          <TabsTrigger value="trends">Trends Analysis</TabsTrigger>
          <TabsTrigger value="metrics">Metrics Overview</TabsTrigger>
          <TabsTrigger value="distribution">Data Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trends" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a metric" />
                </SelectTrigger>
                <SelectContent>
                  {metricOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a time range" />
                </SelectTrigger>
                <SelectContent>
                  {timeRangeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant={chartType === 'line' ? 'default' : 'outline'} 
                size="icon" 
                onClick={() => setChartType('line')}
              >
                <LineChartIcon className="h-4 w-4" />
              </Button>
              <Button 
                variant={chartType === 'bar' ? 'default' : 'outline'} 
                size="icon" 
                onClick={() => setChartType('bar')}
              >
                <BarChartIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>
                {metricOptions.find(o => o.value === selectedMetric)?.label} Trends
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({timeRangeOptions.find(o => o.value === timeRange)?.label})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'line' ? (
                    <RechartsLineChart
                      data={getChartData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {getChartLines()}
                    </RechartsLineChart>
                  ) : (
                    <RechartsBarChart
                      data={getChartData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {getChartBars()}
                    </RechartsBarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {getMetricSummary()}
          
          <Card>
            <CardHeader>
              <CardTitle>Analysis & Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-accent/30 rounded-lg">
                  <h3 className="font-medium mb-2">Key Observations</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {selectedMetric === 'blood-pressure' ? (
                      <>
                        <li>Your blood pressure has shown a gradual improvement over the past 6 months.</li>
                        <li>Systolic pressure decreased from 128 to 122 mmHg.</li>
                        <li>Diastolic pressure decreased from 82 to 78 mmHg.</li>
                        <li>Your latest readings are within the normal range (below 120/80 mmHg).</li>
                      </>
                    ) : selectedMetric === 'glucose' ? (
                      <>
                        <li>Your fasting glucose levels have improved from 94 to 92 mg/dL.</li>
                        <li>Post-meal glucose has shown significant improvement, from 142 to 128 mg/dL.</li>
                        <li>All readings are within the normal range (fasting: below 100 mg/dL).</li>
                        <li>The trend shows consistent improvement in glucose control.</li>
                      </>
                    ) : (
                      <>
                        <li>Your total cholesterol has decreased from 190 to 182 mg/dL.</li>
                        <li>LDL (bad) cholesterol has decreased from 110 to 104 mg/dL.</li>
                        <li>HDL (good) cholesterol has remained stable around 62-65 mg/dL.</li>
                        <li>All values are within the recommended ranges.</li>
                      </>
                    )}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Recommendations</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {selectedMetric === 'blood-pressure' ? (
                      <>
                        <li>Continue with your current medication and lifestyle habits.</li>
                        <li>Maintain a low-sodium diet and regular exercise routine.</li>
                        <li>Consider monitoring blood pressure at different times of day to identify patterns.</li>
                        <li>Share these results with your healthcare provider at your next visit.</li>
                      </>
                    ) : selectedMetric === 'glucose' ? (
                      <>
                        <li>Continue with your current diet and medication regimen.</li>
                        <li>Consider monitoring post-meal glucose 1-2 hours after different types of meals.</li>
                        <li>Maintain regular physical activity to help with glucose control.</li>
                        <li>Share these trends with your healthcare provider.</li>
                      </>
                    ) : (
                      <>
                        <li>Continue with your current cholesterol management approach.</li>
                        <li>Maintain a diet rich in vegetables, fruits, and whole grains.</li>
                        <li>Continue regular physical activity to help maintain healthy HDL levels.</li>
                        <li>Schedule follow-up testing in 6 months to monitor ongoing trends.</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="metrics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Health Metrics Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="p-2 font-medium">Metric</th>
                      <th className="p-2 font-medium">Current Value</th>
                      <th className="p-2 font-medium">Previous</th>
                      <th className="p-2 font-medium">Change</th>
                      <th className="p-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2">Blood Pressure (Systolic)</td>
                      <td className="p-2 font-medium">122 mmHg</td>
                      <td className="p-2 text-muted-foreground">128 mmHg</td>
                      <td className="p-2 text-green-600">-6 mmHg</td>
                      <td className="p-2"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Normal</span></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">Blood Pressure (Diastolic)</td>
                      <td className="p-2 font-medium">78 mmHg</td>
                      <td className="p-2 text-muted-foreground">82 mmHg</td>
                      <td className="p-2 text-green-600">-4 mmHg</td>
                      <td className="p-2"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Normal</span></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">Blood Glucose (Fasting)</td>
                      <td className="p-2 font-medium">92 mg/dL</td>
                      <td className="p-2 text-muted-foreground">94 mg/dL</td>
                      <td className="p-2 text-green-600">-2 mg/dL</td>
                      <td className="p-2"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Normal</span></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">Total Cholesterol</td>
                      <td className="p-2 font-medium">182 mg/dL</td>
                      <td className="p-2 text-muted-foreground">190 mg/dL</td>
                      <td className="p-2 text-green-600">-8 mg/dL</td>
                      <td className="p-2"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Normal</span></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">LDL Cholesterol</td>
                      <td className="p-2 font-medium">104 mg/dL</td>
                      <td className="p-2 text-muted-foreground">110 mg/dL</td>
                      <td className="p-2 text-green-600">-6 mg/dL</td>
                      <td className="p-2"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Borderline</span></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">HDL Cholesterol</td>
                      <td className="p-2 font-medium">63 mg/dL</td>
                      <td className="p-2 text-muted-foreground">62 mg/dL</td>
                      <td className="p-2 text-green-600">+1 mg/dL</td>
                      <td className="p-2"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Normal</span></td>
                    </tr>
                    <tr>
                      <td className="p-2">Weight</td>
                      <td className="p-2 font-medium">168 lbs</td>
                      <td className="p-2 text-muted-foreground">172 lbs</td>
                      <td className="p-2 text-green-600">-4 lbs</td>
                      <td className="p-2"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Normal</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Metrics Correlation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart
                        data={[
                          { month: '1', bp: 128, glucose: 94, cholesterol: 190, weight: 172 },
                          { month: '2', bp: 126, glucose: 96, cholesterol: 188, weight: 171 },
                          { month: '3', bp: 125, glucose: 95, cholesterol: 185, weight: 170 },
                          { month: '4', bp: 124, glucose: 92, cholesterol: 183, weight: 169 },
                          { month: '5', bp: 123, glucose: 91, cholesterol: 182, weight: 168 },
                          { month: '6', bp: 122, glucose: 92, cholesterol: 182, weight: 168 },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottomRight', offset: -10 }} />
                        <YAxis label={{ value: 'Percentage of Baseline', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="bp" stroke="#0EA5E9" name="Blood Pressure %" />
                        <Line type="monotone" dataKey="glucose" stroke="#10B981" name="Glucose %" />
                        <Line type="monotone" dataKey="cholesterol" stroke="#8B5CF6" name="Cholesterol %" />
                        <Line type="monotone" dataKey="weight" stroke="#F97316" name="Weight %" />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Health Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-muted stroke-current"
                        strokeWidth="10"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                      />
                      <circle
                        className="text-primary stroke-current"
                        strokeWidth="10"
                        strokeLinecap="round"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        strokeDasharray={`${8.4 * 30} ${8.4 * 10}`}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold">87</span>
                      <span className="text-sm text-muted-foreground">of 100</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="font-medium text-lg">Excellent</h3>
                    <p className="text-sm text-muted-foreground">Your health metrics are trending positively</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 rounded-full bg-health-green mr-2"></div>
                      <span>Heart: 90%</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 rounded-full bg-health-blue mr-2"></div>
                      <span>Blood: 85%</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 rounded-full bg-health-purple mr-2"></div>
                      <span>Weight: 88%</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 rounded-full bg-health-orange mr-2"></div>
                      <span>Activity: 82%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="distribution" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Metrics by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={categoryDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value} metrics`, name]} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Metric Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={[
                          { name: 'Normal', value: 8 },
                          { name: 'Borderline', value: 2 },
                          { name: 'High', value: 1 },
                          { name: 'Low', value: 1 },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#10B981" />
                        <Cell fill="#F97316" />
                        <Cell fill="#EF4444" />
                        <Cell fill="#0EA5E9" />
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value} metrics`, name]} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Metrics Distribution by Readings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={[
                      { name: 'Blood Pressure', readings: 24 },
                      { name: 'Cholesterol', readings: 18 },
                      { name: 'Glucose', readings: 16 },
                      { name: 'Weight', readings: 30 },
                      { name: 'Heart Rate', readings: 20 },
                      { name: 'Thyroid', readings: 8 },
                      { name: 'Kidney', readings: 5 },
                      { name: 'Liver', readings: 6 },
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="readings" name="Number of Readings" fill="#0EA5E9">
                      {[
                        <Cell key="cell-0" fill="#0EA5E9" />,
                        <Cell key="cell-1" fill="#8B5CF6" />,
                        <Cell key="cell-2" fill="#10B981" />,
                        <Cell key="cell-3" fill="#F97316" />,
                        <Cell key="cell-4" fill="#EF4444" />,
                        <Cell key="cell-5" fill="#EC4899" />,
                        <Cell key="cell-6" fill="#0D9488" />,
                        <Cell key="cell-7" fill="#6366F1" />,
                      ]}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Tracking Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 91 }, (_, i) => (
                  <div
                    key={i}
                    className={`h-6 rounded-sm ${
                      Math.random() > 0.5 
                        ? 'bg-primary/10'
                        : Math.random() > 0.7
                          ? 'bg-primary/30' 
                          : Math.random() > 0.85
                            ? 'bg-primary/60' 
                            : 'bg-muted'
                    }`}
                    title={`${Math.floor(Math.random() * 5)} entries on day ${i + 1}`}
                  />
                ))}
              </div>
              <div className="flex justify-end items-center mt-2">
                <div className="text-xs text-muted-foreground">Less</div>
                <div className="flex space-x-1 ml-2">
                  <div className="w-3 h-3 bg-muted rounded-sm"></div>
                  <div className="w-3 h-3 bg-primary/10 rounded-sm"></div>
                  <div className="w-3 h-3 bg-primary/30 rounded-sm"></div>
                  <div className="w-3 h-3 bg-primary/60 rounded-sm"></div>
                </div>
                <div className="text-xs text-muted-foreground ml-2">More</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
