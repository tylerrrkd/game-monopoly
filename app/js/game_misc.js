window.gameMisc = () => {
  return {
    getDiceSteps(currentId) {
      let position = currentId % 16;
      console.log("position: " + position);
      let rate = 500; // 50% 实际为 50% + 16.67% 
      let randomArr = this.shuffle();
      let steps = 0;
      return new Promise(resolve => {
        /**
         * 根据需求修改为50%几率到达抽奖或游戏处
         */
        if (0 < randomArr[0] && randomArr[0] <= rate) {
          console.log("rate in");
          if (position >= 0 && position < 3) {
            steps = 3 - position;
          } else if (position >= 3 && position < 6) {
            steps = 6 - position;
          } else if (position >= 6 && position < 8) {
            steps = 8 - position;
          } else if (position >= 8 && position < 13) {
            steps = 13 - position;
          } else if (position >= 13 && position < 15) {
            steps = 15 - position;
          } else if (position >= 15) {
            steps = 4;
          }
        } else {
          console.log("rate out");
          steps = parseInt(Math.random() * 5 + 1);
        }
        // steps = 1
        let data = {
          steps: steps
        };
        resolve(data);
      });
    },
    initRole() {
      return new Promise(resolve => {
        /** 
         * 初始化角色
         * **/
        let data = {
          gridId: 0 // 所在格子
        };
        resolve(data);
      });
    },
    shuffle() {
      // 洗牌算法
      let arr = [];
      for (let i = 1; i <= 1000; i++) {
        arr.push(i);
      }
      let n = arr.length,
          random;
      while (0 != n) {
        random = Math.random() * n-- >>> 0; // 无符号右移位运算符向下取整
        [arr[n], arr[random]] = [arr[random], arr[n]]; // ES6的结构赋值实现变量互换
      }
      return arr;
    }
  };
};