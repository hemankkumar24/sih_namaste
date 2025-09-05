import React, { useState } from 'react'
import MainLogo from './MainLogo';
import { useNavigate } from 'react-router-dom';

const DoctorSignUp = () => {
    const [hpr, setHPR] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    // for navigation
    const navigate = useNavigate();

    // simple redirecting to signup page
    const rerouteToSignIn = () => {
        navigate('/doctorlogin');
    }

    const rerouteToPatient = () => {
        navigate('/signup')
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // fetch aadhar and otp from here

        setPassword('');
        setHPR('');
    }

  return (
    <div className='w-full h-screen bg-neutral-200 '>
            <div className='flex justify-center items-center h-full w-full'>
                <div className='w-128 h-128 bg-neutral-50 rounded-xl shadow-2xl p-10'>
                    {/* heading logo */}
                    <div className='flex w-full justify-center items-center'>
                        <MainLogo />
                    </div>

                    {/* heading message (can change this) */}
                    <div className='w-full flex justify-start pt-8 text-2xl font-semibold text-neutral-700'>
                        Doctor Sign Up
                    </div>

                    {/* the buttons for switching states */}
                    <div className='pt-2 flex justify-between items-center gap-1'>
                        <div className='w-full flex justify-center text-xl border-2 border-sky-600 py-3
                                    rounded-md text-black'>
                            HPR NUMBER
                        </div>
                    </div>

                    {/* form starts here */}
                    <form action="#" method="post" className='pt-2 flex flex-col'>
                        {/* aadhar id input field */}
                        <input type="text" placeholder="HPR Number"
                            className="flex-1 px-4 py-3 outline-none text-neutral-600
                            border-1 border-neutral-300 rounded-md" value={hpr} 
                            onChange={(e) => {setHPR(e.target.value);}}
                        />

                        <input type="password" placeholder="Password"
                            className="flex-1 mt-3 px-4 py-3 outline-none text-neutral-600
                            border-1 border-neutral-300 rounded-md" value={password} 
                            onChange={(e) => {setPassword(e.target.value);}}
                        />

                        <input type="password" placeholder="Confirm Password"
                            className="flex-1 mt-3 px-4 py-3 outline-none text-neutral-600
                            border-1 border-neutral-300 rounded-md" value={confirmPassword} 
                            onChange={(e) => {setConfirmPassword(e.target.value);}}
                        />

                        

                        {/* login button */}
                        <button className='w-full bg-sky-600 py-3 px-5 mt-3 text-xl rounded-md text-white
                            hover:bg-sky-700 cursor-pointer' onClick={handleSubmit}>
                            Sign Up</button>
                    </form>

                    {/* ending message */}
                    <div className='w-full text-center'>
                       Already Have an Account? <span className='text-blue-600 
                        hover:text-blue-700 cursor-pointer pt-1' onClick={rerouteToSignIn}>Login</span>
                        <br />
                        <div className='text-blue-700 hover:text-blue-800 cursor-pointer' onClick={rerouteToPatient}>Patient Sign Up</div>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default DoctorSignUp