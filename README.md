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

As shown by the [Directors and their Stars webpage][] (Lecture 2), the relationship between an actor and a director might indicate an artistic understanding, a functional routine, or even a marketing strategy. We want to investigate the success of such partnerships by analyzing the results with respect to multiple factors involved in the movie industry. These factors should include the number of movies made together, their budget, revenue and IMDb/audience score. The idea is targetted towards enthusiasts, critics, and workers of the movie industry.

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

We have always been enthusiastic about pop culture, especially movies. Thus finding a dataset related to the entertainment industry was on our radar from the very beginning. We did not find many related works to this specific visualization that is worth mentioning. Most of them consist of a simple plot with the information and lack any objective analysis (For example, one can learn about the highest-rated movie or the one with more considerable revenue, but that's about it).

We used the [Directors and their Stars webpage][] as an inspiration for our proposal. It instigated us to think about the existence of such partnerships. Through our work, we plan to go beyond and take a look into the success of such relationships. 

## Milestone 2 (7th May, 5pm)

**10% of the final grade**


## Milestone 3 (4th June, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone

[Directors and their Stars webpage]: https://www.nytimes.com/newsgraphics/2013/09/07/director-star-chart/index.html
