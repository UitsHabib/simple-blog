import React, { useEffect } from 'react';
import TopNavbar from './top-navbar.component';
import { Navbar } from 'react-bootstrap';
import RightNavbar from './right-navbar.component';
import Posts from './posts.component';
import CoverPhoto from './cover-photo.component';
import { useDispatch, useSelector } from "react-redux";
import { categoryActions } from "../../../category";
import { postActions } from "../../../post";
import "../../../../stylesheets/style.css";

function Content({ categories, posts }) {
    return (
        <div id="content">
            <Posts posts={posts}/>
            <RightNavbar categories={categories}/>           
        </div>
    )
}

function Home(props) {
    const dispatch = useDispatch();

    const categoryList = useSelector(state => state.categoryReducer.categoriesWithPostList);
    const postList = useSelector(state => state.postReducer.postList);

    useEffect(() => {
        dispatch(categoryActions.getCategoriesWithPosts());
        dispatch(postActions.getPosts());
    }, []);

    return (
        <div id="screen"> 
            <TopNavbar />
            <Navbar />
            <CoverPhoto />
            <Content categories={categoryList.categories || []} posts={postList.posts || []} />
        </div>
    );
}

export default Home;