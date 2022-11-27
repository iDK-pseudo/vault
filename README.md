## Vault

An application used for storage and retrieval of debit/credit card information

## Project Status

This project is currently in development.

## Installation and Setup Instructions

Clone down this repository. You will need `node` and `npm` installed globally on your machine.  

Installation:

`npm install`

To Run Test Suite:

`npm run build`

`npm run start-client`

To Start Server:

`npm start`

To Visit App:

`http://localhost:3000/`

## Reflection

This was a 1 month long project built after I finished my The Odin Project course. Project goals included using technologies learned up until this point and familiarizing myself with documentation for new features.  

Originally I wanted to build an application that allowed users to save debit/credit card information and retrieve that information whenever they want. I started this process by using the `create-react-app` boilerplate, then adding `mui` and `passport`.  

One of the main challenges I ran into was Authentication. This lead me to spend a few days on a research spike into OAuth, Auth0, and two-factor authentication using third parties. I finally settled onto Passport.js because it took care of the underlying OAuth process and provided an easy to use suite of methods.

At the end of the day, the technologies implemented in this project are React, mui, Express, Passport, Redis and a significant amount of JSX, and CSS. I chose to use the `create-react-app` boilerplate to minimize initial setup and invest more time in diving into weird technological rabbit holes.
