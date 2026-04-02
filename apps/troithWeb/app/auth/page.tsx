'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@troith/shared/components/ui/button'
import { H1, H2, P } from '@troith/shared/components/typography'
import { ScrollText, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react'
import Link from 'next/link'

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Column - Perspective Design with Isometric Views & Vanishing Points */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#000000]">
        {/* Vanishing Point Perspective Grid */}
        <div 
          className="absolute inset-0"
          style={{ 
            perspective: '800px',
            perspectiveOrigin: '70% 40%'
          }}
        >
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
              transform: 'rotateX(70deg) rotateZ(-10deg) translateZ(-200px) scale(4)',
              transformOrigin: 'center center'
            }}
          />
        </div>

        {/* Isometric Floating Elements - Layer 1 (Far) */}
        <div 
          className="absolute w-64 h-64 border border-white/5 rounded-3xl"
          style={{ 
            top: '5%', 
            left: '-5%',
            transform: 'rotateX(55deg) rotateY(-35deg) rotateZ(15deg) translateZ(-150px)',
            transformStyle: 'preserve-3d'
          }}
        />
        <div 
          className="absolute w-48 h-48 border border-white/5 rounded-full"
          style={{ 
            bottom: '10%', 
            right: '5%',
            transform: 'rotateX(45deg) rotateY(25deg) translateZ(-120px)',
            transformStyle: 'preserve-3d'
          }}
        />

        {/* Isometric Floating Elements - Layer 2 (Mid) */}
        <div 
          className="absolute w-32 h-32 bg-white/5 backdrop-blur-sm rounded-2xl"
          style={{ 
            top: '25%', 
            right: '15%',
            transform: 'rotateX(50deg) rotateY(-30deg) rotateZ(-10deg) translateZ(-50px)',
            transformStyle: 'preserve-3d'
          }}
        />
        <div 
          className="absolute w-24 h-24 border border-white/10 rounded-xl"
          style={{ 
            bottom: '35%', 
            left: '20%',
            transform: 'rotateX(40deg) rotateY(20deg) rotateZ(25deg) translateZ(-30px)',
            transformStyle: 'preserve-3d'
          }}
        />

        {/* Isometric Floating Elements - Layer 3 (Close) */}
        <div 
          className="absolute w-20 h-20 bg-white/10 rounded-lg shadow-2xl"
          style={{ 
            top: '45%', 
            left: '8%',
            transform: 'rotateX(60deg) rotateY(-25deg) translateZ(50px)',
            transformStyle: 'preserve-3d'
          }}
        />
        <div 
          className="absolute w-16 h-16 bg-white/15 rounded-full"
          style={{ 
            top: '15%', 
            right: '10%',
            transform: 'rotateX(35deg) rotateY(30deg) translateZ(80px)',
            transformStyle: 'preserve-3d'
          }}
        />

        {/* Isometric Invoice Card - 3D Element */}
        <div 
          className="absolute w-56 h-40 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl border border-white/20"
          style={{ 
            top: '30%', 
            left: '45%',
            transform: 'rotateX(50deg) rotateY(-40deg) rotateZ(8deg) translateZ(30px)',
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="p-5 space-y-3 h-full">
            <div className="h-4 bg-white/40 rounded w-3/4" />
            <div className="h-3 bg-white/25 rounded w-1/2" />
            <div className="h-3 bg-white/25 rounded w-2/3" />
            <div className="flex-1" />
            <div className="flex justify-between items-end">
              <div className="h-3 bg-white/20 rounded w-1/4" />
              <div className="h-8 w-20 bg-white/40 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-14 py-20 text-white">
          <div className="mb-12">
            <div 
              className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-10 shadow-2xl border border-white/30"
              style={{ 
                transform: 'rotateX(10deg) rotateY(-8deg) translateZ(20px)',
                transformStyle: 'preserve-3d'
              }}
            >
              <ScrollText className="h-12 w-12 text-white" />
            </div>
            <h1 
              className="text-7xl font-bold mb-5 tracking-tight"
              style={{ 
                fontFamily: "'Oswald', sans-serif",
                transform: 'rotateX(5deg) translateZ(15px)',
                textShadow: '0 8px 32px rgba(0,0,0,0.3)',
                transformStyle: 'preserve-3d'
              }}
            >
              <span className="text-white">T</span>ROITH
            </h1>
            <p 
              className="text-2xl text-white/90 leading-relaxed max-w-lg"
              style={{ 
                fontFamily: "'Poppins', sans-serif",
                transform: 'translateZ(10px)',
                transformStyle: 'preserve-3d'
              }}
            >
              Streamline your invoicing workflow with intelligent automation
            </p>
          </div>

          <div className="space-y-6">
            <div 
              className="flex items-start gap-5 p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
              style={{ 
                transform: 'translateZ(25px)',
                transformStyle: 'preserve-3d'
              }}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 shadow-xl">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 
                  className="text-xl font-semibold text-white mb-1"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Lightning Fast
                </h2>
                <p 
                  className="text-white/70 text-base"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Create invoices in seconds with smart templates
                </p>
              </div>
            </div>

            <div 
              className="flex items-start gap-5 p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
              style={{ 
                transform: 'translateZ(40px)',
                transformStyle: 'preserve-3d'
              }}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 shadow-xl">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 
                  className="text-xl font-semibold text-white mb-1"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Secure & Reliable
                </h2>
                <p 
                  className="text-white/70 text-base"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Your data is encrypted and backed up automatically
                </p>
              </div>
            </div>

            <div 
              className="flex items-start gap-5 p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
              style={{ 
                transform: 'translateZ(55px)',
                transformStyle: 'preserve-3d'
              }}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 shadow-xl">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 
                  className="text-xl font-semibold text-white mb-1"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Smart Analytics
                </h2>
                <p 
                  className="text-white/70 text-base"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Track payments and gain insights into your business
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Depth Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-black/10 to-transparent rounded-tr-full pointer-events-none" />
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                <ScrollText className="h-7 w-7 text-primary-foreground" />
              </div>
            </Link>
            <h1 
              className="text-4xl font-bold mb-2"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              <span className="text-primary">T</span>ROITH
            </h1>
          </div>

          {/* Login Card */}
          <div className="border rounded-2xl bg-card p-8 shadow-xl">
            <div className="text-center mb-8">
              <h2 
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Welcome back
              </h2>
              <p 
                className="text-muted-foreground"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Sign in to continue to your dashboard
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <Button
                size="lg"
                onClick={() =>
                  signIn('google', {
                    redirect: true,
                    redirectTo: '/tool'
                  })
                }
                className="w-full h-12 text-base font-medium"
              >
                Continue with Google
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <div className="text-center">
              <p 
                className="text-xs text-muted-foreground"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                By signing in, you agree to our{' '}
                <Link href="#" className="text-primary hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
              </p>
            </div>
          </div>

          {/* Continue without signing in */}
          <div className="text-center mt-6">
            <Link href="/tool">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Continue without signing in
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p 
              className="text-xs text-muted-foreground"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Need help?{' '}
              <Link href="#" className="text-primary hover:underline">Contact Support</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
