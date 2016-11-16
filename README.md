# #modreqs web, for osu! game

In the past, osu! had a section of its website that displayed the latest maps posted in the #modreqs channel.
For some reason, this stopped working in 2014: https://osu.ppy.sh/forum/t/211410

This simple app tries to emulate a bit this utility.

I hope people (especially _Nominators_), can find it useful!!



# Technology
I originally wrote it in Scala, but because I have a low memory server, I rewrote it for Node.js. Scala is really nice for high performance servers, but it needs a lot of memory, too. Now, it uses JavaScript (nOt FAnCy Babel), postgres and express.js. The IRC connection is just a Socket.

Check out the original project here: https://github.com/ErunamoJAZZ/osu-modreqs-play

I accept pull requests, but poke me before you start to code please :3