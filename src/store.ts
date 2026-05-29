import { create } from 'zustand';
import { User, Project, Device, TelemetryLog, GroupConfig } from './types';

interface AppState {
  user: User | null;
  groups: GroupConfig[];
  devices: Device[];
  projects: Project[];
  usersList: any[];
  logs: TelemetryLog[];
  isRealtimeConnected: boolean;
  eventSourceRef: EventSource | null;

  setUser: (user: User | null) => void;
  setGroups: (groups: GroupConfig[]) => void;
  setDevices: (devices: Device[]) => void;
  setProjects: (projects: Project[]) => void;
  setUsersList: (users: any[]) => void;
  setLogs: (logs: TelemetryLog[]) => void;
  addLog: (log: TelemetryLog) => void;
  updateDevice: (groupSlug: string, device: Device) => void;
  updateGroupConfig: (groupSlug: string, config: GroupConfig) => void;
  setIsRealtimeConnected: (connected: boolean) => void;
  setEventSourceRef: (ref: EventSource | null) => void;
  connectSSE: () => void;
  fetchInitialData: () => Promise<void>;
  updateGroupConfigApi: (groupSlug: string, updates: Partial<GroupConfig>, token: string) => Promise<boolean>;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  groups: [],
  devices: [],
  projects: [],
  usersList: [],
  logs: [],
  isRealtimeConnected: false,
  eventSourceRef: null,

  setUser: (user) => set({ user }),
  setGroups: (groups) => set({ groups }),
  setDevices: (devices) => set({ devices }),
  setProjects: (projects) => set({ projects }),
  setUsersList: (usersList) => set({ usersList }),
  setLogs: (logs) => set({ logs }),
  
  addLog: (log) => set((state) => {
    // Limit cache length for performance
    const updated = [...state.logs, log].slice(-350);
    return { logs: updated };
  }),
  
  updateDevice: (groupSlug, device) => set((state) => ({
    devices: state.devices.map(d => d.groupSlug === groupSlug ? device : d)
  })),

  updateGroupConfig: (groupSlug, config) => set((state) => ({
    groups: state.groups.map(g => g.groupSlug === groupSlug ? config : g),
    projects: state.projects.map(p => p.groupSlug === groupSlug ? {
      ...p,
      name: config.projectName,
      description: config.projectDesc,
      lastUpdated: new Date().toISOString()
    } : p)
  })),

  setIsRealtimeConnected: (connected) => set({ isRealtimeConnected: connected }),
  setEventSourceRef: (ref) => set({ eventSourceRef: ref }),

  connectSSE: () => {
    const { eventSourceRef, setIsRealtimeConnected, addLog, updateDevice, updateGroupConfig } = get();
    
    if (eventSourceRef) {
      eventSourceRef.close();
    }

    const sse = new EventSource('/api/telemetry/stream');
    get().setEventSourceRef(sse);

    sse.onopen = () => {
      setIsRealtimeConnected(true);
    };

    sse.onerror = () => {
      setIsRealtimeConnected(false);
      sse.close();
      get().setEventSourceRef(null);
      // Attempt reconnection
      setTimeout(() => get().connectSSE(), 4000);
    };

    sse.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'TELEMETRY_UPDATE') {
          addLog(msg.log);
          if (msg.device) {
            updateDevice(msg.groupSlug, msg.device);
          }
        } else if (msg.type === 'CONFIG_UPDATE') {
          if (msg.config) {
            updateGroupConfig(msg.groupSlug, msg.config);
          }
        }
      } catch (e) {
        // parsing issues
      }
    };
  },

  fetchInitialData: async () => {
    try {
      const response = await fetch('/api/dashboard/summary');
      const data = await response.json();
      set({
        groups: data.groups || [],
        devices: data.devices || [],
        projects: data.projects || [],
        usersList: data.users || [],
        logs: data.logs || []
      });
    } catch (e) {
      console.error("Gagal sinkronisasi data awal", e);
    }
  },

  updateGroupConfigApi: async (groupSlug, updates, token) => {
    try {
      const response = await fetch(`/api/groups/${groupSlug}/widgets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        set((state) => {
          const newGroups = state.groups.map(g => g.groupSlug === groupSlug ? { ...g, ...updates } : g);
          return { groups: newGroups };
        });
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}));
