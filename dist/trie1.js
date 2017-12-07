/**
 * Trie v0.0.9
 * Copyright 2017 Léopold Szabatura
 * Released under the MIT License
 * https://github.com/MetaCorp/trie
 */

(function(root, factory) {
  /* ======= Global Wade ======= */
  if(typeof module === "undefined") {
    root.Trie1 = factory();
  } else {
    module.exports = factory();
  }
}(this, function() {
    var whitespaceRE = /\s+/g;
    
    var config = {
    }
    
    function bNode(word, index) {
      if (!word || !word.length) {
        this.value = null
        this.children = []
      } else {
        this.value = word[0]
        if (word.length === 1) {
          this.addIndex(index)
          this.children = []
        } else
          { this.children = [new bNode(word.substr(1), index)] }
      }
    }
    
    bNode.prototype.getChild = function (val) {
      if (val === undefined) { return }
      var ret = this.children.filter(function (n) { return n.value === val; })
      return ret.length ? ret[0] : undefined
    }
    
    bNode.prototype.addChild = function (node) {
      this.children.push(node)
    }
    
    bNode.prototype.addIndex = function (index) {
      if (this.indexes)
        { this.indexes.push(index) }
      else
        { this.indexes = [index] }
    }
    
    bNode.prototype.run = function (cb) {
      cb(this)
      this.children.forEach(function (node) { return node.run(cb); })
    }
    
    function bTree(words) {
      var this$1 = this;
    
      this.words = []
      this.root = new bNode()
      words && words.forEach(function (word) { return this$1.addWord(word); })
    }
    
    bTree.prototype.addWord = function (word) {
      if (!word || !word.length) { return }
      var index = this.words.length
      this.words.push(word)
      var prev = this.root,
        i = 0;
      var wordArray = word.toLowerCase().split(' ')
      for (var i = 0, l = wordArray.length; i < l; i++) {
        var word$1 = wordArray[i]
        for (var node = prev; node = node.getChild(word$1.charAt(i)); i++, prev = node) {}
        if (i >= word$1.length)
          { prev.addIndex(index) }
        else
          { prev.addChild(new bNode(word$1.substr(i), index)) }
      }
    }
    
    bTree.prototype.search = function (str) {
      var this$1 = this;
    
      var ret = new Set()
      var strArray = str.toLowerCase().split(' ')
      for (var i = 0, l = strArray.length; i < l; i++) {
        var str$1 = strArray[i]
        var prev = this$1.root,
          i = 0;
        for (var node = prev; node = node.getChild(str$1.charAt(i)); i++, prev = node) {}
        i === str$1.length &&
          prev.run(function (node) { return node.indexes &&
            node.indexes.forEach(function (index) { return ret.add(this$1.words[index]); }); })
      }
      return Array.from(ret)
    }
    
    var Trie1 = bTree
    
    Trie1.config = config
    
    Trie1.version = "0.0.9"
    
    return Trie1;
}));
