import axios from 'axios';
import React, { useEffect } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import { ToastProvider } from 'react-toast-notifications';

import "bootstrap/scss/bootstrap";
import "@fortawesome/fontawesome-free/css/all.css";
import "./app.scss";

import NoMatch from "./NoMatch";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import store from './store';

const { getSignedInUserProfile } = userActions;

let refCount = 0;

function setLoading(isLoading) {
    if (isLoading) {
        refCount++;
        document.getElementById('loader').style = 'display: block';
    } else if (refCount > 0) {
        refCount--;
        if (refCount > 0) document.getElementById('loader').style = 'display: block';
        else document.getElementById('loader').style = 'display: none';
    }
}

axios.interceptors.request.use(config => {
    setLoading(true);
    return config;
}, error => {
    setLoading(false);
    return Promise.reject(error);
});

axios.interceptors.response.use(response => {
    setLoading(false);
    return response;
}, error => {
    setLoading(false);
    return Promise.reject(error);
});

axios.interceptors.response.use(
    response => response,
    error => {
        const { loggedInUser } = store.getState().userReducer;

        if (error.response && error.response.status === 401 && loggedInUser) window.location = "/login";

        return Promise.reject(error);
    }
);

export default function App() {
    return (
        <ToastProvider placement="top-center" autoDismissTimeout={2500} >
            <Switch>
                <PublicRoute path="/login" component={Login}/>

                <PrivateRoute exact path="/" component={Dashboard}/>

                <Route component={NoMatch} />
            </Switch>
        </ToastProvider>
    );
}
