# morelia
- made in about a week, so it's just as good as javascript

## Prerequisites
- python3
- bun

## Install dependencies
```bash
bun install
```

## Bundling
- can only be bundled on linux (macOS?) at the moment (bun windows limitations)
```bash
bun run bundle
```

## Running

### Linux
-  tested on debian 12 bookworm wsl
#### Complete project
```bash
bun start (args: path, --debug)
```

### Windows
- tested
#### Complete project
```bash
bun start (args: path, --debug)
```

### Mac OS
- not tested
#### Complete project
```bash
bun start (args: path, --debug)
```

## Documentation
- This language is VERY similar to python and any python code should work in morelia after chaning ":" to {} and such.

### Variables
- There are no keywords for defining variables, just use the variable name and assign it a value.
```python
x = 5
```

### Functions
- There are no keywords for defining functions, just use the function name and define it
```python
add (a, b) {
    return a + b
}

x = add(5, 5)
```

### If statements
```python
if x > 5 {
    print("x is greater than 5")
} elif x < 5 {
    print("x is less than 5")
} else {
    print("x is 5")
}
```

### Loops
- There is only a while loop, because this is all you need
```python
i = 0
while i < 5 {
    print(i)
    i += 1
}
```

### Comments
- Comments are the same as python
```python
# this is a comment
```

### Import
- Import is the same as python, except that you do not have the "as" keyword
```python
import math
```
```python
from time import sleep
```

This project was created using `bun init` in bun v1.0.25. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.