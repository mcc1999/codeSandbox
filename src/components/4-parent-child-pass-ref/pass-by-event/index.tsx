import { RefObject, useEffect, useRef, useState } from "react";
import { fromEvent, merge, Observable } from "rxjs";
import Child from "./child";

export default function Parent() {
  const data = [
    {
      videoSrc: 'https://stream7.iqilu.com/10339/upload_transcode/202002/18/20200218114723HDu3hhxqIT.mp4',
      sId: 's1',
      vId: 'v1',
    },
    {
      videoSrc: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
      sId: 's2',
      vId: 'v2',
    },
  ]
  // const [clickObservableList, setClickObservableList] = useState<Observable<Event>[]>([]);
  // const [soundsObservable, setSoundsObservable] = useState<Observable<any>>();
  // const soundsList = ["s1", "s2"];
  // const soundsVideoMap: Record<string, string> = {
  //   's1': 'v1',
  //   's2': 'v2',
  //   's3': 'v3',
  // };
  // useEffect(() => {

  //   if (clickObservableList.length) {
  //     console.log(clickObservableList, 'list');
  //     setSoundsObservable(merge(...clickObservableList));
  //   }
  // }, [clickObservableList]);

  // useEffect(() => {
  //   if (soundsObservable) {
  //     console.log(soundsObservable);

  //     soundsObservable.subscribe((x) => {
  //       console.log(x, "x");

  //       let id: string = x.target?.id;
  //       if (id) {
  //         const changeSoundsVideo = document.getElementById(soundsVideoMap[id]) as HTMLVideoElement;
  //         if (changeSoundsVideo) {
  //           changeSoundsVideo.muted = !changeSoundsVideo.muted;
  //         }
  //       }
  //       soundsList
  //         .filter((i) => i !== id)
  //         .forEach((r) => {
  //           const soundsVideo = document.getElementById(soundsVideoMap[r]) as HTMLVideoElement;
  //           if (!soundsVideo.muted) {
  //             soundsVideo.muted = true;
  //           }
  //         });
  //       console.log(x.target?.id, "id");
  //     });
  //   }
  // }, [soundsObservable]);


  const [soundOrigin, setSoundsOrigin] = useState<string>('');


  const doms = data.map(d => {
    return (
      <div
        key={d.sId}
        style={{ width: 480, height: 270, marginBottom: 48, display: 'inline-block' }}
      >
        <Child
          videoSrc={d.videoSrc}
          // onAnchorClick={click => {
          //   console.log('in', d.sId, clickObservableList, click);
          //   setClickObservableList(clickObservableList => { return [...clickObservableList, click] });
          // }}
          vId={d.vId}
          sId={d.sId}
          onSoundChange={(vId) => {
            console.log(vId, 'onSoundsChange');

            if (soundOrigin === vId) {
              setSoundsOrigin('');
            } else {
              setSoundsOrigin(vId)
            }
          }}
          muted={soundOrigin !== d.vId}
        />
      </div>
    )
  })


  return (
    <>
      {doms}
    </>
  )
}