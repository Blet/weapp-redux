//index.js
//获取应用实例
let appReduxBinding = require("../../lib/weapp-redux.js");
let { connect } = appReduxBinding;
let app = getApp();

const pageConfig = {
  data: {
  },
  //事件处理函数
  onLoad: function () {
    wx.navigateTo({
      url: '../logs/logs',
    });
    setTimeout(()=>{
      this.dispatch({ type: 'INCREMENT' });
    },3000)
  },
}

Page(connect(
  (state)=>{
    return {
     count: state
    }
  }
)(pageConfig))
