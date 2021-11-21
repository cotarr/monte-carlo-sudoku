# monte-carlo-sudoku

Solve a sudoku puzzle using successive random numbers to guess a solution.

### How to run

This is a stand alone browser web page. No web server is included.

To run the program, clone the repository. Change to the  `html` folder. 
Open index.html using either the local web browser or using a local web server.
One javascript file (main.js) will be loaded by the html page.

After opening the web page, enter a new sudoku puzzle into the 
upper table. Press the button marked: `Start Continuous`. 
The program will accept a completely a blank input puzzle 
to generate a random generic sudoku solution.

### Comments

This was written using Chrome under Debian Linux. Other web browsers have not been tested.

The timer intervals and loop counters have not been optimized.
The current values were set to avoid browser console log errors for excessive CPU usage.
