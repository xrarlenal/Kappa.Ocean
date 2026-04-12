// docs.tsx - 简化版本，移除收起/展开功能
import React, { useEffect, useRef } from 'react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

/** 缓慢「呼吸」：错开周期，避免机械感 */
const breatheGlow = keyframes`
  0%, 100% {
    opacity: 0.52;
    transform: translateX(-50%) scale(1);
  }
  50% {
    opacity: 0.88;
    transform: translateX(-50%) scale(1.06);
  }
`;

const breatheGlowAlt = keyframes`
  0%, 100% {
    opacity: 0.38;
    transform: translate(0, 0) scale(1);
  }
  50% {
    opacity: 0.72;
    transform: translate(-2%, 3%) scale(1.08);
  }
`;

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  /* 深色锚点，与原先线性渐变末端同系 */
  background-color: #060913;
  color: white;
  font-family: 'Inter', 'Segoe UI', 'Poppins', sans-serif;
  overflow-x: hidden;
  position: relative;
`;

/**
 * 静态环境层：多径向 + 斜向线性叠加，过渡更柔和、有纵深（整体色相不变）
 */
const AmbientBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 110% 75% at 92% 8%, rgba(55, 90, 160, 0.2) 0%, transparent 58%),
    radial-gradient(ellipse 90% 85% at 6% 92%, rgba(6, 18, 42, 0.55) 0%, transparent 52%),
    radial-gradient(ellipse 65% 55% at 48% 48%, rgba(18, 40, 88, 0.28) 0%, transparent 62%),
    linear-gradient(
      168deg,
      #0a0e27 0%,
      #0b1029 16%,
      #0d1434 34%,
      #0e1638 52%,
      #0a152f 72%,
      #07102e 100%
    );
`;

/** 顶部柔光：随呼吸轻微胀缩 */
const PageTopGlow = styled.div`
  position: fixed;
  top: -12rem;
  left: 50%;
  width: min(100vw, 56rem);
  height: 24rem;
  background: radial-gradient(
    ellipse 80% 60% at 50% 40%,
    rgba(56, 189, 248, 0.26) 0%,
    rgba(37, 99, 235, 0.1) 48%,
    transparent 72%
  );
  filter: blur(48px);
  pointer-events: none;
  z-index: 0;
  animation: ${breatheGlow} 18s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transform: translateX(-50%);
  }
`;

/** 右下平衡光斑，与顶部错相，增加空间感 */
const CornerBloom = styled.div`
  position: fixed;
  right: -15%;
  bottom: -18%;
  width: min(90vw, 42rem);
  height: min(55vh, 28rem);
  background: radial-gradient(
    ellipse 70% 65% at 50% 50%,
    rgba(30, 64, 130, 0.22) 0%,
    rgba(15, 40, 85, 0.08) 45%,
    transparent 68%
  );
  filter: blur(56px);
  pointer-events: none;
  z-index: 0;
  animation: ${breatheGlowAlt} 24s ease-in-out infinite;
  animation-delay: -9s;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// 左侧目录 - 固定显示，无收起功能
const Sidebar = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  width: 280px;
  height: 100vh;
  background: rgba(10, 20, 40, 0.5);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem 1rem;
  z-index: 10;
  overflow-y: auto;  // 目录自身可滚动
  
  // 自定义滚动条样式
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(100, 150, 255, 0.4);
    border-radius: 4px;
    
    &:hover {
      background: rgba(100, 150, 255, 0.6);
    }
  }
`;


const SidebarTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  color: #f1f5f9;
  letter-spacing: -0.02em;
`;

const SidebarItem = styled.div`
  padding: 0.75rem 1rem;
  margin: 0.25rem 0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
  }
`;

// 主要内容区域 - 左侧留出目录宽度
const ContentWrapper = styled(motion.main)`
  position: relative;
  z-index: 2;
  max-width: calc(100% - 280px);  // 改为自适应宽度，减去左侧目录宽度
  margin-left: 280px;
  padding: 2.5rem 2rem;
  height: 100vh;
  overflow-y: auto;
  
  // 内部内容容器，限制最大宽度保持可读性
  .content-inner {
    max-width: 900px;
    margin: 0 auto;
  }
  
  // 自定义滚动条样式
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(100, 150, 255, 0.4);
    border-radius: 4px;
    
    &:hover {
      background: rgba(100, 150, 255, 0.6);
    }
  }
`;
const ScrollProgress = styled.div<{ scrollProgress: number }>`
  position: fixed;
  top: 0;
  right: 0;
  width: ${props => props.scrollProgress}%;
  height: 3px;
  background: linear-gradient(90deg, #7bc5ff, #3d7eff);
  z-index: 20;
  transition: width 0.1s ease-out;
`;

// 添加回到顶部按钮
const ScrollToTopButton = styled.button<{ visible: boolean }>`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(15, 25, 50, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  z-index: 20;
  opacity: ${props => props.visible ? 1 : 0};
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(100, 150, 255, 0.4);
    transform: translateY(-3px);
  }
`;

const Header = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: rgba(15, 25, 50, 0.3);
  backdrop-filter: blur(16px);
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(-3px);
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  /* 以白为主，尾部极淡冷灰蓝，比高饱和蓝更偏「克制、高级」 */
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 42%, #dbeafe 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0;
`;

const Section = styled.section<{ id?: string }>`
  position: relative;
  overflow: hidden;
  background: rgba(10, 20, 40, 0.35);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 2rem; /* p-8 */
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  scroll-margin-top: 80px;

  &::before {
    content: '';
    position: absolute;
    inset: -40% -20% auto -20%;
    height: 70%;
    background: radial-gradient(
      ellipse 70% 55% at 50% 0%,
      rgba(59, 130, 246, 0.14) 0%,
      transparent 68%
    );
    filter: blur(32px);
    pointer-events: none;
    z-index: 0;
  }

  & > * {
    position: relative;
    z-index: 1;
  }
  
  &:hover {
    transform: translateY(-2px);
    border-color: rgba(100, 150, 255, 0.3);
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #f8fafc;
  letter-spacing: -0.02em;
`;

const SectionContent = styled.p`
  font-size: 1rem;
  color: #94a3b8; /* text-slate-400 */
  line-height: 1.625; /* leading-relaxed */
  margin-bottom: 0.5rem;

  strong {
    color: #cbd5e1;
    font-weight: 600;
  }
`;

const CodeBlock = styled.pre`
  background: rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  padding: 2rem; /* p-8，与卡片一致 */
  margin-top: 1rem;
  overflow-x: auto;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem; /* gap-6 */
  margin-top: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr); /* md:grid-cols-2 */
  }
`;

const FeatureCard = styled.div`
  position: relative;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 16px;
  padding: 2rem; /* p-8 */
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.06);

  &::before {
    content: '';
    position: absolute;
    inset: auto 10% -30% 10%;
    height: 55%;
    background: radial-gradient(
      ellipse 80% 70% at 50% 100%,
      rgba(56, 189, 248, 0.08) 0%,
      transparent 70%
    );
    filter: blur(20px);
    pointer-events: none;
  }

  & > * {
    position: relative;
    z-index: 1;
  }
  
  h3 {
    font-size: 1.05rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #eef2f7;
    letter-spacing: -0.01em;
  }
  
  p {
    font-size: 0.9rem;
    color: #94a3b8;
    line-height: 1.625;
  }
`;

const DocsPage: React.FC = () => {
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const element = contentRef.current;
        const scrollTop = element.scrollTop;
        const scrollHeight = element.scrollHeight - element.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        setScrollProgress(progress);
        setShowScrollTop(scrollTop > 300);
      }
    };
    
    const currentRef = contentRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
      return () => currentRef.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // 回到顶部
  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element && contentRef.current) {
      // 计算元素相对于滚动容器的位置
      const containerTop = contentRef.current.getBoundingClientRect().top;
      const elementTop = element.getBoundingClientRect().top;
      const scrollOffset = elementTop - containerTop + contentRef.current.scrollTop - 80;
      
      contentRef.current.scrollTo({
        top: scrollOffset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Container>
      <AmbientBackdrop />
      <PageTopGlow />
      <CornerBloom />
      {/* 滚动进度条 */}
      <ScrollProgress scrollProgress={scrollProgress} />
      
      {/* 左侧目录 */}
      <Sidebar>
        <SidebarTitle>目录</SidebarTitle>
        <SidebarItem onClick={() => scrollToSection('overview')}>概述</SidebarItem>
        <SidebarItem onClick={() => scrollToSection('features')}>核心特性</SidebarItem>
        <SidebarItem onClick={() => scrollToSection('quickstart')}>快速开始</SidebarItem>
        <SidebarItem onClick={() => scrollToSection('config')}>配置参数</SidebarItem>
        <SidebarItem onClick={() => scrollToSection('api')}>API 参考</SidebarItem>
        <SidebarItem onClick={() => scrollToSection('support')}>浏览器支持</SidebarItem>
      </Sidebar>
      
      {/* 右侧内容区域 - 可滚动 */}
      <ContentWrapper
        ref={contentRef}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <Header
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <BackButton onClick={() => navigate('/')}>返回首页</BackButton>
          <Title>KAPPA 海洋渲染 - 文档</Title>
        </Header>

        <Section id="overview">
          <SectionTitle>概述</SectionTitle>
          <SectionContent>
            KAPPA 海洋渲染是一个基于 WebGPU 的次世代海洋水体渲染引擎，
            利用 GPU 的强大算力实现实时光线追踪、动态波浪模拟和逼真的海洋表面效果。
            支持光谱波浪、泡沫模拟、水下焦散等高级特性。
          </SectionContent>
          <SectionContent>
            本引擎采用先进的 FFT 波浪算法，能够实时生成高度逼真的海洋表面，
            同时保持优秀的性能表现。无论是游戏开发、影视制作还是虚拟仿真，
            KAPPA 都能为您提供顶级的海洋渲染体验。
          </SectionContent>
        </Section>

        <Section id="features">
          <SectionTitle>核心特性</SectionTitle>
          <FeatureGrid>
            <FeatureCard>
              <h3>WebGPU 驱动</h3>
              <p>利用现代 GPU 的高性能计算能力</p>
            </FeatureCard>
            <FeatureCard>
              <h3>实时波浪模拟</h3>
              <p>基于 FFT 的光谱波浪生成</p>
            </FeatureCard>
            <FeatureCard>
              <h3>动态光照系统</h3>
              <p>实时光影与水体焦散效果</p>
            </FeatureCard>
            <FeatureCard>
              <h3>高性能渲染</h3>
              <p>Compute Shader 加速计算</p>
            </FeatureCard>
          </FeatureGrid>
        </Section>

        <Section id="quickstart">
          <SectionTitle>快速开始</SectionTitle>
          <SectionContent>在您的项目中安装并启动 KAPPA 海洋渲染引擎：</SectionContent>
          <CodeBlock>
{`npm install kappa-ocean-renderer

import { OceanRenderer } from 'kappa-ocean-renderer';

const ocean = new OceanRenderer('#canvas', {
  resolution: 'high',
  waveQuality: 'ultra',
  reflections: true
});

ocean.start();`}
          </CodeBlock>
        </Section>

        <Section id="config">
          <SectionTitle>配置参数</SectionTitle>
          <SectionContent>您可以通过配置对象自定义海洋渲染效果：</SectionContent>
          <CodeBlock>
{`{
  resolution: 'low' | 'medium' | 'high' | 'ultra',
  waveQuality: 'low' | 'medium' | 'high' | 'ultra',
  reflections: boolean,
  refractions: boolean,
  foamIntensity: number,
  waveSpeed: number,
  windDirection: [number, number]
}`}
          </CodeBlock>
        </Section>

        <Section id="api">
          <SectionTitle>API 参考</SectionTitle>
          <SectionContent>
            <strong>OceanRenderer</strong> - 主渲染器类<br />
            <strong>setWaveParameters()</strong> - 调整波浪参数<br />
            <strong>setCamera()</strong> - 设置相机视角<br />
            <strong>toggleDebugMode()</strong> - 切换调试模式<br />
            <strong>getPerformanceStats()</strong> - 获取性能数据
          </SectionContent>
        </Section>

        <Section id="support">
          <SectionTitle>浏览器支持</SectionTitle>
          <SectionContent>
            ✅ Chrome 113+ (需要开启 WebGPU 支持)<br />
            ✅ Edge 113+<br />
            ⚠️ Firefox (实验性支持，需手动启用)<br />
            ⚠️ Safari (即将支持)
          </SectionContent>
        </Section>
      </ContentWrapper>
      
      {/* 回到顶部按钮 */}
      <ScrollToTopButton visible={showScrollTop} onClick={scrollToTop}>
        ↑
      </ScrollToTopButton>
    </Container>
  );
};


export default DocsPage;