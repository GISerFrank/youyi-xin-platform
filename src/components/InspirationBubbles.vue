<template>
  <div class="bubbles-veil" @click="dismiss"></div>

  <div class="bubbles-container">
    <div
        v-for="bubble in bubbles"
        :key="bubble.id"
        class="bubble"
        :style="{ top: bubble.top, left: bubble.left, width: bubble.size + 'px', height: bubble.size + 'px' }"
        @click="selectBubble(bubble)"
    >
      <img :src="bubble.icon" :alt="bubble.category" />
      <span>{{ bubble.category }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 核心修改：定义组件会触发的事件
const emit = defineEmits(['select-category', 'dismiss']);

// 核心修改：定义选择和关闭的方法
const selectBubble = (bubble) => {
  emit('select-category', bubble.category); // 发送选择的分类
  dismiss(); // 选择后也关闭泡泡
};

const dismiss = () => {
  emit('dismiss'); // 发送关闭信号
};

// 定义泡泡的数据：类别、图标路径、初始位置和大小
const bubbles = ref([
  { id: 1, category: '书店与咖啡', icon: '/images/bubble-cafe.png', top: '25%', left: '55%', size: 120 },
  { id: 2, category: '特色餐饮', icon: '/images/bubble-food.png', top: '50%', left: '20%', size: 150 },
  { id: 3, category: '手工艺', icon: '/images/bubble-craft.png', top: '65%', left: '65%', size: 100 },
  { id: 4, category: '民宿', icon: '/images/bubble-hotel.png', top: '20%', left: '15%', size: 110 },
  // 你可以根据需要添加更多泡泡
]);
</script>

<style scoped>
/* 核心修改：增加幕布的样式 */
.bubbles-veil {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 9;
  cursor: pointer;
}

.bubbles-container {
  /* 容器本身铺满父元素，且不阻挡鼠标事件穿透到地图 */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10; /* 确保在地图图层之上 */
}

.bubble {
  /* 泡泡本身可以接收鼠标事件 */
  pointer-events: auto;

  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 50%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  /* 防止文字被选中 */
  user-select: none;
}

.bubble:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.bubble img {
  width: 45%;
  height: 45%;
  margin-bottom: 5px;
}

.bubble span {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}
</style>