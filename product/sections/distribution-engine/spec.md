# Distribution Engine Specification

## Overview
The Distribution Engine is a unified real-time dashboard that monitors and controls AGRD's autonomous campaign execution across the Core Four channels (Warm Outreach, Cold Outreach, Content, Paid Ads) and Four Lead Getters (Customer Referrals, Employees, Agencies, Affiliates). Users can monitor live performance metrics, launch new campaigns, override autonomous decisions, and review AI reasoning behind optimizations.

## User Flows
- Monitor real-time performance across all channels with live-updating metrics (LTGP:CAC, spend, leads)
- Launch new campaign via quick launch modal (select channels, set budget, define targeting)
- Drill into individual channel to view performance chart, active campaigns list, AI decision log, and manual controls
- Pause or adjust autonomous decisions (override budget allocation, pause underperforming channels)
- Review AI decision log to understand reasoning behind autonomous optimizations and reallocation
- Access Four Lead Getters section (referrals, employees, agencies, affiliates) as secondary monitoring area

## UI Requirements
- Unified dashboard showing all Core Four channels at-a-glance with key metrics (LTGP:CAC ratio, spend, leads, status)
- Live-updating metrics via WebSocket or polling - continuous refresh without user action
- Quick launch modal for new campaigns with channel selection, budget input, and targeting options
- Channel detail view includes: time-series performance chart, active campaigns table, AI decision log with reasoning, manual control toggles (pause/resume, budget adjustment)
- Secondary section for Four Lead Getters (Customer Referrals, Employees, Agencies, Affiliates) with less visual prominence
- Visual status indicators for each channel (active, paused, optimizing, constrained, error states)
- Budget allocation visualization showing spend distribution across all channels
- Click channel card to drill into detail view with full performance breakdown

## Configuration
- shell: true
