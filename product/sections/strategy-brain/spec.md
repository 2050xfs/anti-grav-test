# Strategy Brain Specification

## Overview
Strategy Brain is AGRD's decision-making control room where users monitor autonomous strategic decisions across budget allocation, channel performance, offer evolution, and constraint detection. The interface provides a workflow-style view showing decisions flowing from detection through analysis to execution, with explicit training/autonomy mode controls that allow users to teach the brain their decision-making style before granting full autonomy.

## User Flows
- **Training Mode Operation** - User switches brain to Training mode, reviews each proposed decision card as it moves through the pipeline (Signal Detected → Analyzing → Proposed), clicks to see AI thinking + metrics in right panel, approves/rejects/modifies with controls, brain learns from each approval pattern
- **Autonomy Mode Monitoring** - User switches brain to Autonomous mode, watches decision cards flow automatically through pipeline to Executing stage, receives notifications only for escalations (LTGP:CAC <2:1, spend >$10K/day, new channel proposals), reviews audit trail in bottom section
- **Decision Investigation** - User clicks any decision card (past or current) to open right panel detail view, reviews AI thinking process, sees source metrics/customer feedback that triggered decision, examines historical context of similar decisions and outcomes, optionally overrides even in Autonomous mode
- **Executor Status Monitoring** - User glances at top status band to see Strategy Brain's current mode (Training/Supervised/Autonomous), active task count, and overall health indicator, clicks brain avatar to see detailed activity log and switch modes
- **Constraint Response Review** - Brain detects audience exhaustion in LinkedIn channel, creates decision card in "Analyzing" stage, applies More-Better-New framework, proposes specific action (pause, optimize creative, or expand targeting), user reviews recommendation and approves or redirects

## UI Requirements
- **Horizontal Swimlane Pipeline** with 4 stages: "Signal Detected" → "Analyzing" → "Proposed" → "Approved/Executing", decision cards flow left-to-right through stages
- **Decision Cards** in each stage showing: decision type icon, brief description, timestamp, status indicator, plus action buttons (approve/reject checkmarks in Training mode, view details magnifying glass in all modes)
- **Top Executor Status Band** displaying Strategy Brain avatar with mode indicator (Training/Supervised/Autonomous badge), current active decision count, health status color (green/yellow/red), click to open mode settings and activity log
- **Right Panel Detail View** (slides in when decision clicked) containing: AI thinking process in expandable section, source data/metrics that triggered decision, approve/reject/modify controls with override input, historical context section showing similar past decisions
- **Bottom Metrics Section** with two panels: Decision Audit Trail table (decision type, timestamp, action taken, outcome) and Channel Performance donut chart (budget allocation percentages with LTGP:CAC color coding)
- **Mode Toggle Control** prominent in top-right (next to user menu) showing current mode with dropdown: Training (all decisions need approval), Supervised (acts with 5-min delay for intervention), Autonomous (only escalations)
- **Escalation Notifications** as red badge/banner when high-stakes decisions require review (>$10K spend, <2:1 LTGP:CAC, new channel launch, brand risk)
- **Plus Icons Between Stages** allowing user to manually create decision cards (e.g., "force brain to analyze specific constraint")

## Configuration
- shell: true
