import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

let db = null;

class Database {
  constructor() {
    this.initialized = false;
    this.init();
  }

  async init() {
    if (Platform.OS !== 'web') {
      try {
        db = await SQLite.openDatabaseAsync('notes.db');
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
        `);
        this.initialized = true;
      } catch (error) {
        console.error('Ошибка инициализации базы данных:', error);
      }
    } else {
      this.initialized = true;
    }
  }

  async ensureInitialized() {
    if (!this.initialized) {
      await this.init();
    }
  }

  async addNote(title, content) {
    await this.ensureInitialized();
    if (!db) {
      throw new Error('База данных недоступна');
    }
    try {
      const result = await db.runAsync('INSERT INTO notes (title, content) VALUES (?, ?)', [title, content]);
      return result.lastInsertRowId;
    } catch (error) {
      throw error;
    }
  }

  async getNotes() {
    await this.ensureInitialized();
    if (!db) {
      return [];
    }
    try {
      const result = await db.getAllAsync('SELECT * FROM notes ORDER BY updated_at DESC');
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getNote(id) {
    await this.ensureInitialized();
    if (!db) {
      throw new Error('База данных недоступна');
    }
    try {
      const result = await db.getFirstAsync('SELECT * FROM notes WHERE id = ?', [id]);
      if (result) {
        return result;
      } else {
        throw new Error('Заметка не найдена');
      }
    } catch (error) {
      throw error;
    }
  }

  async updateNote(id, title, content) {
    await this.ensureInitialized();
    if (!db) {
      throw new Error('База данных недоступна');
    }
    try {
      const result = await db.runAsync(
        'UPDATE notes SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [title, content, id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteNote(id) {
    await this.ensureInitialized();
    if (!db) {
      throw new Error('База данных недоступна');
    }
    try {
      const result = await db.runAsync('DELETE FROM notes WHERE id = ?', [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async searchNotes(searchTerm) {
    await this.ensureInitialized();
    if (!db) {
      return [];
    }
    try {
      const result = await db.getAllAsync(
        'SELECT * FROM notes WHERE title LIKE ? OR content LIKE ? ORDER BY updated_at DESC',
        [`%${searchTerm}%`, `%${searchTerm}%`]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export const database = new Database();
