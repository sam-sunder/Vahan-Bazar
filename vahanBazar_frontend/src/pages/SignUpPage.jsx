import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaUser, FaStore } from 'react-icons/fa';

const SignUpPage = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('customer');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    dealershipName: '',
    dealershipDescription: '',
    branchName: '',
    branchAddress: '',
    branchCity: '',
    branchState: '',
    branchContact: '',
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep = () => {
    setError('');
    if (step === 2) {
      if (!formData.username) {
        setError('Username is required.');
        return false;
      }
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
        setError('A valid email is required.');
        return false;
      }
      if (!formData.password || formData.password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return false;
      }
    }
    if (role === 'dealer' && step === 3) {
      if (!formData.dealershipName) {
        setError('Dealership name is required.');
        return false;
      }
    }
    if (role === 'dealer' && step === 4) {
      if (!formData.branchName || !formData.branchAddress || !formData.branchCity || !formData.branchState || !formData.branchContact) {
        setError('All branch details are required.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    setError('');

    let requestData;
    if (role === 'customer') {
      requestData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        is_dealer: false,
      };
    } else {
      requestData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        is_dealer: true,
        dealership: {
          name: formData.dealershipName,
          description: formData.dealershipDescription,
        },
        branch: {
          name: formData.branchName,
          address: formData.branchAddress,
          city: formData.branchCity,
          state: formData.branchState,
          contact_number: formData.branchContact,
        },
      };
    }

    try {
      await axios.post('/api/auth/register/', requestData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError('Failed to create an account. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };
  const prevStep = () => setStep(step - 1);

  const renderFormStep = () => {
    if (step === 1) {
      return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleRoleSelect('customer')}
                className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-colors ${
                  role === 'customer'
                    ? 'border-primary bg-primary-light/20 text-primary'
                    : 'border-gray-300 text-gray-600 hover:border-primary-light hover:bg-gray-50'
                }`}>
                <FaUser className="text-4xl mb-2" />
                <span className="font-semibold">Customer</span>
              </button>
              <button
                onClick={() => handleRoleSelect('dealer')}
                className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-colors ${
                  role === 'dealer'
                    ? 'border-primary bg-primary-light/20 text-primary'
                    : 'border-gray-300 text-gray-600 hover:border-primary-light hover:bg-gray-50'
                }`}>
                <FaStore className="text-4xl mb-2" />
                <span className="font-semibold">Dealer</span>
              </button>
            </div>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input id="username" name="username" type="text" value={formData.username} onChange={handleChange} placeholder="Enter your username" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none transition-colors" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none transition-colors" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none transition-colors" />
          </div>
          {role === 'customer' ? renderTermsAndSubmit() : <button type="button" onClick={nextStep} className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors">Next</button>}
        </div>
      );
    }

    if (role === 'dealer' && step === 3) {
      return (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center">Dealership Details</h3>
          <div>
            <label htmlFor="dealershipName" className="block text-sm font-medium text-gray-700 mb-2">Dealership Name</label>
            <input id="dealershipName" name="dealershipName" type="text" value={formData.dealershipName} onChange={handleChange} placeholder="Your Dealership Name" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none transition-colors" />
          </div>
          <div>
            <label htmlFor="dealershipDescription" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea id="dealershipDescription" name="dealershipDescription" value={formData.dealershipDescription} onChange={handleChange} placeholder="A brief description of your dealership" rows="3" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none transition-colors"></textarea>
          </div>
          <div className="flex justify-between">
            <button type="button" onClick={prevStep} className="w-1/3 bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors">Previous</button>
            <button type="button" onClick={nextStep} className="w-1/3 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors">Next</button>
          </div>
        </div>
      );
    }

    if (role === 'dealer' && step === 4) {
      return (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center">Branch Details</h3>
          <div>
            <label htmlFor="branchName" className="block text-sm font-medium text-gray-700 mb-2">Branch Name</label>
            <input id="branchName" name="branchName" type="text" value={formData.branchName} onChange={handleChange} placeholder="Main Branch" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none transition-colors" />
          </div>
          <div>
            <label htmlFor="branchAddress" className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input id="branchAddress" name="branchAddress" type="text" value={formData.branchAddress} onChange={handleChange} placeholder="123 Bike Lane" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="branchCity" className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input id="branchCity" name="branchCity" type="text" value={formData.branchCity} onChange={handleChange} placeholder="Biketown" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none transition-colors" />
            </div>
            <div>
              <label htmlFor="branchState" className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <input id="branchState" name="branchState" type="text" value={formData.branchState} onChange={handleChange} placeholder="Bikestate" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none transition-colors" />
            </div>
          </div>
          <div>
            <label htmlFor="branchContact" className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
            <input id="branchContact" name="branchContact" type="text" value={formData.branchContact} onChange={handleChange} placeholder="123-456-7890" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none transition-colors" />
          </div>
          <div className="flex items-center">
            <input id="agree-terms" type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} required className="h-4 w-4 text-primary focus:ring-primary-light border-gray-300 rounded cursor-pointer" />
            <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700 cursor-pointer">I agree to the <a href="#" className="font-medium text-primary hover:text-primary-dark">Terms and Conditions</a></label>
          </div>
          <div className="flex justify-between">
            <button type="button" onClick={prevStep} className="w-1/3 bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors">Previous</button>
            <button type="submit" disabled={loading || !agreeTerms} className="w-1/3 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50">{loading ? 'Creating account...' : 'Sign Up'}</button>
          </div>
        </div>
      );
    }
  };

  const renderTermsAndSubmit = () => (
    <div className="space-y-6 mt-6">
      <div className="flex items-center">
        <input id="agree-terms" type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} required className="h-4 w-4 text-primary focus:ring-primary-light border-gray-300 rounded cursor-pointer" />
        <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700 cursor-pointer">I agree to the <a href="#" className="font-medium text-primary hover:text-primary-dark">Terms and Conditions</a></label>
      </div>
      <button type="submit" disabled={loading || !agreeTerms} className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50">{loading ? 'Creating account...' : 'Sign Up'}</button>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:!p-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="text-2xl font-bold font-sora text-gray-800 mb-6 block">Vahan<span className="text-primary">Bazar</span></Link>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 font-sora">Create an account</h1>
            <p className="text-gray-600">{step === 1 ? 'Choose your role to get started' : `Step ${step - 1} of ${role === 'dealer' ? 3 : 1}`}</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
            {renderFormStep()}
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary-dark">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:!block lg:!w-1/2 relative">
        <div className="absolute inset-0 bg-black/60" />
        <img src="/public/assets/img/hero_fallback.png" alt="Sign up background" className="w-full h-full object-cover" />
        <div className="absolute top-0 inset-0 flex items-center justify-center p-16 text-white text-center">
          <div>
            <h2 className="text-4xl font-bold mb-4">Join the VahanBazar Community</h2>
            <p className="text-xl text-white/90">Sign up to get personalized recommendations, save your favorite vehicles, and more.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
