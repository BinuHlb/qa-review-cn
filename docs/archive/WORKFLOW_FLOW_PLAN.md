# QA Review Application - User Flow & Navigation Plan

## Current Situation Analysis

### ✅ What We Have
- Admin reviews page (list view)
- Review assignment drawer
- Final review screen (CEO)
- Member firms page
- Reviewers page
- Role-based dashboards
- Complete data model with workflow support

### ❌ What's Missing - THE FLOW
- No clear path for reviewer to accept assignment
- No clear path for reviewer to submit review
- No clear path for TD to verify
- No clear path for CEO to finalize
- No visual workflow indicator showing where user is
- No role-specific task lists

---

## Proper User Flow by Role

### 1️⃣ **ADMIN Flow** (Assignment & Monitoring)

```
Admin Dashboard
    ↓
Reviews List (all statuses visible)
    ↓
[Select Review] → View Details
    ↓
[Assign Reviewer Button]
    ↓
Assignment Drawer Opens
    ├─ Select Reviewer
    ├─ Choose Review Type (18/8/5 hours)
    ├─ Set Dates
    └─ [Assign Button]
    ↓
Email sent to Reviewer + Firm
    ↓
[Admin monitors status on dashboard]
    ├─ Pending Acceptance → Wait
    ├─ In Progress → Monitor percentage
    ├─ Submitted → Alert TD
    ├─ Verified → Alert CEO
    └─ Completed → Archive
```

**What Admin Sees**:
- Dashboard with status breakdown (2 pending, 3 in progress, etc.)
- Reviews list with workflow status badges
- Ability to assign/reassign
- Ability to act on behalf of any role (omnipotent mode)

---

### 2️⃣ **REVIEWER Flow** (Accept → Review → Submit)

```
Reviewer Dashboard
    ↓
"Pending Assignments" Section (RED ALERT)
    ↓
[Click on Pending Assignment]
    ↓
Review Details + Acceptance Card
    ├─ See: Member Firm, Review Type, Dates
    ├─ See: Original Documents
    ├─ Option: Accept or Reject
    └─ If Accept → Status changes to "Accepted"
    ↓
Wait for Firm to Accept
    ↓
Both Accepted → Status: "In Progress"
    ↓
"My Active Reviews" Section
    ↓
[Click on Active Review]
    ↓
Review Work Screen
    ├─ Download Original Files
    ├─ Upload Reviewed Files (with annotations)
    ├─ Fill Rating Form (1-5)
    ├─ Write Comments
    ├─ Add Recommendations
    └─ [Submit for Verification Button]
    ↓
Confirmation Dialog
    ↓
Status → "Submitted for Verification"
    ↓
Email to Technical Director
    ↓
[Reviewer sees "Submitted" in dashboard]
```

**Key Screens Needed**:
1. **Dashboard** - Shows pending + active reviews
2. **Acceptance Screen** - Simple accept/reject card
3. **Review Work Screen** - File upload + rating form
4. **Submitted Reviews** - Read-only view of submitted work

---

### 3️⃣ **MEMBER FIRM Flow** (Accept Assignment)

```
Firm Dashboard
    ↓
"Pending Reviews" Section
    ↓
[Click on Pending Review]
    ↓
Review Details + Acceptance Card
    ├─ See: Reviewer Assigned
    ├─ See: Review Scope
    ├─ See: Timeline
    ├─ Option: Accept or Reject
    └─ If Accept → Status changes
    ↓
Email Confirmation to Admin
    ↓
[Firm can monitor progress]
```

**Key Screens Needed**:
1. **Dashboard** - Shows reviews involving their firm
2. **Acceptance Screen** - Accept/reject with notes
3. **Progress Monitoring** - View status of ongoing reviews

---

### 4️⃣ **TECHNICAL DIRECTOR Flow** (Verify Reviews)

```
TD Dashboard
    ↓
"Pending Verification" Section (PRIORITY)
    ↓
[Click on Review to Verify]
    ↓
Verification Screen
    ├─ See: Reviewer's Rating (prominently)
    ├─ See: Reviewer's Comments
    ├─ Download: All Files (original + reviewed)
    ├─ Compare: Side by side
    ├─ Decision:
    │   ├─ Agree → Confirm Grade
    │   └─ Disagree → Modify Grade + Explain
    ├─ Write: Verification Notes
    └─ [Verify & Send to CEO Button]
    ↓
Status → "Verified - Pending Final"
    ↓
Email to CEO
    ↓
[TD sees "Verified" in dashboard]
```

**Key Screens Needed**:
1. **Dashboard** - Shows reviews pending verification
2. **Verification Screen** - Rating comparison + verification form
3. **Verified Reviews** - History of verified reviews

---

### 5️⃣ **CEO Flow** (Final Decision)

```
CEO Dashboard
    ↓
"Pending Final Approval" Section (EXECUTIVE PRIORITY)
    ↓
[Click on Review to Finalize]
    ↓
Final Review Screen (ALREADY EXISTS! ✓)
    ├─ See: Three-Column Rating Comparison
    │   ├─ Reviewer: X/5
    │   ├─ TD: Y/5
    │   └─ Final: [Select]
    ├─ See: All Comments & Notes
    ├─ Download: All Documents
    ├─ Write: Executive Summary
    ├─ Add: Action Items
    ├─ Upload: Optional Additional Docs
    └─ [Finalize Review Button]
    ↓
Status → "Completed"
    ↓
Emails to All Stakeholders
    ↓
[CEO sees "Completed" in dashboard]
```

**What We Have**: ✓ Final review screen exists
**What's Needed**: Better integration with dashboard

---

## The Missing Link: **DASHBOARDS**

Each role needs a dashboard showing:

### Admin Dashboard
```
┌─────────────────────────────────────────┐
│ Overview Stats                          │
│ [2] Pending Acceptance                  │
│ [3] In Progress                         │
│ [2] Pending Verification                │
│ [1] Pending Final Approval              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Recent Activity (Timeline)              │
│ • Review REV-001 assigned to John       │
│ • Review REV-002 submitted by Sarah     │
│ • Review REV-003 finalized by CEO       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Quick Actions                           │
│ [+ Assign New Review]                   │
│ [View All Reviews]                      │
│ [Manage Reviewers]                      │
└─────────────────────────────────────────┘
```

### Reviewer Dashboard
```
┌─────────────────────────────────────────┐
│ ⚠️ Action Required                      │
│ [2] Pending Acceptance - RESPOND NOW!   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ My Active Reviews                       │
│ REV-001: Deloitte (45% complete)        │
│ REV-002: PwC (75% complete)             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Submitted Reviews (Awaiting Verification)│
│ REV-003: KPMG - Submitted Oct 7         │
└─────────────────────────────────────────┘
```

### Technical Director Dashboard
```
┌─────────────────────────────────────────┐
│ 🔍 Pending Verification (PRIORITY)      │
│ [2] Reviews waiting for your approval   │
│ REV-SUBMITTED-001: KPMG (Grade 2)       │
│ REV-SUBMITTED-002: Crowe (Grade 3)      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Verified This Month: 5                  │
│ Average Time to Verify: 2.3 days        │
└─────────────────────────────────────────┘
```

### CEO Dashboard
```
┌─────────────────────────────────────────┐
│ 📊 Pending Final Approval (EXECUTIVE)   │
│ [2] Reviews ready for final decision    │
│ REV-VERIFIED-001: PwC (TD: Grade 1)     │
│ REV-VERIFIED-002: Baker Tilly (TD: 3)   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Completed This Quarter: 12              │
│ Grade Distribution: 1(4), 2(5), 3(3)    │
└─────────────────────────────────────────┘
```

---

## Navigation Flow - HOW USERS MOVE

### Current Pages (What Exists)
```
/admin/reviews          ✓ Exists
/admin/reviewers        ✓ Exists
/admin/member-firms     ✓ Exists
/admin/final-reviews    ✓ Exists (but should be for all roles)

/reviewer/dashboard     ✓ Exists (basic)
/director/dashboard     ✓ Exists (basic)
/ceo/dashboard          ✓ Exists (basic)
/firm/dashboard         ✓ Exists (basic)
```

### What We Need to Add/Modify

```
✅ Keep:
/admin/dashboard        - Overview with stats
/admin/reviews          - Full list with workflow status

🆕 Add:
/reviewer/pending       - Pending acceptances (ACTION REQUIRED)
/reviewer/active        - Active reviews (work screen)
/reviewer/submitted     - Submitted reviews (read-only)

/director/verify        - Reviews pending verification
/director/verified      - Verified reviews history

/ceo/finalize           - Reviews pending final approval (use existing final-reviews)
/ceo/completed          - Completed reviews

/firm/pending           - Pending acceptances
/firm/reviews           - Reviews involving this firm
```

---

## The Proper Flow - USER JOURNEY

### Scenario: New Review Assignment

```
DAY 1 - ADMIN
├─ Admin creates review from Salesforce data
├─ Admin opens /admin/reviews
├─ Admin clicks "Assign Reviewer"
├─ Assignment drawer opens
├─ Admin fills form → Clicks "Assign"
└─ System sends emails

DAY 2 - REVIEWER
├─ Reviewer logs in → Dashboard shows "2 Pending Acceptances" (RED)
├─ Reviewer clicks on pending review
├─ Acceptance card shows details
├─ Reviewer clicks "Accept"
└─ System updates status, sends email to admin

DAY 2 - FIRM
├─ Firm logs in → Dashboard shows "1 Pending Review"
├─ Firm clicks on pending review
├─ Acceptance card shows details
├─ Firm clicks "Accept"
└─ System updates status to "In Progress", emails admin

DAY 3-30 - REVIEWER
├─ Reviewer sees review in "Active Reviews"
├─ Reviewer clicks → Work screen opens
├─ Downloads files
├─ Works offline
├─ Uploads reviewed files
├─ Fills rating form (Grade 2 + comments)
├─ Clicks "Submit for Verification"
└─ System updates status, emails TD

DAY 31 - TECHNICAL DIRECTOR
├─ TD logs in → Dashboard shows "1 Pending Verification"
├─ TD clicks → Verification screen opens
├─ TD sees reviewer gave Grade 2
├─ TD reviews all files
├─ TD agrees → Confirms Grade 2
├─ TD adds verification notes
├─ Clicks "Verify & Send to CEO"
└─ System updates status, emails CEO

DAY 32 - CEO
├─ CEO logs in → Dashboard shows "1 Pending Final"
├─ CEO clicks → Final review screen opens
├─ CEO sees: Reviewer 2, TD 2
├─ CEO decides: Final Grade 2
├─ CEO writes executive summary
├─ CEO adds action items
├─ Clicks "Finalize Review"
└─ System completes review, emails everyone

DAY 33 - ALL
└─ Everyone sees "Completed" status on their dashboards
```

---

## UI Components We ACTUALLY Need

### Priority 1: Workflow Navigation
1. **Workflow Status Badge** - Shows current status with color
2. **Dashboard Task Cards** - "You have X pending items"
3. **Action Required Banner** - Red alert for pending tasks

### Priority 2: Acceptance Flow
1. **Acceptance Card** - Simple accept/reject UI
2. **Acceptance Confirmation** - Success message

### Priority 3: Work Screens
1. **Reviewer Work Screen** - File upload + rating form
2. **TD Verification Screen** - Comparison view + verify form
3. **CEO Final Screen** - ✓ Already exists!

### Priority 4: Navigation
1. **Dashboard Improvements** - Task-based navigation
2. **Breadcrumbs** - Show where user is in workflow
3. **Status Indicators** - Visual progress

---

## What We Should Build NEXT

### Option A: Dashboard-First Approach (RECOMMENDED)
```
1. Update each role's dashboard to show workflow tasks
2. Add "Pending Acceptance" section to reviewer/firm dashboards
3. Add "Pending Verification" section to TD dashboard
4. Add "Pending Final" section to CEO dashboard
5. Make each task clickable → opens appropriate screen
```

### Option B: Screen-by-Screen Approach
```
1. Build Acceptance Card component
2. Build Reviewer Work Screen
3. Build TD Verification Screen
4. Connect all to dashboards
```

---

## Recommendation: START WITH DASHBOARDS

**Why?**
- Dashboards are the **entry point** for all users
- They show what tasks are pending
- They drive navigation to the right screens
- Users can immediately see what they need to do

**What to Build:**
1. Update `/reviewer/dashboard` → Show pending acceptances
2. Update `/director/dashboard` → Show pending verifications
3. Update `/ceo/dashboard` → Show pending finals
4. Update `/admin/dashboard` → Show all statuses

Then users can click from dashboard → specific task screen.

---

## Questions to Answer

1. **Where does reviewer go to accept?**
   → `/reviewer/pending` or modal from dashboard?

2. **Where does reviewer work on review?**
   → `/reviewer/active/[id]` or modal?

3. **Where does TD verify?**
   → `/director/verify/[id]` or modal?

4. **How does admin monitor everything?**
   → Enhanced `/admin/reviews` with workflow filters?

5. **How do we show workflow progress visually?**
   → Stepper component in each screen?

---

## Let's Decide the Flow Together

**My Recommendation:**
```
Dashboard → Task List → Modal/Drawer for Action

Example:
Reviewer Dashboard
  ↓
"Pending Acceptances" Card (shows count)
  ↓
Click "View Details"
  ↓
Dialog/Drawer opens showing review details + Accept/Reject buttons
  ↓
Action taken → Dashboard updates
```

**Benefits:**
- Less navigation (stay on dashboard)
- Clear workflow (everything from one place)
- Uses existing drawer/dialog patterns
- Faster UX

**What do you think? Should we:**
1. Build dashboard-first with modals/drawers?
2. Create dedicated pages for each workflow step?
3. Mix of both?

Let me know and I'll implement the proper flow! 🎯

