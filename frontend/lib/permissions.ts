export type Permission = {
  id: number;
  name: string;
  key: string;
};

export function hasPermission(
  userTypeId: number,
  permissions: Permission[],
  required: string | null,
): boolean {
  if (!required) return true;
  if (userTypeId === 1) return true;
  return permissions.some((p) => p.name === required);
}
