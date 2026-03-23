import { setLoading } from '../../redux/authSlice';
import { signupSchema } from '../../schema/authSchema';
import { USER_API_ENDPOINT } from '../../utils/constants';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { RadioGroup } from '../../components/ui/radio-group';

const Signup = () => {
    const [input, setInput] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        role: "",
        file: null
    });

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, user } = useSelector(store => store.auth);

    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    // handle text inputs
    const handleFormChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    // handle file input
    const handleFormFileChange = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Zod validation
        const result = signupSchema.safeParse(input);

        if (!result.success) {
            setErrors(result.error.flatten().fieldErrors);
            return;
        }

        setErrors({});

        // build form data
        const formData = new FormData();
        formData.append("fullName", input.fullName);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);

        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));

            console.log("Submitting signup...");

            const res = await axios.post(
                `${USER_API_ENDPOINT}/auth/register`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true
                }
            );

            if (res.data?.success) {
                toast.success(res.data.message);
                navigate('/login');
            }

        } catch (error) {
            console.log("Signup error:", error);

            const message =
                error?.response?.data?.message ||
                error.message ||
                "Signup failed. Try again.";

            toast.error(message);

        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className='flex items-center justify-center max-w-7xl mx-auto'>
            <form onSubmit={handleSubmit} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
                <h1 className='font-bold text-xl mb-5'>Sign Up</h1>

                {/* Full Name */}
                <div className='my-4'>
                    <Label>Full Name</Label>
                    <Input
                        name='fullName'
                        value={input.fullName}
                        onChange={handleFormChange}
                        placeholder='John Doe'
                    />
                    {errors?.fullName?.map((err, i) => (
                        <span key={i} className='text-red-500 text-sm'>{err}</span>
                    ))}
                </div>

                {/* Email */}
                <div className='my-4'>
                    <Label>Email</Label>
                    <Input
                        name='email'
                        type='email'
                        value={input.email}
                        onChange={handleFormChange}
                    />
                    {errors?.email && <span className='text-red-500 text-sm'>{errors.email}</span>}
                </div>

                {/* Phone */}
                <div className='my-4'>
                    <Label>Phone</Label>
                    <Input
                        name='phoneNumber'
                        value={input.phoneNumber}
                        onChange={handleFormChange}
                    />
                    {errors?.phoneNumber && <span className='text-red-500 text-sm'>{errors.phoneNumber}</span>}
                </div>

                {/* Password */}
                <div className='my-4'>
                    <Label>Password</Label>
                    <Input
                        name='password'
                        type='password'
                        value={input.password}
                        onChange={handleFormChange}
                    />
                    {errors?.password?.map((err, i) => (
                        <span key={i} className='text-red-500 text-sm'>{err}</span>
                    ))}
                </div>

                {/* Confirm Password */}
                <div className='my-4'>
                    <Label>Confirm Password</Label>
                    <Input
                        name='confirmPassword'
                        type='password'
                        value={input.confirmPassword}
                        onChange={handleFormChange}
                    />
                    {errors?.confirmPassword && (
                        <span className='text-red-500 text-sm'>{errors.confirmPassword}</span>
                    )}
                </div>

                {/* Role */}
                <RadioGroup className="flex gap-4 my-4">
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value="applicant"
                            checked={input.role === "applicant"}
                            onChange={handleFormChange}
                        /> Applicant
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="role"
                            value="recruiter"
                            checked={input.role === "recruiter"}
                            onChange={handleFormChange}
                        /> Recruiter
                    </label>
                </RadioGroup>

                {/* File */}
                <div className='my-4'>
                    <Label>Profile Photo</Label>
                    <Input
                        type='file'
                        accept='image/*'
                        onChange={handleFormFileChange}
                    />
                </div>

                {/* Submit */}
                {loading ? (
                    <Button disabled className='w-full'>
                        <Loader2 className='animate-spin mr-2' /> Please wait...
                    </Button>
                ) : (
                    <Button type='submit' className='w-full'>Sign Up</Button>
                )}

                <span className='text-sm'>
                    Already have an account? <Link to='/login' className='text-blue-600'>Login</Link>
                </span>
            </form>
        </div>
    );
};

export default Signup;
