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
    setTimeout(() => {
      console.log(this.data);
    }, 2000)
  },
}
Page(connect(
  (state) => {
    console.log(state);
    return {
      count: state
    }
  }
)(pageConfig))
