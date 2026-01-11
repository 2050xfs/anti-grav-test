# Conversation & Sales Engine Specification

## Overview
The Conversation & Sales Engine is a unified inbox that captures inbound interactions across all channels (email, chat, social DMs, forms, calls), automatically scores leads using PMAU (Pain, Money, Authority, Urgency) framework, and intelligently routes high-value opportunities to human sales reps while sending others to automated nurture sequences.

## User Flows
- View unified inbox of all inbound conversations across channels with real-time updates
- Click conversation to see full message history, lead profile, PMAU breakdown, and qualification status
- Review AI-generated PMAU scores (Pain 1-10, Money 1-10, Authority 1-10, Urgency 1-10) with reasoning
- Manually adjust PMAU scores or qualification status if AI assessment is incorrect
- Route qualified leads to specific sales team members or keep in shared queue
- Send responses using templates, AI-suggested replies, or custom messages
- Set up automated nurture sequences for unqualified leads (triggered by PMAU thresholds)
- Filter conversations by channel, qualification status, PMAU score range, assignee, or date
- Review conversation analytics (response time, qualification rate, conversion by channel)

## UI Requirements
- Unified inbox list view showing conversation preview, channel icon, PMAU score badge, status, and timestamp
- Conversation detail view with message thread on left, lead profile and PMAU breakdown on right
- PMAU score visualization (4 metric cards or gauge showing Pain/Money/Authority/Urgency scores)
- Inline response composer with template selector, AI suggestion button, and send options
- Visual status badges (new, in progress, qualified, nurture, closed, won, lost)
- Quick action buttons (qualify, disqualify, route to human, send to nurture, mark as spam)
- Filter sidebar with channel selection, PMAU range sliders, status toggles, and assignee dropdown
- Conversation source indicator showing which channel/campaign/form the lead came from
- Real-time notifications for new high-value conversations (PMAU score above threshold)
- Lead profile panel showing contact info, company data, past interactions, and engagement history

## Configuration
- shell: true
