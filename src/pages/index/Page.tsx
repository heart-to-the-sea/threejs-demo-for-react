import { useEffect, useRef, useState } from "react";
import geoJSON from "../../assets/南京市.json";
import style from "./index.module.scss";
import usePage from "./usePage";

export default function Page() {
  const canvas = useRef<HTMLDivElement | null>(null);
  const { init } = usePage();
  useEffect(() => {
    if (canvas.current) {
      init(canvas.current);
    }
    return () => {
      if (canvas.current) {
        canvas.current.innerHTML = "";
      }
    };
  }, [canvas]);
  return (
    <>
      <div className={style.box} ref={canvas}></div>
    </>
  );
}
