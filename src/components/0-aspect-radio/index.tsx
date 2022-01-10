import { useMemo, useRef, useState } from "react";

function getPosition() {
  const a = Math.random();
  return a > 0.5 ? 100 : 200;
}

export default function App() {
  const [left, setLeft] = useState<number>();
  const a = useMemo(() =>
    setInterval(() => {
    const l = getPosition();
    setLeft(l);
  }, 2000), [])
  console.log('render');
  
  return (
    <div style={{width: 800, height: 450, backgroundColor: '#eeeeee', position: 'relative', margin: 50}}>
      <div style={{width: 200, height: 200, position: 'absolute', left: left, top: 0, backgroundColor: 'red', }} >
        <video src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4" autoPlay muted/>
      </div>
    </div>
  )
}
