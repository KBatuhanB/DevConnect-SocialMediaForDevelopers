"use client";

import { useEffect, useState } from "react";

type MessageAvatarProps = {
  avatarUrl: string | null;
  username: string;
};

function readInitial(username: string) {
  return username.slice(0, 1).toUpperCase();
}

export function MessageAvatar({ avatarUrl, username }: MessageAvatarProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [avatarUrl]);

  return (
    <div className="message-avatar">
      {avatarUrl && !hasError ? (
        <img
          alt={`${username} avatar`}
          className="message-avatar-image"
          onError={() => setHasError(true)}
          src={avatarUrl}
        />
      ) : (
        <span>{readInitial(username)}</span>
      )}
    </div>
  );
}