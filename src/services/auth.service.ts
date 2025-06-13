// Demo authentication service
// In production, replace with actual API calls

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'viewer';
  avatar?: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

// Demo users
const DEMO_USERS = [
  {
    email: 'demo@example.com',
    password: 'demo123',
    user: {
      id: '1',
      email: 'demo@example.com',
      name: '演示用户',
      role: 'admin' as const,
      avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=0D8ABC&color=fff',
    },
  },
  {
    email: 'admin@example.com',
    password: 'admin123',
    user: {
      id: '2',
      email: 'admin@example.com',
      name: '管理员',
      role: 'admin' as const,
      avatar: 'https://ui-avatars.com/api/?name=Admin&background=DC2626&color=fff',
    },
  },
];

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const demoUser = DEMO_USERS.find(u => u.email === email && u.password === password);

    if (!demoUser) {
      throw new Error('邮箱或密码错误');
    }

    // Generate demo token
    const token = btoa(JSON.stringify({ email, timestamp: Date.now() }));

    return {
      user: demoUser.user,
      token,
    };
  },

  async verify(token: string): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const decoded = JSON.parse(atob(token));
      const demoUser = DEMO_USERS.find(u => u.email === decoded.email);

      if (!demoUser) {
        throw new Error('Invalid token');
      }

      return demoUser.user;
    } catch {
      throw new Error('Invalid token');
    }
  },

  async logout(): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    // In real app, would invalidate token on server
  },
};