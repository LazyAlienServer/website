import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

type Props = {
    activeSection: string;
    scrollToSection: (sectionId: string) => void;
};

const Navbar: React.FC<Props> = ({ activeSection, scrollToSection }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { id: 'home', label: '首页', subLabel: 'HOME' },
        { id: 'join', label: '加入我们', subLabel: 'JOIN US' },
        { id: 'album', label: '画廊', subLabel: 'ALBUM' },
        { id: 'map', label: '地图', subLabel: 'MAP' },
        { id: 'rules', label: '规章制度', subLabel: 'RULES' }
    ];

    const handleClick = (id: string) => {
        scrollToSection(id);
        setIsMenuOpen(false);
    };

    return (
        <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-black/20 backdrop-blur-md border border-blue-600/50 rounded-xl shadow-lg w-11/12 max-w-5xl">
            <div className="px-4 py-3 w-full">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <img src="/logo-simplified.svg" alt="LAS Logo" className="h-10" />

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-6">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleClick(item.id)}
                                className={`relative group transition-colors duration-300 ${activeSection === item.id ? 'text-blue-400' : 'text-white hover:text-blue-300'
                                    }`}
                            >
                                <span className="block">{item.label}</span>
                                <span className="block text-xs opacity-70">{item.subLabel}</span>
                                {activeSection === item.id && (
                                    <motion.div
                                        layoutId="underline"
                                        className="absolute -bottom-2 left-0 w-full h-0.5 bg-blue-400"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden bg-black/95 border-t border-gray-800 rounded-b-xl overflow-hidden"
                >
                    <div className="w-full px-6 py-4 flex flex-col space-y-4">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleClick(item.id)}
                                className={`py-2 text-left transition-colors duration-300 ${activeSection === item.id ? 'text-blue-400' : 'text-white'
                                    }`}
                            >
                                <span className="block">{item.label}</span>
                                <span className="block text-xs opacity-70">{item.subLabel}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}
        </nav>
    );
};

export default Navbar;
