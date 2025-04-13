export interface Event {
  id: string;
  groupId: string;
  groupName: string;
  name: string;
  description: string;
  location: string;
  date: string;
  time: string;
  budget: string;
  splitBudget: boolean;
  createdAt: string;
}

class EventService {
  private static EVENTS_KEY = 'events';

  static getAllEvents(): Event[] {
    if (typeof window === 'undefined') return [];
    const events = localStorage.getItem(this.EVENTS_KEY);
    return events ? JSON.parse(events) : [];
  }

  static addEvent(event: Event): void {
    const events = this.getAllEvents();
    events.unshift(event);
    localStorage.setItem(this.EVENTS_KEY, JSON.stringify(events));
  }

  static updateEvent(updatedEvent: Event): void {
    const events = this.getAllEvents();
    const index = events.findIndex(e => e.id === updatedEvent.id);
    if (index !== -1) {
      events[index] = updatedEvent;
      localStorage.setItem(this.EVENTS_KEY, JSON.stringify(events));
    }
  }

  static deleteEvent(eventId: string): void {
    const events = this.getAllEvents();
    const filteredEvents = events.filter(e => e.id !== eventId);
    localStorage.setItem(this.EVENTS_KEY, JSON.stringify(filteredEvents));
  }

  static deleteEventsByGroupId(groupId: string): void {
    const events = this.getAllEvents();
    const filteredEvents = events.filter(e => e.groupId !== groupId);
    localStorage.setItem(this.EVENTS_KEY, JSON.stringify(filteredEvents));
  }

  static getLatestEvents(limit: number = 5): Event[] {
    const events = this.getAllEvents();
    // Get existing groups to filter out events from deleted groups
    const groups = JSON.parse(localStorage.getItem('groups') || '[]');
    const groupIds = groups.map((g: any) => g.id.toString());
    
    return events
      .filter(event => groupIds.includes(event.groupId))
      .slice(0, limit);
  }

  static getEventsByGroupId(groupId: string): Event[] {
    const events = this.getAllEvents();
    // Check if group still exists
    const groups = JSON.parse(localStorage.getItem('groups') || '[]');
    const groupExists = groups.some((g: any) => g.id.toString() === groupId);
    
    if (!groupExists) {
      // If group doesn't exist, clean up its events
      this.deleteEventsByGroupId(groupId);
      return [];
    }

    return events
      .filter(event => event.groupId === groupId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static cleanupDeletedGroups(): void {
    const events = this.getAllEvents();
    const groups = JSON.parse(localStorage.getItem('groups') || '[]');
    const groupIds = groups.map((g: any) => g.id.toString());

    // Filter out events from deleted groups
    const validEvents = events.filter(event => groupIds.includes(event.groupId));

    if (validEvents.length !== events.length) {
      localStorage.setItem(this.EVENTS_KEY, JSON.stringify(validEvents));
    }
  }
}

export default EventService; 