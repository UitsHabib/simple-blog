import React from 'react';
import { NavLink } from 'react-router-dom';

function CategoryTopics({ category, posts }) {
    return (
        <div>
            <p style={{ color: 'red' }}>{`${category.title}(${posts.length}):`}</p>
            { posts.map(post => <NavLink key={post.id} to={`/posts/${post.id}`}>{post.title}</NavLink>) }
        </div>
    );
}

export default CategoryTopics;