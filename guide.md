# Teemly Guides

All Teemly Resource Center guides in one file, ready to add through the admin panel.

## Contents

1. Getting Started with Teemly: Administrator Onboarding Guide
2. The Teemly Product Guide
3. The Manager's Guide to Teemly Reports and Insights
4. Privacy and Monitoring Controls: Reference Guide
5. The Enterprise Rollout Guide to Teemly
6. Choosing the Right Teemly Plan
7. Teemly Security Review Pack
8. How to add a guide in the admin panel

Each guide has an **Admin fields** table (the values for the admin form) and a **Body** (everything between `BODY START` and `BODY END`).

---

## 1. Getting Started with Teemly: Administrator Onboarding Guide

### Admin fields

| Field | Value |
|---|---|
| Category | Guides |
| Title | Getting Started with Teemly: Administrator Onboarding Guide |
| URL slug | `getting-started-first-day` |
| Author | Teemly |
| Featured | No |
| Summary | The standard procedure for bringing your organisation onto Teemly: configure organisation defaults, establish team structure, provision users, deploy the desktop agent and verify every employee is connected, with clear roles and go-live acceptance criteria. |
| Tags | getting started, onboarding, implementation, administration, agent deployment |

**What you'll learn** (one per line):

```
The recommended configuration sequence, and why policy comes before provisioning
Prerequisites, roles and responsibilities for a successful onboarding
How to establish team structure and provision users with the correct access
How the Teemly agent is deployed, and how employees are informed
How to verify deployment and resolve connectivity issues
The acceptance criteria for a confirmed go-live
```

### Body

> ⬇ **BODY START**: copy from the line below

This guide sets out the standard procedure for bringing a new organisation onto Teemly, from initial configuration to a verified, fully connected workforce. Completing it gives you a production-ready environment with consistent policies, correct access boundaries and reliable data from the first working day.

| Document overview | |
|---|---|
| **Audience** | Client Administrators; IT and HR implementation leads |
| **Applies to** | All Teemly plans |
| **Prerequisites** | An active Teemly organisation and Client Administrator credentials |
| **Estimated effort** | Approximately one hour of configuration, plus agent installation time |
| **Outcome** | All in-scope employees provisioned, connected and reporting |

## 1. Introduction

### 1.1 Purpose

This guide defines the recommended sequence for configuring Teemly and onboarding your workforce. Following the sequence ensures that every employee inherits the correct policy at the point of provisioning, so no settings need to be corrected afterwards.

### 1.2 Scope

**In scope:** organisation defaults, team structure, user provisioning, agent deployment, deployment verification and go-live validation.

**Out of scope:** module-by-module feature reference (see *The Teemly Product Guide*), report interpretation (see *The Manager's Guide to Teemly Reports and Insights*) and privacy governance (see *Privacy and Monitoring Controls: Reference Guide*).

## 2. Prerequisites

| Requirement | Description | Owner |
|---|---|---|
| Administrator access | Client Administrator credentials for the Teemly web platform | Client Administrator |
| Organisational structure | A list of teams and the manager accountable for each | HR / Operations |
| Employee directory | A verified email address for every in-scope employee | HR |
| Employee communication | A notice explaining the purpose of Teemly, issued before invitations | HR / Leadership |
| Endpoint readiness | Windows or macOS devices with outbound HTTPS access | IT |

## 3. Roles and responsibilities

| Role | Responsibility |
|---|---|
| Client Administrator | Configures settings, provisions users and verifies deployment |
| HR / People team | Owns employee communication and the monitoring policy |
| IT team | Supports agent installation and resolves network or device issues |
| Client Managers | Confirm visibility of their assigned teams at go-live |
| Employees | Accept the invitation and install the Teemly agent |

## 4. Implementation overview

| Step | Location | Owner | Outcome |
|---|---|---|---|
| 1. Configure organisation defaults | Settings → Org Defaults | Client Administrator | A consistent baseline policy |
| 2. Establish team structure | Settings → Teams & Structure | Client Administrator | Access boundaries defined |
| 3. Provision users | Settings → People & Roles | Client Administrator | Invitations issued |
| 4. Deploy the agent | Invitation email | Employees, supported by IT | Agent installed on each device |
| 5. Verify deployment | Settings → People & Roles | Client Administrator | Every employee connected |
| 6. Validate go-live | Dashboard | Client Administrator | Live data confirmed |

> **Important:** complete steps 1 and 2 before provisioning any users. Organisation defaults apply at the point an employee is added.

## 5. Procedure 1: Configure organisation defaults

Organisation defaults are the baseline policy applied automatically to every new employee. Individual settings can override them later where a documented exception is needed.

1. Navigate to **Settings → Org Defaults**.
2. Review each parameter against your internal monitoring policy.
3. Select **Save All Defaults** to apply all three groups together.

| Group | Parameter | System default | Guidance |
|---|---|---|---|
| Screen capture | Capture enabled | On | Disable if screenshots are not required by policy |
| Screen capture | Privacy blur | Off | Available on Professional and above |
| Screen capture | Capture interval | Plan interval | 5 min Starter, 2 min Professional, 1 min Premium |
| Work hours | Expected check-in time | 09:00 AM | Basis for late-arrival detection |
| Work hours | Work hours per day | 8 | Basis for expected hours and overtime |
| Work hours | Productivity target | 75% | Organisation-wide target score |
| Idle detection | Idle alerts | On | |
| Idle detection | Idle threshold | 5 minutes | Configurable from 1 to 5 minutes |
| Idle detection | Working days | Monday–Friday | Align with your contracted working week |

**Recommended practice:** set the least intrusive defaults that still support your objectives. Further capabilities can be enabled later with a documented business justification.

## 6. Procedure 2: Establish team structure

Teams define reporting lines and access boundaries. Client Managers can view data only for the teams assigned to them.

1. Navigate to **Settings → Teams & Structure**.
2. Select **Create New Team**, enter the team name and confirm.
3. Repeat for each team in scope.

**Standards:**

- Structure teams around managerial accountability rather than cost centres.
- Adopt a consistent naming convention, for example *Region – Function – Team*.
- Ensure every team has at least one assigned manager before go-live.

## 7. Procedure 3: Provision users

1. Navigate to **Settings → People & Roles** and select **+ Add Employee**.
2. Enter the employee's business email address.
3. Assign the employee to a team.
4. Assign a role.
5. Assign a work type.
6. Select **Send invite**.

| Field | Options | Notes |
|---|---|---|
| Role | Admin, Manager, Employee | Grant Admin to named individuals only |
| Work type | Hybrid, Remote, Office | Used for reporting and location policy |
| Status | Pending, Active, Inactive | Pending until the invitation is accepted |

Use **Resend invite** for any employee who remains in **Pending** status.

## 8. Procedure 4: Deploy the desktop agent

The Teemly agent is a lightweight (under 2MB) application for Windows and macOS. It is code-signed for Windows, notarised for macOS and updates itself automatically.

**Pre-deployment requirement:** employees must be informed before invitations are sent. The notice should state the purpose of Teemly, the data it records, and the employee's right to pause tracking at any time with Privacy Mode.

**Technical notes:**

- The installer displays a privacy notice. Tracking begins only after it is shown.
- The agent runs in the background with a visible system-tray icon.
- Activity recorded while a device is offline syncs when connectivity is restored.

## 9. Procedure 5: Verify deployment

Navigate to **Settings → People & Roles** and review each employee record.

| Attribute | Indicates | Expected value |
|---|---|---|
| Status | Invitation and account state | Active |
| OS / EXE Version | Agent installed, and its version | Populated |
| Last Sync | Time since the agent last reported | Recent (minutes, not hours) |

Escalate unresolved connectivity issues to IT within one working day.

## 10. Procedure 6: Validate go-live

Open the **Dashboard** at the end of the first working day and confirm:

| Component | Validation |
|---|---|
| Summary cards | Check-in and absence counts reflect actual attendance |
| Live Activity | Employees show Work Mode, Privacy Mode or Offline as expected |
| Today's Activity | Login times and active hours are populated |
| Not Installed | No in-scope employee remains in this state |

## 11. Go-live acceptance criteria

| # | Criterion | Verification |
|---|---|---|
| 1 | Organisation defaults saved and aligned with policy | Settings → Org Defaults |
| 2 | All teams created, each with an assigned manager | Settings → Teams & Structure |
| 3 | All in-scope employees provisioned | Settings → People & Roles |
| 4 | All employees Active with a recent Last Sync | Settings → People & Roles |
| 5 | Managers can access their assigned teams | Manager sign-in confirmation |
| 6 | Employee communication issued, including Privacy Mode | HR confirmation |

## 12. Next steps

- Refine individual schedules under **Settings → Work Policy** where exceptions apply.
- Issue *The Manager's Guide to Teemly Reports and Insights* to all Client Managers.
- Publish *Privacy and Monitoring Controls: Reference Guide* to employees.

## Appendix: Definitions

| Term | Definition |
|---|---|
| Client Administrator | A user with organisation-wide access, including Settings |
| Client Manager | A user with access limited to their assigned teams |
| Org Defaults | Baseline settings applied to every new employee |
| Teemly agent | The desktop application that records activity on employee devices |
| Last Sync | The time since an employee's agent last sent data |
| Not Installed | An employee from whom no data has ever been received |

> ⬆ **BODY END**: copy up to the line above

---

## 2. The Teemly Product Guide

### Admin fields

| Field | Value |
|---|---|
| Category | Guides |
| Title | The Teemly Product Guide |
| URL slug | `teemly-product-guide` |
| Author | Teemly |
| Featured | Yes |
| Summary | Everything you need to set up and use Teemly: install the agent, invite your team, configure Settings, and get the most from the Dashboard, Teams, Screenshots, Video, Location, Attendance and Reports. Includes plan availability and troubleshooting. |
| Tags | getting started, setup, product guide, settings, reports, attendance, privacy |

**What you'll learn** (one per line):

```
How to set Org Defaults, create teams and invite employees in the right order
How employees install the Teemly agent, and how to confirm everyone is connected
What every Settings section does, from Work Policy to custom roles
How to read the Dashboard, Teams, Screenshots, Video, Location and Attendance modules
Which of the six reports answers which question, and which plan includes it
How to fix the most common setup problems
```

### Body

> ⬇ **BODY START**: copy from the line below

This guide walks you through Teemly from the first login to the first decision you make with its data. It is written for **Client Admins**, who set Teemly up and manage it, and **Client Managers**, who use it to run their teams. Follow chapters 1–3 to get set up, then use the rest as a reference for each module.

## 1. How Teemly works

Teemly has two parts:

- **The Teemly desktop agent:** a lightweight (under 2MB) application for Windows and macOS, built by Teemly. It runs on each employee's computer, records activity at the operating-system level, and sends signed, encrypted data to the platform. If the computer goes offline, the agent keeps recording and syncs when it reconnects.
- **The Teemly web platform:** where admins and managers see the data through eight modules: Dashboard, Teams, Screenshots, Video Recording, Location Tracking, Attendance, Reports and Settings.

### How activity is classified

Every app and website an employee uses is classified, and that classification feeds every score and report:

| Status | Meaning |
|---|---|
| Productive | Time in apps and websites that count as work |
| Neutral | Time that is neither clearly productive nor unproductive |
| Unproductive | Time in apps and websites that do not count as work |
| Idle | No keyboard or mouse activity for longer than the idle threshold |

### Who uses Teemly

| Role | Sees | Can do |
|---|---|---|
| Client Admin | The whole organisation: every team, every employee | Everything, including Settings, exports and downloads |
| Client Manager | Only the teams assigned to them | View their teams' data. Cannot change settings or export |
| Employee | Not a login role | Installs the agent, and can switch on Privacy Mode at any time |

Custom roles with per-module access are available from the Professional plan. See chapter 3.

## 2. Getting started

Most organisations are live in a day. Do the steps in this order: settings first means every employee you invite starts with the right configuration.

### Step 1: Set your Org Defaults

Go to **Settings → Org Defaults**. These settings are applied automatically to every new employee. You can override them for any individual later.

| Group | Setting | Default |
|---|---|---|
| Screen capture | Capture enabled | On |
| Screen capture | Privacy blur | Off |
| Screen capture | Interval | Your plan's interval (5 min Starter, 2 min Professional, 1 min Premium) |
| Work hours | Check-in time | 09:00 AM |
| Work hours | Work hours per day | 8 |
| Work hours | Target score | 75% |
| Idle detection | Alerts enabled | On |
| Idle detection | Idle threshold | 5 minutes (maximum 5) |
| Idle detection | Working days | Monday to Friday |

Click **Save All Defaults** to save all three groups at once.

### Step 2: Create your teams

1. Go to **Settings → Teams & Structure**.
2. Click **Create New Team**, enter a name and confirm.
3. Repeat for each team. You can rename a team inline at any time.

Build teams around the people each manager is responsible for. Managers only see their assigned teams, so team design also decides who sees whose data.

### Step 3: Invite your employees

1. Go to **Settings → People & Roles** and click **+ Add Employee**.
2. Enter the employee's email address.
3. Choose their team.
4. Choose their role: Admin, Manager or Employee.
5. Choose their work type: Hybrid, Remote or Office.
6. Click **Send invite**.

The employee receives an email with a download link for the Teemly agent and setup instructions. Until they accept, they appear on the **Pending** tab. Use **Resend invite** if the email was missed.

### Step 4: The employee installs the agent

1. The employee opens the download link from the invite email and runs the installer for Windows or macOS.
2. The installer shows a privacy notice explaining that monitoring is active. Tracking only starts after this.
3. The agent runs in the background with a visible system-tray icon. It updates itself automatically and checks its signature on every start.

The Windows agent is code-signed with an EV certificate and the macOS build is notarised, so neither operating system should block it.

### Step 5: Confirm everyone is connected

Back in **Settings → People & Roles**, each employee row shows:

- **OS** and **EXE Version:** confirms the agent is installed and up to date
- **Last Sync:** how long ago the agent last sent data, for example "2 min ago"
- **Status:** Active, Pending (invite not yet accepted) or Inactive

On the Dashboard, anyone who has never sent data shows as **Not Installed** in the Live Activity list. Follow these people up first.

### Your first-day checklist

- Org Defaults reviewed and saved
- Teams created, each with a manager
- All employees invited
- Every employee showing a recent Last Sync time
- Managers logged in and able to see their teams

## 3. Configuring Settings

Only Client Admins can open Settings. It has seven sections in three groups.

| Group | Section | What you do there |
|---|---|---|
| Organisation & People | Teams & Structure | Create, rename and delete teams |
| Organisation & People | People & Roles | Invite employees, assign teams, roles and work type, check agent status |
| Work & Monitoring | Work Policy | Working days, expected hours, check-in time and productivity target per employee |
| Work & Monitoring | Monitoring Controls | Screenshot capture, blur and interval, plus idle detection per employee |
| Work & Monitoring | Silent Tracking | Invisible monitoring, behind a legal-consent gate |
| Access & Controls | Org Defaults | Settings applied to every new employee |
| Access & Controls | Permissions & Access | Default and custom roles with per-module access |

### Work Policy

Select an employee in the left-hand list, then set their schedule on the right:

- **Working days:** tick individual days, or use the Mon–Fri, Mon–Sat or All 7 shortcuts
- **Productivity target:** a percentage, 75% by default
- **Expected hours per day:** 4 to 10 hours, 8 by default
- **Expected check-in time:** used to flag late arrivals

These settings affect the Dashboard, overtime detection and every report, so change them with care.

### Monitoring Controls

| Control | Options | Plan |
|---|---|---|
| Screenshot capture | On or Off | All plans |
| Privacy blur | Blur or No Blur | Professional and above |
| Capture interval | 1, 2, 5, 10, 15, 30 or 60 minutes | All plans |
| Idle alert | On or Off | All plans |
| Idle threshold | 1 to 5 minutes | All plans |

Save each employee's row with its own **Save** button. Changes reach the agent within an hour; the "Syncs in 1h" badge shows a change is on its way.

### Silent Tracking

Silent Tracking hides the agent from the employee. It is available from the Professional plan and stays locked until a Client Admin opens the legal-consent dialog, confirms that all required consents and notices are in place under local law, and clicks **Unlock Silent Tracking**. After that, it is switched on per employee. Only use it where your legal team has approved it.

### Permissions & Access

Admin and Manager are built-in roles and cannot be deleted. To create a custom role:

1. Click **Create a New Role** and enter a name.
2. Tick the modules the role can open: Dashboard, Teams, Screenshots, Attendance, Reports or Settings.
3. For each module, choose **Read Only** or **Full Access**.
4. Save. The role now appears when you assign roles in People & Roles.

Professional includes up to 5 custom roles; Premium and Enterprise are unlimited.

## 4. Dashboard

The Dashboard is the first screen after login. Admins see the whole organisation; managers see their assigned teams. Use the team and date-range filters at the top.

- **Summary cards:** Total Employees, Checked In, Absent and Average Productivity per day, each with a trend arrow against the previous period.
- **Org Productivity Score:** a 0–100 gauge for the selected period, with productive, idle and unproductive percentages.
- **Work Summary:** productive and unproductive hours per day. Hover over a bar for hourly detail.
- **Live screenshot feed:** the latest captures, blurred where blur is on.
- **Live Activity:** each employee's current status, updating without a refresh.
- **Top Productive / Unproductive:** rankings by employee, website or app.
- **Today's Activity:** login time, active hours against expected hours, and a live score per employee.

| Live status | Meaning |
|---|---|
| Work Mode | The agent is active and recording |
| Privacy Mode | The employee has paused tracking |
| Offline | No recent data from the agent |
| Not Installed | No data has ever been received |

## 5. Teams

Teams works at three levels:

1. **Team list:** every team as a card, ranked by productivity, with average work time and live working, privacy and offline counts.
2. **Team detail:** a Work Hours Calendar heat map of average productive hours per day, and a members table you can filter by working, privacy or offline.
3. **Employee profile:** a 24-hour activity timeline, app and website usage, attendance history and recent daily records for one person.

The colour bar on timelines reads: productive, neutral, unproductive, idle, and a white gap for away. The app-usage breakdown and screenshots tab on a profile need the Professional plan or above.

## 6. Screenshots

Screenshots are captured at the interval set in Monitoring Controls and tagged automatically as Productive, Neutral, Unproductive or Idle.

- **Filter the gallery** by date range, productivity tag or employee. Teams are listed in the sidebar.
- **Click a screenshot** to open it full screen. Use previous and next, or the filmstrip, to move through the day. The details panel shows the app, category, productivity tag and whether the employee was idle.
- **Download** the full-resolution image from the detail view (admins only).

When blur is on for an employee, the original screenshot is never stored; Teemly blurs it before saving. Every screenshot you open is recorded in the audit log.

## 7. Video Recording

Available from the Professional plan. The agent records the screen in 5, 10, 15 or 30-minute segments, organised per employee, per day and per session.

- Browse recordings in date order with thumbnail previews.
- Play them in the browser; there is nothing to download to watch one.
- Admins can download individual recordings.

Blur and audit logging work the same way as for screenshots. Retention is 7 days on Professional, 30 days on Premium and custom on Enterprise.

## 8. Location Tracking

Available from the Professional plan, for remote, hybrid and field teams.

- **Team map:** where each employee is now, plus a daily movement log.
- **Geofences:** define work zones such as the office, a client site or home, and get an alert when someone enters or leaves one.
- **Location-based attendance:** confirm presence when someone enters a geofence, with late arrivals flagged.

Privacy Mode pauses location along with everything else, and coordinates are never shared with other employees. Retention is 30 days on Professional, 90 days on Premium and custom on Enterprise.

## 9. Attendance

Nobody needs to clock in. Teemly works out attendance from the agent's activity:

| Term | How Teemly decides |
|---|---|
| Check-in | The first activity of the day |
| Check-out | The last activity of the day, or "Active" if the employee is still working |
| Present | Any activity on a working day |
| Absent | No activity on a working day |
| Late | Check-in after the expected check-in time and grace period |
| Not Installed | The employee exists in Teemly but no data has ever been received |

- **List view** (all plans) groups employees by team with check-in and check-out times, total and productive hours, and a 24-hour activity bar.
- **Gantt timeline view** (Professional and above) puts everyone on one time axis with a live "now" marker.

Working days and check-in times come from Work Policy, so set those correctly first.

## 10. Reports

Every report can be run for the whole organisation (admins only), a team or one employee, and ends with plain-language AI insight cards.

| Report | Shows you | Plan |
|---|---|---|
| Attendance & Punctuality | Attendance rate, late-arrival patterns and an individual log with streaks | All plans |
| Work Pulse | Peak productive hours, an hourly heat map and the top distractions | Professional and above |
| Tool Intelligence | Where time goes across apps and sites, and underused licences with their monthly cost | Professional and above |
| Burnout & Wellbeing | People at risk from overtime, after-hours and weekend work | Premium and above |
| Focus Score | Uninterrupted work streaks, context switches per hour and a 0–100 focus score | Premium and above |
| Team Leaderboard | Team rankings, a 4-week trend and coaching opportunities | Premium and above |

Treat insight cards as a starting point for a conversation, not a verdict, and look at trends over weeks rather than single days.

## 11. Privacy controls

Share this chapter with your employees.

- **Privacy Mode:** any employee can turn it on from the agent. All tracking pauses at once, including screenshots, video and location. Admins see "Privacy Mode" but cannot switch it off.
- **Privacy blur:** when on, original screenshots and recordings are never stored.
- **Logged access:** every screenshot, recording and location view is logged with who viewed it and when.
- **Never collected:** keystrokes or typed content, email content, camera or microphone, personal files, clipboard content, biometric data and private messages.

## 12. Exporting data

- Teams, Attendance, Location and the audit log export to CSV.
- Every report exports to CSV and Excel.
- Exports and downloads are for Client Admins only.
- API access for integrations is available on the Premium and Enterprise plans.

## 13. What each plan includes

|  | Starter | Professional | Premium | Enterprise |
|---|---|---|---|---|
| Employees | Up to 50 | Up to 200 | Up to 500 | Unlimited |
| Screenshots | Every 5 min, 30 days | Every 2 min, 90 days | Every 1 min, 180 days | Custom |
| Video Recording | No | 7 days | 30 days | Custom |
| Location Tracking | No | 30 days | 90 days | Custom |
| Blur, Silent Tracking, audit logs | No | Yes | Yes | Yes |
| Reports | Attendance & Punctuality | Adds Work Pulse, Tool Intelligence, AI insights | Adds Burnout & Wellbeing, Focus Score, Team Leaderboard | All |
| Custom roles | No | Up to 5 | Unlimited | Unlimited, module-level |
| Support | Email | 48-hour SLA | 24-hour SLA | 4-hour SLA, account manager |

See [Pricing](/pricing) for current prices.

## 14. Troubleshooting

| Problem | What to do |
|---|---|
| An employee shows as "Not Installed" | Check they accepted the invite (Pending tab) and ran the installer. Resend the invite if needed. |
| Last Sync is hours or days old | The computer may be off, or a firewall or proxy may be blocking the agent. Data recorded offline syncs once it reconnects. |
| A setting change hasn't taken effect | Changes reach the agent within an hour. Check the "Syncs in 1h" badge, and that you saved that employee's row. |
| Screenshots are blurred | Blur is on for that employee in Monitoring Controls. Blurred originals are never stored, so they cannot be recovered. |
| An employee shows Privacy Mode | They paused tracking themselves. Admins cannot override it. Talk to the employee if it is a concern. |
| A manager can't see a team | Check the manager is assigned to that team in People & Roles. |
| A team can't be deleted | Move all its members to another team first. |
| Video, Location or some reports are missing | They are not included in your plan. See chapter 13. |
| An account is locked | Accounts lock after 5 failed sign-in attempts. Reset the password with the emailed one-time code, which expires after 10 minutes. |

## Need help?

Visit [Support](/support) or [contact us](/contact). To see Teemly in action first, [take the product tour](/take-a-tour) or [book a demo](/book-a-demo).

> ⬆ **BODY END**: copy up to the line above

---

## 3. The Manager's Guide to Teemly Reports and Insights

### Admin fields

| Field | Value |
|---|---|
| Category | Guides |
| Title | The Manager's Guide to Teemly Reports and Insights |
| URL slug | `managers-guide-to-reports` |
| Author | Teemly |
| Featured | No |
| Summary | How Client Managers interpret Teemly's Dashboard and six intelligence reports and turn them into sound, evidence-based decisions. Covers access scope, the report catalogue, an insight-to-action framework, an operating cadence and responsible-use standards. |
| Tags | managers, reports, workforce intelligence, insights, team management, wellbeing |

**What you'll learn** (one per line):

```
The access scope and limits of the Client Manager role
The business question each of the six reports answers
How to interpret productivity, focus, attendance and wellbeing indicators
A five-stage framework for turning insights into measurable action
A recommended daily, weekly, monthly and quarterly operating cadence
The responsible-use standards expected of every manager
```

### Body

> ⬇ **BODY START**: copy from the line below

This guide equips Client Managers to interpret Teemly's workforce intelligence and turn it into sound, evidence-based management decisions. It defines your access scope, explains each report, and sets out an operating cadence and the standards for using workforce data responsibly.

| Document overview | |
|---|---|
| **Audience** | Client Managers, team leads and department heads |
| **Applies to** | All plans; individual reports vary by plan (see section 5) |
| **Prerequisites** | Client Manager access with at least one assigned team |
| **Outcome** | Consistent, fair and decision-oriented use of Teemly reporting |

## 1. Introduction

### 1.1 Purpose

Teemly shows how work actually happens: when teams are most productive, where time is spent, and where workload is becoming unsustainable. The value of that visibility depends on how managers interpret and act on it. This guide sets out the method for doing so.

### 1.2 Guiding principles

- **Decisions over surveillance:** every review should lead to an improvement in how work is organised.
- **Patterns over moments:** conclusions are drawn from sustained trends, never from isolated data points.
- **Systems before individuals:** team-wide patterns are treated first as process, tooling or workload issues.
- **Transparency and fairness:** employees are given the opportunity to provide context before any conclusion is reached.

## 2. Access scope for Client Managers

Client Manager access is limited to assigned teams and is read-only.

| Permitted | Not permitted |
|---|---|
| View the Dashboard for assigned teams | Access teams outside your assignment |
| View profiles of assigned team members | Modify any settings or policies |
| Run reports for assigned teams and members | Run organisation-wide reports |
| View screenshots and recordings for assigned teams | Export data or download recordings |

Requests for additional access or exports should go to your Client Administrator.

## 3. How insights are produced

**Data boundaries:** Teemly does not record keystrokes, typed content, email content, messages, or camera and microphone data. All reporting comes from activity patterns, not from the content of employees' work.

## 4. The Dashboard: daily operational view

| Component | What it shows | Use it to |
|---|---|---|
| Summary cards | Check-ins, absences and average productivity, with trends | Confirm team availability |
| Org Productivity Score | A 0–100 score for the selected period | Track the overall direction |
| Work Summary | Productive and unproductive hours per day | Identify unusual days |
| Live Activity | Work Mode, Privacy Mode, Offline or Not Installed | Understand current availability |
| Top Productive / Unproductive | Apps, websites and people at each end of the range | Spot tooling or focus issues |

For deeper analysis, use **Teams**. The Work Hours Calendar shows productive hours per day as a heat map, and the employee profile provides a 24-hour activity timeline.

## 5. Report catalogue

Each report can be run for an assigned team or an individual, and concludes with AI-generated insight cards.

| Report | Business question | Plan |
|---|---|---|
| Attendance & Punctuality | Is attendance reliable, and where are the patterns? | All plans |
| Work Pulse | When is the team most productive, and what disrupts it? | Professional and above |
| Tool Intelligence | Where is time spent, and which licences are underused? | Professional and above |
| Burnout & Wellbeing | Who is at risk from sustained overwork? | Premium and above |
| Focus Score | Does the team have adequate uninterrupted time? | Premium and above |
| Team Leaderboard | How do teams compare and trend over time? | Premium and above |

### 5.1 Attendance & Punctuality

**Measures:** daily attendance rate, distribution of late arrivals, and individual attendance records with streaks. Attendance comes from activity: check-in is the first activity of the day, check-out the last.

**Review for:** recurring patterns, such as consistent lateness on particular days, that may indicate a scheduling or process constraint.

### 5.2 Work Pulse

**Measures:** peak productive hours, an hourly heat map and the principal sources of distraction.

**Review for:** the team's highest-output periods, which should be protected from meetings and interruptions.

### 5.3 Tool Intelligence

**Measures:** time spent across applications and websites, and software licences that are rarely used, with their monthly cost.

**Review for:** opportunities to reclaim or reassign licences, and tools that consume a disproportionate share of time.

### 5.4 Burnout & Wellbeing

**Measures:** overtime, after-hours activity and weekend work at individual and team level.

**Review for:** individuals flagged repeatedly. Treat this as a workload-allocation issue that needs prompt action.

### 5.5 Focus Score

**Measures:** uninterrupted work streaks, context switches per hour and a 0–100 focus score.

**Review for:** low scores across a whole team, which typically indicate excessive meetings or interruptions.

### 5.6 Team Leaderboard

**Measures:** team rankings by productivity score, a four-week trend and coaching opportunities.

**Review for:** practices in high-performing teams that can be shared across the organisation.

## 6. Insight-to-action framework

Apply this framework whenever a report or insight card highlights an issue.

| Stage | Action | Output |
|---|---|---|
| Identify | Confirm the signal persists for at least two weeks | A validated observation |
| Diagnose | Determine whether it is team-wide or individual | A root-cause hypothesis |
| Engage | Discuss with the team or individual and gather context | A shared understanding |
| Act | Agree one specific, measurable change | A documented action |
| Review | Re-run the same report after two to four weeks | Evidence of impact |

## 7. Recommended operating cadence

| Frequency | Activity | Indicative time |
|---|---|---|
| Daily | Check Dashboard availability and Live Activity | 5 minutes |
| Weekly | Review Burnout & Wellbeing, Work Pulse and insight cards; select one action | 30 minutes |
| Monthly | Review Attendance & Punctuality and Focus Score trends; assess the impact of actions | 45 minutes |
| Quarterly | Review Tool Intelligence and Team Leaderboard with leadership | 60 minutes |

## 8. Responsible use standards

All Client Managers are expected to follow these standards:

1. **Evidence threshold:** no performance conclusion is drawn from a single idle period, screenshot or day.
2. **Right to context:** employees are given the opportunity to explain observed patterns before any decision is made.
3. **Systemic review first:** team-wide patterns are addressed through process, tooling or workload changes before individual measures are considered.
4. **Privacy Mode:** employees may pause tracking at any time. Using Privacy Mode is not, on its own, a performance concern.
5. **Accountable access:** every screenshot, recording and location view is logged. Access sensitive data only for a legitimate business purpose.
6. **Balanced use:** use the data to recognise strong performance and to protect employees from overload, not only to correct.

## 9. Escalation

| Situation | Escalate to |
|---|---|
| Missing team members or incorrect team assignment | Client Administrator |
| Need for data exports or organisation-wide reports | Client Administrator |
| Sustained wellbeing risk for an individual | HR / People team |
| Concerns about the appropriate use of monitoring data | HR, Legal or the Data Protection Officer |

## 10. Frequently asked questions

**Why is an employee shown as Idle during working time?**
Idle indicates no keyboard or mouse input beyond the configured threshold (up to 5 minutes). Reading, calls and workshops may register as idle, which is why conclusions must be based on trends.

**Why are exports unavailable?**
Exports are restricted to Client Administrators.

**Why are some reports not visible?**
Burnout & Wellbeing, Focus Score and Team Leaderboard require the Premium plan or above.

**Can managers view what employees type?**
No. Teemly never records keystrokes or typed content.

## Appendix: Glossary

| Term | Definition |
|---|---|
| Productive / Neutral / Unproductive | Classification of time spent in applications and websites |
| Idle | No keyboard or mouse input beyond the idle threshold |
| Org Productivity Score | A 0–100 measure of productivity for the selected period |
| Focus Score | A 0–100 measure of uninterrupted work |
| Insight card | An AI-generated, plain-language summary at the end of each report |
| Privacy Mode | An employee-controlled pause of all tracking |

> ⬆ **BODY END**: copy up to the line above

---

## 4. Privacy and Monitoring Controls: Reference Guide

### Admin fields

| Field | Value |
|---|---|
| Category | Guides |
| Title | Privacy and Monitoring Controls: Reference Guide |
| URL slug | `privacy-and-monitoring-settings` |
| Author | Teemly |
| Featured | No |
| Summary | The reference for Teemly's privacy architecture: the data processed and never processed, employee controls, privacy blur, Silent Tracking safeguards, access and audit controls, retention, data residency and compliance status. Suitable for HR, Legal, DPOs and employees. |
| Tags | privacy, monitoring, security, compliance, data protection, DPDP, GDPR |

**What you'll learn** (one per line):

```
The exact scope of data Teemly processes, and what it never processes
How Privacy Mode gives employees control that cannot be overridden
How privacy blur guarantees original content is never stored
The legal-consent safeguards that restrict Silent Tracking
The access, audit and security controls that ensure accountability
Retention, data residency, data subject rights and current compliance status
```

### Body

> ⬇ **BODY START**: copy from the line below

This guide is the reference for Teemly's privacy architecture and monitoring controls. It sets out what data is processed, what is never processed, the safeguards that protect employees, and the governance measures available to administrators. It is suitable for circulation to employees, HR, Legal, Data Protection Officers and employee representative bodies.

| Document overview | |
|---|---|
| **Audience** | Client Administrators, HR, Legal, Data Protection Officers and employees |
| **Applies to** | All plans; individual controls vary by plan as noted |
| **Classification** | Suitable for internal and employee distribution |
| **Outcome** | A shared, accurate understanding of how Teemly protects personal data |

## 1. Introduction

Workforce data has value only when the people it describes trust it. Teemly applies privacy-by-design principles throughout: data minimisation, transparency to employees, employee control, restricted access and full accountability. These principles are enforced in the product itself, not only stated in policy.

## 2. Data collection scope

| Data processed | Data never processed |
|---|---|
| Application name and window title | Keystrokes or typed content |
| Website address and domain | Email content or attachments |
| Time spent per application and website | Camera or microphone data |
| Screenshots (where enabled by the administrator) | Personal files or documents |
| Screen recordings (where enabled by the administrator) | Clipboard content |
| GPS location (where enabled by the administrator) | Biometric data of any kind |
| Check-in and check-out times | Private messages or chat content |
| A productivity score derived from the above | Any content an employee types or views |

Screenshots, screen recordings and location are optional. Each is processed only when a Client Administrator explicitly enables it.

## 3. Transparency measures

- **Installation notice:** the installer displays a privacy notice before any data is recorded.
- **Visible indicator:** the agent runs with a visible system-tray icon by default.
- **Published policy:** organisations are expected to publish an internal monitoring policy before deployment.

## 4. Employee control: Privacy Mode

Privacy Mode lets any employee pause all tracking at any time, directly from the Teemly agent.

| Attribute | Behaviour |
|---|---|
| Scope | Pauses activity, screenshots, video recording and location |
| Activation | Immediate, at the employee's discretion |
| Visibility | Administrators and managers see the status only |
| Override | Not possible for any role, including Client Administrators |

## 5. Content protection: privacy blur

Privacy blur (Professional plan and above) obscures on-screen content and keeps the activity information. It is configured per employee.

**Assurance:** blurring happens on the server before storage. The original image is never retained and cannot be recovered by any party, including Teemly.

## 6. Restricted capability: Silent Tracking

Silent Tracking removes the visible indicator from the employee's device. Because of its sensitivity, it is subject to a mandatory legal-consent control.

| Control | Detail |
|---|---|
| Default state | Locked |
| Unlock requirement | An explicit legal acknowledgement by a Client Administrator |
| Enforcement | In the platform itself, not only in the interface |
| Application | Per employee, once unlocked |
| Plan | Professional and above |

**Policy recommendation:** keep Silent Tracking disabled unless Legal has approved a specific, documented and time-limited requirement.

## 7. Access control model

| Capability | Client Administrator | Client Manager |
|---|---|---|
| Data scope | Entire organisation | Assigned teams only |
| Screenshots and recordings | Yes | Assigned teams only |
| Download screenshots and recordings | Yes | No |
| Data export | Yes | No |
| Modify monitoring settings | Yes | No |

**Tenant isolation:** each organisation's data is logically separated, and every query is scoped to a single organisation. There is no path by which one organisation can access another's data.

## 8. Audit and accountability

| Control | Detail |
|---|---|
| Sensitive-data access logging | Every screenshot, recording and location view, with the viewer, the employee and a timestamp |
| Administrative logging | Every sign-in, settings change and role change |
| Log integrity | Append-only; entries cannot be modified or deleted |
| Tamper detection | A checksum on every log entry |
| Log retention | 90 days in the platform, then archived for a minimum of one year |
| Log export | Administrators can export their organisation's audit log as CSV |

## 9. Security controls

| Domain | Control |
|---|---|
| Encryption in transit | HTTPS, TLS 1.2 minimum |
| Encryption at rest | AES-256, including location data |
| Media access | Time-limited links that expire after 15 minutes |
| Agent integrity | Signed data from the agent, with replay protection |
| Authentication | Account lockout after repeated failed sign-in attempts |

## 10. Data retention

| Data type | Starter | Professional | Premium | Enterprise |
|---|---|---|---|---|
| Screenshots | 30 days | 90 days | 180 days | Custom |
| Video recordings | Not included | 7 days | 30 days | Custom |
| Location | Not included | 30 days | 90 days | Custom |

Data is **deleted automatically** at the end of the applicable retention period.

## 11. Data residency

- **Cloud plans:** data is stored in AWS Mumbai (ap-south-1), giving India data residency.
- **Enterprise on-premise:** full on-premise deployment is available, with the same encryption and access controls.

## 12. Data subject rights and compliance

| Right or obligation | How it is met |
|---|---|
| Right of access | Employees may access the personal data held about them |
| Right to erasure | Erasure requests remove the employee's records and stored files |
| Breach notification | Within the 72-hour obligation under India's DPDP Act |
| Grievance redressal | A grievance officer is published at teemly.io/privacy |

| Framework | Current status |
|---|---|
| DPDP Act (India) | Policies and consent flows in place; formal certification in progress |
| GDPR | Architecture aligned: data minimisation and right to erasure by design |
| ISO 27001 | Phase 2 roadmap |
| SOC 2 Type II | Enterprise roadmap |

The Trust Center publishes current certification status.

## 13. Administrator configuration checklist

| Control | Recommended setting | Review frequency |
|---|---|---|
| Optional modules (screenshots, video, location) | Enable only with a documented business purpose | Quarterly |
| Privacy blur | Enable for roles handling sensitive information | Quarterly |
| Silent Tracking | Disabled unless approved by Legal | Quarterly |
| Employee communication | Issued before deployment; refreshed annually | Annually |
| Audit log | Exported and reviewed | Monthly |
| Manager team assignments | Validated against current reporting lines | Quarterly |

## 14. Employee frequently asked questions

**Does Teemly record what I type?**
No. Teemly does not record keystrokes, typed content, email or messages.

**Can my camera or microphone be accessed?**
No. Teemly never accesses the camera or microphone.

**How do I pause tracking?**
Turn on Privacy Mode in the Teemly agent. All tracking pauses immediately, and it cannot be overridden.

**Who can view my screenshots?**
Client Administrators, and the managers of your assigned team. Every view is logged.

**How do I request access to my data, or its deletion?**
Contact your organisation's administrator or HR team, or Teemly's grievance officer at teemly.io/privacy.

> ⬆ **BODY END**: copy up to the line above

---

## 5. The Enterprise Rollout Guide to Teemly

### Admin fields

| Field | Value |
|---|---|
| Category | Guides |
| Title | The Enterprise Rollout Guide to Teemly |
| URL slug | `enterprise-rollout-guide` |
| Author | Teemly Customer Success |
| Featured | Yes |
| Summary | A step-by-step playbook for rolling Teemly out across a large organisation: governance, legal and privacy readiness, the security review, access design, policy configuration, agent deployment in waves, manager enablement and ongoing audit. It includes a 10-week plan, baseline settings and a go-live checklist. |
| Tags | enterprise, rollout, implementation, governance, privacy, security, change management, DPDP, GDPR |

**What you'll learn** (one per line):

```
How to set up a steering group and decide what success means before anyone installs anything
What Teemly collects, what it never collects, and how to explain that to employees and works councils
How to answer an InfoSec review using Teemly's encryption, access-control and audit controls
How to design teams, roles and per-employee policy so people see only what they need to
How to deploy the desktop agent in waves and confirm coverage before go-live
How to train managers to turn reports into decisions, and keep governance running after launch
```

### Body

> ⬇ **BODY START**: copy from the line below

Teemly can technically be live in a day: install the desktop agent, invite your people, and the Dashboard starts filling. In a large organisation, though, the software is the easy part. The hard part is earning trust, passing your security and legal reviews, and making sure managers use the data to make better decisions, not to micromanage.

This guide is the playbook our team uses with enterprise customers. It is written for the people who own the rollout: the project lead, HR, IT and InfoSec, Legal or the Data Protection Officer, and the operations leaders whose teams will use Teemly every day. Work through it in order. Each chapter ends with the decisions you should have made before moving on.

## 1. Before you start: governance and outcomes

Enterprise rollouts fail for organisational reasons far more often than technical ones. Set up the structure first.

### Form a steering group

| Role | Owns | Signs off on |
|---|---|---|
| Executive sponsor | The business case and the "why" | Scope, budget and the go-live decision |
| Project lead | The plan, timeline and day-to-day coordination | Each phase gate |
| HR / People | Employee communication, policy wording, works-council consultation | The monitoring policy and FAQ |
| Legal / DPO | Lawful basis, notices, data-processing terms | The privacy assessment and the Silent Tracking position |
| IT / InfoSec | Security review, agent packaging and distribution | The security review and the deployment plan |
| Operations leads | How managers will use the data | The manager playbook and the success metrics |

### Write down what success means

Choose two to four measurable outcomes before configuring anything, and capture a baseline. Good enterprise outcomes are specific and organisational, not individual:

- **Capacity:** reduce unplanned overtime across delivery teams by a set percentage within two quarters.
- **Attendance accuracy:** replace manual timesheets with activity-derived attendance for 100% of covered staff.
- **Software spend:** identify and reclaim underused licences using Tool Intelligence.
- **Wellbeing:** cut the number of employees flagged by the Burnout & Wellbeing report quarter on quarter.

> **Principle:** if you cannot name the decision a metric will change, do not collect it. Turn on only the modules that serve your stated outcomes.

### Decisions to make before moving on

- Steering group named, with a single accountable project lead
- Two to four outcomes agreed, each with a baseline and a target
- Scope agreed: which business units, countries and roles are in phase one

## 2. Legal, privacy and employee trust

Workforce analytics only works when employees believe it is fair. Teemly is built so that privacy is a code path rather than a policy promise, and your rollout should make that visible.

### Know exactly what is and is not collected

| Teemly collects | Teemly never collects |
|---|---|
| App name and window title | Keystrokes or typed content |
| Website URL and domain | Email content or attachments |
| Time spent per app and website | Camera or microphone data |
| Screenshots (if enabled) | Personal files or documents |
| Video recordings (if enabled) | Clipboard content |
| GPS location (if enabled) | Biometric data of any kind |
| Check-in and check-out times | Private messages or chat content |
| Productivity score (a derived metric) | Any content the employee types or views |

### Complete a privacy assessment

Most enterprises run a Data Protection Impact Assessment (or local equivalent) for workforce monitoring. Document:

- The purpose of each module you enable and the outcome it supports
- The lawful basis for processing in each country in scope
- Retention per data type (see the plan table in chapter 3). Teemly deletes data automatically when retention expires
- Who can see what (the access model from chapter 5)
- How employees exercise their rights. Employees can view their own data, and an erasure request triggers a database soft-delete plus storage cleanup

Teemly's architecture is aligned with India's DPDP Act and with GDPR (data minimisation and right to erasure by design). Cloud data is stored in AWS Mumbai (ap-south-1), and breach notification follows the 72-hour DPDP obligation. Formal DPDP certification is in progress; ISO 27001 and SOC 2 Type II are on the Phase 2 roadmap. Share this status with Legal as it stands, and check the Trust Center for updates.

### Use the built-in privacy controls on purpose

- **Install-time notice:** the agent shows a privacy notice at installation, before any tracking begins.
- **Privacy Mode:** employees can pause all tracking, including screenshots, video and location. Admins cannot override it. Explain that in your communications, because it is the strongest trust signal you have.
- **Privacy blur:** when blur is on for an employee, the original screenshot or recording is never written to storage. The blur is applied server-side before saving.
- **View logging:** every screenshot, recording and location view is logged with who viewed it, which employee, and when.

### Take a position on Silent Tracking

Silent Tracking hides the agent from the employee. It stays locked until a Client Admin completes a mandatory legal-consent acknowledgement. **Our recommendation for enterprise rollouts is to leave it off.** If Legal identifies a specific, lawful need (for example, a regulated investigation), document the justification, limit it to named individuals, and review it on a fixed date.

### Tell employees before the agent arrives

Send communication from the executive sponsor and HR at least two weeks before the first install. Cover:

1. Why the organisation is adopting Teemly, in terms of the outcomes from chapter 1
2. What is collected and what is never collected (reuse the table above)
3. How Privacy Mode works and when employees should use it
4. Who can see their data, and that every sensitive view is logged
5. How to see their own data and how to raise a concern

Where works councils or unions exist, consult them before you finalise the policy, not after.

### Decisions to make before moving on

- Privacy assessment signed off by Legal or the DPO
- Internal monitoring policy published, with an employee FAQ
- Silent Tracking position documented (recommended: off)
- Works-council or union consultation completed where required

## 3. Choosing your plan and deployment model

### Match the plan to the modules you need

|  | Professional | Premium | Enterprise |
|---|---|---|---|
| Employees | Up to 200 | Up to 500 | Unlimited |
| Screenshot interval / retention | 2 min / 90 days | 1 min / 180 days | Custom |
| Video recording retention | 7 days | 30 days | Custom |
| Location tracking retention | 30 days | 90 days | Custom |
| Reports | Work Pulse, Tool Intelligence, Attendance & Punctuality, AI insights | Adds Burnout & Wellbeing, Focus Score, Team Leaderboard | All reports |
| Custom roles | Up to 5 | Unlimited | Unlimited, with module-level permissions |
| Support | 48-hour SLA | 24-hour SLA | 4-hour SLA and a dedicated account manager |

Organisations above 500 employees, or with custom retention requirements, need the Enterprise plan. Enterprise is also the only plan that lets you set retention per module, which most privacy assessments call for.

### Cloud or on-premise

- **Cloud (default):** data is stored in a private AWS S3 bucket and database in Mumbai (ap-south-1), which gives you India data residency.
- **On-premise (Enterprise):** for organisations whose data cannot leave their premises, Teemly deploys fully on-premise using MinIO, with the same signed-URL and encryption guarantees.

Decide this early. On-premise adds an infrastructure workstream to your plan.

### Decisions to make before moving on

- Plan selected and retention per module agreed with Legal
- Deployment model chosen: cloud or on-premise

## 4. Passing the security review

Give your InfoSec team this summary up front. It answers most questions on standard vendor-security questionnaires.

| Area | Control |
|---|---|
| Encryption in transit | HTTPS everywhere, TLS 1.2 minimum |
| Encryption at rest | AES-256 for the database and object storage, including location data |
| Media access | Screenshots and recordings served only through signed URLs that expire after 15 minutes |
| Agent integrity | Payloads signed with HMAC-SHA256, with replay-attack prevention. The agent is code-signed with a Windows EV certificate, and the macOS build is notarised |
| Authentication | 15-minute JWT access tokens; 7-day refresh tokens in HTTP-only, Secure, SameSite=Strict cookies, rotated on every refresh. Account lockout after 5 failed attempts. Passwords hashed with bcrypt (cost 12) |
| Tenant isolation | The organisation ID is read only from the token, never from the request, and every query is scoped by organisation. No cross-organisation query path exists |
| Authorisation | Role-based access control enforced in API middleware on every route, not only in the interface |
| Audit | Append-only audit log with a SHA-256 checksum per row. Kept 90 days in the database, then archived for at least 1 year. Exportable as CSV |
| Infrastructure | Database in a private subnet with no public endpoint. AWS WAF (SQL injection, XSS, rate limiting) and AWS Shield Standard. Secrets in AWS Secrets Manager, database credentials rotated every 90 days |
| AI | Insights are generated from structured, organisation-scoped activity data and output derived metrics only. They are never shared across organisations |
| Sub-processors | AWS, Vercel, Datadog, Sentry |

For anything not covered here, ask your account team for the full security documentation during procurement rather than after signature.

### Decisions to make before moving on

- Vendor security review approved
- Data-processing agreement signed

## 5. Designing teams and access

Your access model decides who can see what. Design it on paper before you invite anyone.

### Mirror how work is actually managed

Build teams around the people a manager is accountable for, not around the org chart's cost centres. Every manager in Teemly sees only their assigned teams, so team design is your first privacy control.

- Keep teams small enough that a manager can act on the data (typically 5–15 people).
- Use consistent naming, for example *Region – Function – Team*, so reports stay readable at scale.
- Assign each team at least one manager, and confirm nobody is a member of a team they also manage unless that is intended.

### Apply least privilege to roles

| Capability | Client Admin | Client Manager |
|---|---|---|
| Scope | Whole organisation | Assigned teams only |
| Org-wide reports | Yes | No |
| Exports (CSV / Excel) | Yes | No |
| Settings, policy and Silent Tracking | Full access | No access |
| Download recordings | Yes | No |

Keep the number of Client Admins as small as possible: usually two or three named people in HR operations and IT, never shared accounts. Use custom roles with per-module read-only or full access for everyone in between. A common pattern is an "HR Analyst" role with read-only Reports and Attendance and no access to Screenshots or Video.

### Decisions to make before moving on

- Team structure mapped, with a manager for every team
- Named Client Admins (two or three people)
- Custom roles defined for HR, finance or regional leads, each with module-level access

## 6. Configuring policy

Settings work in two layers. **Org Defaults** apply to every new employee, and a person's individual settings always override them. Set sensible defaults, then make exceptions deliberately and document why.

### Work policy

Configure working days, expected hours, expected check-in time and productivity targets. Attendance is derived from activity: check-in is the first agent event of the working day and check-out is the last, so there is nothing for employees to type in. Set a realistic grace period so late check-ins are flagged fairly.

### A recommended monitoring baseline

| Setting | Knowledge workers | Field and remote teams | Regulated or high-risk roles |
|---|---|---|---|
| Activity and app usage | On | On | On |
| Screenshots | Off, or a long interval with blur on | Off | On, at the interval your policy requires |
| Video recording | Off | Off | Only where a documented control requires it |
| Location tracking | Off | On, with geofences for client sites | Only if relevant |
| Silent Tracking | Off | Off | Off, unless Legal approves a named exception |

Start with the least intrusive configuration that still delivers your outcomes. It is far easier to switch a module on later with a clear reason than to win back trust after switching on too much.

### Idle detection and geofences

- Set idle thresholds that fit the work. Roles with a lot of reading, calls or whiteboarding need longer thresholds.
- For field teams, define geofences for offices and client sites so presence can be confirmed by geofence entry.

### Decisions to make before moving on

- Org Defaults configured to the agreed baseline
- Exceptions listed by team or role, each with a documented reason

## 7. Deploying the desktop agent

Teemly captures activity through its own desktop agent for Windows and macOS. It is a sub-2MB installer, built in-house, code-signed and notarised.

### Package and distribute

- Distribute the signed installer through your device-management tool (for example Intune, Jamf or Configuration Manager), not by email links.
- Agree packaging and any install parameters with your Teemly account team before the pilot, and test on a standard build of each operating system you support.
- Allow outbound HTTPS from managed devices to the Teemly platform through your proxy and endpoint-security tools. Add the agent to your EDR allow-list if needed.
- Make sure the install-time privacy notice is shown to the employee. Do not suppress it.

### Confirm coverage

In **Settings → People & Roles**, every person shows their agent install status and last-sync time. Use it as your deployment tracker:

- Target at least 95% of in-scope employees installed and syncing before you call a wave complete.
- Follow up on anyone shown as "Not Installed" on the Dashboard's Live Activity list within 48 hours.
- Investigate stale last-sync times. They usually mean a blocked network path or a device that is rarely used.

## 8. A phased rollout plan

Roll out in waves. Each wave has an exit gate, and you only move on when it is met.

| Phase | Weeks | Scope | Exit gate |
|---|---|---|---|
| 0. Prepare | 1–3 | Governance, privacy assessment, security review, access design, policy | Legal, InfoSec and HR sign-off |
| 1. Pilot | 4–5 | One or two volunteer teams (20–50 people) with engaged managers | 95% coverage, no unresolved privacy concerns, managers can explain what they did with the data |
| 2. Wave 1 | 6–7 | One business unit or region | Coverage target met, support tickets trending down |
| 3. Wave 2+ | 8–9 | Remaining units, in groups of a manageable size | Coverage target met in each group |
| 4. Stabilise | 10 | Whole organisation | First monthly outcome review held with the steering group |

Use the pilot to test your communications as well as the software. Ask pilot employees what confused or worried them, and fix the FAQ before Wave 1.

## 9. Enabling managers

The value of Teemly comes from better decisions, and managers make most of them. Train every manager before their team goes live.

### Match each report to a decision

| Report | Question it answers | Typical decision |
|---|---|---|
| Work Pulse | When does my team do its best work, and what distracts it? | Protect peak hours from meetings |
| Attendance & Punctuality | Is attendance reliable, and where are the patterns? | Adjust shift times or check-in policy |
| Tool Intelligence | Where does time go, and which licences sit unused? | Reclaim or reassign software licences |
| Burnout & Wellbeing | Who is working too much overtime, after hours or at weekends? | Rebalance workload before people burn out |
| Focus Score | Does my team get uninterrupted time? | Reduce context switching and meeting load |
| Team Leaderboard | How do teams compare and trend over four weeks? | Find teams to learn from and coaching opportunities |

Every report closes with AI-generated insight cards in plain language. Treat them as a starting point for a conversation, not a verdict.

### Ground rules for managers

- **Look at trends, not moments.** One idle hour or one screenshot is never evidence of performance.
- **Talk before you act.** Use the data to open a conversation, and give the employee their context.
- **Respect Privacy Mode.** Pausing tracking is an employee right. Never treat it as a performance signal on its own.
- **Remember that views are logged.** Open screenshots, recordings and location data only with a legitimate reason.
- **Celebrate as well as correct.** Use the data to recognise good work and protect people from overload.

## 10. Running governance after go-live

Go-live is the start of governance, not the end of the project. Put these routines in the calendar.

| Cadence | Activity | Owner |
|---|---|---|
| Weekly (first 2 months) | Review agent coverage and support tickets | Project lead, IT |
| Monthly | Review outcomes against baseline with the steering group | Executive sponsor |
| Monthly | Export the audit log as CSV and review sensitive views and settings changes | DPO or InfoSec |
| Quarterly | Access review: Client Admins, custom roles, manager-to-team assignments, leavers | HR operations, IT |
| Quarterly | Policy review: is every enabled module still justified by an outcome? | Steering group |
| Ongoing | Handle employee access and erasure requests within your statutory deadlines | DPO |
| Annually | Re-run the privacy assessment and refresh employee communication | Legal, HR |

Make removing leavers part of your offboarding checklist, so people who leave lose access straight away and their data follows your retention policy.

## 11. Measuring success

Report against the outcomes you chose in chapter 1. Alongside them, track rollout health:

- **Coverage:** share of in-scope employees with the agent installed and syncing (target 95%+)
- **Manager adoption:** share of managers who open their team view at least weekly
- **Trust:** employee concerns raised and resolved, and pulse-survey sentiment about monitoring
- **Action rate:** decisions made from insights each month, such as workload rebalanced, licences reclaimed or schedules changed

If coverage is high but action rate is low, the problem is manager enablement, not the software. Go back to chapter 9.

## 12. Go-live checklist

### Governance

- Executive sponsor and project lead named
- Outcomes, baselines and targets agreed

### Legal and people

- Privacy assessment signed off
- Monitoring policy and employee FAQ published
- Works council or union consulted where required
- Silent Tracking position documented
- Employees told at least two weeks before install

### Security and IT

- Security review approved and data-processing agreement signed
- Installer packaged and tested on each supported operating system
- Network, proxy and EDR allow-lists in place

### Configuration

- Teams and manager assignments created
- Client Admins limited to named individuals; custom roles defined
- Org Defaults set to the agreed baseline; exceptions documented
- Retention per module confirmed

### Launch

- Pilot completed and exit gate met
- All managers trained on reports and ground rules
- Governance routines in the calendar

## Next steps

Every enterprise is different. Your Teemly account team can run a scoping workshop with your steering group, review your policy configuration, and plan the waves with you. [Book a demo](/book-a-demo) to get started, or visit the [Trust Center](/trust-center) for our latest security and compliance status.

> ⬆ **BODY END**: copy up to the line above

---

## 6. Choosing the Right Teemly Plan

### Admin fields

| Field | Value |
|---|---|
| Category | Guides |
| Title | Choosing the Right Teemly Plan |
| URL slug | `choosing-teemly-plan` |
| Author | Teemly |
| Featured | No |
| Summary | A structured buyer's guide to the Teemly plans: Starter, Professional, Premium and Enterprise compared by scale, capture, retention, modules, reports, access control and support, with a decision framework for matching a plan to your organisation's requirements. |
| Tags | pricing, plans, buyers guide, evaluation, enterprise, procurement |

**What you'll learn** (one per line):

```
How the four Teemly plans compare across every capability
Which modules and reports each plan includes
How retention and capture frequency differ by plan
When Enterprise and on-premise deployment are the right choice
A decision framework for selecting a plan
```

### Body

> ⬇ **BODY START**: copy from the line below

This guide helps decision-makers choose the Teemly plan that fits their organisation's scale, requirements and governance needs. It compares the plans capability by capability and gives a structured decision framework.

| Document overview | |
|---|---|
| **Audience** | Executives, procurement, IT and HR decision-makers |
| **Outcome** | A plan selection matched to documented requirements |
| **Pricing** | See the Pricing page for current prices. Yearly billing saves 15%. |

## 1. Plan comparison

| Capability | Starter | Professional | Premium | Enterprise |
|---|---|---|---|---|
| Employees | Up to 50 | Up to 200 | Up to 500 | Unlimited |
| Screenshot interval | 5 minutes | 2 minutes | 1 minute | Custom |
| Screenshot retention | 30 days | 90 days | 180 days | Custom |
| Video Recording | Not included | 7-day retention | 30-day retention | Custom |
| Location Tracking | Not included | 30-day retention | 90-day retention | Custom |
| Privacy blur, Silent Tracking, audit logs | Not included | Included | Included | Included |
| Custom roles | Not included | Up to 5 | Unlimited | Unlimited, module-level |
| Deployment | Cloud | Cloud | Cloud | Cloud or on-premise |
| Support | Email | 48-hour SLA | 24-hour SLA | 4-hour SLA and a dedicated account manager |

## 2. Reports by plan

| Report | Starter | Professional | Premium | Enterprise |
|---|---|---|---|---|
| Attendance & Punctuality | Yes | Yes | Yes | Yes |
| Work Pulse | No | Yes | Yes | Yes |
| Tool Intelligence | No | Yes | Yes | Yes |
| AI-generated insights | No | Yes | Yes | Yes |
| Burnout & Wellbeing | No | No | Yes | Yes |
| Focus Score | No | No | Yes | Yes |
| Team Leaderboard | No | No | Yes | Yes |

API access for integrations is available on Premium and Enterprise.

## 3. Decision framework

Work through these questions in order. The first one you answer "yes" to gives the recommended plan.

| # | Question | If yes |
|---|---|---|
| 1 | Will more than 500 employees use Teemly? | Enterprise |
| 2 | Do data or contracts require on-premise storage or custom retention? | Enterprise |
| 3 | Do you need Burnout & Wellbeing, Focus Score, Team Leaderboard or API access? | Premium |
| 4 | Do you need Video Recording, Location Tracking, privacy blur, audit logs or AI insights? | Professional |
| 5 | None of the above | Starter |

## 4. Plan profiles

| Plan | Best suited to |
|---|---|
| Starter | Small teams getting workforce visibility for the first time |
| Professional | Growing organisations that need visual evidence, location and governance controls |
| Premium | Scaling organisations focused on wellbeing, focus and performance analytics |
| Enterprise | Large or regulated organisations with custom scale, retention, deployment or support needs |

## 5. Evaluation checklist

| Requirement | Questions to answer |
|---|---|
| Scale | How many employees are in scope now, and in 12 months? |
| Capabilities | Which modules and reports support your stated objectives? |
| Governance | Do you need blur, audit logs or custom roles? |
| Retention | What retention does your privacy assessment require? |
| Deployment | Can data be stored in the cloud (AWS Mumbai), or must it stay on-premise? |
| Support | What response time does your operation need? |

Every plan includes a free trial, with no credit card required.

> ⬆ **BODY END**: copy up to the line above

---

## 7. Teemly Security Review Pack

### Admin fields

| Field | Value |
|---|---|
| Category | Guides |
| Title | Teemly Security Review Pack |
| URL slug | `security-review-pack` |
| Author | Teemly |
| Featured | No |
| Summary | A consolidated security reference for InfoSec and procurement teams evaluating Teemly: architecture, encryption, authentication, tenant isolation, audit, infrastructure, AI security, data residency, sub-processors and compliance status, structured to support vendor security questionnaires. |
| Tags | security, InfoSec, procurement, vendor assessment, compliance, encryption |

**What you'll learn** (one per line):

```
How data flows from the Teemly agent to the platform, and how it is protected
The encryption, authentication and authorisation controls in place
How tenant isolation and role-based access are enforced
How audit logging provides accountability and tamper detection
Infrastructure, data residency and sub-processor details
Current compliance and certification status
```

### Body

> ⬇ **BODY START**: copy from the line below

This pack brings together the security information InfoSec and procurement teams typically need when assessing Teemly. It is organised to match the structure of common vendor security questionnaires. For anything not covered here, ask your Teemly account team during procurement.

| Document overview | |
|---|---|
| **Audience** | InfoSec, IT risk, procurement and Data Protection Officers |
| **Scope** | The Teemly platform, desktop agent and data storage |
| **Outcome** | The information needed to complete a vendor security assessment |

## 1. Data flow architecture

| Stage | Component | Protection |
|---|---|---|
| 1. Capture | Teemly agent on the employee's device | Code-signed (Windows EV certificate) and notarised (macOS) |
| 2. Transmission | Agent to the Teemly platform | Signed, encrypted data over HTTPS (TLS 1.2 minimum) |
| 3. Processing | Teemly platform | Role checked on every request; every query scoped to one organisation |
| 4. Storage | Database and file storage (screenshots, video, location) | Private subnet and private bucket, encrypted with AES-256 |
| 5. Access | Admins and managers in the web platform | Media shown only through links that expire after 15 minutes |

## 2. Endpoint agent

| Control | Detail |
|---|---|
| Ownership | Built and maintained by Teemly; no third-party monitoring components |
| Code signing | Windows EV certificate; macOS build notarised |
| Updates | Automatic, with signature verification on startup |
| Data integrity | HMAC-SHA256 signed payloads, with replay-attack prevention |
| Transparency | Privacy notice at installation; visible system-tray icon |

## 3. Encryption

| Domain | Control |
|---|---|
| In transit | HTTPS, TLS 1.2 minimum |
| At rest | AES-256 for the database and object storage |
| Location data | Encrypted at rest and in transit |
| Media access | Signed links with a 15-minute expiry; files are never served directly |

## 4. Authentication and session management

| Control | Detail |
|---|---|
| Access token | JWT, with a 15-minute expiry |
| Refresh token | 7-day, HTTP-only, Secure cookie, SameSite=Strict |
| Token rotation | On every refresh |
| Account lockout | After 5 failed sign-in attempts |
| Password storage | bcrypt, cost factor 12 |
| Password reset | One-time code by email, with a 10-minute expiry |

## 5. Authorisation and tenant isolation

| Control | Detail |
|---|---|
| Role-based access | Enforced in API middleware on every route |
| Organisation scoping | The organisation ID is read only from the token, never from the request |
| Query isolation | Every query is scoped to one organisation; no cross-organisation query path exists |
| Manager scoping | Managers are limited to their assigned teams |

## 6. Audit and accountability

| Control | Detail |
|---|---|
| Sensitive access logging | Every screenshot, recording and location view |
| Administrative logging | Sign-ins, settings changes and role changes, with timestamps |
| Integrity | Append-only log, with a SHA-256 checksum per entry |
| Retention | 90 days in the database, then archived for at least one year |
| Export | Customers can export their audit log as CSV |

## 7. Infrastructure security

| Control | Detail |
|---|---|
| Network | Database in a private subnet with no public endpoint |
| Perimeter | AWS WAF (SQL injection, XSS and rate limiting) and AWS Shield Standard |
| Secrets | Stored in AWS Secrets Manager; database credentials rotated every 90 days |
| Storage | Private S3 bucket in AWS Mumbai (ap-south-1) |
| On-premise option | MinIO for Enterprise customers, with the same controls |

## 8. AI security

| Control | Detail |
|---|---|
| Input data | Structured, organisation-scoped activity data only |
| Outputs | Derived metrics and insight cards, never raw captured content |
| Isolation | Insights generated per organisation, never shared across organisations |
| Excluded data | No keystroke, email, clipboard or biometric data exists to process |

## 9. Data protection

| Area | Detail |
|---|---|
| Data residency | AWS Mumbai (ap-south-1) for cloud plans; on-premise available |
| Retention | Enforced per plan, with automatic deletion at expiry |
| Right to erasure | Database soft-delete plus storage cleanup |
| Breach notification | Within the 72-hour DPDP obligation |
| Sub-processors | AWS, Vercel, Datadog, Sentry |

## 10. Compliance status

| Framework | Status |
|---|---|
| DPDP Act (India) | Processing policies, consent flows and employee notification in place; formal certification in progress |
| GDPR | Architecture aligned: data minimisation and right to erasure by design |
| ISO 27001 | Phase 2 roadmap |
| SOC 2 Type II | Enterprise roadmap; audit process planned for Phase 2 |

Current status is published in the Trust Center.

> ⬆ **BODY END**: copy up to the line above

---

## 8. How to add a guide in the admin panel

1. Open this file in VS Code and press **Ctrl+Shift+V** to open the Markdown preview.
2. In the preview, select the guide's body (between `BODY START` and `BODY END`) and copy it with **Ctrl+C**. Copying from the preview keeps headings, tables, lists and code blocks.
   - Don't copy the raw Markdown text. The editor would show the `##` and `|` characters literally, or turn the whole guide into one code block.
3. Go to `https://<your-domain>/admin` → **Resources** → **New resource**.
4. Fill in the fields from the guide's **Admin fields** table:
   - **Category:** Guides
   - **Title**, **URL slug**, **Author**, **Summary**
   - **What you'll learn:** one item per line
   - **Tags:** comma-separated
5. Click in **Body** and paste with **Ctrl+V**.
6. Set the status to **Published**, choose a publish date (a future date schedules it), and save.
7. Open `/resources/guides/<slug>` and check the page. The H2 headings appear in the "On this page" table of contents.

**Limits:** summary up to 400 characters, up to 8 "What you'll learn" items, up to 12 tags.
