import { MyService } from './MyService';
import { MockDatabaseConnection } from '@/services/database/mocks/MockDatabaseConnection';
import { DatabaseConnection } from '@/services/database/connection';

// Mock the database connection
jest.mock('@/services/database/connection', () => ({
  DatabaseConnection: {
    getInstance: jest.fn(),
  },
}));

describe('MyService', () => {
  let service: MyService;
  let mockDb: MockDatabaseConnection;

  // Test fixtures
  const mockData = [
    {
      id: 1,
      name: 'Test Item 1',
      value: 100,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      name: 'Test Item 2',
      value: 200,
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    },
  ];

  beforeEach(() => {
    // Create mock database
    mockDb = new MockDatabaseConnection();
    
    // Set up mock data
    mockDb.setMockData('my_table', mockData);
    
    // Configure getInstance to return mock
    (DatabaseConnection.getInstance as jest.Mock).mockReturnValue(mockDb);
    
    // Create service instance
    service = new MyService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all items with default pagination', async () => {
      const result = await service.getAll();

      expect(result).toEqual({
        data: mockData,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      });
    });

    it('should handle pagination correctly', async () => {
      // Add more mock data for pagination test
      const manyItems = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        value: (i + 1) * 100,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }));
      mockDb.setMockData('my_table', manyItems);

      const result = await service.getAll({ page: 2, limit: 10 });

      expect(result.data).toHaveLength(10);
      expect(result.data[0].id).toBe(11);
      expect(result.pagination).toEqual({
        page: 2,
        limit: 10,
        total: 25,
        totalPages: 3,
      });
    });

    it('should handle empty results', async () => {
      mockDb.setMockData('my_table', []);

      const result = await service.getAll();

      expect(result).toEqual({
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      });
    });

    it('should handle database errors', async () => {
      mockDb.setShouldThrowError(true);

      await expect(service.getAll()).rejects.toThrow('Database error');
    });
  });

  describe('getById', () => {
    it('should return a single item by ID', async () => {
      const result = await service.getById(1);

      expect(result).toEqual(mockData[0]);
    });

    it('should return null for non-existent ID', async () => {
      const result = await service.getById(999);

      expect(result).toBeNull();
    });

    it('should validate ID parameter', async () => {
      await expect(service.getById(null as any)).rejects.toThrow('Invalid ID');
      await expect(service.getById('abc' as any)).rejects.toThrow('Invalid ID');
      await expect(service.getById(-1)).rejects.toThrow('Invalid ID');
    });
  });

  describe('search', () => {
    it('should search items by name', async () => {
      const result = await service.search({ query: 'Item 1' });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('Test Item 1');
    });

    it('should search with filters', async () => {
      const result = await service.search({
        query: 'Test',
        filters: {
          minValue: 150,
          maxValue: 250,
        },
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].value).toBe(200);
    });

    it('should handle case-insensitive search', async () => {
      const result = await service.search({ query: 'test item' });

      expect(result.data).toHaveLength(2);
    });

    it('should return empty results for no matches', async () => {
      const result = await service.search({ query: 'nonexistent' });

      expect(result.data).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create a new item', async () => {
      const newItem = {
        name: 'New Item',
        value: 300,
      };

      const result = await service.create(newItem);

      expect(result).toMatchObject({
        id: expect.any(Number),
        ...newItem,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });

      // Verify item was added to mock data
      const allItems = await service.getAll();
      expect(allItems.data).toHaveLength(3);
    });

    it('should validate required fields', async () => {
      await expect(service.create({ name: '' })).rejects.toThrow('Name is required');
      await expect(service.create({ value: -1 })).rejects.toThrow('Value must be positive');
    });

    it('should handle duplicate names', async () => {
      const duplicate = { name: 'Test Item 1', value: 999 };

      await expect(service.create(duplicate)).rejects.toThrow('Item with this name already exists');
    });
  });

  describe('update', () => {
    it('should update an existing item', async () => {
      const updates = { name: 'Updated Name', value: 150 };

      const result = await service.update(1, updates);

      expect(result).toMatchObject({
        id: 1,
        ...updates,
        updated_at: expect.any(String),
      });
    });

    it('should handle partial updates', async () => {
      const result = await service.update(1, { value: 150 });

      expect(result.name).toBe('Test Item 1'); // Unchanged
      expect(result.value).toBe(150); // Updated
    });

    it('should return null for non-existent ID', async () => {
      const result = await service.update(999, { name: 'Updated' });

      expect(result).toBeNull();
    });

    it('should validate update data', async () => {
      await expect(service.update(1, { value: -1 })).rejects.toThrow('Value must be positive');
    });
  });

  describe('delete', () => {
    it('should delete an existing item', async () => {
      const result = await service.delete(1);

      expect(result).toBe(true);

      // Verify item was removed
      const allItems = await service.getAll();
      expect(allItems.data).toHaveLength(1);
      expect(allItems.data[0].id).toBe(2);
    });

    it('should return false for non-existent ID', async () => {
      const result = await service.delete(999);

      expect(result).toBe(false);
    });

    it('should handle cascade deletes', async () => {
      // Assuming related data exists
      mockDb.setMockData('related_table', [
        { id: 1, item_id: 1, data: 'Related' },
      ]);

      const result = await service.delete(1, { cascade: true });

      expect(result).toBe(true);
      // Verify related data was also deleted
    });
  });

  describe('aggregate operations', () => {
    it('should calculate sum of values', async () => {
      const result = await service.getSum();

      expect(result).toBe(300); // 100 + 200
    });

    it('should calculate average value', async () => {
      const result = await service.getAverage();

      expect(result).toBe(150); // (100 + 200) / 2
    });

    it('should get count by category', async () => {
      // Add category to mock data
      const categorizedData = [
        { ...mockData[0], category: 'A' },
        { ...mockData[1], category: 'B' },
        { id: 3, name: 'Item 3', value: 300, category: 'A' },
      ];
      mockDb.setMockData('my_table', categorizedData);

      const result = await service.getCountByCategory();

      expect(result).toEqual({
        A: 2,
        B: 1,
      });
    });
  });

  describe('transaction operations', () => {
    it('should handle transactions successfully', async () => {
      const items = [
        { name: 'Item A', value: 100 },
        { name: 'Item B', value: 200 },
      ];

      const result = await service.createBulk(items);

      expect(result).toHaveLength(2);
      expect(mockDb.inTransaction).toBe(false); // Transaction completed
    });

    it('should rollback transaction on error', async () => {
      const items = [
        { name: 'Item A', value: 100 },
        { name: '', value: 200 }, // Invalid item
      ];

      await expect(service.createBulk(items)).rejects.toThrow();
      
      // Verify no items were created
      const allItems = await service.getAll();
      expect(allItems.data).toHaveLength(2); // Original data unchanged
    });
  });

  describe('performance and caching', () => {
    it('should cache frequently accessed data', async () => {
      // First call - hits database
      const result1 = await service.getById(1);
      expect(mockDb.queryCount).toBe(1);

      // Second call - should use cache
      const result2 = await service.getById(1);
      expect(mockDb.queryCount).toBe(1); // No additional query
      expect(result2).toEqual(result1);
    });

    it('should invalidate cache on updates', async () => {
      // Populate cache
      await service.getById(1);

      // Update item
      await service.update(1, { value: 999 });

      // Next get should fetch fresh data
      const result = await service.getById(1);
      expect(result.value).toBe(999);
    });
  });

  describe('complex queries', () => {
    it('should handle joins correctly', async () => {
      // Set up related data
      mockDb.setMockData('users', [
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' },
      ]);
      mockDb.setMockData('my_table', [
        { ...mockData[0], user_id: 1 },
        { ...mockData[1], user_id: 2 },
      ]);

      const result = await service.getWithUser(1);

      expect(result).toMatchObject({
        id: 1,
        name: 'Test Item 1',
        user: { id: 1, name: 'User 1' },
      });
    });

    it('should handle complex filtering', async () => {
      const result = await service.getFiltered({
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31',
        categories: ['A', 'B'],
        minValue: 50,
        sortBy: 'value',
        sortOrder: 'desc',
      });

      expect(result.data).toBeSorted((a, b) => b.value - a.value);
    });
  });
});