import axios from 'axios';
import Types from './category.types';

export function getCategoriesWithPosts() {
    console.log('habib')
    return {
        type: Types.GET_CATEGORIES_WITH_POSTS,
        payload: axios({
            method: 'get',
            url: '/api/categories?isAvailablePosts=true'
        })
    };
}
