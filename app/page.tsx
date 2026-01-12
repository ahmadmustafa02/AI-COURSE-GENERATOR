import { Button } from "@/components/ui/button";
import { SignUp, UserButton } from "@clerk/nextjs";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import CourseList from "./_components/CourseList";

export default function Home() {
  return (
    <div>
   
     <Hero></Hero>
     <CourseList></CourseList>
    </div>
  );
}
