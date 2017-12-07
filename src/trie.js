const whitespaceRE = /\s+/g

const config = {
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
      const stopWords = config.stopWords
      const terms = getTerms(entry)
      var i = terms.length

      while ((i--) !== 0)
        if (stopWords.indexOf(terms[i]) !== -1)
          terms.splice(i, 1)

      return terms.join(' ')
    }
  ]
}

const getTerms = function (entry) {
  if (!entry || !entry.length) return []
  const terms = entry.split(whitespaceRE)
  if (terms[0].length === 0) terms.shift()
  if (terms[terms.length - 1].length === 0) terms.pop()
  return terms
}

const processEntry = function (entry) {
  if (entry.length) {
    for (let i = 0, l = config.processors.length; i < l; i++)
      entry = config.processors[i](entry)
  }
  return getTerms(entry)
}

function bNode(root, word, index) {
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
  const keys = Object.keys(node)

  for (var i = 0, l = keys.length; i < l; i++) {
    cb(node)
    keys[i] !== '$' && run(node[keys[i]], cb)
  }
}

function bTree(words) {
  this.words = []
  this.root = {}
  for(var i = 0, l = words.length; i < l; i++) {
    this.addWord(words[i])
  }
}

bTree.prototype.addWord = function (word) {
  const wordArray = processEntry(word)
  if (!wordArray.length) return
  for (var i = 0, l = wordArray.length; i < l; i++) {
    const word = wordArray[i]
    var prev = this.root
    var j = 0
    for(curr = prev; curr = curr[word.charAt(j)]; j++, prev = curr) {}
    bNode(prev, word.substr(j), this.words.length)
  }
  this.words.push(word)
}

bTree.prototype.search = function (str) {
  const strArray = processEntry(str)
  if (!strArray.length) return []
  const res = new Set()
  for (var i = 0, l = strArray.length; i < l; i++) {
    const str = strArray[i]
    var prev = this.root
    var j = 0
    for(curr = prev; curr = curr[str.charAt(j)]; j++, prev = curr) {}
    j === str.length && run(prev, node => node.$ && node.$.forEach(i => res.add(this.words[i])))
  }
  return Array.from(res)
}

const Trie = bTree

Trie.config = config

Trie.version = "__VERSION__"
