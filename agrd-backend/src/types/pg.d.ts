declare module 'pg' {
  export class Pool {
    constructor(config?: {
      connectionString?: string;
      host?: string;
      port?: number;
      database?: string;
      user?: string;
      password?: string;
      max?: number;
      idleTimeoutMillis?: number;
      connectionTimeoutMillis?: number;
    });
    connect(): Promise<PoolClient>;
    query(text: string, values?: unknown[]): Promise<QueryResult>;
    end(): Promise<void>;
  }

  export interface PoolClient {
    query(text: string, values?: unknown[]): Promise<QueryResult>;
    release(err?: Error): void;
  }

  export interface QueryResult {
    rows: unknown[];
    rowCount: number;
    command: string;
    fields: unknown[];
  }
}
