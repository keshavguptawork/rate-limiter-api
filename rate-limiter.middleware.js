const redis = require('./redis-client')

function rateLimiter({cooldown, maxRequests}) {
  return async function(req, res, next){
    const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).slice(0,9)
    
    // makes entry for ip OR increments
    const requests =  await redis.incr(ip)

    // add cooldown or TTL
    let ttl
    if(requests === 1){
      await redis.expire(ip, cooldown)
      ttl = cooldown 
    } else {
      ttl = await redis.ttl(ip)
    }

    // add request limiter
    if (requests > maxRequests){
      return res.status(503)
        .json({
          response: 'error',
          callsInAMinute: requests,
          ttl
        })
    } else {
      req.requests = requests
      req.ttl = ttl
      next()
    }
  }
}

module.exports = rateLimiter