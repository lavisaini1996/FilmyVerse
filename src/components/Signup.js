import React, { useState } from 'react';
import { TailSpin } from 'react-loader-spinner';
import { Link } from 'react-router-dom';
import { signInWithPhoneNumber, RecaptchaVerifier, getAuth } from "firebase/auth";
import app from '../firebase/firebase';
import swal from 'sweetalert';
import { usersRef } from '../firebase/firebase';
import { addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
const auth = getAuth(app);

const Signup = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        mobile: '',
        password: "",
        name: ''
    });
    const [loading, setLoading] = useState(false);
    const [otpSent, setotpSent] = useState(false);
    const [OTP, setOTP] = useState('');



    const generateRecaptcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
            'size': 'invisible',
            'callback': (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                // onSignInSubmit();
            }
        }, auth);
    }



    const requestOtp = () => {
        setLoading(true);
        generateRecaptcha();
        let appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(auth, `+91${form.mobile}`, appVerifier)
            .then((confirmationResult) => {
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                window.confirmationResult = confirmationResult;
                swal({
                    text: 'OTP Sent',
                    icon: 'success',
                    buttons: false,
                    timer: 3000
                });
                setotpSent(true);
                setLoading(false);
                // ...
            }).catch((error) => {
                // Error; SMS not sent
                // ...
                console.log(error);
            });

    }

    const verifyOTP = () => {
        try {
            setLoading(true);
            window.confirmationResult.confirm(OTP).then((result) => {
                // User signed in successfully.
                uploadData();
                swal({
                    text: 'Successfully Registered',
                    icon: 'success',
                    buttons: false,
                    timer: 3000
                })
                navigate('/login');
                setLoading(false);
                // ...
            })
        } catch (error) {
            console.log(error);
        }
    }
    const uploadData = async () => {
        try {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(form.password, salt);
            await addDoc(usersRef, {
                name: form.name,
                password: hash,
                mobile: form.mobile
            })
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div className='w-full flex flex-col mt-4 items-center'>
            <h1 className='text-xl font-bold'>Sign Up</h1>
            <section class="text-gray-600 body-font relative">
                {otpSent ?
                    <>
                        <div class="p-2 w-full">
                            <div class="relative">
                                <label for="message" class="leading-7 text-sm text-gray-300">Enter OTP</label>
                                <input
                                    id="message"
                                    name="message"
                                    value={OTP}
                                    onChange={(e) => setOTP(e.target.value)}
                                    class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-10 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out" />
                            </div>
                        </div>

                        <div class="p-2 w-full">
                            <button
                                onClick={verifyOTP}
                                className="flex mx-auto text-white bg-green-600 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg">
                                {loading ? <TailSpin height={25} color="white" /> : 'Confirm OTP'}
                            </button>
                        </div>
                    </>
                    :
                    <div class="container px-5 py-8 mx-auto">
                        <div class="lg:w-1/2 md:w-2/3 mx-auto">
                            <div class="flex flex-wrap -m-2">
                                <div class="p-2 w-full">
                                    <div class="relative">
                                        <label for="message" class="leading-7 text-sm text-gray-300">Name</label>
                                        <input
                                            id="message"
                                            name="message"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-10 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out" />
                                    </div>
                                </div>
                                <div class="p-2 w-full">
                                    <div class="relative">
                                        <label for="message" class="leading-7 text-sm text-gray-300">Mobile Number</label>
                                        <input
                                            type={'number'}
                                            id="message"
                                            name="message"
                                            value={form.mobile}
                                            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                                            class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-10 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out" />
                                    </div>
                                </div>


                                <div class="p-2 w-full">
                                    <div class="relative">
                                        <label for="message" class="leading-7 text-sm text-gray-300">Password</label>
                                        <input
                                            type={'password'}
                                            id="message"
                                            name="message"
                                            value={form.password}
                                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                                            class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-10 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out" />
                                    </div>
                                </div>

                                <div class="p-2 w-full">
                                    <button onClick={requestOtp} className="flex mx-auto text-white bg-green-600 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg">
                                        {loading ? <TailSpin height={25} color="white" /> : 'Request OTP'}
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                }
                <div className='flex justify-center mt-4'>
                    <p>Alerady have an account?<Link to={'/Login'}><span className='text-blue-500'> Log In</span></Link></p>
                </div>
            </section>
            <div id='sign-in-button'>

            </div>
        </div>
    )
}

export default Signup;