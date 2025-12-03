<template>
  <div class="page">
    <van-sticky>
      <div class="search-input-box">
        <van-field
          autofocus
          ref="fieldSearchForm"
          v-model="searchForm.name"
          clearable
          placeholder="请输入分组名称搜索"
          @keydown.enter.prevent="search"
          enterkeyhint="搜索"
        />
        <span @click="search" class="search-txt">搜索</span>
      </div>
    </van-sticky>
    <div class="group-box" v-if="groupList.length">
      <van-collapse v-model="activeNames">
        <van-collapse-item :title="item.name" :name="item.id" v-for="(item, index) in groupList" :key="index">
          <div class="group-list">
            <div class="group-item" v-for="(listItem, idx) in item.items" :key="idx" @click="linkCreateProcess(listItem)">
              <div class="group-item-left" :style="'background:'+ listItem.bgColor">
                {{listItem.firstName}}
              </div>
              <div class="group-item-right">
                <div class="group-item-title">
                  {{listItem.formName}}
                </div>
                <div class="group-item-desc">
                  {{listItem.remark}}
                </div>
              </div>
            </div>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
    <div class="no-data-box" v-else-if="groupList.length === 0">
      <noDataDefault :message="'暂无流程数据'"/>
    </div>
    <!--页面加载中-->
    <van-overlay :show="loading" @click="loading = false" class="loading-box">
      <van-loading />
    </van-overlay>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { ref, reactive, onActivated  } from 'vue'
import noDataDefault from '@/component/noDataDefault.vue'
import { getGroup } from '@/api/groupManage'
const searchForm = reactive({
  name:''
})
const fieldSearchForm = ref<any>(null)

const loading = ref(false)
const activeNames = ref([] as string[])
type GroupList = {
  id: string,
  name: string,
  items: {
    formId: string,
    bgColor: string,
    firstName: string,
    formName: string,
    remark: string
  }[]
}[]
let groupList = ref([] as GroupList)
const activeGroup = ref(0)
const colorArr = ['#69C3FF', '#FFB053', '#FF9292', '#4ED6AF', '#BA97FF', '#8BD48C', '#EC92E8', '#F9C60E', '#878CFF', '#FF835B', '#98ABD8', '#8CCD53']
async function search() {
  if (fieldSearchForm.value) {
    fieldSearchForm.value.blur()
  }
  const params = searchForm
  loading.value = true
  const res = await getGroup(params)
  loading.value = false
  if (res.code === '0') {
    const list = res.data || []
    list.forEach((item: { items: any; }) => {
      item.items.forEach((listItem: { bgColor: string; firstName: any; formName: string }) => {
        listItem.bgColor = colorArr[Math.floor(Math.random() * colorArr.length)]
        if (listItem.formName) {
          // 使用 match 方法获取中文名，并确保不会因为 formName 为空而引发错误
          listItem.firstName = listItem.formName.match(/[\u4e00-\u9fa5]/)?.[0] || listItem.formName.substring(0, 1)
        } else {
          // 如果 formName 不存在，设置一个默认值
          listItem.firstName = ''
        }
      })
    })
    groupList.value = list
    // 设置默认全展开
    activeNames.value = list.map((item: { id: any }) => item.id)
  }
}

// 在组件进入页面时获取接口数据
onActivated(() => {
  if (window.pathFrom === '/groupManage') {
    groupList.value = []
    searchForm.name = ''
  }
})

// 跳转创建流程页
function linkCreateProcess(item: { formId: any; formName: any }) {
  router.push({
    path: '/createProcess',
    query: {
      processInstanceId: item.formId,
      title: item.formName
    }
  })
}

</script>

<style lang="less" scoped>
.search-input-box{
  position: relative;
  z-index: 100;
  display: flex;
  align-items: center;
  padding: 16px 32px;
  background: #fff;
  :deep(.van-field){
    font-size: 24px;
    width: 618px;
    background: #F7F8FA;
    border-radius: 36px;
    padding: 12px 24px;
  }
  // span{
  //   font-size: 28px;
  //   padding-left: 10px;
  //   cursor: pointer;
  // }
  .search-txt {
    font-size: 28px;
    padding-left: 10px;
    cursor: pointer;
    color: #606060;
  }
}
.group-box {
  :deep(.van-collapse-item){
    margin-bottom: 10px;
    .van-collapse-item__title{
      font-weight: 600;
      font-size: 32px;
      padding: 24px 32px;
    }
    .van-collapse-item__content{
      padding: 0;
    }
  }
  .group-list{
    padding:0 32px;
    .group-item{
      display: flex;
      align-items: center;
      border-bottom: 1px solid #E7E7E7;
      padding: 24px 24px 24px 0;
      cursor: pointer;
      .group-item-left{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 80px;
        color: #fff;
        background: #BA97FF ;
        border-radius: 10px;
        font-size: 32px;
      }
      .group-item-right{
        width: 560px;
        padding-left: 24px;
        .group-item-title{
          font-weight: 600;
          font-size: 28px;
          color: #191919;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .group-item-desc{
          font-size: 24px;
          color: #606060;
          line-height: 40px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .group-item:last-child{
      border-bottom: none;
    }
  }
}
.no-data-box{
  overflow: hidden;
  height: calc(100vh - 104px);
  background: #fff;
  .no-data{
    margin-top: 408px;
  }
}
.loading-box{
  display: flex;
  z-index: 100;
  align-items: center;
  justify-content: center;
  
}
</style>