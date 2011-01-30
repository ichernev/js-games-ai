(function() {
  var U = JSG.Util;
  var NS = JSG.Games.Rocks = JSG.Games.Rocks || {};

  var find_win = function(len, other, sgs) {
    var k, j, p2, cxor;
    for (k = 1; k <= 2; ++k) {
      for (j = 0; j + k <= len; ++j) {
        p2 = len - j - k;
        cxor = sgs[j] ^ sgs[p2] ^ other;
        if (cxor === 0) {
          return j * 2 + (k - 1);
        }
      }
    }
    return -1;
  };

  NS.PerfectAI = function(player_id, game) {
    this.player_id = player_id;
    this.game = game;
    this.subscribe(this.game);

    this.precompute();
  };


  U.mix(NS.PerfectAI.prototype, U.EventTarget);
  U.mix(NS.PerfectAI.prototype, {
    
    precompute: function() {
      var N = NS.Game.rocks;
      var sgs = new Array(N + 1);
      var used = new Array(N + 1);
      sgs[0] = 0;
      var i, j, k, p2, cxor, csg;
      for (i = 1; i <= N; ++i) {
        for (k = 1; k <= 2; ++k) {
          for (j = 0; j + k <= i; ++j) {
            p2 = i - j - k;
            cxor = sgs[j] ^ sgs[p2];
            used[cxor] = i;
          }
        }
        for (csg = 0; used[csg] === i; ++csg) { $.noop(); }
        // $.log("%d -> %d", i, csg);
        sgs[i] = csg;
      }
      this.sgs = sgs;
      this.N = N;
    },

    playerTurn: function(player) {
      if (player.player_id === this.player_id) {
        var move = this.move(this.game.state);
        this.game.playMove(this.player_id, move);
      }
    },

    move: function(state) {
      state = state.concat([0]);
      var N = this.N;
      var sgs = this.sgs;

      var segs = [];
      var tot_sg = 0;
      var beg = 0;
      var i, len, move;
      for (i = 1; i <= N; ++i) {
        if (state[i] === 0 && state[i-1] === 1) {
          len = i - beg;
          segs.push([beg, len]);
          tot_sg ^= sgs[len];
        } else if (state[i-1] === 0 && state[i] === 1) {
          beg = i;
        }
      }

      var k, j;
      var res;
      for (i = 0; i < segs.length; ++i) {
        move = find_win(segs[i][1], tot_sg ^ sgs[segs[i][1]], sgs);
        if (move >= 0) {
          k = move % 2 + 1;
          j = U.div(move, 2);
          res = [segs[i][0] + j];
          if (k === 2) {
            res.push(segs[i][0] + j + 1);
          }
          return res;
        }
      }
      $.log("losing");
      return [segs[0][0]];
    }

  });

}());
// void precomp() {
//   static int used[MAXN];
//   sgs[0] = 0;
//   for (int i = 1; i <= N; ++i) {
//     for (int k = 1; k <= 2; ++k) {
//       for (int j = 0; j + k <= i; ++j) {
//         int p2 = i - j - k;
//         int cxor = sgs[j] ^ sgs[p2];
//         used[cxor] = i;
//       }
//     }
//     int csg;
//     for (csg = 0; used[csg] == i; ++csg);
//     printf("%d -> %d\n", i, csg);
//     sgs[i] = csg;
//   }
// }
// 
// int find_win(int len, int other) {
//   for (int k = 1; k <= 2; ++k) {
//     for (int j = 0; j + k <= len; ++j) {
//       int p2 = len - j - k;
//       int cxor = sgs[j] ^ sgs[p2] ^ other;
//       if (cxor == 0) {
//         // printf("got winning from %d %d %d %d\n", j, p2, sgs[j], sgs[p2]);
//         return j * 2 + (k - 1);
//       }
//     }
//   }
//   // printf("lose\n");
//   return -1;  // take 1 from beg
// }
// 
// void play() {
//   vector<pair<int, int> > segs;
//   int tot_sg = 0;
//   int beg = 0;
//   for (int i = 1; i <= N; ++i) {
//     if (state[i] == 0 && state[i-1] == 1) {
//       int len = i - beg;
//       printf("found %d %d\n", beg, len);
//       segs.push_back(make_pair(beg, len));
//       tot_sg ^= sgs[len];
//       // int move = find_win(len);
//       // printf("%d (%d %d) --> %d", len, beg, i, move);
//       // if (move >= 0) {
//       //   int k = move % 2 + 1;
//       //   int j = move / 2;
//       //   state[beg + j] = 0;
//       //   if (k == 2) {
//       //     state[beg + j + 1] = 0;
//       //   }
//       //   goto after_loop;
//       // } else {
//       //   beg = -1;
//       //   printf("not winning\n");
//       // }
//     } else if (state[i-1] == 0 && state[i] == 1) {
//       beg = i;
//     }
//   }
//   // printf("losing\n");
//   // assert(state[beg] == 1);
//   // state[beg] = 0;
//   // after_loop:;
//   for (int i = 0; i < (int) segs.size(); ++i) {
//     int move = find_win(segs[i].second, tot_sg ^ sgs[segs[i].second]);
//     if (move >= 0) {
//       int k = move % 2 + 1;
//       int j = move / 2;
//       state[segs[i].first + j] = 0;
//       if (k == 2) {
//         state[segs[i].first + j + 1] = 0;
//       }
//       printf("wining\n");
//       goto after;
//     }
//   }
//   // playig first one.
//   printf("losing\n");
//   state[segs[0].first] = 0;
// after:;
// }
// 
// int main() {
//   scanf("%d", &N);
// 
//   precomp();
// 
//   for (;;) {
//     for (int i = 0; i < N; ++i) {
//       char c;
//       scanf(" %c", &c);
//       state[i] = (c == '*');
//     }
//     play();
//     for (int i = 0; i < N; ++i) {
//       printf(" %c", state[i] ? '*' : '-');
//     }
//     puts("");
//   }
// }
