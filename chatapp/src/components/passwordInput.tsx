'use client';

import { useState } from 'react';

export default function PasswordInput() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className="relative">
      <input
        className="input input-bordered text-center"
        type={isPasswordVisible ? 'text' : 'password'}
        name="password"
        placeholder="Password"
        required
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 transform -translate-y-1/2"
        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
      >
        {isPasswordVisible ? '👁️' : '🙈'}
      </button>
    </div>
  );
}
