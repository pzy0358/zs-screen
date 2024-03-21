<template>
  <VScaleScreen height="900" width="1600">
    <div class="all-charts">
      <div class="section-one">
        <img
          class="img-header"
          src="https://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/smartPark/%E5%A4%A7%E5%B1%8F%E5%88%87%E5%9B%BE/%E5%9B%AD%E5%8C%BA%E6%A6%82%E5%86%B5%402x.png"
          alt=""
        />
        <div class="icons-container">
          <div class="item">
            <div class="icons-item building-icon">
              <span class="number">{{ parkInfo.base?.buildingTotal }}</span>
            </div>
            <span class="title">楼宇总数</span>
            <span class="unity">(栋)</span>
          </div>
          <div class="item">
            <div class="icons-item enterprise-icon">
              <span class="number">{{ parkInfo.base?.chargePoleTotal }}</span>
            </div>
            <span class="title">入驻企业总数</span>
            <span class="unity">(家)</span>
          </div>
          <div class="item">
            <div class="icons-item car-icon">
              <span class="number">{{ parkInfo.base?.enterpriseTotal }}</span>
            </div>
            <span class="title">车位总数</span>
            <span class="unity">(个)</span>
          </div>
          <div class="item">
            <div class="icons-item rod-icon">
              <span class="number">{{ parkInfo.base?.parkingTotal }}</span>
            </div>
            <span class="title">一体杆总数</span>
            <span class="unity">(个)</span>
          </div>
        </div>
      </div>
      <div class="section-two">
        <img
          class="img-header"
          src="https://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/smartPark/%E5%A4%A7%E5%B1%8F%E5%88%87%E5%9B%BE/%E5%9B%AD%E5%8C%BA%E5%B9%B4%E5%BA%A6%E6%94%B6%E5%85%A5%E5%88%86%E6%9E%90%402x.png"
          alt="logo"
        />
        <div class="bar-chart-title">
          <span>单位:元</span>
          <div>
            <span class="bar-icon blue-bar-icon"></span>
            <span class="bar-icon red-bar-icon"></span>
            收入情况
          </div>
        </div>
        <div class="bar-chart" id="barChart"></div>
      </div>
      <div class="section-three">
        <img
          alt="logo"
          class="img-header"
          src="https://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/smartPark/%E5%A4%A7%E5%B1%8F%E5%88%87%E5%9B%BE/%E5%9B%AD%E5%8C%BA%E4%BA%A7%E4%B8%9A%E5%88%86%E5%B8%83%402x.png"
        />
        <div class="pie-chart" id="pieChart"></div>
      </div>
    </div>
    <div class="model-container">
      <LoadingComponent :loading="loadStatus"></LoadingComponent>
      <canvas class="canvas-3d" ref="ref3d"></canvas>
      <div
        v-if="modelStatus"
        id="t"
        :class="{ animate__zoomIn: modelStatus }"
        :style="{ left: x + 'px', top: y + 'px' }"
        class="tip animate__animated"
      >
        <span class="close" @mousedown.stop="close"></span>
        <div class="header">{{ buildingInfo?.name }}</div>
      </div>
    </div>
  </VScaleScreen>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'

import VScaleScreen from 'v-scale-screen'
import { useParkInfo, useInitBarChart, useInitPieChart } from './BigScreen/composables/index'

import { Application } from '@splinetool/runtime'

import LoadingComponent from '../components/LoadingComponent.vue'

import { getAreaInfoApi, getBuildingInfoApi } from '../api/park'

const { parkInfo, getParkInfo } = useParkInfo()
const { initBarChart } = useInitBarChart(parkInfo)
const { initPieChart } = useInitPieChart(parkInfo)

const ref3d = ref(null)
const loadStatus = ref(false)
// const modelId = ref()
const showModel = ref(false)
let x = ref()
let y = ref()
const buildingInfo = ref()
const areaInfo = ref()

const init3dModel = () => {
  // 实例化模型加载器以及指定渲染dom
  loadStatus.value = true
  const spline = new Application(ref3d.value)
  spline.load('https://fe-hmzs.itheima.net/scene.splinecode').then(() => {
    loadStatus.value = false

    spline.addEventListener('mouseDown', (e) => {
      x.value = ''
      y.value = ''
      // 坐标 没有
      console.log('e', e)
      // {name : '' , id : ''}
      const params = e.target

      // const obj = spline.findObjectByName(params.name)

      console.log('obj', params)
      if (params.name.indexOf('办公楼') !== -1) {
        console.log('楼宇')
        console.log('--->', params.id)
        getBuildingInfo(params.id)
        window.addEventListener('mousedown', (e) => {
          x.value = e.offsetX
          y.value = e.offsetY
        })
      } else if (params.name.indexOf('停车场') !== -1) {
        console.log('停车场')
        getAreaInfo(params.id)
        x.value = posi.value.x
        y.value = posi.value.y
        window.addEventListener('mousedown', (e) => {
          x.value = e.offsetX
          y.value = e.offsetY
        })
      }
      showModel.value = true
    })
  })
}

const getBuildingInfo = async (id) => {
  try {
    const res = await getBuildingInfoApi(id)
    console.log('res', res)
    buildingInfo.value = res.data
  } catch (e) {
    console.log(e)
  }
}

const getAreaInfo = async (id) => {
  try {
    const res = await getAreaInfoApi(id)
    console.log('area', res)
    areaInfo.value = res.data
  } catch (e) {
    console.log(e)
  }
}

const modelStatus = computed(() => {
  if (x.value && y.value) {
    return true
  } else {
    return false
  }
})

const close = () => {
  x.value = ''
  y.value = ''

  console.log(x.value, y.value)
}

onMounted(async () => {
  await getParkInfo()
  initBarChart()
  initPieChart()
  init3dModel()
})
</script>
<style lang="scss" scoped>
.all-charts {
  width: 480px;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: linear-gradient(
    to left,
    rgba(0, 6, 15, 0) 0%,
    rgba(0, 6, 15, 0) 20%,
    rgba(0, 0, 0, 0.4) 30%,
    rgba(0, 0, 0, 0.6) 40%,
    rgba(1, 4, 11, 1) 70%,
    #04070d 100%
  );
  padding: 80px 20px 0 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #ccc;
}
.img-header {
  height: 30px;
}

.section-one {
  flex-basis: 25%;

  .icons-container {
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
    .item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;

      .icons-item {
        width: 100%;
        height: 80px;
        position: relative;
        .number {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          font-size: 18px;
          font-family: FontquanXinYiGuanHeiTi, FontquanXinYiGuanHeiTi-Regular;
          color: #ffffff;
        }
      }

      .building-icon {
        background: url('@/assets/building-icon.png') no-repeat 50% 0 / contain;
      }

      .enterprise-icon {
        background: url('@/assets/enterprise-icon.png') no-repeat 50% 0 / contain;
      }

      .car-icon {
        background: url('@/assets/car-icon.png') no-repeat 50% 0 / contain;
      }

      .rod-icon {
        background: url('@/assets/rod-icon.png') no-repeat 50% 0 / contain;
      }

      .title .unity {
        font-size: 14px;
        font-weight: 600;
      }

      .title {
        margin-top: 8px;
      }
    }
  }
}
.section-two {
  flex-basis: 35%;
  .bar-chart-title {
    display: flex;
    justify-content: space-between;
    height: 30px;
    align-items: center;

    .bar-icon {
      width: 30px;
      height: 10px;
      background: red;
      display: inline-block;
    }

    .blue-bar-icon {
      background: linear-gradient(90deg, #74c0f8, rgba(116, 192, 248, 0));
    }

    .red-bar-icon {
      background: linear-gradient(90deg, #ff7152, rgba(255, 113, 82, 0));
    }
  }
  .bar-chart {
    width: 100%;
    height: calc(100% - 30px);
  }
}
.section-three {
  flex-basis: 35%;

  .pie-chart {
    height: calc(100% - 30px);
    margin: 0 auto;
    padding-bottom: 20px;
    width: 80%;
  }
}
.model-container {
  width: 100%;
  height: 100%;
  background: black;

  .tip {
    width: 281px;
    height: 140px;
    background: url('@/assets/modal-bg.png') no-repeat;
    background-size: cover;
    color: #fff;
    //display: none;
    position: absolute;
    //left: 0;
    //top: 0;

    .close {
      position: absolute;
      right: 10px;
      top: 10px;
      width: 20px;
      height: 20px;
      background: url('@/assets/modal-close.png') no-repeat;
      background-size: cover;
      cursor: pointer;
    }
  }
}
</style>
