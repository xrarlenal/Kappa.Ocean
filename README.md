# KAPPA OCEAN 海洋渲染引擎
> 基于 WebGPU 的次世代高性能实时海洋模拟解决方案

**KAPPA Ocean** 是一个专为现代浏览器打造的高保真海洋渲染引擎。它利用 WebGPU 的并行计算能力，实现了基于 FFT（快速傅里叶变换）的波浪谱模拟，能够在保持 60FPS 高性能的同时，呈现出影视级的动态海面效果。

---

### 核心特性(Feature)

- **WebGPU 驱动**
  完全基于 WebGPU API 构建，利用 GPU Compute Shader 进行大规模并行计算，性能远超传统 WebGL 方案。
- **真实物理模拟**
  采用 **FFT (快速傅里叶变换)** 算法，基于 Phillips 频谱或 JONSWAP 频谱生成波浪，还原真实海洋的统计学特征。
- **动态光照系统**
  支持实时光线追踪（Ray Tracing）或高级光栅化光照，精确计算菲涅尔反射、折射及焦散效果。
- **高度可配置**
  支持实时调整风速、风向、波浪幅度等参数，适配从平静湖面到狂暴深海的各种场景。

---

### 快速开始(Quick start)

> 确保你已安装 Node.js (v18+)。

1. **克隆项目**

   ```bash
   git clone https://github.com/your-username/kappa-ocean.git
   cd kappa-ocean
   ```

2. **安装依赖与启动开发服务器**

   ```bash
   npm install
   npm run dev
   ```

3. **项目结构**

   ```
   ├── public/            # 静态资源
   ├── src/
   │   ├── core/          # 引擎核心代码 (WebGPU 逻辑)
   │   ├── shaders/       # WGSL 着色器代码
   │   ├── ui/            # 基于 React 的控制面板
   │   └── main.ts        # 入口文件
   ├── index.html         # 主页面
   └── vite.config.ts     # 构建配置
   ```
4.**效果预览**
>(图片先鸽)

---

### 贡献与支持

欢迎提交 Issue 或 Pull Request。
如有疑问，请联系项目维护者。


### License:
#### MIT
