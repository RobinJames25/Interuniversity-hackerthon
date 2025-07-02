import { useEffect, useState } from "react"
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../util";
import 'boxicons/css/boxicons.min.css';
import toast from 'react-hot-toast';

const Signup = () => {
    const [spans, setSpans] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();
    const {
        handleSubmit,
        register,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            name: '',
            username: '',
            email: '',
            password: '',
            cPassword: ''
        },
    })

    const doSubmit = async (values) => {
        try {
            const res = await fetch(`${API_BASE_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(values)
            });

            const data = await res.json();
            if (res.ok) {
                if (data.token) {
                    toast.success('Sign Up successful. You are now logged in.');
                    localStorage.setItem('token', data.token);
                } else {
                    toast.error('Signup successful but no token received');
                    console.warn('Signup success but no token:', data);
                }
            } else {
                toast.error(data.message || 'Something went wrong');
            } 
        } catch (err) {
            console.error('Network or server error:', err);
            toast.error('Something went wrong');
        }
    }

    useEffect(() => {
        setSpans(Array.from({ length: 200 }, (_, i) => i));
    }, []);

    return (
        <section id="sect-1" className="relative w-screen h-screen flex justify-center items-center flex-wrap overflow-hidden bg-black">
            <div className="absolute w-full h-full animate-[animate_5s_linear_infinite] bg-gradient-to-b from-black via-cyan-400 to-black" />

            {spans.map((_, i) => (
                <span 
                    key={i}
                    className="sect-spans relative block w-[calc(6.25vw-2px)] h-[calc(6.25vw-2px)] bg-[#181818] transition-colors duration-300 z-[2]" />
            ))}

            <div className="absolute max-w-sm w-full p-6 rounded-lg bg-[#222] shadow-[0_20px_40px_rgba(0,0,0,0.9)] z-[100]">
                <header className="text-2xl font-semibold text-center text-cyan-400">Signup Form</header>
                <form className="mt-8 space-y-5" onSubmit={handleSubmit(doSubmit)}>
                    <div className="relative">
                        <input 
                            type="text"
                            placeholder="Enter Your Name"
                            {...register('name', { required: 'Name is required' })}
                            className={`w-full h-12 px-4 text-sm text-white bg-[#333] border rounded-md outline-none
                                ${errors.name ? 'border-red-500' : 'border-cyan-500'}`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>
                    <div className="relative">
                        <input 
                            type="text"
                            placeholder="Enter Your Username"
                            {...register('username', { required: 'Username is required' })}
                            className={`w-full h-12 px-4 text-sm text-white bg-[#333] border rounded-md outline-none
                                ${errors.username ? 'border-red-500' : 'border-cyan-500'}`}
                         />
                         {errors.username && (
                            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                         )}
                    </div>
                    <div className="relative">
                        <input 
                            type="email"
                            placeholder="Enter your email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: 'Invalid email address'
                                }
                            })}
                            className={`w-full h-12 px-4 text-sm text-white bg-[#333] border rounded-md outline-none
                                ${errors.email ? 'border-red-500' : 'border-cyan-500'}`} 
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                    </div>
                    <div className="relative">
                        <input 
                            type={showPassword ? 'text' : 'password' }
                            id="password"
                            placeholder="Password"
                            {...register('password', { required: 'Password is required' })}
                            className={`w-full h-12 px-4 text-sm text-white bg-[#333] border rounded-md outline-none
                                ${errors.password ? 'border-red-500' : 'border-cyan-500'}`}
                        />
                        <i 
                            className={`bx ${showPassword ? 'bx-show' : 'bx-hide'} absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-lg cursor-pointer`}
                            onClick={() => setShowPassword(!showPassword)} 
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>
                    <div className="relative">
                        <input 
                            type={showConfirm ? 'text' : 'password'}
                            id="confirmPassword"
                            placeholder="Confirm Password"
                            {...register('cPassword', {
                                required: 'Please confirm your password',
                                validate: (val) => val === watch('password') || 'Passwords do not match'
                            })}
                            className={`w-full h-12 px-4 text-sm text-white bg-[#333] border rounded-md outline-none
                                ${errors.cPassword ? 'border-red-500' : 'border-cyan-500'}`}
                        />
                        <i 
                            className={`bx ${showConfirm ? 'bx-show' : 'bx-hide'} absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-lg cursor-pointer`}
                            onClick={() => setShowConfirm(!showConfirm)}
                            />
                            {errors.cPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.cPassword.message}</p>
                            )}
                    </div>

                    <div className="flex justify-between text-sm text-white">
                        <Link to='/signin' className="text-cyan-400 font-semibold hover:underline">
                            Signin
                        </Link>
                    </div>

                    <div>
                        <input 
                            type="submit"
                            value={isSubmitting ? 'Submitting...' : 'Sign up now'}
                            disabled={isSubmitting}
                            className="w-full h-12 text-lg font-medium text-black bg-cyan-400 rounded-md cursor-pointer hover:bg-indigo-500 hover:text-white transition"
                        />
                    </div>
                </form>
            </div>
        </section>
    )
}

export default Signup