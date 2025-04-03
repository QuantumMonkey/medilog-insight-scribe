
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChartIcon, LineChart as LineChartIcon, PieChart as PieChartIcon, FileText, Activity, Pill } from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, Bar, 
  XAxis, YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Line, 
  LineChart,
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { sampleMetrics, sampleMedications, sampleTimelineEvents } from '@/data/sampleData';
import { Medication, HealthMetric } from '@/types/health';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";

const Analytics = () => {
  // Medication adherence analysis
  const totalMedications = sampleMedications.length;
  const activeMedications = sampleMedications.filter(med => med.isActive).length;
  const completedMedications = totalMedications - activeMedications;

  const medicationData = [
    { name: 'Active', value: activeMedications },
    { name: 'Completed', value: completedMedications },
  ];

  const medicationColors = ['#3B82F6', '#6EE7B7'];

  // Metric distribution analysis
  const metricCategories = [...new Set(sampleMetrics.map(metric => metric.category))];
  const metricData = metricCategories.map(category => ({
    name: category,
    value: sampleMetrics.filter(metric => metric.category === category).length,
  }));

  const metricColors = ['#F472B6', '#A855F7', '#34D399', '#FACC15', '#FB7185'];

  // Timeline event analysis
  const eventTypes = [...new Set(sampleTimelineEvents.map(event => event.type))];
  const eventData = eventTypes.map(type => ({
    name: type,
    value: sampleTimelineEvents.filter(event => event.type === type).length,
  }));

  const eventColors = ['#6366F1', '#F59E0B', '#10B981'];

  // Average metric values
  const averageMetrics = metricCategories.map(category => {
    const categoryMetrics = sampleMetrics.filter(metric => metric.category === category);
    const totalValue = categoryMetrics.reduce((sum, metric) => sum + metric.value, 0);
    const averageValue = totalValue / categoryMetrics.length || 0;
    return {
      category: category,
      average: averageValue,
    };
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Medication Adherence Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Pill className="mr-2 h-5 w-5" />Medication Adherence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={medicationData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {medicationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={medicationColors[index % medicationColors.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Metric Distribution Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Activity className="mr-2 h-5 w-5" />Metric Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metricData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d">
                    {metricData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={metricColors[index % metricColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Timeline Event Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <FileText className="mr-2 h-5 w-5" />Timeline Event Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={eventData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Average Metric Values */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <BarChartIcon className="mr-2 h-5 w-5" />Average Metric Values
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {averageMetrics.map(metric => (
              <div key={metric.category} className="p-4 border rounded-md">
                <h3 className="text-md font-semibold">{metric.category}</h3>
                <p className="text-gray-500">Average Value: {metric.average.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
