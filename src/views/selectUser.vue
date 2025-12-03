<template>
  <div class="page">
    <div class="select-person-box" :style="{ width: bodyWidth + 'px', left:'50%', transform: `translateX(-50%)`}">
      <div class="add-people-box">
        <div class="box-title"><span></span>添加人员</div>
        <div class="box-content">
          <div class="box-no-data" v-if="!userList.arr.length">
            <noDataDefault :message="'暂未选择人员'"/>
          </div>
          <div class="box-content-item" v-for="(item, index) in userList.arr" :key="index">
            <span>{{item.name}}</span>
            <img src="https://res.joyoung.com/07/01/icon_reduce.png" @click="deleteUser(index, userList.arr)" alt="删除"/></div>
        </div>
      </div>
      <div class="filter-box">
        <filterTree ref="child" @sendUser="handle"></filterTree>
      </div>
      <div class="btn-group">
        <div class="btn btn-default" @click="router.back()">
          取消
        </div>
        <div class="btn btn-primary" @click="selectPersonBtnSubmit">
          确认
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import noDataDefault from '@/component/noDataDefault.vue'
import filterTree from '@/component/filterTree.vue'

const route = useRoute()
const child = ref()
const currentKey = ref('') // 当前操作的key
const bodyWidth = ref(document.body.clientWidth)
// 人员选择
const showSelect = ref(false)
const userList = reactive({
  arr: [] as any[]
}) 
const processDetail:any = ref({}) 

const handle = (list: any) => {
  userList.arr = list
}
// 在组件进入页面时获取接口数据
onMounted(() => {
  userList.arr = JSON.parse(JSON.stringify(window.userList || []))
  child.value.setSearchTitle(userList.arr)
})
// 删除选中人员
function deleteUser(index: any, item: any) {
  item.splice(index, 1)
  child.value.setUserList(item)
}
// 人员选择确认
function selectPersonBtnSubmit() {
  window.userList = userList.arr
  router.back()
}
</script>

<style lang="less" scoped>
.select-person-box{
  position: fixed;
  height: 100%;
  z-index: 100;
  top: 0;
  left: 0;
  background: #F5F5F5;
  .add-people-box{
    padding: 32px 32px 0 32px;
    background: #fff;
    .box-title{
      font-weight: 600;
      font-size: 32px;
      color: #333333;
      line-height: 44px;
      padding-bottom: 20px;
      span{
        display: inline-block;
        width: 5px;
        height: 22px;
        background: linear-gradient( 180deg, #F78500 0%, #EB6100 100%);
        margin-right: 20px;
      }
    }
  }
  .filter-box{
    margin-bottom: 160px;
    height: 100%;
  }
  .box-content{
    display: flex;
    flex-wrap: wrap;
    .box-content-item{
      display: flex;
      font-size: 28px;
      color: #333333;
      padding: 8px 14px;
      border-radius: 28px;
      background: #F7F8FA;
      margin:10px 20px 10px 0;
      align-items: center;
      img{
        width: 28px;
        height: 28px;
        margin-left: 8px;
      }
    }
    .box-no-data{
      width: 100%
    }
  }
  .btn-group {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
    height: 120px;
    box-shadow: 0px 0px 10px 0px rgba(89,58,0,0.1);
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: #FFF;
    z-index: 1000;
    .btn{
      width: 330px;
      height: 88px;
      border-radius: 44px;
      font-size: 34px;
      text-align: center;
      line-height: 88px;
      cursor: pointer;
    }
    .btn-default{
      color: #171A1D;
      background: #fff;
      border: 1px solid #7E868E;
      margin-right: 24px;
    }
    .btn-primary{
      color: #fff;
      background: #FF7515;
      border: 1px solid #FF7515;
    }
  }
}
</style>