import axios from 'axios';
import React, { useEffect } from "react";
import { useDispatch, useSelector  } from "react-redux";
import { Switch, Route, useHistory } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { ToastProvider } from 'react-toast-notifications';

import "bootstrap/scss/bootstrap";
import "@fortawesome/fontawesome-free/css/all.css";
import "./app.scss";

import Forbidden from './Forbidden';
import NoMatch from "./NoMatch";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import { Dashboard, Login, ForgotPassword, ResetPassword, PlatformRoutes, userActions, MyProfile } from "../../platform";
import { ConsentRoutes } from "../../privacy";
import SwaggerLogin from '../../../config/server/lib/swagger/swagger-login.component';
import store from './store';
import { PartnerRoutes } from '../../partner';
import { getAllCountries } from '../../core/country';
import HelpComponent from '../../core/client/components/help.component';
import { InformationRoutes } from '../../information';
import clinicalTrialsRoutes from '../../clinical-trials/client/clinical-trials.routes';
import { MarketingRoutes } from '../../marketing';

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
    const dispatch = useDispatch();
    const [, , removeCookie] = useCookies();
    const history = useHistory()
    const [visitedItem, setVisitedItem] = React.useState( JSON.parse(localStorage.getItem('recentVisitedServices')) || {});
    const loggedInUser = useSelector(state => state.userReducer.loggedInUser);
    let services = [];

    const setVisitedService = (path, userId) => {
        services.map(service => {
            if (service.link === path) {
                visitedItem[userId] ? visitedItem[userId].unshift(service) : visitedItem[userId] = [service];
                let uniq = _.uniqBy(visitedItem[userId], "name");
                visitedItem[userId] = uniq.slice(0, 5);
                localStorage.setItem("recentVisitedServices", JSON.stringify(visitedItem));
                setVisitedItem(JSON.parse(localStorage.getItem("recentVisitedServices")));
            }
        });

    }

    useEffect(() => {
        dispatch(getSignedInUserProfile()).then(() => {
            dispatch(getAllCountries());
        }).catch(err => {
            if (err.response && err.response.status === 401) removeCookie('logged_in', { path: '/' });
        });
    }, []);

    useEffect(() => {
        history.listen((location) => {
            if (loggedInUser && services.length === 0) {
                services.length === 0 && loggedInUser.services.map(service => {
                    if (!loggedInUser.catagoryWiseServices.serviceCategories.some((data) => data.title === service.title)){
                        services.push({
                            id: service.slug, name: service.title, link: service.relative_path, icon: service.icon_class,
                        });
                    }
                });

            }

            loggedInUser && setVisitedService(location.pathname, loggedInUser.permittedUserProfile.id);

        })
    }, [history, loggedInUser])

    return (
        <ToastProvider placement="top-center" autoDismissTimeout={2500} >
            <Switch>
                <PublicRoute path="/swagger" component={SwaggerLogin}/>

                <PublicRoute path="/login" component={Login}/>

                <PrivateRoute exact path="/" component={Dashboard}/>

                <Route path='/consent' component={ConsentRoutes}/>

                <Route path="/reset-password" component={ResetPassword}/>

                <Route path="/forgot-password" component={ForgotPassword}/>

                <Route path='/business-partner' component={PartnerRoutes} />

                <Route path="/forbidden" component={Forbidden}/>

                <Route path="/platform" component={PlatformRoutes}/>

                <Route path="/information" component={InformationRoutes}/>

                <PrivateRoute path="/my-profile" component={MyProfile}/>

                <PrivateRoute path="/help" component={HelpComponent}/>

                <Route path="/clinical-trials" component={clinicalTrialsRoutes}/>

                <Route path="/marketing" component={MarketingRoutes}/>

                <Route component={NoMatch} />
            </Switch>
        </ToastProvider>
    );
}
