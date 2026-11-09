/**
 * Utility to communicate with ntfy push notification service
 * Uses standard JSON body and sequence_id for true notification replacement & remote dismissal.
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
    sequence_id: 'fmd-alarm', // Replaces existing alert to prevent overlapping sounds
    priority: isLoudAlarm ? 5 : 3,
    tags: isLoudAlarm ? ['rotating_light', 'loudspeaker'] : ['bell'],
    title: isLoudAlarm 
      ? `🚨 FIND MY PHONE: ${deviceName || 'Target Phone'}`
      : `🔔 CHIME: ${deviceName || 'Target Phone'}`,
    message: isLoudAlarm
      ? `Ping sent from Home Hub tablet at ${new Date().toLocaleTimeString()}!`
      : `Gentle chime ping from Home Hub at ${new Date().toLocaleTimeString()}.`,
    actions: [
      {
        action: 'http',
        label: '⏹ Stop Ringing',
        url: `${cleanServer}/${cleanTopic}/fmd-alarm`,
        method: 'DELETE',
        clear: true
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

/**
 * Remotely delete/cancel the alarm notification from the phone's notification tray
 */
export async function sendDismiss({
  server = 'https://ntfy.sh',
  topic
}) {
  if (!topic) return;
  const cleanServer = server.replace(/\/+$/, '');
  const cleanTopic = topic.trim();
  const url = `${cleanServer}/${cleanTopic}/fmd-alarm`;

  const response = await fetch(url, {
    method: 'DELETE'
  });

  return response.ok;
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
