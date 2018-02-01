'use strict'

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

(async function() {
  // Connection URL
  const url = 'mongodb://rick:Ricky4The7Great_@ds119688.mlab.com:19688/dagtestdb'
  // Database Name
  const dbName = 'dagtestdb'
  let client

  try {
    // Use connect method to connect to the Server
    client = await MongoClient.connect(url)

    const db = client.db(dbName)
    
    const col = await db.collection('dodusers')
    
    col.insertOne({
        name: 'Thorgon',
        gamesPlayed: 3,
        totalPoints: 574
    })
    
  } catch (err) {
    console.log(err.stack)
  }

  if (client) {
    client.close()
  }
})()

//
//
// // Require Modules
// const MongoClient = require('mongodb').MongoClient
// const url = 'mongodb://rick:Ricky4The7Great_@ds119688.mlab.com:19688/dagtestdb'
//
// MongoClient.connect(url, (err, db) => {
//     if (err) throw err
//     // let dbo = db.db('dagtestdb')
//     // dbo.authenticate('rick', 'Ricky4The7Great_', (err, res) => {
//         console.log('Successfully authenticated')
//         db.createCollection('users', (err, res) => {
//             if (err) throw err
//             console.log('Collection created')
//             db.close()
//         })
//     // })
// })
