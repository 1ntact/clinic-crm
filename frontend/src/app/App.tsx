
import { Footer } from '@/components/footer/Footer';
import { Header } from '@/components/header/Header';
import { NavBar } from '@/components/navBar/NavBar';
import { ActiveVisitGuard } from '@/components/visitNavigationGuard/VisitNavigationGuard';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';
import "tailwindcss";




export const App: React.FC = () => {
  return (
    <div className="flex h-screen w-full flex-col bg-[#F3F4F6]">
      {/* Header: фон на всю ширину */}
      <Header />

      {/* Основна частина CRM: максимум 1440 px */}
      <div className="mx-auto flex min-h-0 w-full max-w-[1440px] flex-1 overflow-hidden">
        <div className="flex shrink-0 flex-col">
          <ActiveVisitGuard />
          <NavBar />
          <Footer />
        </div>

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto bg-[#F3F4F6] px-[24px] pt-[24px]">
          <Toaster position="bottom-right" reverseOrder={false} />
          <Outlet />
        </main>
      </div>
    </div>
  );
};