import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../utils/prisma';
import { requireAuth, loadUser, requireWorkspaceAccess } from '../middleware/auth';

const router = Router();

/**
 * GET /api/offers
 * List offers for workspace with pagination and filtering
 */
router.get(
  '/',
  requireAuth,
  loadUser,
  requireWorkspaceAccess,
  async (req: Request, res: Response) => {
    try {
      const workspaceId = req.workspaceId!;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const type = req.query.type as string | undefined;
      const status = req.query.status as string | undefined;

      const skip = (page - 1) * limit;

      const where: {
        workspaceId: string;
        offerType?: 'LEAD_MAGNET' | 'CORE_PRODUCT' | 'UPSELL' | 'DOWNSELL';
        status?: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
      } = {
        workspaceId,
      };

      if (type) {
        where.offerType = type as 'LEAD_MAGNET' | 'CORE_PRODUCT' | 'UPSELL' | 'DOWNSELL';
      }

      if (status) {
        where.status = status as 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
      }

      const [offers, total] = await Promise.all([
        prisma.offer.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.offer.count({ where }),
      ]);

      res.json({
        offers,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Get offers error:', error);
      res.status(500).json({ error: 'Failed to retrieve offers' });
    }
  }
);

/**
 * POST /api/offers
 * Create a new offer
 */
router.post(
  '/',
  requireAuth,
  loadUser,
  requireWorkspaceAccess,
  async (req: Request, res: Response) => {
    try {
      const workspaceId = req.workspaceId!;
      const {
        name,
        offerType,
        description,
        valueStack,
        pricingTiers,
        guaranteeType,
        deliveryMechanism,
      } = req.body;

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        res.status(400).json({ error: 'Name is required' });
        return;
      }

      if (!offerType) {
        res.status(400).json({ error: 'Offer type is required' });
        return;
      }

      const validOfferTypes = ['LEAD_MAGNET', 'CORE_PRODUCT', 'UPSELL', 'DOWNSELL'];
      if (!validOfferTypes.includes(offerType)) {
        res.status(400).json({
          error: `Invalid offer type. Must be one of: ${validOfferTypes.join(', ')}`,
        });
        return;
      }

      const offer = await prisma.offer.create({
        data: {
          workspaceId,
          name: name.trim(),
          offerType,
          description: description || null,
          valueStack: valueStack || null,
          pricingTiers: pricingTiers || null,
          guaranteeType: guaranteeType || null,
          deliveryMechanism: deliveryMechanism || null,
        },
      });

      res.status(201).json(offer);
    } catch (error) {
      console.error('Create offer error:', error);
      res.status(500).json({ error: 'Failed to create offer' });
    }
  }
);

/**
 * GET /api/offers/:id
 * Get a single offer by ID
 */
router.get(
  '/:id',
  requireAuth,
  loadUser,
  requireWorkspaceAccess,
  async (req: Request, res: Response) => {
    try {
      const workspaceId = req.workspaceId!;
      const offerId = req.params.id as string;

      const offer = await prisma.offer.findFirst({
        where: {
          id: offerId,
          workspaceId,
        },
      });

      if (!offer) {
        res.status(404).json({ error: 'Offer not found' });
        return;
      }

      res.json(offer);
    } catch (error) {
      console.error('Get offer error:', error);
      res.status(500).json({ error: 'Failed to retrieve offer' });
    }
  }
);

/**
 * PATCH /api/offers/:id
 * Update an offer
 */
router.patch(
  '/:id',
  requireAuth,
  loadUser,
  requireWorkspaceAccess,
  async (req: Request, res: Response) => {
    try {
      const workspaceId = req.workspaceId!;
      const offerId = req.params.id as string;

      const existingOffer = await prisma.offer.findFirst({
        where: {
          id: offerId,
          workspaceId,
        },
      });

      if (!existingOffer) {
        res.status(404).json({ error: 'Offer not found' });
        return;
      }

      const {
        name,
        description,
        offerType,
        valueStack,
        pricingTiers,
        guaranteeType,
        deliveryMechanism,
        status,
      } = req.body;

      const updateData: Prisma.OfferUpdateInput = {};

      if (name !== undefined) {
        if (typeof name !== 'string' || name.trim().length === 0) {
          res.status(400).json({ error: 'Name must be a non-empty string' });
          return;
        }
        updateData.name = name.trim();
      }

      if (description !== undefined) {
        updateData.description = description || null;
      }

      if (offerType !== undefined) {
        const validOfferTypes = ['LEAD_MAGNET', 'CORE_PRODUCT', 'UPSELL', 'DOWNSELL'];
        if (!validOfferTypes.includes(offerType)) {
          res.status(400).json({
            error: `Invalid offer type. Must be one of: ${validOfferTypes.join(', ')}`,
          });
          return;
        }
        updateData.offerType = offerType;
      }

      if (status !== undefined) {
        const validStatuses = ['DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED'];
        if (!validStatuses.includes(status)) {
          res.status(400).json({
            error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
          });
          return;
        }
        updateData.status = status;
      }

      if (valueStack !== undefined) {
        updateData.valueStack = valueStack;
      }

      if (pricingTiers !== undefined) {
        updateData.pricingTiers = pricingTiers;
      }

      if (guaranteeType !== undefined) {
        updateData.guaranteeType = guaranteeType || null;
      }

      if (deliveryMechanism !== undefined) {
        updateData.deliveryMechanism = deliveryMechanism || null;
      }

      const updatedOffer = await prisma.offer.update({
        where: { id: offerId },
        data: updateData,
      });

      res.json(updatedOffer);
    } catch (error) {
      console.error('Update offer error:', error);
      res.status(500).json({ error: 'Failed to update offer' });
    }
  }
);

/**
 * DELETE /api/offers/:id
 * Delete an offer
 */
router.delete(
  '/:id',
  requireAuth,
  loadUser,
  requireWorkspaceAccess,
  async (req: Request, res: Response) => {
    try {
      const workspaceId = req.workspaceId!;
      const offerId = req.params.id as string;

      const existingOffer = await prisma.offer.findFirst({
        where: {
          id: offerId,
          workspaceId,
        },
      });

      if (!existingOffer) {
        res.status(404).json({ error: 'Offer not found' });
        return;
      }

      await prisma.offer.delete({
        where: { id: offerId },
      });

      res.status(204).send();
    } catch (error) {
      console.error('Delete offer error:', error);
      res.status(500).json({ error: 'Failed to delete offer' });
    }
  }
);

export default router;
