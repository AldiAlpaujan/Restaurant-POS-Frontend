import { useEffect, useState, type ReactNode } from 'react';
import {
  CheckIcon,
  Combobox,
  Group,
  Input,
  Loader,
  Pill,
  PillsInput,
  TextInput,
  useCombobox,
  type TextInputProps,
} from '@mantine/core';
import { debounce } from '@/lib/function';
import client from '@/lib/http-client';
import { parseError } from '@/lib/http-handlers';
import { toastUtils } from '@/lib/toast-utils';

export type ComboboxType = { value: any; label: string };

interface InputProps extends TextInputProps {
  prefixIcon?: ReactNode;
  isRequired?: boolean;
}

interface BaseProps extends InputProps {
  // if options is string, it will be treated as url and will be fetched
  srcOpt: ComboboxType[] | string;
  queryParam?: { [key: string]: string | undefined };
}

interface SingleProps extends Omit<BaseProps, 'value' | 'onChange' | 'defaultValue'> {
  // default / single
  isMultiple?: false;
  withSearch?: boolean;
  value?: ComboboxType | null;
  defaultValue?: ComboboxType | null;
  onChange: (v: ComboboxType | null) => void;
}

interface MultipleProps extends Omit<BaseProps, 'value' | 'onChange' | 'defaultValue'> {
  // multiple mode
  isMultiple: true;
  value?: ComboboxType[];
  defaultValue?: ComboboxType[];
  onChange: (v: ComboboxType[]) => void;
}

type AppComboboxProps = SingleProps | MultipleProps;

export default function AppCombobox(props: AppComboboxProps) {
  const combobox = useCombobox();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [options, setOptions] = useState<ComboboxType[]>([]);
  const [filteredOpt, setFilteredOpt] = useState<ComboboxType[] | null>(null);
  const [value, setValue] = useState<ComboboxType | ComboboxType[] | null>(null);
  const [isInitial, setIsInitial] = useState(true);

  async function getData(search?: string, shouldClear = false) {
    if (Array.isArray(props.srcOpt)) {
      setOptions(props.srcOpt);
    } else {
      try {
        // TODO: DELETE THIS AFTER PRODUCTION READY
        if (true) {
          setLoading(true);
          const res = await fetch(props.srcOpt);
          const data = (await res.json()) as { value: string; text: string }[];
          setLoading(false);
          setOptions(data.map((item) => ({ label: String(item.text), value: item.value })));
        }

        // setLoading(true);
        // const response = await client().get(props.srcOpt, {
        //   params: {
        //     search,
        //     ...props.queryParam,
        //   },
        // });
        // setLoading(false);
        // const data = response.data as { value: string; text: string }[];
        // setOptions(data.map((item) => ({ label: String(item.text), value: item.value })));
      } catch (e) {
        parseError(e, (err) => {
          toastUtils.error({ message: err });
        });
      }
    }
    if (isInitial) {
      const value = props.value ?? props.defaultValue;
      setValue(value ?? null);
      setIsInitial(false);
    } else {
      if (shouldClear && !props.isMultiple) {
        setValue(null);
        props.onChange(null);
      }
    }
  }

  const onSearch = debounce((value: string) => {
    if (Array.isArray(props.srcOpt)) {
      const filtered = props.srcOpt.filter((opt) =>
        opt.label.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOpt(filtered);
    } else {
      getData(value);
    }
  });

  function onSelected(val: any) {
    if (props.isMultiple) {
      const opt = (value as ComboboxType[]).some((opt) => opt.value === val);
      if (opt) {
        const newValue = (value as ComboboxType[]).filter((item) => item.value !== val);
        setValue(newValue);
        props.onChange(newValue);
      } else {
        const selectedOpt = options.find((opt) => opt.value === val)!;
        const newValue = [...(value as ComboboxType[]), selectedOpt];
        setValue(newValue);
        props.onChange(newValue);
      }
    } else {
      const selectedOpt = options.find((opt) => opt.value === val) ?? null;
      setValue(selectedOpt);
      (props.onChange as any)(selectedOpt);
      combobox.closeDropdown();
      if (search !== '') {
        setSearch('');
        setFilteredOpt(null);
        getData();
      }
    }
  }

  function handleValueRemove(opt: ComboboxType) {
    if (props.isMultiple) {
      const newValue = (value as ComboboxType[]).filter((item) => item.value !== opt.value);
      setValue(newValue);
      props.onChange(newValue);
    }
  }

  useEffect(() => {
    getData(undefined, true);
  }, [props.queryParam]);

  return (
    <Combobox store={combobox} position="bottom-start" onOptionSubmit={(val) => onSelected(val)}>
      <Combobox.Target>
        <div className="h-fit">
          {props.isMultiple ? (
            <MultipleInput
              {...props}
              value={(value as ComboboxType[]) ?? []}
              combobox={combobox}
              loading={loading}
              handleValueRemove={handleValueRemove}
            />
          ) : (
            <SingleInput
              {...props}
              value={value as ComboboxType}
              combobox={combobox}
              loading={loading}
            />
          )}
        </div>
      </Combobox.Target>

      <Combobox.Dropdown className={props.className}>
        {!props.isMultiple && props.withSearch && (
          <Combobox.Search
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              onSearch(event.target.value);
            }}
            placeholder="Searching..."
          />
        )}

        <Combobox.Options className="max-h-87.5 overflow-y-auto">
          <ComboboxOptions
            loading={loading}
            isMultiple={props.isMultiple}
            options={options}
            filteredOpt={filteredOpt}
            value={value}
          />
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

const SingleInput = (
  props: SingleProps & {
    value: ComboboxType | null;
    combobox: ReturnType<typeof useCombobox>;
    loading: boolean;
  }
) => {
  return (
    <TextInput
      pointer
      key={props.key}
      name={props.name}
      withAsterisk={props.isRequired}
      label={props.label}
      error={props.error}
      onBlur={props.onBlur}
      onFocus={props.onFocus}
      disabled={props.disabled}
      className={props.className}
      component="button"
      type="button"
      rightSectionPointerEvents="none"
      leftSection={props.prefixIcon}
      rightSection={props.loading ? <Loader size={18} /> : <Combobox.Chevron />}
      onClick={() => props.combobox.toggleDropdown()}
    >
      {props.value?.label || <Input.Placeholder>{props.placeholder}</Input.Placeholder>}
    </TextInput>
  );
};

const MultipleInput = (
  props: MultipleProps & {
    value: ComboboxType[];
    combobox: ReturnType<typeof useCombobox>;
    loading: boolean;
    handleValueRemove: (value: ComboboxType) => void;
  }
) => {
  return (
    <PillsInput
      pointer
      withAsterisk={props.isRequired}
      label={props.label}
      error={props.error}
      onBlur={props.onBlur}
      onFocus={props.onFocus}
      leftSection={props.prefixIcon}
      disabled={props.disabled}
      rightSection={props.loading ? <Loader size={18} /> : <Combobox.Chevron />}
      onClick={() => props.combobox.toggleDropdown()}
      className={props.className}
    >
      <Pill.Group>
        {props.value.length > 0 ? (
          props.value.map((item) => (
            <Pill key={item.value} withRemoveButton onRemove={() => props.handleValueRemove(item)}>
              {item.label}
            </Pill>
          ))
        ) : (
          <Input.Placeholder className="mt-0.5">{props.placeholder}</Input.Placeholder>
        )}

        <Combobox.EventsTarget>
          <PillsInput.Field
            type="hidden"
            onBlur={() => props.combobox.closeDropdown()}
            onKeyDown={(event) => {
              if (event.key === 'Backspace' && props.value.length > 0) {
                event.preventDefault();
                props.handleValueRemove(props.value[props.value.length - 1]);
              }
            }}
          />
        </Combobox.EventsTarget>
      </Pill.Group>
    </PillsInput>
  );
};

const ComboboxOptions = (props: {
  loading: boolean;
  isMultiple?: boolean;
  options: ComboboxType[];
  filteredOpt: ComboboxType[] | null;
  value: ComboboxType | ComboboxType[] | null;
}) => {
  const options = props.filteredOpt ?? props.options;

  if (props.loading) {
    return <Combobox.Empty>Loading....</Combobox.Empty>;
  }
  if (options.length < 1) {
    return <Combobox.Empty>No option found.</Combobox.Empty>;
  }
  return (
    <>
      {options.map((item) => {
        const vSingle = props.value as ComboboxType;
        const vMultiple = props.value as ComboboxType[];

        const isActive = props.isMultiple
          ? vMultiple.some((opt) => opt.value === item.value)
          : item.value === vSingle?.value;

        return (
          <Combobox.Option value={item.value} key={item.value} active={isActive}>
            <Group gap={8}>
              {isActive && <CheckIcon size={12} />}
              {item.label}
            </Group>
          </Combobox.Option>
        );
      })}
    </>
  );
};
