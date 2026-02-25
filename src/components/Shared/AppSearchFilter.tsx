import { useRef, useState, type ChangeEvent } from 'react';
import { ActionIcon, Input } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { debounce } from '@/lib/function';

export default function AppSearchFilter(props: { onChange: (v: string) => void }) {
  const [value, setValue] = useState('');
  const [isSearchMode, setSearchMode] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedOnChange = debounce((value: string) => {
    props.onChange(value);
  });

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    debouncedOnChange(event.target.value);
  };

  const toggleSearchMode = () => {
    setSearchMode(!isSearchMode);

    if (isSearchMode === false) {
      inputRef.current!.focus();
    } else {
      setValue('');
      props.onChange('');
    }
  };

  return (
    <div className="xs:w-fit flex h-fit w-full items-center justify-end gap-2.5">
      <Input
        value={value}
        data-show={isSearchMode}
        ref={inputRef}
        placeholder="Search"
        onChange={onChange}
        classNames={{
          input:
            ' ml-auto transition-all duration-300 ease-in-out [&:not([data-show=true])]:w-0 [&:not([data-show=true])]:p-0 [&:not([data-show=true])]:opacity-0',
        }}
      />
      <ActionIcon variant="light" size={'lg'} onClick={toggleSearchMode}>
        {isSearchMode ? <IconX size={20} /> : <IconSearch size={20} />}
      </ActionIcon>
    </div>
  );
}
