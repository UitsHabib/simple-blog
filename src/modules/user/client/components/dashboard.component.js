import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Dashboard() {
    const serviceCategories = useSelector(state => state.userReducer.loggedInUser.catagoryWiseServices.serviceCategories);
    return (
        <main className='app__content cdp-light-bg'>
            <div className='container-fluid'>
                <div className='row h-100'>
                    <div className='col-12 col-lg-7 col-xl-8 py-3'>
                        Welcome
                    </div>
                </div>
            </div>
        </main>
    );
}
