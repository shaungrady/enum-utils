# Enum Utils

Make enums more intuitive to use with familiar `Set` and `Map` interfaces! Works
with numeric, string, and heterogeneous enums, and allows for easy enum type
guarding, creation of enum subsets, and safe mapping of enums to anything
else—even other enums!

###### Package: [GitHub](https://github.com/shaungrady/enum-utils), [npm](https://www.npmjs.com/package/@sg.js/enum-utils)  |  Releases: [Changelog](https://github.com/shaungrady/enum-utils/releases)  |  Author: [Shaun Grady](https://shaungrady.com/)

## Install

```sh
npm install @sg.js/enum-utils
```

_Requires TypeScript `>=4.7`_

## What's Inside

### Classes

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

### Functions

- `enumToSet`: Convert an enum object to Set of enum members.
- `isEnumMember`: Type guard for a given enum.
- `isValidEnumMember`: Type guard for values that are strings and finite
  numbers.

### Types

- `EnumSetMembers<EnumSet>`: Returns either the original enum, or a union type
  of enum members for enum subsets.
- `EnumMapMembers<EnumMap>`: Returns either the original enum, or a union type
  of enum members for enum subsets.
- `EnumMapValues<EnumMap>`: Returns a union type of the EnumMap's values; works
  best when the map object includes a
  [const assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions).
- `EnumMember`: A finite number or string.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Usage Example](#usage-example)
- [EnumSet](#enumset)
  - [Construction](#construction)
    - [`EnumSet()`](#enumset)
  - [Static methods](#static-methods)
    - [`EnumSet.fromEnum()`](#enumsetfromenum)
  - [Instance methods](#instance-methods)
    - [`EnumSet.prototype.has()`](#enumsetprototypehas)
    - [`EnumSet.prototype.subset()`](#enumsetprototypesubset)
    - [`EnumSet.prototype.toEnumMap()`](#enumsetprototypetoenummap)
    - [`EnumSet.prototype.size`](#enumsetprototypesize)
    - [`EnumSet.prototype.keys()`](#enumsetprototypekeys)
    - [`EnumSet.prototype.values()`](#enumsetprototypevalues)
    - [`EnumSet.prototype.entries()`](#enumsetprototypeentries)
    - [`EnumSet.prototype.forEach()`](#enumsetprototypeforeach)
- [EnumMap](#enummap)
  - [Construction](#construction-1)
    - [`EnumMap()`](#enummap)
  - [Static methods](#static-methods-1)
    - [`EnumMap.fromEnum()`](#enummapfromenum)
  - [Instance methods](#instance-methods-1)
    - [`EnumMap.prototype.has()`](#enummapprototypehas)
    - [`EnumMap.prototype.get()`](#enummapprototypeget)
    - [`EnumMap.prototype.size`](#enummapprototypesize)
    - [`EnumMap.prototype.keys()`](#enummapprototypekeys)
    - [`EnumMap.prototype.values()`](#enummapprototypevalues)
    - [`EnumMap.prototype.entries()`](#enummapprototypeentries)
    - [`EnumMap.prototype.forEach()`](#enummapprototypeforeach)
- [enumToSet()](#enumtoset)
- [isEnumMember()](#isenummember)
- [isValidEnumMember()](#isvalidenummember)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage Example

```tsx
enum Priority {
  Low = 'L',
  Medium = 'M',
  High = 'H',
  ThisIsFine = 'OhNo',
}

// Define our base EnumSet with all Priority members
const priorities = EnumSet.fromEnum(Priority);
// EnumSets are immutable, so aliasing to another variable is safe.
const adminPriorities = priorities;

// Non-admins will only be allowed to use a subset of priorities.
const userPriorities = adminPriorities.subset([
  Priority.Low,
  Priority.Medium,
  Priority.High,
]);

// Create a map with values constrained to a union of i18n keys.
priorityI18nMap = priorities.toEnumMap<I18nKey>({
  [Priority.Low]: 'common.low',
  [Priority.Medium]: 'common.medium',
  [Priority.High]: 'common.high',
  [Priority.ThisIsFine]: 'common.makeItStop',
});
// EnumMaps can also be constructed like this:
//   EnumMap.fromEnum(Priority, { … } as const)
// However, value types aren't as easily constrained with a single type argument,
// so using the `as const` assertion for the mapping is recommended
// for maximum type safety.

const PrioritySelect = () => {
  const { t } = useTranslation();

  // Determine which Priority to set based on user's role
  const { isAdmin } = useSession();
  const allowedPriorities = isAdmin ? adminPriorities : userPriorities;

  // This component allows a `priorityLock` search param to be set that disables
  // the priority select with the given priority. Very secure. 👌
  const { query } = useRouter();
  const priorityLock: unknown = query.priorityLock;
  const hasPriorityLock = priorityLock != null;

  // Guard `priorityLock` to our Priority enum type
  if (hasPriorityLock && !allowedPriorities.has(priorityLock)) {
    const priorityList = [...allowedPriorities].join(', ');
    throw new Error(
      `searchParam 'lockPriority' must be one of: ${priorityList}.`
    );
  }

  const [priority, setPriority] = useState<Priority>(
    priorityLock ?? allowedPriorities.values().next().value
  );

  return (
    <Select
      onchange={setPriority}
      disabled={hasPriorityLock}
      optionValues={Array.from(allowedPriorities)}
      renderOption={(priority: Priority) => t(priorityI18nMap.get(priority))}
    />
  );
};
```

---

## EnumSet

### Construction

#### `EnumSet()`

Although `new EnumSet()` can be called with the same value signature of `Set`,
the type arguments aren't very developer-friendly; instead, it's recommended to
make use of the `EnumSet.fromEnum()` static method.

<br>

### Static methods

#### `EnumSet.fromEnum()`

Creates a new `EnumSet` instance from the given enum object.

```ts
fromEnum(Enum);
```

```ts
enum Color {
  Red,
  Green,
  Blue,
}

const colors = EnumSet.fromEnum(Color);
```

<br>

### Instance methods

#### `EnumSet.prototype.has()`

The **has()** method returns a boolean indicating whether an enum member with
the specified value exists in the `EnumSet` object or not, acting as a
[type guard](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates).

```ts
has(value);
```

```ts
const colors = EnumSet.fromEnum(Color);
const value: unknown = router.query.color;
let color: Color;

if (colorToHexMap.has(value)) {
  color = value;
}
```

<br>

#### `EnumSet.prototype.subset()`

The **subset()** method returns a new `EnumSet` instance containing only the
enum members specified, which must be members of the `EnumSet`.

```ts
subset([Enum]);
```

```ts
enum Locale {
  enUS = 'en-US',
  enGB = 'en-GB',
  frCA = 'fr-CA',
  esMX = 'es-MX',
  jaJP = 'ja-JP',
}

const siteLocales = EnumSet.from(Locale);

const videoLocales = siteLocales.subset([
  Locale.enUS,
  Locale.enGB,
  Locale.esMX,
]);

if (videoLocales.has(value)) {
  // typeof value ⮕ `Locale.enUS | Locale.enGB | Locale.esMX`
}
```

<br>

#### `EnumSet.prototype.toEnumMap()`

Returns an `EnumMap` instance that maps each enum member in the `EnumSet` to a
corresponding value in the given mappings object. The mapping object value types
may either be inferred or defined by the optional type argument. If inferred,
it's recommended to use the `as const` assertion on the mapping object to narrow
the value types.

```ts
EnumMap(mapping);
```

```ts
enum Locale {
  enUS = 'en-US',
  enGB = 'en-GB',
  frCA = 'fr-CA',
  esMX = 'es-MX',
}

const locales = EnumSet.from(Locale);

const localeFileSuffixes = locales.toEnumMap({
  [Locale.enUS]: 'en',
  [Locale.enGB]: 'en',
  [Locale.frCA]: 'fr-ca',
  [Locale.esMX]: 'es',
} as const);

// We can optionally constrain the values to a type
const localeI18nKeys = locales.toEnumMap<I18nKeys>({
  [Locale.enUS]: 'common.americanEnglish',
  [Locale.enGB]: 'common.britishEnglish',
  [Locale.frCA]: 'common.canadianFrench',
  [Locale.esMX]: 'common.mexicanSpanish',
});
```

<br>

#### `EnumSet.prototype.size`

#### `EnumSet.prototype.keys()`

#### `EnumSet.prototype.values()`

#### `EnumSet.prototype.entries()`

#### `EnumSet.prototype.forEach()`

These methods behave identically to the `Set` class.
[See MDN documentation](http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
for more details.

<br>

## EnumMap

### Construction

#### `EnumMap()`

Although `new EnumMap()` can be called with the same value signature of `Map`,
the type arguments aren't very developer-friendly; instead, it's recommended to
make use of the `EnumMap.fromEnum()` static method, or the
`EnumSet.prototype.toEnumMap()` instance method, which allows for typing the
mapping keys more easily.

<br>

### Static methods

#### `EnumMap.fromEnum()`

Returns an `EnumMap` instance that maps each enum member in the given enum to a
corresponding value in the given mappings object. The mapping object value types
may either be inferred or defined by the optional type argument. If inferred,
it's recommended to use the `as const` assertion on the mapping object to narrow
the value types.

```ts
fromEnum(Enum, mapping as const);
```

```ts
enum Color {
  Red,
  Green,
  Blue,
}

const colorHexMap = EnumMap.fromEnum(Color, {
  [Color.Red]: '#f00',
  [Color.Green]: '#0f0',
  [Color.Blue]: '#00f',
} as const);
```

<br>

### Instance methods

#### `EnumMap.prototype.has()`

The **has()** method returns a boolean indicating whether an enum member with
the specified value exists in the `EnumMap` object or not, acting as a
[type guard](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates).

```ts
has(value);
```

```ts
const colorToHexMap = EnumMap.fromEnum(Color, {
  [Color.Red]: '#f00',
  [Color.Green]: '#0f0',
  [Color.Blue]: '#00f',
} as const);

const value: unknown = router.query.color;
let color: Color;

if (colorToHexMap.has(value)) {
  color = value;
}
```

<br>

#### `EnumMap.prototype.get()`

The **get()** method returns a specified element from an `EnumMap` object. If
the key's value has been guarded by the **has()** method, then the return type
will be non-nullish. If the key is an illegal enum member type, then return type
will be `undefined`.

```ts
get(value);
```

```ts
const colorToHexMap = EnumMap.fromEnum(Color, {
  [Color.Red]: '#f00',
  [Color.Green]: '#0f0',
  [Color.Blue]: '#00f',
} as const);

const value: unknown = router.query.color;
let colorHex: '#f00' | '#0f0' | '#00f';

if (colorToHexMap.has(value)) {
  colorHex = colorToHexMap.get(value);
}
```

#### `EnumMap.prototype.size`

#### `EnumMap.prototype.keys()`

#### `EnumMap.prototype.values()`

#### `EnumMap.prototype.entries()`

#### `EnumMap.prototype.forEach()`

These methods behave identically to the `Map` class.
[See MDN documentation](http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
for more details.

## enumToSet()

Converts an enum runtime object to an array of its members. This is safe to use
with numeric, string, and heterogeneous enums.

```ts
enum Fruit {
  Apple = 'apple',
  Banana = 'banana',
  Orange = 'orange',
}

const fruitSet: EnumSet<Fruit> = enumToSet<Fruit>(Fruit);

console.log(fruitSet); // ⮕ Set { 'apple', 'banana', 'orange' }
```

## isEnumMember()

Checks if the given value is a valid member of the specified enum object, acting
as a type guard.

```ts
enum CatBreed {
  Siamese,
  NorwegianForestCat,
  DomesticShorthair,
}

if (isEnumMember(CatBreed, 'Greyhound')) {
  // …
}
```

## isValidEnumMember()

Type guards values as an eligible enum member: a finite number or string.

```ts
isValidEnumMember('foo'); // ⮕ true
isValidEnumMember(42); // ⮕ true

isValidEnumMember(NaN); // ⮕ false
isValidEnumMember({}); // ⮕ false
```
