/**
 * Utility to communicate with ntfy push notification service
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
  const url = `${cleanServer}/${cleanTopic}`;

  const headers = {
    'Priority': isLoudAlarm ? '5' : '3',
    'Tags': isLoudAlarm ? 'rotating_light,loudspeaker' : 'bell',
    'Title': isLoudAlarm 
      ? `🚨 FIND MY PHONE: ${deviceName || 'Target Device'}`
      : `🔔 CHIME: ${deviceName || 'Target Device'}`,
  };

  const body = isLoudAlarm
    ? `Ping sent from Home Hub tablet at ${new Date().toLocaleTimeString()}! Tap this notification to dismiss the alarm.`
    : `Gentle chime ping from Home Hub at ${new Date().toLocaleTimeString()}.`;

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body
  });

  if (!response.ok) {
    throw new Error(`Failed to send ping (${response.status}: ${response.statusText})`);
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
  const url = `${cleanServer}/${cleanTopic}`;

  return fetch(url, {
    method: 'POST',
    headers: {
      'Priority': '3',
      'Tags': 'white_check_mark',
      'Title': `✅ Found: ${deviceName || 'Device'}`,
    },
    body: `Alarm was cancelled from the Home Hub.`
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
