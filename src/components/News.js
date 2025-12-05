import React, { useEffect, useState } from 'react'

import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
    // Initialize state variables for articles, loading, page, totalResults, and progress
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)

    // Function to capitalize the first letter of a string
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const updateNews = async () => {
        props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
        setLoading(true)
        let data = await fetch(url);
        props.setProgress(30);
        let parsedData = await data.json()
        props.setProgress(70);
        setArticles(parsedData.articles)
        setTotalResults(parsedData.totalResults)
        setLoading(false)
        props.setProgress(100);
    }

    useEffect(() => {
        document.title = `${capitalizeFirstLetter(props.category)} - NewsApp`;
        updateNews();
        // eslint-disable-next-line
    }, [])


    const fetchMoreData = async () => {
        // Increment page by 1 to fetch the next set of articles
        const nextPage = page + 1;
        setPage(nextPage);
        // Construct the API URL with the updated page number and fetch the articles
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${nextPage}&pageSize=${props.pageSize}`;
        let data = await fetch(url);
        // Parse the response data from the API and store it in parsedData variable
        let parsedData = await data.json()
        // Concatenate new articles to existing articles array to display them on the page. This is necessary because the API returns a new array of articles for each page.
        setArticles(articles.concat(parsedData.articles));
        // If no new articles were returned, set totalResults to current length to stop infinite scroll
        if (parsedData.articles.length === 0) {
            setTotalResults(articles.length)
        } else {
            setTotalResults(parsedData.totalResults)
        }
    };

    return (
        <>
            <h1 className="text-center" style={{ margin: '35px 0px', marginTop: '90px' }}>NewsApp - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
            {loading && <Spinner />}
            <InfiniteScroll
                dataLength={articles.length}
                next={fetchMoreData}
                hasMore={articles.length < totalResults}
                loader={<Spinner />}
                endMessage={
                    <p style={{ textAlign: 'center', margin: '20px 0' }}>
                        <b>You have seen all articles for this category.</b> <br /> <b>Please try another category.</b> <br /> <b>Or check back later for more articles.</b>
                    </p>
                }
            >
                <div className="container">

                    <div className="row">
                        {articles.map((element) => {
                            return <div className="col-md-4" key={element.url}>
                                <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                            </div>
                        })}
                    </div>
                </div>
            </InfiniteScroll>
        </>
    )

}


News.defaultProps = {
    country: 'us',
    pageSize: 10,
    category: 'general',
}

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
}

export default News