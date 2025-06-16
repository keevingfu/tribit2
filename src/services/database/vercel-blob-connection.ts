import Database from 'better-sqlite3';
import { get } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import os from 'os';

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private db: Database.Database;
  private dbPath: string;

  private constructor() {
    if (process.env.VERCEL) {
      // In Vercel, download the database from Blob storage
      this.initializeFromBlob();
    } else {
      // In development, use local file
      this.dbPath = path.join(process.cwd(), 'data', 'tribit.db');
      this.initializeLocal();
    }
  }

  private async initializeFromBlob() {
    try {
      // Download database from Vercel Blob
      const { downloadUrl } = await get(process.env.SQLITE_BLOB_URL!);
      
      // Create a temporary file
      const tempDir = os.tmpdir();
      this.dbPath = path.join(tempDir, 'tribit.db');
      
      // Download the database file
      const response = await fetch(downloadUrl);
      const buffer = await response.arrayBuffer();
      
      // Write to temporary file
      fs.writeFileSync(this.dbPath, Buffer.from(buffer));
      
      // Open the database
      this.db = new Database(this.dbPath, { 
        readonly: true,
        fileMustExist: true
      });
      
      console.log('Database loaded from Vercel Blob storage');
    } catch (error) {
      console.error('Failed to load database from Blob storage:', error);
      // Fall back to in-memory database
      this.initializeInMemory();
    }
  }

  private initializeLocal() {
    this.db = new Database(this.dbPath, { 
      readonly: true,
      fileMustExist: true,
      verbose: process.env.NODE_ENV === 'development' ? console.log : undefined
    });
    
    this.db.pragma('foreign_keys = ON');
    this.db.pragma('busy_timeout = 5000');
  }

  private initializeInMemory() {
    // Same as current implementation
    this.db = new Database(':memory:', { readonly: false });
    // ... initialize tables and data
  }

  // ... rest of the methods remain the same
}

export default DatabaseConnection;