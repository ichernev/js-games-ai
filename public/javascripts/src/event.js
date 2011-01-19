(function() {
  var U = JSG.Util;

  U.Event = function() {
    this.listeners = [];
  };

  U.mix(U.Event.prototype, {

    fire: function() {
      var args = U.toA(arguments);
      var recv = args.shift();
      U.foreach(this.listeners, function(listener) {
        listener[recv] && listener[recv].apply(listener, args);
      });
    },

    subscribe: function(l) {
      this.listeners.push(l);
    },

    unsubscribe: function(l) {
      U.erase(this.listeners, l);
    }

  });

  U.EventTarget = {

    prep: function() {
      this.subscribedTo = this.subscribedTo || [];
    },

    subscribe: function(o) {
      this.prep();
      this.subscribedTo.push(o);
      o.ev.subscribe(this);
    },

    unsubscribe: function(o) {
      this.prep();
      if (U.erase(this.subscribedTo, o)) {
        o.ev.unsubscribe(this);
      }
    },

    unsubscribeAll: function() {
      this.prep();
      U.foreach(this.subscribedTo, function(o) {
        o.ev.unsubscribe(this);
      });
      this.subscribedTo = [];
    }

  };
      

}());
