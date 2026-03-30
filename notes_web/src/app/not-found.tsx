import React from 'react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="appShell">
            <header className="topBar">
                <div className="topBarInner">
                    <div className="brand">
                        <div className="brandTitle">Retro Notes</div>
                        <div className="brandSubtitle">404</div>
                    </div>
                </div>
            </header>

            <div className="container">
                <section className="panel" role="alert" aria-live="assertive">
                    <header className="panelHeader">
                        <div className="panelTitle">Page not found</div>
                    </header>
                    <div className="panelBody">
                        <p className="callout">The page you’re looking for doesn’t exist.</p>
                        <div style={{ height: 12 }} />
                        <Link className="btn btnPrimary" href="/">
                            Back to app
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}
