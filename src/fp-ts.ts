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

const head = <A>(as: ReadonlyArray<A>): O.Option<A> =>
  as.length === 0 ? O.none : O.some(as[0]);

console.log(head([5, 6, 7]));
console.log([]);

// const getBestMovie = (titles: ReadonlyArray<string>): O.Option<string> =>
//   pipe(
//     titles,
//     head,
//     O.map((s) => s.toUpperCase()),
//     O.map((s) => `Best - ${s}`)
//   );

const toUppercase = (s: string) => s.toUpperCase();
const addPrefix = (prefix: string) => (s: string) => `${prefix}${s}`;

const getBestMovie = (titles: ReadonlyArray<string>): O.Option<string> =>
  pipe(titles, head, O.map(toUppercase), O.map(addPrefix("Best - ")));

console.log(getBestMovie(["Jaws", "Star Wars"]));
console.log(getBestMovie([]));

// const inverseHead = (ns: ReadonlyArray<number>): O.Option<number> =>
//   pipe(ns, head, O.map(inverse), O.flatten);

const inverseHead = (ns: ReadonlyArray<number>): O.Option<number> =>
  pipe(ns, head, O.chain(inverse));
console.log(inverseHead([2, 6, 8]));
console.log(inverseHead([0, 6, 8]));

const isEven = (a: number) => a % 2 === 0;

const getEven = O.fromPredicate(isEven);
// (a: number) => Option<number>

console.log(getEven(4));
console.log(getEven(3));

type Discount = Readonly<{
  percentage: number;
  expired: boolean;
}>;

const isDiscountValid = (discount: Discount): boolean => !discount.expired;

const getDiscountText = (discount: Discount): O.Option<string> =>
  pipe(
    discount,
    O.fromPredicate(isDiscountValid),
    // Option<Discount>
    O.map(({ percentage }) => `${percentage}% DISCOUNT!`)
  );

console.log(getDiscountText({ percentage: 10, expired: false }));
console.log(getDiscountText({ percentage: 20, expired: true }));

type Circle = { type: "Circle"; radius: number };

type Square = { type: "Square"; side: number };

type Shape = Circle | Square;

const isCircle = (s: Shape): s is Circle => s.type === "Circle";

const getCircle = O.fromPredicate(isCircle);
// (s: Shape) => Option<Circle>

const circle: Shape = { type: "Circle", radius: 3 };
const square: Square = { type: "Square", side: 4 };

console.log(getCircle(circle));
// O.some(circle) typed as Option<Circle>
console.log(getCircle(square));
// O.none typed as Option<Circle>
