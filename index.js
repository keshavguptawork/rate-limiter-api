const express = require('express')
const path = require('path')
const redis = require('./redis-client.js')
const rateLimiter = require('./rate-limiter.middleware.js')

const app = express()

app.use(express.json())

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/api1', rateLimiter({ cooldown: 10, maxRequests: 5 }), async (req, res) => {
  // expensive function goes here...

  return res.json({
    response: 'OK', 
    callsInAMinute: 'on Cricket: '+ req.requests,
    ttl: req.ttl
  })
})
app.post('/api2', rateLimiter({ cooldown: 10, maxRequests: 5 }),  async (req, res) => {
// expensive function goes here...

return res.json({
  response: 'OK', 
  callsInAMinute: 'on Soccer: '+ req.requests,
  ttl: req.ttl
})
})
app.post('/api3', rateLimiter({ cooldown: 10, maxRequests: 5 }),  async (req, res) => {
// expensive function goes here...

return res.json({
  response: 'OK', 
  callsInAMinute: 'on Tennis: '+ req.requests,
  ttl: req.ttl
})
})
const port = process.env.PORT || 3000;
app.listen(port)