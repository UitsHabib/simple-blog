import axios from 'axios';
import Types from './user.types';

export function getSignedInUserProfile() {
    return {
        type: Types.GET_PROFILE,
        payload: axios({
            method: 'get',
            url: '/api/users/profile'
        })
    };
}

export function updateSignedInUserProfile(data) {
    return {
        type: Types.UPDATE_PROFILE,
        payload: axios({
            method: 'put',
            url: '/api/users/profile',
            data
        })
    };
}

export function login(data) {
    return {
        type: Types.LOGIN,
        payload: axios({
            method: 'post',
            url: '/api/login',
            data
        })
    };
}

export function changePassword(data) {
    return {
        type: Types.CHANGE_PASSWORD,
        payload: axios({
            method: 'post',
            url: '/api/users/change-password',
            data
        })
    };
}
