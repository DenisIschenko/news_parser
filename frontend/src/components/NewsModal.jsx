import React from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material'

function NewsModal({ open, onClose, news }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{news?.title}</DialogTitle>
            <DialogContent>
                <Typography variant="body1" color="text.primary" paragraph>
                    {news?.content}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    {news?.source}
                </Typography>
                {news?.url && (
                    <Typography variant="body2" color="primary">
                        <a href={news?.url} target="_blank" rel="noopener noreferrer" style={{
                            color: 'inherit',  // Забезпечує адаптацію до теми
                            textDecoration: 'underline',
                        }}>
                            Перейти до статті
                        </a>
                    </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                    <b>Новина опублікована:</b> {news?.published_at}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <b>Новина додана:</b> {news?.created_at}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Закрити
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default NewsModal