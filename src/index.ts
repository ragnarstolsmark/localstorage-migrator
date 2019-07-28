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
    value && (JSON.parse(value, reviver) as migrator.IAppliedMigration[]);
  return parsedValue || ([] as migrator.IAppliedMigration[]);
}

export function storeAppliedMigrations(
  appliedMigrations: migrator.IAppliedMigration[]
): void {
  localStorage.setItem(storageKey, JSON.stringify(appliedMigrations));
}

export function migrate(migrations: migrator.IMigration[]) {
  const appliedMigrations = getAppliedMigrations();
  const appliedMigrationsThisTime = migrator.migrate(
    migrations,
    appliedMigrations
  );
  storeAppliedMigrations(appliedMigrations.concat(appliedMigrationsThisTime));
}
