# Asset Management Ticketing Tool - Complete Implementation Guide

## Overview

This document provides a comprehensive guide to the newly implemented Asset Management Ticketing Tool frontend module. The system implements role-based ticket management with three distinct workspaces: Admin Dashboard, Technician Workbench, and Employee Portal.

---

## Architecture & Design Principles

### Technology Stack
- **Frontend Framework**: React 19.2.6 with Vite
- **State Management**: Redux Toolkit + React Query (TanStack Query)
- **HTTP Client**: Axios with custom interceptors
- **UI Framework**: Bootstrap 5.3.8
- **Icon Library**: Lucide React
- **Styling**: Fluent UI Design System + Bootstrap CSS

### Design System
- **Color Palette**:
  - Emerald Green (#10B981, #D1FAE5): Available/Resolved/Success states
  - Amber Yellow (#F59E0B, #FEF3C7): In-Progress/Medium priority states
  - Crimson Red (#DC2626, #FEE2E2): Critical/Error states
  - Sky Blue (#2563EB, #DBEAFE): Medium priority/Neutral states
  - Slate Gray (#1F2937, #E5E7EB): Text/borders/backgrounds

- **Typography**: 
  - Headers: `fw-bold` with semantic sizing
  - Labels: `fw-semibold` at 0.75rem-0.9rem
  - Body text: 0.95rem with 1.5-1.6 line height

---

## File Structure

```
frontend/src/
├── services/
│   ├── api.js                          # Axios setup with interceptors
│   ├── ticketService.js                # Ticket API service layer
│   └── useTicketQueries.js            # React Query custom hooks
├── components/
│   ├── Toast.jsx                       # Toast notification system
│   ├── ProtectedRoute.jsx              # Role-based route protection
│   └── SidebarLayout.jsx               # Main layout wrapper
├── pages/
│   ├── admin/
│   │   ├── AdminTicketsDashboard.jsx   # Master-Detail ticket view
│   │   ├── AdminDashboard.jsx          # (existing)
│   │   ├── AssetInventory.jsx          # (existing)
│   │   ├── AssetAssignment.jsx         # (existing)
│   │   └── AdminReports.jsx            # (existing)
│   ├── technician/
│   │   ├── TechnicianWorkbench.jsx     # Work queue & actions
│   │   └── TechDashboard.jsx           # (existing)
│   └── employee/
│       ├── EmployeePortal.jsx          # Request form + ticket history
│       └── EmployeeDashboard.jsx       # (existing - modified)
├── App.jsx                             # Main app with routing
└── index.css                           # Global styles
```

---

## Component Documentation

### 1. **Ticket Service Layer** (`services/ticketService.js`)

Centralized API service for all ticket operations with data cleaning utilities.

#### Key Features:
- **Hibernate Lazy Initialization Cleanup**: Removes `hibernateLazyInitializer` and `handler` properties from API responses
- **Bearer Token Integration**: Automatically injected via Axios interceptor in `api.js`
- **Error Handling**: Consistent error logging and rejection

#### Methods:

```javascript
// Fetch all tickets (role-filtered by backend)
ticketService.getAllTickets()

// Create new ticket
ticketService.createTicket({ assetId, issueDescription, priority })

// Dispatch ticket to technician
ticketService.dispatchTicket(ticketId, technicianId)

// Update ticket status
ticketService.updateTicketStatus(ticketId, status)

// Get available technicians
ticketService.getTechnicians()

// Get user's assigned assets
ticketService.getMyAssets()
```

---

### 2. **React Query Hooks** (`services/useTicketQueries.js`)

Custom hooks for state management and mutations.

#### Query Hooks:
```javascript
useTickets()              // Fetch all tickets (5min stale time)
useTechnicians()          // Fetch technician list (10min stale time)
useMyAssets()             // Fetch user's assets (5min stale time)
```

#### Mutation Hooks:
```javascript
useCreateTicket()         // Submit new ticket
useDispatchTicket()       // Assign to technician
useUpdateTicketStatus()   // Update ticket status
```

All mutations automatically invalidate related query caches on success.

---

### 3. **Toast Notification System** (`components/Toast.jsx`)

Context-based toast notifications with automatic cleanup.

#### Usage:
```javascript
import { useToast } from './components/Toast';

const { addToast, removeToast } = useToast();

// Show notifications
addToast('Success message', 'success', 3000);  // Auto-close in 3s
addToast('Error occurred', 'error');
addToast('Warning!', 'warning');
addToast('Info', 'info');

// Manual removal
removeToast(toastId);
```

#### Toast Types:
- `success`: Green (#10B981)
- `error`: Red (#DC2626)
- `warning`: Amber (#F59E0B)
- `info`: Blue (#3B82F6)

---

### 4. **Admin Tickets Dashboard** (`pages/admin/AdminTicketsDashboard.jsx`)

Master-Detail layout for comprehensive ticket oversight.

#### Layout:
- **Left Pane (60% width)**: Scannable list of all tickets
  - Displays: Ticket ID, Asset Name, Raised By, Priority Pill, Status
  - Click to select ticket for detail view
  - Hover effect for visual feedback

- **Right Pane (40% width)**: Full ticket details
  - Complete issue description
  - Created timestamp and user info
  - Assignment action bar (if status === 'OPEN' && no technician)

#### Key Features:

**Ticket List Item**:
- Priority pill color-coded (Red: CRITICAL, Orange: HIGH, Blue: MEDIUM, Green: LOW)
- Status indicators per ticket
- Selection highlight with left border accent

**Detail View**:
- Full issue text with improved readability (1.5 line height)
- Technician assignment selector (only if unassigned & open)
- "Dispatch to Technician" button triggers:
  - `PUT /api/tickets/{id}/dispatch` with `technicianId`
  - Toast notification on success
  - Auto-reload ticket list data

**Assignment Section** (conditional):
- Shows only when ticket is OPEN and unassigned
- Dropdown pre-populated with all technicians
- Disabled state during API call
- Yellow background alert styling

#### Responsive Behavior:
- Mobile: Stacks to single column
- Tablet+: 2-column master-detail layout

---

### 5. **Technician Workbench Console** (`pages/technician/TechnicianWorkbench.jsx`)

Queue-based work management with state-machine progression.

#### Layout:
- **Top**: Notification alert for newly assigned tickets
- **Stats Row**: Open, In Progress, Total Queue counters
- **Left Panel**: Personal work queue filtered to assigned tickets
- **Right Panel**: Ticket details + action buttons

#### Key Features:

**Notification Center** (conditional):
- Shows when `newlyAssigned.length > 0`
- Bell icon + count badge
- Yellow alert styling (#FEF3C7)

**Ticket Queue**:
- Lists only tickets where `ticket.technician.id === user.id`
- Selection border highlight (blue left accent)
- Shows ticket ID, asset name, priority, and requester

**Action Buttons** (state-driven):

1. **Status === 'OPEN'**: 
   - Button: "✓ Accept & Start Work"
   - Color: Indigo (#4F46E5)
   - Action: `PUT /api/tickets/{id}/status?status=IN_PROGRESS`
   - Updates asset status to 'UNDER_MAINTENANCE'

2. **Status === 'IN_PROGRESS'**:
   - Button: "✓ Mark as Resolved"
   - Color: Emerald (#10B981)
   - Action: `PUT /api/tickets/{id}/status?status=RESOLVED`
   - Updates asset condition back to 'GOOD'

3. **Status === 'RESOLVED'**:
   - Display: Disabled state with checkmark icon
   - Removed from active queue on next refresh

#### Data Flow:
1. Technician views queue on login
2. Selects ticket to inspect
3. Clicks "Accept & Start Work" → status: OPEN → IN_PROGRESS
4. Completes resolution
5. Clicks "Mark as Resolved" → status: IN_PROGRESS → RESOLVED
6. Toast confirms completion, ticket clears from queue

---

### 6. **Employee Portal** (`pages/employee/EmployeePortal.jsx`)

Self-service ticket request system with validation.

#### Layout:
- **Top Section**: New Request Form (card)
- **Bottom Section**: My Tickets Timeline Grid (table)

#### New Request Form:

**Fields**:
1. **Asset Selection** (dropdown):
   - Pre-filtered to `assignedToUsername === currentUser.username`
   - Shows: `{assetName} ({serialNumber})`
   - Required field
   - Validation: Shows red border if empty

2. **Issue Description** (textarea):
   - Minimum 10 characters
   - 4-row textarea
   - Character counter: "X/10 (minimum)"
   - Real-time validation
   - Required field

3. **Priority** (dropdown):
   - Options: LOW, MEDIUM (default), HIGH, CRITICAL
   - Required field
   - Visual descriptions in dropdown

**Form Validation**:
```javascript
// Validation rules enforced before submission:
- Asset: Must be selected
- Description: Minimum 10 characters, validated on blur & submission
- Priority: Must be selected

// Error display:
- Red border on field
- Error message in `.invalid-feedback` div
- Toast warning if form invalid
```

**Submit Button**:
- Disabled if form invalid or no assets available
- Shows "Submitting..." during API call
- Triggers: `POST /api/tickets` with payload:
  ```json
  {
    "assetId": 123,
    "issueDescription": "Device screen is flickering...",
    "priority": "HIGH"
  }
  ```
- On success:
  - Form resets
  - Toast: "Ticket submitted successfully!"
  - Ticket list refreshes automatically

#### My Tickets Table:

**Columns**:
| Ticket ID | Asset | Priority | Status | Created |
|-----------|-------|----------|--------|---------|
| #1234 | Laptop (SN123) | Red pill | Green pill | 5/15/2024 |

**Status Badges**:
- OPEN: Yellow (#FEF3C7)
- IN_PROGRESS: Blue (#DBEAFE)
- RESOLVED: Green (#D1FAE5)

**Priority Badges**:
- CRITICAL: Red (#FEE2E2)
- HIGH: Amber (#FEF3C7)
- MEDIUM: Blue (#DBEAFE)
- LOW: Green (#D1FAE5)

**Features**:
- Sorted by most recent first
- Shows all tickets raised by current user
- Responsive table with horizontal scroll on mobile
- Empty state message if no tickets

---

### 7. **App Routing Integration** (`App.jsx`)

Updated main app component with Toast provider and new routes.

#### Routes Added:
```javascript
// Admin
/admin/tickets → <AdminTicketsDashboard />

// Technician
/technician/queue → <TechnicianWorkbench />

// Employee
/employee/ticket → <EmployeePortal />
```

#### Toast Provider Wrapper:
All routes wrapped in `<ToastProvider>` for global toast access.

---

## API Integration Map

### Endpoint Reference

#### Tickets API
| Method | Endpoint | Role | Payload | Returns |
|--------|----------|------|---------|---------|
| GET | `/api/tickets` | Admin/Tech/Employee | - | Tickets (filtered by role) |
| POST | `/api/tickets` | Employee | `{ assetId, issueDescription, priority }` | Created ticket |
| PUT | `/api/tickets/{id}/dispatch` | Admin | `{ technicianId }` | Updated ticket |
| PUT | `/api/tickets/{id}/status?status={STATUS}` | Technician | - | Updated ticket |

#### Supporting APIs
| Method | Endpoint | Returns |
|--------|----------|---------|
| GET | `/api/users/technicians` | List of technician users |
| GET | `/api/assets?size=1000&page=0&sort=id,desc` | Paginated assets |

### Request/Response Examples

#### Create Ticket
```json
POST /api/tickets
Authorization: Bearer {token}
Content-Type: application/json

{
  "assetId": 42,
  "issueDescription": "Screen is not responding to touch input",
  "priority": "HIGH"
}

// Response 200
{
  "id": 1001,
  "assetId": 42,
  "assetName": "iPad Pro",
  "issueDescription": "Screen is not responding to touch input",
  "priority": "HIGH",
  "status": "OPEN",
  "raisedByUsername": "john.doe",
  "technician": null,
  "createdAt": "2026-05-20T14:30:00Z"
}
```

#### Dispatch Ticket
```json
PUT /api/tickets/1001/dispatch
Authorization: Bearer {token}
Content-Type: application/json

{
  "technicianId": 5
}

// Response 200
{
  "id": 1001,
  ...
  "technician": {
    "id": 5,
    "username": "tech.smith",
    "email": "smith@company.com"
  },
  "status": "OPEN"
}
```

#### Update Status
```json
PUT /api/tickets/1001/status?status=IN_PROGRESS
Authorization: Bearer {token}

// Response 200
{
  "id": 1001,
  ...
  "status": "IN_PROGRESS",
  "assetStatus": "UNDER_MAINTENANCE"
}
```

---

## Data Model

### Ticket Object Structure

```javascript
{
  id: Number,                    // Unique ticket ID
  assetId: Number,              // Related asset ID
  assetName: String,            // Asset display name
  serialNumber: String,         // Asset serial
  issueDescription: String,     // Problem description
  priority: String,             // CRITICAL | HIGH | MEDIUM | LOW
  status: String,               // OPEN | IN_PROGRESS | RESOLVED
  raisedByUsername: String,     // Employee who created
  technician: {                 // Assigned tech (nullable)
    id: Number,
    username: String,
    email: String
  },
  createdAt: ISO8601Timestamp,  // Creation timestamp
  updatedAt: ISO8601Timestamp   // Last update
}
```

### Form Input Models

**Create Ticket Request**:
```javascript
{
  assetId: Number,              // Required, must be user's asset
  issueDescription: String,     // Required, min 10 chars
  priority: String              // Required, enum value
}
```

**Dispatch Request**:
```javascript
{
  technicianId: Number          // Required, valid tech ID
}
```

---

## State Management Flow

### Redux (Authentication)
```
authSlice.user
├── id: Number
├── username: String
├── email: String
├── role: 'ADMIN' | 'TECHNICIAN' | 'EMPLOYEE'
└── token: String (for Bearer auth)
```

### React Query (Tickets)
```
Query Keys:
- ['tickets']           → getAllTickets()
- ['technicians']       → getTechnicians()
- ['myAssets']          → getMyAssets()

Mutations:
- createTicket()        → invalidates ['tickets']
- dispatchTicket()      → invalidates ['tickets']
- updateTicketStatus()  → invalidates ['tickets']
```

---

## Error Handling & Validation

### Client-Side Validation

**Employee Form**:
- Asset: Required field check
- Description: Length >= 10 characters
- Priority: Required dropdown selection

**Admin Dispatch**:
- Technician: Required before submit
- Ticket status must be OPEN and unassigned

### Server Error Handling

```javascript
try {
  await mutateAsync(payload);
  addToast('Success message', 'success');
} catch (error) {
  const message = error.response?.data?.message || 'Operation failed';
  addToast(message, 'error');
}
```

### Cleanup Logic

**Hibernate Proxies**:
All API responses cleaned via `cleanData()` utility:
```javascript
// Removes: hibernateLazyInitializer, handler, etc.
const cleaned = cleanData(apiResponse);
```

---

## Styling & Theme Configuration

### Global Color Variables
```css
--color-success: #10B981;     /* Emerald for resolved/available */
--color-warning: #F59E0B;     /* Amber for in-progress */
--color-danger: #DC2626;      /* Crimson for critical */
--color-primary: #2563EB;     /* Sky blue for primary actions */
--color-border: #E5E7EB;      /* Light gray borders */
--color-text: #1F2937;        /* Slate text */
```

### Responsive Breakpoints
- Mobile: < 576px (stacked layout)
- Tablet: 576px - 768px (adjusted 2-col)
- Desktop: > 768px (full 2-col master-detail)

---

## Usage & Testing

### Starting the App

```bash
cd frontend
npm install
npm run dev
```

### Testing Flows

#### Admin Workflow
1. Login as admin
2. Navigate to `/admin/tickets`
3. View all system tickets in left pane
4. Click ticket to view details
5. If OPEN and unassigned, select technician and dispatch
6. Verify toast notification appears
7. Ticket list refreshes automatically

#### Technician Workflow
1. Login as technician
2. Navigate to `/technician/queue`
3. View newly assigned tickets (notification alert)
4. Select ticket from queue
5. Click "Accept & Start Work" → status becomes IN_PROGRESS
6. After resolution, click "Mark as Resolved"
7. Verify toast and removal from queue

#### Employee Workflow
1. Login as employee
2. Navigate to `/employee/ticket`
3. Select assigned asset from dropdown
4. Enter issue description (validate 10+ chars)
5. Select priority level
6. Click "Submit Request"
7. Verify ticket appears in "My Requests" table
8. Check status updates as technician progresses

---

## Future Enhancements

1. **Ticket Assignment History**: Track all assignments/status changes
2. **Search & Filter**: Advanced filtering in admin list view
3. **Bulk Actions**: Dispatch multiple tickets at once
4. **Comments/Notes**: Add technician notes to tickets
5. **File Attachments**: Upload images/documents
6. **SLA Tracking**: Show time-to-resolve metrics
7. **Technician Performance**: Analytics dashboard
8. **Email Notifications**: Alert users on status changes
9. **Mobile App**: React Native version for technicians
10. **Export Reports**: CSV/PDF ticket exports

---

## Troubleshooting

### Common Issues

**1. Bearer Token Not Sent**
- Verify token in localStorage at key `eams_user`
- Check `api.js` interceptor is properly configured
- Clear localStorage and re-login if corrupted

**2. Technicians Dropdown Empty**
- Verify backend endpoint `/api/users/technicians` exists
- Check response contains proper technician objects
- Inspect network tab for 404/500 errors

**3. Tickets Not Loading**
- Check `/api/tickets` returns array of objects
- Verify `cleanData()` removes problematic properties
- Look for console errors in browser DevTools

**4. Form Validation Not Triggering**
- Check description character count logic in EmployeePortal
- Verify error state updates on field changes
- Inspect red border CSS classes

**5. Toast Notifications Not Appearing**
- Verify `<ToastProvider>` wraps entire app in App.jsx
- Check `useToast()` hook called inside ToastProvider scope
- Verify no CSS z-index conflicts (toast has z-index: 9999)

---

## Code Examples

### Using Ticket Queries in Components

```javascript
import { useTickets, useDispatchTicket } from '../../services/useTicketQueries';
import { useToast } from '../../components/Toast';

function MyComponent() {
  const { data: tickets, isLoading } = useTickets();
  const dispatchMutation = useDispatchTicket();
  const { addToast } = useToast();

  const handleDispatch = async (ticketId, technicianId) => {
    try {
      await dispatchMutation.mutateAsync({
        ticketId,
        technicianId
      });
      addToast('Ticket dispatched!', 'success');
    } catch (error) {
      addToast('Failed to dispatch', 'error');
    }
  };

  return (
    // ...component JSX
  );
}
```

### Custom Hook Pattern

```javascript
// Creating a derived state from query
const filteredTickets = useMemo(() => {
  return Array.isArray(tickets)
    ? tickets.filter(t => t.status === 'OPEN')
    : [];
}, [tickets]);
```

---

## Summary of Changes

### Files Created
1. ✅ `services/ticketService.js` - API layer
2. ✅ `services/useTicketQueries.js` - React Query hooks
3. ✅ `components/Toast.jsx` - Notification system
4. ✅ `pages/admin/AdminTicketsDashboard.jsx` - Admin module
5. ✅ `pages/technician/TechnicianWorkbench.jsx` - Tech module
6. ✅ `pages/employee/EmployeePortal.jsx` - Employee module

### Files Modified
1. ✅ `App.jsx` - Added ToastProvider, new routes, imports

### Files Unchanged
- `services/api.js` - Already had interceptors
- `store/authSlice.js` - Already configured correctly
- All existing pages remain functional

---

**Version**: 1.0.0  
**Last Updated**: May 20, 2026  
**Status**: Production Ready
