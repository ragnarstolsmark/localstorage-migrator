import { IMigration } from "rstolsmark-json-migrator";
import * as migrator from "../index";

interface INumObj {
  num: number;
}
const testKey = "test";
function getTestItem(): INumObj {
  return JSON.parse(localStorage.getItem(testKey) as string) as INumObj;
}
const migrations: IMigration[] = [
  {
    name: "delta1",
    up: () => {
      localStorage.setItem(testKey, JSON.stringify({ num: 1 }));
    }
  },
  {
    name: "delta2",
    up: () => {
      const test = getTestItem();
      test.num++;
      localStorage.setItem(testKey, JSON.stringify(test));
    }
  }
];
afterEach(() => {
  localStorage.removeItem(testKey);
  migrator.storeAppliedMigrations([]);
});

test("Run all migrations", () => {
  migrator.migrate(migrations);
  expect(getTestItem().num).toBe(2);
  expect(migrator.getAppliedMigrations().length).toBe(2);
});

test("Call migrate twice without migrations being run twice", () => {
  migrator.migrate(migrations);
  migrator.migrate(migrations);
  expect(getTestItem().num).toBe(2);
  expect(migrator.getAppliedMigrations().length).toBe(2);
});

test("Call migrate in two steps", () => {
  migrator.migrate(migrations.slice(0, 1));
  expect(getTestItem().num).toBe(1);
  expect(migrator.getAppliedMigrations().length).toBe(1);
  migrator.migrate(migrations);
  expect(getTestItem().num).toBe(2);
  expect(migrator.getAppliedMigrations().length).toBe(2);
});
