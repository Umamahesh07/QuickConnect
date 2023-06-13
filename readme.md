# Quick Connect

This is a web application built using Node.js, JavaScript, HTML, and CSS (Bootstrap).

## Technologies Used

* Node.js - Server-side runtime environment for handling back-end logic using JavaScript.
* JavaScript - Programming Language used both front-end and back-end development.
* HTML - Structuring web content.
* CSS (Bootstrap) - Styling and responsive design.
* MySQL - Data storage and management.

## Prerequisites

Make sure you have the following installed on your system:

* Node.js
* npm (comes bundled with Node.js)
* Visual Studio Code (or any other code editor of your choice)
* MySQL

## Setup and Installation

Follow these steps to set up the project on your local machine:

1. **Clone the repository**: Clone the given repository to your local machine. You can either use `git clone [repository_url]` or download the repository as a ZIP file and extract it.

2. **Open the project in Visual Studio Code**: Open the project folder in Visual Studio Code or your preferred code editor.

3. **Create the .env file**: In the project folder, create a file named `.env`. Add the following fields to the file:

PORT=[port_number]
HOST=[host_address]
DB_USER=[database_username]
DB_PWD=[database_password]
DB_NAME=[database_name]
Replace the values in square brackets with your actual settings.

4. **Create the database and tables**: Set up a new database and create the necessary tables in the order specified in the `schema.sql` file.

5. **Install dependencies**: Open a terminal in Visual Studio Code (or your code editor) and run the following command to install all the required Node.js modules:

npm install or npm -i

This will start the server on the specified host and port in the `.env` file.

7. **Access the application**: Open your web browser and navigate to the address `http://[host_address]:[port_number]` (replace with the actual host and port values from the `.env` file). You should now see the application running.