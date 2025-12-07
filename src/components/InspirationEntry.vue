<template>
  <div class="entry-point" @click="handleClick">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
      <path d="M9.58443 2.50002L8.20442 5.27002L5.43442 6.65002L8.20442 8.03002L9.58443 10.8L10.9644 8.03002L13.7344 6.65002L10.9644 5.27002L9.58443 2.50002ZM17.5844 8.80002L16.2044 11.57L13.4344 12.95L16.2044 14.33L17.5844 17.1L18.9644 14.33L21.7344 12.95L18.9644 11.57L17.5844 8.80002ZM17.5844 17.1L16.2044 19.87L13.4344 21.25L16.2044 22.63L17.5844 25.4L18.9644 22.63L21.7344 21.25L18.9644 19.87L17.5844 17.1Z" />
    </svg>
    <span>寻找灵感</span>
  </div>
</template>

<script setup>
// 定义组件会触发的自定义事件
const emit = defineEmits(['activate']);

const handleClick = () => {
  // 当被点击时，向父组件发送一个 'activate' 信号
  emit('activate');
};
</script>

<style scoped>
.entry-point {
  position: absolute;
  bottom: 30px;
  right: 30px;
  z-index: 20; /* 比泡泡的层级更高 */

  display: flex;
  align-items: center;
  padding: 10px 20px;

  background-color: #ffffff;
  border-radius: 50px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

  cursor: pointer;
  transition: all 0.3s ease;

  color: #333;
  font-size: 16px;
  font-weight: 500;
}

.entry-point:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  color: #6a88e0;
}
</style>