import React, { useRef, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { Form, Formik, Field, ErrorMessage } from 'formik';

import { login } from '../user.actions';
import { loginSchema } from '../user.schema';

export default function Login() {
    const dispatch = useDispatch();
    const location = useLocation();
    const { addToast } = useToasts();

    useEffect(() => {
        const searchObj = {};
        const searchParams = location.search.slice(1).split("&");

        searchParams.forEach(element => {
            searchObj[element.split("=")[0]] = element.split("=")[1];
        });
    }, [location]);

    return (
        <div className="app-login">
            <div className="w-100 app-login__container">
                <div className="container">
                    <div className="row">
                        <div className="col-xxl-5 col-lg-6 col-md-8 col-12 mx-auto">
                            <h1 className="text-center mb-3 mb-sm-5">
                                <img alt="CDP LOGO" src="/assets/CDP2x.png" height="102" />
                            </h1>
                            {/* <h3 className="app-login__header text-center py-3">Welcome to CDP</h3> */}
                            <div className="card-body p-4 p-sm-5 border bg-white">
                                <Formik
                                    initialValues={{
                                        email: '',
                                        password: ''
                                    }}
                                    displayName="Login"
                                    validationSchema={loginSchema}
                                    onSubmit={(values, actions) => {
                                        recaptchaRef.current.executeAsync().then(recaptchaToken => {
                                            dispatch(login({
                                                username: values.email,
                                                password: values.password,
                                            })).then(response => {
                                            }).catch(error => {
                                                addToast(error.response.data, {
                                                    appearance: 'error',
                                                    autoDismiss: true
                                                });
                                            });

                                            actions.setSubmitting(false);
                                        });
                                    }}
                                >
                                    {formikProps => (
                                        <Form onSubmit={formikProps.handleSubmit}>
                                            <div className="form-group">
                                                <label className="form-label label-style">Email</label>
                                                <Field className="form-control" data-testid="email" type="email" name="email" autoComplete="username" />
                                                <div className="invalid-feedback" data-testid="email-error"><ErrorMessage id="email-error" name="email" /></div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label label-style">Password</label>
                                                <Field className="form-control" data-testid="password" type="password" name="password" autoComplete="current-password" />
                                                <div className="invalid-feedback" data-testid="password-error"><ErrorMessage name="password" /></div>
                                            </div>

                                            <button type="submit" className="btn btn-block text-white app-login__btn mt-4 p-2 fw-bold">Sign In</button>
                                        </Form>
                                    )}
                                </Formik>

                                <div className="mt-4 text-center">
                                    <Link
                                        to="/forgot-password"
                                        style={{ textDecoration: 'none' }}
                                        className="text-secondary"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
