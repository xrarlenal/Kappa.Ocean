// KappaOceanDashboard.tsx
import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { backgroundGradient } from './sharedStyles';

// ========== 动画定义 ==========
const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const pulse = keyframes`
  0% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.02);
  }
  100% {
    opacity: 0.4;
    transform: scale(1);
  }
`;

const rotateSlow = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// ========== 样式组件 ==========
// main.ui.tsx - 修改 Container 部分

const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: 'Inter', 'Segoe UI', 'Poppins', 'Microsoft YaHei', sans-serif;
  color: white;
  background: ${backgroundGradient};  // 👈 使用共享变量
`;


// 装饰性背景光晕
const BackgroundGlow = styled.div`
  position: absolute;
  top: -20%;
  left: -20%;
  width: 140%;
  height: 140%;
  background: radial-gradient(circle at 30% 40%, rgba(0, 100, 200, 0.15), rgba(0, 20, 60, 0) 60%);
  animation: ${rotateSlow} 30s linear infinite;
  z-index: 0;
`;

const BackgroundGlowSecond = styled.div`
  position: absolute;
  bottom: -30%;
  right: -20%;
  width: 120%;
  height: 120%;
  background: radial-gradient(circle at 70% 80%, rgba(0, 200, 180, 0.1), rgba(0, 40, 60, 0) 60%);
  animation: ${rotateSlow} 25s linear infinite reverse;
  z-index: 0;
`;

// 毛玻璃覆盖层 - 增强玻璃质感
const GlassOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(1px);
  z-index: 1;
  pointer-events: none;
`;

// 主要内容区域
const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 2rem 2.5rem;
  pointer-events: auto;
`;


const Logo = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
  font-weight: 700;
  font-size: 1.4rem;
  letter-spacing: 2px;
  
  .kappa {
    background: linear-gradient(135deg, #ffffff, #7bc5ff, #4a9eff);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-weight: 800;
  }
  
  .badge {
    font-size: 0.7rem;
    font-weight: 400;
    background: rgba(255, 255, 255, 0.15);
    padding: 0.2rem 0.6rem;
    border-radius: 20px;
    color: rgba(255, 255, 255, 0.8);
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  
  a {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    font-weight: 500;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    cursor: pointer;
    
    &:hover {
      color: white;
      text-shadow: 0 0 8px rgba(100, 150, 255, 0.5);
    }
  }
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.4rem 1.2rem;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(8px);
  border-radius: 40px;
  border: 1px solid rgba(72, 187, 255, 0.3);
  font-size: 0.8rem;
  
  .dot {
    width: 8px;
    height: 8px;
    background-color: #2eff9e;
    border-radius: 50%;
    box-shadow: 0 0 6px #2eff9e;
    animation: ${pulse} 2s infinite;
  }
  
  .status-text {
    font-weight: 500;
  }
`;

// 主标题区域
const HeroSection = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const MainTitle = styled.h1`
  font-size: 5.5rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: 6px;
  background: linear-gradient(135deg, #ffffff, #7bc5ff, #3d7eff, #1a3f8f, #7bc5ff);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: ${shimmer} 8s ease infinite;
  text-shadow: 0 0 40px rgba(59, 130, 246, 0.2);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    letter-spacing: 3px;
  }
`;

const SubtitleWrapper = styled.div`
  margin-top: 1rem;
  backdrop-filter: blur(12px);
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.85;
  letter-spacing: 2px;
  background: rgba(255, 255, 255, 0.08);
  padding: 0.6rem 1.8rem;
  border-radius: 40px;
  display: inline-block;
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-weight: 400;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.4rem 1.2rem;
  }
`;

const TechBadge = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  
  span {
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(12px);
    padding: 0.4rem 1.2rem;
    border-radius: 40px;
    font-size: 0.75rem;
    font-weight: 500;
    border: 1px solid rgba(255, 255, 255, 0.15);
    letter-spacing: 0.8px;
    color: rgba(255, 255, 255, 0.8);
  }
`;

// 底部数据面板 - 毛玻璃卡片网格
const StatsPanel = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.2rem;
  background: rgba(10, 20, 40, 0.35);
  backdrop-filter: blur(20px);
  border-radius: 28px;
  width: 100%;
  padding: 0.2rem 1.8rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  margin-top: auto;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    padding: 1rem;
  }
`;

const NavBarMotion = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 2rem;
  background: rgba(15, 25, 50, 0.3);
  backdrop-filter: blur(16px);
  border-radius: 32px;
  width: 50%;
  margin: 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: ${float} 4s ease-in-out infinite;
`;


const StatCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.5rem;
  transition: all 0.3s ease;
  border-radius: 20px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.06);
    transform: translateY(-3px);
  }
  
  .label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    opacity: 0.55;
    font-weight: 500;
  }
  
  .value {
    font-size: 1.6rem;
    font-weight: 700;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    background: linear-gradient(135deg, #fff, #a8d4ff);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    
    @media (max-width: 768px) {
      font-size: 1.2rem;
    }
  }
  
  .unit {
    font-size: 0.7rem;
    opacity: 0.5;
    margin-left: 4px;
    font-weight: 400;
  }
`;

// 底部装饰水印
const Watermark = styled.div`
  position: absolute;
  bottom: 16px;
  right: 24px;
  z-index: 3;
  font-size: 0.7rem;
  opacity: 0.3;
  letter-spacing: 1px;
  pointer-events: none;
  backdrop-filter: blur(4px);
`;

// ========== 主组件 ==========
const KappaOceanDashboard: React.FC = () => {
  const navigate = useNavigate();
  // 模拟实时数据
  const [stats] = React.useState({
    fps: 0,
    resolution: 'null',
    gpuMemory: 'null / NULL',
  });

  return (
    <Container>
      <BackgroundGlow />
      <BackgroundGlowSecond />
      <GlassOverlay />
      
      <ContentWrapper>
        {/* 导航栏 - 向上滑出/滑入 */}
        <NavBarMotion
          initial={{ y: 0 }}
          animate={{ y: 0 }}
          exit={{ y: -200 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <Logo>
            <span className="kappa">KAPPA</span>
            <span className="badge">β</span>
          </Logo>
          <NavLinks>
            <a>海洋场景</a>
            <a>渲染设置</a>
            <a>性能分析</a>
            <a onClick={() => navigate('/docs')}>文档</a>
          </NavLinks>
          <StatusBadge>
            <div className="dot" />
            <span className="status-text">WebGPU · 实时渲染</span>
          </StatusBadge>
        </NavBarMotion>

        {/* 主标题区 - 渐隐渐显 */}
        <HeroSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <MainTitle>KAPPA 海洋渲染</MainTitle>
          <SubtitleWrapper>
            <Subtitle>WebGPU 驱动的次世代海洋水体渲染引擎</Subtitle>
          </SubtitleWrapper>
          <TechBadge>
            <span>WebGPU</span>
            <span>WGSL</span>
            <span>Compute Shader</span>
            <span>实时流体模拟</span>
            <span>光谱波浪</span>
          </TechBadge>
        </HeroSection>

        {/* 底部数据面板 - 向下滑出/滑入 */}
        <StatsPanel
          initial={{ y: 0 }}
          animate={{ y: 0 }}
          exit={{ y: 200 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <StatCard>
            <div className="label">实时帧率</div>
            <div className="value">{stats.fps}<span className="unit">FPS</span></div>
          </StatCard>
          <StatCard>
            <div className="label">渲染分辨率</div>
            <div className="value">{stats.resolution}</div>
          </StatCard>
          <StatCard>
            <div className="label">GPU 显存占用</div>
            <div className="value">{stats.gpuMemory}<span className="unit">GB</span></div>
          </StatCard>
        </StatsPanel>
      </ContentWrapper>
      
      <Watermark>KAPPA OCEAN RENDERER | WEBGPU POWERED</Watermark>
    </Container>
  );
};

export default KappaOceanDashboard;