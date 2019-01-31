# Premiere League Soccer Dashboard

#### Author: Mduduzi Ndhlovu
#### [GitHub](https://github.com/mrndhlovu) 
#### [LinkedIn](https://www.linkedin.com/in/mduduzi-ndhlovu-750068167/)
#### Dashboard [URL](https://mrndhlovu.github.io/milestoneProject2-pl-app/)

## Overview
___
Milestone project number 2: This is a dashboard showing the current season statistics of teams playing in the English Premiere league. The data is sourced from football-data.org API, and credit to [**Daniel**](https://de.linkedin.com/pub/daniel-freitag/2a/a89/522) for offering this free service. AJAX GET data calls are made and with the correct API authorization key, a json data file is received and then filtered to create the stats dashboard using JavaScript, and D3.

## File List
___
> css > main.css
    
    This file holds most of the front-end css for the dashboard.

> js > stats.js

    This file holds all the logic and functionality of the dashboard.

> README. md

    This is the file you are currently reading. All the formatting and dashboard functionality explanations are made here.

> index.html

    The structure of the dashboard was made on this file. All the external libraries, CSS links and scripts used by the dashboard are linked in this file.




## Libraries and Frameworks Used
___
> Bootstrap 

    Mainly used here to add responsive functionality to the web page.

> D3 and Crossfilter

    Used for displaying dashboard statistics in donuts and graphs.

> jQuery

    For API data call.


## Technologies Used
___
* Cloud9  
    * IDE (Integrated Development Environment)
* HTML 
    * For creating dashboard webpage.
* CSS
    * Styling the dashboard structure written in HTML
* JavaScript
    * Adding dynamic behavior to dashboard.
* D3 and Crossfilter
    * Creating the dashboard donut and graphs
* Git 
    * For keeping track of code changes.
* GitHub
    * Repo hosting.
* Bootstrap
    * HTML and CSS framework used in this project mainly to adjust the responsiveness of the dashboard.   
* Rest API
    * Used in this project to call and get json data used by the dashboard.
* JSON  
    * Structured key values file used to build dashboard stats.
* Google Development Tools 
    * Used for testing logic and functionality of code. 
* YouTube 
    * Research    
* Stack Overflow
    * Code research
* W3C 
    * HTML and CSS Validation.

## Features
___

### Team Stats
* When the page loads, the **Team Stats** is populated with data for any team selected in the dropdown options list. 
* This list is sorted according to the current league ranking with the last team shown being the team with the least points in the league currently.
* When you select a team from the dropdown, the team badge image changes to match the team selected.
* Team stats for the team is displayed in the cards below the image. When a team name is selected a getSelectedTeam() function is called and data relevant to the team selected is displayed.


### Past 10 Games
* This table shows the last 10 games of a team chosen in the dropdown list, with the latest games shown first. The date and scores are also shown.

### Fixtures
* On this table you can see the next upcoming games in the premiere league, also shown is the date the games are set to play. 
* Using the "Pick Match Day" slide, the fixtures table can be rebuilt to show games Finished or Scheduled to play and stating the dates the matches played or will play. 
* On match day the state on the table will change to "InPlay" when a game kicks off, will show "Paused" during half time and "Finished" when a game end.
* The flags show match day wins, losers and draws. 
```
            Green flag = Winner
            Red flag = Loser
            Blue flag = Draw
```
### Pick Match Day
* As mentioned before, the slide will filter and show game fixtures according to match day picked. 
* The input number shown represents the match day range from 1 to 38, the number of games each team in the league must play in a season.

### Goals Scored Donut
* This donut represents all the teams playing in the league and figures shown are the number of goals each team has scored and mapped to a color to highlight the differences per team.
* If two teams have the same figure D3 maps the teams to the same color. 
* Hovering over the figures shows the team which the color is mapped to as well as the current ranking on the league table

### Goals Conceded Donut
* This donut functionality is the same as the "Goals scored", however this time it shows the number of goals conceded by each team so far.
* The hover effects this time just shows the team which the color and figure represents.

### Team Wins and Team Losses
* These graphs show the number games each team has won and lost in the season so far respectively. 
* They are listed according to current table rankings and on hover shows the full team name and number of wins or losses.

## Install
___
The following dashboard dependent libraries and frameworks can be downloaded to a local directory using a wget. and placed in the head of the idex.html file in the order shown. The jQuery script tag should be just above the closing body tag.

         wget https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.17/d3.min.js
         wget https://cdnjs.cloudflare.com/ajax/libs/crossfilter/1.3.12/crossfilter.min.js 

         <script src="local-dir/d3.min.js"></script>
         <script src="local-dir/crossfilter.min.js"></script>

or CDN 
        

        * <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.17/d3.min.js"></script>
        * <script src="https://cdnjs.cloudflare.com/ajax/libs/crossfilter/1.3.12/crossfilter.min.js"></script>
        * <script src="https://code.jquery.com/jquery-3.3.1.js" integrity="sha256-2Kok7MbOyxpgUVvAk/HJ2jigOSYS2auK4Pfzbm7uH60=" crossorigin="anonymous "></script>


## Testing
___
> JavaScript Testing

All testing of the logic and functionality of this project was done using Google Development Tools. 

* Function logic was tested using the Chrome console that would print errors which needed attention if the logic or code syntax did not make sense. 
* With every function written in the stats.js file, troubleshooting the logic of each function was tested and esults printed to the console. For example the first API data call returned a JSON file which had to be filter through by changing json key values to match and display data that was needed.

> API 
* Setup an API [football data account](https://www.football-data.org/client/login), and get an authorization key.
* Used [Postman](https://www.getpostman.com/) to test and validate API requests and API key.
* API data filtering [documentaion](https://www.football-data.org/documentation/quickstart)
        
        Request URLs used in the project:
        > https://api.football-data.org/v2/competitions/2021/standing
        > https://api.football-data.org/v2/competitions/PL/scorers
        > https://api.football-data.org/v2/competitions/PL/matches



> CSS Testing

* Used the Chrome devtools also to edit the webpage CSS on the fly and then implement the changes on the style.css file.

* Responsive testing was done with the help of flex-box and bootstrap grip templates. Found that bootstrap grids work well with adjusting content to fit in a particular screen size and adding flex-box and justify-content helped to align container properly.
* Using the Google development tools, particularly the toggle device toolbar and css media queries, the dashboard card alignment to different mobile screen sizes easy. 
* CSS validation was tested using https://jigsaw.w3.org/css-validator/ 

> HTML Testing

* HTML’s validation was checked using https://validator.w3.org/

## Bugs
___
* Text over flows and doesn't display properly if the text string is too long when you hover over the Goals Conceded donut, making it hard to read.
* Team badges are not the same size, so some images appear cropped.
* Flags on the fixtures table disappear in mobile view. 

## Deployment
___
* Final version of code was pushed from Cloud9 to a GitHub pages host with all the dependent files included and available for download.
* Final version [URL](https://mrndhlovu.github.io/milestoneProject2-pl-app/)

## Credits
---
* API data used from : football-data.org
* D3 code copied from [Accio Code Youtube Channel](https://www.youtube.com/channel/UC9ObAKKcpFeHcYiNtnSqbMg)
* Color palettes sources from:  https://flatuicolors.com/palette/defo 
* [Code Institute](https://codeinstitute.net/)
* [Stake Overflow](https://stackoverflow.com/)


