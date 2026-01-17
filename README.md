# 🎓 CourseCraft AI

<div align="center">

![CourseCraft AI](https://img.shields.io/badge/CourseCraft-AI-0066FF?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

**Transform any topic into a complete course with AI-powered learning**


[Live Demo](https://coursecraft-ai.vercel.app/) · [Report Bug](https://github.com/ahmadmustafa02/AI-COURSE-GENERATOR/issues) · [Request Feature](https://github.com/ahmadmustafa02/AI-COURSE-GENERATOR/issues)


</div>

---

## ✨ Features

- 🤖 **AI-Powered Course Generation** - Create comprehensive courses on any topic using advanced AI
- 🎥 **Video Content Integration** - Each chapter includes professional video lessons
- 📚 **Structured Learning Paths** - Organized chapters with clear learning objectives
- 🎨 **Premium UI/UX** - Apple-level design aesthetics with smooth animations
- 🌊 **Interactive Particles** - Beautiful floating particle background with mouse interaction
- 🔐 **Secure Authentication** - User management powered by Clerk
- 💳 **Pricing Plans** - Flexible subscription options
- 📱 **Fully Responsive** - Works seamlessly on all devices
- ⚡ **Fast Performance** - Built with Next.js 16 and optimized for speed
- 🎯 **Progress Tracking** - Monitor your learning journey

## 🚀 Tech Stack

### Frontend
- **Framework**: [Next.js 16.1.1](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: Custom components with shadcn/ui
- **Animations**: Framer Motion & CSS animations
- **Icons**: Lucide Icons

### Backend
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Clerk](https://clerk.com/)
- **API Routes**: Next.js API Routes
- **AI Integration**: OpenAI API / Custom AI models
- **Video Processing**: Custom video generation pipeline

### DevOps
- **Deployment**: [Vercel](https://vercel.com/)
- **Version Control**: Git & GitHub
- **Package Manager**: npm

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Clerk account
- OpenAI API key (or your preferred AI service)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/ahmadmustafa02/AI-COURSE-GENERATOR.git
cd AI-COURSE-GENERATOR
```

2. **Navigate to the app directory**
```bash
cd my-app
```

3. **Install dependencies**
```bash
npm install
```

4. **Set up environment variables**

Create a `.env.local` file in the `my-app` directory:

```env
# Database
DATABASE_URL=your_postgresql_connection_string

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# AI Service (OpenAI or your preferred service)
OPENAI_API_KEY=your_openai_api_key

# Other API Keys
# Add any additional API keys your service requires
```

5. **Run database migrations**
```bash
npm run db:push
```

6. **Start the development server**
```bash
npm run dev
```

7. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | ✅ |
| `CLERK_SECRET_KEY` | Clerk secret key | ✅ |
| `OPENAI_API_KEY` | OpenAI API key | ✅ |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign in page URL | ✅ |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign up page URL | ✅ |

## 📱 Pages

- **Home** (`/`) - Landing page with course creation
- **Features** (`/features`) - Detailed feature showcase
- **About** (`/about`) - About the platform
- **Pricing** (`/pricing`) - Subscription plans
- **Contact** (`/contact`) - Contact form
- **Course View** (`/course/[id]`) - Individual course page with chapters

## 🏗️ Project Structure

```
my-app/
├── app/
│   ├── (routes)/           # Route groups
│   │   ├── about/
│   │   ├── contact/
│   │   ├── features/
│   │   ├── pricing/
│   │   └── course/[courseid]/
│   ├── api/                # API routes
│   │   ├── course/
│   │   ├── courses/
│   │   ├── generate-course-layout/
│   │   ├── generate-video-content/
│   │   └── user/
│   ├── _components/        # Global components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── ParticleBackground.tsx
│   │   └── CourseList.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ui/                 # Reusable UI components
├── lib/                    # Utility functions
├── public/                 # Static assets
└── drizzle/               # Database schema
```

## 🎯 Usage

1. **Create an Account**: Sign up using Clerk authentication
2. **Generate a Course**: Enter any topic you want to learn
3. **Choose Course Type**: Select full course or quick overview
4. **Start Learning**: Access structured chapters with video content
5. **Track Progress**: Monitor your learning journey

## 🚀 Deployment

### Deploy to Vercel

1. **Push your code to GitHub**

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy!

3. **Set Environment Variables in Vercel**
   - Add all variables from `.env.local`
   - Ensure database is accessible

### Build Command
```bash
npm run build
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ahmad Mustafa**

- LinkedIn: [@ahmadmustafa01](https://linkedin.com/in/ahmadmustafa01)
- GitHub: [@ahmadmustafa02](https://github.com/ahmadmustafa02)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Clerk](https://clerk.com/) - Authentication & User Management
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Lucide Icons](https://lucide.dev/) - Beautiful icons
- [Vercel](https://vercel.com/) - Hosting & Deployment

## 📸 Screenshots

### Home Page


![Home Page](<img width="1350" height="593" alt="image" src="https://github.com/user-attachments/assets/db2c5367-11f4-4db3-8c28-972bd3823c8e" />
)

### Features Page
![Features](<img width="1348" height="591" alt="image" src="https://github.com/user-attachments/assets/b6067997-d4ae-4a00-b9cc-ff4e7276427e" />
)


---

<div align="center">

Made with ❤️ by [Ahmad Mustafa](https://linkedin.com/in/ahmadmustafa01)

⭐ Star this repo if you find it helpful!

</div>
