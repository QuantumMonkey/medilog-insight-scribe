
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Search, Filter } from "lucide-react";
import { 
  Drawer, 
  DrawerTrigger, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle,
  DrawerClose,
  DrawerFooter
} from "@/components/ui/drawer";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search reports by title, doctor, or facility..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Filter Reports</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Date Range</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input 
                      id="start-date"
                      type="date"
                      placeholder="Start date"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input 
                      id="end-date"
                      type="date"
                      placeholder="End date"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Doctor</h3>
                <div className="space-y-2">
                  {['All', 'Dr. Smith', 'Dr. Johnson', 'Self'].map((doctor) => (
                    <div key={doctor} className="flex items-center space-x-2">
                      <Checkbox id={`doctor-${doctor}`} />
                      <Label htmlFor={`doctor-${doctor}`}>{doctor}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Facility</h3>
                <div className="space-y-2">
                  {['All', 'General Hospital', 'Medical Center', 'Self'].map((facility) => (
                    <div key={facility} className="flex items-center space-x-2">
                      <Checkbox id={`facility-${facility}`} />
                      <Label htmlFor={`facility-${facility}`}>{facility}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DrawerFooter className="pt-2">
            <Button onClick={() => setIsFilterOpen(false)}>Apply Filters</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SearchBar;
