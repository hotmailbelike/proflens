const PORTFOLIO_URL = 'https://abdullah-omar-portfolio.netlify.app/';
const SOURCE_URL = 'https://github.com/hotmailbelike/proflens';

export function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="app-footer__links">
        <p>
          Built by{' '}
          <a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer">
            Abdullah Omar
          </a>
        </p>
        <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer">
          Source
        </a>
      </div>
      <p className="app-footer__note">All professors and universities here are fictional.</p>
    </footer>
  );
}
