import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import KappaOceanDashboard from './clickui/main.ui.tsx'
import DocsPage from './clickui/docs'

// 创建一个包装组件来处理路由动画
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<KappaOceanDashboard />} />
        <Route path="/docs" element={<DocsPage />} />
      </Routes>
    </AnimatePresence>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  </StrictMode>,
)