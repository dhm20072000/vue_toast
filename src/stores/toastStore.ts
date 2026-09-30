import { defineStore } from "pinia";
import type { NotificationType, NotificationConfig, Preset } from "../types";
import { NOTIFICATION_COLORS } from "../utils/colors";

export const useToastStore = defineStore('toast',{
  state: () => ({
    currentConfig:{
      type: 'success',
      title: 'Success!',
      message: 'Your changes have been saved successfully.',
      duration: 3000,
      position: 'top-right',
      backgroundColor: '#22c55e',
      textColor: '#FFFFFF',
      showIcon: true,
      showCloseButton: true,
      animation: 'slide'
    } as Omit<NotificationConfig, 'id'>,
    activeToasts: [] as NotificationConfig[],
    presets: JSON.parse(localStorage.getItem('toast-presets') || '[]') as Preset[]
  }),
  actions:{
    updateType(newType: NotificationType){
      this.currentConfig = {...this.currentConfig, type: newType, backgroundColor: NOTIFICATION_COLORS[newType]};
    },
    setPersistence(isPersistence: boolean){
      this.currentConfig = {...this.currentConfig, duration: isPersistence ? 0 : 3000};
    },
    showNotification(){
      const id = Date.now().toString();
      const newToast = {...this.currentConfig, id} as NotificationConfig;
      this.activeToasts.push(newToast);

      if(this.currentConfig.duration > 0){
        setTimeout(() => this.removeToast(id), this.currentConfig.duration);
      }
    },
    removeToast(id: string){
      this.activeToasts = this.activeToasts.filter((t: NotificationConfig) => t.id !== id);
    },
    savePreset(name: string){
      const p: Preset = {
        id: Date.now().toString(),
        name,
        config: {...this.currentConfig},
        createdAt: new Date().toISOString()
      };

      this.presets.push(p);
      localStorage.setItem('toast-presets', JSON.stringify(this.presets));
    },
    deletePreset(id: string){
      this.presets = this.presets.filter((p: Preset) => p.id !== id);
      localStorage.setItem('toast-presets', JSON.stringify(this.presets));
    },
    applyPreset(config: Omit<NotificationConfig, 'id'>){
      this.currentConfig = {...this.currentConfig, ...config};
    }
  }
});