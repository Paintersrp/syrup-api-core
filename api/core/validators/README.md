# SyValidator: Comprehensive Data Validation for TypeScript

**SyValidator** is a robust and versatile data validation library for TypeScript. It allows for thorough type checking and validation, making it an invaluable tool for any TypeScript project.

The library's intuitive API makes it easy to validate a variety of data types, including strings, numbers, arrays, and objects, amongst others. By providing a powerful suite of validators that can handle even the most complex validation scenarios, SyValidator ensures your data integrity and aids in creating reliable, bug-free applications.

---

## Table of Contents

1. [API Documentation](#api-documentation)
   - [assertExists](#assertexists)
   - [assertType](#asserttype)
   - [assertBoolean](#assertboolean)
   - [assertArray](#assertarray)
   - [assertObject](#assertobject)
   - [assertHasKey](#asserthaskey)
   - [assertHasKeys](#asserthaskeys)
   - [assertNumber](#assertnumber)
   - [assertNumberInRange](#assertnumberinrange)
   - [assertLengthInRange](#assertlengthinrange)
   - [assertMatchesRegex](#assertmatchesregex)
   - [assertAlphanumeric](#assertalphanumeric)
   - [assertDate](#assertdate)
   - [assertEmail](#assertemail)
   - [assertURL](#asserturl)
   - [assertUUID](#assertuuid)
2. [Contributing](#contributing)
3. [License](#license)

---

<a name="api-documentation"></a>

## API Documentation

### SyValidator Methods

<a name="assertexists"></a>

#### assertExists(options: AssertOptions<T>): NonNullable<T>

Ensures that the given data is not `null` or `undefined`.

<a name="asserttype"></a>

#### assertType(options: AssertTypeOptions<T>): T

Validates the data type of the provided value.

<a name="assertboolean"></a>

#### assertBoolean(options: AssertOptions<T>): BooleanReturn<T>

Asserts that the provided data is of boolean type.

<a name="assertarray"></a>

#### assertArray(options: AssertOptions<T>): T

Ensures the data provided is of array type.

<a name="assertobject"></a>

#### assertObject(options: AssertOptions<T>): T

Validates the data to ensure it's an object.

<a name="asserthaskey"></a>

#### assertHasKey(options: AssertKeyOptions<T, K>): RequestBody<T, K>

Asserts that a given object contains a specified key.

<a name="asserthaskeys"></a>

#### assertHasKeys(options: AssertKeysOptions<T, K>): RequestBody<T, K>

Verifies that a given object contains all the specified keys.

<a name="assertnumber"></a>

#### assertNumber(options: AssertOptions<number>): number

Asserts that the provided data is a number.

<a name="assertnumberinrange"></a>

#### assertNumberInRange(options: AssertRangeOptions<number>): number

Checks whether a given number falls within a specified range.

<a name="assertlengthinrange"></a>

#### assertLengthInRange(options: AssertRangeOptions<string | any[]>): string | any[]

Validates whether the length of the provided data is within a specified range.

<a name="assertmatchesregex"></a>

#### assertMatchesRegex(options: AssertRegexOptions<string>): StringReturn<string>

Verifies that the provided string matches a specified regex pattern.

<a name="assertalphanumeric"></a>

#### assertAlphanumeric(options: AssertOptions<string>): boolean

Checks whether the provided string is alphanumeric.

<a name="assertdate"></a>

#### assertDate(options: AssertOptions<string>): StringReturn<string>

Validates that the provided string represents a valid date.

<a name="assertemail"></a>

#### assertEmail(options: AssertOptions<string>): StringReturn<string>

Verifies that the provided string is a valid email address.

<a name="asserturl"></a>

#### assertURL(options: AssertOptions<string>): StringReturn<string>

Asserts that the provided string is a valid URL.

<a name="assertuuid"></a>

#### assertUUID(options: AssertOptions<string>): StringReturn<string>

Checks whether the provided string is a valid UUID.

---

<a name="contributing"></a>

## Contributing

SyValidator is a community-driven project, and we welcome contributions of all kinds. If you have a feature request, suggestion, or bug report, please open an issue on our GitHub page. We also welcome pull requests and are always thrilled to review proposed improvements or additions to the library.

<a name="license"></a>

## License

SyValidator is [MIT licensed](./LICENSE). We believe in the power of open source and encourage you to fork, modify, and distribute SyValidator as you see fit.

---

We hope you find SyValidator as useful as we do. Happy coding!
