# Zipcode_Management

This application is my submission for the Software Engineer Candidate Coding Challenge.

## Installation Instructions

1. Run `npm install`.
1. The data that is in `./data/zipcodes.json` is the data that the application will start with. If you would like the application to start with no zipcodes, then delete everything, paste in `{ "zipcodes": { } }`, and save the file.
1. Run `npm start`.
1. Open up Postman, Google Chrome, or your browser of choice and input the desired operations into the URL bar appended to `http://localhost:5000/`.
   - For instance, to insert the zipcode 10223, enter `http://localhost:5000/insert/10223`.
   - Both the browser and terminal windows will give feedback on the operation. Also, the zipcode list will be visible in `./data/zipcodes.json`.
1. When you are done, press Ctrl+C in the terminal to close the application.
