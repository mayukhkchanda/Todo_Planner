# **Todo Planner** 
## A simple Todo Planner app built with Vanilla JS and JQuery

* ### Project Structure:
    * **app.js** -> Uses express to run the server for hosting the static files in the _public_ folder. Default port is 5505.
    * **public(_folder_)** :  
        * **index.html** -> Entry point for the default route.
        * **images(_folder_)**: svg of an arrow
        * **static(_folder_)**: 
            * **index.js** -> contains the Javascript and JQuery code.
            * **style.css** -> contains the styles for the index.html page 
            * **popupstyle.css** -> contains the styles for the popup-div(used for taking input)

## Important! 
*   I have used Local storage of the client side browser for storing the todos. The todos(more accurately tasks) are stored using _JSON.stringify_ and retrived using _JSON.parse_. 
*   Remember to delete the todos, as they are not deleted and will stay until cache is cleared or explicitly done from a script.

## Note: 
*   Make sure that the localStorage  is enabled in the browser.
*   >Safari browser in Private Browsing mode gives us an empty localStorage object with a quota of zero, effectively making it unusable
*   >For some very old browsers, such as Internet Explorer 6 or 7, the local storage may not work properly.
*   Todos will persist in Local storage, until the Browser cache / Locally Stored Data is cleared.
*   Data in a localStorage object created in a "private browsing" or "incognito" session is cleared when the last "private" tab is closed.

