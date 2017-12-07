# Trie

Blazing fast <1kb search

[![Build Status](https://travis-ci.org/MetaCorp/trie.svg?branch=master)](https://travis-ci.org/MetaCorp/trie)

### Installation

NPM

```sh
npm install @metacorp/trie
```

CDN

```html
<script src="https://unpkg.com/@metacorp/trie"></script>
```

### Usage

Initialize Trie with an array of data.

```js
const trie = new Trie(['Apple', 'Lemon', 'Orange', 'Tomato'])
```

Now you can search for a query within the data, and Trie will return results.

```js
trie.search('App')
/*
["Apple"]
*/
```

Or add word to the data.

```js
trie.addWord('App')
```

### About

This repo is heavily inspired from [Wade](https://github.com/kbrsh/wade).
It's a simpler version of it without the ability to score the results, but is therefore significantly faster, and allow to add word after initialisation.

Trie comes in two implementations of [prefix tree](https://en.wikipedia.org/wiki/Trie).

Version 1:
- bundle size: 1.55kb(min) - 757b(gzip)
- init speed: 12.24 Ops/sec
- search speed: 79,000 Ops/sec

Version 2:
- bundle size: 1.94kb(min) - 831b(gzip)
- init speed: 3.07 Ops/sec
- search speed: 94,000 Ops/sec

Check jsperf here:
- [init](https://jsperf.com/metacorp-trie-init)
- [searching](https://jsperf.com/metacorp-trie-search)

And bundle size: [here](https://bundlephobia.com/result?p=@metacorp/trie)

### Processors

Trie uses a set of processors to preprocess data and search queries. By default, these will:

* Make everything lowercase
* Remove punctuation
* Remove stop words

A process consists of different functions that process a string and modify it in some way, and return the transformed string.

You can easily modify the processors as they are available in `Trie.config.processors`, for example:

```js
// Don't preprocess at all
Trie.config.processors = []

// Add custom processor to remove periods
Trie.config.processors.push(function(str) {
  return str.replace(/\./g, '')
})
```

All functions will be executed in the order of the array (0-n) and they will be used on each document in the data.

The stop words can be configured to include any words you like, and you can access the array of stop words by using:

```js
Trie.config.stopWords = [/* array of stop words */]
```

The punctuation regular expression used to remove punctuation can be configured with:

```js
Trie.config.punctuationRE = /[.!]/g // should contain punctuation to remove
```

### License

Licensed under the [MIT License](https://github.com/MetaCorp/trie/blob/master/LICENSE)

Copyright (c) Meta l.szabatura@gmail.com
