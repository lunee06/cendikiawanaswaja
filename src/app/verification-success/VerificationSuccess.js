// pages/verification-success.js

import React from 'react';
import Link from 'next/link';

const VerificationSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img className="mx-auto h-12 w-auto" src="/img/checkmark.png" alt="Logo" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Email Verified Successfully</h2>
        </div>
        <div className="mt-8">
          <div className="text-center">
            <p className="text-base text-gray-500">
              Your email has been verified successfully. You can now{' '}
              <Link legacyBehavior href="/sign-in">
                <a className="font-medium text-indigo-600 hover:text-indigo-500">login</a>
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationSuccess;