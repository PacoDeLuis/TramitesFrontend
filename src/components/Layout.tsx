import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { colors } from "../styles/theme";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div style={{
      display: "flex",
      flexDirection: "row",
      minHeight: "100vh",
      background: colors.background,
      position: "relative"
    }} className="layout-container">
      
      {/* 1. Sidebar: Le pasamos la función para que se cierre al hacer clic en un link */}
      <div className={`sidebar-wrapper ${isSidebarOpen ? "open" : ""}`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <main style={{ flex: 1, padding: "20px", width: "100%", overflowX: "hidden" }}>
        {/* 2. Header: Aquí le pasamos la función para abrir el menú */}
        <Header onOpenMenu={() => setIsSidebarOpen(true)} />
        
        {children}
      </main>

      {/* 3. Overlay: Se mantiene para cerrar el menú tocando fuera */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="sidebar-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            zIndex: 998
          }}
        />
      )}
    </div>
  );
}