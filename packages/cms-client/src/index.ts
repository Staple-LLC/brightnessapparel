export interface Snapshot {
  formatVersion: 1;
  websiteId: string;
  publicationId: string;
  version: number;
  pages: Record<string, Record<string, unknown>>;
}
export function parseSnapshot(value: unknown, websiteId: string): Snapshot {
  if (!value || typeof value !== 'object') throw new Error('Invalid CMS snapshot');
  const s=value as Partial<Snapshot>;
  if (s.formatVersion!==1 || s.websiteId!==websiteId || !s.publicationId || !Number.isInteger(s.version) || Number(s.version)<1 || !s.pages || typeof s.pages!=='object' || Array.isArray(s.pages)) throw new Error('Snapshot format or website mismatch');
  return s as Snapshot;
}
export function getSection<T>(snapshot: Snapshot, slug: string, key: string, validate: (value:unknown)=>value is T):T {
  const value=snapshot.pages[slug]?.[key];
  if (!validate(value)) throw new Error(`Invalid or missing content section: ${slug} ${key}`);
  return value;
}
