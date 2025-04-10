import { Router, Request, Response } from "express";
import { getPool } from "../utils/db";
import { verifyToken } from "../middleware/auth";

const router = Router();

/**
 * @openai
 * /posts:
 *   get:
 *     summary: Obtiene todos los posts con el conteo de likes.
 *     description: Devuelve todos los posts ordenados por fecha de creación, junto con el conteo de likes de cada uno.
 *     tags:
 *       - Posts
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de posts con el conteo de likes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   content:
 *                     type: string
 *                   user_id:
 *                     type: integer
 *                   likes_count:
 *                     type: integer
 *       401:
 *         description: No autorizado, se requiere un token válido.
 */
router.get('/', verifyToken, async (req: Request, res: Response) => {
    const pool = getPool();
    const result = await pool.query(
      `
      SELECT 
          p.id,
          p.content,
          p.user_id,
          COUNT(l.user_id) AS likes_count
      FROM 
          posts p
      LEFT JOIN 
          likes l ON p.id = l.post_id
      GROUP BY 
          p.id
      ORDER BY
          p.created_at DESC;`,
    );

    res.status(200).json(result.rows);
});

/**
 * @openai
 * /posts:
 *   post:
 *     summary: Crea un nuevo post.
 *     description: Permite a un usuario crear un nuevo post con contenido.
 *     tags:
 *       - Posts
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post creado exitosamente.
 *       400:
 *         description: Error en los datos enviados.
 *       500:
 *         description: Error interno al crear el post.
 */
router.post('/', verifyToken, async (req: Request, res: Response) => {
    const { content } = req.body;
    const { id } = (req as any).user;

    console.log(content, id);
    
    try {
        const pool = getPool();
        await pool.query(
          'INSERT INTO posts (user_id, content, created_at) VALUES ($1, $2, NOW())',
          [id, content]
        );
    
        res.status(201).json({ message: 'Post creado con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear post', error });
    }
});

/**
 * @openai
 * /posts/{postId}/like:
 *   post:
 *     summary: Agrega un like a un post.
 *     description: Permite a un usuario dar like a un post.
 *     tags:
 *       - Posts
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID del post al cual se le dará el like.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Like agregado exitosamente.
 *       400:
 *         description: Error al procesar la solicitud.
 *       500:
 *         description: Error interno al dar like.
 */
router.post('/:postId/like', verifyToken, async (req, res) => {
  const postId = req.params.postId;
  const { id } = (req as any).user;

  try {
    const pool = getPool();
    await pool.query(
      'INSERT INTO likes (user_id, post_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [id, postId]
    );
    res.json({ message: 'Like agregado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar like', error });
  }
});

/**
 * @openai
 * /posts/{postId}/like:
 *   delete:
 *     summary: Elimina un like de un post.
 *     description: Permite a un usuario quitar el like a un post.
 *     tags:
 *       - Posts
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID del post al cual se le eliminará el like.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Like eliminado exitosamente.
 *       400:
 *         description: Error al procesar la solicitud.
 *       500:
 *         description: Error interno al quitar like.
 */
router.delete('/:postId/like', verifyToken, async (req, res) => {
    const postId = req.params.postId;
    const { id } = (req as any).user;
  
    try {
      const pool = getPool();
      await pool.query('DELETE FROM likes WHERE user_id = $1 AND post_id = $2', [id, postId]);
      res.json({ message: 'Like eliminado' });
    } catch (error) {
      res.status(500).json({ message: 'Error al quitar like', error });
    }
});

/**
 * @openai
 * /posts/{postId}/likes:
 *   get:
 *     summary: Obtiene el número de likes de un post.
 *     description: Retorna la cantidad de likes de un post específico.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID del post para contar los likes.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Número de likes del post.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 likes:
 *                   type: integer
 *       500:
 *         description: Error interno al contar los likes.
 */
router.get('/:postId/likes', async (req, res) => {
    const postId = req.params.postId;
  
    try {
      const pool = getPool();
      const result = await pool.query('SELECT COUNT(*) FROM likes WHERE post_id = $1', [postId]);
      res.json({ likes: parseInt(result.rows[0].count, 10) });
    } catch (error) {
      res.status(500).json({ message: 'Error al contar likes', error });
    }
});

export default router;