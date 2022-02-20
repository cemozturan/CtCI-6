# Prescreen questions

## 1) What is the difference between const, let, and var?

| var | let | const |
| --- | --- | --- |
| The scope of the var keyword is the global or function scope. It means variables defined outside the function can be accessed globally, and variables defined inside a particular function can be accessed within the function. | The scope of a let variable is only block scoped. It can’t be accessible outside the particular block ({block}). | The scope of a const variable is only block scoped. It can’t be accessible outside the particular block ({block}). |
| It can be updated and re-declared into the scope. | It can be updated but cannot be re-declared into the scope. | It cannot be updated or re-declared into the scope. |
| It can be declared without initialization. | It can be declared without initialization. | It cannot be declared without initialization. |
| Gets hoisted, which means it can be accessed without initialization as its default value is “undefined”. | It cannot be accessed without initialization, as it returns an error. | It cannot be accessed without initialization, as it cannot be declared without initialization. |

## 2) Explain prototypical inheritance

In JavaScript, objects have a special hidden property `[[Prototype]]` (as named in the specification), that is either null or references another object. That object is called “a prototype”.

When we read a property from object, and it’s missing, JavaScript automatically takes it from the prototype. In programming, this is called “prototypal inheritance”.

The property `[[Prototype]]` is internal and hidden, but there are many ways to set it. One of them is to use the special name `__proto__`, like this:

```javascript
let animal = {
  eats: true,
  walk: () => {
    // ...
  }
};
let rabbit = {
  jumps: true
};
let longEar = {
  earLength: 10,
  __proto__: rabbit
};

rabbit.__proto__ = animal; // sets rabbit.[[Prototype]] = animal

alert( rabbit.eats ); // true - from animal
alert( rabbit.jumps ); // true - from rabbit
alert( longEar.walk ); // calls animal.walk
```

There are only 3 limitations:

1) The references can’t go in circles. JavaScript will throw an error if we try to assign `__proto__` in a circle.
2) The value of `__proto__` can be either an object or null. Other types are ignored.
3) Also it may be obvious, but still: there can be only one `[[Prototype]]`. An object may not inherit from two others.

Please note that `__proto__` is not the same as the internal `[[Prototype]]` property. It’s a getter/setter for `[[Prototype]]`. It’s a common mistake of novice developers not to know the difference between these two.

The `__proto__` property is a bit outdated. It exists for historical reasons, modern JavaScript suggests that we should use `Object.getPrototypeOf/Object.setPrototypeOf` functions instead that get/set the prototype.

By the specification, `__proto__` must only be supported by browsers. In fact though, all environments including server-side support `__proto__`, so we’re quite safe using it.

The prototype is only used for reading properties. Write/delete operations work directly with the object. In the example below, we assign its own walk method to rabbit:

```javascript
let animal = {
  eats: true,
  walk() { /* this method won't be used by rabbit */ }
};

let rabbit = {
  __proto__: animal
};

rabbit.walk = function() {
  alert("Rabbit! Bounce-bounce!");
};

rabbit.walk(); // Rabbit! Bounce-bounce!
```
From now on, rabbit.walk() call finds the method immediately in the object and executes it, without using the prototype.

#### The value of 'this'

`this` is not affected by prototypes at all.

No matter where the method is found: in an object or its prototype. In a method call, `this` is always the object before the dot.

That is actually a super-important thing, because we may have a big object with many methods, and have objects that inherit from it. And when the inheriting objects run the inherited methods, they will modify only their own states, not the state of the big object.

For instance, here `animal` represents a “method storage”, and `rabbit` makes use of it.

The call `rabbit.sleep()` sets `this.isSleeping` on the `rabbit` object:

```javascript
// animal has methods
let animal = {
  walk() {
    if (!this.isSleeping) {
      alert(`I walk`);
    }
  },
  sleep() {
    this.isSleeping = true;
  }
};

let rabbit = {
  name: "White Rabbit",
  __proto__: animal
};

// modifies rabbit.isSleeping
rabbit.sleep();

alert(rabbit.isSleeping); // true
alert(animal.isSleeping); // undefined (no such property in the prototype)
```

If we had other objects, like bird, snake, etc., inheriting from `animal`, they would also gain access to methods of `animal`. But this in each method call would be the corresponding object, evaluated at the call-time (before dot), not `animal`. So when we write data into this, it is stored into these objects.

As a result, methods are shared, but the object state is not.

#### for…in loop

The `for..in` loop iterates over inherited properties too.

For instance:

```javascript
let animal = {
  eats: true
};

let rabbit = {
  jumps: true,
  __proto__: animal
};

// Object.keys only returns own keys
alert(Object.keys(rabbit)); // jumps

// for..in loops over both own and inherited keys
for(let prop in rabbit) alert(prop); // jumps, then eats
```

If that’s not what we want, and we’d like to exclude inherited properties, there’s a built-in method `obj.hasOwnProperty(key)`: it returns true if obj has its own (not inherited) property named key.

So we can filter out inherited properties (or do something else with them):

```javascript
let animal = {
  eats: true
};

let rabbit = {
  jumps: true,
  __proto__: animal
};

for(let prop in rabbit) {
  let isOwn = rabbit.hasOwnProperty(prop);

  if (isOwn) {
    alert(`Our: ${prop}`); // Our: jumps
  } else {
    alert(`Inherited: ${prop}`); // Inherited: eats
  }
}
```

Here we have the following inheritance chain: `rabbit` inherits from `animal`, that inherits from `Object.prototype` (because `animal` is a literal object {...}, so it’s by default), and then null above it:

Note, there’s one funny thing. Where is the method `rabbit.hasOwnProperty` coming from? We did not define it. Looking at the chain we can see that the method is provided by `Object.prototype.hasOwnProperty`. In other words, it’s inherited.

…But why does `hasOwnProperty` not appear in the `for..in` loop like `eats` and `jumps` do, if `for..in` lists inherited properties?

The answer is simple: it’s not enumerable. Just like all other properties of `Object.prototype`, it has `enumerable:false` flag. And `for..in` only lists enumerable properties. That’s why it and the rest of the `Object.prototype` properties are not listed.

Almost all other key/value-getting methods, such as Object.keys, Object.values and so on ignore inherited properties. They only operate on the object itself. Properties from the prototype are not taken into account.

#### Summary
* In JavaScript, all objects have a hidden `[[Prototype]]` property that’s either another object or null.
* We can use `obj.__proto__` to access it (a historical getter/setter, there are other ways, to be covered soon).
* The object referenced by `[[Prototype]]` is called a “prototype”.
* If we want to read a property of obj or call a method, and it doesn’t exist, then JavaScript tries to find it in the prototype.
* Write/delete operations act directly on the object, they don’t use the prototype (assuming it’s a data property, not a setter).
* If we call `obj.method()`, and the method is taken from the prototype, `this` still references `obj`. So methods always work with the current object even if they are inherited.
* The `for..in` loop iterates over both its own and its inherited properties. All other key/value-getting methods only operate on the object itself.

## 3) What does 'this' mean?

`this` automatically resolves to an object or scope depending on the context at which is was defined.

There are generally four kinds of bindings in JS:

* Default Binding
* Implicit Binding
* Explicit Binding
* Constructor Call Binding

#### Default Binding in JavaScript
One of the first rules to remember is that if the function housing a this reference is a standalone function, then that function is bound to the global object.

```javascript
function alert() { 
  console.log(this.name + ' is calling'); 
}

const name = 'Kingsley'; 
alert(); // Kingsley is calling
```

As you can see, `name()` is a standalone, unattached function, so it is bound to the global scope. As a result, the `this.name` reference resolves to the global variable `const name = 'Kingsley'`. Note that, when set in strict mode, the `this` reference is set to `undefined`. If we had `'use strict'` before calling `this.name`, we would get a `this is undefined` type error.

#### Implicit Binding in JavaScript
According to the binding rule in JavaScript, a function can use an object as its context only if that object is bound to it at the call site. This form of binding is known as implicit binding.

Put simply, when you call a function using dot notation, `this` is implicitly bound to the object the function is being called from.

```javascript
function alert() { 
  console.log(this.age); 
}

const myObj = {
  age: 22,
  alert: alert,
  nestedObj: {
    age: 26,
    alert: alert
  }
}

myObj.alert(); // `this` is bound to `myObj` -- 22
myObj.nestedObj.alert(); // `this` is bound to `nestedObj` -- 26
```

In this example, since `alert` is being called from `myObj`, the `this` keyword is bound to `myObj`. So when `alert` is called with ``.alert()`, `this.age` is 22, which is the `age` property of `myObj`.

An easy way to figure out which object `this` is implicitly bound to is to look at which object is to the left of the dot (.).

#### Explicit binding in JavaScript
We saw that implicit binding had to do with having a reference in that object, but what if we want to force a function to use an object as its context without putting a property function reference on the object?

We have two utility methods to achieve this: `call()` and `apply()`. Along with a couple other set of utility functions, these two utilities are available to all functions in JavaScript via the `[[Prototype]`] mechanism.

To explicitly bind a function call to a context, you simply have to invoke the `call()` on that function and pass in the context object as parameter:

```javascript
function alert() { 
  console.log(this.age + ' years old'); 
}

const myObj = {
  age: 22
}

alert.call(myObj); // 22 years old
```

Now here's the fun part. Even if you were to pass around that function multiple times to new variables (currying), every invocation will use the same context because it has been locked (explicitly bound) to that object. This is called hard binding.

```javascript
function alert() { 
  console.log(this.age); 
} 

const myObj = { 
  age: 22 
}; 

const bar = function() { 
  alert.call(myObj); 
}; 

bar(); // 22
setTimeout(bar, 100); // 22 
// a hard-bound `bar` can no longer have its `this` context overridden 
bar.call(window); // still 22
```

Hard binding is a perfect way to lock a context into a function call and truly make that function into a method.

## 4) What is the data structure of the DOM?

The Document Object Model (DOM) is a cross-platform and language-independent interface that treats an XML or HTML document as a tree structure wherein each node is an object representing a part of the document.

## 5) What is a Stack and a Queue? How would you create those data structures in JavaScript?

#### Stack

A stack data structure is a LIFO one (last in first out), the most recent element added to the stack should be the first out. It two fundamental operations:

* push — insert/push a new element to the stack.
* pop — remove the most recent element from the stack.

A stack is a linear data structure, which means that all elements are arranged in sequential order. It results that the `push` and `pop` operations can only happen at one end of the structure, in this case, the top of the stack.

Sometimes there can be more than two operations in a stack data structure. Sometimes we might use the `isEmpty` operation to check if the stack is empty, and the `peek` operation to return the top element without modifying the stack.

The nice thing about working with stack data structures in JavaScript is that JavaScript already provides us the `push` and `pop` methods that we discussed. The `push` method adds an element to an array and the `pop` method removes the last element from an array.

We can start our stack by creating a new array named `stack`:
```javascript
let stack = [];
const push = (item) => stack.push(item);
const pop = () => stack.pop();
```
We can also implement a stack data structure in JavaScript using classes. Here’s how we can do it:
```javascript
class Stack {
 constructor() {
   this.stack = [];
 }
 push(item) {
   this.stack.push(item);
 }
 pop() {
   this.stack.pop();
 }
}
```
Some developers like to implement stack data structures using linked lists instead of arrays in JavaScript. Although this might feel like a clever solution, the performance might not be the best one. There are some specific cases where linked lists can perform better than arrays, but when implementing stack data structures in JavaScript, always prefer arrays. The array methods that you are going to use, `push` and `pop`, will have a time complexity of O(1), which means that they will run efficiently and will have the best performance possible.

#### Queue

Queue goes here

## 6) How can you tell if an image element is loaded on a page?

Answer goes here

## 7) What is call() and apply()?

Answer goes here

## 8) What is event delegation?

Answer goes here

## 9) What is a Worker? When would you use one?

Answer goes here