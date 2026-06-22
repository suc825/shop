// 工具函数 — 从 js/utils.js 迁移
window.resolveImg = function(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return 'http://localhost:8080/' + path;
};

function genTradeNo() {
  var date = new Date();
  var tradeNo = date.getFullYear().toString() + (date.getMonth() + 1).toString() +
    date.getDate().toString() + date.getHours().toString() + date.getMinutes().toString() +
    date.getSeconds().toString() + date.getMilliseconds().toString();
  for (var i = 0; i < 5; i++) {
    tradeNo += Math.floor(Math.random() * 10);
  }
  return tradeNo;
}
