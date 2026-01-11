# Lifecycle & Compounding Engine Specification

## Overview
The Lifecycle & Compounding Engine treats every contact as a long-term asset, tracking their complete journey from first touch through multiple purchases, dormancy periods, and reactivations. It automatically identifies upsell opportunities, triggers win-back campaigns for churned customers, and maintains institutional memory that compounds value across all campaigns and touchpoints.

## User Flows
- View lifecycle dashboard showing contact distribution across stages (lead, active customer, at-risk, dormant, churned)
- Monitor customer health scores and identify at-risk accounts before they churn
- Review complete contact timeline showing all interactions, purchases, engagement patterns, and lifecycle transitions
- Trigger automated reactivation campaigns for dormant contacts based on inactivity thresholds
- Identify and act on upsell/cross-sell opportunities using AI-suggested next-best actions
- Track customer lifetime value (CLV) and engagement trends over time
- Create win-back sequences for churned customers with personalized messaging
- Review retention metrics and cohort analysis to understand long-term customer behavior
- Monitor compounding effects (contacts who return for multiple purchases, referrals generated, LTV growth)
- Set up automated lifecycle transitions based on behavior triggers (purchase, inactivity, engagement drop)

## UI Requirements
- Lifecycle stage funnel visualization showing contact counts at each stage with conversion rates
- Customer health score dashboard with color-coded risk indicators (healthy, at-risk, critical)
- Contact timeline view showing complete interaction history across all channels and campaigns
- Reactivation campaign manager with templates for different dormancy periods and customer segments
- Upsell opportunity cards showing AI-recommended next products/services with probability scores
- CLV tracker with cohort comparison and trend charts over time
- Win-back sequence builder with trigger conditions and multi-step workflows
- Retention metrics dashboard (churn rate, retention rate, cohort retention curves)
- Compounding value indicators (repeat purchase rate, referral generation, advocacy score)
- Automated transition rules manager for moving contacts between lifecycle stages
- At-risk contact list with prioritized action recommendations
- Customer journey map visualization showing common paths and drop-off points

## Configuration
- shell: true
