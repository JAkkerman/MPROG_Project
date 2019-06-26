### When to use comments
* Above every function I write a description of that function.
* Above larger chunks of code with a particular purpose, I write what this chunk of code does.
* Above lines of code that are not intuitively easy to understand, I write an explanatory comment.

### Tabs or Spaces for indentation
For Python, I use the conventional one tab for every subfunction.
For JavaScript, I use the conventional two spaces for every subfunction, or for code between curly braces.
For HTML I use a tab within blocks, and enters between divs

### Appropriate use of white space
Between every chuck of code with a distinct purpose I put an enter. Between functions I put two enters.

### Proper Naming of variables and functions
In python, different words in variables are separated by an underscore. In JS, different words in variables are separated by a capital letter at the start of the letter.
Functions are always named in such a way that the name represent what they do.

### Code grouping and organization
In JS, I made a separate file for every visualization, one main file (project.js) and one extra file that contains some helper functions that are called by multiple functions.

### Paterns to be used
Use var and let accordingly to their use in either all or only local functions, such that you don't interfere unwantedly with other functions.

### Paterns to be avoided
Load in your data too often, so try to load in data once and then use it again for all the used functions.
