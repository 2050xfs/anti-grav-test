import { Request, Response, NextFunction } from 'express';

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
