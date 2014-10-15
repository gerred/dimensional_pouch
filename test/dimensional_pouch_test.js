var expect = require('chai').expect
var DimensionalPouch = require('../lib/dimensional_pouch')
var PouchDB = require('pouchdb')
var testRemoteDb = new PouchDB('http://192.168.59.103:5984/dimensional_pouch_test')
var testLocalDb = new PouchDB('dimensional_pouch_local_test.db')

describe('DimensionalPouch', function() {
  before(function(done) {
    testRemoteDb.put({_id: 'test_document', data: 'Mittens the Cat'}).then(function() {
      DimensionalPouch.sync({localDb: testLocalDb, remoteDb: testRemoteDb}, done)
    })
  })

  after(function(done) {
    testRemoteDb.destroy().then(function() {
      testLocalDb.destroy().then(function() {
        done()
      })
    })
  })

  describe('#sync', function() {
    it('should replicate the initial data', function(done) {
      testLocalDb.get('test_document').then(function(doc) {
        expect(doc.data).to.equal('Mittens the Cat')
        done()
      })
    })

    it('should update data when the remote CouchDB instance is updated', function(done) {
      testRemoteDb.put({_id: 'another_test_document', data: 'Paws the Dog'}).then(function() {
        setTimeout(function() {
          testLocalDb.get('another_test_document').then(function(doc) {
            expect(doc.data).to.equal('Paws the Dog')
            done()
          })
        }, 100)
      })
    })
  })
})
