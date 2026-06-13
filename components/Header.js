import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header
      id="app-header"
      style={{
        display: 'none', /* Header di-replace oleh topbar di AppShell */
      }}
      aria-hidden="true"
    >
      {/* Minimal header — ghost, sidebar + topbar handle navigation */}
    </header>
  );
}
