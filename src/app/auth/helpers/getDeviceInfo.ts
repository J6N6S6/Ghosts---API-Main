export function getDeviceInfo(userAgent: string) {
  const deviceInfo = {
    type: 'OTHER',
    browser: 'Desconhecido',
    model: 'Desconhecido',
  };

  const isMobile = /Mobile|Android|iPhone|iPod|Windows Phone/i.test(userAgent);
  const isTablet = /iPad|Android (?!.*Mobile)/i.test(userAgent);
  const isDesktop = !isMobile && !isTablet;

  if (isMobile) {
    deviceInfo.type = 'MOBILE';
  } else if (isTablet) {
    deviceInfo.type = 'TABLET';
  } else if (isDesktop) {
    deviceInfo.type = 'DESKTOP';
  }

  const browserMatch = userAgent.match(
    /(Chrome|Safari|Firefox|Edge)\/([\d.]+)/,
  );
  if (browserMatch) {
    deviceInfo.browser = browserMatch[1];
  }

  const mobileModelMatch = userAgent.match(
    /\b(iPhone|iP[oa]d|Android|Windows Phone)\b.*\bVersion\/([\d.]+)/,
  );
  if (mobileModelMatch) {
    deviceInfo.model = mobileModelMatch[1];
  }

  return deviceInfo;
}
