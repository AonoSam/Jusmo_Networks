import { useEffect, useRef, useState } from "react";
import { getNotifications, type NotificationsResponse } from "../api/notifications";

const POLL_INTERVAL = 20000;

export function useNotifications() {
  const [data, setData] = useState<NotificationsResponse>({ count: 0, items: [] });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const poll = async () => {
      try {
        const result = await getNotifications();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    poll();
    intervalRef.current = setInterval(poll, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return data;
}