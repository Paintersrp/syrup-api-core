import React from 'react';

type LinkProps = {
  to: string;
  query?: string | string[][] | Record<string, string> | URLSearchParams | undefined;
  children?: React.ReactNode;
};

export const Link: React.FC<LinkProps> = ({ to, query, children }) => {
  const onClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const url = query ? `${to}?${new URLSearchParams(query).toString()}` : to;
    window.history.pushState({}, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <a href={to} onClick={onClick}>
      {children}
    </a>
  );
};
