import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  workspaceName?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export class AuthService {
  /**
   * Register a new user and create their workspace
   */
  static async register(input: RegisterInput) {
    const { email, password, name, workspaceName } = input;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user with workspace
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        workspaces: {
          create: {
            role: 'owner',
            workspace: {
              create: {
                name: workspaceName || `${name}'s Workspace`,
                // Initialize the 4 Core Four channels for the workspace
                channels: {
                  create: [
                    {
                      channelType: 'WARM_OUTREACH',
                      name: 'Warm Outreach',
                      allocatedBudget: 0,
                    },
                    {
                      channelType: 'COLD_OUTREACH',
                      name: 'Cold Outreach',
                      allocatedBudget: 0,
                    },
                    {
                      channelType: 'CONTENT',
                      name: 'Content',
                      allocatedBudget: 0,
                    },
                    {
                      channelType: 'PAID_ADS',
                      name: 'Paid Ads',
                      allocatedBudget: 0,
                    },
                  ],
                },
              },
            },
          },
        },
      },
      include: {
        workspaces: {
          include: {
            workspace: true,
          },
        },
      },
    });

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Login user
   */
  static async login(input: LoginInput) {
    const { email, password } = input;

    // Find user with workspaces
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        workspaces: {
          include: {
            workspace: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        workspaces: {
          include: {
            workspace: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
