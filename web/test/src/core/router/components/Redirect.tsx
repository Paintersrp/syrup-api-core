import React, { useEffect } from 'react';

type RedirectProps = {
  to: string;
};

export const Redirect: React.FC<RedirectProps> = ({ to }) => {
  useEffect(() => {
    window.history.pushState({}, '', to);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, [to]);

  return null;
};
