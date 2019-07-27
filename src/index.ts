import * as migrator from "rstolsmark-json-migrator";

const storageKey = "appliedMigrations";

function reviver(key: string, value: any) {
  if (key === "dateApplied") {
    return new Date(value);
  }
  return value;
}

export function getAppliedMigrations(): migrator.IAppliedMigration[] {
  const value = localStorage.getItem(storageKey);
  const parsedValue =
    value && (JSON.parse(storageKey, reviver) as migrator.IAppliedMigration[]);
  return parsedValue || ([] as migrator.IAppliedMigration[]);
}

export function storeAppliedMigrations(
  appliedMigrations: migrator.IAppliedMigration[]
): void {
  localStorage.setItem(storageKey, JSON.stringify(appliedMigrations));
}

export default function migrate(migrations: migrator.IMigration[]) {
  const appliedMigrations = getAppliedMigrations();
  migrator.default(migrations, appliedMigrations);
  storeAppliedMigrations(appliedMigrations);
}
