import React, { useCallback, useEffect, useState } from 'react';
import type { SelectProps } from 'antd';
import { Select } from 'antd';
import { useMount } from 'ahooks';

export function is(type: string) {
  return (value: any) => {
    const vtype = Object.prototype.toString.call(value);
    return `[object ${type.toLowerCase()}]` === vtype.toLowerCase();
  };
}
// prettier-ignore
export const isArray = (value: unknown): value is unknown[] => is('array')(value)
// prettier-ignore
export const isUndefined = (value: unknown): value is undefined => is('undefined')(value);

export interface EnhancedSelectProps extends SelectProps<any> {
  /**
   * 接受一个 Promise，reject 时不会触发 value 变更，用于选择某个项后弹出一个弹窗提醒是否继续的场景
   */
  beforeChange?: () => Promise<void>;
  /**
   * 如果当前 value 被设置了 disabled 或者 value 匹配不到 option，则自动选择第一个可用值，（仅接受传入 options 的使用方式），默认 false
   */
  skipInvalidValue?: boolean;
}

const EnhancedSelect: React.FC<EnhancedSelectProps> = (props) => {
  const {
    defaultValue,
    value,
    onChange,
    options,
    beforeChange,
    skipInvalidValue = false,
    ...restProps
  } = props;
  const [internalValue, setInternalValue] = useState();
  const triggerChange = useCallback(
    (option) => {
      if (isUndefined(value)) {
        setInternalValue(option.value);
      }
      onChange?.(option.value, option);
    },
    [onChange, value],
  );

  useMount(() => {
    setInternalValue(defaultValue);
  });

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    if (!skipInvalidValue || !isArray(options)) return;

    const curOpt = options.find((opt) => opt.value === value);

    if (!curOpt || curOpt.disabled) {
      const firstAvailableOption = options.find((opt) => !opt.disabled);
      if (firstAvailableOption) {
        triggerChange(firstAvailableOption);
      }
    }
  }, [skipInvalidValue, options, value, triggerChange]);

  async function handleChange(...params: any[]) {
    let shouldTrigger = true;

    if (beforeChange) {
      try {
        await beforeChange();
      } catch (e) {
        shouldTrigger = false;
      }
    }

    if (shouldTrigger) {
      if (isUndefined(value)) {
        setInternalValue(params[0]);
      }
      // @ts-ignore
      onChange?.(...params);
    }
  }

  return (
    <Select
      value={internalValue}
      options={options}
      allowClear
      placeholder="请输入"
      {...restProps}
      onChange={handleChange}
    />
  );
};

export default Object.assign(EnhancedSelect, Select);
