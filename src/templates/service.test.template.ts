import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TemplateService } from './template.service';

// Mock the database
vi.mock('@/lib/db', () => ({
  db: {
    prepare: vi.fn()
  }
}));

describe('TemplateService', () => {
  let service: TemplateService;

  beforeEach(() => {
    service = new TemplateService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getPaginatedData', () => {
    it('should return paginated data with default parameters', async () => {
      // Arrange
      const mockData = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ];
      const mockCount = { total: 50 };

      vi.mocked(service.db.prepare).mockImplementation((sql: string) => ({
        get: vi.fn().mockReturnValue(mockCount),
        all: vi.fn().mockReturnValue(mockData),
        run: vi.fn()
      } as any));

      // Act
      const result = await service.getPaginatedData({});

      // Assert
      expect(result).toEqual({
        data: mockData,
        pagination: {
          page: 1,
          limit: 20,
          total: 50,
          totalPages: 3
        }
      });
    });

    it('should handle search parameter correctly', async () => {
      // Arrange
      const searchTerm = 'test';
      const mockData: any[] = [];
      const mockCount = { total: 0 };

      vi.mocked(service.db.prepare).mockImplementation((sql: string) => ({
        get: vi.fn().mockReturnValue(mockCount),
        all: vi.fn().mockReturnValue(mockData),
        run: vi.fn()
      } as any));

      // Act
      const result = await service.getPaginatedData({ search: searchTerm });

      // Assert
      expect(result.data).toEqual([]);
      expect(result.pagination.total).toBe(0);
    });

    it('should handle errors gracefully', async () => {
      // Arrange
      vi.mocked(service.db.prepare).mockImplementation(() => {
        throw new Error('Database error');
      });

      // Act & Assert
      await expect(service.getPaginatedData({})).rejects.toThrow('Failed to fetch data');
    });
  });

  describe('getById', () => {
    it('should return item by id', async () => {
      // Arrange
      const mockItem = { id: 1, name: 'Item 1' };
      vi.mocked(service.db.prepare).mockReturnValue({
        get: vi.fn().mockReturnValue(mockItem)
      } as any);

      // Act
      const result = await service.getById(1);

      // Assert
      expect(result).toEqual(mockItem);
    });
  });

  describe('create', () => {
    it('should create new item', async () => {
      // Arrange
      const newItem = { name: 'New Item' };
      vi.mocked(service.db.prepare).mockReturnValue({
        run: vi.fn().mockReturnValue({ lastInsertRowid: 1 })
      } as any);

      // Act
      const result = await service.create(newItem);

      // Assert
      expect(result).toEqual({ id: 1, ...newItem });
    });
  });
});