import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CategoryTopics from './category-topics.component';

function Categories({ category, posts }) {
    return (
        <div>
            <CategoryTopics />
        </div>
    );
}

export default Categories;