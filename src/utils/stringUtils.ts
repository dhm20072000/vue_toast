import type { NotificationConfig } from "../types";

export const getPosLabel = (pos: string) : string => {
  if(!pos) return '';
  return pos.split('-').map(word => word[0].toUpperCase()).join('');
};

export const formatConfigToCode = (config: Omit<NotificationConfig, 'id'>) : string => {
  return `const notify = ${JSON.stringify(config,(key, value) => {
    if(key.startsWith('$') || key.startsWith('_')){
      return undefined
    }
    return value;
  }, 2)}`;
};