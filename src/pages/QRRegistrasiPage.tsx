import React from "react";
import LinkRegistrasi from "../assets/img/link-registrasi.png";
type Props = {};

export default function QRRegistrasiPage({}: Props) {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <img className="h-screen p-14" src={LinkRegistrasi} alt="" />
    </div>
  );
}
