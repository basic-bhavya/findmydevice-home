/**
 * Utility to communicate with ntfy push notification service
 * Uses standard JSON body to support UTF-8 emojis and avoid browser ByteString header restrictions.
 */

export async function sendPing({
  server = 'https://ntfy.sh',
  topic,
  deviceName,
  isLoudAlarm = true
}) {
  if (!topic) {
    throw new Error('Device topic is required');
  }

  const cleanServer = server.replace(/\/+$/, '');
  const cleanTopic = topic.trim();
  const url = `${cleanServer}`;

  const payload = {
    topic: cleanTopic,
    priority: isLoudAlarm ? 5 : 3,
    tags: isLoudAlarm ? ['rotating_light', 'loudspeaker'] : ['bell'],
    title: isLoudAlarm 
      ? `🚨 FIND MY PHONE: ${deviceName || 'Target Phone'}`
      : `🔔 CHIME: ${deviceName || 'Target Phone'}`,
    message: isLoudAlarm
      ? `Ping sent from Home Hub tablet at ${new Date().toLocaleTimeString()}! Tap this notification to dismiss the alarm.`
      : `Gentle chime ping from Home Hub at ${new Date().toLocaleTimeString()}.`,
    actions: [
      {
        action: 'view',
        label: 'Dismiss',
        url: `${cleanServer}/${cleanTopic}`
      }
    ]
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server returned ${response.status}: ${errorText || response.statusText}`);
  }

  return response.json();
}

export async function sendDismiss({
  server = 'https://ntfy.sh',
  topic,
  deviceName
}) {
  if (!topic) return;
  const cleanServer = server.replace(/\/+$/, '');
  const cleanTopic = topic.trim();
  const url = `${cleanServer}`;

  const payload = {
    topic: cleanTopic,
    priority: 3,
    tags: ['white_check_mark'],
    title: `✅ Found: ${deviceName || 'Phone'}`,
    message: `Alarm was cancelled from the Home Hub.`
  };

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

/**
 * Generate a cryptographically secure, friendly random topic name
 */
export function generateRandomTopic(prefix = 'home') {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let rand = '';
  const array = new Uint8Array(6);
  crypto.getRandomValues(array);
  for (let i = 0; i < 6; i++) {
    rand += chars[array[i] % chars.length];
  }
  const cleanPrefix = prefix.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `fmd-${cleanPrefix || 'phone'}-${rand}`;
}
