<!-- https://blog.csdn.net/weixin_43787651/article/details/132698410 -->
<template>
  <!-- 弹出层 -->
  <van-popup v-model:show="data.isPicker" position="bottom" round @close="confirmOn">
    <van-picker ref="picker" title="请选择时间" :columns="data.columns" @change="onChange" @cancel="cancelOn"
      @confirm="onConfirm" v-model="data.selectedValues" />
  </van-popup>
</template>
<script setup lang="ts">

import { reactive, watch } from "vue";

const customFieldName = {
  text: "value",
  value: "values",
  children: ""
};
interface Data {  
  isPicker: boolean; // 是否显示弹出层  
  columns: Array<any>; // 所有时间列  
  selectedValues: Array<string>; // 控件选择的时间值  
}  
  
const data = reactive<Data>({  
  isPicker: false,  
  columns: [],  
  selectedValues: []  
});

const props = defineProps({
  // 传入的显影状态
  showPicker: {
    type: Boolean
  },
  // 传入的值
  values: {
    type: String
  }
});

//定义要向父组件传递的事件
const emit = defineEmits(["changeValue", "confirm"]);


watch(
  () => props.showPicker,
  val => {
    data.isPicker = val;
    if (val) {
      data.columns = [];
      getcolumns();
    }
  },
  {
    immediate: true//立即监听--进入就会执行一次 监听显影状态
  }
);

interface ChangeEvent {  
  selectedValues: Array<string>;  
  selectedOptions: Array<any>;  
  selectedIndexes: Array<number>;  
  columnIndex: number;  
}
function onChange(event: ChangeEvent) {
  if (event.columnIndex === 1) {
    const year = parseInt(data.selectedValues[0])
    const days = generateDays(year, Number(event.selectedValues[1])); //获取12月数组
    data.columns[2] = days
    if (Number(data.selectedValues[2]) > days.length) {
      data.selectedValues[2] = '01'
    }
  }
}


function getcolumns() {
  let strtime: string = props.values || ''; //传入的时间
  let date = new Date(strtime.replace(/-/g, "/"));
  let timeVaules = date.getTime();

  let dateVaules;
  if (props.values) {
    dateVaules = new Date(timeVaules);
  } else {
    dateVaules = new Date(); //没有传入时间则默认当前时刻
  }

  let Y = dateVaules.getFullYear();
  let M = dateVaules.getMonth();
  let D = dateVaules.getDate();
  let h = dateVaules.getHours();
  let m = dateVaules.getMinutes();
  let s = dateVaules.getSeconds();

  let year: any = []; //获取前后十年数组
  year.values = [];
  let Currentday = new Date().getFullYear();
  for (let i = Currentday - 10; i < Currentday + 10; i++) {
    year.push({ text: i.toString(), value: i.toString() });
  }
  year.defaultIndex = year.values.indexOf(Y); //设置默认选项当前年

  // 个位数补0
  const _M = M + 1 < 10 ? `0${M + 1}` : (M + 1).toString(); //月份比实际获取的少1，所以要加1
  const _D = D < 10 ? `0${D}` : D.toString();
  const _h = h < 10 ? `0${h}` : h.toString();
  const _m = m < 10 ? `0${m}` : m.toString();
  const _s = s < 10 ? `0${s}` : s.toString();

  // 生成年月日时分秒时间值
  data.selectedValues = [Y.toString(), _M, _D, _h, _m, _s];  
  data.columns = [
    year,
    generateRange(1, 12).map(i => ({ text: i.toString().padStart(2, "0"), value: i.toString().padStart(2, "0") })),
    generateDays(Y, M + 1),
    generateRange(0, 23).map(i => ({ text: i.toString().padStart(2, "0"), value: i.toString().padStart(2, "0") })),
    generateRange(0, 59).map(i => ({ text: i.toString().padStart(2, "0"), value: i.toString().padStart(2, "0") })),
    generateRange(0, 59).map(i => ({ text: i.toString().padStart(2, "0"), value: i.toString().padStart(2, "0") })),
  ]
}

function generateRange(start: number, end: number): Array<number> {  
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);  
} 
  
function generateDays(year: number, month: number): Array<any> {  
  const daysInMonth = new Date(year, month, 0).getDate();  
  return Array.from({ length: daysInMonth + 1 }, (_, i) => ({  
    text: i.toString().padStart(2, "0"),  
    value: i.toString().padStart(2, "0")
  })).slice(1);  
} 


function getCountDays(year: number, month: number) {
  //获取某年某月多少天
  let day = new Date(year, month, 0);
  return day.getDate();
}

// 关闭弹框
function confirmOn() {
  emit("changeValue");
}


//时间选择器关闭 值不改变并关闭弹框
function cancelOn({ selectedValues }: { selectedValues: Array<string> }) {
  confirmOn()
}

// 时间选择器确定 值改变
function onConfirm({ selectedValues }: { selectedValues: Array<string> }) {
  let endval =
    data.selectedValues[0] +
    "-" +
    data.selectedValues[1] +
    "-" +
    data.selectedValues[2] +
    " " +
    data.selectedValues[3] +
    ":" +
    data.selectedValues[4] +
    ":" +
    data.selectedValues[5];

  confirmOn()
  emit("confirm", endval);
}
</script>


