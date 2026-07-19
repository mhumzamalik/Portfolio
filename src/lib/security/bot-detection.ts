const BOT_PATTERNS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  /curl/i,
  /wget/i,
  /python-requests/i,
  /python-urllib/i,
  /java\//i,
  /go-http-client/i,
  /ruby/i,
  /php/i,
  /libwww/i,
  /axios/i,
  /node-fetch/i,
  /okhttp/i,
  /httpclient/i,
  /nmap/i,
  /masscan/i,
  /zgrab/i,
  /nuclei/i,
  /sqlmap/i,
  /nikto/i,
  /dirbuster/i,
  /hydra/i,
  /burpsuite/i,
  /postman/i,
  /insomnia/i,
];

export interface BotDetectionResult {
  isBot: boolean;
  reason?: string;
}

export function detectBot(userAgent: string | null): BotDetectionResult {
  if (!userAgent || userAgent.trim().length === 0) {
    return { isBot: true, reason: "missing_user_agent" };
  }

  for (const pattern of BOT_PATTERNS) {
    if (pattern.test(userAgent)) {
      return { isBot: true, reason: "bot_user_agent" };
    }
  }

  return { isBot: false };
}
