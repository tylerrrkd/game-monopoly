"use strict";

const BASE_URL = window.API_URL;
const PRESENT_URL = "https://github.com/tylerrrkd";

Vue.directive("mp3", {
  bind: (el, binding) => {
    let id = binding.expression;
    el.addEventListener("click", () => {
      document.getElementById(id).play();
    });
  }
});

new Vue({
  el: "#app",
  data() {
    return {
      dimSumList: window.dimSumArray,
      actIdList: window.actIdArray,
      isStartPageShow: true,
      popup: {
        cookBox: {
          isShow: false,
          hasTimes: 1
        },
        isGameRuleShow: false,
        isBindPhoneShow: false,
        isDimSumShow: false,
        landmark: {
          isShow: false,
          type: 0,
          name: "",
          content: ""
        },
        isPresentDimSumShow: false,
        openBoxResult: {
          isShow: false,
          money: 0
        },
        isOpenLotteryResultShow: false,
        openLotteryResult: {
          type: 0,
          money: 0,
          dessert: 0
        },
        isJglRedPackShow: false,
        isReceiveDimSumShow: false,
        isGetReceiveDimSumShow: false,
        isMessageBoxShow: false,
        isGetTenDanSanShow: false,
        isSignInShow: false,
        isGameTimesShow: false
      },
      userInfo: {
        openId: document.getElementById("openId").value,
        name: document.getElementById("nickname").value,
        img: document.getElementById("headimg").value,
        desId: 0,
        dessert: 0
      },
      tips: {
        isTipsShow: false,
        title: "提示",
        content: "",
        isTimeOutBtnShow: false
      },
      saveUser: {
        receiveCount: 0,
        presentCount: 0,
        isLoginin: 0,
        gameType: 0
      },
      initUser: {},
      zsList: [],
      receiveList: [],
      winPrizeList: [],
      dimSumSelected: 0,
      isSentShow: false,
      phoneNum: "",
      oneClick: false,
      oneGetSaveUser: false,
      oneInitState: false,
      isShareShow: false,
      isLoaded: false,
      bannerNum: 0,
      bannerList: window.bannerArray
    };
  },
  mixins: [phaserMixins],
  created() {},
  mounted() {
    this.getRandomBanner();
  },
  methods: {
    close(ref) {
      if (ref == "startPage") {
        this.game.state.start("state1");
        this.isStartPageShow = false;
        this.popup.isReceiveDimSumShow = false;
        if (!!!this.initUser.phone) {
          // 用户未绑定手机号且为当天第一次登录才提示
          if (this.saveUser.isLoginin == 1) {
            this.popup.isGetTenDanSanShow = true;
          }
        } else {
          this.checkSignIn();
        }
      } else if (ref == "tips") {
        this.tips.isTipsShow = false;
      } else if (ref == "cookBox") {
        this.popup.cookBox.isShow = false;
      } else if (ref == "gameRule") {
        this.popup.isGameRuleShow = false;
      } else if (ref == "bindPhone") {
        this.popup.isBindPhoneShow = false;
      } else if (ref == "dimSum") {
        this.dimSumSelected = 0;
        this.isSentShow = false;
        this.popup.isPresentDimSumShow = false;
        this.popup.isDimSumShow = false;
      } else if (ref == "cancelPresentDimSum") {
        this.dimSumSelected = 0;
        window.presentUrl = PRESENT_URL;
        // window.friendShare();
        this.popup.isPresentDimSumShow = false;
      } else if (ref == "landmark") {
        this.popup.landmark.isShow = false;
      } else if (ref == "openBoxResult") {
        this.popup.openBoxResult.isShow = false;
      } else if (ref == "lotteryResult") {
        this.popup.isOpenLotteryResultShow = false;
      } else if (ref == "jglRedPack") {
        this.popup.isJglRedPackShow = false;
      } else if (ref == "receiveDimSum") {
        this.popup.isReceiveDimSumShow = false;
      } else if (ref == "getReceiveDimSum") {
        this.popup.isGetReceiveDimSumShow = false;
      } else if (ref == "messageBox") {
        this.popup.isMessageBoxShow = false;
      } else if (ref == "tipsAndToDimSum") {
        this.getZsList(); // 重新获取赠送列表
        this.popup.isDimSumShow = true;
        this.tips.isTipsShow = false;
        this.tips.isTimeOutBtnShow = false;
      } else if (ref == "isShareShow") {
        this.isShareShow = false;
      } else if (ref == "getTenDanSan") {
        this.checkSignIn();
        this.popup.isGetTenDanSanShow = false;
      } else if (ref == "signIn") {
        this.checkGameTimes();
        this.getSaveUser();
        this.popup.isSignInShow = false;
      } else if (ref == "randomGameTimes") {
        this.popup.isGameTimesShow = false;
      }
    },
    showPopup(ref) {
      if (ref == "gameRule") {
        this.fibonacciData("game", "打开活动规则");
        this.popup.isGameRuleShow = true;
      } else if (ref == "moreCoupon") {
        this.fibonacciData("game", "打开更多优惠");
        window.location.href = PRESENT_URL;
      } else if (ref == "bindPhone") {
        this.fibonacciData("game", "打开绑定手机");
        this.popup.isBindPhoneShow = true;
      } else if (ref == "dimSum") {
        this.fibonacciData("game", "打开我的点心");
        this.getSaveUser();
        this.getZsList(); // 重新获取赠送列表
        this.popup.isDimSumShow = true;
      } else if (ref == "presentDimSum") {
        this.fibonacciData("game", "赠送点心");
        this.popup.isPresentDimSumShow = true;
      } else if (ref == "selectFriend") {
        this.fibonacciData("game", "选择好友");
        if (this.dimSumSelected > 0) {
          this.postToZsDesserts();
        } else {
          this.tips.content = "亲~请先在上方选择你要赠送的点心";
          this.tips.isTipsShow = true;
        }
      } else if (ref == "lotteryResult") {
        this.getSaveUser();
        this.getZsList(); // 重新获取赠送列表
        this.popup.isDimSumShow = true;
        this.popup.isOpenLotteryResultShow = false;
      } else if (ref == "lotteryResultBox") {
        // 重新获取信箱列表
        /* 展示我的信箱 */
        this.getShowLMoneyList();
        this.popup.isOpenLotteryResultShow = false;
      } else if (ref == "jglRedPack") {
        this.popup.isJglRedPackShow = true;
        this.popup.isOpenLotteryResultShow = false;
      }
      // else if (ref == 'getReceiveDimSum') {
      // this.getZsList() // 重新获取赠送列表
      // this.popup.isDimSumShow = true
      // this.popup.isGetReceiveDimSumShow = false
      // }
      else if (ref == "messageBox") {
          this.fibonacciData("game", "我的信箱");
          // 重新获取信箱列表
          this.getShowLMoneyList();
        }
    },
    receiveCheck() {
      // 赠送链接
      if (this.GetQueryString("desId") != null) {
        this.userInfo.desId = this.GetQueryString("desId");
        this.userInfo.dessert = this.GetQueryString("dessert");
        this.popup.isReceiveDimSumShow = true;
        console.log("desId: " + this.userInfo.desId);
      }
    },
    checkSignIn() {
      if (this.saveUser.isLoginin == 1) {
        this.popup.isSignInShow = true;
      }
    },
    checkGameTimes() {
      if (this.saveUser.gameType > 0) {
        this.popup.isGameTimesShow = true;
      }
    },
    fibonacciData(type, name) {
      // if (type == "banner") {
      //   window.dataSDK.btnClick(
      //     "叹碗南粤",
      //     "点击广告" + this.bannerList[this.bannerNum].name
      //   );
      // } else if (type == "game") {
      //   window.dataSDK.btnClick("叹碗南粤", "点击" + name);
      // }
    },
    changeSentTab() {
      this.isSentShow = !this.isSentShow;
    },
    getSaveUser() {
      if (this.oneGetSaveUser) {
        return;
      }
      this.oneGetSaveUser = true;
      // this.doJavaPost('saveUser', 'twny', this.userInfo)
      //   .then((data) => {
      //     if (data.code == 200) {
      // console.log(data);
      const data = {
        receiveCount: 1,
        presentCount: 1,
        isLoginin: 1,
        gameType: 1,
        isBox: 1,
        user: {
          phone: "18888888888",
          grid: 0,
          zscount: 10,
          desserts: 22,
          dessert1: 3,
          dessert2: 5,
          dessert3: 8,
          dessert4: 8,
          dessert5: 6,
          dessert6: 4,
          dessert7: 100,
          dessert8: 5,
          dessert9: 1,
          dessert10: 10
        }
      };
      this.saveUser.receiveCount = data.receiveCount;
      this.saveUser.presentCount = data.presentCount;
      this.saveUser.isLoginin = data.isLoginin;
      this.popup.cookBox.hasTimes = data.isBox;
      this.initUser = data.user;

      this.isLoaded = true;

      if (data.isLoginin == 1) {
        this.saveUser.gameType = data.gameType;
      }

      if (this.oneInitState == false) {
        this.receiveCheck();
        this.oneInitState = true;
      }
      //   } else if (data.code == 99) {
      //     console.log(data)
      //     this.tips.content = data.msg
      //     this.tips.isTipsShow = true
      //   } else {
      //     console.log(data)
      //     this.tips.content = data.msg
      //     this.tips.isTipsShow = true
      //   }
      //   this.oneGetSaveUser = false
      // }).catch((err) => {
      //   console.log(err)
      //   this.tips.content = '网络信号差，请稍后再试！'
      //   this.tips.isTipsShow = true
      //   this.oneGetSaveUser = false
      // })
    },
    getZsList() {
      if (this.oneClick) {
        return;
      }
      this.oneClick = true;
      // this.doJavaPost("zsList", "twny", {
      //   openId: this.userInfo.openId,
      // })
      //   .then((data) => {
      //     if (data.code == 200) {
      //       console.log(data);
      const data = {
        receiveList: [{
          desserts: 1,
          updatetime: new Date(),
          img: "https://avatars.githubusercontent.com/u/8706896"
        }, {
          desserts: 2,
          updatetime: new Date(),
          img: "https://avatars.githubusercontent.com/u/8706896"
        }, {
          desserts: 3,
          updatetime: new Date(),
          img: "https://avatars.githubusercontent.com/u/8706896"
        }, {
          desserts: 4,
          updatetime: new Date(),
          img: "https://avatars.githubusercontent.com/u/8706896"
        }, {
          desserts: 5,
          updatetime: new Date(),
          img: "https://avatars.githubusercontent.com/u/8706896"
        }, {
          desserts: 6,
          updatetime: new Date(),
          img: "https://avatars.githubusercontent.com/u/8706896"
        }, {
          desserts: 7,
          updatetime: new Date(),
          img: "https://avatars.githubusercontent.com/u/8706896"
        }, {
          desserts: 8,
          updatetime: new Date(),
          img: "https://avatars.githubusercontent.com/u/8706896"
        }, {
          desserts: 9,
          updatetime: new Date(),
          img: "https://avatars.githubusercontent.com/u/8706896"
        }, {
          desserts: 10,
          updatetime: new Date(),
          img: "https://avatars.githubusercontent.com/u/8706896"
        }, {
          desserts: 11,
          updatetime: new Date(),
          img: "https://avatars.githubusercontent.com/u/8706896"
        }],
        zsList: [{
          receiveName: "啊啊啊好厉害",
          desserts: 1,
          updatetime: new Date()
        }, {
          receiveName: "啊啊啊好厉害",
          desserts: 2,
          updatetime: new Date()
        }, {
          receiveName: "啊啊啊好厉害",
          desserts: 3,
          updatetime: new Date()
        }, {
          receiveName: "啊啊啊好厉害",
          desserts: 4,
          updatetime: new Date()
        }, {
          receiveName: "啊啊啊好厉害",
          desserts: 5,
          updatetime: new Date()
        }, {
          receiveName: "啊啊啊好厉害",
          desserts: 6,
          updatetime: new Date()
        }, {
          receiveName: "啊啊啊好厉害",
          desserts: 7,
          updatetime: new Date()
        }, {
          receiveName: "啊啊啊好厉害",
          desserts: 8,
          updatetime: new Date()
        }, {
          receiveName: "啊啊啊好厉害",
          desserts: 9,
          updatetime: new Date()
        }, {
          receiveName: "啊啊啊好厉害",
          desserts: 10,
          updatetime: new Date()
        }, {
          receiveName: "啊啊啊好厉害",
          desserts: 11,
          updatetime: new Date()
        }]
      };
      this.zsList = data.zsList;
      this.receiveList = data.receiveList;
      //   } else if (data.code == 99) {
      //     console.log(data);
      //     this.tips.content = data.msg;
      //     this.tips.isTipsShow = true;
      //   } else {
      //     console.log(data);
      //     this.tips.content = data.msg;
      //     this.tips.isTipsShow = true;
      //   }
      this.oneClick = false;
      // })
      // .catch((err) => {
      //   console.log(err);
      //   this.tips.content = "网络信号差，请稍后再试！";
      //   this.tips.isTipsShow = true;
      //   this.oneClick = false;
      // });
    },
    getShowLMoneyList() {
      if (this.oneClick) {
        return;
      }
      this.oneClick = true;
      if (!!!this.initUser.phone) {
        this.popup.isBindPhoneShow = true;
        this.oneClick = false;
        return;
      }
      // this.doJavaPost("showLMoneyList", "twny", {
      //   openId: this.userInfo.openId,
      //   phone: this.initUser.phone,
      // })
      //   .then((data) => {
      // if (data.code == 200) {
      // console.log(data);
      const data = {
        moneyList: [{
          actId: "twny",
          type: 1,
          money: 100,
          createTime: new Date()
        }, {
          actId: "twny_pick",
          type: 2,
          createTime: new Date()
        }, {
          actId: "twny_jump",
          type: 2,
          createTime: new Date()
        }, {
          actId: "twny_ball",
          type: 1,
          money: 100,
          createTime: new Date()
        }, {
          actId: "twny_shaiz",
          type: 1,
          money: 100,
          createTime: new Date()
        }, {
          actId: "twny_shaiz",
          type: 1,
          money: 100,
          createTime: new Date()
        }, {
          actId: "twny_shaiz",
          type: 1,
          money: 100,
          createTime: new Date()
        }, {
          actId: "twny_shaiz",
          type: 1,
          money: 100,
          createTime: new Date()
        }]
      };
      this.winPrizeList = data.moneyList;
      this.popup.isMessageBoxShow = true;
      //   } else if (data.code == 99) {
      //     console.log(data);
      //     this.tips.content = data.msg;
      //     this.tips.isTipsShow = true;
      //   } else {
      //     console.log(data);
      //     this.tips.content = "网络信号差，请稍后再试！";
      //     this.tips.isTipsShow = true;
      //   }
      this.oneClick = false;
      // })
      // .catch((err) => {
      //   console.log(err);
      //   this.tips.content = "网络信号差，请稍后再试！";
      //   this.tips.isTipsShow = true;
      //   this.oneClick = false;
      // });
    },
    postSavePhone() {
      if (this.oneClick) {
        return;
      }
      this.oneClick = true;
      this.doJavaPost("savePhone", "twny", {
        openId: this.userInfo.openId,
        phone: this.phoneNum
      }).then(data => {
        if (data.code == 200) {
          console.log(data);
          this.getSaveUser();
          this.tips.content = "绑定成功！";
          this.tips.isTipsShow = true;
          this.popup.isBindPhoneShow = false;
        } else if (data.code == 99) {
          console.log(data);
          this.tips.content = data.msg;
          this.tips.isTipsShow = true;
        } else {
          console.log(data);
          this.tips.content = "网络信号差，请稍后再试！";
          this.tips.isTipsShow = true;
        }
        this.oneClick = false;
      }).catch(err => {
        console.log(err);
        this.tips.content = "网络信号差，请稍后再试！";
        this.tips.isTipsShow = true;
        this.oneClick = false;
      });
    },
    // postDozsz(grid) {
    //   return this.doJavaPost("dozsz", "twny", {
    //     openId: this.userInfo.openId,
    //     phone: this.initUser.phone,
    //     grid: grid,
    //   });
    // },
    postSzLottery() {
      if (this.oneClick) {
        return;
      }
      this.oneClick = true;
      if (!!!this.initUser.phone) {
        this.popup.isBindPhoneShow = true;
        this.oneClick = false;
        return;
      }
      // this.doJavaPost("szLottery", "twny", {
      //   openId: this.userInfo.openId,
      //   name: this.userInfo.name,
      //   img: this.userInfo.img,
      //   phone: this.initUser.phone,
      // })
      //   .then((data) => {
      // if (data.code == 200) {
      // console.log(data);
      const data = { type: 1, money: 10 };
      this.popup.openLotteryResult = data;
      document.getElementById("lottery").play();
      this.popup.isOpenLotteryResultShow = true;
      this.popup.landmark.isShow = false;
      // } else if (data.code == 99) {
      //   console.log(data);
      //   this.tips.content = data.msg;
      //   this.tips.isTipsShow = true;
      // } else {
      //   console.log(data);
      //   this.tips.content = data.msg;
      //   this.tips.isTipsShow = true;
      // }
      this.oneClick = false;
      // })
      // .catch((err) => {
      //   console.log(err);
      //   this.tips.content = "网络信号差，请稍后再试！";
      //   this.tips.isTipsShow = true;
      //   this.oneClick = false;
      // });
    },
    postOpenBox() {
      if (this.oneClick) {
        return;
      }
      this.oneClick = true;
      if (!!!this.initUser.phone) {
        this.popup.isBindPhoneShow = true;
        this.popup.cookBox.isShow = false;
        this.oneClick = false;
        return;
      }
      // this.doJavaPost("openBox", "twny", {
      //   openId: this.userInfo.openId,
      //   phone: this.initUser.phone,
      // })
      //   .then((data) => {
      //     if (data.code == 200) {
      // console.log(data);
      const data = { money: "100万" };
      // this.initUser = data.user;
      this.popup.openBoxResult.money = data.money;
      this.popup.openBoxResult.isShow = true;
      this.popup.cookBox.isShow = false;
      //   } else if (data.code == 99) {
      //     console.log(data);
      //     this.tips.content = data.msg;
      //     this.tips.isTipsShow = true;
      //   } else {
      //     console.log(data);
      //     this.tips.content = "网络信号差，请稍后再试！";
      //     this.tips.isTipsShow = true;
      //   }
      this.oneClick = false;
      // })
      // .catch((err) => {
      //   console.log(err);
      //   this.tips.content = "网络信号差，请稍后再试！";
      //   this.tips.isTipsShow = true;
      //   this.oneClick = false;
      // });
    },
    postToZsDesserts() {
      if (this.oneClick) {
        return;
      }
      this.oneClick = true;
      // this.doJavaPost("toZsDesserts", "twny", {
      //   openId: this.userInfo.openId,
      //   name: this.userInfo.name,
      //   Img: this.userInfo.img,
      //   desserts: this.dimSumSelected,
      // })
      // .then((data) => {
      //   if (data.code == 200) {
      window.presentUrl = "https://github.com/tylerrrkd?desId=" + "xsj" + "&dessert=" + this.dimSumSelected;
      window.shareTitle = "兄弟，给你看个宝贝！";
      window.shareDes = "一抽999，道具能换钱，" + this.userInfo.name + "也在玩，你还等什么！";
      this.isShareShow = true;
      // window.friendShare((data) => {
      // if (data > 0) {
      this.isShareShow = false;
      this.tips.content = "成功赠出一只点心！<br>好友领取后，你将获得一次投骰子机会";
      this.tips.isTipsShow = true;
      // } else {
      //   this.isShareShow = false;
      //   this.tips.content = "赠送失败！";
      //   this.tips.isTipsShow = true;
      // }
      // });
      console.log(window.presentUrl);
      //   } else if (data.code == 99) {
      //     console.log(data);
      //     this.tips.content = data.msg;
      //     this.tips.isTipsShow = true;
      //   } else {
      //     console.log(data);
      //     this.tips.content = "网络信号差，请稍后再试！";
      //     this.tips.isTipsShow = true;
      //   }
      this.oneClick = false;
      // })
      // .catch((err) => {
      //   console.log(err);
      //   this.tips.content = "网络信号差，请稍后再试！";
      //   this.tips.isTipsShow = true;
      //   this.oneClick = false;
      // });
    },
    postReceiveDesserts() {
      if (this.oneClick) {
        return;
      }
      this.oneClick = true;
      this.doJavaPost("receiveDesserts", "twny", {
        receiveOpenId: this.userInfo.openId,
        receiveName: this.userInfo.name,
        receiveImg: this.userInfo.img,
        id: this.userInfo.desId
      }).then(data => {
        if (data.code == 200) {
          console.log(data);
          this.getSaveUser();
          this.popup.isGetReceiveDimSumShow = true;
          this.popup.isReceiveDimSumShow = false;
        } else if (data.code == 99) {
          console.log(data);
          this.tips.content = data.msg;
          this.tips.isTipsShow = true;
        } else {
          console.log(data);
          this.tips.content = "网络信号差，请稍后再试！";
          this.tips.isTipsShow = true;
        }
        this.oneClick = false;
      }).catch(err => {
        console.log(err);
        this.tips.content = "网络信号差，请稍后再试！";
        this.tips.isTipsShow = true;
        this.oneClick = false;
      });
    },
    jumpToPage(ref) {
      if (ref == "messageBox") {
        this.fibonacciData("game", "我的信箱积分换好礼");
        window.location.href = PRESENT_URL;
      } else if (ref == "twnyJump") {
        this.fibonacciData("game", "跳转到跳一跳游戏");
        window.location.href = PRESENT_URL;
      } else if (ref == "twnyPick") {
        this.fibonacciData("game", "跳转到接点心游戏");
        window.location.href = PRESENT_URL;
      } else if (ref == "twnyBall") {
        this.fibonacciData("game", "跳转到我是球王游戏");
        window.location.href = PRESENT_URL;
      } else if (ref == "banner") {
        this.fibonacciData("banner", "");
        window.location.href = this.bannerList[this.bannerNum].url;
      } else if (ref == "iconBanner") {
        this.fibonacciData("game", "跳转到商家优惠");
        window.location.href = this.popup.openLotteryResult.url;
      }
    },
    GetQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    },
    getRandomBanner() {
      this.bannerNum = parseInt(Math.random() * this.bannerList.length);
      console.log("当前banner：" + this.bannerNum);
    },
    formatDateTime(inputTime) {
      var date = new Date(inputTime);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? m : m;
      var d = date.getDate();
      d = d < 10 ? d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      var second = date.getSeconds();
      minute = minute < 10 ? "0" + minute : minute;
      second = second < 10 ? "0" + second : second;
      return m + "月" + d + "日 " + h + ":" + minute; //y + '-' + + ':' + second
    },
    userNameSlice(userName) {
      let temp = "";
      if (!!!userName) {
        return temp;
      }
      if (userName.length >= 7) {
        temp = userName.slice(0, 3) + "..." + userName.slice(-3);
        return temp;
      } else {
        return userName;
      }
    },
    doJavaPost(url, actId, param) {}
  },
  computed: {
    getPhoneEncrypt() {
      if (!!!this.initUser.phone) {
        return "请绑定手机号";
      }
      return this.initUser.phone.substr(0, 3) + "****" + this.initUser.phone.substr(7, 11);
    },
    dessertList() {
      if (Object.keys(this.initUser).length > 0) {
        let rawKeys = Object.keys(this.initUser).filter(v => /dessert([0-9]+)/.test(v));
        let arr = rawKeys.map(v => {
          return {
            key: v,
            value: this.initUser[v]
          };
        });
        return arr;
      } else {
        return [];
      }
    }
  }
});