Welcome to your new TanStack app!

# Getting Started

To run this application:

```bash
npm install
npm run start
```

# Requirements

1. User Management Dashboard
   API: JSONPlaceholder - Users
   Task Description:
   Build a User Management Dashboard where users are listed in a table. The page should include:
   A table displaying user data (name, email, company.name, address.city).
   A button to delete a user (optimistically remove from UI, no API call).
   A search input to filter users by name or email. (extra!) <- this one is extra points
   Tech Requirements:
   Use ShadCN components for UI elements like table, modal, input, and button.
   Fetch data using React Query (@tanstack/react-query) or something similar.
   Use Zustand or React Context for state management.
