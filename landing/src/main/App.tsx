// import {
//   Card,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/card";
import {
  // CheckCircle,
  // MessageSquare,
  // Shield,
  // Users2,
  // TabletSmartphone,
  // Store,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import Logo from "./Logo";
import { motion } from "framer-motion";
import { ContactForm } from "./form";
import { Toaster } from "../components/ui/toaster";

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <main>
      <Toaster />

      <div className="flex min-h-screen font-inter w-full flex-col">
        {/* <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <a className="flex items-center justify-center" href="#">
          <Logo className="h-8 w-auto text-[#B12B89]" />
        </a>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#features"
          >
            Fonctionnalités
          </a>
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#solutions"
          >
            Solutions
          </a>
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#testimonials"
          >
            Témoignages
          </a>
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#contact"
          >
            Contact
          </a>
        </nav>
      </header> */}

        <div className="mx-5 sticky top-5 z-50">
          <nav className=" sticky top-5 w-full rounded-2xl max-w-screen-2xl border 2xl:mx-auto py-1 px-3 left-0 right-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-lg z-50 border-b border-pink-100 dark:border-pink-800/30">
            <div className="container mx-auto px-4 py-2 flex justify-between items-center">
              <Logo className="h-9 text-[#B12B89]" />

              <div className="flex-1 gap-2 flex justify-end">
                <button className="p-2 rounded-lg font-semibold size-10 bg-pink-100 dark:bg-pink-900/50 text-pink-800 dark:text-pink-200 hover:bg-pink-200/50 dark:hover:bg-pink-800/50 transition-colors duration-200">
                  MA
                </button>
              </div>
            </div>
          </nav>
        </div>

        <main className="flex-1">
          <section className="w-full py-24 md:py-24 lg:py-32 xl:py-40 bg-gradient-to-b from-white to-pink-50">
            <div className="container mx-auto px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-[#B12B89]">
                      Gérez Votre Entreprise en Toute Simplicité.
                    </h1>
                    <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                      La plateforme tout-en-un qui vous aide à gérer vos
                      opérations, votre équipe et votre croissance ou votre
                      business e-commerce - le tout au même endroit.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <a
                      className="inline-flex h-10 items-center justify-center rounded-xl bg-[#B12B89] px-8 text-sm font-medium text-white shadow transition-colors hover:bg-[#901d6d] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B12B89]"
                      href="#contact"
                    >
                      Commencer
                    </a>
                  </div>
                </div>
                <motion.div variants={item} className="relative">
                  <div className="relative">
                    {/* MacBook Mockup */}
                    <img src="/image.png" className="mx-auto" />

                    {/* Floating Stats Cards */}
                    <section className="hidden lg:block">
                      <div className="absolute -z-10 -top-8 -left-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg animate-float">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-primary-500/20 flex items-center justify-center">
                            <span className="text-primary-500 font-bold">
                              500+
                            </span>
                          </div>

                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {""}
                            </p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {""}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="absolute -bottom-4 -right-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg animate-float [animation-delay:2s]">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-main flex items-center justify-center">
                            <span className="text-white font-bold">4.9</span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {"Nos Client"}
                            </p>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className="w-4 h-4 text-main"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="absolute -top-0 right-20 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg animate-float animation-delay-900">
                        <TrendingUp className="text-main size-8" />
                      </div>
                      <div className="absolute -top-4 right-32 bg-main dark:main p-2 rounded-xl shadow-lg animate-float animation-delay-900">
                        <DollarSign className="text-white size-6" />
                      </div>

                      <div className="absolute bottom-10 left-0 bg-main dark:bg-main p-2 rounded-xl shadow-lg animate-float animation-delay-900">
                        <Logo className="text-white p-0.5 size-14" />
                      </div>
                    </section>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* <section
            className="w-full py-12 md:py-24 lg:py-32 bg-pink-50"
            id="solutions"
          >
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#B12B89]">
                      Solutions Complètes
                    </h2>
                    <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                      Une plateforme adaptée à tous vos besoins professionnels
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-[#B12B89]" />
                      <span className="font-medium">Interface intuitive</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-[#B12B89]" />
                      <span className="font-medium">Support client 24/7</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-[#B12B89]" />
                      <span className="font-medium">
                        Mises à jour régulières
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-[#B12B89]" />
                      <span className="font-medium">Plateforme sécurisée</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center space-y-4">
                  <div className="grid gap-6">
                    <div className="flex items-center gap-4">
                      <Shield className="h-10 w-10 text-[#B12B89]" />
                      <div className="space-y-1">
                        <h3 className="font-bold">Sécurité Maximale</h3>
                        <p className="text-sm text-gray-500">
                          Vos données sont protégées avec les plus hauts
                          standards
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <TabletSmartphone className="h-10 w-10 text-[#B12B89]" />
                      <div className="space-y-1">
                        <h3 className="font-bold">Multi-Plateformes</h3>
                        <p className="text-sm text-gray-500">
                          Accessible sur tous vos appareils
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <MessageSquare className="h-10 w-10 text-[#B12B89]" />
                      <div className="space-y-1">
                        <h3 className="font-bold">Support Dédié</h3>
                        <p className="text-sm text-gray-500">
                          Notre équipe est là pour vous accompagner
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section> */}
          <section className="w-full py-12 md:py-24 lg:py-32" id="contact">
            <div className="container px-4  mx-auto md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#B12B89]">
                    Contactez-nous
                  </h2>
                  <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Prêt à transformer votre entreprise ? Parlons-en !
                  </p>
                </div>
              </div>
              <div className="mx-auto max-w-lg space-y-6 py-12">
                <ContactForm />
              </div>
            </div>
          </section>
        </main>
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full justify-center shrink-0 items-center px-4 md:px-6 border-t">
          <p className="text-xs text-gray-500 text-center">
            © 2024 SAPHIR CAISSE. Tous droits réservés.
          </p>
        </footer>
      </div>
    </main>
  );
}
