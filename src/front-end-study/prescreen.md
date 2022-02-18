# Prescreen questions

### 1) What is the difference between const, let, and var?

| var | let | const |
| --- | --- | --- |
| The scope of the var keyword is the global or function scope. It means variables defined outside the function can be accessed globally, and variables defined inside a particular function can be accessed within the function. | The scope of a let variable is only block scoped. It can’t be accessible outside the particular block ({block}). | The scope of a const variable is only block scoped. It can’t be accessible outside the particular block ({block}). |
| It can be updated and re-declared into the scope. | It can be updated but cannot be re-declared into the scope. | It cannot be updated or re-declared into the scope. |
| It can be declared without initialization. | It can be declared without initialization. | It cannot be declared without initialization. |
| Gets hoisted, which means it can be accessed without initialization as its default value is “undefined”. | It cannot be accessed without initialization, as it returns an error. | It cannot be accessed without initialization, as it cannot be declared without initialization. |

### 2) Explain prototypical inheritance

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

### 3) What does 'this' mean?

Answer goes here

### 4) What is the data structure of the DOM?

Answer goes here

### 5) What is a Stack and a Queue? How would you create those data structures in JavaScript?

Answer goes here

### 6) How can you tell if an image element is loaded on a page?

Answer goes here

### 7) What is call() and apply()?

Answer goes here

### 8) What is event delegation?

Answer goes here

### 9) What is a Worker? When would you use one?

Answer goes here