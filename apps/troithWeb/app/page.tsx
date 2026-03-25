'use client'

import Link from 'next/link'
import { Button } from '@troith/shared/components/ui/button'
import { H1, H2, P } from '@troith/shared/components/typography'
import { ScrollText, Pyramid, UsersRound, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: ScrollText,
    title: 'Invoices',
    description: 'Create and manage professional invoices with ease'
  },
  {
    icon: Pyramid,
    title: 'Items',
    description: 'Organize your product and service catalog'
  },
  {
    icon: UsersRound,
    title: 'Parties',
    description: 'Manage customers and vendors efficiently'
  }
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl font-bold">
            <span className="text-primary">T</span>roith
          </motion.h1>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
            <Link href="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/tool">
              <Button>Go to App</Button>
            </Link>
          </motion.div>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-4 py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <H1 className="text-4xl md:text-6xl font-bold mb-6">
              Invoice Made <span className="text-primary">Simple</span>
            </H1>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <P className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Streamline your billing process with Troith. Create professional invoices, manage items and parties, all in one place.
            </P>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center gap-4"
          >
            <Link href="/auth">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/tool">
              <Button size="lg" variant="outline">
                Explore Demo
              </Button>
            </Link>
          </motion.div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <H2 className="text-3xl font-bold text-center mb-12">Features</H2>
          </motion.div>

          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={item}
                whileHover={{ scale: 1.02, y: -5 }}
                className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm cursor-pointer"
              >
                <feature.icon className="h-10 w-10 mb-4 text-primary" />
                <H2 className="text-xl font-semibold mb-2">{feature.title}</H2>
                <P className="text-muted-foreground">{feature.description}</P>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <P>© 2024 Troith. All rights reserved.</P>
        </div>
      </footer>
    </div>
  )
}
