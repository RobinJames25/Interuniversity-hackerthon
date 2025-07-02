import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../util';
import 'boxicons/css/boxicons.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const Signin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [spans, setSpans] = useState([]);
    const navigate = useNavigate();

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            email: '',
            password: ''
        },
    });

    const doSubmit = async (values) => {
        try {
            const res = await fetch(`${API_BASE_URL}/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(values),
            });

            const data = await res.json();
            if (res.ok) {
                if(data.token) {
                    toast.success('Sign in successful. You are now logged in.');
                    localStorage.setItem('token', data.token);
                } else {
                    toast.error('Signin successful but no token received');
                    console.warn('Signin success but no token:', data);
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
        setSpans(Array.from({ length: 200}, (_, i) => i));
    }, []);

    useEffect(() => {
        const spansEls = document.querySelectorAll('.sect-spans');

        const onMouseEnter = (e) => {
            const target = e.currentTarget;
            target.classList.add('highlight');
            target.classList.remove('fade');
          };

        const onMouseLeave = (e) => {
            const target = e.currentTarget;
            target.classList.remove('highlight');
            target.classList.add('fade');
            const onTransitionEnd = () => {
              target.classList.remove('fade');
              target.removeEventListener('transitionend', onTransitionEnd);
            };
            target.addEventListener('transitionend', onTransitionEnd);
          };

        spansEls.forEach(span => {
              span.addEventListener('mouseenter', onMouseEnter);
              span.addEventListener('mouseleave', onMouseLeave);
        });

        return () => {
              spansEls.forEach(span => {
                span.removeEventListener('mouseenter', onMouseEnter);
                span.removeEventListener('mouseleave', onMouseLeave);
              });
            };
          }, [spans]);

    return (
        <section
              id="sect-1"
              className="relative w-screen h-screen flex justify-center items-center flex-wrap overflow-hidden bg-black"
            >
              {/* Animated Background */}
              <div className="absolute w-full h-full animate-[animate_5s_linear_infinite] bg-gradient-to-b from-black via-cyan-400 to-black" />
        
              {/* Background grid squares */}
                {spans.map((_, i) => (
                <span
                  key={i}
                  className="sect-spans relative block w-[calc(6.25vw-2px)] h-[calc(6.25vw-2px)] bg-[#181818] transition-colors duration-300 z-[2]"
                />
              ))}
        
              {/* Form Container */}
              <div className="absolute max-w-sm w-full p-6 rounded-lg bg-[#222] shadow-[0_20px_40px_rgba(0,0,0,0.9)] z-[100]">
                <header className="text-2xl font-semibold text-center text-cyan-400">Login Form</header>
                <form className="mt-8 space-y-5" onSubmit={handleSubmit(doSubmit)}>
                  {/* Email */}
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      className={`w-full h-12 px-4 text-sm text-white bg-[#333] border rounded-md outline-none ${
                        errors.email ? 'border-red-500' : 'border-cyan-500'
                      }`}
                    />
                    {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
                  </div>
        
                  {/* Password */}
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      {...register('password', { required: 'Password is required' })}
                      className={`w-full h-12 px-4 text-sm text-white bg-[#333] border rounded-md outline-none ${
                        errors.password ? 'border-red-500' : 'border-cyan-500'
                      }`}
                    />
                    <i
                      className={`bx ${showPassword ? 'bx-show' : 'bx-hide'} absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-lg cursor-pointer`}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                    {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>}
                  </div>
        
                  {/* Links */}
                  <div className="flex justify-between text-sm text-white">
                    <a href="#" className="hover:underline">
                      Forgot Password
                    </a>
                    <Link to="/signup" className="text-cyan-400 font-semibold hover:underline">
                      Signup
                    </Link>
                  </div>
        
                  {/* Submit Button */}
                  <div>
                    <input
                      type="submit"
                      value={isSubmitting ? 'Signing in...': 'Sign In'}
                      disabled={isSubmitting}
                      className="w-full h-12 text-lg font-medium text-black bg-cyan-400 rounded-md cursor-pointer hover:bg-indigo-500 hover:text-white transition"
                    />
                  </div>
                </form>
              </div>
            </section>
    );
}

export default Signin;