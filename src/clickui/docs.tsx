// docs.tsx - 简化版本，移除收起/展开功能
import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';


const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #0f1235 30%, #0b1a3a 70%, #07102e 100%);
  color: white;
  font-family: 'Inter', 'Segoe UI', 'Poppins', sans-serif;
  overflow-x: hidden;
  position: relative;
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
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  color: #7bc5ff;
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
  max-width: calc(100% - 280px);  // 改为自适应宽度，减去左侧目录宽度
  margin-left: 280px;
  padding: 2rem;
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
  background: linear-gradient(135deg, #ffffff, #7bc5ff, #4a9eff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0;
`;

const Section = styled.section<{ id?: string }>`
  background: rgba(10, 20, 40, 0.35);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 1.5rem 2rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  scroll-margin-top: 80px;
  
  &:hover {
    transform: translateY(-2px);
    border-color: rgba(100, 150, 255, 0.3);
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #7bc5ff;
`;

const SectionContent = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  opacity: 0.85;
  margin-bottom: 0.5rem;
`;

const CodeBlock = styled.pre`
  background: rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1rem;
  overflow-x: auto;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const FeatureCard = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 16px;
  padding: 1rem;
  text-align: center;
  
  h3 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    color: #7bc5ff;
  }
  
  p {
    font-size: 0.85rem;
    opacity: 0.7;
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
      {/* 滚动进度条 */}
      <ScrollProgress scrollProgress={scrollProgress} />
      
      {/* 左侧目录 */}
      <Sidebar>
        <SidebarTitle>📖 文档目录</SidebarTitle>
        <SidebarItem onClick={() => scrollToSection('overview')}>🌊 概述</SidebarItem>
        <SidebarItem onClick={() => scrollToSection('features')}>✨ 核心特性</SidebarItem>
        <SidebarItem onClick={() => scrollToSection('quickstart')}>🚀 快速开始</SidebarItem>
        <SidebarItem onClick={() => scrollToSection('config')}>⚙️ 配置参数</SidebarItem>
        <SidebarItem onClick={() => scrollToSection('api')}>📖 API 参考</SidebarItem>
        <SidebarItem onClick={() => scrollToSection('support')}>🔧 浏览器支持</SidebarItem>
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
          <BackButton onClick={() => navigate('/')}>← 返回首页</BackButton>
          <Title>KAPPA 海洋渲染 - 文档</Title>
        </Header>

        <Section id="overview">
          <SectionTitle>🌊 概述</SectionTitle>
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
          <SectionTitle>✨ 核心特性</SectionTitle>
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
          <SectionTitle>🚀 快速开始</SectionTitle>
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
          <SectionTitle>⚙️ 配置参数</SectionTitle>
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
          <SectionTitle>📖 API 参考</SectionTitle>
          <SectionContent>
            <strong>OceanRenderer</strong> - 主渲染器类<br />
            <strong>setWaveParameters()</strong> - 调整波浪参数<br />
            <strong>setCamera()</strong> - 设置相机视角<br />
            <strong>toggleDebugMode()</strong> - 切换调试模式<br />
            <strong>getPerformanceStats()</strong> - 获取性能数据
          </SectionContent>
        </Section>

        <Section id="support">
          <SectionTitle>🔧 浏览器支持</SectionTitle>
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