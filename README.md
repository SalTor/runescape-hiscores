# RuneScape Hiscores
Just a small interface I've been working on in my free time to display the stats of users of the MMORPG RuneScape



## How To Use
```git
git clone git@github.com:/SalTor/runescape-hiscores.git
cd runescape-hiscores
npm install
grunt runescape &
npm runescape

Go to http://localhost:3000
```

### When you want to stop
```bash
ctrl + c
```

To find the process running the grunt runescape task enter:

```bash
ps aux | grep grunt
username  3755   0.1  0.7  3146956 124156 s002  SN   11:52AM   0:02.14 grunt
sudo kill 3755 (yours will be different)
```

## Feature's Still Needed
- Username checks to see if they're of valid form
- Better front-end implementation, I've been looking into using Angular
- Possibly a better workflow, this is just what works for me


## Disclaimer
- I do not claim to own any information related to RuneScape
- This is just a side project I embarked on to see if I could do it
- I've been wanting to start using ES6 more, so if you want to contribute, please write your code in ES6 when possible