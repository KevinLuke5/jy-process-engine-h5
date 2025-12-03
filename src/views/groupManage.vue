<template>
  <div class="page">
    <van-sticky>
      <div class="search-input-box" @click="toSearch">
        <van-field
          v-model="searchForm.title"
          readonly
          clearable
          left-icon="search"
          placeholder="请输入分组名称搜索"
        />
      </div>
      <!--tab-->
      <div class="tab-box">
        <van-tabs color="#FF7752" line-height="4px" line-width="20px" title-active-color="#37414A" title-inactive-color="#9AA3AD" v-model:active="activeTab"  @click-tab="jumpToAnchor">
          <van-tab v-for="(item, index) in groupList" :key="index" :title="item.name" :name="item.id"></van-tab>
        </van-tabs>
        <div class="tab-more-btn" @click="showSelectGroupFun"><van-icon name="list-switch" /></div>
      </div>
      <!--下拉-->
      <div class="select-box" v-if="showSelectGroup">
        <div class="select-box-content">
          <div :class="['select-box-item', activeGroup === index ? 'on' : '']" v-for="(item, index) in groupList" :key="index" @click="clickGroup(item, index)"> {{item.name}} <van-icon name="success" v-if="activeGroup === index"/></div>
        </div>
      </div>
    </van-sticky>
    
    <!--全部分组-->
    <div class="group-box">
      <van-collapse v-model="activeNames">
        <van-collapse-item :title="item.name" :name="item.id" v-for="(item, index) in groupList" :key="index" :id="item.id">
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
  </div>
  <!--下拉遮罩-->
  <van-overlay :show="showSelectGroup" @click="showSelectGroup = false"></van-overlay>
</template>

<script setup lang="ts">
import { ref, onActivated, reactive, nextTick } from 'vue'
import router from '@/router'
import { getGroup } from '@/api/groupManage'
const searchForm = reactive({
  title: ''
})
const activeTab = ref() // 选中的分组
const activeNames = ref([] as string[])
const showSelectGroup = ref(false)
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
let groupList = reactive([] as GroupList)
const activeGroup = ref(0)
const colorArr = ['#69C3FF', '#FFB053', '#FF9292', '#4ED6AF', '#BA97FF', '#8BD48C', '#EC92E8', '#F9C60E', '#878CFF', '#FF835B', '#98ABD8', '#8CCD53']

onActivated(() => {
  if (window.pathFrom === '/workflowManage') {
    getLists()
  }
})
// 获取分组列表
async function getLists() {
  const res = await getGroup({})
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
    groupList = list
    // 设置默认全展开
    activeNames.value = groupList.map(item => item.id)
    // 更新视图
    nextTick(() => {
      activeTab.value = String(activeGroup.value + 1)
    })
  }
}

// 去查询
function toSearch() {
  router.push({
    path: '/searchGroup'
  })
}
// 锚点
function jumpToAnchor(val: { name: string; }) {
  console.log(val)
  const anchorElement = document.getElementById(val.name)
  if (anchorElement) {
    window.scrollTo({
      top: anchorElement.offsetTop,
      behavior: 'smooth'
    });
  }
}

// 显示更多分组
function showSelectGroupFun() {
  const defaultIndex = groupList.findIndex(item => item.id === activeTab.value)
  activeGroup.value = defaultIndex
  showSelectGroup.value = true
}
// 点击下拉分组
function clickGroup(item: { id: any; name: any }, index: number) {
  activeGroup.value = index
  activeTab.value = item.id
  showSelectGroup.value = false
  jumpToAnchor({ name: item.id})
}

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
  cursor: pointer;
  :deep(.van-field){
    font-size: 24px;
    background: #F7F8FA;
    border-radius: 36px;
    padding: 16px 24px;
  }
  span{
    font-size: 28px;
    padding-left: 10px;
  }
}
.tab-box{
  position: relative;
  padding: 0 88px 0 32px;
  background: #fff;
  color:#606060;
  :deep(.van-tabs){
    font-size: 28px;
    .van-tab{
      flex: none !important;
    }
    .van-tab--grow{
      padding:0 16px !important
    }
    .van-tab__text--ellipsis{
      font-size: 28px;
      overflow: inherit;
    }
    .van-tabs__wrap{
      height: 88px;
    }
    .van-tab--active{
      color: #FF7515 !important;
    }
  }
  .tab-more-btn{
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    right: 0;
    width: 88px;
    height: 88px;
    font-size: 34px;
    background: #FFFFFF;
  }
}
.select-box{
  position: absolute;
  top: 104px;
  left: 0;
  width: 100%;
  z-index: 100;
  background: #fff;
  padding: 20px 0;
  .select-box-content{
    max-height: 800px;
    font-size: 24px;
    overflow-y: auto;
  }
  .select-box-item{
    padding: 16px 28px;
    font-size: 26px;
    color: #323233;
    line-height: 40px;
    border-bottom: 1px solid #EBEDF0;
  }
  .select-box-item:last-child{
    border-bottom: none
  }
  .select-box-item.on{
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #FF7515;
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
</style>