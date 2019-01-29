# Premiere League Soccer DashBoard

#### Author : Mduduzi Ndhlovu
#### [GitHub](https://github.com/mrndhlovu) 
#### [LinkedIn](https://www.linkedin.com/in/mduduzi-ndhlovu-750068167/)
### Dashboard [URL](https://mrndhlovu.github.io/milestoneProject2-pl-app/)

## Overview
___
Milestone project number 2: This is a dashboard showing the current season statistics of teams playing in the English Premiere league. The data is sourced from football-data.org API, and credit to [**Daniel**](https://de.linkedin.com/pub/daniel-freitag/2a/a89/522) for offering this free service. AJAX GET messages are made and with the correct API authorization key, a json data file is received and then filtered through to create the dashboard data using JavaScript and D3.

## File List
___
> css > main.css
    
    This file holds most of the front-end css for the dashboard.

> js > stats.js

    This file holds all the logic and functionality of the dashboard.

> README. md

    This is the file you are currently reading. All the formatting and dashboard functionality explanations are made here.

> index.html

    The structure of the dashboard was made on this file. All the external libraries, css links and scripts used by the dashboard are linked in this file.




## Libraries used
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
* BootStrap
    * HTML and CSS framework used in this project mainly to adjust the responsiveness of the dashboard.   
* Rest API
    * Used in this project to call and get json data used by the dashboard.
* JSON  
    * Structured key values file used to build dashboard stats.
* Google DevTools 
    * Used for testing logic and functionality of code. 
* YouTube 
    * Research    
* Stack Overflow
    * Code research

## Features and Testing
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
* On match day the state on the table will change to "InPlay" when a game kicks off, will show "Paused" during half time and "Finished" when a game ends.
* The flags show match day wins, losers and draws. 
```
            Green flag = Winner
            Red flag = Loser
            Blue flag = Draw
```
### Pick Match Day
* As mentioned before, the slide will filter and show game fixtures according to match day picked. 
* The input number shown represents the match day range from 1 to 38, the number of games each team in the league has to play in a season.

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

All testing of the logic and functionality of this project was done using Google Development Tools. Functions logic was tested using the Chrome console which would print errors which need attention if the logic or code syntax did not make sense. Used the Chrome devtools also to edit the webpage CSS on the fly and then implement the changes on the style.css file.


## Bugs
___
* Text over flows and doesn't display properly if the text string is too long when you hover over the Goals Conceded donut, making it hard to read.
* Team badges are not the same size, so some images appear cropped.

## Deployment
___
* Final version of code was pushed from Cloud9 to a GitHub pages host with all the dependent files included and available for download.

## Credits
---
* API data used from : football-data.org
* D3 code copied from [Accio Code Youtube Channel](https://www.youtube.com/channel/UC9ObAKKcpFeHcYiNtnSqbMg)
* Color palettes sources from:  https://flatuicolors.com/palette/defo 
* [Code Institute] (https://codeinstitute.net/)
* [Stake Overflow](https://stackoverflow.com/): Research tips.

