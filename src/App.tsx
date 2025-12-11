import React, { useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';
import PixelBlast from './pixel-blast';
import Navbar from './Navbar';

const App = () => {
  const [activeSection, setActiveSection] = useState('home');


  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
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
      <Navbar activeSection={activeSection} scrollToSection={scrollToSection} />

      {/* Home Section */}
      <section id="home" className="h-screen w-screen relative overflow-hidden p-12">

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
          {/* Pixel Effects */}
          <div className="absolute inset-0 ">
            <PixelBlast
              variant="square"
              pixelSize={4}
              pixelSizeJitter={1.5}
              color="#6096E6"
              patternScale={5}
              patternDensity={0.75}
              enableRipples
              rippleSpeed={0.33}
              rippleThickness={0.06}
              rippleIntensityScale={0.6}
              speed={1}
              edgeFade={0.1}
              transparent
            />
          </div>
        </div >

        {/* Space */}
        <div className="h-1/5"></div>

        {/* Hero */}
        <div className="relative text-[192px] font-bold leading-[135px] tracking-[-0.12em] left-1/12 select-none pointer-events-none">
          LAZY
          <br />
          <span className="text-blue-400">ALI</span>EN
          <br />
          <span className="text-blue-400">SERVER</span>
        </div>

        {/* Slogan */}
        <div className="relative mt-12 left-1/12">
          <p className="text-xl">
            与LAS的成员们，携手并进
            <br />
            <span className="text-sm opacity-70 italic">
              by CatCoinZHSM & tanh_Heng
            </span>
          </p>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer" onClick={() => scrollToSection('about')}>
          <ArrowDown className="animate-bounce text-white opacity-70" size={32} />
        </div>

      </section >

      {/* About Us Section */}
      < section id="about" className="py-20 bg-blue-600" >
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="mb-8 mt-8">
                <div >
                  <p className="text-gray-300 font-semibold">
                    Lazy Alien Server 简称LAS~
                  </p>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  是以学生群体为主的技术交流向Minecraft服务器我们充分鼓励技术探索与交流，并欢迎有能力的玩家加入。我们为成员提供强大的硬件支持，依托于高性能物理机和完善的存储与备份方案，我们能够提供充足的性能并保障数据安全。除此之外，我们还设有开发团队，并有多个自主开发的模组和插件。
                </p>
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