import { useEffect, useRef, useState } from "react";
import { fromEvent, merge } from "rxjs";
import type { Observable } from "rxjs";
import "./index.css";


export default function App() {
  const v1Ref = useRef<HTMLVideoElement>(null);
  const v2Ref = useRef<HTMLVideoElement>(null);
  const soundsRef1 = useRef<HTMLDivElement>(null);
  const soundsRef2 = useRef<HTMLDivElement>(null);
  const videoMap: Record<string, any> = {
    s1: v1Ref,
    s2: v2Ref
  };
  const soundsList = ["s1", "s2"];
  const [soundsObservable, setSoundsObservable] = useState<Observable<any>>();

  useEffect(() => {
    if (soundsRef1.current && soundsRef2.current) {
      const click1 = fromEvent(soundsRef1.current, "click");
      const click2 = fromEvent(soundsRef2.current, "click");
      const list = [click1, click2];
      setSoundsObservable(merge(...list));
    }
  }, []);
  useEffect(() => {
    if (soundsObservable) {
      console.log(soundsObservable);

      soundsObservable.subscribe((x) => {
        console.log(x, "x");

        let id: string = x.target?.id;
        if (id) {
          const changeSoundsVideo = videoMap[id];
          changeSoundsVideo.current.muted = !changeSoundsVideo.current.muted;
        }
        soundsList
          .filter((i) => i !== id)
          .forEach((r) => {
            const soundsVideo = videoMap[r];
            if (!soundsVideo.current.muted) {
              soundsVideo.current.muted = true;
            }
          });
        console.log(x.target?.id, "id");
      });
    }
  }, [soundsObservable]);

  return (
    <>
      <div className="App" key="1">
        <video
          ref={v1Ref}
          id="v1"
          src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"
          width="100%"
          height="100%"
          autoPlay
          controls
          muted
          loop
        />
        <div className="sounds" key="s1" ref={soundsRef1}>
          <button
            id="s1"
          // onClick={() => {
          //   const video1 = document.getElementById("v1") as HTMLVideoElement;
          //   video1.muted = !video1.muted;
          // }}
          >
            声音
          </button>
        </div>
      </div>
      <div className="App" key="2">
        <video
          ref={v2Ref}
          id="v2"
          src="https://media.w3.org/2010/05/sintel/trailer.mp4"
          width="100%"
          height="100%"
          autoPlay
          muted
          loop
        />
        <div className="sounds" key="s2" ref={soundsRef2}>
          <button
            id="s2"
          // onClick={() => {
          //   const video2 = document.getElementById("v2") as HTMLVideoElement;
          //   video2.muted = !video2.muted;
          // }}
          >
            声音
          </button>
        </div>
      </div>
    </>
  );
}
