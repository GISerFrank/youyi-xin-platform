<template>
  <button class="inspiration-entry" @click="handleClick">
    <span class="entry-glow"></span>
    <span class="entry-icon">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path 
          d="M12 2L14.4 8.4L21 9.2L16 14L17.6 21L12 17.6L6.4 21L8 14L3 9.2L9.6 8.4L12 2Z" 
          fill="currentColor"
        />
      </svg>
    </span>
    <span class="entry-text">寻找灵感</span>
    <span class="entry-arrow">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </span>
  </button>
</template>

<script setup>
const emit = defineEmits(['activate']);

const handleClick = () => {
  emit('activate');
};
</script>

<style scoped>
.inspiration-entry {
  position: absolute;
  bottom: 32px;
  right: 24px;
  z-index: 40;
  
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 22px;
  
  background: linear-gradient(135deg, var(--terracotta) 0%, var(--terracotta-dark) 100%);
  border: none;
  border-radius: var(--radius-full);
  box-shadow: 
    0 4px 20px rgba(198, 123, 92, 0.35),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  
  color: white;
  font-size: 15px;
  font-weight: 600;
  font-family: var(--font-body);
  
  cursor: pointer;
  overflow: hidden;
  transition: all var(--transition-normal);
}

.inspiration-entry:hover {
  transform: translateY(-3px);
  box-shadow: 
    0 8px 30px rgba(198, 123, 92, 0.45),
    0 0 0 1px rgba(255, 255, 255, 0.15) inset;
}

.inspiration-entry:hover .entry-glow {
  opacity: 1;
  transform: translateX(100%);
}

.inspiration-entry:hover .entry-arrow {
  transform: translateX(3px);
}

.inspiration-entry:active {
  transform: translateY(-1px);
}

.entry-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  opacity: 0;
  transition: all 0.6s ease;
}

.entry-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.95);
}

.entry-text {
  letter-spacing: 0.5px;
}

.entry-arrow {
  display: flex;
  align-items: center;
  opacity: 0.8;
  transition: transform var(--transition-fast);
}
</style>
