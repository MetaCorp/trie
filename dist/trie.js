/**
 * Trie v0.1.2
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
    var whitespaceRE = /\s+/g
    
    var config = {
      stopWords: [],
      punctuationRE: /[!"',.:;?]/g,
      processors: [
        function (entry) {
          return entry.toLowerCase()
        },
        function (entry) {
          return entry.replace(config.punctuationRE, '')
        },
        function (entry) {
          var stopWords = config.stopWords
          var terms = getTerms(entry)
          var i = terms.length
    
          while ((i--) !== 0)
            { if (stopWords.indexOf(terms[i]) !== -1)
              { terms.splice(i, 1) } }
    
          return terms.join(' ')
        }
      ]
    }
    
    var getTerms = function (entry) {
      if (!entry || !entry.length) { return [] }
      var terms = entry.split(whitespaceRE)
      if (terms[0].length === 0) { terms.shift() }
      if (terms[terms.length - 1].length === 0) { terms.pop() }
      return terms
    }
    
    var processEntry = function (entry) {
      if (entry.length) {
        for (var i = 0, l = config.processors.length; i < l; i++)
          { entry = config.processors[i](entry) }
      }
      return getTerms(entry)
    }
    
    function bNode(root, word, index) {
      var curr = root
      for (var i = 0, c = null; c = word.charAt(i); i++, prev = curr, curr = curr[c]) {
        curr[c] = {}
      }
      if (!curr.$)
        { curr.$ = [index] }
      else
        { curr.$.push(index) }
      return root
    }
    
    function run(node, cb) {
      for (var i = 0, keys = Object.keys(node); key = keys[i]; i++)
        { key !== '$' ? run(node[key], cb) : cb(node.$) }
    }
    
    function bTree(words) {
      var this$1 = this;
    
      this.words = []
      this.root = {}
      for (var i = 0, l = words.length; i < l; i++) {
        this$1.addWord(words[i])
      }
    }
    
    bTree.prototype.addWord = function (word) {
      var this$1 = this;
    
      var wordArray = processEntry(word)
      if (!wordArray.length) { return }
      for (var i = 0, l = wordArray.length; i < l; i++) {
        var word$1 = wordArray[i]
        var prev = this$1.root
        var j = 0
        for (curr = prev; curr = curr[word$1.charAt(j)]; j++, prev = curr) {}
        bNode(prev, word$1.substr(j), this$1.words.length)
      }
      this.words.push(word)
    }
    
    bTree.prototype.search = function (str) {
      var this$1 = this;
    // Missing first word
      var strArray = processEntry(str)
      var l = strArray.length
      if (!l) { return [] }
      var res = new Set()
      var addSet = function ($) {
        for (var i = 0, l = $.length; i < l; i++) {
          res.add(this$1.words[$[i]])
        }
      }
      for (var i = 0; i < l; i++) {
        var str$1 = strArray[i]
        var prev = this$1.root
        var j = 0
        for (curr = prev; curr = curr[str$1.charAt(j)]; j++, prev = curr) {}
        j === str$1.length && run(prev, addSet)
      }
      return Array.from(res)
    }
    
    function run2(node) {
      if (!node.$s) {
        var set = new Set()// DOUBLON ? => SET
        for (var i = 0, keys = Object.keys(node); key = keys[i]; i++) {
          (key !== '$' ? run2(node[key]) : node.$).forEach(function (e) { return set.add(e); })
        }
        node.$s = Array.from(set)
      }
      return node.$s
    }
    
    bTree.prototype.search2 = function (str) {
      var this$1 = this;
    
      var strArray = processEntry(str)
      if (!strArray.length) { return [] }
      var res = new Set()
      for (var i = 0, l = strArray.length; i < l; i++) {
        var str$1 = strArray[i]
        var prev = this$1.root
        var j = 0
        for (curr = prev; curr = curr[str$1.charAt(j)]; j++ , prev = curr) { }
        j === str$1.length && run2(prev).forEach(function (i) { return res.add(this$1.words[i]); })
      }
      return Array.from(res)
    }
    
    bTree.prototype.save = function () {
    }
    
    var Trie = bTree
    
    Trie.config = config
    
    Trie.version = "0.1.2"
    
    return Trie;
}));
