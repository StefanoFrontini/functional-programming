import { flow, identity, pipe } from "fp-ts/function";

import * as O from "fp-ts/Option";

const size = (s: string) => s.length;

console.log(pipe("hello", size));

const isAtLeast3 = (n: number) => n >= 3;

console.log(pipe("hello", size, isAtLeast3));

const trim = (s: string) => s.trim();

console.log(pipe(" hi ", trim, size, isAtLeast3));

// same as
console.log(isAtLeast3(size(trim(" hi "))));

const isValid = (s: string) => pipe(s, trim, size, isAtLeast3);

console.log(isValid(" hi "));

// flow

const isLongEnough = flow(size, isAtLeast3); // (s: string) => boolean

console.log(isLongEnough("hello"));

const isLongEnough2 = (s: string) => pipe(s, size, isAtLeast3);

console.log(isLongEnough2("hello"));

const concat = (s1: string, s2: string) => s1 + s2;

const isValid2 = flow(concat, trim, size, isAtLeast3);

console.log(isValid2("Ste ", " fano "));

// Option

const inverse = (x: number): O.Option<number> =>
  x === 0 ? O.none : O.some(1 / x);

console.log(inverse(2));
console.log(inverse(0));

const getUiMessageWithInverse = (x: number): string =>
  pipe(
    x,
    inverse, // Option<number>
    O.match(
      () => `Cannot get the inverse of ${x}.`,
      (ix) => `The inverse of ${x} is ${ix}`
    ) // string
  );

console.log(getUiMessageWithInverse(2));
console.log(getUiMessageWithInverse(0));

const safeInverse = (x: number): number =>
  pipe(
    x,
    inverse, // Option<number>
    O.match(() => 0, identity) // number
  );

console.log(safeInverse(2));
console.log(safeInverse(0));

const safeInverse2 = (x: number): number =>
  pipe(
    x,
    inverse,
    O.getOrElse(() => 0)
  );

console.log(safeInverse2(2));
console.log(safeInverse2(0));

const value1: number | null = 3;
const value2: number | null = null;

console.log(O.fromNullable(value1));
console.log(O.fromNullable(value2));
