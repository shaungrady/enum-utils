# Enum Utils

Make enums more intuitive to use with familiar `Set` and `Map` interfaces! Works
with numeric, string, and heterogeneous enums, and allows for easy enum type
guarding, creation of enum subsets, and safe mapping of enums to anything
else—even other enums!

###### Package: [GitHub](https://github.com/shaungrady/enum-utils), [npm](https://www.npmjs.com/package/@sg.js/enum-utils)  |  Author: [Shaun Grady](https://shaungrady.com/)

## Install

```sh
npm install @sg.js/enum-utils
```

_Requires TypeScript `>=4.7`_

## What's Inside

**Classes**

**`EnumSet`: Use an enum as an immutable Set.**

- Construction via `fromEnum(Enum)` method takes a single enum argument.
- `has(value)` is a type guard for narrowing serialized values types to the
  enum.
- `subset(Enum[])` safely creates an `EnumSet` from a subset of enum members.
- `toEnumMap(mapping)` creates an `EnumMap`, safely mapping an enum (or enum
  subset) to anything.
- Shares `Set` iterable methods.

**`EnumMap`: Use an enum as an immutable Map.**

- Construction via `fromEnum(Enum, { [Enum]: any })` provides exhaustive type
  safety for map keys while preventing numeric enum keys from being coerced to
  strings.
- `has(value)` is a type guard for narrowing serialized values types to the
  enum.
- `get()` has dynamically-typed return value; `has()` guarded values always
  return a value and illegal enum values always return `undefined`.
- Shares `Map` iterable methods.

**Functions**

- `enumToSet`: Convert an enum object to Set of enum members.
- `isEnumMember`: Type guard for a given enum.
- `isValidEnumMember`: Type guard for values that are strings and finite
  numbers.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Usage Examples](#usage-examples)
  - [EnumSet](#enumset)
  - [EnumMap](#enummap)
- [Documentation](#documentation)
  - [EnumSet](#enumset-1)
    - [Construction](#construction)
      - [`EnumSet()`](#enumset)
    - [Static methods](#static-methods)
      - [`EnumSet.fromEnum()`](#enumsetfromenum)
    - [Instance methods](#instance-methods)
      - [`EnumSet.prototype.has()`](#enumsetprototypehas)
      - [`EnumMap.prototype.subset()`](#enummapprototypesubset)
      - [`EnumMap.prototype.toEnumMap()`](#enummapprototypetoenummap)
      - [`EnumMap.prototype.keys()`](#enummapprototypekeys)
      - [`EnumMap.prototype.values()`](#enummapprototypevalues)
      - [`EnumMap.prototype.entries()`](#enummapprototypeentries)
      - [`EnumMap.prototype.forEach()`](#enummapprototypeforeach)
  - [EnumMap](#enummap-1)
    - [Construction](#construction-1)
      - [`EnumMap()`](#enummap)
    - [Static methods](#static-methods-1)
      - [`EnumMap.fromEnum()`](#enummapfromenum)
    - [Instance methods](#instance-methods-1)
      - [`EnumMap.prototype.has()`](#enummapprototypehas)
      - [`EnumMap.prototype.get()`](#enummapprototypeget)
      - [`EnumMap.prototype.keys()`](#enummapprototypekeys-1)
      - [`EnumMap.prototype.values()`](#enummapprototypevalues-1)
      - [`EnumMap.prototype.entries()`](#enummapprototypeentries-1)
      - [`EnumMap.prototype.forEach()`](#enummapprototypeforeach-1)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage Examples

### EnumSet

```tsx
enum Action {
  Create = 'create',
  Duplicate = 'duplicate',
  Update = 'update',
  Destroy = 'destroy',
}

const allActions = EnumSet.fromEnum(Action);

// Create a subset of an enum with the `subset()` method.
const userActions = allActions.subset([Action.Create, Action.Duplicate]);

const Component = () => {
  const { isAdmin } = useSession();
  const { query } = useRouter();
  const { action } = query; // typeof action => string
  const allowedActions = isAdmin ? allActions : userActions;

  // Type guard a value with the `has()` method.
  if (!allowedActions.has(action)) {
    const actions = [...allowedActions].join(', ');
    throw new Error(`searchParam 'action' must be one of: ${actions}.`);
  }

  // Type guarding enables exhaustive switch statements
  switch (
    action // typeof action => Action
  ) {
    case Action.Create: // …
    case Action.Duplicate: // …
    case Action.Update: // …
    case Action.Destroy: // …
  }
};
```

### EnumMap

```tsx
enum Priority {
  Low,
  Medium,
  High,
}

const priorityI18nMap = EnumMap.fromEnum(Priority, {
  [Priority.Low]: 'common.priority.low',
  [Priority.Medium]: 'common.priority.medium',
  [Priority.High]: 'common.priority.high',
} as const);

const PrioritySelect = () => {
  const { t } = useTranslation();

  return (
    <Select
      options={[...priorityI18nMap.keys()]}
      renderLabel={(value) => t(priorityI18nMap.get(value))}
    />
  );
};
```

---

# Documentation

## EnumSet

### Construction

#### `EnumSet()`

> Although `new EnumSet()` can be called with the same value signature of `Set`,
> the type arguments aren't very developer-friendly; instead, it's recommended
> to make use of the `EnumSet.fromEnum()` static method.

### Static methods

#### `EnumSet.fromEnum()`

> Creates an `EnumSet` from an enum.
>
> ```ts
> fromEnum(Enum);
> ```
>
> ```ts
> enum Color {
>   Red,
>   Green,
>   Blue,
> }
>
> EnumSet.fromEnum(Color);
> ```

### Instance methods

#### `EnumSet.prototype.has()`

> Returns a boolean indicating whether a value is a member of the enum or not.
> Acts as a type guard.
>
> ```ts
> has(value);
> ```
>
> ```ts
> const colors = EnumSet.fromEnum(Color);
> const value: unknown = router.query.color;
> let color: Color;
>
> if (colorToHexMap.has(value)) {
>   color = value;
> }
> ```

#### `EnumMap.prototype.subset()`

> Returns an `EnumSet` that's a subset of the current `EnumSet`.
>
> ```ts
> subset([Enum]);
> ```
>
> ```ts
> enum Locale {
>   enUS = 'en-US',
>   enGB = 'en-GB',
>   frCA = 'fr-CA',
>   esMX = 'es-MX',
>   jaJP = 'ja-JP',
> }
>
> const siteLocales = EnumSet.from(Locale);
>
> const videoLocales = siteLocales.subset([
>   Locale.enUS,
>   Locale.enGB,
>   Locale.esMX,
> ]);
>
> if (videoLocales.has(value)) {
>   // typeof value ⮕ `Locale.enUS | Locale.enGB | Locale.esMX`
> }
> ```

#### `EnumMap.prototype.toEnumMap()`

> Returns an `EnumMap` with a mapping of set members to values. Use a `const`
> assertion on the mapping argument for maximum type safety. Mapping is
> exhaustive, so each `EnumSet` member must be used as a property key.
>
> ```ts
> EnumMap(mapping);
> ```
>
> ```ts
> enum Locale {
>   enUS = 'en-US',
>   enGB = 'en-GB',
>   frCA = 'fr-CA',
>   esMX = 'es-MX',
> }
>
> const locales = EnumSet.from(Locale);
>
> const localeFileSuffixes = locales.toEnumMap({
>   [Locale.enUS]: 'en',
>   [Locale.enGB]: 'en',
>   [Locale.frCA]: 'fr-ca',
>   [Locale.esMX]: 'es',
> } as const);
>
> // We can optionally constrain the values to a type
> const localeI18nKeys = locales.toEnumMap<I18nKeys>({
>   [Locale.enUS]: 'common.americanEnglish',
>   [Locale.enGB]: 'common.britishEnglish',
>   [Locale.frCA]: 'common.canadianFrench',
>   [Locale.esMX]: 'common.mexicanSpanish',
> } as const);
> ```

#### `EnumMap.prototype.keys()`

#### `EnumMap.prototype.values()`

#### `EnumMap.prototype.entries()`

#### `EnumMap.prototype.forEach()`

> These methods behave identically to the `Set` class.
> [See MDN documentation](http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
> for more details.

## EnumMap

### Construction

#### `EnumMap()`

> Although `new EnumMap()` can be called with the same value signature of `Map`,
> the type arguments aren't very developer-friendly; instead, it's recommended
> to make use of the `EnumMap.fromEnum()` static method.

### Static methods

#### `EnumMap.fromEnum()`

> Creates an EnumMap from an enum and a mapping of members to values. Use a
> `const` assertion on the mapping argument for maximum type safety. Mapping is
> exhaustive, so each enum member must be used as a property key.
>
> ```ts
> fromEnum(Enum, mapping as const);
> ```
>
> ```ts
> enum Color {
>   Red,
>   Green,
>   Blue,
> }
>
> const colorToHexMap = EnumMap.fromEnum(Color, {
>   [Color.Red]: '#f00',
>   [Color.Green]: '#0f0',
>   [Color.Blue]: '#00f',
> } as const);
> ```

### Instance methods

#### `EnumMap.prototype.has()`

> Returns a boolean indicating whether a value is a member of the enum or not.
> Acts as a type guard.
>
> ```ts
> has(value);
> ```
>
> ```ts
> const colorToHexMap = EnumMap.fromEnum(Color, {
>   [Color.Red]: '#f00',
>   [Color.Green]: '#0f0',
>   [Color.Blue]: '#00f',
> } as const);
>
> const value: unknown = router.query.color;
> let color: Color;
>
> if (colorToHexMap.has(value)) {
>   color = value;
> }
> ```

#### `EnumMap.prototype.get()`

> Returns the value associated to the passed enum member, or undefined if there
> is none. Use the `has()` method to return map value types that aren't a union
> with `undefined`.
>
> ```ts
> get(value);
> ```
>
> ```ts
> const colorToHexMap = EnumMap.fromEnum(Color, {
>   [Color.Red]: '#f00',
>   [Color.Green]: '#0f0',
>   [Color.Blue]: '#00f',
> } as const);
>
> const value: unknown = router.query.color;
> let colorHex: '#f00' | '#0f0' | '#00f';
>
> if (colorToHexMap.has(value)) {
>   colorHex = colorToHexMap.get(value);
> }
> ```

#### `EnumMap.prototype.keys()`

#### `EnumMap.prototype.values()`

#### `EnumMap.prototype.entries()`

#### `EnumMap.prototype.forEach()`

> These methods behave identically to the `Map` class.
> [See MDN documentation](http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
> for more details.
