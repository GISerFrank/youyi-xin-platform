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
