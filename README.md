# Premiere League Soccer DashBoard

#### Author : Mduduzi Ndhlovu
#### [GitHub](https://github.com/mrndhlovu) 
#### [LinkedIn](https://www.linkedin.com/in/mduduzi-ndhlovu-750068167/)
### Dashboard [URL](https://mrndhlovu.github.io/milestoneProject2-pl-app/)

## Overview
___
Milestone project number 2: This is a dashboard showing the current season stastics of teams playing in the English Premiere leauge. The data is sourced from football-data.org API, and credit to [**Daniel**](https://de.linkedin.com/pub/daniel-freitag/2a/a89/522) for offering this free service. AJAX GET messages are made and with the corect API authorization key, a json data file is received and then filtered through to create the dashboard data using JavaScript and D3.

## File List
___
> css > main.css
    
    This file holds most the front-end css for the dashboard.

> js > stats.js

    This file holds all the logic and functionality of the dashboard.

> README. md

    This is the file you are currently reading now. All the formating and dashboard functionality explainations was made on this file.

> index.html

    The structure of the dashboard was made on this file. All the external libraries, css links and scripts used by the dashboard linked from this file.




## Libraries used
___
> Bootstrap 

    Mainly used here to add responsive functionality to the web page.

> D3 and Crossfilter

    Used for displaying dashboard statistics in donut and graph form. Building interactive dashboard.

> jQuery

    For API data call.


## Technologies used
___
* Cloud9  
    * IDE (Integrated Development Environment)
* HTML 
    * Creating dashboard webpage.
* CSS
    * Styling the dashboard structure written in HTML
* JavaScript
    * Adding dynamic behaviour to dashboard.
* D3 and Crossfilter
    * Creating the dasboard donut and graphs
* Git 
    * For keeping track of code changes.
* GitHub
    * Repo hosting.
* BootStrap
    * HTML and CSS framework used in this project mainly to adjust the responsiveness of the dashboard.   
* Rest API
    * Used in this project to call and get json data used by the dashboard.
* JSON  
    * Structures key value used to build dashboard stats.
* Google DevTools 
    * Used for testing logic and functionality code. 
* YouTube 
    * Research    
* Stack Overflow
    * Code research

## Features and Testing
___

### Team Stats
* When the page loads, the **Team Stats** is populated with data for the team shown in the dropdown options list. 
* This list is sorted according to the current league ranking with the last team shown being the team with the least points in the leauge currently.
* When you select a team from the dropdown, the team badge image changes to match the team selected as well as the stats cards.
* Team stats for the team is displayed in the cards below the image. When a team name is selected a getSelectedTeam() function is called and data relevent to the team selected is displayed.


### Past 10 Games
* This table shows the last 10 games of a team choosen in the dropdown list, with the latest games shown first. The date and scores are also shown.

### Fixtures
* On this table you can see the next upcoming games in the premiere leauge, also shown is the date the games are set to play. 
* Using the "Pick Match Day" slide, the fixtures table can be rebuilt to show games Finished or Scheduled to play and stating the dates the matches played or will play. 
* On match day the state on the table will change to "InPlay" when a game kicks off, will show "Paused" during half time and "Finished" when a game ends.
* The flags show match day winners, lossers and draws. 
```
            Green flag = Winner
            Red flag = Losser
            Blue flag = Draw
```
### Pick Match Day
* As mentioned before, the slide will filter and show game fixtures according to match day picked. 
* The input number shown represents the match day range from 1 to 38, the number of games each team in the league has to play in a season.

### Goals Scored Donut
* This donut represents all the teams playing in the league and figures show are the number of goals each teams has scored and mapped to particular color to highlight the differances per team.
* If two teams have the same color D3 maps the teams to the same color. 
* Hovering over the figures shows the team which the color is mapped to as will as the current ranking on league table

### Goals Conceded Donut
* This donut funtionality is the same as the "Goals scored", however this time show the number of goals conceded by each team so far.
* The hover effect this time just shows the team which the color and figure represents.

### Team Wins and Team Losses
* These graphs show the number games eah team has won and lost in the seaon so far respectively. 
* They are list according to table current table rankings and on hover shows the full team name and number of wins or losses.

All testing of the logic and functionality of the this project was done through the Google Development Tools. Functions logic was tested using the Chrome console which would print errors which need attention if the logic or code syntax did not make sense. Used the Chrome devtools also to edit the webpage css on the fly and then implement the changes on the style.css file.


## Bugs
___
* Text over flows and doesn't display properly if text string is too long when you hover over the Goals Concended donut, making it hard to read.
* Team badges are not the same size, so some images appear cropped.

## Deployment
___
* Final verison of code was pushed from Cloud9 to a GitHub pages host with all the depend files include and avalable for download.

## Credits
---
* API data used is from : football-data.org
* D3 code is copied from [Accio Code Youtube Channel](https://www.youtube.com/channel/UC9ObAKKcpFeHcYiNtnSqbMg)
* Color palettes sources from:  https://flatuicolors.com/palette/defo 
* [Code Institute](https://codeinstitute.net/)

