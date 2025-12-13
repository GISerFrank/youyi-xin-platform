<template>
  <article class="merchant-card" @click="$emit('click', merchant)">
    <!-- 封面图 -->
    <div class="card-cover">
      <img 
        :src="merchant.photos?.[0] || defaultCover" 
        :alt="merchant.name"
        loading="lazy"
      />
      <div class="cover-overlay"></div>
      <span class="category-badge" :class="categoryClass">
        {{ categoryIcon }} {{ merchant.category }}
      </span>
    </div>
    
    <!-- 卡片内容 -->
    <div class="card-body">
      <h3 class="card-title">{{ merchant.name }}</h3>
      <p class="card-address">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        {{ merchant.address }}
      </p>
      <p v-if="merchant.description" class="card-desc">
        {{ truncateText(merchant.description, 50) }}
      </p>
      <div v-if="merchant.opening_hours" class="card-hours">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        <span>{{ merchant.opening_hours }}</span>
      </div>
    </div>
    
    <!-- 悬浮提示 -->
    <div class="card-hover-hint">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 16 16 12 12 8"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
      <span>点击查看位置</span>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  merchant: {
    type: Object,
    required: true
  }
});

defineEmits(['click']);

const defaultCover = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=80';

const categoryIcon = computed(() => {
  const icons = {
    '书店与咖啡': '☕',
    '特色餐饮': '🍜',
    '手工艺': '🎨',
    '民宿': '🏠'
  };
  return icons[props.merchant.category] || '📍';
});

const categoryClass = computed(() => {
  const classes = {
    '书店与咖啡': 'cafe',
    '特色餐饮': 'food',
    '手工艺': 'craft',
    '民宿': 'hotel'
  };
  return classes[props.merchant.category] || '';
});

const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};
</script>

<style scoped>
.merchant-card {
  position: relative;
  border-radius: var(--radius-lg);
  background: var(--glass-bg-strong);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--color-border);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-slow);
}

.merchant-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--glass-shadow-hover);
  border-color: var(--color-border-hover);
}

.merchant-card:hover .cover-overlay {
  opacity: 0.15;
}

.merchant-card:hover .card-hover-hint {
  opacity: 1;
  transform: translateX(0);
}

.merchant-card:hover .card-cover img {
  transform: scale(1.05);
}

/* 封面图 */
.card-cover {
  position: relative;
  height: 140px;
  overflow: hidden;
}

.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(74, 69, 65, 0.1) 60%,
    rgba(74, 69, 65, 0.4) 100%
  );
  transition: opacity var(--transition-normal);
}

.category-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 5px 10px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 600;
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--glass-border);
  color: var(--color-text);
}

.category-badge.cafe { 
  background: rgba(198, 123, 92, 0.9); 
  color: white;
  border-color: transparent;
}
.category-badge.food { 
  background: rgba(232, 165, 152, 0.9); 
  color: white;
  border-color: transparent;
}
.category-badge.craft { 
  background: rgba(156, 175, 136, 0.9); 
  color: white;
  border-color: transparent;
}
.category-badge.hotel { 
  background: rgba(139, 164, 180, 0.9); 
  color: white;
  border-color: transparent;
}

/* 卡片内容 */
.card-body {
  padding: 16px;
}

.card-title {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
  line-height: 1.4;
}

.card-address {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 12px;
  color: var(--color-text-soft);
  line-height: 1.5;
  margin-bottom: 8px;
}

.card-address svg {
  flex-shrink: 0;
  margin-top: 2px;
  opacity: 0.6;
}

.card-desc {
  font-size: 13px;
  color: var(--color-text-soft);
  line-height: 1.6;
  margin-bottom: 10px;
}

.card-hours {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--sage-green);
  font-weight: 500;
}

.card-hours svg {
  opacity: 0.8;
}

/* 悬浮提示 */
.card-hover-hint {
  position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: var(--radius-full);
  background: var(--terracotta);
  color: white;
  font-size: 11px;
  font-weight: 500;
  opacity: 0;
  transform: translateX(10px);
  transition: all var(--transition-normal);
}

/* 响应式 */
@media (max-width: 768px) {
  .card-cover {
    height: 120px;
  }
  
  .card-body {
    padding: 12px;
  }
  
  .card-title {
    font-size: 15px;
  }
}
</style>
