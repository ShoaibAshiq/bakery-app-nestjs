export type LoggingType =
  | boolean
  | 'all'
  | ('query' | 'schema' | 'error' | 'warn' | 'info' | 'log' | 'migration')[];

export function parseDatabaseLogging(value: string): LoggingType {
  if (value === undefined) {
    return false;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  if (value === 'all') {
    return 'all';
  }

  const values = value.split(',');
  return values.map((v) => v.trim()) as LoggingType;
}
