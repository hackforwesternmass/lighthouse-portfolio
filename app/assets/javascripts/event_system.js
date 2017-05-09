var EventSystem = (function() {
  var self = this;

  self.queue = {};

  return {
    publish: function (event) {
      var queue = self.queue[event];

      if (typeof queue === 'undefined') {
        return false;
      }

      for (var i = 0; i < queue.length; i++) {
        var args = Array.from(arguments).splice(1)
        queue[i].apply(this, args)
      }

      return true;
    },
    subscribe: function(event, callback) {
      if (typeof self.queue[event] === 'undefined') {
        self.queue[event] = [];
      }

      self.queue[event].push(callback);
    },
    unsubscribe: function(event) {
      if (typeof self.queue[event] === 'undefined') {
        return false;
      }

      delete self.queue[event];
    }
  };
}());
