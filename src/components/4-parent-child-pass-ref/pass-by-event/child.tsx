import React, { RefObject, useEffect, useState } from "react";
import { useRef } from "react";
import { fromEvent, Observable } from "rxjs";

interface ChildProps {
  // onAnchorClick: (click: Observable<Event>) => void;
  videoSrc: string;
  vId: string;
  sId: string;
  muted: boolean;
  onSoundChange: (originId: string) => void;
}
const Child: React.FC<ChildProps> = (props) => {
  const { videoSrc, vId, sId, muted, onSoundChange } = props;
  const [click, setClick] = useState<Observable<Event>>();

  const vRef = useRef<HTMLVideoElement>(null);
  const aRef = useRef<HTMLAnchorElement>(null);

  // useEffect(() => {
  //   if (aRef.current) {
  //     const c = fromEvent(aRef.current, "click")
  //     setClick(c);
  //     // console.log(click, 'child click', sId);
  //     c.subscribe(x => console.log(x, 'click'))
  //   }
  // }, [])

  // useEffect(() => {
  //   if (click)
  //     onAnchorClick(click);
  // }, [click])

  return (
    <div className="App">
      <video
        ref={vRef}
        id={vId}
        src={videoSrc}
        width="100%"
        height="100%"
        autoPlay
        // controls
        muted={muted}
        loop
      />
      <a className="sounds"
        id={sId}
        ref={aRef}
        onClick={() => {
          onSoundChange(vId);
        }}
      >
        {muted ? '已静音' : '静音'}
      </a>
    </div >
  )
}

export default Child;