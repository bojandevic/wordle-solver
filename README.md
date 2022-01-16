# Wordle Solver

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Wordle_196_example.svg/330px-Wordle_196_example.svg.png" alt="Wordle" />

Wordle is a simple web game that became very popular recently. The goal of the game is to figure out five letter english word in less then six tries. After each guess the game
tell the user which of the letters guessed are in the right position, which are in a wrong position and which ones do not exist at all in the solution.

## How does the solver work?
This solver has a collection of all english words with five letters. After each guess it tries to eliminate all that do not fit the requirements and pick random
possible solution. 

## How can I use it?
Add a bookmark in your browser with the following URL:
```
javascript:(function(){const s=document.createElement('SCRIPT'); s.type='text/javascript'; s.src='https://bojandevic.com/wordle.js'; document.getElementsByTagName('head')[0].appendChild(s);})();
```
go to the [Wordle website](https://www.powerlanguage.co.uk/wordle/) and just press newly added the bookmark and watch how it solves your wordle.

# Can solver continue current wordle where I left it?
Yes it can, but it is intended to solve wordles from scratch.
