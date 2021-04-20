# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| Kushagra Shah | 316002 |
| David Dieulivol | 185078 |
| Bruno Schmitt | 279392 |

[Milestone 1](#milestone-1) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3)

## Milestone 1 (23rd April, 5pm)

**10% of the final grade**

Visualization about the top movies on IMDb before 2016.
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

The project is inspired from the [Directors and their Stars webpage](https://www.nytimes.com/newsgraphics/2013/09/07/director-star-chart/index.html) presented in Lecture 2 of the course. It motivated us to think about the influence of the directors and their choice of actors for a particular movie. We want to extend this idea by considering multiple factors involved in movie-making including the director, actors, their popularity, movie budget etc. and explore how they correlate to the success of the movie. The success of the movie can be measure in terms of IMDb score, audience score and the revenue earned. After some basic data analysis, this idea can be visualized using various charts depicting the relation between the input factors to the movie success. 

The visualization will consist of a webpage with a general overview and our key findings. There will be multiple tabs on the webpage to explore the influence of the input factors (director, actors, popularity, budget etc.) individually. Other than showing the mappings and highlighting important trends, we will also show additional information about the movie and directors with mouse hovering. This webpage will help movie audiences, critics and aspiring film students to explore and understand the reasons behind the success of the top movies on IMDb. 

### Exploratory Data Analysis

> Pre-processing of the data set you chose
> - Show some basic statistics and get insights about the data

The [preprocessing notebook](IMDB_Preprocessing.ipynb) shows the basic statistics for the primary dataset. It also highlights some interesting trends about the data, followed by preliminary data cleaning and extraction. Finally, we merge the useful fields from the secondary dataset. Please note that we plan to add additional data from the backup dataset only if our current dataset doesn't suffice for the visualization.

### Related work

> - What others have already done with the data?
> - Why is your approach original?
> - What source of inspiration do you take? Visualizations that you found on other websites or magazines (might be unrelated to your data).
> - In case you are using a dataset that you have already explored in another context (ML or ADA course, semester project...), you are required to share the report of that work to outline the differences with the submission for this class.

## Milestone 2 (7th May, 5pm)

**10% of the final grade**


## Milestone 3 (4th June, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone

