import { testApiHandler } from 'next-test-api-route-handler';
import * as handler from './route';
import { prisma } from '@/lib/prisma'; // or your database connection

// Mock external dependencies
jest.mock('@/lib/prisma', () => ({
  prisma: {
    modelName: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('/api/resource', () => {
  // Test fixtures
  const validRequestBody = {
    name: 'Test Resource',
    description: 'Test Description',
    value: 100,
  };

  const mockResource = {
    id: '1',
    name: 'Test Resource',
    description: 'Test Description',
    value: 100,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockResources = [
    mockResource,
    { ...mockResource, id: '2', name: 'Resource 2' },
    { ...mockResource, id: '3', name: 'Resource 3' },
  ];

  // Helper to set up authenticated request
  const authenticatedHeaders = {
    Authorization: 'Bearer valid-token',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/resource', () => {
    it('should return paginated resources', async () => {
      (prisma.modelName.findMany as jest.Mock).mockResolvedValue(mockResources);

      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'GET',
            headers: authenticatedHeaders,
          });
          const data = await res.json();

          expect(res.status).toBe(200);
          expect(data).toHaveProperty('data');
          expect(data).toHaveProperty('pagination');
          expect(data.data).toHaveLength(3);
          expect(data.pagination).toMatchObject({
            page: 1,
            limit: 10,
            total: 3,
          });
        },
      });
    });

    it('should filter resources by query parameters', async () => {
      (prisma.modelName.findMany as jest.Mock).mockResolvedValue([mockResource]);

      await testApiHandler({
        handler,
        url: '/api/resource?name=Test&value=100',
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'GET',
            headers: authenticatedHeaders,
          });
          const data = await res.json();

          expect(res.status).toBe(200);
          expect(data.data).toHaveLength(1);
          expect(prisma.modelName.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
              where: expect.objectContaining({
                name: expect.any(Object),
                value: 100,
              }),
            })
          );
        },
      });
    });

    it('should handle pagination parameters', async () => {
      await testApiHandler({
        handler,
        url: '/api/resource?page=2&limit=5',
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'GET',
            headers: authenticatedHeaders,
          });

          expect(res.status).toBe(200);
          expect(prisma.modelName.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
              skip: 5,
              take: 5,
            })
          );
        },
      });
    });

    it('should return empty array when no resources found', async () => {
      (prisma.modelName.findMany as jest.Mock).mockResolvedValue([]);

      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'GET',
            headers: authenticatedHeaders,
          });
          const data = await res.json();

          expect(res.status).toBe(200);
          expect(data.data).toEqual([]);
        },
      });
    });
  });

  describe('GET /api/resource/:id', () => {
    it('should return a single resource by ID', async () => {
      (prisma.modelName.findFirst as jest.Mock).mockResolvedValue(mockResource);

      await testApiHandler({
        handler,
        url: '/api/resource/1',
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'GET',
            headers: authenticatedHeaders,
          });
          const data = await res.json();

          expect(res.status).toBe(200);
          expect(data).toMatchObject(mockResource);
        },
      });
    });

    it('should return 404 when resource not found', async () => {
      (prisma.modelName.findFirst as jest.Mock).mockResolvedValue(null);

      await testApiHandler({
        handler,
        url: '/api/resource/999',
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'GET',
            headers: authenticatedHeaders,
          });
          const data = await res.json();

          expect(res.status).toBe(404);
          expect(data).toHaveProperty('error', 'Resource not found');
        },
      });
    });
  });

  describe('POST /api/resource', () => {
    it('should create a new resource with valid data', async () => {
      (prisma.modelName.create as jest.Mock).mockResolvedValue(mockResource);

      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: {
              ...authenticatedHeaders,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(validRequestBody),
          });
          const data = await res.json();

          expect(res.status).toBe(201);
          expect(data).toMatchObject(mockResource);
          expect(prisma.modelName.create).toHaveBeenCalledWith({
            data: validRequestBody,
          });
        },
      });
    });

    it('should validate required fields', async () => {
      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: {
              ...authenticatedHeaders,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: 'Missing fields' }),
          });
          const data = await res.json();

          expect(res.status).toBe(400);
          expect(data).toHaveProperty('error');
          expect(data.error).toContain('validation');
        },
      });
    });

    it('should handle duplicate resource creation', async () => {
      const duplicateError = new Error('Unique constraint violation');
      (prisma.modelName.create as jest.Mock).mockRejectedValue(duplicateError);

      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: {
              ...authenticatedHeaders,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(validRequestBody),
          });
          const data = await res.json();

          expect(res.status).toBe(409);
          expect(data).toHaveProperty('error', 'Resource already exists');
        },
      });
    });
  });

  describe('PUT /api/resource/:id', () => {
    it('should update an existing resource', async () => {
      const updatedResource = { ...mockResource, name: 'Updated Name' };
      (prisma.modelName.update as jest.Mock).mockResolvedValue(updatedResource);

      await testApiHandler({
        handler,
        url: '/api/resource/1',
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'PUT',
            headers: {
              ...authenticatedHeaders,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: 'Updated Name' }),
          });
          const data = await res.json();

          expect(res.status).toBe(200);
          expect(data.name).toBe('Updated Name');
          expect(prisma.modelName.update).toHaveBeenCalledWith({
            where: { id: '1' },
            data: { name: 'Updated Name' },
          });
        },
      });
    });

    it('should return 404 when updating non-existent resource', async () => {
      (prisma.modelName.update as jest.Mock).mockRejectedValue(
        new Error('Record not found')
      );

      await testApiHandler({
        handler,
        url: '/api/resource/999',
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'PUT',
            headers: {
              ...authenticatedHeaders,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: 'Updated Name' }),
          });

          expect(res.status).toBe(404);
        },
      });
    });
  });

  describe('DELETE /api/resource/:id', () => {
    it('should delete an existing resource', async () => {
      (prisma.modelName.delete as jest.Mock).mockResolvedValue(mockResource);

      await testApiHandler({
        handler,
        url: '/api/resource/1',
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'DELETE',
            headers: authenticatedHeaders,
          });

          expect(res.status).toBe(204);
          expect(prisma.modelName.delete).toHaveBeenCalledWith({
            where: { id: '1' },
          });
        },
      });
    });

    it('should return 404 when deleting non-existent resource', async () => {
      (prisma.modelName.delete as jest.Mock).mockRejectedValue(
        new Error('Record not found')
      );

      await testApiHandler({
        handler,
        url: '/api/resource/999',
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'DELETE',
            headers: authenticatedHeaders,
          });

          expect(res.status).toBe(404);
        },
      });
    });
  });

  describe('Authentication and Authorization', () => {
    it('should require authentication for all endpoints', async () => {
      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          
          expect(res.status).toBe(401);
          expect(await res.json()).toHaveProperty('error', 'Unauthorized');
        },
      });
    });

    it('should validate JWT token', async () => {
      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'GET',
            headers: {
              Authorization: 'Bearer invalid-token',
            },
          });

          expect(res.status).toBe(401);
        },
      });
    });

    it('should check user permissions for write operations', async () => {
      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: {
              Authorization: 'Bearer read-only-token',
            },
            body: JSON.stringify(validRequestBody),
          });

          expect(res.status).toBe(403);
          expect(await res.json()).toHaveProperty('error', 'Insufficient permissions');
        },
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors', async () => {
      (prisma.modelName.findMany as jest.Mock).mockRejectedValue(
        new Error('Database connection failed')
      );

      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'GET',
            headers: authenticatedHeaders,
          });
          const data = await res.json();

          expect(res.status).toBe(500);
          expect(data).toHaveProperty('error', 'Internal server error');
        },
      });
    });

    it('should handle invalid JSON in request body', async () => {
      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: {
              ...authenticatedHeaders,
              'Content-Type': 'application/json',
            },
            body: 'invalid json',
          });

          expect(res.status).toBe(400);
        },
      });
    });

    it('should handle method not allowed', async () => {
      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'PATCH',
            headers: authenticatedHeaders,
          });

          expect(res.status).toBe(405);
          expect(res.headers.get('Allow')).toContain('GET');
        },
      });
    });
  });

  describe('Performance and Rate Limiting', () => {
    it('should handle rate limiting', async () => {
      // Simulate multiple rapid requests
      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          // Make multiple requests
          const requests = Array(10).fill(null).map(() =>
            fetch({
              method: 'GET',
              headers: authenticatedHeaders,
            })
          );

          const responses = await Promise.all(requests);
          const lastResponse = responses[responses.length - 1];

          expect(lastResponse.status).toBe(429);
          expect(lastResponse.headers.get('X-RateLimit-Remaining')).toBe('0');
        },
      });
    });

    it('should include performance headers', async () => {
      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'GET',
            headers: authenticatedHeaders,
          });

          expect(res.headers.get('X-Response-Time')).toBeDefined();
          expect(res.headers.get('Cache-Control')).toBeDefined();
        },
      });
    });
  });
});