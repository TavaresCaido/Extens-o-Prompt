export function TopBar({ currentRoute, onNavigate, theme, onToggleTheme, onOpenShortcuts }) {
  return (
    <header className="topbar-header" role="banner">
      <div className="topbar-brand">
        <span className="brand-logo">⚡</span>
        <div className="brand-text-wrap">
          <span className="brand-title">Workshop Prompts em JSON</span>
          <span className="brand-tag">35-45 min · Interativo</span>
        </div>
      </div>

      <nav className="topbar-nav" role="navigation" aria-label="Navegação principal">
        <button
          type="button"
          className={`topbar-nav-btn ${currentRoute === 'presentation' ? 'active' : ''}`}
          onClick={() => onNavigate('presentation')}
          aria-current={currentRoute === 'presentation' ? 'page' : undefined}
        >
          📽️ Apresentação
        </button>

        <button
          type="button"
          className={`topbar-nav-btn ${currentRoute === 'activity' ? 'active' : ''}`}
          onClick={() => onNavigate('activity')}
          aria-current={currentRoute === 'activity' ? 'page' : undefined}
        >
          🧪 Atividade Prática
        </button>
      </nav>

      <div className="topbar-actions">
        <button
          type="button"
          className="topbar-action-btn"
          onClick={onOpenShortcuts}
          title="Ver atalhos de teclado"
          aria-label="Atalhos de teclado"
        >
          ⌨️ <span className="hide-on-mobile">Atalhos</span>
        </button>

        <button
          type="button"
          className="topbar-action-btn theme-toggle-btn"
          onClick={onToggleTheme}
          title={`Alternar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
          aria-label={`Alternar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
        >
          {theme === 'dark' ? '☀️ Claro' : '🌙 Escuro'}
        </button>
      </div>
    </header>
  );
}
