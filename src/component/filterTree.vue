<template>
  <div class="filter">
    <div class="search-input-box">
      <van-field
        autofocus
        ref="fieldSearchForm"
        v-model="searchTitle"
        clearable
        placeholder="请输入汉字、拼音查询"
        @keydown.enter.prevent="handleSearch"
        enterkeyhint="搜索"
      />
      <span @click="handleSearch" class="search-txt">搜索</span>
    </div>
    <div class="filter-content" v-if="searchType === 1">
      <div class="crumbs">
        <span @click="clickCrubsFirst">九阳<van-icon name="arrow" v-if="selectDept.arr.length"/></span>
        <span v-for="(item, index) in selectDept.arr" :key="index" @click="clickCrubs(item)">{{item.name}}<van-icon name="arrow" v-if="index !== selectDept.arr.length-1"/></span>
      </div>
      <div class="filter-tree">
        <div class="filter-tree-item" v-for="(item, index) in currentList" :key="index" @click="clickDept(item)">
          <template v-if="item.notDept">
            <div>
              <span v-if="item.userType">{{ item.userType }}：</span>
              <span>{{ item.name || item.accountName }}</span>
              <span v-if="item.deptName">-{{ item.deptName }}</span>
            </div>
          </template>
          <template v-else>
            <span v-if="item.userType">{{ item.userType }}：</span>
            <span>{{item.name}}</span>
            <van-icon name="arrow"/>
          </template>
        </div>
      </div>
    </div>
    <div class="filter-content" v-else-if="searchType === 2">
      <div class="filter-tree">
        <div class="filter-tree-item" v-for="(item, index) in searchUserList" :key="index" @click="clickDept(item)">
          <div>
            <span v-if="item.userType">{{ item.userType }}：</span>
            <span>{{item.name || item.accountName}}</span>
            <span v-if="item.deptName">-{{item.deptName}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="filter-content" v-else-if="searchType === 3">
      <div class="no-data">
        <br> <br>
        <span>暂无数据</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, defineExpose, onMounted } from "vue";
import { getDeptTree, getUserByDeptId, searchPeople } from "@/api/common";
import { userTypeObj } from '@/utils/enum'
import { showToast } from 'vant'
const searchTitle = ref("");
const searchType = ref(1)
const deptList = ref([]) // 所有的部门数
const currentList:any = ref([])  // 当前层级的部门数
const searchUserList:any = ref([]) // 搜索到的人员
const selectPerson = reactive({
  arr: [] as any[]
}) // 选中的人员
let selectedList:any = []
const selectDept = reactive({
  arr: [] as any[]
})
const fieldSearchForm = ref<any>(null)
const selectDeptList:any = ref([])
const emit = defineEmits(['sendUser'])
// 子组件的值暴露出去  父子组件数据动态绑定
defineExpose({
  setUserList(res: any[]){
    selectedList = res
  },
  setSearchTitle(arr: any[]){
    searchTitle.value = ''
    searchUserList.value = arr
    selectedList = arr
    handleSearch()
  }
})

// 初始化
onMounted(() => {
  getDeptData()
})

// 获取部门数
function getDeptData () {
  getDeptTree({}).then((res: any) => {
    if(res.code === 'success') {
      const list = res.data || []
      deptList.value = list
      currentList.value = list
    }
  })
}

// 根据部门获取成员信息
function getUserData(id: any) {
  const params = {
    id: id,
    userStatus: 'on',
    status: 'running'
  }
  getUserByDeptId(params).then((res: any) => {
    if(res.code === 'success') {
      let list = res.data || []
      list = list.map((item: { username: any; id: any; accountId: any; accountName: any; name: any; deptName: any; type: string}) => {
        const key: keyof typeof userTypeObj = item.type as keyof typeof userTypeObj
        return {
          id: item.accountId,
          name: item.name || item.accountName,
          userName: item.username,
          deptName: item.deptName,
          notDept: true,
          userType: userTypeObj[item.type as keyof typeof userTypeObj] || ''  // as 断言
        }
      })
      currentList.value = list
    }
  })
}

// 点击部门层级
function clickDept(item: { notDept: any; children: any; id: any; }) {
  if (!item) {
    currentList.value = deptList.value
    return
  }
  if (item.notDept) {
    selectedList.push(item)
    selectPerson.arr = unique(selectedList)
    if (hasDuplicateObjects(selectedList)) {
      showToast('当前人员已选择')
      selectedList = unique(selectedList)
    }
    emit('sendUser', selectPerson.arr);
  } else if(item.children) {
    selectDeptList.value.push(item)
    currentList.value = item.children
  } else {
    selectDeptList.value.push(item)
    getUserData(item.id)
  }
  selectDept.arr = unique(selectDeptList.value)
}

// 判断是否有重复对象
function hasDuplicateObjects(arr: any) {
  const seen = new Map()
  for (const item of arr) {
    console.log(item)
    const keyValue = item.id
    if (seen.has(keyValue)) {
      return true  // 检测到重复
    }
    seen.set(keyValue, true)
  }
  return false  // 没有重复
}

// 对象数组去重
function unique(arr: any) {
  const res = new Map();
  return arr.filter((a: { id: any; }) => !res.has(a.id) && res.set(a.id, 1));
}
// 点击面包屑
function clickCrubsFirst () {
  selectDept.arr = []
  selectDeptList.value = [] 
  currentList.value = deptList.value
}

function clickCrubs(item: { name?: any; notDept: any; children: any; id: any; }) {
  const index = selectDept.arr.findIndex((i: { name: any; }) => i.name === item.name)
  selectDept.arr.splice(index + 1, selectDept.arr.length - index )
  selectDeptList.value.splice(index + 1, selectDeptList.value.length - index )
  clickDept(item)
}
// 搜索用户
function handleSearch() {
  if (fieldSearchForm.value) {
    fieldSearchForm.value.blur()
  }
  if (!searchTitle.value) {
    searchType.value = 1
    return
  }
  const postObj = {
    name: searchTitle.value,
    userStatus: 'on',
    status: 'running',
    size: 50
  }
  searchPeople(postObj).then(res => {
    if (res.code === 'success') {
      let list = res.data.content || []
      list = list.map((item: {
        username: any;id: any; name: any; accountId: any; accountName: any; deptName: any ; type: string
      }) => {
        return {
          id: item.accountId,
          name: item.name || item.accountName,
          userName: item.username,
          deptName: item.deptName,
          notDept: true,
          userType: userTypeObj[item.type as keyof typeof userTypeObj] || ''
        }
      })
      if (list.length) {
        searchUserList.value = list
        searchType.value = 2
      } else {
        searchType.value = 3
      }
      
    }
  })
}

</script>

<style lang="less" scoped>
.filter{
  height: 100%;
  background: #fff;
}
.filed-bg {
  padding: 16px 32px 32px 20px;
  :deep(.van-search){
    height: 72px;
    font-size: 28px;
    color: #333333;
    line-height: 40px;
    padding: 16px;
    background: #F7F8FA;
    border-radius: 72px;
  }
}
.filter-content{
  height: 100%;
  background: #fff;
  .no-data{
    position: absolute;
    top: 204px;
    left: 275px;
    width: 200px;
    text-align: center;
    font-size: 20px;
    color: #999999;
    line-height: 28px;;
    img{
      width: 200px;
      height: 200px;
    }
  }
}
.crumbs{
  overflow-x: scroll;
  padding: 16px 32px;
  font-weight: 600;
  font-size: 28px;
  line-height: 40px;
  white-space: nowrap;
  border-bottom:1px solid #EBEDF0;
  cursor: pointer;
  span{
    color: #FF7515;
  }
  span:last-child{
    color: #333333;
  }
}
.filter-tree{
  max-height: 800px;
  overflow: scroll;
  padding: 0 32px;
  .filter-tree-item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28px;
    color: #323233;
    line-height: 40px;
    padding: 24px 0;
    border-bottom: 1px solid #EBEDF0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }
}
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
  .search-txt {
    font-size: 28px;
    padding-left: 10px;
    cursor: pointer;
    color: #606060;
  }
}
</style>