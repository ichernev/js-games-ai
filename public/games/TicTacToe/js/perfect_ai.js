(function() {
  var U = JSG.Util;
  var NS = JSG.Games.TicTacToe = JSG.Games.TicTacToe || {};

  // Helper methods.
  var encode = function(arr_state) {
    var base = 3;
    var int_state = 0;
    for (var i = arr_state.length - 1; i >= 0; --i) {
      int_state *= base;
      int_state += 2 - arr_state[i];
    }
    return int_state;
  };

  var decode = function(int_state) {
    var arr_state = [];
    for (var i = 0; i < 9; ++i) {
      var rem = int_state % 3;
      arr_state.push(rem);
      int_state = (int_state - rem) / 3;
    }
    return arr_state;
  };

  var eachMove = function(state, dir, moved, cb) {
    var from = dir > 0 ? 1 : moved;
    var to   = dir > 0 ? moved : 1;
    // var sc = new Array(state);  // state copy.
    var sc = state.slice(0);  // state copy.
    for (var i = 0, l = sc.length; i < l; ++i) {
      if (sc[i] === from) {
        sc[i] = to;
        if (cb.call(this, sc, i) !== undefined) {
          break;
        }
        sc[i] = from;
      }
    }
  };

  var validState = function(as) {
    var p1 = U.count(as, 0), p2 = U.count(as, 2);
    return p1 === p2 || p1 - 1 === p2;
  };

  var finalState = function(a) {
    return U.foreach([
        a[0] + a[1] + a[2],
        a[3] + a[4] + a[5],
        a[6] + a[7] + a[8],
        a[0] + a[3] + a[6],
        a[1] + a[4] + a[7],
        a[2] + a[5] + a[8],
        a[0] + a[4] + a[8],
        a[2] + a[4] + a[6]], function(sum) {
      return sum === 0 || sum === 6 ? true : undefined;
    }) === true;
  };

  var move_idx_to_move = function(move_idx) {
    return [U.div(move_idx, 3), move_idx % 3];
  };

  var game_state_to_as = function(game_state, our_id) {
    var as = new Array(9);
    for (var i = 0; i < 9; ++i) {
      var coord = move_idx_to_move(i);
      var game_id = game_state[coord[0]][coord[1]];
      // This is inversed, because encode inverses it yet again...
      as[i] = game_id === -1 ? 1 : game_id === our_id ? 0 : 2;
    }
    return as;
  };

  NS.PerfectAI = function(player_id, game) {
    this.player_id = player_id;
    this.game = game;
    this.subscribe(this.game);

    this.calculateMoves();
  };

  U.mix(NS.PerfectAI.prototype, U.EventTarget);
  U.mix(NS.PerfectAI.prototype, {

    calculateMoves: function() {
      var max_state = U.pow(3, 9);
      var is;  // integer state
      var as;  // is converted to array
      var q = [];
      var state_type = new Array(max_state),
          LOSE = 1, WIN = 2, DRAW = undefined, INV = 3;
      var state2move = new Array(max_state);
      var out_deg = new Array(max_state);
      // Count output degree & find final states.
      for (is = 0; is < max_state; ++is) {
        as = decode(is);
        if (!validState(as)) {
          state_type[is] = INV;
          continue;
        }
        if (finalState(as)) {
          q.push(is);
          state_type[is] = LOSE;
        } else {
          var deg = 0;
          eachMove(as, 1, 2, function(ns) {
            ++ deg;
          });
          out_deg[is] = deg;
        }
      }

      var ci;  // Current index in q.
      // Fill WIN & LOSE states.
      for (ci = 0; ci < q.length; ++ci) {
        is = q[ci];
        as = decode(is);
        eachMove(as, -1, 0, function(os, i) {
          var ios = encode(os);
          if (state_type[ios] !== DRAW) {
            return;
          }
          if (state_type[is] === LOSE) {
            state_type[ios] = WIN;
            state2move[ios] = i;
            q.push(ios);
          } else {
            --out_deg[ios];
            if (out_deg[ios] === 0) {
              state_type[ios] = LOSE;
              state2move[ios] = i;
              q.push(ios);
            }
          }
        });
      }

      // Now fill all draw states with a draw move.
      var ins;
      for (is = 0; is < max_state; ++is) {
        if (state_type[is] !== DRAW) { continue; }
        state2move[is] = [];
        as = decode(is);
        eachMove(as, 1, 2, function(ns, i) {
          ins = encode(ns);
          if (state_type[ins] === DRAW) {
            state2move[is].push(i);
            // return 0;
          }
        });
      }

      this.state2move = state2move;
      this.state_type = state_type;
    },

    playerTurn: function(player) {
      if (player.player_id === this.player_id) {
        this.move(game_state_to_as(this.game.state, this.game.current_player_idx));
      }
    },
    
    move: function(as) {
      var stored = this.state2move[encode(as)];
      var move = $.isArray(stored) ? U.randElement(stored) : stored;
      this.game.playMove(this.player_id, move_idx_to_move(move));
    }

  });
}());
