import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserCard from '../components/user-card';
import PostsList from '../components/posts-list';
import { Post } from '../types/posts';
import axios from 'axios';

const HomePage: React.FC = () => {

  const [posts, setPosts] = useState<Post[]>([]);
  
  const getPosts = useCallback(async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get<Post[]>("http://localhost:3002/", { headers: { Authorization: `Bearer ${token}` } });
        
        console.log(res.data);
        
        setPosts(res.data);
        
    } catch (error) {
        console.log(error);
    }
  }, [])

  useEffect(() => {
    getPosts();
  }, [])

  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      nav("/login");
    }
  }, []);

  return (
    <section className='flex flex-col h-screen container mx-auto py-2 gap-4'>
      <UserCard onSubmit={getPosts} />
      <PostsList posts={posts} handleLike={getPosts} />
    </section>
  )
}

export default HomePage