import ProForm from '@ant-design/pro-form';
import type { Moment } from 'moment';
import { useEffect, useRef, useState } from 'react';
import { DatePicker, Form, FormInstance } from 'antd';
import EnhancedDatePicker from './EnhancedDatePicker';
import moment from 'moment';
import EnhancedSelect from './EnhancedSelect';

export interface SearchBarFormValues {
  timeGap: number;
  date: [Moment, Moment];
}
export default function App() {
  const isHistory = true;
  const record = { startTime: '2022-01-04 8:30:30', endTime: '2022-01-07 07:30:30' };
  const formRef = useRef<FormInstance<SearchBarFormValues>>();
  const [datePickerStartTime, setDatePickerStartTime] = useState<Moment>();
  const [datePickerEndTime, setDatePickerEndTime] = useState<Moment>();

  let firstQueryStartTime: Moment = moment(record.startTime);
  if (isHistory && firstQueryStartTime.diff(moment(record.endTime), 'hours') < -48) {
    firstQueryStartTime = moment(record.endTime).subtract(48, 'hours');
  }
  if (!isHistory && firstQueryStartTime.diff(moment(), 'seconds') < - 3610) {
    firstQueryStartTime = moment().subtract(3610, 'seconds');
  }
  useEffect(() => {
    if (formRef.current) {
      console.log('in');

      formRef.current.setFieldsValue({
        date: [
          firstQueryStartTime,
          isHistory ? moment(record.endTime) : moment().subtract(10, 'seconds'),
        ],
      })
    }
  }, [])

  useEffect(() => {
    console.log('date', formRef.current?.getFieldValue('date'));
    console.log('date', JSON.stringify(formRef.current?.getFieldValue('date')[0].format('YYYYMMDD-HHmmss')));
  }, [formRef.current])

  return (
    <ProForm<SearchBarFormValues>
      layout="vertical"
      submitter={false}
      formRef={formRef}
      // 已结束的 总时长 > 48h，第一次查最近48小时
      // 正在推流的 开始推流时间在 1h 之前的，查最近一小时
      initialValues={{
        date: [
          firstQueryStartTime,
          isHistory ? moment(record.endTime) : moment().subtract(10, 'seconds'),
        ],
      }}
    >
      <Form.Item>我是test</Form.Item>
      <Form.Item name="date" label="">
        <EnhancedDatePicker.RangePicker
          showTime
          format='YYYY-MM:DD HH:mm:ss'
          onCalendarChange={(dates, datesString, info) => {

            if (info.range === 'start') {
              console.log(JSON.stringify(dates), dates, datesString, info, 'in onCalendarChange');

              setDatePickerStartTime(dates![0]!);
              formRef.current?.setFieldsValue({
                date: [moment(dates![0]!), moment(dates![0]!).add(48, 'hours')],
              })
            }
            if (info.range === 'end') setDatePickerEndTime(dates![1]!)
          }}
          // @ts-ignore
          disabledDate={(cur) => {
            const tooLate = datePickerStartTime && cur.diff(datePickerStartTime, 'days') > 2;
            const tooEarly = datePickerEndTime && datePickerEndTime.diff(cur, 'days') > 2;

            const beforeStartDay = cur < moment(record.startTime).startOf('day');
            const beforeEndDay = isHistory ? moment(record.endTime).endOf('day') < cur : moment().endOf('day') < cur;

            return beforeStartDay || beforeEndDay || tooEarly || tooLate;
          }}
          // @ts-ignore
          allowClear={false}
        />
      </Form.Item>
      <Form.Item shouldUpdate noStyle>
        {(val) => {
          const getFieldValue = val.getFieldValue
          const [startTime, endTime] = getFieldValue('date') as [Moment, Moment];
          const diffHours = endTime.diff(startTime, 'hours');

          return (
            <Form.Item name="timeGap" label="时间间隔">
              <EnhancedSelect
                style={{ width: 80 }}
                options={[
                  { label: '5秒', value: 1, disabled: diffHours > 2 },
                  { label: '5分钟', value: 2, disabled: diffHours > 24 },
                  { label: '1小时', value: 3 },
                ]}
                allowClear={false}
                skipInvalidValue
              />
            </Form.Item>
          );
        }}
      </Form.Item>
    </ProForm>
  )
}