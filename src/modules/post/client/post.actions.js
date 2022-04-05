import axios from 'axios';
import Types from './post.types';

export function getPosts() {
    return {
        type: Types.GET_POSTS,
        payload: axios({
            method: 'get',
            url: '/api/posts'
        })
    };
}
