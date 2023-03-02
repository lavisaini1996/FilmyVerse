import React, { useContext, useState } from 'react';
import { TailSpin } from 'react-loader-spinner';
import { Link, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { query, where, getDocs } from 'firebase/firestore';
import { usersRef } from '../firebase/firebase';
import bcrypt from 'bcryptjs';
import { Appstate } from '../App';

const Login = () => {
    const [form, setForm] = useState({
        mobile: '',
        password: ""
    });
    const navigate = useNavigate();
    const useAppstate = useContext(Appstate)
    const [loading, setLoading] = useState(false);
    const login = async () => {
        setLoading(true);
        try {
            console.log('function called');
            const quer = query(usersRef, where('mobile', '==', form.mobile));
            const querySnapshot = await getDocs(quer);
            querySnapshot.forEach((doc) => {
                const _data = doc.data();
                console.log(_data);
                const isUser = bcrypt.compareSync(form.password, _data.password);
                console.log(isUser);
                if (isUser) {
                    console.log('user find');
                    useAppstate.setlogin(true);
                    useAppstate.setUserName(_data.name);
                    swal({
                        text: 'Loged In',
                        icon: 'success',
                        buttons: false,
                        timer: 3000
                    })
                    navigate('/');

                } else {
                    console.log('error occured');
                    swal({
                        text: 'Invalid credentials',
                        icon: 'error',
                        buttons: false,
                        timer: 3000
                    })
                }
            })
        } catch (error) {
            console.log(error.message);
            swal({
                text: error,
                icon: 'error',
                buttons: false,
                timer: 3000
            })
        }
        setLoading(false)
    }
    return (
        <div className='w-full flex flex-col mt-4 items-center'>
            <h1 className='text-xl font-bold'>Login</h1>
            <section class="text-gray-600 body-font relative">
                <div class="container px-5 py-8 mx-auto">
                    <div class="lg:w-1/2 md:w-2/3 mx-auto">
                        <div class="flex flex-wrap -m-2">
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
                                        id="message"
                                        name="message"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-10 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out" />
                                </div>
                            </div>

                            <div class="p-2 w-full">
                                <button
                                    onClick={login}
                                    className="flex mx-auto text-white bg-green-600 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg">
                                    {loading ? <TailSpin height={25} color="white" /> : 'Log In'}
                                </button>
                            </div>

                        </div>
                    </div>
                    <div className='flex justify-center mt-4'>
                        <p>Do not have an account?<Link to={'/signup'}><span className='text-blue-500'> Sign Up</span></Link></p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Login