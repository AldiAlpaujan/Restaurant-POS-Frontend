import { defaultVariantColorsResolver, rgba, type VariantColorsResolver } from '@mantine/core';

const variantColorResolver: VariantColorsResolver = (input) => {
  const defaultResolvedColors = defaultVariantColorsResolver(input);

  if (input.variant === 'grid-action') {
    return {
      background: rgba('var(--mantine-color-gray-filled)', 0.12),
      hover: rgba('var(--mantine-color-gray-filled)', 0.12),
      color: 'var(--mantine-color-gray-filled)',
      border: 'none',
    };
  }

  if (input.variant === 'grid-action-edit') {
    return {
      background: rgba('var(--mantine-primary-color-filled)', 0.12),
      hover: rgba('var(--mantine-primary-color-filled)', 0.12),
      color: 'var(--mantine-primary-color-filled)',
      border: 'none',
    };
  }

  if (input.variant === 'grid-action-delete') {
    return {
      background: rgba('var(--mantine-color-red-6)', 0.12),
      hover: rgba('var(--mantine-color-red-6)', 0.12),
      color: 'var(--mantine-color-red-6)',
      border: 'none',
    };
  }

  if (input.variant === 'filter-cancel') {
    return {
      background: rgba('var(--mantine-color-red-6)', 0),
      hover: rgba('var(--mantine-color-red-6)', 0.1),
      color: 'var(--mantine-color-red-6)',
      border: '1px solid var(--mantine-color-red-6)',
    };
  }

  return defaultResolvedColors;
};

export default variantColorResolver;
