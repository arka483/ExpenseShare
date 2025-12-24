import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, CheckCircle, Smartphone, Users, Zap, DollarSign } from 'lucide-react';

const LandingPage = () => {
    // Snap scrolling container
    const containerRef = useRef(null);

    return (
        <div
            ref={containerRef}
            className="h-screen w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-slate-900 text-white scroll-smooth"
        >
            {/* PAGE 1: HERO */}
            <section className="h-screen w-full snap-start relative flex items-center justify-center overflow-hidden">
                {/* Background Dynamic Gradients */}
                <div className="absolute inset-0 bg-slate-900">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/30 rounded-full blur-[100px] animate-blob"></div>
                    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-600/30 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
                </div>

                <div className="container mx-auto px-4 z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                            Split Expenses.<br /> Skip the Drama.
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                            The smartest way to track shared expenses, split bills, and settle debts with friends, roommates, and travel buddies.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                to="/create-user"
                                className="group relative px-8 py-4 bg-white text-slate-900 text-lg font-bold rounded-full overflow-hidden transition-all hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Start Splitting <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                            <Link
                                to="/login"
                                className="px-8 py-4 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-lg font-medium rounded-full transition-all backdrop-blur-sm"
                            >
                                Login
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-500 text-sm font-medium"
                >
                    Scroll to Explore
                </motion.div>
            </section>

            {/* PAGE 2: HOW IT WORKS (Interactive Cards) */}
            <section className="h-screen w-full snap-start relative flex items-center bg-slate-50 text-slate-900 transition-colors">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                            Math is hard.<br />
                            <span className="text-indigo-600">We make it easy.</span>
                        </h2>

                        <div className="space-y-6">
                            {[
                                { icon: Users, title: "Create Groups", desc: "For trips, housemates, or weekend dinners." },
                                { icon: DollarSign, title: "Add Expenses", desc: "Equally, by percentage, or custom amounts." },
                                { icon: Zap, title: "Settle Up", desc: "Pay back friends with a single click." }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.2 }}
                                    className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-slate-100 cursor-default"
                                >
                                    <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{item.title}</h3>
                                        <p className="text-slate-500">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Visual Graphic Area */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ type: "spring", duration: 1.2 }}
                        className="relative"
                    >
                        {/* Mock App Interface Card */}
                        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 max-w-sm mx-auto relative z-10">
                            <div className="flex justify-between items-center mb-6">
                                <div className="font-bold text-xl">Trip to Vegas</div>
                                <div className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">Settled</div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-500"></div>
                                        <div>
                                            <div className="font-bold text-sm">Hotel</div>
                                            <div className="text-xs text-slate-500">Alice paid $400</div>
                                        </div>
                                    </div>
                                    <div className="font-bold text-slate-900">$200.00</div>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-pink-500"></div>
                                        <div>
                                            <div className="font-bold text-sm">Dinner</div>
                                            <div className="text-xs text-slate-500">Bob paid $150</div>
                                        </div>
                                    </div>
                                    <div className="font-bold text-slate-900">$75.00</div>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                                <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200">
                                    Add Expense
                                </button>
                            </div>
                        </div>

                        {/* Decor Elements */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply blur-2xl opacity-50 animate-blob"></div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-400 rounded-full mix-blend-multiply blur-2xl opacity-50 animate-blob animation-delay-2000"></div>
                    </motion.div>
                </div>
            </section>

            {/* PAGE 3: FINAL CALL TO ACTION */}
            <section className="h-screen w-full snap-start relative flex items-center justify-center bg-indigo-900 overflow-hidden">
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                <div className="container mx-auto px-4 text-center z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/10 backdrop-blur-lg border border-white/20 p-12 md:p-20 rounded-[3rem] shadow-2xl max-w-4xl mx-auto"
                    >
                        <h2 className="text-5xl md:text-7xl font-black mb-8 text-white">
                            Ready to get<br />organized?
                        </h2>
                        <p className="text-xl text-indigo-100 mb-10 max-w-xl mx-auto">
                            Join millions of people who stopped worrying about who owes who.
                        </p>

                        <div className="flex flex-col md:flex-row justify-center gap-6">
                            <Link
                                to="/create-user"
                                className="px-10 py-5 bg-white text-indigo-900 text-xl font-bold rounded-2xl hover:scale-105 transition-transform shadow-xl"
                            >
                                Create Free Account
                            </Link>
                        </div>

                        <div className="mt-12 flex items-center justify-center gap-8 text-indigo-200 opacity-60">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" /> Free Forever
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" /> No Hidden Fees
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" /> Secure
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
