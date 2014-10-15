var pouch = require('pouchdb')
var DimensionalPouch = {}

DimensionalPouch.sync = function(opts, readyCb) {
  var localDb = opts.localDb
  var remoteDb = opts.remoteDb

  localDb.replicate.from(remoteDb).then(function() {
    remoteDb.changes({
      since: 'now',
      live: true
    }).on('change', function(change) {
      localDb.replicate.from(remoteDb, {doc_ids: [change.id]})
    })

    readyCb()
  })
}

module.exports = DimensionalPouch
