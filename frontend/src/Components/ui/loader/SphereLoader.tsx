import logo from "/GlucoTraceLogo.webp";

const SphereLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      <div className="animate-bounce-fast relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-teal-400 shadow-[inset_-6px_-6px_12px_rgba(255,255,255,0.4),_inset_6px_6px_12px_rgba(0,0,0,0.2),_0_8px_16px_rgba(0,0,0,0.3)]">
        
        <img
          src={logo}
          alt="Logo"
          className="absolute inset-0 m-auto w-10 h-10 object-contain z-10"
        />
        <div className="absolute w-full h-full rounded-full bg-white/10 blur-xl"></div>
      </div>
    </div>
  );
};

export default SphereLoader;
