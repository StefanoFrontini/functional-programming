// type Compose = <F, G>(f: F) => (g: G) => F
type Compose = <A, B, C>(f: (x: B) => C, g: (x: A) => B) => (x: A) => C;

const compose: Compose = (f, g) => (x) => f(g(x));

type DivideTwo = (x: number) => number;

const divideTwo: DivideTwo = (x) => 2 / x;

console.log(divideTwo(8));
console.log(divideTwo(0));

function normal_sum(a: number, b: number) {
  return a + b;
}

console.log(normal_sum(1, 2));

type Sum = (a: number) => (b: number) => number;
// curried sum
const sum: Sum = (a) => (b) => a + b;
console.log(sum(1)(2));

type Increment = (x: number) => number;
// const increment: Increment = (x) => sum(1)(x);
// sum(1) returns a function(b) => 1 + b
const increment: Increment = sum(1);

console.log(increment(10));

type Decrement = (x: number) => number;
const decrement: Decrement = sum(-1);

//general version of curry function that receives sum function and returns the curried version
type Curry = <A, B, C>(f: (a: A, b: B) => C) => (a: A) => (b: B) => C;
const curry: Curry = (f) => (a) => (b) => f(a, b);

const sum2: Sum = curry(normal_sum);

console.log(sum2(1)(2));

// Recursion

type SumAll = (xs: number[]) => number;

const sumAll: SumAll = (xs) =>
  xs.length === 0 ? 0 : xs[0] + sumAll(xs.slice(1));

console.log(sumAll([1, 2, 3, 4]));

const composed = compose(increment, divideTwo);
console.log(composed(8));
console.log(composed(0));

type Option<A> = Some<A> | None;

interface Some<A> {
  _tag: "Some";
  value: A;
}
interface None {
  _tag: "None";
}
const some = <A>(x: A): Option<A> => ({ _tag: "Some", value: x });
const none: Option<never> = { _tag: "None" };

const isNone = <A>(x: Option<A>): x is None => x._tag === "None";

type DivideTwo2 = (x: number) => Option<number>;
const divideTwo2: DivideTwo2 = (x) => (x === 0 ? none : some(2 / x));

const composed2 = compose(
  (x: Option<number>) => (isNone(x) ? none : some(increment(x.value))),
  divideTwo2
);

console.log(composed2(8));
console.log(composed2(0));

type Either<E, A> = Left<E> | Right<A>;

interface Left<E> {
  _tag: "Left";
  left: E;
}
interface Right<A> {
  _tag: "Right";
  right: A;
}

const left = <E, A = never>(e: E): Either<E, A> => ({ _tag: "Left", left: e });
const right = <E, A = never>(a: A): Either<E, A> => ({
  _tag: "Right",
  right: a,
});

const isLeft = <E, A>(x: Either<E, A>): x is Left<E> => x._tag === "Left";
const isRight = <E, A>(x: Either<E, A>): x is Right<A> => x._tag === "Right";

function divideTwoIfEven(num: number): Either<string, number> {
  if (num === 0) {
    return left("Cannot divide by zero");
  } else if (num % 2 !== 0) {
    return left("num is not even");
  } else {
    return right(2 / num);
  }
}

console.log(divideTwoIfEven(8));
console.log(divideTwoIfEven(0));
console.log(divideTwoIfEven(3));

const composed3 = compose(
  (x) => (isLeft(x) ? x : right(increment(x.right))),
  divideTwoIfEven
);

console.log(composed3(8));
console.log(composed3(0));
console.log(composed3(3));

// Linked List

type List<A> = Nil | Cons<A>;

interface Nil {
  _tag: "Nil";
}

interface Cons<A> {
  _tag: "Cons";
  head: A;
  tail: List<A>;
}

const nil: List<never> = { _tag: "Nil" };
const cons = <A>(head: A, tail: List<A>): List<A> => ({
  _tag: "Cons",
  head,
  tail,
});

const isNil = <A>(x: List<A>): x is Nil => x._tag === "Nil";

// 1,2,3
const myList = cons(1, cons(2, cons(3, nil)));

console.log(myList);
console.log(JSON.stringify(myList, null, 2));

type ShowList = <A>(xs: List<A>) => string;

// const showList: ShowList = (xs) =>
//   isNil(xs)
//     ? ""
//     : `${xs.head}` + (isNil(xs.tail) ? "" : ", " + showList(xs.tail));
const showList: ShowList = (xs) =>
  isNil(xs)
    ? ""
    : `${xs.head}${isNil(xs.tail) ? "" : `, ${showList(xs.tail)}`}`;

console.log(showList(myList));
