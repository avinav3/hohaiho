import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import logout from "../utils/logout";

const menuItems = [
  {
    name: "Dashboard",
    path: "/AdminDashboard",
    icon: "📊",
    desc: "Overview & Stats",
  },
  {
    name: "Users",
    path: "/UserManagement",
    icon: "👤",
    desc: "Manage Accounts",
  },
  { name: "Cars", path: "/CarManagement", icon: "🚗", desc: "Fleet Control" },
  {
    name: "Bookings",
    path: "/BookingManagement",
    icon: "📅",
    desc: "Reservations",
  },
  {
    name: "Payments",
    path: "/PaymentManagement",
    icon: "💳",
    desc: "Transactions",
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hovered, setHovered] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [ripple, setRipple] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAdminLogout = async () => {
    await logout({ navigate, redirectTo: "/AdminLogin" });
  };

  const triggerRipple = (path) => {
    setRipple(path);
    setTimeout(() => setRipple(null), 600);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .sidebar-wrapper {
          padding: 16px 0 16px 16px;
          min-height: 100vh;
          background: #04070e;
          display: flex;
        }

        .sidebar-root {
          font-family: 'DM Sans', sans-serif;
          width: 272px;
          min-height: calc(100vh - 32px);
          background: #0b1120;
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
          border-radius: 28px;
          border: 1px solid rgba(99,179,237,0.10);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.03),
            0 8px 40px rgba(0,0,0,0.65),
            0 2px 8px rgba(56,189,248,0.06),
            inset 0 1px 0 rgba(255,255,255,0.05);
        }

        /* Ambient glow layers */
        .sidebar-root::before {
          content: '';
          position: absolute;
          top: -80px;
          left: -80px;
          width: 260px;
          height: 260px;
          background: radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%);
          border-radius: 50%;
          animation: floatGlow 6s ease-in-out infinite;
          pointer-events: none;
        }
        .sidebar-root::after {
          content: '';
          position: absolute;
          bottom: 60px;
          right: -60px;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%);
          border-radius: 50%;
          animation: floatGlow 8s ease-in-out infinite reverse;
          pointer-events: none;
        }

        @keyframes floatGlow {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          50% { transform: translate(20px, 20px) scale(1.1); opacity: 1; }
        }

        /* Scanline texture */
        .scanlines {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.04) 2px,
            rgba(0,0,0,0.04) 4px
          );
          pointer-events: none;
          z-index: 0;
        }

        .sidebar-content {
          position: relative;
          z-index: 1;
        }

        /* Header */
        .sidebar-header {
          padding: 28px 24px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          border-radius: 28px 28px 0 0;
          background: linear-gradient(160deg, rgba(56,189,248,0.05) 0%, transparent 60%);
        }

        .logo-row {
          display: flex;
          align-items: center;
          gap: 14px;
          opacity: 0;
          transform: translateY(-16px);
          animation: slideDown 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s forwards;
        }

        @keyframes slideDown {
          to { opacity: 1; transform: translateY(0); }
        }

        .logo-icon {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 16px;
          background: linear-gradient(135deg, #38bdf8, #818cf8);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 22px;
          letter-spacing: -1px;
          flex-shrink: 0;
          box-shadow: 0 0 20px rgba(56,189,248,0.4), 0 4px 16px rgba(0,0,0,0.4);
        }

        .logo-icon::after {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 18px;
          background: linear-gradient(135deg, rgba(56,189,248,0.5), rgba(129,140,248,0.5));
          z-index: -1;
          animation: borderPulse 3s ease-in-out infinite;
        }

        @keyframes borderPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.04); }
        }

        .logo-text h1 {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: 0.5px;
          margin: 0;
          line-height: 1.2;
          background: linear-gradient(90deg, #f0f9ff, #38bdf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .logo-text p {
          margin: 2px 0 0;
          font-size: 11px;
          color: rgba(148,163,184,0.7);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          font-weight: 300;
        }

        /* Status dot */
        .status-row {
          margin-top: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0;
          animation: fadeIn 0.5s ease 0.5s forwards;
        }

        @keyframes fadeIn {
          to { opacity: 1; }
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 8px rgba(74,222,128,0.7);
          animation: dotPulse 2s ease-in-out infinite;
        }

        @keyframes dotPulse {
          0%, 100% { box-shadow: 0 0 6px rgba(74,222,128,0.7); }
          50% { box-shadow: 0 0 14px rgba(74,222,128,1); }
        }

        .status-text {
          font-size: 11px;
          color: rgba(148,163,184,0.6);
          letter-spacing: 0.5px;
        }

        /* Nav */
        .nav-section {
          padding: 20px 14px;
        }

        .nav-label {
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(148,163,184,0.35);
          padding: 0 10px;
          margin-bottom: 10px;
          font-weight: 600;
        }

        .nav-item-wrap {
          margin-bottom: 4px;
          opacity: 0;
          transform: translateX(-20px);
        }

        .nav-item-wrap.mounted {
          animation: slideRight 0.5s cubic-bezier(0.22,1,0.36,1) forwards;
        }

        @keyframes slideRight {
          to { opacity: 1; transform: translateX(0); }
        }

        .nav-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 11px 14px;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.22,1,0.36,1);
          overflow: hidden;
          text-decoration: none;
          color: inherit;
        }

        .nav-item::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 14px;
          opacity: 0;
          transition: opacity 0.25s;
          background: rgba(255,255,255,0.04);
        }

        .nav-item:hover::before {
          opacity: 1;
        }

        .nav-item.active {
          background: linear-gradient(135deg, rgba(56,189,248,0.18), rgba(129,140,248,0.14));
          border: 1px solid rgba(56,189,248,0.25);
          box-shadow: 0 4px 20px rgba(56,189,248,0.1), inset 0 1px 0 rgba(255,255,255,0.07);
        }

        .nav-item.active::after {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 60%;
          background: linear-gradient(180deg, #38bdf8, #818cf8);
          border-radius: 0 3px 3px 0;
        }

        .nav-item:hover:not(.active) {
          background: rgba(255,255,255,0.05);
          transform: translateX(5px);
        }

        /* Ripple */
        .ripple-effect {
          position: absolute;
          border-radius: 50%;
          background: rgba(56,189,248,0.25);
          width: 10px;
          height: 10px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0);
          animation: ripple 0.6s ease-out forwards;
          pointer-events: none;
        }

        @keyframes ripple {
          to { transform: translate(-50%, -50%) scale(28); opacity: 0; }
        }

        .nav-icon {
          font-size: 18px;
          min-width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
          background: rgba(255,255,255,0.04);
        }

        .nav-item:hover .nav-icon,
        .nav-item.active .nav-icon {
          transform: scale(1.2) rotate(-5deg);
          background: rgba(56,189,248,0.12);
        }

        .nav-text {
          flex: 1;
        }

        .nav-name {
          font-family: 'Syne', sans-serif;
          font-size: 13.5px;
          font-weight: 700;
          letter-spacing: 0.3px;
          line-height: 1;
          color: rgba(226,232,240,0.9);
          transition: color 0.2s;
        }

        .nav-item.active .nav-name,
        .nav-item:hover .nav-name {
          color: #f0f9ff;
        }

        .nav-desc {
          font-size: 10.5px;
          color: rgba(148,163,184,0.45);
          margin-top: 2px;
          transition: color 0.2s;
        }

        .nav-item.active .nav-desc {
          color: rgba(186,230,253,0.5);
        }

        .nav-arrow {
          font-size: 12px;
          opacity: 0;
          color: rgba(56,189,248,0.7);
          transform: translateX(-4px);
          transition: all 0.25s;
        }

        .nav-item:hover .nav-arrow,
        .nav-item.active .nav-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        /* Divider */
        .sidebar-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,179,237,0.12), transparent);
          margin: 4px 14px;
        }

        /* Footer */
        .sidebar-footer {
          padding: 16px 14px 24px;
          position: relative;
          z-index: 1;
          border-top: 1px solid rgba(255,255,255,0.05);
          border-radius: 0 0 28px 28px;
          background: linear-gradient(0deg, rgba(129,140,248,0.04) 0%, transparent 60%);
        }

        .admin-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          margin-bottom: 12px;
        }

        .admin-avatar {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: linear-gradient(135deg, #0ea5e9, #7c3aed);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          flex-shrink: 0;
        }

        .admin-info p {
          margin: 0;
          font-size: 12px;
          font-weight: 500;
          color: rgba(226,232,240,0.8);
        }

        .admin-info span {
          font-size: 10px;
          color: rgba(148,163,184,0.4);
          letter-spacing: 0.5px;
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 11px 16px;
          border-radius: 12px;
          border: 1px solid rgba(239,68,68,0.25);
          background: rgba(239,68,68,0.08);
          color: rgba(252,165,165,0.9);
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
          position: relative;
          overflow: hidden;
        }

        .logout-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.1));
          opacity: 0;
          transition: opacity 0.3s;
        }

        .logout-btn:hover {
          border-color: rgba(239,68,68,0.55);
          color: #fecaca;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(239,68,68,0.2);
        }

        .logout-btn:hover::before {
          opacity: 1;
        }

        .logout-btn:active {
          transform: translateY(0);
        }

        .logout-icon {
          font-size: 15px;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }

        .logout-btn:hover .logout-icon {
          transform: translateX(-3px) rotate(-10deg);
        }
      `}</style>

      <div className="sidebar-wrapper">
        <aside className="sidebar-root">
          <div className="scanlines" />

          <div className="sidebar-content">
            {/* Header */}
            <div className="sidebar-header">
              <div className="logo-row">
                <div className="logo-icon">A</div>
                <div className="logo-text">
                  <h1>Admin Panel</h1>
                  <p>Car Rental</p>
                </div>
              </div>
              <div className="status-row">
                <div className="status-dot" />
                <span className="status-text">System Online</span>
              </div>
            </div>

            {/* Nav */}
            <nav className="nav-section">
              <div className="nav-label">Navigation</div>

              {menuItems.map((item, i) => {
                const isActive = location.pathname === item.path;
                return (
                  <div
                    key={item.path}
                    className="nav-item-wrap"
                    style={
                      mounted ? { animationDelay: `${0.15 + i * 0.07}s` } : {}
                    }
                    ref={(el) => {
                      if (el && mounted) el.classList.add("mounted");
                    }}
                  >
                    <Link
                      to={item.path}
                      className={`nav-item ${isActive ? "active" : ""}`}
                      onMouseEnter={() => setHovered(item.path)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => triggerRipple(item.path)}
                    >
                      {ripple === item.path && (
                        <span className="ripple-effect" />
                      )}
                      <div className="nav-icon">{item.icon}</div>
                      <div className="nav-text">
                        <div className="nav-name">{item.name}</div>
                        <div className="nav-desc">{item.desc}</div>
                      </div>
                      <span className="nav-arrow">›</span>
                    </Link>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Footer */}
          <div className="sidebar-footer">
            <div className="admin-card">
              <div className="admin-avatar">A</div>
              <div className="admin-info">
                <p>Administrator</p>
                <span>Super Admin</span>
              </div>
            </div>

            <button className="logout-btn" onClick={handleAdminLogout}>
              <span className="logout-icon">🚪</span>
              Sign Out
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
