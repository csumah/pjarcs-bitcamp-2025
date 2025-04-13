import EventService from './eventService';

export interface Group {
  id: number;
  name: string;
  description: string;
  members: string[];
  createdAt: string;
  event?: {
    name: string;
    description: string;
    date: string;
    time: string;
    budget: string;
    splitBudget: boolean;
    members?: string[];
  };
}

class GroupService {
  private static readonly STORAGE_KEY = 'groups';

  static getAllGroups(): Group[] {
    if (typeof window === 'undefined') return [];
    const groups = localStorage.getItem(this.STORAGE_KEY);
    return groups ? JSON.parse(groups) : [];
  }

  static getGroupById(id: number): Group | null {
    const groups = this.getAllGroups();
    return groups.find(group => group.id === id) || null;
  }

  static createGroup(groupData: Omit<Group, 'id' | 'createdAt'>): Group {
    const groups = this.getAllGroups();
    const newGroup: Group = {
      ...groupData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify([...groups, newGroup]));
    return newGroup;
  }

  static updateGroup(id: number, groupData: Partial<Group>): Group | null {
    const groups = this.getAllGroups();
    const index = groups.findIndex(group => group.id === id);
    
    if (index === -1) return null;
    
    const updatedGroup = {
      ...groups[index],
      ...groupData,
    };
    
    groups[index] = updatedGroup;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(groups));
    return updatedGroup;
  }

  static addEventToGroup(groupId: number, eventData: Group['event']): Group | null {
    return this.updateGroup(groupId, { event: eventData });
  }

  static deleteGroup(id: number): boolean {
    const groups = this.getAllGroups();
    const filteredGroups = groups.filter(group => group.id !== id);
    
    if (filteredGroups.length === groups.length) return false;
    
    // Delete all events associated with this group
    EventService.deleteEventsByGroupId(id.toString());
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredGroups));
    return true;
  }
}

export default GroupService; 