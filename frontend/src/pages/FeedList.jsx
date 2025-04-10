import React, {useEffect, useState} from 'react'
import {
    Box,
    CircularProgress,
    Pagination,
    Typography,
} from '@mui/material'
import axios from 'axios'
import NewsCard from '../components/NewsCard'
import CategorySelect from '../components/CategorySelect'
import NewsModal from '../components/NewsModal'

function FeedList() {
    const [feeds, setFeeds] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [count, setCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [selectedNews, setSelectedNews] = useState(null)
    const [openModal, setOpenModal] = useState(false)
    const PAGE_SIZE = 20

    const fetchFeeds = async (url = 'http://localhost:8000/api/news/') => {
        try {
            setLoading(true)
            const res = await axios.get(url)
            setFeeds(res.data.results)
            setCount(res.data.count)
        } catch (err) {
            console.error('Помилка завантаження новин:', err)
        } finally {
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/categories/')
            setCategories(res.data)
        } catch (err) {
            console.error('Помилка завантаження категорій:', err)
        }
    }

    useEffect(() => {
        console.log('initial fetch')
        fetchFeeds()
        fetchCategories()
    }, [currentPage])

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        setCurrentPage(1)
        const url = category
            ? `http://localhost:8000/api/news/category/${category}/?page=1`
            : 'http://localhost:8000/api/news/?page=1';
        console.log('handleCategoryChange', url)
        fetchFeeds(url);
    };

    const handlePageChange = (_, page) => {
        setCurrentPage(page)
        const base = selectedCategory
            ? `http://localhost:8000/api/news/category/${selectedCategory}/?page=${page}`
            : `http://localhost:8000/api/news/?page=${page}`
        console.log('handlePageChange', base)
        fetchFeeds(base)
    }
    const handleOpenModal = (news) => {
        console.log('click on news', news)
        setSelectedNews(news)
        setOpenModal(true)
    }

    const handleCloseModal = () => {
        setSelectedNews(null)
        setOpenModal(false)
    }

    return (
        <Box sx={{padding: 4}}>
            <Typography variant="h4" gutterBottom>
                Новини
            </Typography>

            <CategorySelect
                categories={categories}
                selectedCategory={selectedCategory}
                onChange={handleCategoryChange}
            />

            {loading ? (
                <CircularProgress/>
            ) : (
                <>
                    {feeds.map((feed) => (
                        <NewsCard
                            key={feed.id}
                            title={feed.title}
                            published_at={feed.published_at}
                            onClick={() => handleOpenModal(feed)} // додаємо onClick для відкриття
                        />
                    ))}
                    <NewsModal open={openModal} onClose={handleCloseModal} news={selectedNews} />

                    <Box sx={{mt: 4, display: 'flex', justifyContent: 'center'}}>
                        <Pagination
                            count={Math.ceil(count / PAGE_SIZE)}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>
                </>
            )}
        </Box>
    )
}

export default FeedList