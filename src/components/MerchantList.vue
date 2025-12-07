<template>
  <div class="merchant-list">
    <el-card
        v-for="merchant in merchants"
        :key="merchant.id"
        class="merchant-card"
        @click="handleCardClick(merchant)"
    >
      <template #header>
        <div class="card-header">
          <span>{{ merchant.name }}</span>
        </div>
      </template>
      <div>{{ merchant.category }}</div>
      <div>{{ merchant.address }}</div>
    </el-card>
  </div>
</template>

<script setup>
// 核心修改1: 删除 import merchants from '@/data/mockdata.json';

// 核心修改2: 使用 defineProps 来定义一个名为 'merchants' 的 prop
// 这个 prop 将会接收来自 App.vue 的过滤后的商家数组
const props = defineProps({
  merchants: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['item-click']);

const handleCardClick = (merchant) => {
  emit('item-click', merchant);
};
</script>

<style scoped>
/* 样式保持不变 */
.merchant-list {
  padding: 20px;
  overflow-y: auto;
  height: 100%;
  box-sizing: border-box;
}

.merchant-card {
  margin-bottom: 20px;
  cursor: pointer;
}

.merchant-card:hover {
  border-color: #409eff;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
}
</style>