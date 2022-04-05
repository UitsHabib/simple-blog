import React, { useEffect } from 'react';
import TopNavbar from './top-navbar.component';
import Navbar from './navbar.component';
import RightNavbar from './right-navbar.component';
import Posts from './posts.component';
import CoverPhoto from './cover-photo.component';
import { useDispatch, useSelector } from "react-redux";
import { categoryActions } from "../../../category";
import { postActions } from "../../../post";
import "../../../../stylesheets/style.css";
import { useParams } from 'react-router-dom';

function PostContent({ post }) {
    return (
        <div id="left_part">
            <h1>{post.title}</h1>
            <hr/>
            <p style={{ color: 'orangered' }}>{`${post.created_at} by ${post.user?.first_name || ''} ${post.user?.last_name || ''}`} </p>
            <p style={{ color: '#616161', fontSize: '20px' }}>{post.content}</p>
        </div>
    )
}

function Content({ post, categories }) {
    return (
        <div id="content">
            <PostContent post={post}/>
            <RightNavbar categories={categories}/>           
        </div>
    )
}

function Post(props) {
    const dispatch = useDispatch();
    const { id } = useParams()

    const categoryList = useSelector(state => state.categoryReducer.categoriesWithPostList);
    const post = useSelector(state => state.postReducer.post);

    useEffect(() => {
        if(id) {
            dispatch(categoryActions.getCategoriesWithPosts());
            dispatch(postActions.getPost(id));
        }
    }, [id]);

    return (
        <div id="screen"> 
            <TopNavbar />
            <Navbar />
            <CoverPhoto />
            <Content post={post || {}} categories={categoryList.categories || []} />
        </div>
    );
}

export default Post;