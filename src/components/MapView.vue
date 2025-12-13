<template>
  <div id="map-container"></div>
</template>

<script setup>
import { ref, onMounted, shallowRef, watch } from 'vue';
import AMapLoader from '@amap/amap-jsapi-loader';

const props = defineProps({
  merchants: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['marker-click']);

const mapInstance = shallowRef(null);
const markerInstances = [];
const infoWindowRef = shallowRef(null);

const iconMap = {
  'default': '/images/icon-default.png',
  '书店与咖啡': '/images/icon-cafe.png',
  '特色餐饮': '/images/icon-food.png',
  '手工艺': '/images/icon-craft.png',
  '民宿': '/images/icon-hotel.png'
};

const drawMarkers = (AMap) => {
  if (mapInstance.value) {
    mapInstance.value.remove(markerInstances);
    markerInstances.length = 0;
  }

  props.merchants.forEach(merchant => {
    const iconUrl = iconMap[merchant.category] || iconMap['default'];
    const icon = new AMap.Icon({
      size: new AMap.Size(28, 35),
      image: iconUrl,
      imageSize: new AMap.Size(28, 35)
    });
    const marker = new AMap.Marker({
      position: [merchant.longitude, merchant.latitude],
      title: merchant.name,
      icon: icon,
      offset: new AMap.Pixel(-14, -35),
    });

    marker.on('click', (e) => {
      flyTo(merchant);
      emit('marker-click', merchant);

      const content = `
        <div style="
          background: rgba(253, 248, 243, 0.98);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(74, 69, 65, 0.15);
          border: 1px solid rgba(139, 115, 85, 0.15);
          padding: 20px;
          min-width: 240px;
          max-width: 300px;
          font-family: 'Noto Sans SC', sans-serif;
        ">
          <div style="
            position: absolute;
            top: 12px;
            right: 12px;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: rgba(139, 115, 85, 0.1);
            cursor: pointer;
            color: #7D756D;
            font-size: 18px;
            transition: all 0.2s;
          " onclick="this.parentElement.style.display='none'" 
          onmouseover="this.style.background='#C67B5C'; this.style.color='white'"
          onmouseout="this.style.background='rgba(139, 115, 85, 0.1)'; this.style.color='#7D756D'">×</div>

          <h3 style="
            font-family: 'Noto Serif SC', serif;
            font-size: 18px;
            font-weight: 600;
            margin: 0 0 12px 0;
            color: #4A4541;
            padding-right: 30px;
          ">${merchant.name}</h3>
          
          <div style="
            display: inline-block;
            padding: 4px 10px;
            background: rgba(198, 123, 92, 0.12);
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            color: #C67B5C;
            margin-bottom: 12px;
          ">${merchant.category}</div>
          
          <p style="
            margin: 0 0 8px 0;
            color: #7D756D;
            font-size: 13px;
            line-height: 1.5;
            display: flex;
            align-items: flex-start;
            gap: 6px;
          ">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink: 0; margin-top: 2px; opacity: 0.6;">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            ${merchant.address}
          </p>
          
          ${merchant.opening_hours ? `
            <p style="
              margin: 0;
              color: #9CAF88;
              font-size: 12px;
              font-weight: 500;
              display: flex;
              align-items: center;
              gap: 6px;
            ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity: 0.8;">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              ${merchant.opening_hours}
            </p>
          ` : ''}
        </div>
      `;

      if (!infoWindowRef.value) {
        infoWindowRef.value = new AMap.InfoWindow({
          isCustom: true,
          autoMove: true,
          offset: new AMap.Pixel(0, -35)
        });
      }

      infoWindowRef.value.setContent(content);
      infoWindowRef.value.open(mapInstance.value, e.target.getPosition());
    });

    markerInstances.push(marker);
  });

  if (mapInstance.value) {
    mapInstance.value.add(markerInstances);
  }
};

onMounted(() => {
  AMapLoader.load({
    "key": "ee0d187b6682c7f482df5159073c3db4",
    "version": "2.0",
    "plugins": [],
  }).then((AMap) => {
    mapInstance.value = new AMap.Map('map-container', {
      zoom: 14,
      center: [100.163, 25.694],
      willReadFrequently: true,
      mapStyle: 'amap://styles/whitesmoke',
    });

    AMap.plugin(['AMap.MoveAnimation'], function() {
      console.log('MoveAnimation 插件加载完成');
    });

    mapInstance.value.on('click', () => {
      if (infoWindowRef.value) {
        infoWindowRef.value.close();
      }
    });

    drawMarkers(AMap);
  }).catch(e => {
    console.error('地图加载失败:', e);
  });
});

watch(() => props.merchants, (newMerchants) => {
  if (mapInstance.value && window.AMap) {
    drawMarkers(window.AMap);
    mapInstance.value.setFitView();
  }
});

const flyTo = (merchant) => {
  if (!mapInstance.value) return;

  const targetPosition = [merchant.longitude, merchant.latitude];
  const targetZoom = 17;
  const currentCenter = mapInstance.value.getCenter();
  const currentZoom = mapInstance.value.getZoom();

  const calculateDistance = (lng1, lat1, lng2, lat2) => {
    const dx = Math.abs(lng1 - lng2);
    const dy = Math.abs(lat1 - lat2);
    return Math.sqrt(dx * dx + dy * dy);
  };

  const distance = calculateDistance(
    currentCenter.lng,
    currentCenter.lat,
    merchant.longitude,
    merchant.latitude
  );

  const zoomDiff = Math.abs(currentZoom - targetZoom);
  const baseDuration = 500;
  const distanceFactor = distance * 10000;
  const zoomFactor = zoomDiff * 100;

  let duration = baseDuration + distanceFactor + zoomFactor;
  duration = Math.min(Math.max(duration, 800), 3000);

  const useStepAnimation = zoomDiff > 5 || distance > 0.1;

  if (useStepAnimation) {
    if (currentZoom < 10 && targetZoom > 15) {
      mapInstance.value.setCenter(targetPosition, false, duration * 0.6);
      setTimeout(() => {
        mapInstance.value.setZoom(targetZoom, false, duration * 0.4);
      }, duration * 0.6);
    } else if (currentZoom > 15 && distance > 0.05) {
      const intermediateZoom = Math.min(currentZoom - 2, 14);
      mapInstance.value.setZoom(intermediateZoom, false, duration * 0.3);
      setTimeout(() => {
        mapInstance.value.setZoomAndCenter(targetZoom, targetPosition, false, duration * 0.7);
      }, duration * 0.3);
    } else {
      mapInstance.value.setZoomAndCenter(targetZoom, targetPosition, false, duration);
    }
  } else {
    mapInstance.value.setZoomAndCenter(targetZoom, targetPosition, false, duration);
  }

  setTimeout(() => {
    const finalCenter = mapInstance.value.getCenter();
    const finalZoom = mapInstance.value.getZoom();
    const tolerance = 0.00001;
    if (Math.abs(finalCenter.lng - merchant.longitude) > tolerance ||
        Math.abs(finalCenter.lat - merchant.latitude) > tolerance ||
        Math.abs(finalZoom - targetZoom) > 0.1) {
      mapInstance.value.setZoomAndCenter(targetZoom, targetPosition, true);
    }
  }, duration + 100);
};

defineExpose({
  flyTo,
  fitToAllMarkers: () => {
    if (mapInstance.value && markerInstances.length > 0) {
      mapInstance.value.setFitView(
        markerInstances,
        false,
        [150, 150, 150, 400],
        16
      );
    }
  }
});
</script>

<style scoped>
#map-container {
  width: 100%;
  height: 100%;
}

/* 隐藏高德地图 logo 和版权信息（根据需要调整） */
:deep(.amap-logo) {
  display: none !important;
}

:deep(.amap-copyright) {
  opacity: 0.5;
}
</style>
