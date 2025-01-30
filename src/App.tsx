import React from 'react';
import { Github, Instagram, MessageCircle, Youtube } from 'lucide-react';
import profilePic from "../p.jpg";

function App() {
  const links = [
    {
      title: 'Music Profile',
      username: 'AlAzizxan.aac',
      description: 'Original music and creative content',
      icon: <Instagram className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.5]" />,
      url: 'https://instagram.com/al_azizxan.aac',
      color: 'from-pink-500 to-pink-600',
      glow: 'shadow-pink-500/50'
    },
    {
      title: 'CyberSec Instagram',
      username: 'AlAzizxan.exe',
      description: 'Cyber security tips and hacking tutorials',
      icon: <Instagram className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.5]" />,
      url: 'https://instagram.com/alazizxan.exe',
      color: 'from-cyan-500 to-cyan-600',
      glow: 'shadow-cyan-500/50'
    },
    {
      title: 'Telegram Channel',
      username: 'All TeKiN',
      description: 'Daily coding tips and tech updates',
      icon: <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.5]" />,
      url: 'https://t.me/AllTeKiN',
      color: 'from-purple-500 to-purple-600',
      glow: 'shadow-purple-500/50'
    },
    {
      title: 'YouTube Channel',
      username: 'AlAzizxan',
      description: 'Tech tutorials and music content',
      icon: <Youtube className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.5]" />,
      url: 'https://youtube.com/@AlAzizxan',
      color: 'from-red-500 to-red-600',
      glow: 'shadow-red-500/50'
    },
    {
      title: 'GitHub',
      username: 'AlAzizxan',
      description: 'Open source projects and code',
      icon: <Github className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.5]" />,
      url: 'https://github.com/AlAzizxan',
      color: 'from-emerald-500 to-emerald-600',
      glow: 'shadow-emerald-500/50'
    }
  ];

  return (
    <div className="min-h-screen bg-[#030014] text-white relative overflow-hidden">
      {/* Dark animated background */}
      <div className="fixed inset-0 bg-[#030014]">
        {/* Animated grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f10_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f10_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        {/* Neon effects */}
        <div className="absolute inset-0">
          {/* Top blue neon */}
          <div className="absolute -top-[10%] left-0 right-0 h-[300px] bg-gradient-to-b from-blue-500/10 via-blue-500/5 to-transparent blur-[100px] animate-glow-slow"></div>
          
          {/* Top right pink neon */}
          <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-pink-500/10 blur-[100px] animate-glow-slow delay-75"></div>
          
          {/* Top left red neon */}
          <div className="absolute top-0 left-0 w-[250px] h-[250px] bg-red-500/10 blur-[100px] animate-glow-slow delay-150"></div>
          
          {/* Bottom green neon */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-emerald-500/10 blur-[100px] animate-glow-slow delay-300"></div>
        </div>

        {/* Noise texture */}
        <div className="absolute inset-0 opacity-20 mix-blend-soft-light animate-noise"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-xl mx-auto">
          {/* Profile Section */}
          <div className="text-center mb-8">
            <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-6 rounded-full relative group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-blue-500 to-emerald-500 animate-spin-slower blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative rounded-full ring-2 ring-white/20 overflow-hidden">
                <img 
                  src={profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-2">
            
            <h1 className="text-3xl sm:text-5xl font-bold mb-2 font-['Orbitron']">
              <span className="text-cyan-400 drop-shadow-[0_0_10px_#00f7ff]">Al</span>
              <span className="text-pink-500 drop-shadow-[0_0_10px_#ff00f7]">Azizxan</span>
            </h1>
              <p className="text-gray-400 text-base sm:text-lg font-['Space_Grotesk'] tracking-wider flex items-center justify-center gap-2">
                <span>Cyber Security</span>
                <span>|</span>
                <span>Music</span>
                <span>|</span>
                <span>Coding</span>
              </p>
            </div>
          </div>

          {/* Links Section */}
          <div className="space-y-3">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-blue-500/10 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-lg p-3 border border-white/5 shadow-lg transition-all duration-500 hover:scale-[1.01] hover:bg-white/[0.05]">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14">
                        {/* Rotating outer ring */}
                        <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${link.color} animate-spin-slower opacity-75`}></div>
                        
                        {/* Static inner circle */}
                        <div className={`absolute inset-1 rounded-full bg-gradient-to-b ${link.color} ${link.glow} flex items-center justify-center`}>
                          {/* Icon container with glass effect */}
                          <div className="absolute inset-[2px] rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
                            <div className="relative z-10 transform transition-transform duration-500 group-hover:scale-110">
                              {link.icon}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-base sm:text-lg font-bold text-white group-hover:text-current transition-all duration-500 font-['Orbitron']">
                          {link.title}
                        </h2>
                        <p className="text-gray-400 text-xs sm:text-sm font-['Space_Grotesk']">@{link.username}</p>
                        <p className="text-gray-500 text-xs mt-0.5 font-['Space_Grotesk'] leading-relaxed">
                          {link.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
