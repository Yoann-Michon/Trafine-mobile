import { Platform } from 'react-native';

type LogLevel = 'debug' | 'info' | 'success' | 'warning' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  prefix: string;
  message: string;
  data?: any;
}

const COLORS = {
  debug: '\x1b[90m',    // Gris
  info: '\x1b[36m',     // Cyan
  success: '\x1b[32m',  // Vert
  warning: '\x1b[33m',  // Jaune
  error: '\x1b[31m',    // Rouge
  reset: '\x1b[0m',     // Reset
};

const EMOJIS = {
  debug: '🔍',
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '❌',
};

const PREFIXES = {
  AUTH: '🔐',
  AUTH_PANEL: '👤',
  AUTH_SCREEN: '🖥️',
  NAVIGATION: '🧭',
  SEARCH: '🔍',
  MAP: '🗺️',
  API: '🌐',
  STORAGE: '💾',
  NETWORK: '📡',
  LOCATION: '📍',
  ROUTE: '🛣️',
} as const;

type LogPrefix = keyof typeof PREFIXES;

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly maxLogs: number = 1000;
  private readonly isDevelopment: boolean = __DEV__;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatLog(entry: LogEntry): string {
    const { timestamp, level, prefix, message } = entry;
    const color = COLORS[level];
    const emoji = EMOJIS[level];
    const prefixEmoji = PREFIXES[prefix as keyof typeof PREFIXES];

    return `${color}${timestamp} ${emoji} ${prefixEmoji} [${prefix}] ${message}${COLORS.reset}`;
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    if (this.isDevelopment) {
      const formattedLog = this.formatLog(entry);
      if (entry.data) {
        console.log(formattedLog, entry.data);
      } else {
        console.log(formattedLog);
      }
    }

    // En production, on pourrait envoyer les logs à un service externe
    if (!this.isDevelopment && entry.level === 'error') {
      this.sendToErrorTracking(entry);
    }
  }

  private sendToErrorTracking(entry: LogEntry) {
    // TODO: Implémenter l'envoi des erreurs à un service comme Sentry
    // if (Platform.OS === 'web') {
    //   Sentry.captureException(entry);
    // }
  }

  private createLogEntry(level: LogLevel, prefix: LogPrefix, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      prefix,
      message,
      data,
    };
  }

  debug(prefix: LogPrefix, message: string, data?: any) {
    this.addLog(this.createLogEntry('debug', prefix, message, data));
  }

  info(prefix: LogPrefix, message: string, data?: any) {
    this.addLog(this.createLogEntry('info', prefix, message, data));
  }

  success(prefix: LogPrefix, message: string, data?: any) {
    this.addLog(this.createLogEntry('success', prefix, message, data));
  }

  warning(prefix: LogPrefix, message: string, data?: any) {
    this.addLog(this.createLogEntry('warning', prefix, message, data));
  }

  error(prefix: LogPrefix, message: string, error?: any) {
    this.addLog(this.createLogEntry('error', prefix, message, error));
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = Logger.getInstance(); 