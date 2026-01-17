import Hero from "./_components/Hero";
import CourseList from "./_components/CourseList";

export default function Home() {
  return (
    <main className="min-h-screen bg-black relative">
      <Hero />
      <CourseList />
    </main>
  );
}
