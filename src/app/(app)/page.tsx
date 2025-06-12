// This file is intentionally made to render null.
// It is created to resolve a potential conflict where Next.js might find
// a page definition at the root of the '(app)' route group
// conflicting with the global 'src/app/page.tsx', as both would
// try to resolve to the '/' path.
// Making this file render null allows any layout within the (app) group
// to function without this page.tsx interfering with the root route.

export default function AppRootPlaceholderPage() {
  return null;
}
