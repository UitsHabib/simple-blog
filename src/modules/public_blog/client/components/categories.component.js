import React from 'react';
import { NavLink } from 'react-router-dom';
import "../../../../stylesheets/style.css";

function Categories({ categories }) {
    return (
        <>
            { categories.map(category => (
                <div className='category'>
                    <p className='topic' style={{ color: 'red' }}>{`${category.title}(${category.posts?.length || 0}):`}</p>
                    { category.posts?.map(post => <><NavLink className='topic' key={post.id} to={`/posts/${post.id}`}>{post.title}</NavLink><br></br></>) }
                </div>
            )) }
        </>
    );
}

export default Categories;