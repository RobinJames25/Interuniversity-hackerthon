import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../util';

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: '' } });

  const onSubmit = async ({ email }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      res.ok ? toast.success(data.message) : toast.error(data.message);
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
          Forgot your password?
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+$/, message: 'Invalid email' },
          })}
          className={`w-full h-12 px-4 mb-1 bg-[#333] text-white rounded-md outline-none border ${
            errors.email ? 'border-red-500' : 'border-cyan-500'
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>
        )}

        <input
          type="submit"
          value={isSubmitting ? 'Sending…' : 'Send reset link'}
          disabled={isSubmitting}
          className="w-full h-12 mt-3 bg-cyan-400 text-black font-semibold rounded-md cursor-pointer hover:bg-indigo-500 hover:text-white transition"
        />
      </form>
    </div>
  );
};

export default ForgotPassword;
