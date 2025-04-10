import React from "react";
import { Post } from "../types/posts";
import axios from "axios";

interface PostListInterface {
    posts: Post[];
    handleLike: () => void;
}

const PostsList: React.FC<PostListInterface> = ({ posts, handleLike }) => {

    const onLike = async (postId: number) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            await axios.post(`http://localhost:3002/${postId}/like`, {}, { headers: { Authorization: `Bearer ${token}` } });

            handleLike();
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className='w-full h-full overflow-y-auto rounded px-4 py-2 shadow-md bg-white divide-y'>
            {posts.map((post) => (
                <div key={post.id} className="px-4 py-2">
                    <p className="text-gray-500 dark:text-gray-400">
                        {post.content}
                    </p>
                    <span onClick={() => onLike(post.id)} className="mt-3 text-gray-500 text-sm hover:text-red-400 hover:cursor-pointer">{post.likes_count} likes</span> 
                </div>
            ))}
        </div>
    )
}

export default PostsList;