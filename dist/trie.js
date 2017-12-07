/**
 * Trie v0.0.9
 * Copyright 2017 Léopold Szabatura
 * Released under the MIT License
 * https://github.com/MetaCorp/trie
 */

(function(root, factory) {
  /* ======= Global Wade ======= */
  if(typeof module === "undefined") {
    root.Trie = factory();
  } else {
    module.exports = factory();
  }
}(this, function() {
    var whitespaceRE = /\s+/g;
    
    var config = {
    }
    
    function bNode(root, word, index) {
      var curr = root
      for(var i = 0, c = null; c = word.charAt(i); i++, prev = curr, curr = curr[c]) {
        curr[c] = {}
      }
      if (!curr.$)
        { curr.$ = [index] }
      else
        { curr.$.push(index) }
      return root
    }
    
    function run(node, cb) {
      var keys = Object.keys(node)
    
      for (var i = 0, l = keys.length; i < l; i++) {
        cb(node)
        keys[i] !== '$' && run(node[keys[i]], cb)
      }
    }
    
    function bTree(words) {
      var this$1 = this;
    
      this.words = []
      this.root = {}
      for(var i = 0, l = words.length; i < l; i++) {
        this$1.addWord(words[i])
      }
    }
    
    bTree.prototype.addWord = function (word) {
      var this$1 = this;
    
      var wordArray = word.toLowerCase().split(' ')
      for (var i = 0, l = wordArray.length; i < l; i++) {
        var word$1 = wordArray[i]
        var prev = this$1.root
        var j = 0
        for(curr = prev; curr = curr[word$1.charAt(j)]; j++, prev = curr) {}
        bNode(prev, word$1.substr(j), this$1.words.length)
      }
      this.words.push(word)
    }
    
    bTree.prototype.search = function (str) {
      var this$1 = this;
    
      var res = new Set()
      var strArray = str.toLowerCase().split(' ')
      for (var i = 0, l = strArray.length; i < l; i++) {
        var str$1 = strArray[i]
        var prev = this$1.root
        var j = 0
        for(curr = prev; curr = curr[str$1.charAt(j)]; j++, prev = curr) {}
        j === str$1.length && run(prev, function (node) { return node.$ && node.$.forEach(function (i) { return res.add(this$1.words[i]); }); })
      }
      return Array.from(res)
    }
    
    var Trie = bTree
    
    Trie.config = config
    
    Trie.version = "0.0.9"
    
    return Trie;
}));
