"use client";
import React from "react";
import { useParams } from "next/navigation";
import useWebRTC, { LOCAL_VIDEO } from "@/src/hooks/useWebRTC";

const Room = () => {
  const params = useParams<{ uuid: string }>();
  const { clients, provideMediaRef } = useWebRTC(params?.uuid || "");

  return (
    <div>
      {clients.map((clientId: string) => (
        <div key={clientId}>
          <video
            ref={(instance) => {
              provideMediaRef(clientId, instance);
            }}
            autoPlay
            playsInline
            muted={clientId === LOCAL_VIDEO}
          ></video>
        </div>
      ))}
    </div>
  );
};

export default Room;
