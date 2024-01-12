const phaserMixins = {
  data() {
    return {
      game: null,
      util: {},
      // misc: {},
      gameInfo: {},
      // eleManager: {
      //   userName: true,
      //   gameRule: true,
      //   moreCoupon: true,
      //   dimSum: true,
      //   message: true,
      // },
      loadingPercent: 0
    };
  },
  mounted() {
    this.initGame();
  },
  methods: {
    initGame() {
      document.getElementById("game").style.height = document.body.clientHeight + "px";
      let Ratio = window.devicePixelRatio;
      this.gameInfo.w = Ratio * (document.documentElement.clientWidth || document.body.clientWidth);
      this.gameInfo.h = Ratio * (document.documentElement.clientHeight || document.body.clientHeight);
      // new Game(width, height, renderer, parent, state, transparent, antialias, physicsConfig)
      this.game = new Phaser.Game(this.gameInfo.w, this.gameInfo.h, Phaser.Auto, "game");
      this.game.state.add("Boot", this.Boot());
      this.game.state.add("preload", this.preload());
      this.game.state.add("state1", this.gameState1());
      this.game.state.start("Boot");
    },
    Boot() {
      return {
        init() {
          if (!this.game.device.desktop) {
            this.game.stage.backgroundColor = "#f8f8f8";
            this.game.input.maxPointers = 5;
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.forceOrientation(false, true);
          }
          this.game.scale.pageAlignHorizontally = true;
          this.game.scale.pageAlignVertically = true;
        },
        preload() {
          this.game.load.crossOrigin = true;
        },
        create() {
          this.game.scale.forceOrientation(true, false);
          this.game.state.start("preload");
        }
      };
    },
    preload() {
      // vue this
      let that = this;
      return {
        init() {
          // 引入工具嘻嘻
          this.game.util = gameUtil(this.game);
          // this.game.misc = gameMisc();
          that.game = this.game;
        },
        preload() {
          // phaser this
          let { game } = this; /* this 相当于this.game */
          game.load.onFileComplete.add(this.fileComplete, this);
          game.load.image("map", baseImgUrl + "twly_map.jpg");
          // 道路组件
          game.load.image("redPackRight", baseImgUrl + "road/twly_redPackRight.png");
          game.load.image("redPackLeft", baseImgUrl + "road/twly_redPackLeft.png");
          game.load.image("mall", baseImgUrl + "road/twly_mall.png");
          game.load.image("cookBox", baseImgUrl + "road/twly_cookBox.png");
          // 骰子
          game.load.atlasXML("dice", baseImgUrl + "twly_dice.png", baseImgUrl + "twly_dice.xml");
          game.load.image("diceBtn", baseImgUrl + "home/twly_diceBtn2.png"); // 骰子按钮
          // 角色
          game.load.atlasXML("right-top", baseImgUrl + "role/right-top.png", baseImgUrl + "role/right-top.xml");
          game.load.atlasXML("left-top", baseImgUrl + "role/left-top.png", baseImgUrl + "role/left-top.xml");
          game.load.atlasXML("right-bottom", baseImgUrl + "role/right-bottom.png", baseImgUrl + "role/right-bottom.xml");
          game.load.atlasXML("left-bottom", baseImgUrl + "role/left-bottom.png", baseImgUrl + "role/left-bottom.xml");
          // audio
          game.load.audio("audio_bgm", "./app/audio/bgm.mp3");
          game.load.audio("audio_click", "./app/audio/click.mp3");
          game.load.audio("audio_dice", "./app/audio/dice.mp3");
          game.load.audio("audio_lottery", "./app/audio/lottery.mp3");
          game.load.audio("audio_onTheLandmark", "./app/audio/onTheLandmark.mp3");
          game.load.audio("audio_steps", "./app/audio/steps_2.mp3");
        },
        create() {
          that.getSaveUser(); // preload之后再获取用户信息
          // this.game.state.start("state1");
        },
        fileComplete(progress) {
          that.loadingPercent = progress + "%";
        }
      };
    },
    gameState1() {
      let that = this;
      let w = this.gameInfo.w;
      let h = this.gameInfo.h;
      let adaptW = w / 750;
      let adaptH = h / 1334;
      let game = this.game;
      /**
       * resources
       */
      let map = null;
      let diceBtn = null; // 骰子按钮
      let dice = null;
      let role = null;
      let redPacks = null;
      let mall = null;
      let cookBox = null;
      let audio_dice = null;
      let audio_onTheLandmark = null;
      let audio_steps = null;
      let audio_click = null;
      /**
       * controller
       */
      let moveDir = null;
      let roadGrid = window.gridData;
      let oneClick = false;
      let diceTween = null;
      let diceText = null;
      let diceTextTween = null;
      // let isGamePlay = true
      return {
        init() {},
        preload() {},
        create() {
          const audio_bgm = game.add.audio("audio_bgm");
          audio_bgm.loopFull(0.1);
          audio_dice = game.add.audio("audio_dice");
          audio_click = game.add.audio("audio_click");
          audio_onTheLandmark = game.add.audio("audio_onTheLandmark");
          audio_steps = game.add.audio("audio_steps");

          // let { game } = this
          // this.game.camera.y = 0
          map = game.util.as(0, 0, "map");
          game.util.setFull(map);

          this.createRoad();

          this.initRoadGrid(that.initUser.grid);
          this.createRole(that.initUser.grid);
          // this.initRoadGrid(0)
          // this.createRole(0)
          this.createDiceBtn();
        },
        update() {
          diceText.text = "次数: " + that.initUser.zscount;
        },
        render() {},
        createRoad() {
          redPacks = game.add.group();
          for (let i = 0; i < 3; i++) {
            let tempRedPack = game.util.asw(0, 0, "redPackRight", 12, false);
            // game.add.tween(tempRedPack).to({ alpha: .85, width: tempRedPack.width * .9, height: tempRedPack.height * .9 }, 200, Phaser.Easing.Bounce.InOut, true, 0, -1, true)
            redPacks.add(tempRedPack);
          }
          for (let i = 0; i < 2; i++) {
            let tempRedPack = game.util.asw(0, 0, "redPackLeft", 12, false);
            // game.add.tween(tempRedPack).to({ alpha: .85, width: tempRedPack.width * .9, height: tempRedPack.height * .9 }, 200, Phaser.Easing.Bounce.InOut, true, 0, -1, true)
            redPacks.add(tempRedPack);
          }
          redPacks.children[0].x = w * 0.3;
          redPacks.children[0].y = h * 0.44;
          redPacks.children[1].x = w * 0.5;
          redPacks.children[1].y = h * 0.285;
          redPacks.children[2].x = w * 0.32;
          redPacks.children[2].y = h * 0.66;
          redPacks.children[3].x = w * 0.678;
          redPacks.children[3].y = h * 0.66;
          redPacks.children[4].x = w * 0.81;
          redPacks.children[4].y = h * 0.388;

          mall = game.util.asw(w * 0.5, h * 0.351, "mall", 20, false);
          mall.inputEnabled = true;
          mall.events.onInputUp.add(() => {
            console.log("购物中心");
            that.fibonacciData("game", "打开购物中心");
            audio_click.play();
            window.location.href = "https://github.com/tylerrrkd";
          });
          cookBox = game.util.asw(w * 0.5, h * 0.576, "cookBox", 20, false);
          cookBox.inputEnabled = true;
          cookBox.events.onInputDown.add(() => {
            console.log("食神宝箱");
            that.fibonacciData("game", "打开食神宝箱");
            audio_click.play();
            that.popup.cookBox.isShow = true;
          });

          // console.log(redPacks.children)
        },
        createRole(grid) {
          let position = grid;
          let x = roadGrid[position].x * adaptW;
          let y = roadGrid[position].y * adaptH;
          /**
           * 此处做角色当前朝向判断
           **/
          moveDir = this.getRoleMoveDirection(grid);
          role = game.add.sprite(x, y, moveDir);
          role.anchor.set(0.5, 1);
          role.currentId = grid;
          game.util.setSize(role, w * 0.1, false);
        },
        initRoadGrid(grid) {
          // 为了道路循环
          let loop = 0;
          console.log("input grid: " + grid);
          console.log("Before roadGrid: " + roadGrid.length);
          if (grid % 16 == 0) {
            loop = parseInt(grid / 16);
          } else {
            loop = parseInt(grid / 16) + 1;
          }
          for (let i = 0; i < loop; i++) {
            roadGrid = roadGrid.concat(window.gridData);
          }
          console.log("After roadGrid: " + roadGrid.length);
        },
        createDiceBtn() {
          diceBtn = game.util.asw(w * 0.88, h * 0.8, "diceBtn", 18, false);
          diceTween = game.add.tween(diceBtn).to({ width: diceBtn.width * 1.2, height: diceBtn.height * 1.2 }, 300, Phaser.Easing.Linear.In, true, 0, -1, true);
          diceText = game.add.text(w * 0.88, h * 0.821, "次数: " + that.initUser.zscount, { fill: "#d30000", font: "bold 25px" });
          diceText.anchor.set(0.5);
          diceTextTween = game.add.tween(diceText).to({ width: diceText.width * 1.2, height: diceText.height * 1.2 }, 300, Phaser.Easing.Linear.In, true, 0, -1, true);
          diceTween.pause();
          diceTextTween.pause();
          if (that.initUser.zscount > 0) {
            diceTween.resume();
            diceTextTween.resume();
          }
          diceBtn.inputEnabled = true;
          diceBtn.events.onInputUp.add(() => {
            that.fibonacciData("game", "投掷骰子");
            if (oneClick) {
              return;
            }
            if (that.initUser.zscount <= 0) {
              that.tips.content = "你的投掷次数已用完，赠送点心给好友，好友领取后你可以获得投掷机会喔！";
              that.tips.isTimeOutBtnShow = true;
              that.tips.isTipsShow = true;
              return;
            }
            oneClick = true;
            diceTween.pause();
            diceTextTween.pause();
            game.add.tween(diceBtn).to({ width: diceBtn.width * 1.3, height: diceBtn.height * 1.3 }, 200, Phaser.Easing.Linear.In, true, 0, 0, true);
            game.add.tween(diceText).to({ width: diceText.width * 1.3, height: diceText.height * 1.3 }, 200, Phaser.Easing.Linear.In, true, 0, 0, true);
            /**
             * 回调判断次数与单次点击
             * **/
            if (!!!that.initUser.phone) {
              that.popup.isBindPhoneShow = true;
              if (that.initUser.zscount > 0) {
                diceTween.resume();
                diceTextTween.resume();
              }
              oneClick = false;
              return;
            }
            // that.postDozsz(role.currentId)
            //   .then((data) => {
            //     if (data.code == 200) {
            const resultGrid = Math.floor(6 * Math.random()) + 1 + role.currentId;
            const data = {
              resultGrid,
              isBox: true,
              receiveCount: 1,
              presentCount: 1,
              isLoginin: 1,
              gameType: 1,
              user: {
                phone: "18888888888",
                grid: resultGrid,
                zscount: that.initUser.zscount - 1
              },
              gridType: resultGrid % 16
            };
            that.initUser = data.user;
            that.popup.cookBox.hasTimes = data.isBox;
            // diceText.text = data.user.zscount
            this.dropDice(data.resultGrid - role.currentId, () => {
              if (data.gridType) {
                if (data.gridType == 3) {
                  that.popup.landmark.name = "五羊雕像";
                  that.popup.landmark.content = "获得一次抽奖机会";
                  that.popup.landmark.type = 3;
                  that.popup.landmark.isShow = true;
                  console.log("五羊雕像");
                  audio_onTheLandmark.play();
                } else if (data.gridType == 6) {
                  that.popup.landmark.name = "上下九";
                  that.popup.landmark.content = "获得一次游戏机会";
                  that.initUser.zscount += 1;
                  that.popup.landmark.type = 6;
                  that.popup.landmark.isShow = true;
                  console.log("上下九");
                  audio_onTheLandmark.play();
                } else if (data.gridType == 8) {
                  that.popup.landmark.name = "爱群大厦";
                  that.popup.landmark.content = "获得一次游戏机会";
                  that.initUser.zscount += 1;
                  that.popup.landmark.type = 8;
                  that.popup.landmark.isShow = true;
                  console.log("爱群大厦");
                  audio_onTheLandmark.play();
                } else if (data.gridType == 13) {
                  that.popup.landmark.name = "体育中心";
                  that.popup.landmark.content = "获得一次游戏机会";
                  that.initUser.zscount += 1;
                  that.popup.landmark.type = 13;
                  that.popup.landmark.isShow = true;
                  console.log("体育中心");
                  audio_onTheLandmark.play();
                } else if (data.gridType == 15) {
                  that.popup.landmark.name = "广州塔";
                  that.popup.landmark.content = "获得一次抽奖机会";
                  that.popup.landmark.type = 15;
                  that.popup.landmark.isShow = true;
                  console.log("广州塔");
                  audio_onTheLandmark.play();
                }
              } else {
                console.log("空格子");
              }
              console.log("---------------");
              if (that.initUser.zscount > 0) {
                diceTween.resume();
                diceTextTween.resume();
              }
              oneClick = false; // 动画走完才可以再投一次骰子
            });
            //   } else if (data.code == 205) {
            //     console.log(data)
            //     that.tips.content = '你的投掷次数已用完，赠送点心给好友，好友领取后你可以获得投掷机会喔！'
            //     that.tips.isTimeOutBtnShow = true
            //     that.tips.isTipsShow = true
            //     oneClick = false
            //   } else if (data.code == 99) {
            //     console.log(data)
            //     that.tips.content = data.msg
            //     that.tips.isTipsShow = true
            //     oneClick = false
            //   } else {
            //     console.log(data)
            //     that.tips.content = data.msg
            //     that.tips.isTipsShow = true
            //     oneClick = false
            //   }
            // }).catch((err) => {
            //   console.log(err)
            //   that.tips.content = '网络信号差，请稍后再试！'
            //   that.tips.isTipsShow = true
            //   oneClick = false
            // })
          });
        },
        dropDice(steps, cb) {
          dice = game.add.sprite(w * 0.5, h * 0.5 - 30, "dice", steps - 1);
          dice.anchor.set(0.5);
          game.util.setSize(dice, w * 0.04, false);

          audio_dice.play();
          let dropTween1 = game.add.tween(dice).to({
            angle: 720,
            y: dice.y - h * 0.3,
            width: dice.width * 1.5,
            height: dice.height * 1.5
          }, 500, Phaser.Easing.Linear.Out, true, 0, 0, false);
          let dropTween2 = game.add.tween(dice).to({
            angle: 720,
            y: dice.y + h * 0.22,
            width: dice.width * 4,
            height: dice.height * 4
          }, 700, Phaser.Easing.Linear.In, false, 0, 0, false);
          dropTween1.chain(dropTween2);
          dropTween2.onComplete.add(() => {
            let timer = setTimeout(() => {
              clearTimeout(timer);
              dice.destroy();
              /**
               * - 改变所在位置
               * - 做角色当前朝向判断
               * - 处理角色移动
               * * */
              // roleData.currentId = role.currentId
              let stepStart = role.currentId + 1;
              let stepEnd = role.currentId + steps + 1;
              console.log("steps: " + steps);
              console.log("stepStart: " + (stepStart - 1));
              console.log("stepEnd: " + (stepEnd - 1));
              if (stepEnd > roadGrid.length) {
                roadGrid = roadGrid.concat(window.gridData);
              }
              let stepDuration = roadGrid.slice(stepStart, stepEnd);
              moveDir = this.getRoleMoveDirection(role.currentId);
              role.loadTexture(moveDir);
              this.goRoleSteps(role, stepDuration, () => {
                /**
                 * 处理抽奖、跳转
                 **/
                cb && cb();
                // let match = [4, 7, 9, 14, 0].filter(v => v == stepEnd % 16)
                // if (match.length > 0) {
                //   if (match[0] == 4) {
                //     console.log("五羊雕像")
                //   } else if (match[0] == 7) {
                //     console.log("上下九")
                //   } else if (match[0] == 9) {
                //     console.log("爱群大厦")
                //   } else if (match[0] == 14) {
                //     console.log("体育中心")
                //   } else if (match[0] == 0) {
                //     console.log("广州塔")
                //   }
                // } else {
                //   console.log('空格子')
                // }
                // console.log("---------------")
              });
            }, 500);
          });
        },
        getRoleMoveDirection(currentId) {
          let dir = "";
          // if (currentId>= 0 && currentId <= 4) {
          if (currentId % 16 >= 0 && currentId % 16 < 1) {
            dir = "right-top";
          } else if (currentId % 16 >= 1 && currentId % 16 < 2) {
            dir = "left-top";
          } else if (currentId % 16 >= 2 && currentId % 16 < 3) {
            dir = "right-top";
          } else if (currentId % 16 >= 3 && currentId % 16 < 4) {
            dir = "left-top";
          } else if (currentId % 16 >= 4 && currentId % 16 < 6) {
            dir = "right-top";
          } else if (currentId % 16 >= 6 && currentId % 16 < 8) {
            dir = "right-bottom";
          } else if (currentId % 16 >= 8 && currentId % 16 < 9) {
            dir = "left-bottom";
          } else if (currentId % 16 >= 9 && currentId % 16 < 10) {
            dir = "right-bottom";
          } else if (currentId % 16 >= 10 && currentId % 16 < 11) {
            dir = "left-bottom";
          } else if (currentId % 16 >= 11 && currentId % 16 < 12) {
            dir = "right-bottom";
          } else if (currentId % 16 >= 12 && currentId % 16 < 14) {
            dir = "left-bottom";
          } else if (currentId % 16 >= 14 && currentId % 16 <= 15) {
            dir = "left-top";
          }
          // if (true) {
          //   dir = 'p-m-b'
          // }
          return dir;
        },
        goRoleSteps(obj, data, cb) {
          // console.log(data)
          let len = data.length;
          let stepsX = [];
          let stepsY = [];
          data.forEach(v => {
            stepsX.push(v.x * adaptW);
            stepsY.push(v.y * adaptH);
          });
          let playWalkAnimation = key => {
            obj.loadTexture(key);
            obj.animations.add("walk", [1, 2]);
            obj.animations.play("walk", 10, true);
          };

          let dealAnimation = () => {
            playWalkAnimation(this.getRoleMoveDirection(obj.currentId));
          };
          dealAnimation();

          let i = 0;
          let walk = () => {
            dealAnimation();
            // obj.bringToTop()

            game.add.tween(obj).to({ x: stepsX[i], y: stepsY[i] }, 500, Phaser.Easing.Linear.In, true, 0, 0).onComplete.add(() => {
              i++;
              obj.currentId += 1;
              if (i <= len - 1) {
                audio_steps.play();
                walk();
              } else {
                obj.animations.stop();
                obj.frame = 0;
                cb && cb();
              }
            });
          };
          walk();
        }
      };
    }
  }
};