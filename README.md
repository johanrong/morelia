# morelia
- made in about a week, so it's just as good as javascript

## Prerequisites
- python3
- bun or nodejs

## Install dependencies
```bash
bun install
```

## Bundling
- required for windows
- can only be bundled on linux at the moment (bun windows limitations)
```bash
bun run bundle
```

## Running

### Linux
-  tested on debian 12 bookworm wsl
#### Complete project with bun
```bash
bun start (args: path, --debug)
```

#### Bundled with node
- bundle first *duh*
```bash
node bundle/index.js (args: path, --debug)
```

### Windows
- tested
- can only be run through the bundled version
#### Bundled with node
```bash
node bundle/index.js (args: path, --debug)
```

### Mac OS
- not tested
#### Complete project with bun
```bash
bun start (args: path, --debug)
```

#### Bundled with node
```bash
node bundle/index.js (args: path, --debug)
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