import React, {useEffect, useState} from 'react'
import {Box, CircularProgress, IconButton, Pagination, TextField, Typography,} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
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
    const [searchQuery, setSearchQuery] = useState('')
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

        if (searchQuery && searchQuery.trim()) {
            const url = `http://localhost:8000/api/news/search/?q=${searchQuery}&page=${page}`
            console.log('handlePageChange with search', url)
            fetchFeeds(url)
            return
        }
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
    const handleSearch = async () => {
        setCurrentPage(1)
        if (!searchQuery.trim()) {
            fetchFeeds()
            return
        }

        const url = `http://localhost:8000/api/news/search/?q=${searchQuery}`;
        console.log('handleSearch', url)
        fetchFeeds(url);
    }

    return (
        <Box sx={{padding: 4}}>
            <Typography variant="h4" gutterBottom>
                Новини
            </Typography>

            <TextField
                label="Пошук"
                variant="outlined"
                fullWidth
                sx={{mb: 3}}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch()
                }}
                FilledInput={{
                    endAdornment: searchQuery && (
                        <IconButton onClick={() => {
                            setSearchQuery('');
                            fetchFeeds();
                        }}>
                            <ClearIcon/>
                        </IconButton>
                    ),
                }}
            />

            {!searchQuery && (
                <CategorySelect
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onChange={handleCategoryChange}
                />
            )}

            {loading ? (
                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <br/>
                    <CircularProgress/>
                </Box>
            ) : (
                <>

                    {feeds.map((feed) => (
                        <NewsCard
                            key={feed.id}
                            title={feed.title}
                            published_at={feed.published_at}
                            created_at={feed.created_at}
                            onClick={() => handleOpenModal(feed)} // додаємо onClick для відкриття
                        />
                    ))}
                    <NewsModal open={openModal} onClose={handleCloseModal} news={selectedNews}/>

                    {feeds.length === 0 ? (
                        <Typography variant="body1" color="text.secondary" sx={{mt: 2}}>
                            За вашим запитом нічого не знайдено.
                        </Typography>
                    ) : (
                        <Box sx={{mt: 4, display: 'flex', justifyContent: 'center'}}>
                            <Pagination
                                count={Math.ceil(count / PAGE_SIZE)}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Box>
                    )}
                </>
            )}
        </Box>
    )
}

export default FeedList