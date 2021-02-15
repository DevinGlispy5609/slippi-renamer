# Slippi Renamer

Rename Slippi (.slp) game files to include characters, tags, colors, and stage.

**Singles:**
```
Game_20190530T222709.slp -> 20190530T222709 - Fox (Username, Color) beat Marth (Username, Color) at Dreamland N65.slp
```

**Doubles:**
```
Game_20190521T212659.slp -> 20190521T212659 - Falco (Username) & Marth (Username) beat Fox (Username) & Fox (Username) at Marth's Story.slp
```

## Setup
If you'd perfer the CLI version of the app please follow these instructions 

1. Install [Node.js][node].
2. Download [slippi-renamer][download].
3. Navigate to where slippi-renamer is downloaded in the terminal or Node.js console to using `cd`.
4. Run `npm install`.

Otherwise, I've included working packaged apps for Linux, MacOS, and Windows inside the READY_TO_GO folder 

## Usage

`FOLDER` is the path to a directory with `*.slp` files. 

```
node slp_rename.js "FOLDER"
```

```
Usage slp_rename.js [options] <directories>

Options:
  --version  Show version number                                       [boolean]
  -n         perform a trial run without renaming                      [boolean]
  -r         rename in subdirectories too                              [boolean]
  -h         Show help                                                 [boolean]


## Changelog

### 1.3.0
- Changed to renaming proccess to include the winner of each game first noting that they "beat" the other player

### 1.2.2
- Added `-r` flag to rename folders recursively.

### 1.2.1
- Show netplay name, if applicable.

### 1.2.0
- Handle non-standard teams.
- Better error handling.

### 1.1.1
- Takes directories as arguments instead of files to better work on Windows.

### 1.1.0
- Show character colors for players without tags.
- Don't rename files that we have trouble parsing.
- Better command line parsing
  - `-n` flag to run the script without performing any renaming.

## Authors
* Devin "Frizzy" Glispy - Win based names and folder management
* Max "DJSwerve" Timkovich
* IvantheTricourne - additional bug fixes and enhancements.

[node]: https://nodejs.org/en/download/
[download]: https://github.com/mtimkovich/slippi-renamer/archive/master.zip
