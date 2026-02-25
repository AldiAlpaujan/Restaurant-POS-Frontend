import * as React from 'react';

export function useMatchWidth(width: number) {
  const [isMatch, setIsMatch] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${width - 1}px)`);
    const onChange = () => {
      setIsMatch(window.innerWidth < width);
    };
    mql.addEventListener('change', onChange);
    setIsMatch(window.innerWidth < width);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isMatch;
}
