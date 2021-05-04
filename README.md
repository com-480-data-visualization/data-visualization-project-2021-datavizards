# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| Kushagra Shah | 316002 |
| David Dieulivol | 185078 |
| Bruno Schmitt | 279392 |

[Milestone 1](#milestone-1) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3)

## Getting Started

```shell
cd website
python3 -m http.server 8888

# Go to http://localhost:8888
```

## Milestone 1 (23rd April, 5pm)

**10% of the final grade**

Visualization about the director-stars success in the top IMDb movies.
<!--
This is a preliminary milestone to let you set up goals for your final project and assess the feasibility of your ideas.
Please, fill the following sections about your project.

*(max. 2000 characters per section)*
-->

### Dataset

> Find a dataset (or multiple) that you will explore. Assess the quality of the data it contains and how much preprocessing / data-cleaning it will require before tackling visualization. We recommend using a standard dataset as this course is not about scraping nor data processing.
>
> Hint: some good pointers for finding quality publicly available datasets ([Google dataset search](https://datasetsearch.research.google.com/), [Kaggle](https://www.kaggle.com/datasets), [OpenSwissData](https://opendata.swiss/en/), [SNAP](https://snap.stanford.edu/data/) and [FiveThirtyEight](https://data.fivethirtyeight.com/)), you could use also the DataSets proposed by the ENAC (see the Announcements section on Zulip).

There is no single unique dataset which aligns perfectly with our project idea. Hence, we are going to use the following three datasets from Kaggle:
1. [IMDB Data from 2006 to 2016](https://www.kaggle.com/PromptCloudHQ/imdb-data): It contains the top 1000 movies on IMDb from 2006 to 2016. It will serve as the primary dataset since it contains relevant data fields such as the director, actors, revenue, rating and metascore for each movie. 
2. [IMDB 5000 Movie Dataset](https://www.kaggle.com/carolzhangdc/imdb-5000-movie-dataset): It contains useful information about 5000 movies on IMDb movies upto 2016. It will serve as the secondary dataset as we will extract only the useful fields instead of the complete dataset. It contains additional data fields such as the movie budget and the number of likes (depicting popularity) on the director, actors and movie facebook pages.
3. [The Movies Dataset](https://www.kaggle.com/rounakbanik/the-movies-dataset): It is a humongous dataset which contains metadata for 45000 movies with 43 data fields distributed over 7 files. It will serve as the backup for any missing or conflicting fields in the other two datasets.

The chosen datasets are good-quality credible datasets from Kaggle. They are properly labelled, verified, cleaned, and available for free as CSV files. However, some amount of work is required to combine the primary dataset with useful fields from the secondary dataset:
- Explore and organise the primary dataset as the main source of data
- Add the movie budget and any other fields from the secondary dataset
- Expand the actor field to multiple columns (to match with the secondary dataset)
- Add the number of likes for the movie, director and actor facebook pages
- Filter out any corrupted datapoints which cannot be corrected using the backup dataset

### Problematic

> Frame the general topic of your visualization and the main axis that you want to develop.
> - What am I trying to show with my visualization?
> - Think of an overview for the project, your motivation, and the target audience.

As shown by the [Directors and their Stars webpage][] (Lecture 2), the relationship between an actor and a director might indicate an artistic understanding, a functional routine, or even a marketing strategy. We want to investigate the success of such partnerships by analyzing the results with respect to multiple factors involved in the movie industry. These factors should include the number of movies made together, their budget, revenue and IMDb/audience score. The idea is targetted towards enthusiasts, critics, and students of the movie industry.

The visualization will consist of a webpage with a general overview and our key findings. It will have one graph structure in which the vertices represent actors and directors, and the edges represent their relationship, i.e., if they worked together. A user should be able to click on the edges to investigate the relationship further. On a click, the visualization will focus on the vertices (director and actor) involved and break the edge down into multiples edges, one for each movie done together. It will also show data about the partnership's history: a timeline with the movies and our metrics for success.

### Exploratory Data Analysis

> Pre-processing of the data set you chose
> - Show some basic statistics and get insights about the data

The [preprocessing notebook](IMDB_Preprocessing.ipynb) shows the basic statistics for the primary dataset. It also highlights some interesting trends about the data, followed by preliminary data cleaning and extraction. Finally, we merge the useful fields from the secondary dataset. Please note that we plan to add additional data from the backup dataset only if our current dataset doesn't suffice for the visualization.

### Related work

> - What others have already done with the data?
> - Why is your approach original?
> - What source of inspiration do you take? Visualizations that you found on other websites or magazines (might be unrelated to your data).
> - In case you are using a dataset that you have already explored in another context (ML or ADA course, semester project...), you are required to share the report of that work to outline the differences with the submission for this class.

We have always been enthusiastic about pop culture, especially movies. Thus finding a dataset related to the entertainment industry was on our radar from the very beginning. We did not find many related works to this specific visualization that is worth mentioning. Most of them consist of a simple plot with the information and lack any objective analysis (For example, one can learn about the highest-rated movie or the one with more considerable revenue, [but][] ... [that's][] ... [about][] ... [it][]).

We used the [Directors and their Stars webpage][] as an inspiration for our proposal. It instigated us to think about the existence of such partnerships. Through our work, we plan to go beyond and take a look into the success of such relationships. 

[but]: https://public.tableau.com/profile/milo8469#!/vizhome/Lab2_174/Dashboard1
[that's]: https://www.kaggle.com/unofficialmerve/imdb-exploratory-data-analysis
[about]: https://www.kaggle.com/ambujbhardwaj/imdb-dataset-analysis-report
[it]: https://www.kaggle.com/batuhaneralpofficial/imdb-loves-war

## Milestone 2 (7th May, 5pm)

**10% of the final grade**

The project will have a main webpage for welcoming the user. It will contain useful links, credits and description of the project. We will use a navigation bar to take the user to another page which will contain our data visualization. The basic idea as well as the functional prototype/skeleon are found below:

![Website Sketch](images/website_sketch.jpg "Website Sketch")
![Website Sketch](images/website_prototype_1.png "Website Prototype main page")
![Website Sketch](images/website_prototype_2.png "Website Prototype constellation")

### Primary Visualization - Graph Network

As described in [Milestone 1](#milestone-1), our aim is to study and present the relationship between the directors and actors of various IMDb movies. This relationship will be represented using the primary visualization - a graph network, where the vertices represent directors and actors and the edges represent their relationship, i.e., if they worked together. To be specific, we plan to use a [force-directed-graph][] with the following design elements:
- Vertices: We will use bigger sized circles for directors, and smaller sized circles for actors. We will also use two distinct 'neutral' colors (as described in next point) for the directors and actors for easier distinction. We will make sure to choose colorblind-friendly color schemes.
- Edges: An edge between a director and actor is constructed only if they have done at least 2 movies together. The thickness of the edge will represent the strength of the relationship i.e. proportional to the number of movies done together. Further, the color of the edge will reflect the 'success' of the relationship i.e. color gradient based on the IMDb score or the movie revenue. The color gradient will move from a 'positive' class to 'neutral' to a 'negative' class. 

The page will also contain a toggle button using which the user can select the parameter to represent the 'success' of a movie. There will be 2 possibilities - IMDb rating or movie revenue. On toggle, the color of the edges will change accordingly, and it will also change the secondary visualization.

### Secondary Visualization - Side Window

The page also contains a secondary visualization - 'on-click' side window, which will contain multiple charts and information as descibed below. This will be interactively connected to the main graph network. The interactions can be described as follows:
- On-click: When any edge of the graph network is clicked, it will be expanded into multiple branches. The number of branches is equal to the number of movies done together by the director-actor pair. Further, the on-click window will be triggered by the click, thus, choosing the director-actor pair for visualization.
- On-click window: The window will be located on the right side of the webpage. It will feature a line-graph for the movies done by the chosen director-actor pair. The x-axis represents different movies done over time. And the y-axis represents the measure of 'success' (IMDb rating or movie revenue). In case of the movie revenue as 'success', we will also represent the movie budget on the chart.
- On-hover: When the mouse is hovered across the expanded edges on the graph network or on the window's line chart, both of them are highlighted and the movie name is displayed. We can also add a link in the window to take the user to the IMDb's movie page. Further, when the mouse is hovered over the vertices, the director and actor names can be seen (on hovering the non-expanded edge, the name of the pair can be seen). 

### Design Goals

After brainstorming the ideas and visual elements, the final project goals can be described as follows:
1. We created the functional prototype for the website. We have some skeleton code ready on which we will build the project. It has been submitted as part of this milestone (please refer to **Functional prototype** further down in the README).
2. The core design will contain the main webpage for welcome, and a second page with the previously descibed 2 visualizations - graph network and side window. First, we will consider only the the movie revenue as the 'success' parameter, and hence, there will be no toggle button. This will constitute as the minimum viable product. 
3. Next, we will add some core features - we will definitely add these features by the end of the project:
	- We will add the toggle button to choose between the IMDb rating and movie revenue as the movie 'success' parameter.
	- We will add a ranking system, which will rank the director-actor pairs based on the chosen 'success' parameter. This will be featured as a filter bar on the top of the page, which can be used to diplay a subset N entries out of all the director-actor pairs in the graph network. For filtering, we will either mask or gray out the removed pairs from the visualization.
	- We will add 2 more line-charts to the side window. Other than the original director-actor pair's line chart, we will also display individual director and actor movies line chart showing the same information, but with all their movies (instead of being restricted to that pair). It will displayed as a collapsible section in the side window. The user can choose to display or not display these additional charts.
4. Finally, we will add some additional features - we will add these features depending on the relevance and time-avaibility. These are presented below in **no particular order** of preference:
	- We have chosen the theme of stars and space, drawing a pun on movie 'stars' and actual stars. We will make the website more aesthetically pleasing based on this theme, using background pictures or some dynamic style.
	- We will make the graph network cleaner by representing it as a vertically long, scrollable and zoomable network. We will try to rearrange it such that there are minimum overlapping edges for better visibility. 
	- Apart from the basic filter presented in the previous point, we will add additional filters to diplay a subset of the graph network depending on the available movie metadata - time of movie release, genres, language of the movie, country of origin of the movie. This will use a similar masking / graying out mechanism.
	- We will add a search bar, where the user can search for a particular director, actor and/or movie name. If available, the corresponding vertex or edge will be highlighted or zoomed in. 
	- We will add a compare option to the side window, so that the user can choose from 2 to 5 (upper bound arbitrarily chosen for cleanliness) director-actor pairs to be displayed in the main line chart. 

### Tools and Lectures required

* [Tool] [D3-force graph](https://github.com/d3/d3-force)
* [Tool] [Jekyll](https://jekyllrb.com)
* [Lectures] Lectures on D3 (Week 4-5)
* [Lectures] Lecture on graphs (Wekk 11)

### Functional prototype

The website can be launched locally by following the **Getting Started** instructions at the top of this README.

Below is what the graph of directors/actor look like now:

![](images/graph_animation.gif)

## Milestone 3 (4th June, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone

[Directors and their Stars webpage]: https://www.nytimes.com/newsgraphics/2013/09/07/director-star-chart/index.html
[force-directed-graph]: https://observablehq.com/@d3/force-directed-graph
