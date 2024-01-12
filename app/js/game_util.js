window.gameUtil = game => {
  let w = game.width;
  let h = game.height;
  return {
    asw(x, y, key, size, isHeight) {
      // console.log(x, y);
      let temp = game.add.sprite(x, y, key);
      temp.anchor.set(0.5);
      if (isHeight) {
        this.setSize(temp, size / 100 * h, true);
      } else {
        this.setSize(temp, size / 100 * w, false);
      }
      return temp;
    },

    // /**
    //  * 添加一个精灵
    //  * @param  {[type]} x   [x轴]
    //  * @param  {[type]} y   [y轴]
    //  * @param  {[type]} key [名字]
    //  * @return {[type]}     [返回精灵]
    //  */
    as(x, y, key) {
      let temp = game.add.sprite(x, y, key);
      return temp;
    },
    // /**
    //      * [setSize description]

    //      * @param {[type]}  sprite [description]
    //      * @param {[type]}  len    [description]
    //      * @param {Boolean} param  [description]
    //      */
    setSize(sprite, len, param) {
      if (param) {
        let p = len / sprite.height;
        sprite.height = len;
        sprite.width = sprite.width * p;
        // console.log(p)
      } else {
        let p = len / sprite.width;
        sprite.width = len;
        sprite.height = sprite.height * p;
        // console.log(p)
      }
    },
    setFull(sprite) {
      sprite.width = w;
      sprite.height = h;
    },

    shake() {
      game.camera.shake(0.005, 300);
    },

    // /**
    //  * 动画函数
    //  * @param  {[type]}   obj  [精灵对象]
    //  * @param  {Function} cb   [回调]
    //  * @param  {[type]}   time [时间]
    //  * @return {[type]}        []
    //  */
    fromLeft(obj, cb, time) {
      let tt = time ? time : durTime;
      game.add.tween(obj).from({ x: -game.width / 2 }, tt, Phaser.Easing.Linear.In, true, 0, 0, false).onComplete.add(function () {
        cb();
      });
    },

    toLeft(obj, time, cb) {
      game.add.tween(obj).to({ x: -game.width / 2 }, durTime, Phaser.Easing.Linear.In, true, time, 0, false).onComplete.add(function () {
        obj.destroy();
        cb && cb();
      });
    },

    fromRight(obj, cb, time) {
      let tt = time ? time : durTime;
      game.add.tween(obj).from({ x: game.width * 1.5 }, tt, Phaser.Easing.Linear.In, true, 0, 0, false).onComplete.add(function () {
        cb();
      });
    },

    fromFlash(obj, cb) {
      game.add.tween(obj).from({ alpha: 0 }, 100, Phaser.Easing.Linear.In, true, 0, 5, true).onComplete.add(function () {
        cb();
      });
    },

    toRight(obj, time, cb) {
      game.add.tween(obj).to({ x: game.width * 1.5 }, durTime, Phaser.Easing.Linear.In, true, time, 0, false).onComplete.add(function () {
        obj.destroy();
        cb && cb();
      });
    },
    fromTop(obj, cb, time) {
      let tt = time ? time : durTime;
      game.add.tween(obj).from({ y: -game.height * 0.4 }, tt, Phaser.Easing.Linear.In, true, 0, 0, false).onComplete.add(function () {
        cb();
      });
    },
    toTop(obj, time, cb) {
      game.add.tween(obj).to({ y: -game.height * 0.4 }, durTime, Phaser.Easing.Linear.In, true, time, 0, false).onComplete.add(function () {
        obj.destroy();
        cb && cb();
      });
    },
    fromBottom(obj, cb, time) {
      game.add.tween(obj).from({ y: game.height * 1.4 }, time, Phaser.Easing.Linear.In, true, 0, 0, false).onComplete.add(function () {
        cb && cb();
      });
    },

    toBottom(obj, time, cb) {
      game.add.tween(obj).to({ y: game.height * 1.4 }, durTime, Phaser.Easing.Linear.In, true, time, 0, false).onComplete.add(function () {
        obj.destroy();
        cb && cb();
      });
    },
    fromZoomMax(obj, cb, time) {
      game.add.tween(obj).from({ width: obj.width * 4.2, height: obj.height * 4.2 }, time, Phaser.Easing.Linear.In, true, 0, 0, false).onComplete.add(function () {
        cb && cb();
      });
    },
    fromZoomMax2(obj, cb) {
      game.add.tween(obj).from({ width: obj.width * 10.2, height: obj.height * 10.2, alpha: 0.3 }, 250, Phaser.Easing.Linear.In, true, 0, 0, false).onComplete.add(function () {
        cb && cb();
      });
    },
    fromZoomMin(obj, cb, time) {
      game.add.tween(obj).from({ width: obj.width * 0.02, height: obj.height * 0.02 }, time, Phaser.Easing.Linear.In, true, 0, 0, false).onComplete.add(function () {
        cb && cb();
      });
    },
    fromZoomMin2(obj, cb, time) {
      game.add.tween(obj).from({ width: obj.width * 0.02, height: obj.height * 0.02 }, 500, Phaser.Easing.Linear.In, true, 0, 0, false).onComplete.add(function () {
        let timer = setTimeout(function () {
          obj.destroy();
          cb && cb();
          clearTimeout(timer);
        }, 500);
      });
    },
    fromAlpha(obj, cb) {
      game.add.tween(obj).from({ alpha: 0 }, durTime, Phaser.Easing.Linear.In, true, 0, 0, false).onComplete.add(function () {
        cb && cb();
      });
    },
    toAlpha(obj, time, cb) {
      game.add.tween(obj).to({ alpha: 0 }, durTime, Phaser.Easing.Linear.In, true, time, 0, false).onComplete.add(function () {
        obj.destroy();
        cb && cb();
      });
    },

    toZoomMin(obj, time, cb) {
      game.add.tween(obj).to({ width: obj.width * 0.1, height: obj.height * 0.1, alpha: 0 }, durTime, Phaser.Easing.Linear.In, true, time, 0, false).onComplete.add(function () {
        obj.destroy();
        cb && cb();
      });
    },

    toZoomMin2(obj, time, cb) {
      game.add.tween(obj).to({ width: obj.width * 0.1, height: obj.height * 0.1, alpha: 0 }, 500, Phaser.Easing.Linear.In, true, time, 0, false).onComplete.add(function () {
        obj.destroy();
        cb && cb();
      });
    },
    toZoomMax(obj, time, cb) {
      game.add.tween(obj).to({ width: obj.width * 5.1, height: obj.height * 5.1, alpha: 0 }, durTime, Phaser.Easing.Linear.In, true, time, 0, false).onComplete.add(function () {
        obj.destroy();
        cb && cb();
      });
    },

    dangling(obj, isLeft) {
      if (isLeft) {
        game.add.tween(obj).to({ x: obj.x + 10 }, 1000, Phaser.Easing.Linear.In, true, 0, 10000, true);
      } else {
        game.add.tween(obj).to({ y: obj.y + 10 }, 1000, Phaser.Easing.Linear.In, true, 0, 10000, true);
      }
    },
    zoomandmax(obj) {
      game.add.tween(obj).to({ width: obj.width * 1.08, height: obj.height * 1.08 }, 400, Phaser.Easing.Linear.In, true, 0, 10000, true);
    },

    phoneValidate(num) {
      if (!/^1(3|4|5|7|8)\d{9}$/.test(num)) {
        return false;
      } else {
        return true;
      }
    },

    addMask(alpha) {
      let mask = game.add.graphics();
      mask.beginFill(0x000000, alpha);
      mask.drawRect(0, 0, w, h);
      mask.endFill();

      return mask;
    },
    changeArr(arr) {
      let newArr = arr.sort(function () {
        return 0.5 - Math.random();
      });
      return newArr;
    }
  };
};