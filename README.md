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
- only tested on debian 12 bookworm
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


This project was created using `bun init` in bun v1.0.25. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.