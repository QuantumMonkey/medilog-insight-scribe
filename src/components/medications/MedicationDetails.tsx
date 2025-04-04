
import React from 'react';
import { 
  Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Trash, Printer, CheckCircle, XCircle, Bell, Clock, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Medication } from '@/types/health';
import { Plus } from 'lucide-react';

interface MedicationDetailsProps {
  medication: Medication;
  onStatusToggle: () => void;
  onSetReminder: () => void;
  onPrintInformation: () => void;
}

const MedicationDetails = ({ 
  medication, 
  onStatusToggle,
  onSetReminder,
  onPrintInformation
}: MedicationDetailsProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{medication.name}</CardTitle>
            <CardDescription>
              {medication.dosage} • {medication.frequency}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Dialog>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Medication</DialogTitle>
                </DialogHeader>
                {/* Edit form would go here */}
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
              <Button variant="outline" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </Dialog>
            
            <Button variant="outline" size="icon">
              <Trash className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Medication</h3>
                <p className="mt-1 font-medium">{medication.name}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Dosage</h3>
                <p className="mt-1">{medication.dosage}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Frequency</h3>
                <p className="mt-1">{medication.frequency}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">For Condition</h3>
                <p className="mt-1">{medication.forCondition}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Start Date</h3>
                <p className="mt-1">{medication.startDate}</p>
              </div>
              
              {medication.endDate && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">End Date</h3>
                  <p className="mt-1">{medication.endDate}</p>
                </div>
              )}
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
              <p className="mt-1 p-3 bg-muted/30 rounded-md">{medication.notes}</p>
            </div>
            
            <div className="mt-4 p-3 border rounded-md bg-accent/10 flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-3">
                  {medication.isActive ? 
                    <CheckCircle className="h-5 w-5 text-green-600" /> : 
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  }
                </div>
                <div>
                  <p className="font-medium">Status: {medication.isActive ? 'Active' : 'Completed'}</p>
                  <p className="text-sm text-muted-foreground">
                    {medication.isActive 
                      ? 'You are currently taking this medication' 
                      : 'You have completed this medication course'}
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={onStatusToggle}>
                {medication.isActive ? 'Mark as Completed' : 'Mark as Active'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="reminders">
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 mr-3 text-health-blue" />
                  <div>
                    <p className="font-medium">Medication Reminders</p>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications to take your medication
                    </p>
                  </div>
                </div>
                <Switch checked={medication.reminderTimes ? medication.reminderTimes.length > 0 : false} />
              </div>
              
              {medication.reminderTimes && medication.reminderTimes.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Reminder Schedule</h3>
                  
                  {medication.reminderTimes.map((time, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{time}</span>
                      </div>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Time
                  </Button>
                </div>
              )}
              
              <div className="p-4 bg-muted/30 rounded-md flex items-start mt-4">
                <AlertCircle className="h-5 w-5 mr-3 text-health-blue mt-0.5" />
                <div>
                  <p className="font-medium">Reminder Tips</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Set reminders at times when you're likely to remember taking your medication, 
                    such as morning routines or meal times. Consistent timing helps maintain optimal 
                    medication levels in your body.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-2 justify-between">
        <Button variant="outline" className="w-full sm:w-auto" onClick={onPrintInformation}>
          <Printer className="mr-2 h-4 w-4" />
          Print Information
        </Button>
        <Button className="w-full sm:w-auto" onClick={onSetReminder}>Set Reminder</Button>
      </CardFooter>
    </Card>
  );
};

export default MedicationDetails;
