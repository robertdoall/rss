# truthy

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![coverage][coverage-image]][coverage-url]

[npm-image]: https://img.shields.io/npm/v/@bret/truthy.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@bret/truthy
[travis-image]: https://img.shields.io/travis/bcomnes/truthy.svg?style=flat-square
[travis-url]: https://travis-ci.org/bcomnes/truthy
[coverage-image]: https://img.shields.io/codeclimate/coverage/github/bcomnes/truthy.svg?style=flat-square
[coverage-url]: https://codeclimate.com/github/bcomnes/truthy


Determines if something should be considered a synonym for `true`.

A modularized version of the `truthy` function found in [*Functional Javascript*](http://shop.oreilly.com/product/0636920028857.do) by [Michael Fogus](http://blog.fogus.me/).

## Install

```
$ npm i @bret/truthy --save
```

## Usage

```js
var truthy = require('@bret/truthy')
truthy(false) // false
truthy(undefined) // false
truthy(0) // true
truthy('') // true
```

## Contributing

Contributions welcome! Please read the [contributing guidelines](CONTRIBUTING.md) first.

## Related

- [`existy`](https://www.npmjs.com/package/existy)

## References

- [*Functional Javascript*](http://shop.oreilly.com/product/0636920028857.do) by [Michael Fogus](http://blog.fogus.me/)
- ["this is my best module"](https://twitter.com/substack/status/469024887949242368) - substack

## License

[ISC](LICENSE)
