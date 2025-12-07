<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <div class="header-content">
          <h1>❤️ 心商家地图</h1>
          <div class="map-controls">
            <el-button-group>
              <el-button
                  v-for="category in categories"
                  :key="category"
                  :type="selectedCategory === category ? 'primary' : 'default'"
                  size="small"
                  @click="handleCategorySelect(category)"
              >
                {{ getCategoryIcon(category) }} {{ category }}
              </el-button>
            </el-button-group>
            <el-divider direction="vertical" />
            <el-button type="success" size="small" @click="resetFilters" :icon="View">显示全部</el-button>
            <el-button size="small" @click="fitView" :icon="FullScreen">适应视图</el-button>
            <el-divider direction="vertical" />
            <el-tag type="info" class="marker-count">显示: {{ filteredMerchants.length }} / 总计: {{ merchants.length }}</el-tag>
          </div>
        </div>
      </el-header>

      <el-container>
        <el-aside width="350px" class="aside">
          <div class="search-box">
            <el-input v-model="searchText" placeholder="搜索商家名称..." :prefix-icon="Search" clearable />
          </div>

          <div class="category-stats">
            <el-space wrap>
              <el-tag
                  v-for="(count, category) in categoryStats"
                  :key="category"
                  :type="getCategoryTagType(category)"
                  size="small"
              >
                {{ category }}: {{ count }}
              </el-tag>
            </el-space>
          </div>

          <MerchantList
              :merchants="filteredMerchants"
              @item-click="handleMerchantSelect"
          />
        </el-aside>

        <el-main class="main-content">
          <MapView
              ref="mapViewRef"
              :merchants="filteredMerchants"
              @marker-click="handleMerchantSelect"
          />
          <EntryPoint v-if="!showBubbles" @activate="handleActivateBubbles" />
          <InspirationBubbles
              v-if="showBubbles"
              @dismiss="handleDismissBubbles"
              @select-category="handleCategorySelect"
          />

          <div class="floating-actions">
            <el-tooltip content="回到初始视图" placement="left">
              <el-button
                  circle
                  :icon="HomeFilled"
                  @click="resetView"
                  type="primary"
              />
            </el-tooltip>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
// --- 恢复：引入 HomeFilled 图标 ---
import { View, FullScreen, Search, HomeFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import allMerchants from '@/data/mockdata.json';
import MerchantList from './components/MerchantList.vue';
import MapView from './components/MapView.vue';
import InspirationBubbles from './components/InspirationBubbles.vue';
import EntryPoint from './components/InspirationEntry.vue';

// 组件引用
const mapViewRef = ref(null);

// 数据与状态管理
const merchants = ref(allMerchants);
const searchText = ref('');
const selectedCategory = ref('全部');
const showBubbles = ref(false);
const categories = ['书店与咖啡', '特色餐饮', '手工艺', '民宿'];

// 核心筛选逻辑 (计算属性)
const filteredMerchants = computed(() => {
  // ... 筛选逻辑不变 ...
  return merchants.value.filter(merchant => {
    const categoryMatch = selectedCategory.value === '全部' || merchant.category === selectedCategory.value;
    const searchMatch = searchText.value === '' || merchant.name.toLowerCase().includes(searchText.value.toLowerCase());
    return categoryMatch && searchMatch;
  });
});

// --- 恢复：分类统计的计算属性 ---
const categoryStats = computed(() => {
  const stats = {};
  merchants.value.forEach(merchant => {
    if (stats[merchant.category]) {
      stats[merchant.category]++;
    } else {
      stats[merchant.category] = 1;
    }
  });
  return stats;
});

// 事件处理方法
const handleActivateBubbles = () => { showBubbles.value = true; };
const handleDismissBubbles = () => { showBubbles.value = false; };
const handleCategorySelect = (category) => {
  selectedCategory.value = category;
  handleDismissBubbles();
  fitView()
};
const handleMerchantSelect = (merchant) => {
  if (mapViewRef.value) {
    mapViewRef.value.flyTo(merchant);
  }
};
const resetFilters = () => {
  selectedCategory.value = '全部';
  searchText.value = '';
  ElMessage.success('已重置所有筛选');
};
const fitView = () => {
  mapViewRef.value?.fitToAllMarkers();
};

// --- 恢复：回到初始视图的方法 ---
const resetView = () => {
  if (mapViewRef.value) {
    // 调用 flyTo 方法回到我们设定的初始点
    mapViewRef.value.flyTo({
      longitude: 100.163,
      latitude: 25.694
    });
    ElMessage.success('已回到初始视图');
  }
};

// 辅助方法
const getCategoryIcon = (category) => {
  const icons = { '书店与咖啡': '☕', '特色餐饮': '🍜', '手工艺': '🎨', '民宿': '🏠' };
  return icons[category] || '📍';
};
// --- 恢复：分类标签类型的辅助方法 ---
const getCategoryTagType = (category) => {
  const types = { '书店与咖啡': 'warning', '特色餐饮': 'danger', '手工艺': 'success', '民宿': 'primary' };
  return types[category] || 'info';
};
</script>

<style>
/* ... 全局样式不变 ... */
/* 全局样式，修复el-header高度问题 */
.header {
  height: auto !important;
  line-height: normal;
  padding: 10px 20px;
  border-bottom: 1px solid #e4e7ed;
}
.aside {
  height: calc(100vh - 68px); /* 根据header实际高度微调 */
  border-right: 1px solid #e4e7ed;
}
</style>

<style scoped>
/* ... scoped 样式不变，但为新加的元素补充样式 ... */
.header-content { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
.header h1 { margin: 0; font-size: 24px; }
.map-controls { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.marker-count { margin-left: 5px; }
.search-box { padding: 15px; border-bottom: 1px solid #e4e7ed; }
.main-content { position: relative; padding: 0; height: calc(100vh - 68px); }
.el-divider--vertical { height: 20px; }
.category-stats {
  padding: 10px 15px;
  background: #fafafa;
  border-bottom: 1px solid #e4e7ed;
}
.floating-actions {
  position: absolute;
  bottom: 30px;
  right: 30px;
  /* 注意：z-index要比Entry Point更高，以防被遮挡 */
  z-index: 21;
}
</style>
