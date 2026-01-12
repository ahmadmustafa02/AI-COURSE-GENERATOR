"use client";

import React, { useState } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Loader2, Send } from 'lucide-react'
import { QUICK_VIDEO_SUGGESTIONS } from '../data/constant'
import axios from 'axios'
import { toast } from 'sonner'
import { SignInButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/dist/client/components/navigation';

const Hero = () => {
    const [userInput, setUserInput] = useState('');
    const [type, setType] = useState('full-course');
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    const router = useRouter();

    const GenerateCourseLayout = async () => {
        const courseId = crypto.randomUUID();
        try {
            setLoading(true);
            toast.loading("Generating Course Layout...");

            
            const result = await axios.post('/api/generate-course-layout', {
                userInput,
                type,
                courseId: courseId
            });
            
            console.log('Success:', result.data);
            toast.dismiss();
            toast.success("Course layout generated successfully!");
            
            // navigate to course editor page
            
        router.push('/course/' + courseId);

            
        } catch (error: any) {
            console.error('Error generating course:', error);
            toast.dismiss();
            
            if (error.response) {
                // Server responded with error
                console.error('Error response:', error.response.data);
                toast.error(error.response.data.details || error.response.data.error || 'Failed to generate course');
            } else if (error.request) {
                // Request made but no response
                toast.error('No response from server. Please try again.');
            } else {
                // Something else happened
                toast.error('Error: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='flex items-center flex-col mt-20'>
            <div>
                <h2 className='text-4xl font-bold'>Learn Smarter with AI Video Courses</h2>
                <p className='text-center text-grey mt-3 text-2xl'>Turn any topic into complete course</p>
            </div>
            
            <div className="grid w-full max-w-lg mt-5 gap-6">
                <InputGroup>
                    <InputGroupTextarea
                        data-slot="input-group-control"
                        className="flex field-sizing-content min-h-24 w-full resize-none rounded-xl bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
                        placeholder="What do you want to learn today?"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                    />
                    <InputGroupAddon align="block-end">
                        <Select value={type} onValueChange={(value) => setType(value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Full Course" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="full-course">Full Course</SelectItem>
                                <SelectItem value="quick-explain-video">Quick Explain Video</SelectItem>
                            </SelectContent>
                        </Select>

                        {user ? (
                            <InputGroupButton 
                                className="ml-auto" 
                                size="icon-sm" 
                                variant="default" 
                                onClick={GenerateCourseLayout} 
                                disabled={loading || !userInput.trim()}
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <Send />}
                            </InputGroupButton>
                        ) : (
                            <SignInButton mode="modal">
                                <InputGroupButton 
                                    className="ml-auto" 
                                    size="icon-sm" 
                                    variant="default"
                                >
                                    <Send />
                                </InputGroupButton>
                            </SignInButton>
                        )}
                    </InputGroupAddon>
                </InputGroup>
            </div>
            
            <div className='flex gap-5 mt-5 max-w-3xl flex-wrap justify-center'>
                {QUICK_VIDEO_SUGGESTIONS.map((suggestion, index) => (
                    <h2 
                        key={index} 
                        onClick={() => {
                            setUserInput(suggestion?.prompt)
                        }} 
                        className='border rounded-2xl cursor-pointer px-2 p-1 text-sm hover:bg-gray-100 transition-colors'
                    >
                        {suggestion.title}
                    </h2>
                ))}
            </div>
        </div>
    )
}

export default Hero