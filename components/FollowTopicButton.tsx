import { useEffect, useState } from "react";

interface FollowTopicButtonProps {
  topic: string;
}

export default function FollowTopicButton({ topic }: FollowTopicButtonProps) {
  const [following, setFollowing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/follow/topic?topic=${encodeURIComponent(topic)}`);
        const data = await res.json();
        if (mounted) setFollowing(!!data.following);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [topic]);

  async function toggle(): Promise<void> {
    setLoading(true);
    try {
      const res = await fetch("/api/follow/topic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, follow: !following }),
      });
      const data = await res.json();
      setFollowing(!!data.following);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`wn-btn rounded-full border px-3 py-1 text-xs ${following ? "bg-blue-600 text-white" : ""}`}
      aria-pressed={following}
    >
      {loading ? "…" : following ? "Following" : "Follow"}
    </button>
  );
}
