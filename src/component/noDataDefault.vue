<template>
  <div class="no-data">
    <img src="https://res.joyoung.com/07/01/icon-empty-img.png" alt="暂无数据"/>
    <span>{{message}}</span>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  message: String
})

</script>

<style lang="less" scoped>
.no-data{
  width: 100%;
  text-align: center;
  padding-bottom: 10px;
  img{
    display: block;
    width: 200px;
    height: 200px;
    margin: 0 auto;
  }
  span{
    font-size: 24px;
    color: #999999;
    line-height: 33px;
  }
}
</style>