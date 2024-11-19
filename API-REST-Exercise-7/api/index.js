import { Router } from "express"; 
let router = Router()

router.get('/', (req, res) => {
    res.json( {
        'name': 'home page'
    })
})
router.get('/index', (req, res) => {
    res.json( {
        'Hello': 'Hello world!'
    })
})

export default router;