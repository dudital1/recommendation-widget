# recommendation-widget

## Description 

This project is a simple recommendation widget. recommendations are fetched from an API provided by Taboola. 
The widget has two layout options, grid - small cards with the recommendation image and recommendation name. 
The other one is a list -  a bigger card that includes also the recommendation description. 
You can switch layouts with two buttons (located in the right top corner of the widget) - on each recommendation card click you will be redirected to the recommendation URL in a new tab.
The widget has infinite scrolling behavior with an event listener on the user scroll, once it reaches the end of the page it triggers another API request to fetch more recommendations.

## Code structure

HTML file - single div with id "recommendations-widget". 
basically, all the elements are rendered dynamically with js - in order to let any "customer" use this project on his own application, all he needs to do is add a div with the specified id.
there are two main classes in this project, "Widget" and "RecommendationAPI". 
RecommendationAPI - a class that holds the API base URL and parameters (appType, apiKey, sourceType, count, sourceId - all required by the API). this class has one method - fetchRecommendations.
Widget - handles all business logic of the widget: 
* renders the header
* fetch recommendation (via RecommendationAPI instance),
* adding event listeners (for the scroll behavior & layout buttons), 
* handle error state (server error & no recommendations found). 

## Deployment 

the application is deployed to GitHub pages, link - https://dudital1.github.io/recommendation-widget. 
I also added a GitHub actions YML file in order to run tests on every push to "main" branch. 
tests are written with jest. 

## Run the project 

* clone the project. 
* npm i (for test purposes) - you can skip this step if you are not interested in running tests.
* install live Server - https://www.geeksforgeeks.org/how-to-enable-live-server-on-visual-studio-code/
* Use vsCode Live Server. (right click on index.html - open with Live Server).





