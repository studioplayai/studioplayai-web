
import React, { useState } from "react";
import { MyAccountModal } from "./MyAccountModal";
import Button from './common/Button';
import IconClock from './common/IconClock';
import IconLightning from './common/IconLightning';
import IconUser from './common/IconUser';
import IconLogout from './common/IconLogout';
import { AuthUser } from '../types';
import UserMenu from "./UserMenu";
import AdminDashboard from "./AdminDashboard";



interface HeaderProps {
    onToggleGallery: () => void;
    user: AuthUser;
    onLogout: () => void;
    isGalleryOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleGallery, user, onLogout, isGalleryOpen }) => {
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    


const isAdmin =
  user?.email === "admin@studioplay.ai" ||
  user?.email === "michalasri.shivuk@gmail.com";

const handleBuyCredits = (plan: string) => {
  console.log("BUY PLAN FROM ACCOUNT:", plan);

  // שלב הבא: redirect ל-LemonSqueezy
  // window.location.href = CHECKOUT_URL
};

    


    return (
        <header className="flex h-14 md:h-16 w-full flex-shrink-0 items-center justify-between border-b border-panel-border bg-panel-dark px-3 md:px-6 z-30">
            {/* Right side in RTL (Logo & Title) */}
            <div className="flex items-center gap-3">
                 <div className="h-7 w-7 md:h-8 md:w-8 rounded-lg bg-[conic-gradient(from_220deg,theme(colors.purple.600),theme(colors.cyan.400),theme(colors.green.400),theme(colors.purple.600))]"></div>
                 <h1 className="text-base md:text-lg font-bold tracking-tight">StudioPlayAI</h1>
            </div>

            {/* Left side in RTL (User Actions & Gallery) */}
            <div className="flex items-center gap-2 md:gap-4">
              



                
                <div className="hidden lg:flex items-center gap-2 rounded-lg bg-panel-light px-3 py-1.5">
                    <span className="text-sm font-semibold text-gray-300">קרדיטים:</span>
                

                   <span className="font-bold text-white">{user?.credits ?? 0}
</span>

                    <IconLightning className="h-4 w-4 text-yellow-400" />
                </div>
                 <div className="hidden sm:flex items-center gap-2 rounded-lg bg-panel-light px-2 md:px-3 py-1.5">
                    <IconUser className="h-4 w-4 text-gray-400" />
                    <span className="text-xs md:text-sm font-semibold text-gray-300 truncate max-w-[80px] md:max-w-[150px]">{user.email}</span>
                 </div>
                <Button 
                    onClick={onToggleGallery} 
                    className={`!px-3 !py-1.5 hidden lg:inline-flex transition-all ${isGalleryOpen ? '!bg-purple-600 text-white' : '!bg-purple-600/20 text-purple-300 hover:!bg-purple-600/40'}`}
                >
                     <IconClock className="h-4 w-4 ml-2" />
                     הגלריה שלי
                 </Button>
                 <Button
  type="button"
  variant="ghost"
  className="!px-2 !py-1 h-8 md:h-auto hidden sm:inline-flex"
  onClick={async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("LOGOUT CLICK");
    await onLogout?.();
  }}
>
  <IconLogout className="h-4 w-4 ml-1 md:ml-2" />
  <span className="hidden md:inline">התנתק</span>
</Button>

                 <div className="flex items-center gap-2">
  <button
  onClick={() => {
    console.log("AVATAR CLICK");   // 👈 שורה זו להוסיף
    setIsAccountOpen(true);
  }}
  className="h-8 w-8 md:h-9 md:w-9 flex-shrink-0 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 font-bold text-white flex items-center justify-center"
  title="האזור האישי"
>
  {(user?.email?.[0] || "").toUpperCase()}
  {(user?.email?.[1] || "").toUpperCase()}
</button>

</div>

            </div>
           {isAdmin && (
  <button
    onClick={() => setIsAdminOpen(true)}
    className="
      flex items-center gap-2
      px-4 py-2
      rounded-2xl
      border border-red-500/40
      text-red-400
      bg-red-500/10
      hover:bg-red-500/20
      font-bold text-sm
      transition
    "
  >
    <span className="text-red-400">ADMIN PANEL</span>
    <span className="opacity-80">🛡️</span>
  </button>
)}



{isAdminOpen && (
  <>
    {console.log('ADMIN DASHBOARD OPEN')}
    <AdminDashboard onClose={() => setIsAdminOpen(false)} />
  </>
)}



          <MyAccountModal
  isOpen={isAccountOpen}
  user={user}
  onClose={() => setIsAccountOpen(false)}
  onBuyPlan={handleBuyCredits}
/>


{isAdminOpen && (
  <AdminDashboard onClose={() => setIsAdminOpen(false)} />
)}



        </header>
    );
};

export default Header;
