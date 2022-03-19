import React, { useState, useEffect, createContext} from 'react'
import { getAllItemsSorted } from '../supabase-util';

const TABLE = 'posts'
export const BlogContext = createContext({
    posts: [],
    getPosts: () => {},
    loading: false,

});

const BlogProvider = (props) => {
    const [posts, setPosts] = useState('');
    const [loading, setLoading] = useState(false);
    const [noData, setNoData] = useState(false);

    const getPosts = async () => {
        setLoading(true);
        const data = await getAllItemsSorted(TABLE, 'id');
        setPosts(data);
        setLoading(false);
        
    };
    useEffect(() => {
        getPosts();
    }, [])



    const contextValue = {
        posts,
        getPosts,
        loading,
    }
  return (
    <BlogContext.Provider value={contextValue}>
        {props.children}
    </BlogContext.Provider>
  )
}

export default BlogProvider