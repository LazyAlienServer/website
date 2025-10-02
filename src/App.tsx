import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ArrowDown, Menu, X } from 'lucide-react';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Navigation items
  const navItems = [
    { id: 'home', label: '首页', subLabel: 'HOME' },
    { id: 'join', label: '加入我们', subLabel: 'JOIN US' },
    { id: 'album', label: '画廊', subLabel: 'ALBUM' },
    { id: 'map', label: '地图', subLabel: 'MAP' },
    { id: 'rules', label: '规章制度', subLabel: 'RULES' }
  ];

  // Scroll to section function
  const scrollToSection = (sectionId: any) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
      setIsMenuOpen(false);
    }
  };

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'dream'];
      let currentSection = 'home';

      for (let i = 0; i < sections.length; i++) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = sections[i];
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/33 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-4 p-4 pt-6 w-full">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <img src="/logo-simplified.svg" alt="LAS Logo" className="h-10" />

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  // TODO: Routing
                  onClick={() => scrollToSection(item.id)}
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
        {
          isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/95 border-t border-gray-800"
            >
              <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`py-2 text-left transition-colors duration-300 ${activeSection === item.id ? 'text-blue-400' : 'text-white'
                      }`}
                  >
                    <span className="block">{item.label}</span>
                    <span className="block text-xs opacity-70">{item.subLabel}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )
        }
      </nav >

      {/* Home Section */}
      < section id="home" className="h-screen w-screen relative overflow-hidden flex flex-row space-end items-end-safe content-between gap-12 p-12" >

        {/* Background */}
        <div className="absolute inset-0 " >
          {/* Image */}
          <img
            src="/cathedral-bg.png"
            alt="Cathedral Background"
            className="w-full h-full object-cover"
          />
          {/* Darken Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div >

        {/* Text */}
        <div className="relative z-10 container mx-auto flex-1 pointer-events-auto text-right">
          <div className="max-w-2xl mx-auto">
            <p className="text-xl mb-6">
              与LAS的成员们，携手并进
              <br />
              <span className="text-sm opacity-70">by CatCoinZHSM & tanh_Heng</span>
            </p>
            <button
              onClick={() => scrollToSection('about')}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-full font-semibold transition-colors duration-300 flex items-center mx-auto"
            >
              了解更多 <ArrowDown size={16} className="ml-2" />
            </button>
          </div>
        </div>
      </section >

      {/* About Us Section */}
      < section id="about" className="py-20 bg-black" >
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Side - Logo and Text */}
            <div className="lg:w-1/2">
              <div className="mb-8">
                <div className="relative">
                  <div className="text-[12rem] font-bold text-blue-400 leading-none">
                    LAS
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  </div>
                </div>
                <div className="mt-8">
                  <div className="bg-blue-500/20 inline-block px-4 py-2 rounded-lg mb-4">
                    <span className="text-blue-400 font-semibold">Lazy Alien Server 简称LAS~</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    是以学生群体为主的技术交流向Minecraft服务器<br />
                    我们充分鼓励技术探索与交流，并欢迎有能力的玩家加入。<br /><br />
                    我们为成员提供强大的硬件支持，依托于高性能物理机和完善的存储与备份方案，我们能够提供充足的性能并保障数据安全。<br /><br />
                    除此之外，我们还设有开发团队，并有多个自主开发的模组和
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Title */}
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="bg-gray-900 p-8 rounded-lg">
                  <div className="flex items-center mb-4">
                    <h2 className="text-4xl md:text-5xl font-bold">关于我们</h2>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xl opacity-70">ABOUT US</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Dream Section */}
      < section id="dream" className="py-20 bg-black" >
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Side - Text */}
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="bg-gray-900 p-8 rounded-lg">
                  <div className="mb-6">
                    <div className="text-6xl font-bold mb-4">
                      DREAM
                    </div>
                    <div className="flex items-center mb-4">
                      <div className="text-sm opacity-70">图册 / 珍珠炮</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                      做一场<br />
                      现实的梦
                    </h2>
                    <div className="flex items-center mb-4">
                      <span className="text-xl opacity-70">HAVE A REALISTIC DREAM.</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-2xl font-bold mb-2">
                      {/* TODO: Dynamic Timer */}
                      1012天21小时31分15秒
                    </div>
                    <div className="text-sm opacity-70">LAZY ALIEN SERVER</div>
                  </div>

                  <div className="flex space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-8 h-1 rounded-full ${i === 0 ? 'bg-blue-400' : 'bg-gray-600'}`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="lg:w-1/2">
              <div className="relative">
                <img
                  src="https://placehold.co/600x400/1a1a2e/ffffff?text=Dream+Structure"
                  alt="Dream Structure"
                  className="w-full h-auto rounded-lg shadow-2xl"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent to-black/50 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Footer */}
      < footer className="py-8 bg-gray-900 border-t border-gray-800" >
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            {/* TODO: Footer text */}
          </p>
        </div>
      </footer >
    </div >
  );
};

export default App;