# Coding Standards
REDCON adopts Google's Javascript Style Guide as coding standards. The full style guide can be found in the link below.

https://google.github.io/styleguide/jsguide.html

## Summary and Important Items 
- Class names should be defined as MyClassName.
- File names should be defined as MyFileName.js. If it is a class, the file name and the class name should be the same. Ideally, one file should contain a single class definition.
- Function names should be defined as myFuncitionName.
- Variable names should be defined as myVariableName.
- Constants parameters and values should be defined like MY_CONSTANT.
- the "var" keyword is not allowed to use.
- use the "const" keyword for every variable. If a variable needs to be altered, it should be defined with the "let" keyword.
- Avoid global variables.
- Arrays should be defined like this. const myArray = [1, 2, 3, 4]
- Objects should be defined like this. const myObject = {}
- Use if statements enclosed with brackets. Adopt the following style.
```
  if (myNumber < 10) {
    doSomething();
  } else { 
    doSomethingElse();
  }
```
- Indentation with 2 spaces.
- Use 2 space indentaiton for chained calls.
```
some.reallyLongFunctionCall(arg1, arg2, arg3)
    .thatsWrapped()
    .then((result) => {
      // Indent the function body +2 relative to the indentation depth
      // of the '.then()' call.
      if (result) {
        result.use();
      }
    });
```
- Use spread operator, over alternatives. [...foo, ...bar]   // preferred over foo.concat(bar)
- Do not mix quoted and unquoted keys. Following example is not allowed!
```
{
  width: 42, // struct-style unquoted key
  'maxWidth': 43, // dict-style quoted key
}
```
- Prefer using arrow function and always use parentheses for parameters.
```
const squareFunction = (number) => number*number;
```
- Ordinary string literals are delimited with single quotes ('), rather than double quotes (")  
- Use identity operators (===/!==) except in the example given below.
```
if (someObjectOrPrimitive == null) {
  // Checking for null catches both null and undefined for objects and
  // primitives, but does not catch other falsy values like 0 or the empty
  // string.
}
```
- Always terminate statements with semicolons.
- Make sure linter is working before commit.