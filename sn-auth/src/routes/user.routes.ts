import { Router, Request, Response } from "express";
import { compareSync, hashSync } from "bcryptjs";
import { getPool } from "../utils/db";
import { AuthResponse, UserInput } from "../types";
import jwt from 'jsonwebtoken';

const router = Router();


/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registro de usuario
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 */
router.post('/register', async (req: Request<{}, {}, UserInput>, res: Response) => {
    const { name, email, password } = req.body;    
    try {
        const hashedPassword = hashSync(password, 10);
        const pool = getPool();
        const result = await pool.query(
          'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
          [name, email, hashedPassword]
        );
        res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el usuario', error });
    }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Registro de login
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: admin@email.com
 *               password: "123456"
 *     responses:
 *       200:
 *         description: Login exitoso
 */
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const pool = getPool();
        const result = await pool.query(
          'SELECT * FROM users WHERE email = $1',
          [email]
        );

        const [user] = result.rows;

        if (!user || !compareSync(password, user.password)) throw new Error('Invalid credentials');

        const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.status(200).json({ user, token } as AuthResponse);
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el usuario', error });
    }
});

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Obtiene el perfil del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *       401:
 *         description: Token inválido o expirado
 */
router.get('/profile', async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No se ha proporcionado un token de autenticación' });
    
    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
        
        const pool = getPool();
        const result = await pool.query(
          'SELECT * FROM users WHERE id = $1',
          [id]
        );

        const [user] = result.rows;

        if (!user) throw new Error('No se ha encontrado el usuario');

        res.status(200).json(user);
    } catch (error) {
        res.status(401).json({ message: 'Token inválido o expirado' });
    }
});

export default router;