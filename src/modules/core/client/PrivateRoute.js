import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useCookies } from 'react-cookie';
import { Route, Redirect } from 'react-router-dom';
import Navbar from './components/navbar.component';
import axios from 'axios';

export default function PrivateRoute({ component: Component, module, ...rest }) {
    const [cookies] = useCookies();
    const loggedInUser = useSelector(state => state.userReducer.loggedInUser);

    let services = loggedInUser && loggedInUser.services
        ? loggedInUser.services.map(sc => sc.slug)
        : [];

    useEffect(() => {
        if(loggedInUser && cookies.logged_in){
            if(!module || services.some( module_permission => module_permission === module)){
            } else {
                const { location } = { ...rest };
                location &&
                axios.post("/api/audit/create-log", {
                    path: location.pathname,
                });
            }
        }
    }, [])

    return (
        <Route {...rest} render={props => {
            if(loggedInUser || cookies.logged_in){
                if(!(loggedInUser && cookies.logged_in)) return null;
                
                if(!module || services.some( module_permission => module_permission === module)) {
                    return (<>
                        <Navbar />
                        <Component {...props} />
                    </>)
                } else {
                    return props.history.replace({
                        pathname: "/forbidden",
                        state: { from: props.location },
                    });
                }

            } else {
                return (<Redirect push to={{
                        pathname: "/login",
                        state: { from: props.location }
                    }}/>)
            }
        }} />
    );
}
