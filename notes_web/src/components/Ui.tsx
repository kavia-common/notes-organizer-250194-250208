'use client';

import React from 'react';

type ButtonVariant = 'default' | 'primary' | 'danger' | 'ghost';

/**
 * PUBLIC_INTERFACE
 * Styled button using global retro theme classes.
 */
export function Button({
    children,
    variant = 'default',
    disabled,
    type = 'button',
    onClick,
}: {
    children: React.ReactNode;
    variant?: ButtonVariant;
    disabled?: boolean;
    type?: 'button' | 'submit';
    onClick?: () => void;
}) {
    const cls = [
        'btn',
        variant === 'primary' ? 'btnPrimary' : '',
        variant === 'danger' ? 'btnDanger' : '',
        variant === 'ghost' ? 'btnGhost' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button className={cls} disabled={disabled} type={type} onClick={onClick}>
            {children}
        </button>
    );
}

/**
 * PUBLIC_INTERFACE
 * Panel container.
 */
export function Panel({
    title,
    right,
    children,
}: {
    title: string;
    right?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="panel">
            <header className="panelHeader">
                <div className="panelTitle">{title}</div>
                {right ? <div className="row">{right}</div> : null}
            </header>
            <div className="panelBody">{children}</div>
        </section>
    );
}

/**
 * PUBLIC_INTERFACE
 * Callout message for empty/loading/error states.
 */
export function Callout({
    variant = 'default',
    children,
}: {
    variant?: 'default' | 'error' | 'success';
    children: React.ReactNode;
}) {
    const cls = [
        'callout',
        variant === 'error' ? 'calloutError' : '',
        variant === 'success' ? 'calloutSuccess' : '',
    ]
        .filter(Boolean)
        .join(' ');
    return <div className={cls}>{children}</div>;
}

/**
 * PUBLIC_INTERFACE
 * Pill for tags/filters.
 */
export function Pill({
    active,
    children,
    onClick,
}: {
    active?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
}) {
    const cls = ['pill', 'pillBtn', active ? 'pillActive' : ''].filter(Boolean).join(' ');
    return (
        <span className={cls} role="button" tabIndex={0} onClick={onClick} onKeyDown={() => {}}>
            {children}
        </span>
    );
}
