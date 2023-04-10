var test = require('tape')
var truthy = require('../.')
var inspect = require('util').inspect

test('truthy js types are truthy', function (t) {
  var types = [
    [],
    ['beep'],
    {},
    {beep: 'boop'},
    true,
    10,
    0,
    'beep',
    ''
  ]
  t.plan(types.length)
  types.forEach(function each (val) {
    t.true(truthy(val), inspect(val) + ' is existy')
  })
})

test('falsey js types are falsey', function (t) {
  var types = [
    false,
    undefined,
    null,
    {}.notHere
  ]
  t.plan(types.length)
  types.forEach(function each (val) {
    t.false(truthy(val), inspect(val) + ' is existy')
  })
})
