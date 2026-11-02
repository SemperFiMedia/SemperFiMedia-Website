'use client';

import { useEffect, useState, type ReactNode } from 'react';

type Tab = {
  id: string;
  label: string;
  count: number;
  content: ReactNode;
};

type Props = {
  tabs: Tab[];
};

export function FilmmakingTabs({ tabs }: Props) {
  const [activeId, setActiveId] = useState<string>(tabs[0]?.id ?? '');

  // Deep links like /filmmaking#short-films open straight to that tab.
  useEffect(() => {
    const fromHash = window.location.hash.slice(1);
    if (tabs.some((t) => t.id === fromHash)) setActiveId(fromHash);
  }, [tabs]);

  function select(id: string) {
    setActiveId(id);
    history.replaceState(null, '', `#${id}`);
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filmmaking categories"
        className="flex gap-2 overflow-x-auto whitespace-nowrap pb-2"
      >
        {tabs.map((tab) => {
          const active = tab.id === activeId;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={active}
              aria-controls={`panel-${tab.id}`}
              onClick={() => select(tab.id)}
              className={`flex-shrink-0 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors ${
                active
                  ? 'border-brass bg-brass/15 text-brass'
                  : 'border-bone/15 text-bone-muted hover:border-brass/60 hover:text-bone'
              }`}
            >
              {tab.label}
              {tab.count > 0 && <span className="ml-2 text-bone-subtle">{tab.count}</span>}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={tab.id !== activeId}
          className="mt-10"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
