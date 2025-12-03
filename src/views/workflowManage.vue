<template>
  <div class="page">
    <div class="top-box">
      <div class="tabs-box">
        <van-badge v-if="taskCount" :content="taskCount" max="99"  class="vant-badge-box"/>
        <van-tabs
          v-model:active="activeIndex"
          color="#FF7752"
          line-height="4px"
          line-width="40px"
          title-active-color="#37414A"
          title-inactive-color="#9AA3AD"
          @click-tab="changeTab"
        >
          <van-tab
            v-for="(item, index) of tabs"
            :key="index"
            :title="item.label"
            :name="item.value"
          />
        </van-tabs>
      </div>
      <!--搜索-->
      <div class="search-box">
        <!--筛选条件-->
        <div class="search-box-item">
          <div :class="['select-content-box', searchForm.groupId ? 'on' : '']" @click="showSelectBox('group')"><span :class="['content', activeIndex === '0' ? 'two' : 'four']">{{selectGroupVal}}</span><van-icon name="arrow-down" /></div>
          <div :class="['select-content-box', searchForm.startTime ? 'on' : '']"  @click="showSelectBox('time')"><span :class="['content', activeIndex === '0' ? 'two' : 'four']">{{selectTimeVal}}</span><van-icon name="arrow-down" /></div>
          <div v-if="activeIndex !== '0'" :class="['select-content-box', searchForm.businessStatus ? 'on' : '']" @click="showSelectBox('status')"><span :class="['content', activeIndex === '0' ? 'two' : 'four']">{{selectStatusVal}}</span><van-icon name="arrow-down" /></div>
          <div v-if="activeIndex !== '0'"  :class="['select-content-box', searchForm.searchText ? 'on' : '']" @click="showSelectBox('more')"><van-icon name="filter-o" /><span class="content more">更多</span></div>
          <div class="filter-reset-btn" @click="reset">重置</div>
        </div>
        <!--展开-->
        <div class="select-box" v-if="showSelect">
          <!--状态-->
          <div class="select-box-content" v-if="selectActive === 'status'">
            <div :class="['select-box-item',activeStatusIndex === index ? 'on' : '']" v-for="(item, index) in businessStatusList" :key="index" @click="clickFilterStatus(index)"> {{item.label}} <van-icon name="success" v-if="activeStatusIndex === index"/></div>
          </div>
          <!--分组-->
          <div class="select-box-content" v-if="selectActive === 'group'">
            <div :class="['select-box-item',activeGroupIndex === index ? 'on' : '']" v-for="(item, index) in groupList" :key="index" @click="clickFilterGroup(index)"> {{item.label}} <van-icon name="success" v-if="activeGroupIndex === index"/></div>
          </div>
          <!--时间-->
          <div class="select-box-content" v-if="selectActive === 'time'">
            <div class="select-time-item">
              <span :class="activeTimeIndex === index ? 'on' : ''" v-for="(item, index) in timeList" :key="index" @click="clickFilterTime(index)">{{item.label}}</span>
            </div>
            <div class="select-box-item">
              <div class="select-default-box">
                <span>自定义</span>
                <van-field
                  v-model="timeGroup"
                  readonly
                  left-icon="notes-o"
                  placeholder="点击打开日历选择"
                  @click="showCalendar = true"
                />
              </div>
            </div>
          </div>
          <!--搜索更多-->
          <div class="select-box-content" v-if="selectActive === 'more'">
            <div class="search-input-box">
              <van-field
                v-model="searchForm.searchText"
                clearable
                left-icon="search"
                placeholder="请输入流程标题或者发起人"
                @keydown.enter.prevent="clickFilterInput"
                enterkeyhint="搜索"
              />
              <span @click="clickFilterInput">搜索</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="list-box">
      <van-pull-refresh v-if="list.length" v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <van-cell v-for="item in list" :key="item">
            <div class="list-box-item" @click="linkDetail(item)">
              <div class="box-item-top">
                <div class="box-item-top-title">{{item.title}}</div>
                <div :class="['box-item-top-status', item.color]">
                  <span>{{item.tipStr}}</span>
                </div>
              </div>
              <div class="box-item-middle">
                <div><span>流程名称：</span>{{item.processDefinitionName}}</div>
                <div><span>发起人员：</span>{{item.startUser.name}}</div>
                <div><span>提交时间：</span>{{item.startTime}}</div>
              </div>
            </div>
          </van-cell>
        </van-list>
      </van-pull-refresh>
      <div v-else class="no-data">
        <img src="https://res.joyoung.com/33/01/9da21e9c-4b70-4b3a-a5c1-133a9485059a-0f9e499f-ec93-407e-b6a3-c4d80dfbea09.png" alt="暂无数据"/>
        <div>暂无数据</div>
      </div>
    </div>
  </div>
  <!--新增按钮, 只支持内部人员发起流程-->
  <div v-if="userType === 'E'" class="add-workflow" @click="addProcess">
    <img src="https://res.joyoung.com/07/01/icon-add.png" alt="新增流程"/>
  </div>
  <!--下拉遮罩-->
  <van-overlay :show="showSelect" @click="closeFilter"></van-overlay>
  <!-- 底部弹出 -->
  <van-calendar
    v-model:show="showCalendar"
    :style="{ height: '70%', width: bodyWidth + 'px', left:'50%', transform: `translateX(-50%)`, color: '#333'}"
    :min-date="minDate"
    type="range"
    color="#FF7515"
    :default-date="[defaultStartDate, defaultEndDate]"
    @confirm="calendarOnConfirm"
  />
</template>

<script setup lang="ts">
import { ref, reactive, onActivated  } from 'vue'
import router from '@/router'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { findLabelByVal } from '@/utils/utils'
import { getToDoList, getDoneList, getRecordList, getTaskCount, getApplyList} from '@/api/workflowManage'
import { getGroupList } from '@/api/common'
const userType = localStorage.getItem('userInfo.userType')
const list:any = ref([]);
const loading = ref(false);
const finished = ref(false);
const showSearchDialog = ref(false);
const showCalendar = ref(false);
const taskCount = ref(0)
let defaultStartDate = ref(new Date())
let defaultEndDate = ref(new Date())
const route = useRoute()
let searchForm = reactive({
  searchText: '',
  groupId: '',
  businessStatus: '',
  startTime: '',
  endTime: '',
  pageNo: 1,
  pageSize: 10
})
const tabs = [
  {
    label: '待办',
    value: '0'
  },
  {
    label: '已办',
    value: '1'
  },
  {
    label: '分阅',
    value: '2'
  },
  {
    label: '已发起',
    value: '3'
  }
]
let activeIndex = ref('0') // tab索引
const minDate = new Date(2020, 1, 1)
// 筛选条件
const businessStatusList = [
  {
    label: '全部',
    value: '',
    color: ''
  },
  {
    label: '正在处理',
    value: '1',
    color: 'status-doing'
  },
  {
    label: '撤销',
    value: '2',
    color: 'status-warning'
  },
  {
    label: '驳回',
    value: '3',
    color: 'status-warning'
  },
  {
    label: '办结',
    value: '4',
    color: 'status-success'
  },
  {
    label: '系统处理',
    value: '5',
    color: 'status-success'
  }
]  // 流程状态
let groupList = reactive([
  {
    label: '全部分组',
    value: ''
  }
]) // 全部分组
const timeList = [
  {
    label: '全部时间',
    value: ''
  },
  {
    label: '最近三天',
    value: '1'
  },
  {
    label: '最近一周',
    value: '2'
  },
  {
    label: '最近一月',
    value: '3'
  }
]
// 展开下拉筛选
const showSelect:any = ref(false)
// 筛选默认值
const selectGroupVal = ref('全部分组')
const selectTimeVal = ref('全部时间')
const selectStatusVal = ref('全部状态')
// 时间查询按钮索引
const activeTimeIndex = ref(0)
// 全部时间
const allTime = dayjs().format('YYYY-MM-DD')
// 三天前
const threeDays = dayjs().subtract(3, 'day').format('YYYY-MM-DD')
// 最近一周
const oneWeek = dayjs().subtract(7, 'day').format('YYYY-MM-DD')
// 最近一个月
const oneMonth = dayjs().subtract(1, 'month').format('YYYY-MM-DD')
const selectActive:any = ref('') // 点击时间条件按钮索引
const activeGroupIndex = ref(0)
const activeStatusIndex = ref(0)
const timeGroup = ref('') // 自定义时间
const bodyWidth = ref(document.body.clientWidth)
const refreshing = ref(false)

onActivated(async () => {
  if (window.localStorage.getItem('tab')) {
    activeIndex.value = localStorage.getItem('tab')?.toString() || '0'
    window.localStorage.removeItem('tab')
  }
  getTaskCounts()
  await getGroupLists()
  searchList()
})

// 获取待办数
async function getTaskCounts() {
  const res = await getTaskCount({})
  if(res.code === '0') {
    taskCount.value = res.data
  }
}

// 获取分组列表
async function getGroupLists() {
  const res = await getGroupList({})
  if (res.code === '0') {
    groupList = [
      {
        label: '全部分组',
        value: ''
      }
    ]
    groupList.push(...res.data.map((item: { groupName: any; groupId: any; })=>{
      return {
        label: item.groupName,
        value: item.groupId
      }
    }))
    defaultChoice() // 根据路由参数设置默认分组
  }
}

// 根据路由参数设置默认分组
function defaultChoice() {
  const query = route.query || ''
  if (query && query.defaultSelectGroup) {
    const defaultIndex = groupList.findIndex(item => {
      return item.value.toString() === query.defaultSelectGroup
    })
    if (defaultIndex !== -1) {
      searchForm.groupId = groupList[defaultIndex].value || '0'
      selectGroupVal.value = groupList[defaultIndex].label || '全部分组'
      activeGroupIndex.value = defaultIndex
    }
  }
}
// 加载数据
function onLoad() {
  if (refreshing.value) {
    list.value = [];
    refreshing.value = false;
  }
  loading.value = true
  if (activeIndex.value === '0') {
    getToDoLists()
  }
  if (activeIndex.value === '1') {
    getDoneLists()
  }
  if (activeIndex.value === '2') {
    getRecordLists()
  }
  if (activeIndex.value === '3') {
    getApplyLists()
  }
}

function changeTab(val: { name: string; }) {
  showSelect.value = false
  showCalendar.value = false
  reset()
  if(val.name === '0') {
    activeIndex.value = '0'
    getToDoLists()
  }
  if (val.name === '1') {
    activeIndex.value = '1'
    getDoneLists()
  }
  if (val.name === '2') {
    activeIndex.value = '2'
    getRecordLists()
  }
  if (val.name === '3') {
    activeIndex.value = '3'
    getApplyLists()
  }
}
// 重置过滤条件
function reset() {
  searchForm.searchText = ''
  searchForm.groupId = ''
  searchForm.businessStatus = ''
  searchForm.startTime = ''
  searchForm.endTime = ''
  searchForm.pageNo = 1
  searchForm.pageSize = 10
  activeStatusIndex.value = 0
  selectStatusVal.value = '全部状态'
  activeGroupIndex.value = 0
  selectGroupVal.value = '全部分组'
  selectTimeVal.value = '全部时间'
  activeTimeIndex.value = 0
  timeGroup.value = ''
  list.value = []
  finished.value = false
  searchForm.pageNo = 1
  loading.value = true
  if (activeIndex.value === '0') {
    getToDoLists()
  }
  if (activeIndex.value === '1') {
    getDoneLists()
  }
  if (activeIndex.value === '2') {
    getRecordLists()
  }
  if (activeIndex.value === '3') {
    getApplyLists()
  }
}

// 我的待办
async function getToDoLists() {
  const params = searchForm
  const res = await getToDoList(params)
  if (res.code === '0') {
    loading.value = false
    const dataList = res.data.records
    dataList.forEach((item: {
      tipStr: any,
      currentActivityName: any, businessStatusStr: void; businessStatus: string; color: string 
}) => {
      item.businessStatusStr = findLabelByVal( businessStatusList, item.businessStatus, 'string')
      item.color = businessStatusList.filter(val => val.value === item.businessStatus)[0].color
      item.tipStr = item.currentActivityName
    })
    if (list === null || dataList.length === 0) {
      // 加载结束
      finished.value = true
      return
    }
    list.value = list.value.concat(dataList)
    if(dataList.length < searchForm.pageSize) {
      // 页面数据已加载完
      finished.value = true
    }
    searchForm.pageNo++;
  }
}

// 我的已办
async function getDoneLists() {
  const params = searchForm
  const res = await getDoneList(params)
  if (res.code === '0') {
    loading.value = false
    const dataList = res.data.records
    dataList.forEach((item: { businessStatusStr: void; businessStatus: string; color: string; tipStr: any; currentActivityName: any }) => {
      item.businessStatusStr = findLabelByVal( businessStatusList, item.businessStatus, 'string')
      if(businessStatusList.filter(val => val.value === item.businessStatus).length){
        item.color = businessStatusList.filter(val => val.value === item.businessStatus)[0].color
      } else {
        item.color = ''
      }
      item.tipStr = item.businessStatus === '4' ? '已完成': item.currentActivityName
    })
    if (list === null || dataList.length === 0) {
      // 加载结束
      finished.value = true
      return
    }
    list.value = list.value.concat(dataList)
    if(dataList.length < searchForm.pageSize) {
      // 页面数据已加载完
      finished.value = true
    }
    searchForm.pageNo++;
  }
}

// 我的分阅
async function getRecordLists() {
  const params = searchForm
  const res = await getRecordList(params)
  if (res.code === '0') {
    loading.value = false
    const dataList = res.data.content
    dataList.forEach((item: { businessStatusStr: void; businessStatus: string; color: string; tipStr: any; currentActivityName: any }) => {
      item.businessStatusStr = findLabelByVal( businessStatusList, item.businessStatus, 'string')
      item.color = businessStatusList.filter(val => val.value === item.businessStatus)[0].color
      item.tipStr = item.businessStatus === '4' ? '已完成': item.currentActivityName
    })
    if (list === null || dataList.length === 0) {
      // 加载结束
      finished.value = true
      return
    }
    list.value = list.value.concat(dataList)
    if(dataList.length < searchForm.pageSize) {
      // 页面数据已加载完
      finished.value = true
    }
    searchForm.pageNo++;
  }
}

// 已发起
async function getApplyLists() {
  const params = searchForm
  const res = await getApplyList(params)
  if (res.code === '0') {
    loading.value = false
    const dataList = res.data.records
    dataList.forEach((item: { businessStatusStr: void; businessStatus: string; color: string; tipStr: any; currentActivityName: any }) => {
      item.businessStatusStr = findLabelByVal( businessStatusList, item.businessStatus, 'string')
      item.color = businessStatusList.filter(val => val.value === item.businessStatus)[0].color
      item.tipStr = item.businessStatus === '4' ? '已完成': item.currentActivityName
    })
    if (list === null || dataList.length === 0) {
      // 加载结束
      finished.value = true
      return
    }
    list.value = list.value.concat(dataList)
    if(dataList.length < searchForm.pageSize) {
      // 页面数据已加载完
      finished.value = true
    }
    searchForm.pageNo++;
  }
}


// 显示筛选下拉框
function showSelectBox(val: any) {
  selectActive.value = val
  showSelect.value = true
}

// 点击筛选状态
function clickFilterStatus(index:number) {
  activeStatusIndex.value = index
  selectStatusVal.value = businessStatusList[index].label
  searchForm.businessStatus = businessStatusList[index].value
  showSelect.value = false
  searchList()
}
// 点击筛选分组
function clickFilterGroup(index:number) {
  activeGroupIndex.value = index
  selectGroupVal.value = groupList[index].label
  searchForm.groupId = groupList[index].value
  showSelect.value = false
  searchList()
}
// 点击筛选时间
function clickFilterTime(index:number) {
  activeTimeIndex.value = index
  switch (index) {
    case 0:
      // 全部时间
      searchForm.startTime = ''
      searchForm.endTime = ''
      timeGroup.value = ''
      selectTimeVal.value = '全部时间'
      break
    case 1:
      // 最近三天
      searchForm.startTime = threeDays
      searchForm.endTime = allTime
      timeGroup.value = `${threeDays} ~ ${allTime}`
      selectTimeVal.value = '最近三天'
      defaultStartDate.value = new Date(threeDays)
      defaultEndDate.value = new Date(allTime)
      break
    case 2:
      // 最近一周
      searchForm.startTime = oneWeek
      searchForm.endTime = allTime
      timeGroup.value = `${oneWeek} ~ ${allTime}`
      selectTimeVal.value = '最近一周'
      defaultStartDate.value = new Date(oneWeek)
      defaultEndDate.value = new Date(allTime)
      break
    case 3:
      // 最近一个月
      searchForm.startTime = oneMonth
      searchForm.endTime = allTime
      timeGroup.value = `${oneMonth} ~ ${allTime}`
      selectTimeVal.value = '最近一个月'
      defaultStartDate.value = new Date(oneMonth)
      defaultEndDate.value = new Date(allTime)
  }
  showSelect.value = false
  searchList()
}

// 点击搜索流程名称或发起人
function clickFilterInput() {
  showSelect.value = false
  searchList()
}
// 查询数据
function searchList() {
  showSelect.value = false
  loading.value = true
  finished.value = false
  searchForm.pageNo = 1
  list.value = []
  if (activeIndex.value === '0') {
    getToDoLists()
  }
  if (activeIndex.value === '1') {
    getDoneLists()
  }
  if (activeIndex.value === '2') {
    getRecordLists()
  }
  if (activeIndex.value === '3') {
    getApplyLists()
  }
}
// 关闭筛选
function closeFilter() {
  showSelect.value = false
}

// 日历确认
function calendarOnConfirm(val: (string | number | Date | dayjs.Dayjs | null | undefined)[]) {
  showCalendar.value = false
  const startTime = dayjs(val[0]).format('YYYY-MM-DD')
  const endTime = dayjs(val[1]).format('YYYY-MM-DD')
  searchForm.startTime = startTime
  searchForm.endTime = endTime
  timeGroup.value = `${startTime} ~ ${endTime}`
  showSelect.value = false
  activeTimeIndex.value = 0
  selectTimeVal.value = '全部时间'
  searchList()
}

// 跳转流程详情
function linkDetail(item: { processInstanceId: any; taskId: any, processDefinitionName: string, mobileUrl: string }) {
  window.point_diy.send_data('click_process_detail', JSON.stringify({ id: item.processInstanceId, name: item.processDefinitionName }))
  const { processInstanceId, taskId } = item
  if (item.mobileUrl) { // 如果配置了链接，则跳转外部链接
    window.location.href = item.mobileUrl + (processInstanceId ? `&processInstanceId=${processInstanceId}` : '') + (taskId ? `&taskId=${taskId}` : '')
  } else {
    if (activeIndex.value === '0') {
      router.push({
        path: '/detail',
        query: {
          processInstanceId: processInstanceId,
          taskId: taskId
        }
      })
    } else {
      router.push({
        path: '/detail',
        query: {
          processInstanceId: processInstanceId
        }
      })
    }
    
  }
  
}

// 新增流程
function addProcess() {
  router.push({
    path: '/groupManage'
  })
}

function onRefresh() {
  searchForm.pageNo = 1
  // 清空列表数据
  finished.value = false;
  // 重新加载数据
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true;
  onLoad();
}

</script>

<style lang="less" scoped>
.page{
  background: #F5F5F5;
  .top-box{
    position: fixed;
    z-index: 10;
    max-width: 20rem;
    width: 100%;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    .tabs-box{
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      height: 88px;
      background: #fff;
      :deep(.van-tabs){
        position: relative;
        width: 100%;
        color: #969799;
        .van-tab{
          font-size: 28px;
        }
        .van-tab__text--ellipsis{
          overflow: inherit;
        }
        .van-tab--active{
          color: #FF7515 !important;
        }
      }
      .vant-badge-box{
        position: absolute;
        right: 620px;
        top: 40%;
        transform: translate(100%, -50%);
        padding: 0 13px;
        // width: 40px;
        height: 38px;
        line-height: 38px;
        color: #FFF;
        text-align: center;
        font-size: 20px;
        font-weight: normal;
        background: #FF3532;
        border-radius: 22px;
        box-sizing: border-box;
        z-index: 999;
      }
      .tabs-box-filter{
        display: flex;
        align-items: center;
        width: 156px;
        padding-left: 30px;
        font-size: 28px;
        color: #333333;
        text-align: center;
        border-left: 1px solid #EBEDF0;
        cursor: pointer;
        img{
          width: 32px;
          height: 32px;
        }
      }
    }
  }

  .list-box{
    padding-top: 200px;
    .list-box-item{
      position: relative;
      cursor: pointer;
      .box-item-top{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .box-item-top-title{
          width: 530px;
          font-weight: 600;
          font-size: 28px;
          color: #333333;
          line-height: 40px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .box-item-top-status{
          display: flex;
          line-height: 32px;
          font-size: 24px;
          padding: 4px 16px;
          border-radius: 21px;
          font-weight: bold;
          span{
            display: block;
            padding-right: 5px;
            max-width: 180px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .status-doing{
          color: #FF7515;
          background: rgba(255, 117, 21, 0.1)
        }
        .status-success{
          color: #008907;
          background: rgba(0, 137, 7, 0.1)
        }
        .status-warning{
          color: #FE4040;
          background: rgba(254, 64, 64, 0.1);
        }
      }
      .box-item-middle{
        justify-content: space-around;
        align-items: center;
        position: relative;
        padding-right: 70px;
        font-size: 24px;
        color: #333;
        line-height: 33px;
        div{
          margin-top: 10px;
        }
        span{
          color: #666;
        }
      }
      .box-item-middle-img{
        position: absolute;
        right: 32px;
        top: 50%;
        transform: translateY(-50%);
        width: 36px;
        height: 36px;
        cursor: pointer;
      }
    }

    .no-data{
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-weight: 400;
      font-size: 24px;
      color: #999999;
      img{
        width: 180px;
        height: 180px;
      }
    }
  }
}

.search-box{
  position: absolute;
  width: 750px;
  left: 50%;
  transform: translateX(-50%);
  padding-bottom: 30px;
  background: #fff;
  .search-box-item{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 32px 0 32px;
    font-size: 28px;
    color: #323233;
    .select-content-box{ 
      display: flex;
      position: relative;
      flex-grow: 1;
      margin-right: 16px;
      padding: 8px 25px 8px 16px;
      font-size: 24px;
      line-height: 40px;
      color: #999;
      // background: #F5F5F5;
      border: 1px solid #E7E7E7;
      border-radius: 12px;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      .content{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .two{
        width: 250px;
      }
      .four{
        width:104px
      }
      .more{
        width: 50px;
      }
      .van-icon-arrow-down{
        position:absolute;
        right: 10px;
      }
    }
    .select-content-box.on{
      // background: #FFF2E8;
      color: #FF7515;
      border: 1px solid #FF7515;
    }
  }
  .search-btn-group{
    display: flex;
    justify-content: space-around;
    padding-top: 10px;
    .box-btn{
      font-size: 34px;
      width: 330px;
      height: 80px;
      border-radius: 44px;
      text-align: center;
      line-height: 80px;
      cursor: pointer;
    }
    .default{
      border: 1px solid #7E868E;
      font-size: 34px;
      color: #171A1D;
    }
    .primary{
      color:#fff;
      background: #FF7515;
    }
  }
}
:deep(.van-cell){
  padding: 24px;
  margin-bottom: 8px;
  .van-cell__value{
    text-align: left;
  }
}
::v-deep .van-field__control::-webkit-input-placeholder {
  height: 100vh;
  line-height: 100vh;
}

.filter-reset-btn{
  font-size: 24px;
  color: #333333;
  cursor: pointer;
}
.select-box{
  position: absolute;
  left: 0;
  width: 100%;
  z-index: 100;
  background: #fff;
  padding: 20px 0;
  .select-box-content{
    max-height: 800px;
    overflow-y: auto;
    overflow-x: hidden;
    font-size: 24px;
    .search-input-box{
      display: flex;
      align-items: center;
      padding: 0 32px;
      .van-field{
        width: 618px;
        height: 56px;
        line-height: 56px;
        padding: 0 10px;
        background: #F5F5F5;
        border-radius: 28px;
        margin: 0 10px 0 0 ;
      }
      span{
        font-size: 24px;
        color:#333;
        cursor: pointer;
      }
    }
  }
  .select-box-item{
    padding: 16px 28px;
    font-size: 26px;
    color: #323233;
    line-height: 40px;
    border-bottom: 1px solid #EBEDF0;
    .select-default-box{
      display: flex;
      align-items: center;
      span{
        width: 100px;
        font-size: 24px;
      }
      .van-field{
        font-size: 24px;
        padding:10px;
        margin: 0;
        background: #F7F8FA;
        border-radius: 36px;
      }
    }
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
  .select-time-item{
    display: flex;
    justify-content: space-around;
    padding: 0 28px;
    span{
      display: block;
      width: 156px;
      height: 48px;
      line-height: 48px;
      font-size: 24px;
      color: #999;
      text-align: center;
      border-radius: 28px;
      border: 1px solid #979797;
      box-sizing: border-box;
    }
    .on{
      border-color: #FF7515;
      color: #FF7515;
    }
  }
}
.add-workflow{
  position: fixed;
  z-index: 1;
  bottom: 200px;
  // background: #FFFFFF;
  // box-shadow: 0px 2px 12px 0px rgba(100,101,102,0.12);
  border-radius: 16px;
  // padding: 24px 14px 14px 14px;
  left: 50%;
  transform: translateX(260%);
  cursor: pointer;
  img{
    display: block;
    width: 96px;
    margin: auto;
  }
  span{
    display: block;
    text-align: center;
    font-weight: 600;
    font-size: 24px;
    color: #333333;
    line-height: 33px;
    padding-top: 12px
  }
}

</style>