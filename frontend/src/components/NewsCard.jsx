import React from 'react'
import { Card, CardContent, Typography } from '@mui/material'

function NewsCard({ title, published_at, created_at, onClick }) {
    return (
        <Card sx={{ mb: 2 }} onClick={onClick}>
            <CardContent>
                <Typography variant="h6">{title}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {new Date(published_at).toLocaleDateString('uk-UA', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    })} / {new Date(created_at).toLocaleDateString('uk-UA', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </Typography>
            </CardContent>
        </Card>

    )
}

export default NewsCard