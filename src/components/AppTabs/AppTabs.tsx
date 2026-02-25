import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { FloatingIndicator, UnstyledButton } from '@mantine/core';
import classes from './style.module.css';

interface AppTabsProps {
  tabs: string[];
  children: ReactNode;
  onInit?: (controller: AppTabsController) => void;
}

export interface AppTabsController {
  changeActive: (value: string) => void;
}

interface ProviderValue {
  tabs: string[];
  rootRef: HTMLDivElement | null;
  controlsRefs: Record<string, HTMLButtonElement | null>;
  active: number;

  setRootRef: (value: HTMLDivElement | null) => void;
  setControlsRefs: (value: Record<string, HTMLButtonElement | null>) => void;
  setActive: (value: number) => void;
  setControlRef: (index: number) => (node: HTMLButtonElement) => void;
}

const AppTabsContext = createContext<ProviderValue | null>(null);
export default function AppTabs({ tabs, children, onInit }: AppTabsProps) {
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});
  const [active, setActive] = useState(0);

  const setControlRef = (index: number) => (node: HTMLButtonElement) => {
    setControlsRefs((prev) => ({
      ...prev,
      [index]: node,
    }));
  };

  function changeActive(value: string) {
    setActive(tabs.indexOf(value));
  }

  useEffect(() => {
    onInit?.({ changeActive });
  }, []);

  return (
    <AppTabsContext.Provider
      value={{
        tabs,
        rootRef,
        controlsRefs,
        active,
        setRootRef,
        setControlsRefs,
        setActive,
        setControlRef,
      }}
    >
      <main className="flex h-full flex-col">{children}</main>
    </AppTabsContext.Provider>
  );
}

function Tab(props: { className?: string }) {
  const { tabs, active, rootRef, controlsRefs, setRootRef, setControlRef, setActive } =
    useContext(AppTabsContext)!;

  const controls = tabs.map((item, index) => (
    <UnstyledButton
      key={item}
      className={classes.control}
      ref={setControlRef(index)}
      onClick={() => setActive(index)}
      mod={{ active: active === index }}
    >
      <span className={classes.controlLabel}>{item}</span>
    </UnstyledButton>
  ));

  return (
    <div className={props.className}>
      <div className={classes.root} ref={setRootRef}>
        {controls}
        <FloatingIndicator
          target={controlsRefs[active]}
          parent={rootRef}
          className={classes.indicator}
        />
      </div>
    </div>
  );
}

function Pannel(props: { value: string; children: ReactNode }) {
  const { tabs, active } = useContext(AppTabsContext)!;
  const isActive = props.value === tabs[active];

  return (
    <div className="h-full flex-1 overflow-auto" style={{ display: isActive ? 'block' : 'none' }}>
      {props.children}
    </div>
  );
}

AppTabs.Tab = Tab;
AppTabs.Pannel = Pannel;
