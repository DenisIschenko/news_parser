import React from 'react'
import { Card, CardContent, Typography } from '@mui/material'

function NewsCard({ title, published_at, onClick }) {
    return (
        <Card sx={{ mb: 2 }} onClick={onClick}>
            <CardContent>
                <Typography variant="h6">{title}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {published_at}
                </Typography>
            </CardContent>
        </Card>

    )
}

export default NewsCard