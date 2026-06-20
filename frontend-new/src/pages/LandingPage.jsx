// frontend-new/src/pages/LandingPage.jsx

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  Shield, 
  Users, 
  Smartphone, 
  TrendingUp, 
  Bell, 
  CheckCircle2,
  ArrowRight,
  Play,
  Star,
  Quote,
  Handshake,
  Wallet,
  Clock,
  Lock,
  Rocket,
  UserPlus,
  RefreshCw,
  Smile,
  CreditCard,
  Building
} from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Gestion du scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation automatique des témoignages
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Données des témoignages
  const testimonials = [
    {
      name: 'Marie K.',
      role: 'Trésorière de tontine',
      text: 'TontiPay a révolutionné notre tontine. Plus de tracas, tout est transparent et automatisé !',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Jean P.',
      role: 'Membre actif',
      text: 'Je reçois des rappels automatiques et je vois clairement mon historique. Excellent outil !',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Aminata D.',
      role: 'Administratrice',
      text: 'La gestion des paiements est devenue un jeu d\'enfant. Je recommande vivement TontiPay.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
    }
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-primary-50 via-white to-purple-50 flex flex-col">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-100' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-xl">T</span>
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-tight">
                TontiPay
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-bold text-gray-600 hover:text-primary-600 transition-colors uppercase tracking-wider">Fonctionnalités</a>
              <a href="#how-it-works" className="text-sm font-bold text-gray-600 hover:text-primary-600 transition-colors uppercase tracking-wider">Comment ça marche</a>
              <a href="#testimonials" className="text-sm font-bold text-gray-600 hover:text-primary-600 transition-colors uppercase tracking-wider">Témoignages</a>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-full font-bold text-xs uppercase tracking-wider hover:shadow-lg transition-all hover:scale-105"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-5 py-2.5 text-xs font-bold text-primary-600 hover:bg-primary-50 rounded-full transition-colors uppercase tracking-wider"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-full font-bold text-xs uppercase tracking-wider hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
                  >
                    <UserPlus size={16} />
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden flex-1 flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 via-transparent to-purple-600/5"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-xs font-bold uppercase tracking-wider">
                <span className="relative flex h-2.5 w-2.5 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-500"></span>
                </span>
                Nouvelle version 2.0 disponible
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-gray-900 uppercase tracking-tight">
                Gérez vos <br />
                <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                  tontines en ligne
                </span>
                <br />
                en toute sécurité
              </h1>
              <p className="text-base md:text-lg text-gray-500 font-medium leading-relaxed max-w-lg">
                TontiPay digitalise la gestion des tontines traditionnelles avec transparence, automatisation et sécurité. 
                Rejoignez-nous pour simplifier votre épargne collective.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-full font-black text-xs uppercase tracking-wider hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-2"
                >
                  Commencer maintenant
                  <ArrowRight size={16} />
                </Link>
                <button
                  onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-full font-black text-xs uppercase tracking-wider hover:border-primary-600 hover:text-primary-600 transition-all flex items-center gap-2"
                >
                  <Play size={14} className="fill-current" />
                  Découvrir
                </button>
              </div>

              <div className="flex items-center gap-6 pt-8 border-t border-gray-100">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      src={`https://images.unsplash.com/photo-${1500000000000 + i*100000}?w=100&h=100&fit=crop&crop=face`}
                      alt="User avatar"
                      className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">+1000 utilisateurs</p>
                  <p className="text-xs font-bold text-gray-400">font confiance à TontiPay</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="relative flex justify-center"
            >
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-500 to-purple-500 rounded-3xl transform rotate-3 scale-102 opacity-10 blur-xl"></div>
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop"
                  alt="TontiPay Dashboard Mockup"
                  className="rounded-3xl shadow-2xl w-full border border-gray-100 relative z-10"
                />
                
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-50 flex items-center gap-3 z-20">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900">Paiement validé</p>
                    <p className="text-[10px] font-bold text-gray-400">Par l'administrateur</p>
                  </div>
                </div>

                <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-50 flex items-center gap-3 z-20">
                  <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-full flex items-center justify-center">
                    <Bell size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900">Rappel de tour</p>
                    <p className="text-[10px] font-bold text-gray-400">Cotisation J-1</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { number: '10K+', label: 'Utilisateurs actifs', icon: Users },
              { number: '500+', label: 'Tontines créées', icon: Handshake },
              { number: '2M+', label: 'Montant épargné (FCFA)', icon: Wallet },
              { number: '99%', label: 'Transactions validées', icon: Smile }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center space-y-2"
              >
                <div className="flex justify-center">
                  <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl">
                    <stat.icon size={24} />
                  </div>
                </div>
                <p className="text-3xl font-black text-gray-900 tracking-tight">{stat.number}</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
              Fonctionnalités{' '}
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                sécurisées & modernes
              </span>
            </h2>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider max-w-md mx-auto">
              Tout ce dont vous avez besoin pour gérer vos tontines en groupe, sans tracas.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Shield,
                title: 'Sécurité Maximale',
                description: 'Chiffrement de vos informations, connexions sécurisées par token (JWT) et validation manuelle des dépôts par preuve.',
                color: 'text-sky-600',
                bg: 'bg-sky-50'
              },
              {
                icon: RefreshCw,
                title: 'Tour de Passage Automatique',
                description: 'Un algorithme effectue le tirage au sort (aléatoire ou ordre d\'arrivée) pour assigner le tour de chacun équitablement.',
                color: 'text-purple-600',
                bg: 'bg-purple-50'
              },
              {
                icon: Wallet,
                title: 'Déclaration Simple',
                description: 'Déclarez votre cotisation en quelques secondes par Orange Money, MTN MoMo, Moov ou en Espèces avec votre référence.',
                color: 'text-emerald-600',
                bg: 'bg-emerald-50'
              },
              {
                icon: TrendingUp,
                title: 'Statistiques & Évolution',
                description: 'Dashboard interactif affichant le total épargné, le montant restant à verser, votre tour de réception et les échéances.',
                color: 'text-amber-600',
                bg: 'bg-amber-50'
              },
              {
                icon: Bell,
                title: 'Rappels de Cotisation',
                description: 'Notifications automatiques avant l\'échéance du tour (J-2, J-1, Jour J) pour assurer des paiements ponctuels.',
                color: 'text-rose-600',
                bg: 'bg-rose-50'
              },
              {
                icon: Clock,
                title: 'Historique Transparent',
                description: 'Consultez la liste complète des cotisations validées par tour, téléchargez vos reçus PDF signés à tout moment.',
                color: 'text-indigo-600',
                bg: 'bg-indigo-50'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-start space-y-4"
              >
                <div className={`p-4 ${feature.bg} ${feature.color} rounded-2xl`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight leading-tight">{feature.title}</h3>
                <p className="text-sm font-medium text-gray-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50/50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
              Comment ça <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">marche</span> ?
            </h2>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              Une gestion simplifiée en 3 grandes étapes
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 relative"
          >
            {[
              {
                step: '01',
                title: 'Créez votre compte',
                description: 'Inscrivez-vous rapidement avec votre numéro de téléphone et votre email pour rejoindre la communauté.',
                icon: UserPlus,
                color: 'text-primary-600',
                bg: 'bg-primary-50'
              },
              {
                step: '02',
                title: 'Rejoignez une tontine',
                description: 'Créez une tontine personnalisée ou rejoignez un groupe d\'amis en entrant simplement leur code unique.',
                icon: Handshake,
                color: 'text-purple-600',
                bg: 'bg-purple-50'
              },
              {
                step: '03',
                title: 'Payez et épargnez',
                description: 'Déclarez vos cotisations régulières et attendez votre tour pour empocher le pot total collecté.',
                icon: Wallet,
                color: 'text-emerald-600',
                bg: 'bg-emerald-50'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col items-center text-center space-y-4"
              >
                <div className="absolute top-4 right-6 text-4xl font-black text-gray-100">{item.step}</div>
                <div className={`p-5 ${item.bg} ${item.color} rounded-full`}>
                  <item.icon size={36} />
                </div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{item.title}</h3>
                <p className="text-sm font-medium text-gray-500 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
              Ce que disent nos <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">membres</span>
            </h2>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              Découvrez les retours d'expérience de nos utilisateurs
            </p>
          </motion.div>

          <div className="relative max-w-3xl mx-auto">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
              >
                {testimonials.map((t, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6 relative">
                      <Quote size={48} className="absolute top-4 right-6 text-primary-100" />
                      <div className="flex items-center gap-4">
                        <img
                          src={t.image}
                          alt={t.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-primary-100"
                        />
                        <div>
                          <h4 className="font-black text-gray-900">{t.name}</h4>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.role}</p>
                        </div>
                      </div>
                      <p className="text-base text-gray-600 font-medium leading-relaxed italic">
                        "{t.text}"
                      </p>
                      <div className="flex gap-1 text-amber-400">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} size={16} className="fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeTestimonial === index ? 'w-8 bg-primary-600' : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden bg-primary-600 text-white border-t border-primary-700">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-purple-700 opacity-90"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="space-y-4"
          >
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
              Prêt à simplifier vos tontines ?
            </h2>
            <p className="text-base md:text-lg text-primary-100 font-medium max-w-lg mx-auto">
              Rejoignez TontiPay aujourd'hui et gérez vos épargnes collectives de manière transparente et sécurisée.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-primary-600 rounded-full font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-2"
              >
                <UserPlus size={16} />
                Créer un compte
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 border-2 border-white/30 text-white rounded-full font-black text-xs uppercase tracking-wider hover:bg-white/10 transition-all"
              >
                Se connecter
              </Link>
            </div>
            <p className="text-xs text-primary-200 font-bold uppercase tracking-widest pt-2">
              ✓ Gratuit • ✓ Sécurisé • ✓ Rappels Automatiques
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-12 px-4 border-t border-gray-900 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-sm">T</span>
                </div>
                <span className="text-sm font-black uppercase tracking-wider">TontiPay</span>
              </div>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                La plateforme moderne de gestion de tontines en ligne, sécurisée et automatisée.
              </p>
            </div>
            
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Produit</h4>
              <ul className="space-y-2 text-xs font-bold text-gray-500">
                <li><a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">Comment ça marche</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Témoignages</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Support</h4>
              <ul className="space-y-2 text-xs font-bold text-gray-500">
                <li><a href="/" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="/" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Légal</h4>
              <ul className="space-y-2 text-xs font-bold text-gray-500">
                <li><a href="/" className="hover:text-white transition-colors">Conditions générales</a></li>
                <li><a href="/" className="hover:text-white transition-colors">Politique de confidentialité</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-900 mt-8 pt-8 text-center text-xs font-bold text-gray-600">
            <p>&copy; {new Date().getFullYear()} TontiPay. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
