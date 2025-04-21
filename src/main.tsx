import { createRoot } from 'react-dom/client'
import { lazy, Suspense } from 'react'
import './index.css'

const App = lazy(() => import('./App.tsx'))

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center">در حال بارگذاری...</div>}>
    <App />
  </Suspense>
);
