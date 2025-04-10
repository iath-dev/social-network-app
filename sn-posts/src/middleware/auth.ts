import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

export function verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No se ha proporcionado un token de autenticación' });
    
    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
        (req as any).user = { id };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido o expirado' });
    }
}