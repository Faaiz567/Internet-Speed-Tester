'use client';

const DOWNLOAD_TEST_SIZE = 10 * 1024 * 1024; // 10 MB
const UPLOAD_TEST_SIZE = 5 * 1024 * 1024; // 5 MB

export async function measureInternetSpeed(
  onProgress: (type: 'download' | 'upload', progress: number) => void
): Promise<{ ping: string; download: string; upload: string }> {
  // Simulate ping test
  await new Promise(resolve => setTimeout(resolve, 500));
  const ping = (Math.random() * 20 + 10).toFixed(2);

  // Simulate download test
  const downloadSpeed = await simulateSpeedTest(DOWNLOAD_TEST_SIZE, progress => {
    onProgress('download', progress);
  });

  // Simulate upload test
  const uploadSpeed = await simulateSpeedTest(UPLOAD_TEST_SIZE, progress => {
    onProgress('upload', progress);
  });

  return {
    ping: Math.round(parseFloat(ping)).toString(),
    download: Math.round(downloadSpeed).toString(),
    upload: Math.round(uploadSpeed).toString()
  };
}

async function simulateSpeedTest(
  testSize: number,
  onProgress: (progress: number) => void
): Promise<number> {
  const startTime = Date.now();
  let progress = 0;

  while (progress < 100) {
    await new Promise(resolve => setTimeout(resolve, 100));
    progress += Math.random() * 10;
    onProgress(Math.min(progress, 100));
  }

  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000; // seconds
  const speedMbps = (testSize / duration / 1024 / 1024) * 8;

  return speedMbps;
}

