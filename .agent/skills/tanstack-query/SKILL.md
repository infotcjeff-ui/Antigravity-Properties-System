---
name: TanStack Query Best Practices
description: Guidelines and patterns for implementing TanStack Query (React Query) for data fetching, caching, and state management in React applications
---

# TanStack Query Best Practices

This skill provides comprehensive guidelines for implementing TanStack Query in your React application for optimal performance, consistent caching, and better user experience.

## Overview

TanStack Query (formerly React Query) is a powerful data-fetching and state management library that provides:
- **Automatic caching** - Data persists across navigations
- **Background refetching** - Keeps data fresh automatically
- **Request deduplication** - Multiple components share the same query
- **Optimistic updates** - Instant UI feedback on mutations

## Core Principles

### 1. Always Use Query Hooks for Data Fetching

**❌ Bad - Using useEffect:**
```tsx
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
    async function loadData() {
        setLoading(true);
        const result = await fetchData();
        setData(result);
        setLoading(false);
    }
    loadData();
}, []);
```

**✅ Good - Using TanStack Query:**
```tsx
const { data, isLoading } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
    staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### 2. Create Reusable Query Hooks

Centralize your query hooks in a dedicated file (e.g., `useStorage.ts`):

```tsx
// In useStorage.ts
export function usePropertiesQuery() {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['properties', user?.id],
        queryFn: () => fetchProperties(user),
        staleTime: 5 * 60 * 1000,
    });
}

// In your component
const { data: properties, isLoading } = usePropertiesQuery();
```

### 3. Use Query Keys Effectively

Query keys should be arrays that uniquely identify the data:

```tsx
// Simple key
queryKey: ['properties']

// With user context
queryKey: ['properties', user?.id]

// With filters
queryKey: ['properties', { status: 'active', type: 'residential' }]
```

### 4. Implement Cache Invalidation

Use `queryClient.invalidateQueries()` after mutations:

```tsx
const queryClient = useQueryClient();

const handleDelete = async (id: string) => {
    await deleteProperty(id);
    // Invalidate to trigger refetch
    queryClient.invalidateQueries({ queryKey: ['properties'] });
};

const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['properties'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
};
```

### 5. Client-Side Filtering with useMemo

For instant search/filter feedback, use client-side filtering:

```tsx
const { data: allProperties, isLoading } = usePropertiesQuery();
const [searchQuery, setSearchQuery] = useState('');

const filteredProperties = useMemo(() => {
    if (!allProperties) return [];
    if (!searchQuery) return allProperties;
    
    const query = searchQuery.toLowerCase();
    return allProperties.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.code.toLowerCase().includes(query)
    );
}, [allProperties, searchQuery]);
```

## Implementation Patterns

### Pattern 1: List Page with Search

```tsx
export default function PropertiesPage() {
    const queryClient = useQueryClient();
    const { data: propertiesData, isLoading } = usePropertiesQuery();
    const { deleteProperty } = useProperties();
    
    const [searchQuery, setSearchQuery] = useState('');
    
    const filteredProperties = useMemo(() => {
        const properties = propertiesData || [];
        if (!searchQuery) return properties;
        
        const query = searchQuery.toLowerCase();
        return properties.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.code.toLowerCase().includes(query)
        );
    }, [propertiesData, searchQuery]);

    const handleDelete = async (id: string) => {
        await deleteProperty(id);
        queryClient.invalidateQueries({ queryKey: ['properties'] });
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div>
            <SearchInput value={searchQuery} onChange={setSearchQuery} />
            <PropertyList properties={filteredProperties} onDelete={handleDelete} />
        </div>
    );
}
```

### Pattern 2: Dashboard with Aggregated Stats

```tsx
// Create optimized fetcher with server-side aggregations
export const fetchDashboardStats = async () => {
    const [
        { count: totalProperties },
        { count: totalUsers },
        { data: recentActivity }
    ] = await Promise.all([
        supabase.from('properties').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('activity').select('*').order('created_at', { ascending: false }).limit(10)
    ]);

    return {
        totalProperties: totalProperties || 0,
        totalUsers: totalUsers || 0,
        recentActivity: recentActivity || []
    };
};

// Create query hook
export function useDashboardStatsQuery() {
    return useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: fetchDashboardStats,
        staleTime: 30 * 1000, // 30 seconds
    });
}

// Use in component
const { data: stats, isLoading } = useDashboardStatsQuery();
```

### Pattern 3: Form with Mutation

```tsx
export default function PropertyForm({ propertyId, onSuccess }: Props) {
    const queryClient = useQueryClient();
    const { updateProperty, createProperty } = useProperties();

    const handleSubmit = async (data: PropertyFormData) => {
        if (propertyId) {
            await updateProperty(propertyId, data);
        } else {
            await createProperty(data);
        }
        
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ['properties'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        
        onSuccess();
    };

    return <Form onSubmit={handleSubmit} />;
}
```

## Configuration Best Practices

### Stale Time Guidelines

- **Dashboard stats**: 30 seconds - Frequently changing data
- **List data**: 5 minutes - Relatively stable data
- **Reference data**: 10 minutes - Rarely changing data
- **User profile**: 1 minute - May change during session

```tsx
export function usePropertiesQuery() {
    return useQuery({
        queryKey: ['properties'],
        queryFn: fetchProperties,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
```

### Query Client Setup

```tsx
// In your app setup
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes default
            refetchOnWindowFocus: true,
            retry: 1,
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <YourApp />
        </QueryClientProvider>
    );
}
```

## Common Pitfalls to Avoid

### ❌ Don't Mix useEffect with TanStack Query

```tsx
// BAD
const { data } = useQuery({ queryKey: ['data'], queryFn: fetchData });
useEffect(() => {
    // Don't do additional fetching here
}, []);
```

### ❌ Don't Manually Refetch

```tsx
// BAD
const { data, refetch } = useQuery(...);
const handleSuccess = () => {
    refetch(); // Don't do this
};

// GOOD
const queryClient = useQueryClient();
const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['data'] });
};
```

### ❌ Don't Forget to Handle Loading States

```tsx
// BAD
const { data } = useQuery(...);
return <div>{data.map(...)}</div>; // Will crash if data is undefined

// GOOD
const { data, isLoading } = useQuery(...);
if (isLoading) return <LoadingSpinner />;
return <div>{data.map(...)}</div>;
```

## Migration Checklist

When converting a page to use TanStack Query:

- [ ] Replace `useEffect` with `useQuery`
- [ ] Create reusable query hook in `useStorage.ts`
- [ ] Use `isLoading` instead of manual loading state
- [ ] Implement `queryClient.invalidateQueries()` for mutations
- [ ] Add client-side filtering with `useMemo`
- [ ] Remove manual state management (`useState` for data)
- [ ] Configure appropriate `staleTime`
- [ ] Test loading states and error handling

## Performance Benefits

After implementing TanStack Query across the application:

- **Dashboard**: 30s+ timeout → ~2s load
- **List pages**: 5-10s → Instant (cached)
- **Navigation**: Slow → Instant (cached data)
- **Memory usage**: Reduced (no duplicate data)
- **Network requests**: Reduced (automatic deduplication)

## Resources

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Query Best Practices](https://tkdodo.eu/blog/practical-react-query)
- Project examples: See `src/app/(admin)/dashboard/` pages
