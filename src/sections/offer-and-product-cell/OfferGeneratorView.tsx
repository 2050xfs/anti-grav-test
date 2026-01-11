import { useState } from 'react'
import data from '@/../product/sections/offer-and-product-cell/data.json'
import { OfferGenerator } from './components/OfferGenerator'
import type { OfferGeneratorInput, Offer } from '@/../product/sections/offer-and-product-cell/types'

export default function OfferGeneratorViewPreview() {
  // Sample pain points for demo
  const painPoints = [
    {
      id: 'pain-001',
      title: 'Inconsistent Lead Flow',
      description: 'Struggling with unpredictable lead generation that makes revenue forecasting nearly impossible',
    },
    {
      id: 'pain-002',
      title: 'Low Cold Outreach Response Rates',
      description: 'Cold emails and LinkedIn messages getting ignored, resulting in wasted effort and poor ROI',
    },
    {
      id: 'pain-003',
      title: 'Poor Pipeline Visibility',
      description: 'Can\'t see where deals are getting stuck or why forecasts miss targets by 30%+',
    },
    {
      id: 'pain-004',
      title: 'Low Conversion Rates',
      description: 'Traffic and leads exist but conversion to customers remains frustratingly low',
    },
    {
      id: 'pain-005',
      title: 'Inaccurate Revenue Forecasting',
      description: 'Sales projections consistently miss by wide margins, making planning impossible',
    },
    {
      id: 'pain-007',
      title: 'Poor Lead Qualification',
      description: 'Sales team wastes time on unqualified leads while real opportunities slip through',
    },
  ]

  const [generatedVariants, setGeneratedVariants] = useState<Array<Partial<Offer>>>([])

  const handleGenerate = (input: OfferGeneratorInput) => {
    console.log('Generating offers with input:', input)

    // Simulate AI generation with sample variants based on the input
    const variants: Array<Partial<Offer>> = [
      {
        id: 'variant-001',
        title: input.offerType === 'lead-magnet'
          ? 'Pipeline Audit Checklist'
          : input.offerType === 'core-offer'
          ? 'Complete Pipeline System Implementation'
          : 'Advanced Analytics Add-On',
        type: input.offerType,
        valueStack: {
          coreOffer: {
            title: 'Core Offer Title',
            description: `Comprehensive solution designed to address the pain point with ${input.offerType === 'lead-magnet' ? 'free valuable content' : input.offerType === 'core-offer' ? 'complete implementation' : 'premium enhancements'}`,
            deliveryMechanism: input.deliveryPreference || 'digital',
          },
          bonuses: [
            {
              title: 'Strategic Bonus 1',
              description: 'High-value bonus that complements the core offer',
              perceivedValue: 297,
            },
            {
              title: 'Implementation Bonus 2',
              description: 'Practical tools and templates',
              perceivedValue: 197,
            },
            {
              title: 'Expert Bonus 3',
              description: 'Expert guidance and support',
              perceivedValue: 147,
            },
          ],
          guarantee: {
            type: 'outcome-based',
            terms: 'Achieve measurable results within 60 days or get a full refund',
            riskReversal: 'Keep all materials and deliverables regardless',
          },
          pricing: {
            price: input.priceRange.max,
            anchor: input.priceRange.max * 1.8,
            paymentTerms: input.offerType === 'lead-magnet' ? 'free' : 'one-time',
          },
        },
        valueScore: 8.7,
      },
      {
        id: 'variant-002',
        title: input.offerType === 'lead-magnet'
          ? 'Quick Win Workshop'
          : input.offerType === 'core-offer'
          ? 'Done-For-You Pipeline Setup'
          : 'Premium Support Package',
        type: input.offerType,
        valueStack: {
          coreOffer: {
            title: 'Alternative Approach',
            description: `Different angle targeting the same pain point with ${input.offerType === 'lead-magnet' ? 'interactive learning' : input.offerType === 'core-offer' ? 'hands-off delivery' : 'ongoing support'}`,
            deliveryMechanism: input.deliveryPreference || 'hybrid',
          },
          bonuses: [
            {
              title: 'Quick Start Bonus',
              description: 'Get up and running fast with proven frameworks',
              perceivedValue: 397,
            },
            {
              title: 'Advanced Techniques',
              description: 'Pro-level strategies for maximum impact',
              perceivedValue: 247,
            },
          ],
          guarantee: {
            type: 'satisfaction',
            terms: 'Love it or get your money back within 90 days',
            riskReversal: 'Zero risk - we stand behind our work',
          },
          pricing: {
            price: Math.round(input.priceRange.max * 0.75),
            anchor: input.priceRange.max * 1.5,
            paymentTerms: input.offerType === 'expansion' ? 'monthly subscription' : 'one-time',
          },
        },
        valueScore: 9.1,
      },
      {
        id: 'variant-003',
        title: input.offerType === 'lead-magnet'
          ? 'Assessment & Roadmap'
          : input.offerType === 'core-offer'
          ? 'Guided Implementation Program'
          : 'VIP Optimization Package',
        type: input.offerType,
        valueStack: {
          coreOffer: {
            title: 'Premium Solution',
            description: `High-touch approach combining ${input.offerType === 'lead-magnet' ? 'personalized assessment' : input.offerType === 'core-offer' ? 'expert guidance with self-execution' : 'continuous optimization'}`,
            deliveryMechanism: 'human',
          },
          bonuses: [
            {
              title: 'VIP Bonus 1',
              description: 'Premium resources and priority support',
              perceivedValue: 497,
            },
            {
              title: 'Exclusive Bonus 2',
              description: 'Access to proprietary tools and frameworks',
              perceivedValue: 347,
            },
            {
              title: 'Ongoing Bonus 3',
              description: 'Continuous updates and improvements',
              perceivedValue: 297,
            },
            {
              title: 'Expert Bonus 4',
              description: 'Direct access to senior consultants',
              perceivedValue: 197,
            },
          ],
          guarantee: {
            type: 'performance',
            terms: 'Guaranteed improvement in key metrics or we work for free until you see results',
            riskReversal: 'Performance-based guarantee removes all risk',
          },
          pricing: {
            price: input.priceRange.max,
            anchor: input.priceRange.max * 2.2,
            paymentTerms: input.offerType === 'expansion' ? 'monthly' : 'split payment available',
          },
        },
        valueScore: 8.9,
      },
    ]

    setGeneratedVariants(variants)
  }

  const handleSelectVariant = (variant: Partial<Offer>) => {
    console.log('Selected variant:', variant)
    alert(`Selected: ${variant.title}\n\nThis would typically open the Offer Builder Canvas with this variant pre-loaded for further customization.`)
  }

  return (
    <OfferGenerator
      painPoints={painPoints}
      onGenerate={handleGenerate}
      onSelectVariant={handleSelectVariant}
      generatedVariants={generatedVariants}
    />
  )
}
