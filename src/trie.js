const whitespaceRE = /\s+/g;

const config = {
}

function tNode(root, word, index) {
  var curr = root
  for(var i = 0, c = null; c = word.charAt(i); i++, prev = curr, curr = curr[c]) {
    curr[c] = {}
  }
  if (!curr.$)
    curr.$ = [index]
  else
    curr.$.push(index)
  return root
}

function run(node, cb) {
  for(var k in node) {
    cb(node)
    k !== '$' && run(node[k], cb)
  }
}

function tTree(words) {
  this.words = []
  this.root = {}
  for(var i = 0; i < words.length; i++) {
    this.addWord(words[i])
  }
}

tTree.prototype.addWord = function (word) {
  var prev = this.root
  var j = 0
  for(curr = prev; curr = curr[word.charAt(j)]; j++, prev = curr) {}
  tNode(prev, word.substr(j), this.words.length)
  this.words.push(word)
}

tTree.prototype.search = function (str) {
  const res = new Set()
  var prev = this.root
  var j = 0
  for(curr = prev; curr = curr[str.charAt(j)]; j++, prev = curr) {}
  j === str.length && run(prev, node => node.$ && node.$.forEach(i => res.add(this.words[i])))
  return Array.from(res)
}

const Trie = bTree

Trie.config = config

Trie.version = "__VERSION__"
