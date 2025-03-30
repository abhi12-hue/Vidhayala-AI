const jwt = require('jsonwebtoken');
const isAuthicated = async(req, res , next)=>{
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                message:"The User is Not Auticated",
                success:false,
            })
        }

        const decode = await jwt.verify(token , process.env.SCREAT_KEY);
        if(!decode){
            return res.status(401).json({
                message:"The given Token is not Right",
                success:false,
            })
        }

        req.id = decode.userId;
        next();
    }catch(error){
        console.log(error);
    }
};

module.exports = {isAuthicated};