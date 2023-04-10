var existy = require('existy')

function truthy (x) { return (x !== false) && existy(x) }

module.exports = truthy
