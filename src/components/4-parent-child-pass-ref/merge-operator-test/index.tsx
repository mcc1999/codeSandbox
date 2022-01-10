import { mapTo } from 'rxjs/operators';
import { interval, merge } from 'rxjs';

export default function App() {

  // 每2.5秒发出值
  const first = interval(2500);
  // 每2秒发出值
  const second = interval(2000);
  // 每1.5秒发出值
  const third = interval(1500);
  // 每1秒发出值
  const fourth = interval(1000);
  const list = [
    first.pipe(mapTo('1FIRST!')),
    second.pipe(mapTo('2SECOND!')),
    third.pipe(mapTo('3THIRD')),
    fourth.pipe(mapTo('4FOURTH'))
  ]

  // 从一个 observable 中发出输出值
  const example = merge(
    ...list
  );
  // 输出: "FOURTH", "THIRD", "SECOND!", "FOURTH", "FIRST!", "THIRD", "FOURTH"
  const subscribe = example.subscribe(val => console.log(val));
  return <div></div>
}