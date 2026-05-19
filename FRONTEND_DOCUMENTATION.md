# Enterprise Asset Management System - Frontend Documentation

This document provides a comprehensive overview of the frontend architecture for the Enterprise Asset Management System (EAMS). It outlines the core execution flow, how state is managed, and how security (authentication & Role-Based Access Control) is strictly enforced.

## 1. Technology Stack
- **Framework**: React 18+ (Vite)
- **Routing**: React Router DOM (v6)
- **Global State**: Redux Toolkit (RTK) & `react-redux`
- **Server State / Caching**: TanStack React Query
- **Styling**: Vanilla CSS (`index.css`), Bootstrap v5 Grid/Utilities, Custom Microsoft Fluent UI Design rules.
- **Icons**: Lucide React

---

## 2. Initialization Flow: What Happens When the Website Opens?

When a user navigates to the application URL, the browser executes the frontend sequentially:

1. **`index.html`**: The root HTML file served to the client. It contains a single `<div id="root"></div>` and loads the main JavaScript file.
2. **`src/main.jsx`**: This is the absolute starting point of the React lifecycle. 
   - It mounts the React application to the DOM.
   - **Crucially, it wraps the entire app in security and data providers:**
     - `<Provider store={store}>`: Injects the global Redux store into the application.
     - `<QueryClientProvider client={queryClient}>`: Injects the React Query engine for data fetching.
3. **`src/App.jsx`**: The central routing hub. It reads the current URL from the browser and determines which component tree to render.

---

## 3. How Authentication is Validated (Is the User Logged In?)

Authentication state is not validated blindly. The application relies on a single source of truth managed by **Redux Toolkit** inside `src/store/authSlice.js`.

### The Validation Mechanism:
When the application first loads, the Redux store initializes. 
1. **Initial Boot**: The `authSlice` immediately checks the browser's `localStorage` for a saved session token key (`eams_user`).
2. **Hydration**: 
   - If the key **exists**, Redux parses it, automatically hydrating the global state: `user: { profile }, isAuthenticated: true`.
   - If the key **does not exist**, the state defaults to: `user: null, isAuthenticated: false`.
3. **The Login Portal**: If an unauthenticated user attempts to visit the site, they are trapped by the routing rules and forced to `/login`. Upon successful sign-in, an action (`loginSuccess`) is dispatched to Redux, which updates the UI and saves the new profile back to `localStorage` for future visits.

---

## 4. Role-Based Access Control (RBAC) Architecture

Security at the page level is managed by a custom interceptor component: **`src/components/ProtectedRoute.jsx`**.

Instead of writing security checks on every single page, we use a concept called **Route Wrapping**. Inside `App.jsx`, entire branches of the application are wrapped securely:

```jsx
<Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
  <Route path="/admin/dashboard" element={<AdminDashboard />} />
</Route>
```

### The Three-Step RBAC Check inside `ProtectedRoute.jsx`:

Whenever a user requests a URL wrapped inside this component, it intercepts the request and performs three strict checks against the Redux store:

1. **Is the App still loading?** 
   - *(If Redux is still parsing local storage, show a loading spinner).*
2. **Is the User Authenticated?** 
   - It checks `isAuthenticated`. If `false`, the component halts rendering and forcefully redirects the user back to `/login` using the `<Navigate />` component.
3. **Does the User possess the correct Role?**
   - It compares the logged-in user's `role` against the `allowedRoles` array passed into the route (e.g., `['ADMIN']`).
   - If the user is an `EMPLOYEE` trying to access an `ADMIN` route, the validation **fails**. The component will gracefully bounce the user back to their designated safe zone (e.g., `/employee/dashboard`).

---

## 5. Layout and Navigation Rendering

Once the `ProtectedRoute` approves the user, it renders the next component in the chain: **`src/components/SidebarLayout.jsx`**.

This component is responsible for the surrounding User Interface (the sidebar and the top header). It actively listens to the Redux `user` object to dynamically build itself:
- **Dynamic Headers**: The top right header displays the user's name and role badge based strictly on their Redux profile.
- **Dynamic Navigation**: The sidebar links are mapped conditionally. An `ADMIN` sees links for *Inventory* and *Reports*, whereas a `TECHNICIAN` will only see their *Work Queue*.

The final target page (e.g., `AdminDashboard.jsx`) is then rendered inside the white workspace cavity via the React Router `<Outlet />` element.

---

## 6. Summary of Component Hierarchy
```text
<main.jsx> (Injects Redux & React Query)
  └── <App.jsx> (Reads URL path)
        ├── Route: "/login" -> <Login.jsx>
        └── Route: "/admin/dashboard" 
             └── <ProtectedRoute> (Verifies 'ADMIN' role + Authentication)
                  └── <SidebarLayout> (Renders Left Sidebar & Top Header)
                       └── <Outlet> (Injects final page into workspace)
                            └── <AdminDashboard> (Renders the UI)
```
