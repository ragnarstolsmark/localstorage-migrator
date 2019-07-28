# LocalStorage Migrator

This is a library for handling migrations of local storage. It is similar to [DbUp](https://dbup.github.io/).
It uses [rstolsmark-json-migrator](https://github.com/ragnarstolsmark/rstolsmark-json-migrator) for handling the migration logic.

## Install

```bash
npm i localstorage-migrator
```

## Usage

A migration is an object that consist of two items:

- name: This has to be unique
- up: a method that is called when applying the migration.

Example:

```typescript
import * as migrator from "localstorage-migrator";

const objectKey = "someKey";

const migrations = [
  {
    name: "delta1",
    up: () => {
      localStorage.setItem(
        objectKey,
        JSON.stringify({
          name: "John Doe"
        })
      );
    }
  },
  {
    name: "delta2",
    up: () => {
      var object = JSON.parse(localStorage.getItem(objectKey) as string);
      object.age = 2;
      localStorage.setItem(objectKey, JSON.stringify(object));
    }
  },
  {
    name: "delta3",
    up: () => {
      var object = JSON.parse(localStorage.getItem(objectKey) as string);
      object.age++;
      localStorage.setItem(objectKey, JSON.stringify(object));
    }
  }
];

/* This would typically be called in some startup method 
   before local storage is accessed by other code. */
export function runMigrations(): void {
  migrator.migrate(migrations);
}
```

An example project can be found on GitHub:
https://github.com/ragnarstolsmark/migratortest

### Methods

### migrate

The migrate method takes a an array of migrations, filters them by those who have already been applied and executes them in sequence. The applied migrations is then stored in local storage under a key called: "appliedMigrations".

#### getAppliedMigrations

This returns an array of those appliedMigrations that have been stored in local storage. They are returned in the order they was applied. An appliedMigration consist of:

- name: The name of the migration that has been applied
- dateApplied: The date the migration was applied

#### storeAppliedMigrations

This takes an array of appliedMigration objects and stores them in local storage. This can work like a reset method when calling it with an empty array.
