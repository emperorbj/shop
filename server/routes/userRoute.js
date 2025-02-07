import express from 'express';
import { loginUser, registerUser } from '../controllers/userLogin.js';
import { protect } from '../middlewares/authMiddleware.js';


const router = express.Router();

router.post('/login', loginUser);
router.post('/signup', registerUser);
router.get('/profile',protect, (req,res)=>{
    res.json(req.user)
})

export default router;