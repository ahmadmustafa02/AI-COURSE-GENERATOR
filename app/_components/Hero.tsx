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

import { Loader2, Send, Sparkles, ArrowRight } from 'lucide-react'
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
        <section className="relative min-h-[90vh] flex items-center justify-center px-6 overflow-hidden pt-20 pb-24">
            <div className="relative z-10 w-full max-w-[1200px] mx-auto text-center animate-fade-in">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-12 animate-slide-up">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[13px] font-medium text-white/80">AI-Powered Learning</span>
                </div>
                
                <h1 className="text-6xl sm:text-7xl lg:text-[72px] font-semibold mb-8 leading-[1.1] tracking-[-0.03em] animate-slide-up text-balance" style={{ animationDelay: '0.1s' }}>
                    <span className="text-white">
                        Transform Any Topic
                    </span>
                    <br />
                    <span className="text-white">
                        Into a Complete Course
                    </span>
                </h1>
                
                <p className="text-[18px] text-white/60 mb-16 max-w-[640px] mx-auto animate-slide-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
                    Learn smarter with AI-generated video courses. Turn your curiosity into knowledge in minutes.
                </p>
                
                <div className="w-full max-w-[720px] mx-auto mb-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <div className="relative">
                        <div className="relative bg-white/3 border border-white/6 rounded-[20px] p-5 backdrop-blur-xl">
                            <InputGroup>
                                <InputGroupTextarea
                                    data-slot="input-group-control"
                                    className="flex field-sizing-content min-h-28 w-full resize-none rounded-xl bg-white/5 border-0 px-4 py-3.5 text-[17px] text-white transition-all outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-white/40"
                                    placeholder="What do you want to learn today? e.g., 'Master React hooks and state management'"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && user && !loading && userInput.trim()) {
                                            GenerateCourseLayout();
                                        }
                                    }}
                                />
                                <InputGroupAddon align="block-end">
                                    <Select value={type} onValueChange={(value) => setType(value)}>
                                        <SelectTrigger className="w-[160px] border-white/10 bg-white/5 text-[15px] text-white rounded-xl">
                                            <SelectValue placeholder="Full Course" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="full-course">Full Course</SelectItem>
                                            <SelectItem value="quick-explain-video">Quick Explain</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {user ? (
                                        <InputGroupButton 
                                            className="ml-auto bg-primary hover:bg-primary/90 transition-all duration-200 hover-lift rounded-xl" 
                                            size="icon-sm" 
                                            variant="default" 
                                            onClick={GenerateCourseLayout} 
                                            disabled={loading || !userInput.trim()}
                                        >
                                            {loading ? (
                                                <Loader2 className="animate-spin h-4 w-4" />
                                            ) : (
                                                <Send className="h-4 w-4" />
                                            )}
                                        </InputGroupButton>
                                    ) : (
                                        <SignInButton mode="modal">
                                            <InputGroupButton 
                                                className="ml-auto bg-primary hover:bg-primary/90 transition-all duration-200 hover-lift rounded-xl" 
                                                size="icon-sm" 
                                                variant="default"
                                            >
                                                <Send className="h-4 w-4" />
                                            </InputGroupButton>
                                        </SignInButton>
                                    )}
                                </InputGroupAddon>
                            </InputGroup>
                        </div>
                    </div>
                </div>
                
                <div className="mb-10 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    <p className="text-[14px] text-white/50 mb-5">Try these popular topics:</p>
                    <div className="flex flex-wrap gap-2.5 justify-center max-w-3xl mx-auto">
                        {QUICK_VIDEO_SUGGESTIONS.map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setUserInput(suggestion?.prompt);
                                }}
                                className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 text-[14px] font-medium text-white/70 hover:text-white backdrop-blur-sm hover-lift"
                            >
                                {suggestion.title}
                            </button>
                        ))}
                    </div>
                </div>
                
                {!user && (
                    <div className="flex items-center justify-center gap-2 text-[14px] text-white/40 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                        <span>Press</span>
                        <kbd className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-white/60">⌘</kbd>
                        <span>+</span>
                        <kbd className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-white/60">Enter</kbd>
                        <span>to generate</span>
                    </div>
                )}
            </div>
        </section>
    )
}

export default Hero