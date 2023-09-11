/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';

const Notifications = () => {
  const [notifications, setNotifications] = useState<any>([]);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:4000/notifications');

    eventSource.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      setNotifications((prevNotifications: any) => [...prevNotifications, notification]);
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <>
      {notifications && (
        <div>
          <h2>Notifications</h2>
          {notifications.map((notification: any, index: number) => (
            <div key={index}>{notification.data.message}</div>
          ))}
        </div>
      )}
    </>
  );
};

export default Notifications;
