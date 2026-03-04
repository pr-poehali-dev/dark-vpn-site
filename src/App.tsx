import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";

const BG_IMAGE = "https://cdn.poehali.dev/projects/73046731-e209-4bd8-946f-e86b8df82454/files/00222959-bcaf-4823-893f-532a2667c20f.jpg";

type Page = "home" | "blocks" | "stats" | "about" | "profile";
type BlockKey = "youtube" | "discord" | "telegram" | "tiktok" | "instagram";

interface BlockInfo {
  key: BlockKey;
  label: string;
  icon: string;
  color: string;
  description: string;
}

const BLOCKS: BlockInfo[] = [
  { key: "youtube", label: "БЛОКИРОВКА ЮТУБ", icon: "Youtube", color: "#FF0000", description: "Обход блокировки YouTube — смотри видео без ограничений" },
  { key: "discord", label: "БЛОКИРОВКА ДИСКОРД", icon: "MessageSquare", color: "#5865F2", description: "Разблокируй Discord — общайся с сообществом свободно" },
  { key: "telegram", label: "БЛОКИРОВКА ТГ", icon: "Send", color: "#2AABEE", description: "Обход блокировки Telegram — сообщения без цензуры" },
  { key: "tiktok", label: "БЛОКИРОВКА ТИКТОКА", icon: "Music", color: "#FF0050", description: "Разблокируй TikTok — контент без границ" },
  { key: "instagram", label: "БЛОКИРОВКА ИНСТАГРАММА", icon: "Instagram", color: "#E1306C", description: "Обход блокировки Instagram — фото и Stories снова доступны" },
];

interface VpnState {
  active: boolean;
  startTime: number | null;
  elapsed: number;
}

type VpnStates = Record<BlockKey, VpnState>;

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function AnonMask({ size = 48, active = false }: { size?: number; active?: boolean }) {
  return (
    <span style={{ fontSize: size, filter: active ? "drop-shadow(0 0 12px #00e5c8)" : "none", transition: "filter 0.3s" }}>
      🎭
    </span>
  );
}

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [page, setPage] = useState<Page>("home");
  const [activeBlock, setActiveBlock] = useState<BlockKey>("youtube");
  const [vpn, setVpn] = useState<VpnStates>({
    youtube: { active: false, startTime: null, elapsed: 0 },
    discord: { active: false, startTime: null, elapsed: 0 },
    telegram: { active: false, startTime: null, elapsed: 0 },
    tiktok: { active: false, startTime: null, elapsed: 0 },
    instagram: { active: false, startTime: null, elapsed: 0 },
  });
  const [user, setUser] = useState({ name: "Пользователь", email: "" });
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setVpn(prev => {
        const next = { ...prev };
        (Object.keys(next) as BlockKey[]).forEach(k => {
          if (next[k].active && next[k].startTime) {
            next[k] = { ...next[k], elapsed: Math.floor((Date.now() - next[k].startTime!) / 1000) };
          }
        });
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formData.email || !formData.password) { setError("Заполните все поля"); return; }
    if (!isLogin && !formData.name) { setError("Введите имя"); return; }
    if (formData.password.length < 6) { setError("Пароль должен быть не менее 6 символов"); return; }
    setUser({ name: formData.name || "Агент", email: formData.email });
    setIsAuth(true);
  };

  const toggleVpn = useCallback((key: BlockKey) => {
    setVpn(prev => {
      const cur = prev[key];
      if (cur.active) {
        return { ...prev, [key]: { active: false, startTime: null, elapsed: 0 } };
      } else {
        return { ...prev, [key]: { active: true, startTime: Date.now(), elapsed: 0 } };
      }
    });
  }, []);

  const totalActive = Object.values(vpn).filter(v => v.active).length;
  const totalTime = Object.values(vpn).reduce((sum, v) => sum + v.elapsed, 0);

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${BG_IMAGE})`, filter: "blur(6px) brightness(0.25)" }}
        />
        <div className="absolute inset-0 scanline pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

        <div className="relative z-10 w-full max-w-md px-4 animate-slide-up">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-4xl">🎭</span>
              <h1 className="font-display text-5xl font-bold text-white tracking-widest text-glow">
                KILL<span style={{ color: "#00e5c8" }}>VPN</span>
              </h1>
            </div>
            <p className="text-muted-foreground font-body text-sm tracking-widest uppercase">
              Анонимность. Свобода. Защита.
            </p>
          </div>

          <div className="bg-glass border border-border rounded-xl p-8">
            <div className="flex mb-6 bg-muted rounded-lg p-1">
              <button
                onClick={() => { setIsLogin(true); setError(""); }}
                className={`flex-1 py-2 rounded-md font-display tracking-wider text-sm font-medium transition-all ${isLogin ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
              >
                ВХОД
              </button>
              <button
                onClick={() => { setIsLogin(false); setError(""); }}
                className={`flex-1 py-2 rounded-md font-display tracking-wider text-sm font-medium transition-all ${!isLogin ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
              >
                РЕГИСТРАЦИЯ
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <div className="animate-fade-in">
                  <label className="block text-xs font-body tracking-widest text-muted-foreground uppercase mb-1">Имя агента</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="Введите имя"
                    className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground font-body text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-body tracking-widest text-muted-foreground uppercase mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                  placeholder="agent@killvpn.com"
                  className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground font-body text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-xs font-body tracking-widest text-muted-foreground uppercase mb-1">Пароль</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground font-body text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
                />
              </div>

              {error && (
                <div className="text-red-400 text-xs font-body bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2 animate-fade-in">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-lg font-display tracking-widest text-sm font-medium transition-all duration-300 hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg, #00e5c8, #00a896)", color: "#050a0f" }}
              >
                {isLogin ? "ВОЙТИ В СИСТЕМУ" : "СОЗДАТЬ АККАУНТ"}
              </button>
            </form>
          </div>

          <p className="text-center text-muted-foreground text-xs font-body mt-4 tracking-wider">
            Защищено протоколом KILLVPN v2.0
          </p>
        </div>
      </div>
    );
  }

  const navItems: { id: Page; label: string; icon: string }[] = [
    { id: "home", label: "ГЛАВНАЯ", icon: "Home" },
    { id: "blocks", label: "БЛОКИРОВКИ", icon: "Shield" },
    { id: "stats", label: "ПАНЕЛЬ", icon: "BarChart3" },
    { id: "about", label: "О СЕРВИСЕ", icon: "Info" },
    { id: "profile", label: "ПРОФИЛЬ", icon: "User" },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${BG_IMAGE})`, filter: "blur(8px) brightness(0.15)", transform: "scale(1.05)" }}
      />
      <div className="fixed inset-0 scanline pointer-events-none z-0" />
      <div className="fixed inset-0 bg-gradient-to-br from-black/70 via-[#060d14]/60 to-black/80 z-0" />

      {/* Header */}
      <header className="relative z-20 bg-glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎭</span>
            <span className="font-display text-2xl font-bold tracking-widest text-white">
              KILL<span style={{ color: "#00e5c8" }}>VPN</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`px-4 py-2 rounded-lg font-display text-xs tracking-widest transition-all duration-200 flex items-center gap-2 ${page === item.id ? "text-primary border border-primary/30 bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
              >
                <Icon name={item.icon} size={14} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {totalActive > 0 && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border animate-fade-in" style={{ borderColor: "#00e5c8", background: "rgba(0,229,200,0.08)" }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00e5c8" }} />
                <span className="font-body text-xs" style={{ color: "#00e5c8" }}>{totalActive} активно</span>
              </div>
            )}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden text-muted-foreground hover:text-foreground"
            >
              <Icon name="Menu" size={20} />
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="md:hidden bg-glass border-t border-border px-4 py-3 flex flex-col gap-1 animate-fade-in">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setPage(item.id); setMobileMenu(false); }}
                className={`px-4 py-3 rounded-lg font-display text-xs tracking-widest transition-all flex items-center gap-3 ${page === item.id ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
              >
                <Icon name={item.icon} size={16} />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 py-8">

        {/* HOME */}
        {page === "home" && (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <AnonMask size={80} active={totalActive > 0} />
              </div>
              <h1 className="font-display text-6xl md:text-8xl font-bold text-white tracking-widest mb-4">
                KILL<span style={{ color: "#00e5c8" }}>VPN</span>
              </h1>
              <p className="font-body text-muted-foreground text-lg tracking-widest uppercase mb-2">
                Система обхода блокировок
              </p>
              <p className="font-body text-muted-foreground/60 text-sm max-w-md mx-auto">
                Профессиональный инструмент для защиты вашей приватности и свободного доступа к заблокированным ресурсам
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { label: "Активных VPN", value: totalActive.toString(), icon: "Shield" },
                { label: "Время защиты", value: formatTime(totalTime), icon: "Clock" },
                { label: "Доступных каналов", value: "5", icon: "Zap" },
              ].map((stat, i) => (
                <div key={i} className="bg-glass border border-border rounded-xl p-5 text-center">
                  <Icon name={stat.icon} size={24} className="mx-auto mb-2 text-primary" />
                  <div className="font-display text-3xl font-bold text-white mb-1" style={stat.label === "Время защиты" && totalTime > 0 ? { color: "#00e5c8" } : {}}>
                    {stat.value}
                  </div>
                  <div className="font-body text-xs text-muted-foreground tracking-wider uppercase">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Online counter */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 animate-fade-in">
              <div className="flex items-center gap-3 px-6 py-3 rounded-full border" style={{ borderColor: "rgba(0,229,200,0.3)", background: "rgba(0,229,200,0.06)" }}>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#00e5c8" }} />
                  <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: "#00e5c8" }} />
                </span>
                <span className="font-display text-sm tracking-wider" style={{ color: "#00e5c8" }}>
                  2 300 567
                </span>
                <span className="font-body text-sm text-muted-foreground">человек сейчас онлайн</span>
              </div>
            </div>

            {/* Telegram Bot */}
            <div className="mb-8 bg-glass border rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5 animate-fade-in" style={{ borderColor: "rgba(42,171,238,0.25)", background: "linear-gradient(135deg, rgba(42,171,238,0.06), rgba(0,0,0,0))" }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(42,171,238,0.15)", border: "1px solid rgba(42,171,238,0.3)" }}>
                <span className="text-3xl">✈️</span>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <span className="font-display text-lg font-bold text-white tracking-wider">KILLVPN Bot</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-body" style={{ background: "rgba(42,171,238,0.15)", color: "#2AABEE", border: "1px solid rgba(42,171,238,0.3)" }}>Telegram</span>
                </div>
                <p className="font-body text-sm text-muted-foreground mb-3">
                  Управляй VPN прямо из Telegram — быстро, удобно, без лишних шагов. Получай уведомления и ключи доступа в один клик.
                </p>
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start text-xs font-body text-muted-foreground">
                  {["Мгновенные уведомления", "Управление ключами", "Статус защиты"].map((f, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <Icon name="Check" size={11} className="text-primary" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
              <a
                href="https://t.me/killlvpn_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl font-display text-sm tracking-wider font-medium transition-all duration-300 hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg, #2AABEE, #1a8bbf)", color: "#fff" }}
              >
                <Icon name="Send" size={16} />
                ОТКРЫТЬ БОТА
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {BLOCKS.map((b, i) => (
                <button
                  key={b.key}
                  onClick={() => { setPage("blocks"); setActiveBlock(b.key); }}
                  className="bg-glass border border-border rounded-xl p-4 text-left hover:border-primary/50 transition-all duration-300 group"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${b.color}22` }}>
                      <Icon name={b.icon} size={16} style={{ color: b.color }} />
                    </div>
                    {vpn[b.key].active && (
                      <span className="ml-auto flex items-center gap-1 text-xs font-body" style={{ color: "#00e5c8" }}>
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00e5c8" }} />
                        {formatTime(vpn[b.key].elapsed)}
                      </span>
                    )}
                  </div>
                  <div className="font-display text-xs text-white tracking-wider group-hover:text-primary transition-colors">
                    {b.label}
                  </div>
                </button>
              ))}
              <button
                onClick={() => setPage("blocks")}
                className="bg-glass border border-dashed border-border rounded-xl p-4 text-center hover:border-primary/50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Icon name="Plus" size={16} className="text-muted-foreground" />
                <span className="font-display text-xs text-muted-foreground tracking-wider">ВСЕ БЛОКИРОВКИ</span>
              </button>
            </div>
          </div>
        )}

        {/* BLOCKS */}
        {page === "blocks" && (
          <div className="animate-fade-in">
            <h2 className="font-display text-3xl font-bold text-white tracking-widest mb-2">УПРАВЛЕНИЕ БЛОКИРОВКАМИ</h2>
            <p className="font-body text-muted-foreground text-sm mb-8">Выберите сервис и активируйте обход блокировки</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {BLOCKS.map(b => (
                <button
                  key={b.key}
                  onClick={() => setActiveBlock(b.key)}
                  className={`px-4 py-2 rounded-lg font-display text-xs tracking-wider transition-all duration-200 flex items-center gap-2 ${activeBlock === b.key ? "border" : "bg-muted text-muted-foreground hover:text-foreground"}`}
                  style={activeBlock === b.key ? { borderColor: b.color, color: b.color, background: `${b.color}15` } : {}}
                >
                  <Icon name={b.icon} size={12} />
                  {b.key.toUpperCase()}
                  {vpn[b.key].active && <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#00e5c8" }} />}
                </button>
              ))}
            </div>

            {BLOCKS.filter(b => b.key === activeBlock).map(b => (
              <div key={b.key} className="bg-glass border border-border rounded-2xl overflow-hidden animate-fade-in">
                <div className="p-6 border-b border-border" style={{ background: `linear-gradient(135deg, ${b.color}08, transparent)` }}>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${b.color}20`, border: `1px solid ${b.color}40` }}>
                      <Icon name={b.icon} size={28} style={{ color: b.color }} />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-bold text-white tracking-wider">{b.label}</h3>
                      <p className="font-body text-sm text-muted-foreground mt-0.5">{b.description}</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 flex flex-col items-center">
                  <button
                    onClick={() => toggleVpn(b.key)}
                    className="relative group mb-8"
                  >
                    <div
                      className="w-40 h-40 rounded-full flex flex-col items-center justify-center transition-all duration-500 border-2"
                      style={{
                        background: vpn[b.key].active
                          ? "radial-gradient(circle, rgba(0,229,200,0.2) 0%, rgba(0,229,200,0.05) 100%)"
                          : "radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.3) 100%)",
                        borderColor: vpn[b.key].active ? "#00e5c8" : "#2a3444",
                        boxShadow: vpn[b.key].active ? "0 0 40px rgba(0,229,200,0.4), 0 0 80px rgba(0,229,200,0.15)" : "none",
                      }}
                    >
                      <AnonMask size={64} active={vpn[b.key].active} />
                      <span
                        className="font-display text-xs tracking-widest mt-2 font-semibold transition-colors"
                        style={{ color: vpn[b.key].active ? "#00e5c8" : "#6b7a90" }}
                      >
                        {vpn[b.key].active ? "АКТИВЕН" : "ВКЛЮЧИТЬ"}
                      </span>
                    </div>
                  </button>

                  {vpn[b.key].active ? (
                    <div className="text-center animate-fade-in w-full">
                      <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border mb-4" style={{ borderColor: "#00e5c8", background: "rgba(0,229,200,0.08)" }}>
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00e5c8" }} />
                        <span className="font-body text-sm font-medium" style={{ color: "#00e5c8" }}>VPN ВКЛЮЧЁН</span>
                      </div>
                      <div className="font-display text-5xl font-bold timer-active mb-1">
                        {formatTime(vpn[b.key].elapsed)}
                      </div>
                      <div className="font-body text-xs text-muted-foreground tracking-widest uppercase">Время работы</div>
                      <button
                        onClick={() => toggleVpn(b.key)}
                        className="mt-6 px-8 py-2 rounded-lg font-display text-xs tracking-widest border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        ОТКЛЮЧИТЬ VPN
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="font-body text-sm text-muted-foreground mb-4">
                        Нажмите на маску чтобы активировать защиту
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs text-muted-foreground font-body">
                        {["256-bit шифрование", "Без логов", "Мгновенное подключение"].map((f, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <Icon name="Check" size={12} className="text-primary" />
                            {f}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STATS */}
        {page === "stats" && (
          <div className="animate-fade-in">
            <h2 className="font-display text-3xl font-bold text-white tracking-widest mb-2">ПАНЕЛЬ УПРАВЛЕНИЯ</h2>
            <p className="font-body text-muted-foreground text-sm mb-8">Статистика использования KILLVPN</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Активных каналов", value: totalActive, icon: "Shield", color: "#00e5c8" },
                { label: "Общее время", value: formatTime(totalTime), icon: "Clock", color: "#00e5c8" },
                { label: "Заблокировано угроз", value: "1 337", icon: "AlertTriangle", color: "#f59e0b" },
                { label: "Защищённых сессий", value: "42", icon: "Lock", color: "#00e5c8" },
              ].map((s, i) => (
                <div key={i} className="bg-glass border border-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <Icon name={s.icon} size={18} style={{ color: s.color }} />
                    {totalActive > 0 && i === 0 && <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00e5c8" }} />}
                  </div>
                  <div className="font-display text-2xl font-bold text-white mb-1">
                    {s.value}
                  </div>
                  <div className="font-body text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-glass border border-border rounded-xl p-6 mb-4">
              <h3 className="font-display text-lg font-semibold text-white tracking-wider mb-4">СТАТУС КАНАЛОВ</h3>
              <div className="space-y-3">
                {BLOCKS.map(b => (
                  <div key={b.key} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${b.color}18` }}>
                      <Icon name={b.icon} size={14} style={{ color: b.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-body text-xs text-foreground">{b.label}</span>
                        <span className="font-body text-xs" style={{ color: vpn[b.key].active ? "#00e5c8" : "#6b7a90" }}>
                          {vpn[b.key].active ? formatTime(vpn[b.key].elapsed) : "Неактивно"}
                        </span>
                      </div>
                      <div className="h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: vpn[b.key].active ? `${Math.min(100, (vpn[b.key].elapsed / 3600) * 100 + 15)}%` : "0%",
                            background: vpn[b.key].active ? "linear-gradient(90deg, #00e5c8, #00b8a0)" : "transparent",
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: vpn[b.key].active ? "#00e5c8" : "#2a3444" }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ABOUT */}
        {page === "about" && (
          <div className="animate-fade-in max-w-2xl">
            <h2 className="font-display text-3xl font-bold text-white tracking-widest mb-2">О СЕРВИСЕ</h2>
            <p className="font-body text-muted-foreground text-sm mb-8">KILLVPN — ваш щит в цифровом пространстве</p>

            <div className="space-y-4">
              {[
                { icon: "Shield", title: "Максимальная защита", text: "Военное шифрование AES-256 защищает все ваши данные и трафик от слежки и перехвата." },
                { icon: "Eye", title: "Полная анонимность", text: "Мы не храним логи. Ваша активность в интернете — только ваше дело. Никаких следов." },
                { icon: "Zap", title: "Мгновенное подключение", text: "Обходите блокировки за секунды. Поддержка YouTube, Discord, Telegram, TikTok и Instagram." },
                { icon: "Globe", title: "Без границ", text: "Доступ к любому контенту из любой точки мира. Интернет без цензуры и ограничений." },
              ].map((item, i) => (
                <div key={i} className="bg-glass border border-border rounded-xl p-5 flex gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(0,229,200,0.12)", border: "1px solid rgba(0,229,200,0.2)" }}>
                    <Icon name={item.icon} size={18} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-semibold text-white tracking-wider mb-1">{item.title}</h4>
                    <p className="font-body text-sm text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-glass border rounded-xl p-5" style={{ borderColor: "rgba(0,229,200,0.2)" }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🎭</span>
                <span className="font-display text-sm font-bold text-white tracking-wider">KILLVPN v2.0</span>
              </div>
              <p className="font-body text-xs text-muted-foreground">Версия протокола: 2.0 · Шифрование: AES-256 · Политика: No-log</p>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {page === "profile" && (
          <div className="animate-fade-in max-w-lg">
            <h2 className="font-display text-3xl font-bold text-white tracking-widest mb-2">ПРОФИЛЬ</h2>
            <p className="font-body text-muted-foreground text-sm mb-8">Ваши данные агента</p>

            <div className="bg-glass border border-border rounded-2xl overflow-hidden">
              <div className="p-8 text-center border-b border-border" style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,229,200,0.08), transparent 70%)" }}>
                <div className="flex justify-center mb-4">
                  <AnonMask size={72} active={totalActive > 0} />
                </div>
                <h3 className="font-display text-2xl font-bold text-white tracking-wider">{user.name || "Агент"}</h3>
                <p className="font-body text-sm text-muted-foreground mt-1">{user.email}</p>
                {totalActive > 0 && (
                  <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full text-xs font-body" style={{ color: "#00e5c8", background: "rgba(0,229,200,0.1)", border: "1px solid rgba(0,229,200,0.2)" }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00e5c8" }} /> VPN АКТИВЕН
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                {[
                  { label: "Статус аккаунта", value: "Активен", icon: "CheckCircle" },
                  { label: "Активных VPN", value: `${totalActive} из 5`, icon: "Shield" },
                  { label: "Общее время защиты", value: formatTime(totalTime), icon: "Clock" },
                  { label: "Тарифный план", value: "KILLVPN PRO", icon: "Zap" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <Icon name={item.icon} size={16} className="text-muted-foreground" />
                      <span className="font-body text-sm text-muted-foreground">{item.label}</span>
                    </div>
                    <span className="font-display text-sm text-white tracking-wider">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => { setIsAuth(false); setFormData({ name: "", email: "", password: "" }); }}
                  className="w-full py-3 rounded-lg font-display text-xs tracking-widest border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
                >
                  ВЫЙТИ ИЗ АККАУНТА
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-glass border-t border-border py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <span className="font-body text-xs text-muted-foreground">© 2024 KILLVPN. Все права защищены.</span>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: totalActive > 0 ? "#00e5c8" : "#2a3444" }} />
            <span className="font-body text-xs text-muted-foreground">
              {totalActive > 0 ? `${totalActive} канал(а) активно` : "Защита отключена"}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}