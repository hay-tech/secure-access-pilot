
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuditLog, User } from '@/types/iam';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface AuditLogFiltersProps {
  logs: AuditLog[];
  users: User[];
  onFilterChange: (filteredLogs: AuditLog[]) => void;
}

export const AuditLogFilters: React.FC<AuditLogFiltersProps> = ({ 
  logs, 
  users,
  onFilterChange 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [eventType, setEventType] = useState('');
  const [userId, setUserId] = useState('');
  const [dateRange, setDateRange] = useState('');
  
  const eventTypes = Array.from(new Set(logs.map(log => log.eventType)));
  
  useEffect(() => {
    let filtered = [...logs];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log => 
        log.details.toLowerCase().includes(query)
      );
    }
    
    // Filter by event type
    if (eventType) {
      filtered = filtered.filter(log => log.eventType === eventType);
    }
    
    // Filter by user
    if (userId) {
      filtered = filtered.filter(log => log.userId === userId);
    }
    
    // Filter by date range
    if (dateRange) {
      const now = new Date();
      let startDate: Date;
      
      switch (dateRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'yesterday':
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 1);
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate = new Date(now);
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        default:
          startDate = new Date(0);
      }
      
      filtered = filtered.filter(log => new Date(log.timestamp) >= startDate);
    }
    
    onFilterChange(filtered);
  }, [logs, searchQuery, eventType, userId, dateRange, onFilterChange]);
  
  const handleReset = () => {
    setSearchQuery('');
    setEventType('');
    setUserId('');
    setDateRange('');
  };
  
  return (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search in details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="event-type">Event Type</Label>
          <Select value={eventType} onValueChange={setEventType}>
            <SelectTrigger id="event-type">
              <SelectValue placeholder="All Events" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Events</SelectItem>
              {eventTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type.replace('_', ' ').split(' ').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="user">User</Label>
          <Select value={userId} onValueChange={setUserId}>
            <SelectTrigger id="user">
              <SelectValue placeholder="All Users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Users</SelectItem>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="date-range">Date Range</Label>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger id="date-range">
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button variant="outline" onClick={handleReset}>Reset Filters</Button>
      </div>
    </div>
  );
};
