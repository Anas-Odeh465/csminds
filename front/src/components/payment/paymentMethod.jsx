import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Globe, Lock, CreditCard } from 'lucide-react';
import visa from '../../assets/visa-electron-svgrepo-com.svg';
import master from '../../assets/mastercard-full-svgrepo-com.svg';
import paypal from '../../assets/paypal-svgrepo-com.svg';
import amex from '../../assets/amex-svgrepo-com.svg';
import jcb from '../../assets/jcb-svgrepo-com.svg';
import googlePay from '../../assets/google-pay-svgrepo-com.svg';

const CheckoutPage = () => {
  const [selectedPayment, setSelectedPayment] = useState('card');
  const location = useLocation();
  const searchTotals = new URLSearchParams(location.search);
  const total = searchTotals.get('totalPrice');
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        {/* Billing Address Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Billing address</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <div className="relative">
                <select 
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  defaultValue="Jordan"
                >
                  <option value="Jordan">Jordan</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                </select>
                <Globe className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <p className="text-sm text-gray-500">
              We are required by law to collect applicable transaction taxes for purchases made in certain tax jurisdictions.
            </p>
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Payment method</h2>
            <div className="flex items-center text-gray-600">
              <Lock className="h-4 w-4 mr-2" />
              <span className="text-sm">Secure and encrypted</span>
            </div>
          </div>

          {/* Saved Card */}
          <div className="space-y-4">
            <label className="flex items-center p-4 border rounded-md bg-gray-50 cursor-pointer hover:bg-gray-100">
              <input
                type="radio"
                name="payment"
                value="saved-card"
                checked={selectedPayment === 'saved-card'}
                onChange={() => setSelectedPayment('saved-card')}
                className="h-4 w-4 text-blue-600"
              />
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CreditCard className="h-6 w-6 mr-2" />
                    <span>Visa **** 9194</span>
                  </div>
                  <img src={visa} alt="Visa" className='w-10 h-10 rounded-full' />
                </div>
                <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <div className="font-medium text-gray-700">Name on card</div>
                    <div>user name</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">Expiry date</div>
                    <div>10/2029</div>
                  </div>
                </div>
              </div>
            </label>

            {/* New Card Option */}
            <label className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value="new-card"
                checked={selectedPayment === 'card'}
                onChange={() => setSelectedPayment('card')}
                className="h-4 w-4 text-blue-600"
              />
              <div className="ml-3">
                <span className="font-medium">New card</span>
                <div className="mt-2 flex space-x-2">
                  <img src={visa}  alt="Visa" 
                  className='w-10 h-10 rounded-full'/>
                  <img src={master} alt="Mastercard" 
                  className='w-10 h-10 rounded-full'/>
                  <img src={amex} alt="Discover" 
                  className='w-10 h-10 rounded-full'/>
                  <img src={jcb} alt="JCB"
                  className='w-10 h-10 rounded-full' />
                </div>
              </div>
            </label>

            {/* Google Pay */}
            <label className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value="google-pay"
                checked={selectedPayment === 'google-pay'}
                onChange={() => setSelectedPayment('google-pay')}
                className="h-4 w-4 text-blue-600"
              />
              <div className="ml-3 flex items-center">
                <img src={googlePay} alt="Google Pay" className='w-10 h-10 rounded-full' />
                <span className="font-medium">Google Pay</span>
              </div>
            </label>

            {/* PayPal */}
            <label className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value="paypal"
                checked={selectedPayment === 'paypal'}
                onChange={() => setSelectedPayment('paypal')}
                className="h-4 w-4 text-blue-600"
              />
              <div className="ml-3 flex items-center">
              <img src={paypal} alt="Amex" 
                  className='w-10 h-10 rounded-full'/>
                <span className="font-medium">PayPal</span>
              </div>
            </label>
          </div>

          {/* Submit Button */}
          <button 
           className="w-full mt-8 bg-blue-600 text-lg text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200">
            Complete Purchase with {'  $' + total}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;