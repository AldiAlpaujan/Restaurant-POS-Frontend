import { Children, isValidElement, type ReactNode } from 'react';

export default function AppTimeline(props: { children: ReactNode }) {
  const childrenArray = Children.toArray(props.children);

  return (
    <div className="relative grid w-full grid-cols-[auto_1fr] gap-0 sm:grid-cols-[1fr_auto_1fr]">
      {childrenArray.map((item, index) => {
        const isRight = index % 2 !== 0;
        const isLast = index === childrenArray.length - 1;

        let color = '#339AF0';
        if (isValidElement<ItemProps>(item)) {
          color = item.props.color || color;
        }

        return (
          <>
            {/* Right Cell */}
            <div
              key={`left-${index}`}
              className={'hidden flex-col items-end justify-end px-4 text-end sm:flex'}
            >
              {isRight && item}
            </div>

            {/* Center Indicator */}
            <div key={`center-${index}`} className="relative flex w-8 items-start justify-center">
              {!isLast && (
                <div
                  className="bg absolute inset-0 left-1/2 top-1 w-1 -translate-x-1/2 bg-gray-300"
                  style={{ backgroundColor: color }}
                />
              )}
              <div
                className="z-10 size-6 rounded-full border-4 border-white bg-white shadow"
                style={{ borderColor: color }}
              />
            </div>

            {/* Left Cell */}
            <div key={`right-${index}`} className={'mb-4 flex px-4 sm:mb-0'}>
              <span className="sm:hidden">{item}</span>
              <span className="hidden sm:block">{!isRight && item}</span>
            </div>
          </>
        );
      })}
    </div>
  );
}

interface ItemProps {
  color: string;
  children: ReactNode;
}

function Item(props: ItemProps) {
  return <div className="flex flex-col gap-1">{props.children}</div>;
}

AppTimeline.Item = Item;
