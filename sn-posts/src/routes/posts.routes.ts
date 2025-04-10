import { Router, Request, Response } from "express";
import { getPool } from "../utils/db";
import { verifyToken } from "../middleware/auth";

const router = Router();

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

// Dar like
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

// Quitar like
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

// Contar likes
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