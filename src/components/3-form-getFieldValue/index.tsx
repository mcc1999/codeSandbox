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

const { RangePicker } = DatePicker;
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
      formRef.current.setFieldsValue({
        date: [
          firstQueryStartTime,
          isHistory ? moment(record.endTime) : moment().subtract(10, 'seconds'),
        ],
      })
    }
  }, [])
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
      <Form.Item>我是组件</Form.Item>
      <Form.Item name="date" label="" rules={[{
        validator: () => {
          const [startTimePicker, endTimePicked] = formRef.current?.getFieldValue('date');
          console.log('in', startTimePicker, endTimePicked, formRef.current?.getFieldValue('date'));
          const timeRange = endTimePicked.diff(startTimePicker, 'hours');
          const promise = Promise;
          if (timeRange > 48) {
            return promise.reject('时间范围不可超过48小时')
          }
          return promise.resolve();
        }
      }]}>
        <EnhancedDatePicker.RangePicker
          showTime
          format='YYYY-MM:DD HH:mm:ss'
          onCalendarChange={(dates, datesString, info) => {
            console.log(JSON.stringify(dates), dates, datesString, info, 'in onCalendarChange');

            if (info.range === 'start') {
              // formRef.current?.setFieldsValue({
              //   date: [moment(dates![0]!), moment(dates![0]!).add(48, 'hours')],
              // });
              setDatePickerStartTime(dates![0]!)
            }
            if (info.range === 'end') setDatePickerEndTime(dates![1]!)
          }}
          // @ts-ignore
          disabledDate={(cur) => {
            // console.log(datePickerStartTime?.format('YYYY-MM-DD HH:mm:ss'), datePickerEndTime?.format('YYYY-MM-DD HH:mm:ss'), 'disableDate');

            const tooLate = datePickerStartTime && cur.diff(datePickerStartTime, 'days') > 2;
            const tooEarly = datePickerEndTime && datePickerEndTime.diff(cur, 'days') > 2;
            // console.log('in disabledDate', cur.format('YYYYMMDD-HHmmss'), datePickerStartTime?.format('YYYY-MM-DD HH:mm:ss'), datePickerEndTime?.format('YYYY-MM-DD HH:mm:ss'));

            const beforeStartDay = cur < moment(record.startTime).startOf('day');
            const beforeEndDay = isHistory ? moment(record.endTime).endOf('day') < cur : moment().endOf('day') < cur;

            return beforeStartDay || beforeEndDay || tooEarly || tooLate;
          }}
          // @ts-ignore
          disabledTime={(date, type) => {
            // console.log('disabledTime', JSON.stringify(date?.format('YYYY-MM-DD HH:mm:ss')), type);

            function range(start: number, end: number) {
              const result = [];
              for (let i = start; i < end; i++) {
                result.push(i);
              }
              return result;
            }
            const disableStartTime = (startTime: string) => {
              return {
                disabledHours: () => range(0, moment(startTime).hour()),
                disabledMinutes: () => date?.hour()! <= moment(startTime).hour() ? range(0, moment(startTime).minute()) : [],
                disabledSeconds: () => date! <= moment(startTime) ? range(0, moment(startTime).second()) : [],
              };
            }
            const disabledEndTime = (endTime: string) => {
              return {
                disabledHours: () => range(moment(endTime).hour() + 1, 24),
                disabledMinutes: () => moment(endTime).hour() === date?.hour()! ? range(moment(endTime).minute() + 1, 60) : [],
                disabledSeconds: () => moment(endTime) <= date! ? range(moment(endTime).second() + 1, 60) : [],
              };
            }
            const timeNotLimit = (endTime: string) => {
              return {
                disabledHours: () => [],
                disabledMinutes: () => [],
                disabledSeconds: () => [],
              };
            }
            // start
            if (type === 'start') {
              // start在endTime那天
              if (date?.format('YYYY-MM-DD') === moment(record.endTime).format('YYYY-MM-DD')) {
                return disabledEndTime(record.endTime);
              }
              // start在startTime那天
              if (date?.format('YYYY-MM-DD')! === moment(record.startTime).format('YYYY-MM-DD')) {
                return disableStartTime(record.startTime);
              }
              // start在startTime和endTime之间
              return timeNotLimit;
            }

            // end
            if (type === 'end') {
              if (date?.format('YYYY-MM-DD') === moment(record.startTime).format('YYYY-MM-DD')) {
                return disableStartTime(record.startTime);
              }
              if (date?.format('YYYY-MM-DD')! === moment(record.endTime).format('YYYY-MM-DD')) {
                return disabledEndTime(record.endTime);
              }
              return timeNotLimit;
            }
          }}
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
      <Form.Item>
        <DatePicker
          showTime
          disabledDate={(cur) => {
            return cur < moment('2022-01-07 11:00:00');

          }}
        />

      </Form.Item>
    </ProForm>
  )
}