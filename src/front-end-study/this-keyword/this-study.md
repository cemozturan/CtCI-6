In JavaScript, `this` is the context of a function invocation (a.k.a. execution). The language has 4 function invocation types:

* function invocation: `alert('Hello World!')`
* method invocation: `console.log('Hello World!')`
* constructor invocation: `new RegExp('\\d')`
* indirect invocation: `alert.call(undefined, 'Hello World!')`

Each invocation type defines the context in its own way, so `this` behaves differently than the developer expects.

The key to understanding the `this` keyword is having a clear view of function invocation and how it impacts the context.

Before starting, let's familiarize with a couple of terms:

* __Invocation of a function__ is executing the code that makes the body of a function, or simply calling the function. For example `parseInt` function invocation is `parseInt('15')`.
* __Context__ of an invocation is the value of `this` within function body.
* __Scope__ of a function is the set of variables and functions accessible within a function body.

## 1) Function invocation

__Function invocation__ is performed when an expression that evaluates to a function object is followed by an open parenthesis `(`, a comma separated list of arguments expressions and a close parenthesis `)`. For example `parseInt('18')`.
```javascript
function hello(name) {
  return 'Hello ' + name + '!';
}
// Function invocation
const message = hello('World');
```
`hello('World')` is a function invocation: `hello` expression evaluates to a function object, followed by a pair of parenthesis with the `'World'` argument.

Function invocation expression cannot be a property accessor like `obj.myFunc()`, which creates a method invocation. For example `[1,5].join(',')` is not a function invocation, but a method call. Please remember the distinction between them.

A more advanced example is the IIFE (immediately-invoked function expression):
```javascript
// IIFE
const message = (function(name) {
  return 'Hello ' + name + '!';
})('World');
```
IIFE is a function invocation too: the first pair of parenthesis `(function(name) {...})` is an expression that evaluates to a function object, followed by the pair of parenthesis with `'World'` argument: ('World').

#### 1.1) this in a function invocation

`this` is the __global object__ in a function invocation.

The global object is determined by the execution environment. In a browser, the global object is `window` object. In a function invocation, the execution context is the global object.
```javascript
function sum(a, b) {
  console.log(this === window); // => true
  this.myNumber = 20; // add 'myNumber' property to global object
  return a + b;
}
// sum() is invoked as a function and JS automatically sets this as the global object (window in a browser).
sum(15, 16);     // => 31
window.myNumber; // => 20
```

When this is used outside of any function scope (the topmost scope: global execution context), it also equals to the global object:
```javascript
console.log(this === window); // => true
this.myString = 'Hello World!';
console.log(window.myString); // => 'Hello World!'
```

#### 1.2) this in a function invocation, strict mode
`this` is `undefined` in a function invocation in strict mode.

The strict mode is available starting ECMAScript 5.1, which is a restricted variant of JavaScript. It provides better security and stronger error checking.

Once enabled, the strict mode affects the execution context, making `this` to be undefined in a regular function invocation. The execution context is not the global object anymore, contrary to above case.
```javascript
function nonStrictSum(a, b) {
  // non-strict mode
  console.log(this === window); // => true
  return a + b;
}
function strictSum(a, b) {
  'use strict';
  // strict mode is enabled
  console.log(this === undefined); // => true
  return a + b;
}
// nonStrictSum() is invoked as a function in non-strict mode
// this in nonStrictSum() is the window object
nonStrictSum(5, 6); // => 11
// strictSum() is invoked as a function in strict mode
// this in strictSum() is undefined
strictSum(8, 12); // => 20
```

#### 1.3) Pitfall: this in an inner function
A common trap with the function invocation is thinking that `this` is the same in an inner function as in the outer function.

The context of the inner function (except arrow functions) depends only on its own invocation type, but not on the outer function's context.

To make `this` have a desired value, modify the inner function's context with indirect invocation (using `.call()` or `.apply()`) or create a bound function (using `.bind()`).

The following example is calculating a sum of two numbers:
```javascript
const numbers = {
  numberA: 5,
  numberB: 10,
  sum: function() {
    console.log(this === numbers); // => true
    function calculate() {
      // this is window or undefined in strict mode
      console.log(this === numbers); // => false
      return this.numberA + this.numberB;
    }
    return calculate();
  }
};
numbers.sum(); // => NaN or throws TypeError in strict mode
```
`numbers.sum()` is a method invocation on an object, thus `this` equals `numbers`. The `calculate()` function is defined inside `sum()`, so you might expect to have `this` as `numbers` object in when invoking `calculate()` too.

`calculate()` is a function invocation (but not method invocation), thus here `this` is the global object `window` or `undefined` in strict mode. Even if the outer function `numbers.sum()` has the context as `numbers` object, it doesn't have influence here.

The invocation result of `numbers.sum()` is `NaN` (or an error is thrown `TypeError: Cannot read property 'numberA' of undefined in strict mode`). Definitely not the expected result 5 + 10 = 15. All because `calculate()` is not invoked correctly.

To solve the problem, `calculate()` function must execute with the same context as the `numbers.sum()` method, to access `this.numberA` and `this.numberB` properties.

One solution is to change manually the context of `calculate()` to the desired one by calling `calculate.call(this)` (an indirect invocation of a function):
```javascript
const numbers = {
  numberA: 5,
  numberB: 10,
  sum: function() {
    console.log(this === numbers); // => true
    function calculate() {
      console.log(this === numbers); // => true
      return this.numberA + this.numberB;
    }
    // use .call() method to modify the context
    return calculate.call(this);
  }
};
numbers.sum(); // => 15
```
`calculate.call(this)` executes `calculate()` function as usual, but additionally modifies the context to a value specified as the first parameter.

Now `this.numberA + this.numberB` is same as `numbers.numberA + numbers.numberB`. The function returns the expected result 5 + 10 = 15.

Another solution, slightly better, is to use an arrow function:
```javascript
const numbers = {
  numberA: 5,
  numberB: 10,
  sum: function() {
    console.log(this === numbers); // => true
    const calculate = () => {
      console.log(this === numbers); // => true
      return this.numberA + this.numberB;
    }
    return calculate();
  }
};
numbers.sum(); // => 15
```
The arrow function resolves `this` lexically, or, in other words, uses `this` value of `numbers.sum()` method.

## 2) Method invocation
A method is a function stored in a property of an object. __Method invocation__ is performed when an expression in a form of property accessor that evaluates to a function object is followed by an open parenthesis `(`, a comma separated list of arguments expressions and a close parenthesis `)`. An example is `[1, 2].join(',')`.

Understanding the difference between __function invocation__ and __method invocation__ is important!

The method invocation requires a property accessor form to call the function (`obj.myFunc()` or `obj['myFunc']()`), while function invocation does not (`myFunc()`).
```javascript
const words = ['Hello', 'World'];
words.join(', ');   // method invocation
const obj = {
  myMethod() {
    return new Date().toString();
  }
};
obj.myMethod();     // method invocation
const func = obj.myMethod;
func();             // function invocation
parseFloat('16.6'); // function invocation
```

#### 2.1) this in a method invocation
`this` is the object that owns the method in a method invocation.
```javascript
const calc = {
  num: 0,
  increment() {
    console.log(this === calc); // => true
    this.num += 1;
    return this.num;
  }
};
// method invocation. this is calc
calc.increment(); // => 1
calc.increment(); // => 2
```

#### 2.2) Pitfall: separating method from its object
A method can be extracted from an object into a separated variable `const alone = myObj.myMethod`. When the method is called alone like `alone()`, detached from the original object, then a function invocation happens, where `this` is the global object `window` (or undefined in strict mode).

A bound function `const alone = myObj.myMethod.bind(myObj)` fixes the context by binding `this` the object that owns the method.
```javascript
function Pet(type, legs) {
  this.type = type;
  this.legs = legs;
  this.logInfo = function() {
    console.log(this === myCat); // => false
    console.log(`The ${this.type} has ${this.legs} legs`); // logs "The undefined has undefined legs"
  }
}
const myCat = new Pet('Cat', 4);
setTimeout(myCat.logInfo, 1000);
```
Here, the method is separated from its object when passed as a parameter: `setTimout(myCat.logInfo)`. The following cases are equivalent:
```javascript
setTimout(myCat.logInfo);
// is equivalent to:
const extractedLogInfo = myCat.logInfo;
setTimout(extractedLogInfo);
```
When the separated `logInfo` is invoked as a function, `this` is global object or undefined in strict mode (but not `myCat` object). So the object information does not log correctly.

Using `.bind()` method, the separated method is bound with `myCat` object, the context problem is solved:
```javascript
function Pet(type, legs) {
  this.type = type;
  this.legs = legs;
  this.logInfo = function() {
    console.log(this === myCat); // => true
    console.log(`The ${this.type} has ${this.legs} legs`);
  };
}
const myCat = new Pet('Cat', 4);
// Create a bound function
const boundLogInfo = myCat.logInfo.bind(myCat);
// logs "The Cat has 4 legs"
setTimeout(boundLogInfo, 1000);
```

An alternative solution is to define `logInfo()` method as an arrow function, which binds `this` lexically:
```javascript
function Pet(type, legs) {
  this.type = type;
  this.legs = legs;
  this.logInfo = () => {
    console.log(this === myCat); // => true
    console.log(`The ${this.type} has ${this.legs} legs`);
  };
}
const myCat = new Pet('Cat', 4);
// logs "The Cat has 4 legs"
setTimeout(myCat.logInfo, 1000);
```
If you'd like to use classes and bind this to the class instance in your method, use the arrow function as a class property:
```javascript
class Pet {
  constructor(type, legs) {
    this.type = type;
    this.legs = legs;
  }
  logInfo = () => {
    console.log(this === myCat); // => true
    console.log(`The ${this.type} has ${this.legs} legs`);
  }
}
const myCat = new Pet('Cat', 4);
// logs "The Cat has 4 legs"
setTimeout(myCat.logInfo, 1000);
```

## 3) Constructor invocation
Constructor invocation is performed when `new` keyword is followed by an expression that evaluates to a function object, an open parenthesis `(`, a comma separated list of arguments expressions and a close parenthesis `)`.

Examples of construction invocation: `new Pet('cat', 4)`, `new RegExp('\\d')`.
```javascript
function Country(name, traveled) {
  this.name = name ? name : 'United Kingdom';
  this.traveled = Boolean(traveled); // transform to a boolean
}
Country.prototype.travel = function() {
  this.traveled = true;
};
// Constructor invocation
const france = new Country('France', false);
// Constructor invocation - If the constructor is called without arguments, then the parenthesis pair can be omitted.
const unitedKingdom = new Country;
france.travel(); // Travel to France
```

Starting ECMAScript 2015, JavaScript allows to define constructors using `class` syntax:
```javascript
class City {
  constructor(name, traveled) {
    this.name = name;
    this.traveled = false;
  }
  travel() {
    this.traveled = true;
  }
}
// Constructor invocation
const paris = new City('Paris', false);
paris.travel();
```
`new City('Paris')` is a constructor invocation. The object's initialization is handled by a special method in the class: `constructor`, which has this as the newly created object.

The role of the constructor function is to initialize the instance. A constructor call creates a new empty object, which inherits properties from the constructor's prototype.

When a property accessor `myObject.myFunction` is preceded by `new` keyword, JavaScript performs a __constructor invocation__, but not a __method invocation__.

For example `new myObject.myFunction()`: the function is first extracted using a property accessor `extractedFunction = myObject.myFunction`, then invoked as a constructor to create a new object: `new extractedFunction()`.

#### 3.1) this in a constructor invocation

`this` is the newly created object in a constructor invocation.
```javascript
function Foo () {
  // this is fooInstance
  this.property = 'Default Value';
}
// Constructor invocation
const fooInstance = new Foo();
fooInstance.property; // => 'Default Value'
```
`new Foo()` is making a constructor call where the context is `fooInstance`. Inside `Foo` the object is initialized: `this.property` is assigned with a default value.

The same scenario happens when using class syntax (available in ES2015), only the initialization happens in the constructor method:
```javascript
class Bar {
  constructor() {
    // this is barInstance
    this.property = 'Default Value';
  }
}
// Constructor invocation
const barInstance = new Bar();
barInstance.property; // => 'Default Value'
```
At the time when `new Bar()` is executed, JavaScript creates an empty object and makes it the context of the `constructor()` method. Now you can add properties to object using `this` keyword: `this.property = 'Default Value'`.

#### 3.2) Pitfall: forgetting about new
The following example illustrates the problem:
```javascript
function Vehicle(type, wheelsCount) {
  this.type = type;
  this.wheelsCount = wheelsCount;
  return this;
}
// Function invocation
const car = Vehicle('Car', 4);
car.type; // => 'Car'
car.wheelsCount // => 4
car === window // => true
```
Here, `Vehicle('Car', 4)` is a function invocation. `this` is window object in a function invocation, so properties are set on the window object. This is a mistake. A new object is not created.

Make sure to use new operator in cases when a constructor call is expected:
```javascript
function Vehicle(type, wheelsCount) {
  if (!(this instanceof Vehicle)) {
    throw Error('Error: Incorrect invocation');
  }
  this.type = type;
  this.wheelsCount = wheelsCount;
  return this;
}
// Constructor invocation
const car = new Vehicle('Car', 4);
car.type               // => 'Car'
car.wheelsCount        // => 4
car instanceof Vehicle // => true
// Function invocation. Throws an error.
const brokenCar = Vehicle('Broken Car', 3);
```
`new Vehicle('Car', 4)` works well: a new object is created and initialized because the `new` keyword is present in the constructor invocation.

A verification is added in the constructor function: `this instanceof Vehicle`, to make sure that execution context is a correct object type — whenever `Vehicle('Broken Car', 3)` is executed without `new` an exception is thrown: `Error: Incorrect invocation`.

## 4) Indirect invocation
Indirect invocation is performed when a function is called using `myFun.call()` or `myFun.apply()` methods.

Functions in JavaScript are first-class objects, which means that a function is an object. The type of function object is `Function`.

From the list of methods that a function object has, `.call()` and `.apply()` are used to invoke the function with a configurable context.

`myFunction.call(thisArg, arg1, arg2, ...)` accepts the first argument `thisArg` as the context of the invocation and a list of arguments `arg1, args2, ...` that are passed as arguments to the called function.

`myFunction.apply(thisArg, [arg1, arg2, ...])` accepts the first argument `thisArg` as the context of the invocation and an array of arguments `[arg1, args, ...]` that are passed as arguments to the called function.

The following example demonstrates the indirect invocation:
```javascript
function sum(number1, number2) {
  return number1 + number2;
}
sum.call(undefined, 10, 2);    // => 12
sum.apply(undefined, [10, 2]); // => 12
```
`sum.call()` and `sum.apply()` both invoke the function with 10 and 2 arguments.

#### 4.1) this in an indirect invocation

`this` is the first argument of `.call()` or `.apply()` in an indirect invocation.
```javascript
const rabbit = { name: 'White Rabbit' };
function concatName(string) {
  console.log(this === rabbit); // => true
  return string + this.name;
}
// Indirect invocations
concatName.call(rabbit, 'Hello ');  // => 'Hello White Rabbit'
concatName.apply(rabbit, ['Bye ']); // => 'Bye White Rabbit'
```
The indirect invocation is useful when a function should be executed with a specific context. For example, to solve the context problems with function invocation, where `this` is always `window` or `undefined` in strict mode. It can be used to simulate a method call on an object (see the previous code sample).

Another practical example is creating hierarchies of classes in ES5 to call the parent constructor:
```javascript
function Runner(name) {
  console.log(this instanceof Rabbit); // => true
  this.name = name;
}
function Rabbit(name, countLegs) {
  console.log(this instanceof Rabbit); // => true
  // Indirect invocation. Call parent constructor.
  Runner.call(this, name);
  this.countLegs = countLegs;
}
const myRabbit = new Rabbit('White Rabbit', 4);
myRabbit; // { name: 'White Rabbit', countLegs: 4 }
```
`Runner.call(this, name)` inside Rabbit makes an indirect call of the parent function to initialize the object.

## 5) Bound function

A bound function is a function whose context and/or arguments are bound to specific values. You create a bound function using `.bind()` method. The original and bound functions share the same code and scope, but different contexts and arguments on execution.

`myFunc.bind(thisArg, arg1, arg2, ...)` accepts the first argument `thisArg` as the context and an optional list of arguments `arg1, arg2, ...` to bound to. `.bind()` returns a new function where context is bound to `thisArg` and arguments to `arg1, arg2, ...`.
```javascript
function multiply(number) {
  'use strict';
  return this * number;
}
// create a bound function with context
const double = multiply.bind(2);
// invoke the bound function
double(3); // => 6
double(10); // => 20
```
`multiply.bind(2)` returns a new function object double, which is bound with number 2. multiply and double have the same code and scope.

Contrary to `.apply()` and `.call()` methods, which invoke the function right away, the `.bind()` method only returns a new function supposed to be invoked later with a pre-defined `this` value.

#### 5.1) this inside a bound function

`this` is the first argument of `myFunc.bind(thisArg)` when invoking a bound function.

The role of `.bind()` is to create a new function, whose invocation will have the context as the first argument passed to `.bind()`. It is a powerful technique that allows creating functions with a predefined `this` value.
```javascript
const numbers = {
  array: [3, 5, 10],
  getNumbers() {
    return this.array;
  }
};
// Create a bound function
const boundGetNumbers = numbers.getNumbers.bind(numbers);
boundGetNumbers(); // => [3, 5, 10]
// Extract method from object
const simpleGetNumbers = numbers.getNumbers;
simpleGetNumbers(); // => undefined or throws an error in strict mode
```
`numbers.getNumbers.bind(numbers)` returns a function `boundGetNumbers` which context is bound to `numbers`. Then `boundGetNumbers()` is invoked with `this` as `numbers` and returns the correct array object.

The function `numbers.getNumbers` is extracted into a variable `simpleGetNumbers` without binding. On later function invocation `simpleGetNumbers()` has `this` as `window` or undefined in strict mode, but not `numbers` object. In this case `simpleGetNumbers()` will not return correctly the array.

#### 5.2) Tight context binding
`.bind()` makes a permanent context link and will always keep it. A bound function cannot change its linked context when using `.call()` or `.apply()` with a different context or even a rebind doesn't have any effect.

Only the constructor invocation of a bound function can change an already bound context, but this is not something you would normally do (constructor invocation must use regular, non-bound functions).
```javascript
function getThis() {
  'use strict';
  return this;
}
const one = getThis.bind(1);
one();         // => 1
one.call(2);   // => 1
one.apply(2);  // => 1
one.bind(2)(); // => 1
new one();     // => Object
```
Only `new one()` changes the context of the bound function. Other types of invocation always have this equal to 1.

## 6) Arrow function

Arrow function is designed to declare the function in a shorter form and lexically bind the context.

It doesn't provide the `arguments` object, opposed to a regular function. The missing `arguments` is fixed using ES2015 rest parameters:
```javascript
const sumArguments = (...args) => {
  console.log(typeof arguments); // => 'undefined'
  return args.reduce((result, item) => result + item);
};
console.log(sumArguments.name);      // => 'sumArguments'
sumArguments(5, 5, 6); // => 16
```
#### 6.1) this in arrow function
`this` is the enclosing context where the arrow function is defined.

The arrow function doesn't create its own execution context but takes `this` from the outer function where it is defined. In other words, the arrow function resolves `this` lexically.
```javascript
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  log() {
    console.log(this === myPoint); // => true
    setTimeout(() => {
      console.log(this === myPoint);      // => true
      console.log(this.x + ':' + this.y); // => '95:165'
    }, 1000);
  }
}
const myPoint = new Point(95, 165);
myPoint.log();
```
`setTimeout()` calls the arrow function with the same context (`myPoint` object) as the `log()` method. As seen, the arrow function "inherits" the context from the function where it is defined.

A regular function in this example would create its own context (`window` or undefined in strict mode). So to make the same code work correctly with a function expression it's necessary to manually bind the context: `setTimeout(function() {...}.bind(this))`. This is verbose, and using an arrow function is a cleaner and shorter solution.

If the arrow function is defined in the topmost scope (outside any function), the context is always the global object (`window` in a browser):
```javascript
const getContext = () => {
 console.log(this === window); // => true
 return this;
};
console.log(getContext() === window); // => true
```
An arrow function is bound with the lexical `this` once and forever. `this` cannot be modified even when using the context modification methods:
```javascript
const numbers = [1, 2];
(function() { 
  const get = () => {
    console.log(this === numbers); // => true
    return this;
  };
  
  console.log(this === numbers); // => true
  get(); // => [1, 2]
  
  // Try to change arrow function context manually
  get.call([0]);  // => [1, 2]
  get.apply([0]); // => [1, 2]
  
  get.bind([0])(); // => [1, 2]
}).call(numbers);
```
No matter how the arrow function `get()` is called, it always keeps the lexical context numbers. Indirect call with other context `get.call([0])` or `get.apply([0])`, rebinding `get.bind([0])()` have no effect.

An arrow function cannot be used as a constructor. Invoking it as a constructor `new get()` throws an error: `TypeError: get is not a constructor.`

#### 6.2) Pitfall: defining method with an arrow function
You might want to use arrow functions to declare methods on an object. Fair enough: their declaration is quite short comparing to a function expression: `(param) => {...}` instead of `function(param) {..}`.
```javascript
function Period (hours, minutes) { 
  this.hours = hours;
  this.minutes = minutes;
}
Period.prototype.format = () => {
  console.log(this === window); // => true
  return this.hours + ' hours and ' + this.minutes + ' minutes';
};
const walkPeriod = new Period(2, 30);
walkPeriod.format(); // => 'undefined hours and undefined minutes'
```
Since `format` is an arrow function and is defined in the global context (topmost scope), it has `this` as `window` object.

Even if `format` is executed as a method on an object `walkPeriod.format()`, `window` is kept as the context of invocation. It happens because the arrow function has a static context that doesn't change on different invocation types.

The method returns `'undefined hours and undefined minutes'`, which is not the expected result.

The function expression solves the problem because a regular function does change its context depending on invocation:
```javascript
function Period (hours, minutes) {
  this.hours = hours;
  this.minutes = minutes;
}
Period.prototype.format = function() {
  console.log(this === walkPeriod); // => true
  return this.hours + ' hours and ' + this.minutes + ' minutes';
};
const walkPeriod = new Period(2, 30);
walkPeriod.format(); // => '2 hours and 30 minutes'
```
`walkPeriod.format()` is a method invocation on an object with the context `walkPeriod` object. `this.hours` evaluates to 2 and `this.minutes` to 30, so the method returns the correct result: '2 hours and 30 minutes'.

## 7) Conclusion

Because the function invocation has the biggest impact on `this`, from now on do not ask yourself:

__Where is `this` taken from?__

but do ask yourself:

__How is the function invoked?__

For an arrow function ask yourself:

__What is `this` inside the outer function where the arrow function is defined?__

This mindset is correct when dealing with `this` and will save you from the headache.