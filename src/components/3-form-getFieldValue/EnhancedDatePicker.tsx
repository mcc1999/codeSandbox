import React, { useEffect, useState } from 'react';
import type { RadioChangeEvent } from 'antd';
import { DatePicker, Radio, Space } from 'antd';
import { isUndefined } from './EnhancedSelect';
import { useMount } from 'ahooks';

function withShortcuts<
  C extends
  | typeof DatePicker
  | typeof DatePicker.RangePicker
  | typeof DatePicker.YearPicker
  | typeof DatePicker.MonthPicker
  | typeof DatePicker.WeekPicker
  | typeof DatePicker.TimePicker
  | typeof DatePicker.QuarterPicker,
  P extends React.ComponentProps<C>
>(Component: C) {
  return (
    props: P & {
      shortcuts?: {
        label: string;
        value: P['value'];
      }[];
    },
  ) => {
    const { shortcuts, value, defaultValue, onChange, ...rest } = props;
    const [internalValue, setInternalValue] = useState<P['value']>();

    useMount(() => {
      setInternalValue(defaultValue);
    });

    useEffect(() => {
      setInternalValue(value);
    }, [value]);

    function handleRadioGroupChange(e: RadioChangeEvent) {
      const newVal = e.target.value;

      if (isUndefined(value)) {
        setInternalValue(newVal);
      }

      // TODO: 第二个参数遵守原 api 格式
      // @ts-ignore
      onChange?.(newVal);
    }

    function handlePickerChange(val: P['value']) {
      if (isUndefined(value)) {
        setInternalValue(val);
      }

      // TODO: 第二个参数遵守原 api 格式
      // @ts-ignore
      onChange?.(val);
    }

    return (
      <>
        <Space size={16}>
          {shortcuts && (
            <Radio.Group value={internalValue}>
              {shortcuts.map((shortcut, idx) => (
                <Radio.Button value={shortcut.value} key={idx} onChange={handleRadioGroupChange}>
                  {shortcut.label}
                </Radio.Button>
              ))}
            </Radio.Group>
          )}
          {/* 类型错误，没找到解决办法 */}
          {/* @ts-ignore */}
          <Component {...rest} value={internalValue} onChange={handlePickerChange} />
        </Space>
      </>
    );
  };
}

const DatePickerWithShortcuts = withShortcuts(DatePicker);

export default Object.assign(DatePickerWithShortcuts, {
  ...DatePicker,
  RangePicker: withShortcuts(DatePicker.RangePicker),
  YearPicker: withShortcuts(DatePicker.YearPicker),
  MonthPicker: withShortcuts(DatePicker.MonthPicker),
  WeekPicker: withShortcuts(DatePicker.WeekPicker),
  TimePicker: withShortcuts(DatePicker.TimePicker),
  QuarterPicker: withShortcuts(DatePicker.QuarterPicker),
});
