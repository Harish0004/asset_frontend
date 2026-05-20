# Ticketing Module - Quick Reference Guide

## 🚀 Quick Start

### Installation
```bash
cd frontend
npm install  # Already includes all dependencies
npm run dev  # Start dev server on http://localhost:5173
```

### Key Files Location
```
frontend/
├── src/services/ticketService.js        ← API calls
├── src/services/useTicketQueries.js     ← React Query hooks
├── src/components/Toast.jsx             ← Notifications
├── src/pages/admin/AdminTicketsDashboard.jsx
├── src/pages/technician/TechnicianWorkbench.jsx
└── src/pages/employee/EmployeePortal.jsx
```

---

## 📊 Component Quick Map

### Admin (`/admin/tickets`)
```
┌─────────────────────┬──────────────────────┐
│  Ticket List        │  Ticket Details      │
│  (All tickets)      │  + Dispatch Control  │
│  Left 60%           │  Right 40%           │
└─────────────────────┴──────────────────────┘
```
- Master-Detail layout
- All tickets globally visible
- Dispatch to technicians dropdown
- Status & priority pills

### Technician (`/technician/queue`)
```
┌────────────────────┬────────────────────┐
│  Work Queue        │  Ticket Details    │
│  (My assignments)  │  + Action Buttons  │
│  Left 50%          │  Right 50%         │
├────────────────────┴────────────────────┤
│  Notification Alert (New assignments)   │
│  Stats: Open / In Progress / Total      │
└─────────────────────────────────────────┘
```
- Accept & Start Work (OPEN → IN_PROGRESS)
- Mark as Resolved (IN_PROGRESS → RESOLVED)
- Only sees own tickets

### Employee (`/employee/ticket`)
```
┌──────────────────────────────────────────┐
│  Submit New Request Form                 │
│  - Asset selector (user's assets only)   │
│  - Description (min 10 chars)            │
│  - Priority dropdown                     │
├──────────────────────────────────────────┤
│  My Support Requests (Table)             │
│  Status: Open/In Progress/Resolved       │
└──────────────────────────────────────────┘
```
- Create tickets only for own assets
- View ticket history & status
- Form validation enforced

---

## 🎨 Color Coding Guide

### Status Badges
| Status | Color | Hex | Background |
|--------|-------|-----|------------|
| OPEN | Amber | #D97706 | #FEF3C7 |
| IN_PROGRESS | Blue | #2563EB | #DBEAFE |
| RESOLVED | Green | #059669 | #D1FAE5 |

### Priority Badges
| Priority | Color | Hex | Background |
|----------|-------|-----|------------|
| CRITICAL | Red | #DC2626 | #FEE2E2 |
| HIGH | Amber | #D97706 | #FEF3C7 |
| MEDIUM | Blue | #2563EB | #DBEAFE |
| LOW | Green | #059669 | #D1FAE5 |

### Toast Notifications
| Type | Icon | Color |
|------|------|-------|
| success | ✓ | #10B981 |
| error | ✗ | #DC2626 |
| warning | ⚠ | #F59E0B |
| info | ℹ | #3B82F6 |

---

## 🔗 API Endpoints Reference

### Read
```
GET /api/tickets               ← Fetch all tickets
GET /api/users/technicians     ← Fetch technician list
GET /api/assets?size=1000      ← Fetch assets
```

### Write
```
POST /api/tickets              ← Create ticket
PUT /api/tickets/{id}/dispatch ← Assign to tech
PUT /api/tickets/{id}/status?status={VALUE} ← Update status
```

### Status Values
- `IN_PROGRESS` - Technician accepts ticket
- `RESOLVED` - Technician completes work

---

## 💻 Common Code Snippets

### Fetch Tickets in Component
```javascript
import { useTickets } from '../../services/useTicketQueries';

const { data: tickets = [], isLoading } = useTickets();
// tickets = [{ id, assetName, priority, status, ... }]
```

### Show Toast Notification
```javascript
import { useToast } from '../components/Toast';

const { addToast } = useToast();
addToast('Operation successful!', 'success');
addToast('Something went wrong', 'error');
```

### Handle Mutation
```javascript
import { useCreateTicket } from '../../services/useTicketQueries';

const mutation = useCreateTicket();

const handleSubmit = async () => {
  try {
    await mutation.mutateAsync({
      assetId: 42,
      issueDescription: "Problem description",
      priority: "HIGH"
    });
    addToast('Ticket created!', 'success');
  } catch (error) {
    addToast(error.response?.data?.message, 'error');
  }
};
```

### Conditional Rendering by Status
```javascript
{selectedTicket.status === 'OPEN' && (
  <button onClick={handleAccept}>Accept</button>
)}

{selectedTicket.status === 'IN_PROGRESS' && (
  <button onClick={handleResolve}>Resolve</button>
)}

{selectedTicket.status === 'RESOLVED' && (
  <span>✓ Completed</span>
)}
```

---

## 🐛 Debug Checklist

- [ ] Is user logged in? Check localStorage `eams_user`
- [ ] Bearer token valid? Check network tab Authorization header
- [ ] User role correct? Check Redux state `auth.user.role`
- [ ] API endpoints accessible? Check `/api` base URL in `api.js`
- [ ] React Query cache valid? Check browser DevTools React Query
- [ ] Toast provider present? Wrap app in `<ToastProvider>`
- [ ] Technicians loading? Check `/api/users/technicians` endpoint
- [ ] Form validation working? Check console for errors

---

## 📱 Responsive Design

### Mobile First
- **< 576px**: Stacked single column
- **576-768px**: Adjusted 2-column with smaller gaps
- **> 768px**: Full master-detail side-by-side

### Testing Responsive
```javascript
// In browser DevTools
// Toggle Device Toolbar (Ctrl+Shift+M)
// Test at iPhone SE, iPad, Desktop
```

---

## ✅ Testing Workflows

### Admin Test Flow
1. Login as admin
2. Go to `/admin/tickets`
3. Verify ticket list loads (left pane)
4. Click ticket → verify details display (right pane)
5. If status OPEN & no tech: select tech from dropdown
6. Click "Dispatch" → verify toast & refresh
7. Verify technician now shows in detail view

### Technician Test Flow
1. Login as technician
2. Go to `/technician/queue`
3. Verify notification alert if new assignments
4. Verify stats counters accurate
5. Click ticket → details display
6. If status OPEN: click "Accept & Start Work"
7. Verify status changes to IN_PROGRESS
8. Click "Mark as Resolved"
9. Verify toast & ticket removed from queue

### Employee Test Flow
1. Login as employee
2. Go to `/employee/ticket`
3. Verify asset dropdown only shows own assets
4. Enter description < 10 chars → verify red border
5. Select asset, enter >10 chars, set priority
6. Click Submit → verify toast & form reset
7. Verify ticket appears in table
8. Refresh → verify ticket persists in list

---

## 🔒 Security Notes

### Bearer Token
- Automatically injected by `api.js` interceptor
- Stored in localStorage under `eams_user`
- Included in all API requests

### Role-Based Access
- Admin: See all tickets, dispatch to tech
- Technician: See own assignments, update status
- Employee: Create tickets for own assets, view own tickets

### Data Cleaning
- All API responses cleaned via `cleanData()` function
- Removes Hibernate proxy properties automatically
- Prevents console errors from lazy-loaded entities

---

## 📈 Performance Tips

1. **Stale Time**: Set appropriate cache durations
   - Tickets: 5 minutes
   - Technicians: 10 minutes
   - Assets: 5 minutes

2. **React Query Devtools** (optional install):
   ```bash
   npm install @tanstack/react-query-devtools
   ```

3. **Memoization**: Use `useMemo` for filtered data:
   ```javascript
   const myTickets = useMemo(() => {
     return tickets.filter(t => t.userId === user.id);
   }, [tickets, user.id]);
   ```

---

## 🚨 Known Limitations

1. **Real-time Updates**: Requires page refresh or manual refetch
2. **Optimistic Updates**: Not implemented (could be added)
3. **Offline Support**: Not available (requires service worker)
4. **File Upload**: Not implemented for ticket attachments
5. **Comments**: Ticket notes/comments not in current design

---

## 📚 Additional Resources

- **React Query Docs**: https://tanstack.com/query/latest
- **Bootstrap Docs**: https://getbootstrap.com/docs/5.3/
- **Axios Docs**: https://axios-http.com/docs/intro
- **Lucide Icons**: https://lucide.dev/icons

---

## 🤝 Contributing

When adding new features:

1. Follow existing component structure
2. Use React Query for data fetching
3. Add toast notifications for user feedback
4. Test across mobile/tablet/desktop
5. Update this README with changes
6. Follow Fluent UI design principles

---

**Last Updated**: May 20, 2026  
**Module Version**: 1.0.0
