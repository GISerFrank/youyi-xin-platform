<template>
  <Teleport to="body">
    <!-- 背景遮罩 -->
    <div class="bubbles-backdrop" @click="dismiss">
      <div class="backdrop-pattern"></div>
    </div>
    
    <!-- 泡泡容器 -->
    <div class="bubbles-container">
      <div class="bubbles-title">
        <span class="title-icon">✨</span>
        <span>今天想探索什么？</span>
      </div>
      
      <div class="bubbles-grid">
        <button
          v-for="(bubble, index) in bubbles"
          :key="bubble.id"
          class="bubble"
          :class="bubble.className"
          :style="{ animationDelay: `${index * 0.1}s` }"
          @click="selectBubble(bubble)"
        >
          <span class="bubble-icon">{{ bubble.icon }}</span>
          <span class="bubble-label">{{ bubble.category }}</span>
          <span class="bubble-hint">{{ bubble.hint }}</span>
        </button>
      </div>
      
      <button class="close-btn" @click="dismiss">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['select-category', 'dismiss']);

const selectBubble = (bubble) => {
  emit('select-category', bubble.category);
  dismiss();
};

const dismiss = () => {
  emit('dismiss');
};

const bubbles = ref([
  { 
    id: 1, 
    category: '书店与咖啡', 
    icon: '☕', 
    hint: '慢时光',
    className: 'cafe'
  },
  { 
    id: 2, 
    category: '特色餐饮', 
    icon: '🍜', 
    hint: '本地味道',
    className: 'food'
  },
  { 
    id: 3, 
    category: '手工艺', 
    icon: '🎨', 
    hint: '匠心独运',
    className: 'craft'
  },
  { 
    id: 4, 
    category: '民宿', 
    icon: '🏠', 
    hint: '栖居之所',
    className: 'hotel'
  },
]);
</script>

<style scoped>
/* 背景遮罩 */
.bubbles-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(74, 69, 65, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.backdrop-pattern {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    circle at 20% 30%,
    rgba(198, 123, 92, 0.1) 0%,
    transparent 50%
  ),
  radial-gradient(
    circle at 80% 70%,
    rgba(156, 175, 136, 0.1) 0%,
    transparent 50%
  );
}

/* 泡泡容器 */
.bubbles-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
  
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  
  background: var(--glass-bg-strong);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  
  animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.bubbles-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 600;
  color: var(--color-text);
}

.title-icon {
  font-size: 24px;
}

.bubbles-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

/* 单个泡泡 */
.bubble {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 140px;
  padding: 20px;
  
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--warm-cream);
  
  cursor: pointer;
  transition: all var(--transition-normal);
  animation: bubbleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
}

.bubble:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: var(--shadow-lg);
}

.bubble.cafe {
  border-color: rgba(198, 123, 92, 0.3);
}
.bubble.cafe:hover {
  background: rgba(198, 123, 92, 0.08);
  border-color: var(--terracotta);
}

.bubble.food {
  border-color: rgba(232, 165, 152, 0.3);
}
.bubble.food:hover {
  background: rgba(232, 165, 152, 0.1);
  border-color: var(--soft-coral);
}

.bubble.craft {
  border-color: rgba(156, 175, 136, 0.3);
}
.bubble.craft:hover {
  background: rgba(156, 175, 136, 0.1);
  border-color: var(--sage-green);
}

.bubble.hotel {
  border-color: rgba(139, 164, 180, 0.3);
}
.bubble.hotel:hover {
  background: rgba(139, 164, 180, 0.1);
  border-color: var(--dusty-blue);
}

.bubble-icon {
  font-size: 36px;
  margin-bottom: 10px;
}

.bubble-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 4px;
}

.bubble-hint {
  font-size: 12px;
  color: var(--color-text-mute);
}

/* 关闭按钮 */
.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: var(--radius-full);
  background: var(--warm-cream-mute);
  color: var(--color-text-soft);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.close-btn:hover {
  background: var(--terracotta);
  color: white;
}

/* 动画 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { 
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to { 
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes bubbleIn {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .bubbles-container {
    padding: 32px 24px;
    margin: 16px;
    width: calc(100% - 32px);
    max-width: 360px;
  }
  
  .bubbles-title {
    font-size: 18px;
    margin-bottom: 24px;
  }
  
  .title-icon {
    font-size: 20px;
  }
  
  .bubbles-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .bubble {
    width: 130px;
    height: 130px;
    padding: 16px;
  }
  
  .bubble-icon {
    font-size: 32px;
    margin-bottom: 8px;
  }
  
  .bubble-label {
    font-size: 13px;
  }
  
  .bubble-hint {
    font-size: 11px;
  }
  
  .close-btn {
    top: 12px;
    right: 12px;
    width: 32px;
    height: 32px;
  }
}

@media (max-width: 480px) {
  .bubbles-container {
    padding: 28px 20px;
    margin: 12px;
    width: calc(100% - 24px);
  }
  
  .bubbles-title {
    font-size: 16px;
    margin-bottom: 20px;
  }
  
  .bubbles-grid {
    gap: 10px;
  }
  
  .bubble {
    width: 110px;
    height: 110px;
    padding: 14px;
  }
  
  .bubble-icon {
    font-size: 28px;
  }
  
  .bubble-label {
    font-size: 12px;
  }
}
</style>
