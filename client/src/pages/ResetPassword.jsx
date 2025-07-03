import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../util';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');        // raw token in the e‑mail link

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { password: '', confirm: '' } });

  /* Kick the user back if the link is missing a token. */
  useEffect(() => {
    if (!token) {
      toast.error('Missing or invalid token.');
      navigate('/forgot-password', { replace: true });
    }
  }, [token, navigate]);

  const onSubmit = async ({ password }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        navigate('/signin');                      // change the path to your login page
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('Network error – try again.');
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm bg-[#1e1e1e] p-6 rounded-md shadow-md"
      >
        <h2 className="text-center text-xl text-cyan-400 mb-4">
          Set a new password
        </h2>

        {/* New password */}
        <input
          type="password"
          placeholder="New password"
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'At least 8 characters' },
          })}
          className={`w-full h-12 px-4 mb-1 bg-[#333] text-white rounded-md outline-none border ${
            errors.password ? 'border-red-500' : 'border-cyan-500'
          }`}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>
        )}

        {/* Confirm password */}
        <input
          type="password"
          placeholder="Confirm password"
          {...register('confirm', {
            validate: (value) =>
              value === watch('password') || 'Passwords do not match',
          })}
          className={`w-full h-12 px-4 mb-1 bg-[#333] text-white rounded-md outline-none border ${
            errors.confirm ? 'border-red-500' : 'border-cyan-500'
          }`}
        />
        {errors.confirm && (
          <p className="text-red-500 text-sm mb-2">{errors.confirm.message}</p>
        )}

        <input
          type="submit"
          value={isSubmitting ? 'Updating…' : 'Reset Password'}
          disabled={isSubmitting}
          className="w-full h-12 mt-3 bg-cyan-400 text-black font-semibold rounded-md cursor-pointer hover:bg-indigo-500 hover:text-white transition"
        />
      </form>
    </div>
  );
};

export default ResetPassword;
