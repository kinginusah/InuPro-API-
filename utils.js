import jwt from 'jsonwebtoken';
import {getUsers} from './database.js';
import * as settings from './config.json' with {type:"json"}
const limiterSettings = settings.default.rateLimiterSettings


const sum = (a, b) => {
    return a + b;
}

const getLimiterWindow = () => {
    const window =Math.round(
        Date.now() / limiterSettings.windowSizeInMillis
    )
    return window
}
// predicate function: true if the number of requests have exceeded
// for this specific user within the limiting window.

const rateLimiter =(user, req, res) => {
    const window =getLimiterWindow()
    // is this user moving to the next window?
    if (user.rateLimiting.window < window) {
        user.rateLimiting.window = window; 
        user.rateLimiting.requestCounter = 1;
        res.set('X-rateLimit-Remaining', limiterSettings.limit - 1)

    } else { // we are the same window we visited last time
        if (user.rateLimiting.requestCounter >= limiterSettings.limit) {
            res.set('X-rateLimit-Remaining', 0)
            res.status(429).end()
            return true

        } else{
            user.rateLimiting.requestCounter++
            res.set('X-rateLimit-Remaining', limiterSettings.limit - user.rateLimiterSettings.requestCounter)
        }
        
    }

    return false
}

const verifyToken = (req, res, next) => {
    const bearer_token = req.header('Authorization');
    if(bearer_token && bearer_token.toLowerCase().startsWith('bearer')) {
        const token = bearer_token.substring(7);
        console.log(token);
        try{
            const decodedToken = jwt.verify(token, 'my_secret_key')
            const now = Date.now()/1000;
            console.log(decodedToken)
            const isValid = (decodedToken.exp-now) >= 0  ? true : false;
            if (isValid){
                let user = getUsers().users.find(a => (a.username === decodedToken.username)&&(a.token === token))
                if (user) {
                    if (! rateLimiter( user, req, res)) 
                        next()
                } else
                     res.status(401).json({"error": "Unauthorized"})
             
                } else
                 res.status(401).json({"error": "invalid token"})
                }
                   
         catch (err) {
            res.status(401).json({"error": "invalid token"})
        }
    }else
        res.status(401).json({"error": "invalid token"})
}

export{
    verifyToken
}
export {
    sum
}