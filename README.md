# RuneScape Hiscores
Just a small interface I've been working on in my free time to display the stats of users of the MMORPG RuneScape

## What You Will Need
- [node.js](https://nodejs.org/en/)
- [sass](http://sass-lang.com/install)


## How To Use
```bash
$ git clone git@github.com:/SalTor/runescape-hiscores.git
$ cd runescape-hiscores
$ grunt
$
You will be redirected to http://localhost:some-available-port
depending on which ports are available
```


## Live Example
You can find this app running live [here](project.saltor.nyc/RuneScape%20HiScores)


## Moving Forward
- [ ] Separate out server from this repo
- [X] ~~Username checks to see if they're of valid form~~
    - [ ] Currently handled with a timeout, but is there a hidden way Jagex does it?
- [ ] Optimize code, queries take anywhere between .2s to 2s
- [ ] Possibly a better workflow, this is just what works for me
- [X] ~~Better front-end implementation, I've been looking into using Angular~~


## Disclaimer
- I do not claim to own any information related to RuneScape
- This is just a side project I embarked on to see if I could do it
- I've been wanting to start using ES6 more, so if you want to contribute, please write your code in ES6 when possible
