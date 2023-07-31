# SyModel - Sequelize Models with Extra Metadata and Fields

SyModel is an abstract base class for Sequelize models. It extends the built-in Sequelize Model class with additional metadata and fields definitions for richer modeling of database entities.

## Installation

You can install `SyModel` directly from our repository using npm or yarn:

```bash
npm install sy-model
# or
yarn add sy-model
```

## Features

SyModel offers the following features:

- **Metadata** - You can add optional metadata to your Sequelize models. This allows you to associate additional information with your models that doesn't need to be persisted in the database.

- **Additional Field Definitions** - You can declare additional field definitions for your models, enabling you to add more structure to your models beyond what's defined in the database schema.

## Basic Usage

```typescript
export class Cache extends SyModel<InferAttributes<Cache>, InferCreationAttributes<Cache>> {
  @Field({
    type: DataTypes.JSON,
    verbose: 'Cache Contents',
  })
  declare contents: JSON;
}

Cache.init(
  {
    ...Cache.metaFields,
    ...Cache.fields,
  },
  {
    tableName: 'cache_dump',
    sequelize: sequelize,
  }
);
```

## API Documentation

### SyModel

This is an abstract class which should be extended by your Sequelize models.

#### Metadata

`SyModel` has an optional `metadata` static field. It can hold any record where each key is a string or symbol, and the value is an object with a `verbose` field of type string.

#### Fields

`SyModel` has an optional `fields` static field. It's used to declare additional fields for your Sequelize models. This should be an object where each key is a field name and the value is a Sequelize `DataTypes` definition.

#### ID

The `id` field is automatically defined for all SyModel instances. It's an auto-incrementing integer primary key.

#### CreatedAt

The `createdAt` field is automatically defined for all SyModel instances. It's a `Date` timestamp for when the record was created.

#### UpdatedAt

The `updatedAt` field is automatically defined for all SyModel instances. It's a `Date` timestamp for when the record was last updated.

#### getKeys()

`SyModel.getKeys()` is a static method that returns an array of field keys.

#### getFields()

`SyModel.getFields()` is a static method that returns an object containing all field definitions.

## Examples

Please check the `models` folder in our GitHub repository for more comprehensive examples of using `SyModel` to define Sequelize models.

---
