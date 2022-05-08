Steps for setup:
1) Download the codebase as zip. Extract it wherever you want (preferably on your desktop).
2) Navigate into the extracted folder.
3) Use command `npm install .` This will install all required packages to run the app. (make sure you have node.js installed)
4) Also install nodemon if not already installed -- `npm i nodemon`
5) Use the command `nodemon app.js` to start the app
6) You will probably get error regarding dotenv or environment variables setup. So, now you need to setup your environment variables.
7) In the root directory (the folder you just extracted) make a file named `.env`
8) In that file paste:
`PORT=3000`
`MONGODB_URI="a mongodb uri string"` on two seperate lines
10) Then ask me personally for mongoDB URI (you can also create your own using your own database). You need to put the actual MongoDB uri within the above string.
11) After that use `nodemon app.js` Everything should run fine.
