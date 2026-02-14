<template>
  <div class="app-container" :class="{ 'drawer-open': isMobileDrawerOpen }">
    <!-- 顶部导航 - 玻璃拟态效果 -->
    <header class="app-header">
      <div class="header-left">
        <div class="logo">
          <span class="logo-icon">❤️</span>
          <h1 class="logo-text">心地图</h1>
          <span class="logo-subtitle">· 大理</span>
        </div>
      </div>
      
      <nav class="header-nav">
        <div class="category-pills">
          <button
            v-for="category in categories"
            :key="category"
            :class="['pill', { active: selectedCategory === category }]"
            @click="handleCategorySelect(category)"
          >
            <span class="pill-icon">{{ getCategoryIcon(category) }}</span>
            <span class="pill-text">{{ category }}</span>
          </button>
        </div>
        
        <div class="nav-divider"></div>
        
        <div class="nav-actions">
          <button class="action-btn" @click="resetFilters">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span>显示全部</span>
          </button>
          <button class="action-btn" @click="fitView">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
            <span>适应视图</span>
          </button>
        </div>
        
        <div class="stats-badge">
          <span class="stats-current">{{ filteredMerchants.length }}</span>
          <span class="stats-divider">/</span>
          <span class="stats-total">{{ merchants.length }}</span>
        </div>
      </nav>
    </header>

    <!-- 主体内容 -->
    <main class="app-main">
      <!-- 移动端遮罩层 -->
      <div 
        v-if="isMobileDrawerOpen" 
        class="mobile-overlay"
        @click="closeMobileDrawer"
      ></div>
      
      <!-- 侧边栏 - 玻璃拟态 -->
      <aside class="sidebar" :class="{ 'drawer-visible': isMobileDrawerOpen }">
        <!-- 移动端抽屉头部 -->
        <div class="drawer-header">
          <span class="drawer-handle"></span>
          <div class="drawer-title">
            <span class="drawer-title-icon">{{ getCategoryIcon(selectedCategory) }}</span>
            <span>{{ selectedCategory }}</span>
            <span class="drawer-count">{{ filteredMerchants.length }}家</span>
          </div>
          <button class="drawer-close" @click="closeMobileDrawer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        <div class="sidebar-header">
          <div class="search-box">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input 
              v-model="searchText" 
              type="text" 
              placeholder="搜索商家名称..." 
              class="search-input"
            />
            <button v-if="searchText" class="search-clear" @click="searchText = ''">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          
          <div class="category-stats">
            <span 
              v-for="(count, category) in categoryStats" 
              :key="category"
              :class="['stat-tag', getCategoryClass(category)]"
            >
              {{ getCategoryIcon(category) }} {{ category }} · {{ count }}
            </span>
          </div>
        </div>
        
        <div class="merchant-list">
          <MerchantCard
            v-for="merchant in filteredMerchants"
            :key="merchant.id"
            :merchant="merchant"
            @click="handleMerchantSelect(merchant)"
          />
          
          <div v-if="filteredMerchants.length === 0" class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="M8 15s1.5 2 4 2 4-2 4-2"/>
              <line x1="9" y1="9" x2="9.01" y2="9"/>
              <line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
            <p>暂无符合条件的商家</p>
          </div>
        </div>
      </aside>

      <!-- 地图区域 -->
      <section class="map-section">
        <MapView
          ref="mapViewRef"
          :merchants="filteredMerchants"
          @marker-click="handleMerchantSelect"
        />
        
        <!-- 灵感入口 -->
        <InspirationEntry v-if="!showBubbles" @activate="handleActivateBubbles" />
        
        <!-- 灵感泡泡 -->
        <InspirationBubbles
          v-if="showBubbles"
          @dismiss="handleDismissBubbles"
          @select-category="handleCategorySelect"
        />
        
        <!-- 浮动操作按钮 -->
        <div class="floating-actions">
          <button class="fab" @click="resetView" title="回到初始视图">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import allMerchants from '@/data/mockdata.json';
import MerchantCard from '@/components/MerchantCard.vue';
import MapView from '@/components/MapView.vue';
import InspirationBubbles from '@/components/InspirationBubbles.vue';
import InspirationEntry from '@/components/InspirationEntry.vue';

// 组件引用
const mapViewRef = ref(null);

// 数据与状态管理
const merchants = ref(allMerchants);
const searchText = ref('');
const selectedCategory = ref('全部');
const showBubbles = ref(false);
const categories = ['书店与咖啡', '特色餐饮', '手工艺', '民宿'];

// 移动端抽屉状态
const isMobile = ref(false);
const isMobileDrawerOpen = ref(false);

// 检测是否为移动端
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
  // 如果切换到桌面端，关闭移动端抽屉状态
  if (!isMobile.value) {
    isMobileDrawerOpen.value = false;
  }
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

// 关闭移动端抽屉
const closeMobileDrawer = () => {
  isMobileDrawerOpen.value = false;
};

// 核心筛选逻辑
const filteredMerchants = computed(() => {
  return merchants.value.filter(merchant => {
    const categoryMatch = selectedCategory.value === '全部' || merchant.category === selectedCategory.value;
    const searchMatch = searchText.value === '' || merchant.name.toLowerCase().includes(searchText.value.toLowerCase());
    return categoryMatch && searchMatch;
  });
});

// 分类统计
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
  
  // 移动端：点击分类时打开抽屉
  if (isMobile.value) {
    isMobileDrawerOpen.value = true;
  }
  
  fitView();
};

const handleMerchantSelect = (merchant) => {
  if (mapViewRef.value) {
    mapViewRef.value.flyTo(merchant);
    
    // 移动端：选择商家后关闭抽屉，并延迟显示详情弹窗
    if (isMobile.value) {
      closeMobileDrawer();
      // 等待地图飞行动画完成后显示详情弹窗
      setTimeout(() => {
        mapViewRef.value.showMerchantInfo(merchant);
      }, 800);
    }
  }
};

const resetFilters = () => {
  selectedCategory.value = '全部';
  searchText.value = '';
  closeMobileDrawer();
  ElMessage({
    message: '已重置所有筛选',
    type: 'success',
    customClass: 'custom-message'
  });
};

const fitView = () => {
  mapViewRef.value?.fitToAllMarkers();
};

const resetView = () => {
  if (mapViewRef.value) {
    mapViewRef.value.flyTo({
      longitude: 100.163,
      latitude: 25.694
    });
    ElMessage({
      message: '已回到初始视图',
      type: 'success',
      customClass: 'custom-message'
    });
  }
};

// 辅助方法
const getCategoryIcon = (category) => {
  const icons = { 
    '书店与咖啡': '☕', 
    '特色餐饮': '🍜', 
    '手工艺': '🎨', 
    '民宿': '🏠' 
  };
  return icons[category] || '📍';
};

const getCategoryClass = (category) => {
  const classes = { 
    '书店与咖啡': 'cafe', 
    '特色餐饮': 'food', 
    '手工艺': 'craft', 
    '民宿': 'hotel' 
  };
  return classes[category] || '';
};
</script>

<style>
/* 全局消息样式 */
.custom-message {
  background: var(--glass-bg-strong) !important;
  border: 1px solid var(--color-border) !important;
  border-radius: var(--radius-md) !important;
  backdrop-filter: blur(10px);
}
</style>

<style scoped>
.app-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--color-background);
}

/* ==================== 顶部导航 ==================== */
.app-header {
  height: 64px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--glass-border);
  box-shadow: var(--shadow-sm);
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.logo-icon {
  font-size: 24px;
  margin-right: 8px;
}

.logo-text {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: -0.5px;
}

.logo-subtitle {
  font-family: var(--font-display);
  font-size: 14px;
  color: var(--color-text-soft);
  font-weight: 400;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 16px;
}

.category-pills {
  display: flex;
  gap: 6px;
}

.pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: var(--radius-full);
  background: var(--warm-cream-mute);
  border: 1px solid transparent;
  color: var(--color-text-soft);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.pill:hover {
  background: var(--warm-cream);
  border-color: var(--color-border-hover);
  color: var(--color-text);
}

.pill.active {
  background: linear-gradient(135deg, var(--terracotta) 0%, var(--terracotta-dark) 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(198, 123, 92, 0.3);
}

.pill-icon {
  font-size: 14px;
}

.nav-divider {
  width: 1px;
  height: 24px;
  background: var(--color-border);
}

.nav-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-soft);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.action-btn:hover {
  background: var(--warm-cream-mute);
  border-color: var(--color-border-hover);
  color: var(--color-text);
}

.action-btn svg {
  opacity: 0.7;
}

.stats-badge {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 6px 12px;
  background: var(--terracotta-bg);
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 600;
}

.stats-current {
  color: var(--terracotta);
}

.stats-divider {
  color: var(--color-text-mute);
}

.stats-total {
  color: var(--color-text-soft);
}

/* ==================== 主体内容 ==================== */
.app-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* ==================== 侧边栏 ==================== */
.sidebar {
  width: 380px;
  display: flex;
  flex-direction: column;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-right: 1px solid var(--glass-border);
  box-shadow: var(--shadow-md);
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid var(--color-border);
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  color: var(--color-text-mute);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 44px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--warm-cream);
  font-size: 14px;
  color: var(--color-text);
  transition: all var(--transition-normal);
}

.search-input::placeholder {
  color: var(--color-text-mute);
}

.search-input:focus {
  outline: none;
  border-color: var(--terracotta);
  box-shadow: 0 0 0 3px rgba(198, 123, 92, 0.1);
}

.search-clear {
  position: absolute;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: var(--radius-full);
  background: var(--color-text-mute);
  color: white;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.search-clear:hover {
  background: var(--color-text-soft);
}

.category-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.stat-tag {
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 500;
  background: var(--warm-cream-mute);
  color: var(--color-text-soft);
}

.stat-tag.cafe { background: rgba(198, 123, 92, 0.12); color: var(--terracotta); }
.stat-tag.food { background: rgba(232, 165, 152, 0.15); color: #c45d4d; }
.stat-tag.craft { background: rgba(156, 175, 136, 0.15); color: #6b8f5c; }
.stat-tag.hotel { background: rgba(139, 164, 180, 0.15); color: #5a7d8f; }

.merchant-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--color-text-mute);
  text-align: center;
}

.empty-state svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 14px;
}

/* ==================== 地图区域 ==================== */
.map-section {
  flex: 1;
  position: relative;
  overflow: hidden;
}

/* ==================== 浮动按钮 ==================== */
.floating-actions {
  position: absolute;
  bottom: 100px;
  right: 24px;
  z-index: 50;
}

.fab {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background: var(--glass-bg-strong);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-lg);
  color: var(--color-text);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.fab:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
  background: white;
}

.fab:active {
  transform: translateY(0);
}

/* ==================== 移动端适配 ==================== */

/* 平板适配 */
@media (max-width: 1024px) {
  .sidebar {
    width: 320px;
  }
  
  .pill-text {
    display: none;
  }
  
  .pill {
    padding: 8px 10px;
  }
  
  .action-btn span {
    display: none;
  }
  
  .action-btn {
    padding: 8px;
  }
}

/* 手机适配 */
@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
  }
  
  /* 顶部导航调整 - 更紧凑的单行布局 */
  .app-header {
    height: 56px;
    padding: 0 12px;
    flex-direction: row;
    gap: 8px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }
  
  .header-left {
    flex-shrink: 0;
  }
  
  .logo {
    gap: 2px;
  }
  
  .logo-icon {
    font-size: 18px;
    margin-right: 4px;
  }
  
  .logo-text {
    font-size: 16px;
  }
  
  .logo-subtitle {
    font-size: 11px;
  }
  
  .header-nav {
    flex: 1;
    justify-content: flex-end;
    gap: 6px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  .header-nav::-webkit-scrollbar {
    display: none;
  }
  
  .category-pills {
    flex-wrap: nowrap;
    gap: 4px;
  }
  
  .pill {
    padding: 6px 10px;
    font-size: 12px;
    white-space: nowrap;
    flex-shrink: 0;
  }
  
  .pill-icon {
    font-size: 12px;
  }
  
  .pill-text {
    display: inline;
  }
  
  .nav-divider {
    display: none;
  }
  
  .nav-actions {
    display: none;
  }
  
  .stats-badge {
    display: none;
  }
  
  /* 主体内容调整 */
  .app-main {
    flex-direction: column;
    padding-top: 56px;
    height: 100vh;
  }
  
  /* 地图区域 - 全屏显示 */
  .map-section {
    flex: 1;
    min-height: 0;
    height: calc(100vh - 56px);
  }
  
  /* 移动端遮罩层 */
  .mobile-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 99;
    opacity: 0;
    animation: fadeIn 0.3s ease forwards;
  }
  
  @keyframes fadeIn {
    to { opacity: 1; }
  }
  
  /* 侧边栏变为底部抽屉 - 默认隐藏 */
  .sidebar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 60vh;
    max-height: 500px;
    border-right: none;
    border-top: 1px solid var(--glass-border);
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    z-index: 100;
    transform: translateY(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  }
  
  .sidebar.drawer-visible {
    transform: translateY(0);
  }
  
  /* 抽屉头部样式 */
  .drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid var(--color-border);
    position: relative;
  }
  
  .drawer-handle {
    position: absolute;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    width: 36px;
    height: 4px;
    background: var(--color-border);
    border-radius: var(--radius-full);
  }
  
  .drawer-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 15px;
    font-weight: 600;
    color: var(--color-text);
    padding-top: 4px;
  }
  
  .drawer-title-icon {
    font-size: 16px;
  }
  
  .drawer-count {
    font-size: 12px;
    font-weight: 500;
    color: var(--color-text-soft);
    background: var(--warm-cream-mute);
    padding: 2px 8px;
    border-radius: var(--radius-full);
  }
  
  .drawer-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: var(--radius-full);
    background: var(--warm-cream-mute);
    color: var(--color-text-soft);
    margin-top: 4px;
    transition: all var(--transition-fast);
  }
  
  .drawer-close:active {
    background: var(--terracotta);
    color: white;
  }
  
  .sidebar-header {
    padding: 12px 16px 8px;
  }
  
  .search-box {
    margin-bottom: 0;
  }
  
  .search-input {
    padding: 10px 36px 10px 40px;
    font-size: 14px;
  }
  
  .search-icon {
    left: 12px;
    width: 16px;
    height: 16px;
  }
  
  .category-stats {
    margin-top: 10px;
    gap: 6px;
  }
  
  .stat-tag {
    padding: 3px 8px;
    font-size: 11px;
  }
  
  .merchant-list {
    padding: 12px 16px;
    gap: 10px;
    max-height: calc(60vh - 160px);
  }
  
  /* 浮动按钮调整 - 始终在地图右下角 */
  .floating-actions {
    bottom: 24px;
    right: 16px;
  }
  
  /* 抽屉打开时浮动按钮位置调整 */
  .drawer-open .floating-actions {
    bottom: calc(60vh + 16px);
  }
  
  .fab {
    width: 44px;
    height: 44px;
  }
  
  .fab svg {
    width: 20px;
    height: 20px;
  }
}

/* 小屏手机适配 */
@media (max-width: 480px) {
  .app-header {
    height: 50px;
    padding: 0 10px;
  }
  
  .logo-icon {
    font-size: 16px;
  }
  
  .logo-text {
    font-size: 14px;
  }
  
  .logo-subtitle {
    display: none;
  }
  
  .category-pills {
    gap: 4px;
  }
  
  .pill {
    padding: 5px 8px;
    font-size: 11px;
  }
  
  .pill-icon {
    font-size: 11px;
  }
  
  .app-main {
    padding-top: 50px;
  }
  
  .map-section {
    height: calc(100vh - 50px);
  }
  
  .sidebar {
    height: 55vh;
    max-height: 450px;
  }
  
  .drawer-header {
    padding: 10px 12px;
  }
  
  .drawer-title {
    font-size: 14px;
  }
  
  .sidebar-header {
    padding: 10px 12px 6px;
  }
  
  .search-input {
    padding: 8px 32px 8px 36px;
    font-size: 13px;
  }
  
  .merchant-list {
    padding: 10px 12px;
    gap: 8px;
    max-height: calc(55vh - 140px);
  }
  
  .floating-actions {
    bottom: 20px;
    right: 12px;
  }
  
  .drawer-open .floating-actions {
    bottom: calc(55vh + 12px);
  }
  
  .fab {
    width: 40px;
    height: 40px;
  }
  
  .fab svg {
    width: 18px;
    height: 18px;
  }
}

/* 桌面端隐藏移动端专属元素 */
@media (min-width: 769px) {
  .mobile-overlay {
    display: none !important;
  }
  
  .drawer-header {
    display: none !important;
  }
}

/* 横屏模式适配 */
@media (max-width: 900px) and (orientation: landscape) {
  .app-header {
    height: 44px;
    padding: 0 12px;
  }
  
  .logo-icon {
    font-size: 16px;
  }
  
  .logo-text {
    font-size: 14px;
  }
  
  .app-main {
    flex-direction: row;
    padding-top: 44px;
  }
  
  .mobile-overlay {
    display: none !important;
  }
  
  .sidebar {
    position: relative;
    bottom: auto;
    left: auto;
    right: auto;
    width: 280px;
    height: 100%;
    max-height: none;
    border-radius: 0;
    border-right: 1px solid var(--glass-border);
    border-top: none;
    transform: none;
  }
  
  .drawer-header {
    display: none;
  }
  
  .map-section {
    flex: 1;
    height: 100%;
  }
  
  .floating-actions {
    bottom: 16px;
    right: 16px;
  }
}
</style>
