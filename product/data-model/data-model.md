# Data Model

## Entities

### Contact
A person in the system who can be a lead, customer, or affiliate. Tracks lifecycle stage (Lead, New Customer, Active, Dormant, Churned), relationship history, qualification scores, and engagement patterns. The core asset that AGRD nurtures over time.

### Campaign
A marketing initiative generated and executed through one of the Core Four channels. Contains strategic decisions, target audience, generated assets, and performance tracking. Campaigns learn from institutional memory and compound effectiveness over time.

### Offer
A lead magnet or core product with structured value proposition. Includes value stack (bonuses, workbook, OTO), pricing tiers, guarantee type, and delivery mechanism. Generated using Hormozi's Value Equation framework by the Offer & Product Cell.

### Asset
Generated content such as emails, ads, landing pages, social posts, or outreach sequences. Tracks performance metrics, variant testing results, and lifecycle status (pending, generating, completed, error). Assets are versioned to identify winning patterns.

### Decision
A strategic choice made autonomously by the Strategy Brain. Includes the decision type (budget allocation, channel scaling, offer testing), reasoning, context data, expected outcome, and actual result. Creates an audit trail for governance.

### Channel
One of the Core Four methods: Warm Outreach, Cold Outreach, Content, or Paid Ads. Tracks allocated budget, performance metrics (LTGP:CAC ratio), constraint detection status, and aggregate campaign results. Channels operate in parallel.

### Conversation
An interaction between AGRD and a Contact. Captures the conversation history, qualification score (Problem, Money, Authority, Urgency), routing decision (human escalation vs automated nurture), and objection handling outcomes.

### Insight
A learned pattern from institutional memory. Represents objections with effective responses, winning messages, failed experiments, or channel performance patterns. Insights compound across campaigns and are applied to improve future decisions.

## Relationships

- Contact has many Conversations
- Contact has a lifecycle stage (Lead, New Customer, Active, Dormant, Churned)
- Campaign belongs to a Channel
- Campaign uses an Offer
- Campaign has many Assets
- Campaign targets many Contacts
- Asset belongs to a Campaign
- Asset has performance metrics tracked over time
- Decision affects Channels (budget reallocation)
- Decision affects Campaigns (pause, scale, or optimize)
- Decision creates Offers (offer engineering)
- Conversation belongs to a Contact
- Conversation generates qualification score (PMAU)
- Insight is learned from Campaign performance
- Insight is learned from Conversation outcomes
- Channel has many Campaigns and tracks aggregate performance
