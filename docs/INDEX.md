# Documentation Index

Complete documentation for the QA Review Application.

---

## 📚 Quick Start

- **[README](../README.md)** - Project overview
- **[Team Brief](../TEAM_BRIEF.md)** - Team guidelines
- **[Setup Guide](./guides/SETUP.md)** - Getting started
- **[Start Here](./guides/START_HERE.md)** - First steps

---

## 🏗️ Architecture

- **[Architecture Overview](./architecture/ARCHITECTURE.md)** - System design
- **[Database Schema](./architecture/DATABASE_SCHEMA.md)** - Data models
- **[API Documentation](./architecture/API_DOCUMENTATION.md)** - API endpoints
- **[Reusable Components](./architecture/REUSABLE_COMPONENTS.md)** - Component library

---

## ✨ Features

- **[Features Summary](./features/FEATURES_SUMMARY.md)** - All features overview
- **[Assign Reviewer](./features/ASSIGN_REVIEWER_FEATURE.md)** - Reviewer assignment
- **[Final Review](./features/FINAL_REVIEW_FEATURE.md)** - CEO final review
- **[Grading System](./features/GRADING_SYSTEM_UPDATE.md)** - Grading standards
- **[Workflow Status](./features/REVIEW_STATUS_WORKFLOW_UPDATE.md)** - Review workflows
- **[Attachments](./features/DYNAMIC_ATTACHMENTS_IMPLEMENTATION.md)** - File management

---

## 🔧 Refactoring Documentation

**Latest Session:** [Complete Consistency Refactoring](./refactoring/FINAL_CONSISTENCY_AUDIT_COMPLETE.md)

### Main Documents:
- **[Final Audit Complete](./refactoring/FINAL_CONSISTENCY_AUDIT_COMPLETE.md)** - Complete session summary
- **[Master Refactoring](./refactoring/MASTER_CONSISTENCY_REFACTORING.md)** - Detailed overview
- **[Semantic Color System](./refactoring/SEMANTIC_COLOR_SYSTEM_FIX.md)** - Color standardization

### Component Refactoring:
- [Selection Styling](./refactoring/SELECTION_STYLING_FIX.md)
- [Layout System](./refactoring/LAYOUT_REFACTORING_COMPLETE.md)
- [Dashboard Cards](./refactoring/DASHBOARD_REFACTORING_SUMMARY.md)
- [Rating Forms](./refactoring/RATING_FORM_REFACTORING_COMPLETE.md)
- [Panel Spacing](./refactoring/FINAL_REVIEW_PANEL_CONSISTENCY_FIX.md)
- [Border System](./refactoring/BORDER_SEPARATION_FIX.md)

### Historical:
- [Previous Refactorings](./refactoring/) - Older session docs

---

## 📖 Guides

- **[Production Guide](./guides/PRODUCTION_GUIDE.md)** - Deployment
- **[Scalability Guide](./guides/SCALABILITY_GUIDE.md)** - Scaling patterns
- **[Environment Setup](./guides/ENV_SETUP.md)** - Configuration
- **[Data Item Card Migration](./guides/DATA_ITEM_CARD_MIGRATION.md)** - Component patterns
- **[UX Testing Guide](./guides/UX_TESTING_GUIDE.md)** - Testing guidelines
- **[Folder Structure](./guides/FOLDER_STRUCTURE.md)** - Project organization

---

## 📦 Archive

Historical implementation docs: [Archive](./archive/)

---

## Quick Reference

### Reusable Components:
- `getItemCardStyles()` - Item selection styling
- `ListDetailLayout` - Two-column page layout
- `DashboardStatCard` - Dashboard metric cards
- `RatingForm` - All rating forms
- `MemberFirmView` / `ReviewerView` - List wrappers
- `ActionPanelLayout` - Detail panel structure

### Standard Values:
- List spacing: `space-y-1` (4px)
- Panel width: `w-96` (384px)
- Panel padding: `px-6 py-4`
- Form sections: `bg-muted/50` (default)
- Card selection: `border-l-4 border-l-primary`
- Dashboard hover: `shadow-md` + `scale-[1.02]`

---

## Documentation Organization

```
docs/
├── INDEX.md (this file)
├── README.md
├── architecture/
│   ├── ARCHITECTURE.md
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   └── REUSABLE_COMPONENTS.md
├── features/
│   ├── FEATURES_SUMMARY.md
│   └── ... (9 feature docs)
├── guides/
│   ├── START_HERE.md
│   ├── SETUP.md
│   ├── PRODUCTION_GUIDE.md
│   └── ... (7 guide docs)
├── refactoring/
│   ├── README.md
│   ├── FINAL_CONSISTENCY_AUDIT_COMPLETE.md
│   └── ... (15 refactoring docs)
└── archive/
    └── ... (10 historical docs)
```

---

**All documentation is now properly organized!** 📁

