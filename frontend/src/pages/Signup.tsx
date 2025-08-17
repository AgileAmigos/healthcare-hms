    import { useState, type FormEvent } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { useAuth } from '../context/AuthContext';
    import apiClient from '../services/apiClient';
    import { UserPlus } from 'lucide-react';

    const Signup = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'doctor' | 'nurse'>('doctor');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
        // Step 1: Create the new user account
        await apiClient.post('/auth/signup', {
            full_name: fullName,
            email,
            password,
            role,
        });

        // Step 2: Automatically log the user in after successful signup
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        
        const response = await apiClient.post('/auth/token', formData, {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const { access_token } = response.data;
        login(access_token);
        navigate('/'); // Redirect to home page

        } catch (err: any) {
        if (err.response && err.response.data && err.response.data.detail) {
            setError(err.response.data.detail);
        } else {
            setError('An unexpected error occurred during signup. Please try again.');
        }
        console.error('Signup failed:', err);
        } finally {
        setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center py-12">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
            <div className="text-center">
            <h1 className="text-3xl font-bold text-red-900">Create an Account</h1>
            <p className="mt-2 text-gray-600">
                Join the team by filling out the form below.
            </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                id="full-name"
                type="text"
                placeholder="Dr. John Doe"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
            </div>
            <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'doctor' | 'nurse')}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                >
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                </select>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button 
                type="submit" 
                className="w-full bg-red-500 text-white py-2.5 rounded-lg font-semibold hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                disabled={isLoading}
            >
                {isLoading ? 'Creating Account...' : <><UserPlus size={16}/> Create Account</>}
            </button>
            </form>
            <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-red-600 hover:underline">
                Login
            </Link>
            </div>
        </div>
        </div>
    );
    };

    export default Signup;
