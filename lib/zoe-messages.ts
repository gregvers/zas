import { products, zoneConfig, type Zone } from "./products";

const ALL_ZONES: Zone[] = ["squishy", "slime"];

export function getHubMessage(
  name: string,
  zonesVisited: Zone[],
  hearts: string[],
  hubVisits: number
): string {
  const heartedProducts = products.filter((p) => hearts.includes(p.id));

  // First time landing on hub after entering
  if (hubVisits === 0) {
    return `Okay ${name}, I have two special zones for you today! Heart everything you love, and I'll pick your free gift at the end. Ready?`;
  }

  // All zones visited
  if (zonesVisited.length >= ALL_ZONES.length) {
    return `You've seen my whole store, ${name}! You hearted ${hearts.length} amazing item${hearts.length !== 1 ? "s" : ""}! Head to your wish list — I have a surprise for you!`;
  }

  // Returning from a zone — comment on what they hearted there
  const lastZone = zonesVisited[zonesVisited.length - 1];
  const zoneHearts = heartedProducts.filter((p) => p.zone === lastZone);

  const unvisited = ALL_ZONES.filter((z) => !zonesVisited.includes(z));
  const suggestion = unvisited[0];
  const suggestLine = suggestion
    ? ` I'd love to show you my ${zoneConfig[suggestion].label} Zone next!`
    : "";

  if (zoneHearts.length > 0) {
    const item = zoneHearts[0].name;
    const extra = zoneHearts.length > 1 ? ` and ${zoneHearts.length - 1} other${zoneHearts.length > 2 ? "s" : ""}` : "";
    return `Ooh, the ${item}${extra} — I knew you'd love that one, ${name}!${suggestLine}`;
  }

  if (zonesVisited.length === 1) {
    return `Good start, ${name}! You've seen my ${zoneConfig[lastZone].label} Zone.${suggestLine}`;
  }

  return `Welcome back, ${name}! You've visited ${zonesVisited.length} of my zones and hearted ${hearts.length} item${hearts.length !== 1 ? "s" : ""}.${suggestLine}`;
}

export function getZoneMessage(
  zone: Zone,
  isFirstVisit: boolean,
  hearts: string[]
): string {
  const cfg = zoneConfig[zone];
  const zoneHearts = products.filter((p) => p.zone === zone && hearts.includes(p.id));

  if (!isFirstVisit) {
    if (zoneHearts.length > 0) {
      return `Back again! I knew you couldn't resist the ${zoneHearts[0].name}. See anything else you want?`;
    }
    return `Back for more? I like your style! Take another look — I think something will catch your eye.`;
  }

  return cfg.zoeMessage;
}

export function getZoneHeartMessage(productName: string, totalHearts: number): string {
  const reactions = [
    `Ooh, the ${productName}! That's one of my favorites!`,
    `Great choice! I picked the ${productName} just for you!`,
    `Yes! I knew you'd love the ${productName}!`,
    `The ${productName}! I have great taste, don't I? 😄`,
  ];
  const msg = reactions[totalHearts % reactions.length];
  return totalHearts >= 3
    ? `${msg} You've hearted ${totalHearts} items — your wish list is looking amazing!`
    : msg;
}

export function getWishlistMessage(
  name: string,
  heartedNames: string[],
  freeGiftName: string,
  totalPrice: number
): string {
  if (heartedNames.length === 0) {
    return `You haven't hearted anything yet, ${name}! Come back to my store and find what you love.`;
  }

  const rest = heartedNames.filter((n) => n !== freeGiftName);

  if (rest.length === 0) {
    return `${name}, I chose the ${freeGiftName} as your free gift — it's my personal pick for you, completely on me! 🎁`;
  }

  const restStr =
    rest.length === 1 ? `the ${rest[0]}` : `the ${rest.slice(0, -1).join(", ")} and the ${rest[rest.length - 1]}`;

  return `${name}, I'm giving you the ${freeGiftName} completely FREE — that's my gift to you! 🎁 And I can send you ${restStr} for just $${totalPrice.toFixed(2)} total. Want me to send everything?`;
}
