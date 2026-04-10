// sharedStyles.ts
import { css } from '@emotion/react';

// 共享的背景渐变
export const sharedBackground = css`
  background: linear-gradient(135deg, #0a0e27 0%, #0f1235 30%, #0b1a3a 70%, #07102e 100%);
`;

// 或者直接导出渐变字符串供 styled 组件使用
export const backgroundGradient = 'linear-gradient(135deg, #0a0e27 0%, #0f1235 30%, #0b1a3a 70%, #07102e 100%)';