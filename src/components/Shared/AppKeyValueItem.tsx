import type { ReactNode } from 'react';
import { Children, cloneElement, isValidElement } from 'react';
import { useElementSize } from '@mantine/hooks';

interface AppKeyValueFormProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

const AppKeyValueForm = ({ title, children, className }: AppKeyValueFormProps) => {
  const { ref, width } = useElementSize();

  // Updated breakpoints: 3 cols at 768px, 2 cols at 548px
  const cols = width >= 768 ? 3 : width >= 548 ? 2 : 1;

  const childrenArray = Children.toArray(children);
  const enhancedChildren = childrenArray.map((child, index) => {
    if (isValidElement(child)) {
      const hasItemBelow = index + cols < childrenArray.length;
      return cloneElement(child, { hasItemBelow } as any);
    }
    return child;
  });

  return (
    <div className={`flex flex-col gap-2`}>
      {title ? <KeyValueItemLabel label={title} /> : null}
      <div
        ref={ref}
        className={`grid gap-x-4 gap-y-2 ${className}`}
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {enhancedChildren}
      </div>
    </div>
  );
};

interface KeyValueItemProps {
  label: string;
  withAsterisk?: boolean;
  children: ReactNode;
  hasItemBelow?: boolean;
  onClick?: () => void;
}

const KeyValueItem = ({
  label,
  children,
  withAsterisk,
  hasItemBelow,
  onClick,
}: KeyValueItemProps) => {
  return (
    <div
      onClick={onClick}
      className={`flex h-full flex-col justify-between ${onClick && 'cursor-pointer'}`}
    >
      <div>
        <div className="mb-1 flex items-center">
          <span className="text-title text-base font-bold">
            {label}
            {withAsterisk && <span className="ml-1 text-red-500">*</span>}
          </span>
        </div>

        <div className="text-secondary text-sm">{children}</div>
      </div>

      {/* Hide divider if there's no item below */}
      <hr className={`mt-2.5 border-dashed border-gray-300 ${!hasItemBelow ? 'hidden' : ''} `} />
    </div>
  );
};

AppKeyValueForm.KeyValueItem = KeyValueItem;

const KeyValueItemLabel = ({ label }: { label: string | ReactNode }) => {
  return <span className="text-sm font-bold">{label}</span>;
};

export default AppKeyValueForm;
