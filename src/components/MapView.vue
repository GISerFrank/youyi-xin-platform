<template>
  <div id="map-container"></div>
</template>

<script setup>
import { ref, onMounted, shallowRef, watch } from 'vue';
import AMapLoader from '@amap/amap-jsapi-loader';
// import merchants from '@/data/mockdata.json';

const props = defineProps({
  merchants: {
    type: Array,
    required: true,
  },
});

// 使用 shallowRef 来持有地图实例
const mapInstance = shallowRef(null);
const markerInstances = []; // 用一个数组来存储当前地图上所有的标记实例

// 存储所有标记
// const markers = ref([]);

// --- 核心修改 1: 创建一个 ref 来持有“单一”的信息窗实例 ---
const infoWindowRef = shallowRef(null);

const iconMap = {
  'default': '/images/icon-default.png',
  '书店与咖啡': '/images/icon-cafe.png',
  '特色餐饮': '/images/icon-food.png',
  '手工艺': '/images/icon-craft.png',
  '民宿': '/images/icon-hotel.png'
};

// 核心修改3: 将绘制标记的逻辑封装成一个独立的函数
const drawMarkers = (AMap) => {
  // 在绘制新标记之前，先清空地图上所有旧的标记
  if (mapInstance.value) {
    mapInstance.value.remove(markerInstances);
    markerInstances.length = 0; // 清空数组
  }

  // 遍历从 prop 接收到的商家列表来创建新标记
  props.merchants.forEach(merchant => {
    const iconUrl = iconMap[merchant.category] || iconMap['default'];
    const icon = new AMap.Icon({ /* ... icon 定义 ... */
      size: new AMap.Size(28, 35),    // 图标尺寸
      image: iconUrl,                  // 图标图片 URL
      imageSize: new AMap.Size(28, 35) // 图标取图大小
    });
    const marker = new AMap.Marker({
      position: [merchant.longitude, merchant.latitude],
      title: merchant.name,
      icon: icon,
      offset: new AMap.Pixel(-14, -35),
    });

  // 为标记添加点击事件
  marker.on('click', (e) => {
    flyTo(merchant);

    // 1. 构造信息窗的内容 (可以使用 HTML)
    const content = // 修改 marker 点击事件中的 content
        `
          <div style="
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            border: 1px solid #EBEEF5;
            padding: 15px;
            min-width: 200px;
            position: relative;
          ">
            <div style="
              position: absolute;
              top: 8px;
              right: 8px;
              cursor: pointer;
              color: #909399;
              font-size: 16px;
            " onclick="this.parentElement.style.display='none'">×</div>

            <h3 style="
              font-size: 16px;
              font-weight: 600;
              margin: 0 0 8px 0;
              color: #333;
            ">${merchant.name}</h3>
            <p style="margin: 0 0 5px 0; color: #666;">
              <strong>类型:</strong> ${merchant.category}
            </p>
            <p style="margin: 0; color: #666;">
              <strong>地址:</strong> ${merchant.address}
            </p>
          </div>
        `;

    // 2. 判断 infoWindow 实例是否存在，如果不存在则创建
    if (!infoWindowRef.value) {
      infoWindowRef.value = new AMap.InfoWindow({
        isCustom: true,  // 使用自定义窗体
        autoMove: true, // 点击标记时自动移动地图，使信息窗体完整显示
        offset: new AMap.Pixel(0, -30) // 信息窗体相对标记的偏移
      });
    }

    // 3. 设置信息窗的内容
    infoWindowRef.value.setContent(content);

    // 4. 在被点击的标记位置，打开信息窗
    infoWindowRef.value.open(mapInstance.value, e.target.getPosition());
  });

    markerInstances.push(marker); // 将新创建的标记实例存起来
  });

  // 将所有新标记一次性添加到地图上
  if (mapInstance.value) {
    mapInstance.value.add(markerInstances);
  }
};

onMounted(() => {
  AMapLoader.load({
    "key": "ee0d187b6682c7f482df5159073c3db4",
    "version": "2.0",
    "plugins": [], // 先不在这里加载插件
  }).then((AMap) => {
    // 初始化地图
    mapInstance.value = new AMap.Map('map-container', {
      zoom: 14,
      center: [100.163, 25.694],
      willReadFrequently: true,
    });

    // 加载 MoveAnimation 插件
    AMap.plugin(['AMap.MoveAnimation'], function() {
      console.log('MoveAnimation 插件加载完成');

      // 测试 moveTo 是否可用
      const testMarker = new AMap.Marker({
        position: [100.163, 25.694],
      });

      if (testMarker.moveTo) {
        console.log('✅ moveTo 方法可用');
      } else {
        console.log('❌ moveTo 方法不可用');
      }

      if (testMarker.moveAlong) {
        console.log('✅ moveAlong 方法可用');
      } else {
        console.log('❌ moveAlong 方法不可用');
      }
    });

    // 循环添加标记
    // props.merchants.forEach((merchant, index) => {
    //   const iconUrl = iconMap[merchant.category] || iconMap['default'];
    //
    //   // 创建图标配置
    //   const icon = new AMap.Icon({
    //     size: new AMap.Size(28, 35),    // 图标尺寸
    //     image: iconUrl,                  // 图标图片 URL
    //     imageSize: new AMap.Size(28, 35) // 图标取图大小
    //   });
    //
    //   const marker = new AMap.Marker({
    //     position: [merchant.longitude, merchant.latitude],
    //     title: merchant.name,
    //     icon: icon,
    //     offset: new AMap.Pixel(-14, -35),
    //     clickable: true,
    //     cursor: 'pointer',
    //     zIndex: 100 + index  // 添加 z-index 确保标记在最上层
    //   });
    //
    //   // 如果图标加载失败，使用默认标记
    //   const img = new Image();
    //   img.onerror = () => {
    //     console.warn(`图标加载失败，使用默认标记: ${merchant.name}`);
    //     marker.setIcon(null); // 使用默认标记
    //   };
    //   img.src = iconUrl;

      // // 为标记添加点击事件
      // marker.on('click', (e) => {
      //   flyTo(merchant);
      //
      //   // 1. 构造信息窗的内容 (可以使用 HTML)
      //   const content = // 修改 marker 点击事件中的 content
      //       `
      //       <div style="
      //         background: white;
      //         border-radius: 8px;
      //         box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      //         border: 1px solid #EBEEF5;
      //         padding: 15px;
      //         min-width: 200px;
      //         position: relative;
      //       ">
      //         <div style="
      //           position: absolute;
      //           top: 8px;
      //           right: 8px;
      //           cursor: pointer;
      //           color: #909399;
      //           font-size: 16px;
      //         " onclick="this.parentElement.style.display='none'">×</div>
      //
      //         <h3 style="
      //           font-size: 16px;
      //           font-weight: 600;
      //           margin: 0 0 8px 0;
      //           color: #333;
      //         ">${merchant.name}</h3>
      //         <p style="margin: 0 0 5px 0; color: #666;">
      //           <strong>类型:</strong> ${merchant.category}
      //         </p>
      //         <p style="margin: 0; color: #666;">
      //           <strong>地址:</strong> ${merchant.address}
      //         </p>
      //       </div>
      //     `;
      //
      //   // 2. 判断 infoWindow 实例是否存在，如果不存在则创建
      //   if (!infoWindowRef.value) {
      //     infoWindowRef.value = new AMap.InfoWindow({
      //       isCustom: true,  // 使用自定义窗体
      //       autoMove: true, // 点击标记时自动移动地图，使信息窗体完整显示
      //       offset: new AMap.Pixel(0, -30) // 信息窗体相对标记的偏移
      //     });
      //   }
      //
      //   // 3. 设置信息窗的内容
      //   infoWindowRef.value.setContent(content);
      //
      //   // 4. 在被点击的标记位置，打开信息窗
      //   infoWindowRef.value.open(mapInstance.value, e.target.getPosition());
      //   });
    //   markerInstances.push(marker);
    //   mapInstance.value.add(marker);
    //
    //   // 添加一个地图点击事件，用来关闭信息窗
    //   mapInstance.value.on('click', () => {
    //     if (infoWindowRef.value) {
    //       infoWindowRef.value.close();
    //     }
    //   });
    // });

    // 首次加载时，绘制一次标记
    drawMarkers(AMap);

  }).catch(e => {
    console.error('地图加载失败:', e);
  });
});

// 核心修改4: 使用 watch 来监听 prop 的变化
// 当 App.vue 中的 filteredMerchants 发生改变时，这个函数就会被自动调用
watch(() => props.merchants, (newMerchants) => {
  // 确保地图实例已经准备好
  if (mapInstance.value && window.AMap) {
    drawMarkers(window.AMap);
    // (可选) 每次筛选后，自动调整地图视野以显示所有新标记
    mapInstance.value.setFitView();
  }
});

// 飞行到指定商户位置 - 使用 JSAPI 2.0 的新方法
// 飞行到指定商户位置 - 使用 JSAPI 2.0 的新方法
const flyTo = (merchant) => {
  console.log('flyTo 被调用，目标商户:', merchant.name, '坐标:', [merchant.longitude, merchant.latitude]);

  if (!mapInstance.value) {
    console.error('地图实例未初始化');
    return;
  }

  const targetPosition = [merchant.longitude, merchant.latitude];
  const targetZoom = 17;

  // 获取当前地图状态
  const currentCenter = mapInstance.value.getCenter();
  const currentZoom = mapInstance.value.getZoom();
  console.log('当前位置:', [currentCenter.lng, currentCenter.lat], '缩放级别:', currentZoom);

  // 计算两点之间的距离（使用高德地图的距离计算方法）
  const calculateDistance = (lng1, lat1, lng2, lat2) => {
    // 简化的距离计算（单位：度）
    const dx = Math.abs(lng1 - lng2);
    const dy = Math.abs(lat1 - lat2);
    return Math.sqrt(dx * dx + dy * dy);
  };

  // 计算距离
  const distance = calculateDistance(
      currentCenter.lng,
      currentCenter.lat,
      merchant.longitude,
      merchant.latitude
  );

  // 计算缩放级别差异
  const zoomDiff = Math.abs(currentZoom - targetZoom);

  // 动态计算动画时长
  // 基础时长 + 距离因子 + 缩放因子
  const baseDuration = 500; // 最小时长
  const distanceFactor = distance * 10000; // 距离越远，时间越长
  const zoomFactor = zoomDiff * 100; // 缩放差异越大，时间越长

  // 计算最终时长，设置上下限
  let duration = baseDuration + distanceFactor + zoomFactor;
  duration = Math.min(Math.max(duration, 800), 3000); // 最小800ms，最大3000ms

  console.log('距离:', distance, '缩放差异:', zoomDiff, '动画时长:', duration);

  // 方案1：使用两步动画（先调整缩放，再移动位置）
  const useStepAnimation = zoomDiff > 5 || distance > 0.1;

  if (useStepAnimation) {
    console.log('使用分步动画');

    // 如果距离很远或缩放差异很大，使用分步动画
    if (currentZoom < 10 && targetZoom > 15) {
      // 从很远拉到很近：先移动到目标位置（保持当前缩放），再放大
      mapInstance.value.setCenter(targetPosition, false, duration * 0.6);
      setTimeout(() => {
        mapInstance.value.setZoom(targetZoom, false, duration * 0.4);
      }, duration * 0.6);
    } else if (currentZoom > 15 && distance > 0.05) {
      // 当前很近，要移动到远处：先缩小视野，再移动
      const intermediateZoom = Math.min(currentZoom - 2, 14);
      mapInstance.value.setZoom(intermediateZoom, false, duration * 0.3);
      setTimeout(() => {
        mapInstance.value.setZoomAndCenter(targetZoom, targetPosition, false, duration * 0.7);
      }, duration * 0.3);
    } else {
      // 一般情况：同时进行
      mapInstance.value.setZoomAndCenter(targetZoom, targetPosition, false, duration);
    }
  } else {
    console.log('使用直接动画');
    // 距离较近，直接移动
    mapInstance.value.setZoomAndCenter(targetZoom, targetPosition, false, duration);
  }

  // 备用方案：如果动画出现问题，确保最终位置正确
  setTimeout(() => {
    const finalCenter = mapInstance.value.getCenter();
    const finalZoom = mapInstance.value.getZoom();

    // 检查是否到达目标位置（允许小误差）
    const tolerance = 0.00001;
    if (Math.abs(finalCenter.lng - merchant.longitude) > tolerance ||
        Math.abs(finalCenter.lat - merchant.latitude) > tolerance ||
        Math.abs(finalZoom - targetZoom) > 0.1) {
      console.log('位置修正');
      // 快速修正到目标位置
      mapInstance.value.setZoomAndCenter(targetZoom, targetPosition, true);
    }
  }, duration + 100);
};

// 使用 moveAlong 实现路径动画（示例）
const moveAlongPath = (merchant) => {
  if (!mapInstance.value || !window.AMap) return;

  window.AMap.plugin(['AMap.MoveAnimation'], function() {
    // 创建起点到终点的路径
    const currentCenter = mapInstance.value.getCenter();
    const path = [
      [currentCenter.lng, currentCenter.lat],
      [merchant.longitude, merchant.latitude]
    ];

    // 创建移动标记
    const movingMarker = new window.AMap.Marker({
      position: path[0],
      icon: new window.AMap.Icon({
        size: new window.AMap.Size(28, 35),
        image: '/images/icon-default.png',
        imageSize: new window.AMap.Size(28, 35),
      }),
      autoRotation: true, // 自动旋转
    });

    mapInstance.value.add(movingMarker);

    // 使用 moveAlong 沿路径移动
    if (movingMarker.moveAlong) {
      console.log('使用 moveAlong 方法');

      // moveAlong 可以接受路径数组或带时间的路径数组
      movingMarker.moveAlong(path, {
        duration: 1000,  // 总时长
        autoRotation: true, // 自动旋转
      });

      // 或者使用更详细的配置
      // const customPath = [
      //   { position: path[0], duration: 500 },
      //   { position: path[1], duration: 500 }
      // ];
      // movingMarker.moveAlong(customPath);

      // 监听移动事件
      movingMarker.on('moving', function(e) {
        // 可以在这里同步更新地图视角
        // mapInstance.value.setCenter(e.position);
      });

      movingMarker.on('moveend', function() {
        // 移动结束后清除标记
        setTimeout(() => {
          mapInstance.value.remove(movingMarker);
        }, 500);
      });
    }
  });
};

// 暴露方法给父组件
defineExpose({
  flyTo,
  moveAlongPath,
  // 获取地图状态
  getMapStatus: () => {
    if (mapInstance.value) {
      const center = mapInstance.value.getCenter();
      const zoom = mapInstance.value.getZoom();
      console.log('地图状态 - 中心:', [center.lng, center.lat], '缩放:', zoom);

      // 测试一个标记的方法可用性
      const testMarker = new window.AMap.Marker({
        position: [center.lng, center.lat],
      });

      console.log('可用方法:', {
        moveTo: !!testMarker.moveTo,
        moveAlong: !!testMarker.moveAlong,
        panTo: !!mapInstance.value.panTo,
        setZoomAndCenter: !!mapInstance.value.setZoomAndCenter
      });
    }
  },
  // 利用 markers 数组的一些实用方法
  hideAllMarkers: () => {
    markerInstances.value.forEach(marker => marker.hide());
  },
  showAllMarkers: () => {
    markerInstances.value.forEach(marker => marker.show());
  },
  hideMarkersByCategory: (category) => {
    markerInstances.value.forEach((marker, index) => {
      if (merchants[index].category === category) {
        marker.hide();
      }
    });
  },
  showMarkersByCategory: (category) => {
    markerInstances.value.forEach((marker, index) => {
      if (merchants[index].category === category) {
        marker.show();
      }
    });
  },
  clearAllMarkers: () => {
    // 批量移除所有标记
    if (mapInstance.value && markers.value.length > 0) {
      mapInstance.value.remove(markers.value);
      markerInstances.value = [];
    }
  },
  getMarkersCount: () => markerInstances.value.length,
  // 聚焦到所有标记
  fitToAllMarkers: () => {
    if (mapInstance.value && markerInstances.length > 0) {
      // --- 核心修复 ---
      // 调用 setFitView 时，必须传入要适应视野的覆盖物数组。
      // 我们还可以额外加一些参数让体验更好。
      mapInstance.value.setFitView(
          markerInstances,      // 1. 告诉地图需要适应视野的标记数组
          false,                // 2. 是否立即完成（false 表示有动画效果）
          [150, 150, 150, 400], // 3. 四周的留白边距, [上, 右, 下, 左] (单位px), 左侧留白多一些，避免被列表遮挡
          16                    // 4. 允许的最大缩放级别
      );
    } else {
      // 这部分逻辑在你之前的代码里有，非常好，我们保留它
      ElMessage.info('当前没有可供聚焦的标记');
    }
  }
});
</script>

<style scoped>
#map-container {
  width: 100%;
  height: 100%;
}
</style>