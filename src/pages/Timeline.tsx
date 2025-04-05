
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Pill, Activity } from "lucide-react";
import { sampleTimelineEvents } from '@/data/sampleData';

const Timeline = () => {
  // Get all timeline events and sort by date (newest first)
  const timelineEvents = [...sampleTimelineEvents]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Health Timeline</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 sm:p-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Health Journey</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {timelineEvents.map(event => {
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
                      <div className="bg-card border border-border rounded-lg p-4 w-full -mt-2 group-hover:bg-accent/10 transition-colors">
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
        </div>
      </div>
    </div>
  );
};

export default Timeline;
