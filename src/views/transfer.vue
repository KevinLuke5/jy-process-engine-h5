<template>
  <div class="page">
    <div class="add-people-box">
      <div class="box-title"><span></span>添加转办人员</div>
      <div class="box-content">
        <div class="box-no-data" v-if="!userList.arr.length">
          <noDataDefault :message="'暂无转办人员'"/>
        </div>
        <div class="box-content-item" v-for="(item, index) in userList.arr" :key="index">
          <span>{{item.name}}</span>
          <img src="https://res.joyoung.com/07/01/icon_reduce.png" @click="deleteUser(index)" alt="删除"/>
        </div>
      </div>
    </div>
    <div class="filter-box">
      <filterTree ref="child" @sendUser="handle"></filterTree>
    </div>
    <div class="btn-group">
      <div class="btn btn-default" @click="goBack">
        取消
      </div>
      <div class="btn btn-primary" @click="btnSubmit">
        转办
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { reactive, ref, onMounted } from 'vue'
import { assignee } from '@/api/transfer'
import { useRoute } from 'vue-router'
import { showSuccessToast, showToast } from 'vant'
import filterTree from '@/component/filterTree.vue'
import noDataDefault from '@/component/noDataDefault.vue'
const child = ref()
const route = useRoute()
let processInstanceId = ''
let taskId = ''
let processFormData:any = {}
const userList = reactive({
  arr: [] as any[]
})
const handle = (list: any) => {
  userList.arr = list
}

onMounted(() => {
  const query = route.query
  processInstanceId = query.processInstanceId as string
  taskId = query.taskId as string
  processFormData = query.formData as any
})

// 删除选中人员
function deleteUser(index: any) {
  userList.arr.splice(index, 1)
  child.value.setUserList(userList.arr)
}
// 确认转办
function btnSubmit() {
  if(!userList.arr.length) {
    showToast('请先选择要转办的人员');
    return 
  }
  const postObj = {
    processInstanceId: processInstanceId,
    taskId: taskId,
    signFlag: false,
    formData: JSON.parse(processFormData),
    transferUserInfo: {
      id: userList.arr[0].id
    },
    signInfo: ''
  }
  assignee(postObj).then(res => {
    if (res.code === '0') {
      showSuccessToast('转办成功！')
      router.back()
      router.back()
    }
  })
}
// 取消
function goBack () {
  router.go(-1)
}
</script>

<style lang="less" scoped>
.page{
  overflow: hidden;
  height: 100%;
  background: #F5F5F5;
  .add-people-box{
    padding: 32px 32px 0 32px;
    background: #fff;
  }
  .filter-box{
    margin-bottom: 160px;
    height: 100%;
    overflow-y: auto;
  }
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
      margin: 10px 20px 10px 0;
      align-items: center;
      img{
        width: 28px;
        height: 28px;
        margin-left: 8px;
        cursor: pointer;
      }
    }
    .box-no-data{
      width: 100%
    }
  }
  .btn-group {
    position: fixed;
    max-width: 750px;
    width: 100%;
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