import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'

interface user {
    name: string;
    username: string;
    email: string;
    password: string;
    id: any;
    createdAt: any;
}



export const authenticate = async (req:Request, res:Response, next:NextFunction) =>{


    try {

        const authorise = req.headers.authorization;
        if(authorise === undefined){
            return res.status(401).send({
                error: true,
                message: "no auth"
            })
        }
    
        const tokenArr = authorise.split(" ")
        const token = tokenArr[1];

        console.log(token)
        if(!token || token === ''){
            return res.status(401).send({
                error: true,
                method:req.method,
                message: "Access Denied"
            })
        }
    
        const deCodeToken = jwt.verify(token, `${process.env.SECRET}`)
        if("user" in req){
            req.user = deCodeToken 
        }
    
        return next();
  
       
    } catch (err:any) {
        return res.status(401).send({
            status: 'error',
            method:req.method,
            message: "Authorization failed",
            error: err.message
        })
        
    }

}

