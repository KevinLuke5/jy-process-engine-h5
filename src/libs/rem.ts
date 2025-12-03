
// 设置 rem 函数
function setRem(): void {
  if (document.documentElement.clientWidth <= 750) {
    let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
    let htmlDom:any = document.querySelector('html');
    // 设置根元素字体大小
    htmlDom.style.fontSize = htmlWidth / 20 + 'px'; // 与 rootValue 值一致
  } else {
    document.documentElement.style.width = '480px'
    document.documentElement.style.fontSize = '24px'
    document.documentElement.style.margin = 'auto'
  } 
  
}
// 初始化
setRem();
// 改变窗口大小时重新设置 rem，这里最好加上节流
window.onresize = function (): void {
  setRem();
};

export default setRem