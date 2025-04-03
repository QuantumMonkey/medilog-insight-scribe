
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Download, Clock, Filter } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getActivityLogs, exportLogs } from '@/services/securityService';
import { ActivityLog } from '@/types/consultations';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const ActivityLogger = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const { toast } = useToast();
  
  const loadLogs = () => {
    const allLogs = getActivityLogs();
    setLogs(allLogs);
  };
  
  const handleExport = () => {
    try {
      const logsJson = exportLogs();
      
      // Create a blob with the data
      const blob = new Blob([logsJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create a link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `medlog_activity_logs_${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Logs exported successfully",
        description: "The activity log has been downloaded as a JSON file.",
      });
    } catch (error) {
      console.error("Error exporting logs:", error);
      toast({
        title: "Export failed",
        description: "There was a problem exporting the activity logs.",
        variant: "destructive"
      });
    }
  };
  
  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.action === filter);
  
  const getActionColor = (action: string): string => {
    switch (action) {
      case 'view': return 'text-blue-500';
      case 'create': return 'text-green-500';
      case 'update': return 'text-yellow-500';
      case 'delete': return 'text-red-500';
      case 'export': return 'text-purple-500';
      case 'decrypt': return 'text-cyan-500';
      case 'security_check': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };
  
  return (
    <Dialog onOpenChange={(open) => {
      if (open) loadLogs();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Clock className="mr-2 h-4 w-4" />
          Activity Logs
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Activity Logs</DialogTitle>
          <DialogDescription>
            View and export your app activity for auditing purposes.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filter:</span>
            <select 
              className="bg-background border rounded px-2 py-1 text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Activities</option>
              <option value="view">View</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="export">Export</option>
              <option value="decrypt">Decrypt</option>
              <option value="security_check">Security Check</option>
            </select>
          </div>
          
          <Button size="sm" variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Logs
          </Button>
        </div>
        
        <ScrollArea className="h-80">
          {filteredLogs.length > 0 ? (
            <div className="space-y-3">
              {filteredLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="p-3 border rounded-lg text-sm"
                >
                  <div className="flex justify-between items-start">
                    <span className={`font-medium capitalize ${getActionColor(log.action)}`}>
                      {log.action.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1">{log.details}</p>
                  {log.consultationId && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      Consultation ID: {log.consultationId}
                    </div>
                  )}
                  <div className="mt-1 flex items-center">
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <FileText className="h-12 w-12 mb-2 opacity-20" />
              <p>No activity logs found</p>
            </div>
          )}
        </ScrollArea>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export JSON
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityLogger;
