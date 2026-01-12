import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

// Extend Express Request type to include user and workspace
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        workspaces: Array<{
          id: string;
          workspaceId: string;
          role: string;
          workspace: {
            id: string;
            name: string;
          };
        }>;
      };
      workspaceId?: string;
    }
  }
}

/**
 * Middleware to check if user is authenticated
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
};

/**
 * Middleware to load full user object from session
 * Must be used after requireAuth
 */
export const loadUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        workspaces: {
          select: {
            id: true,
            workspaceId: true,
            role: true,
            workspace: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Load user error:', error);
    return res.status(500).json({ error: 'Failed to load user' });
  }
};

/**
 * Middleware to extract workspace ID from request
 * Can come from header, query param, or body
 */
export const extractWorkspace = (req: Request, res: Response, next: NextFunction) => {
  const workspaceId =
    req.headers['x-workspace-id'] as string ||
    req.query.workspaceId as string ||
    req.body?.workspaceId;

  if (workspaceId) {
    req.workspaceId = workspaceId;
  }

  next();
};

/**
 * Middleware to check if user has access to workspace
 */
export const requireWorkspaceAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!req.workspaceId) {
    return res.status(400).json({ error: 'Workspace ID required' });
  }

  // Check if user has access to this workspace
  const hasAccess = req.user.workspaces.some(
    (uw) => uw.workspaceId === req.workspaceId
  );

  if (!hasAccess) {
    return res.status(403).json({ error: 'Access denied to this workspace' });
  }

  next();
};
